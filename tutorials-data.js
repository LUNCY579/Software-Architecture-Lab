// Authored tutorials, part 2 of 3: data modelling and event-driven state.

window.FIELD_GUIDE_TUTORIALS = window.FIELD_GUIDE_TUTORIALS || [];

window.FIELD_GUIDE_TUTORIALS.push(
  {
    id: "cqrs-and-event-sourcing",
    title: "CQRS and Event Sourcing, End to End",
    subtitle: "One write model, many read models, and a log you can replay after a bug.",
    track: "architecture",
    level: "Advanced",
    minutes: 40,
    modules: ["ch10", "decoding-ms", "ch02"],
    outcomes: [
      "Separate a write model from read models and state the consistency gap between them.",
      "Append events with optimistic concurrency instead of overwriting state.",
      "Build an idempotent projection with a checkpoint.",
      "Replay or rebuild a projection after a defect, without touching the write side.",
      "Decide when CQRS and event sourcing are the wrong choice.",
    ],
    blocks: [
      { type: "callout", tone: "key", title: "Two separate ideas", t: "CQRS is about separating the write path from the read path. Event sourcing is about storing changes as the source of truth. You can adopt either alone. Most teams that regret event sourcing adopted both at once, for a domain that only needed one." },

      { h: true, t: "1. The problem CQRS solves" },
      { t: "An order service must answer two very different questions. Writes: accept an order, reserve stock, apply a discount — they need transactions, invariants and current state. Reads: order history, spend by month, fulfilment queue — they need denormalised shapes, indexes and heavy filtering." },
      { t: "One table cannot be optimal for both. Add an index for the read and writes slow down; add a lock for the write and reads queue behind it. CQRS accepts the duplication: a normalised write model and one or more purpose-built read models fed by events." },
      { type: "flow", caption: "Write path and read paths", nodes: [
        { label: "Command", sub: "place order" },
        { label: "Write model", sub: "validate, enforce invariants" },
        { label: "Event log", sub: "append-only, ordered" },
        { label: "Projections", sub: "history, spend, queue" },
        { label: "Queries", sub: "read from projections" },
      ] },
      { type: "callout", tone: "warn", title: "The gap is now your API's problem", t: "Right after a write succeeds, the projection may not have it yet. Either the API returns the new version and the client waits for it, or the UI reads the write model for its own recent changes. Ignoring this produces 'I placed the order and it is not in my history' bug reports." },

      { h: true, t: "2. Appending events with optimistic concurrency" },
      { t: "State is derived; the log is the truth. Every aggregate carries a version, and an append only succeeds if the version you read is still the version on disk. That single constraint replaces row locks." },
      { c: true, t: `CREATE TABLE order_events (
  order_id     UUID        NOT NULL,
  version      INT         NOT NULL,
  event_type   TEXT        NOT NULL,
  payload      JSONB       NOT NULL,
  recorded_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (order_id, version)          -- the concurrency check
);

-- Append only if this is the next version. 0 rows affected = someone else won.
INSERT INTO order_events (order_id, version, event_type, payload)
VALUES ($1, $2, 'OrderPlaced', $3);` },
      { t: "Two concurrent writers both read version 7 and both try to insert version 8. The primary key rejects the second, the service retries by re-reading, and no lost update is possible. No SELECT FOR UPDATE, no distributed lock, and the same mechanism works across regions." },
      { t: "Load state by folding the events. With a few hundred events per aggregate this is trivial; beyond that, snapshot every N events and fold from the snapshot." },

      { h: true, t: "3. A projection that can be rebuilt" },
      { c: true, t: `-- Projection state + its own checkpoint, in the same database.
CREATE TABLE order_history (
  order_id    UUID PRIMARY KEY,
  customer_id UUID NOT NULL,
  total_cents BIGINT NOT NULL,
  status      TEXT NOT NULL,
  placed_at   TIMESTAMPTZ NOT NULL
);
CREATE TABLE projection_checkpoint (
  name       TEXT PRIMARY KEY,
  position   BIGINT NOT NULL
);

-- The consumer loop, in words:
-- 1. read events with position > checkpoint, ordered
-- 2. apply each one with an idempotent upsert
-- 3. advance the checkpoint in the SAME transaction as the upsert` },
      { t: "Step 3 is the part people skip. If the projection write commits but the checkpoint does not, the event is replayed — so the upsert must be idempotent. If the checkpoint commits but the write does not, the event is silently lost. One transaction, both writes." },

      { h: true, t: "4. Replay is the payoff — and the trap" },
      { t: "A discount calculation was wrong for three weeks. With event sourcing, you fix the handler and replay the log from the beginning into a new projection. No data repair script, no lost history." },
      { type: "compare",
        left: { title: "Replay, done safely", items: [
          "Build the new projection beside the old one, not over it.",
          "Compare row counts and a few known totals before switching reads.",
          "Throttle the consumer so replay does not starve live traffic.",
          "Keep the old projection until the new one has served traffic for a day.",
        ] },
        right: { title: "Replay, done dangerously", items: [
          "Truncating the live table and replaying in place: no rollback.",
          "Replaying while consumers are still writing to the same target.",
          "Assuming events are immutable while a migration rewrites them in place.",
          "Forgetting that external side effects (emails, payments) were already sent.",
        ] } },
      { t: "That last point is important: replay re-derives state, it does not re-send email. Side effects belong in a separate, non-replayed consumer with its own deduplication." },

      { h: true, t: "5. Evolving events without breaking history" },
      { t: "Events are a contract with your past. You cannot edit an old event to match new code. Add fields with defaults, keep old event types readable, and upcast on read." },
      { type: "steps", items: [
        "Additive change: a new optional field with a documented default. Old events still parse.",
        "Semantic change: introduce a new event type (OrderPlacedV2) and teach handlers both.",
        "Removal: stop writing a field, keep reading it, and only delete after every aggregate's history is outside the retention you care about.",
        "Upcasting: a translation layer at read time, tested against real historical payloads.",
      ] },

      { h: true, t: "6. When not to use this" },
      { type: "checklist", items: [
        "You need a simple CRUD admin screen: a table is cheaper and clearer.",
        "Nobody will ever ask 'how did this get into this state?' — the audit value is the main justification.",
        "Your team has no operational experience with consumers, offsets and replays.",
        "You cannot accept eventual consistency between write and read.",
        "Event volume is enormous and projections would be the bottleneck anyway.",
      ] },

      { type: "exercise", title: "Exercise: design the read side", prompt: "An order service emits OrderPlaced, OrderPaid, OrderShipped, OrderRefunded. Product wants (a) a customer order history page, (b) daily revenue by country, (c) a warehouse pick list of paid, unshipped orders. Design the projections and say what happens on replay.", hint: "One projection per access pattern. Think about what each needs to be keyed by and whether it is a full rebuild or an increment.", solution: "(a) order_history keyed by order_id, with customer_id indexed, updated by all four events. (b) revenue_daily keyed by (day, country), incremented on OrderPaid and decremented on OrderRefunded — an idempotent increment needs the event position stored per key, or recompute from a dedupe table. (c) pick_list keyed by order_id, inserted on OrderPaid, deleted on OrderShipped. On replay: all three rebuild from position zero; (b) must be recomputed rather than incremented blindly, or increments must be deduplicated by event id. Verify (b) against an independent SUM over order_events before switching." },

      { h: true, t: "7. Review checklist" },
      { type: "checklist", items: [
        "The write model's invariants are enforced in one place.",
        "Every append is version-checked; retries re-read first.",
        "Each projection has a checkpoint committed atomically with its writes.",
        "Query handlers tolerate being a few seconds behind.",
        "Replay has been run once, in staging, with a measurement.",
        "Side effects are outside the replayable path.",
      ] },
    ],
    quiz: [
      { q: "What enforces 'no lost updates' in an event-sourced aggregate?", a: "A unique constraint on (aggregate_id, version)", o: ["A unique constraint on (aggregate_id, version)", "A read lock on the table", "A distributed mutex", "Serializable isolation across regions"], why: "The append is rejected if the version already exists, so a concurrent writer must re-read and retry. It works the same way in one region or five." },
      { q: "Why must the projection checkpoint commit with the projection write?", a: "Otherwise an event is either lost or applied twice", o: ["Otherwise an event is either lost or applied twice", "To make the log append-only", "To avoid needing a primary key", "To enable snapshotting"], why: "Separate commits create a gap: write-then-crash loses the checkpoint, checkpoint-then-crash loses the write. One transaction makes the pair atomic, and idempotent upserts handle redelivery." },
      { q: "Replaying a projection re-sends welcome emails unless:", a: "Side effects are handled by a separate, deduplicated consumer", o: ["Side effects are handled by a separate, deduplicated consumer", "The log is compressed", "The projection has an index", "Events are upcast first"], why: "Replay re-derives state only. Anything that already left the system — email, payment, webhook — must live outside the replay path or be deduplicated by event id." },
      { q: "Which is a sign CQRS is the wrong tool?", a: "An admin CRUD screen with no read/write contention", o: ["An admin CRUD screen with no read/write contention", "A dashboard needing five denormalised views", "A domain requiring a full audit trail", "Read traffic 50× write traffic"], why: "CQRS pays for itself by resolving contention or enabling different read shapes. On a simple CRUD screen it adds a second model, a lag and a class of bugs for no benefit." },
    ],
  },

  {
    id: "schema-to-service",
    title: "From Domain Model to Service Schema",
    subtitle: "Constraints, indexes, tenancy and migrations — the parts that are expensive to change later.",
    track: "sql",
    level: "Intermediate",
    minutes: 35,
    modules: ["s-schema", "s-tips", "s-molt"],
    outcomes: [
      "Turn entities and relationships into tables with enforced invariants.",
      "Choose indexes from the queries, including composite, partial and covering ones.",
      "Isolate tenants with a column plus row-level security, not with application discipline.",
      "Ship a breaking schema change as three backward-compatible deploys.",
    ],
    blocks: [
      { type: "callout", tone: "key", title: "The schema is the only invariant that cannot be bypassed", t: "Every application bug, every script, every future service and every analyst goes through the same tables. A constraint written once holds forever; a validation rule written in one service is enforced until someone writes the second service." },

      { h: true, t: "1. Model first, then DDL" },
      { t: "Start from the nouns and the rules, not from a table list. For a course platform: a customer places orders; an order contains line items; each line item references a product; an order has a status that only moves forward." },
      { c: true, t: `CREATE TABLE orders (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID        NOT NULL,
  customer_id  UUID        NOT NULL REFERENCES customers(id),
  status       TEXT        NOT NULL
               CHECK (status IN ('pending','paid','shipped','cancelled')),
  total_cents  BIGINT      NOT NULL CHECK (total_cents >= 0),
  placed_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  shipped_at   TIMESTAMPTZ,
  CONSTRAINT shipped_needs_date
    CHECK (status <> 'shipped' OR shipped_at IS NOT NULL)
);

CREATE TABLE order_items (
  order_id     UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  line_no      INT  NOT NULL,
  product_id   UUID NOT NULL REFERENCES products(id),
  quantity     INT  NOT NULL CHECK (quantity > 0),
  unit_cents   BIGINT NOT NULL CHECK (unit_cents >= 0),
  PRIMARY KEY (order_id, line_no)
);` },
      { t: "Three rules are now guaranteed regardless of client: status is one of four values, a shipped order has a delivery date, and no line has a non-positive quantity. Each of those is a bug class you will never debug." },
      { type: "callout", tone: "warn", title: "Constraints have a cost", t: "Every CHECK and foreign key is work on the write path, and a foreign key takes a shared lock on the referenced row. At very high write rates, teams move checks into the application deliberately — and then must accept that a bug becomes corrupt data. Make that trade explicitly." },

      { h: true, t: "2. Indexes come from queries, not from columns" },
      { t: "Write the five queries that matter, then index for them. For 'recent paid orders for a customer', the index is (tenant_id, customer_id, placed_at DESC) with a partial predicate on status." },
      { c: true, t: `-- Partial + composite: only rows the query needs, in the query's order.
CREATE INDEX orders_customer_recent
  ON orders (tenant_id, customer_id, placed_at DESC)
  WHERE status = 'paid';

-- Covering: the query never touches the table.
CREATE INDEX order_items_by_product
  ON order_items (product_id) INCLUDE (quantity, unit_cents);` },
      { t: "Column order is not cosmetic. A composite index is usable from its leftmost column: (tenant_id, customer_id) serves a query filtering on tenant alone, but (customer_id, tenant_id) does not. Put equality columns first, then the range or sort column." },
      { t: "Then read the plan. If EXPLAIN ANALYZE shows a sequential scan on a large table, either the index does not match the predicate or the planner decided the predicate is not selective enough — and adding another index will not change that." },

      { h: true, t: "3. Tenancy: make the leak impossible" },
      { t: "A tenant_id column plus a WHERE clause in every query works until one query forgets it. Row-level security moves the check into the database, where a forgotten clause returns nothing instead of someone else's data." },
      { c: true, t: `ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY orders_tenant_isolation ON orders
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- The application sets the tenant per connection/transaction:
-- SET LOCAL app.tenant_id = '...';` },
      { t: "Two operational notes. The setting must be set per transaction, not once per pooled connection, or a reused connection inherits the previous tenant. And policies should be tested with an automated cross-tenant read that must return zero rows." },

      { h: true, t: "4. Migrations as three deploys" },
      { t: "Renaming a column is a breaking change if old code and new code ever run at the same time — which they always do during a rolling deploy. Expand/contract removes the breakage." },
      { type: "steps", items: [
        "Expand: add the new column or table, nullable, with a backfill job. Old code ignores it; new code writes to both.",
        "Migrate: deploy code that reads the new column and still writes both. Verify the backfill is complete and monitors are clean.",
        "Contract: deploy code that only knows the new column, then drop the old one in a later migration.",
      ] },
      { type: "callout", tone: "tip", title: "Never mix DDL and data backfill in one transaction", t: "A long backfill holds locks and blocks writes. Add the column, commit, backfill in batches with a throttle, then add the NOT NULL and the index concurrently." },

      { type: "exercise", title: "Exercise: design the matchmaking queue table", prompt: "A game needs a queue of waiting players: skill rating, region, party size, enqueue time. Matches pull 10 players from one region within a rating band. Design the table and the index that makes the pull cheap, then say what happens at 50k queued players.", hint: "Equality first (region), then range (rating), and think about how rows leave the table.", solution: "Table queue_entries(id, player_id, party_id, region, rating, party_size, enqueued_at, expires_at), unique on player_id so a player cannot double-queue, check on party_size. Index (region, rating, enqueued_at) so the matcher scans a narrow band per region. Rows are deleted on match, so the table stays proportional to queue depth, not history. At 50k queued, the matcher should not scan: it seeks to a rating band, reads ~100 candidates, and expands the band over time; expired rows are removed by TTL or a sweeper, and regional sharding keeps each matcher's working set small." },

      { h: true, t: "5. Review checklist" },
      { type: "checklist", items: [
        "Every invariant has a constraint or a documented reason it cannot.",
        "Each index maps to a named query; unused indexes are removed.",
        "Tenant isolation is enforced below the application and tested cross-tenant.",
        "Schema changes are expand/contract, with the backfill throttled.",
        "Plans are reviewed for the top queries after every schema change.",
      ] },
    ],
    quiz: [
      { q: "Which index serves WHERE tenant_id = ? AND customer_id = ? ORDER BY placed_at DESC?", a: "(tenant_id, customer_id, placed_at DESC)", o: ["(tenant_id, customer_id, placed_at DESC)", "(placed_at DESC, customer_id, tenant_id)", "(customer_id, placed_at DESC)", "(tenant_id, placed_at DESC, customer_id)"], why: "Equality columns first in any order, then the sort column. The leftmost-prefix rule makes the other orderings unusable for this predicate." },
      { q: "Row-level security helps mainly because:", a: "A forgotten WHERE clause returns nothing instead of another tenant's rows", o: ["A forgotten WHERE clause returns nothing instead of another tenant's rows", "It makes queries faster", "It removes the need for indexes", "It encrypts the data"], why: "The policy is applied by the database to every query, including ad-hoc and future services. It converts a data breach into a bug report." },
      { q: "In expand/contract, why add the new column as nullable first?", a: "Old code is still running during the rolling deploy", o: ["Old code is still running during the rolling deploy", "Nullable columns are faster", "It avoids needing a backfill", "It prevents index bloat"], why: "A NOT NULL column with no default breaks inserts from the old version still serving traffic. Expand, backfill, switch reads, then enforce and contract." },
      { q: "A partial index on WHERE status = 'paid' is useful because:", a: "It only indexes the rows that queries actually filter on", o: ["It only indexes the rows that queries actually filter on", "It indexes every column automatically", "It avoids table locks", "It enforces the check constraint"], why: "Smaller index, less write amplification, faster scans — but only for queries whose predicate matches the index's WHERE clause." },
    ],
  }
);
