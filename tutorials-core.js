// Authored tutorials, part 1 of 3: consistency, caching and resilience.
// Each tutorial is original teaching prose built on the source library.
// Block types: {h}, {t}, {c}, callout, table, flow, compare, exercise, checklist.

window.FIELD_GUIDE_TUTORIALS = window.FIELD_GUIDE_TUTORIALS || [];

window.FIELD_GUIDE_TUTORIALS.push(
  {
    id: "consistency-and-quorums",
    title: "Consistency, CAP and Quorum Arithmetic",
    subtitle: "Stop reciting CAP. Compute what your replication setting actually guarantees.",
    track: "architecture",
    level: "Intermediate",
    minutes: 35,
    modules: ["ch01", "ch08", "aws-book"],
    outcomes: [
      "Explain CAP as a statement about partitions, not about everyday operation.",
      "Choose N, W and R for a stated failure tolerance.",
      "Compute the latency and tail-amplification cost of a quorum read.",
      "Give a session guarantee (read-your-writes) without demanding strong consistency everywhere.",
    ],
    blocks: [
      { type: "callout", tone: "key", title: "The one-sentence version", t: "CAP says: while the network is split, a replica set must either refuse some requests (consistency) or answer with possibly stale data (availability). It says nothing about the 99.99% of the time when the network is healthy — that is what PACELC adds." },

      { h: true, t: "1. The model most teams actually need" },
      { t: "A distributed data store holds N replicas of each key. A write must be acknowledged by W replicas before it is considered successful. A read contacts R replicas and returns the freshest value it sees. Those three numbers, not the marketing page, define your guarantees." },
      { type: "table", caption: "What each choice buys and costs", head: ["Setting", "Guarantee", "Failure tolerated", "Cost"], rows: [
        ["N=3, W=3, R=1", "Strong reads, but writes need every replica", "No write during any node failure", "Fragile availability; fastest reads"],
        ["N=3, W=2, R=2", "Strong (R+W>N); survives one node loss", "1 node down for both reads and writes", "Two round trips per operation"],
        ["N=3, W=1, R=1", "Eventual; a read may miss the latest write", "2 nodes down", "Fast, but stale reads are visible"],
        ["N=5, W=3, R=3", "Strong; survives two node losses", "2 nodes down", "More coordination, higher tail"],
      ] },
      { t: "The overlap rule is the whole trick. If R + W > N, the read set and the most recent write set must share at least one replica, so at least one node in the read can return the newest value. With N=3, W=2, R=2 the sum is 4: at least one node is in both sets." },
      { type: "callout", tone: "warn", title: "Strong on paper, weak in practice", t: "Quorum overlap only gives you strong consistency if the write is applied to those replicas atomically, if read repair or anti-entropy resolves older versions, and if the client reads the maximum version it receives. A sloppy client that returns the first response breaks the guarantee while the configuration still looks correct." },

      { h: true, t: "2. Worked example: sizing a quorum" },
      { t: "Your product promise: a profile write must never be lost, and the store must keep serving while one node is being patched. Start from the failure tolerance, not from a vendor default." },
      { type: "steps", items: [
        "Pick N from the durability requirement. Two copies of a write means losing a node costs nothing; N=3 is the smallest set that tolerates one loss and still has a majority.",
        "Pick W from the write-availability requirement. Tolerating one failure needs W=2 of 3.",
        "Solve R from R+W>N. With N=3 and W=2, R must be at least 2.",
        "Sanity-check read latency: R=2 means the read waits for the slower of two replicas, not for one.",
        "Write down which failure you just gave up. Here: two simultaneous node failures stop writes.",
      ] },
      { t: "Now change the requirement. If the profile is a public page that may be a few seconds stale, W=2 and R=1 is enough: writes survive a node loss, reads are served by one replica, and the page may show an older name briefly. Same cluster, different API, different guarantee — that is the normal answer. Consistency is a per-operation decision, not a property of the database." },

      { h: true, t: "3. The cost you did not budget: tail amplification" },
      { t: "A quorum read against 3 replicas takes as long as the second-fastest replica. Fan-out changes the shape of the latency distribution in a way that surprises people: the cluster p99 is not the node p99." },
      { type: "callout", tone: "note", title: "Why p99 becomes p99.8", t: "If each replica independently exceeds x with probability 1%, the chance that at least one of five replicas exceeds x is 1 - 0.99^5 = 4.9%. So the p99 of the fan-out is roughly the per-node p99.8. To promise a cluster p99 you need per-node tails far better than the target." },
      { t: "This is the argument for hedged requests: send to one replica, and after the p95 delay send the same read to a second and take the first answer. Cost: extra load. Benefit: the tail of the fan-out collapses toward the tail of a single replica." },

      { h: true, t: "4. Session guarantees: the cheap way to look consistent" },
      { t: "Most user-visible staleness is not a database problem — it is a routing problem. A user writes their display name and then reloads the page; the load balancer sends the read to a replica that has not caught up. The database is behaving exactly as configured." },
      { type: "compare",
        left: { title: "Read-your-writes, cheaply", items: [
          "Route a user's reads to the same replica that took their write, for a short window.",
          "Return the write's logical timestamp and require the read replica to be at least that fresh.",
          "Serve the user their own just-written value from a short-lived client cache.",
        ] },
        right: { title: "Read-your-writes, expensively", items: [
          "Send all reads to the primary: simple, and it removes the read scaling you built.",
          "Switch the whole cluster to strong consistency: correct, and it pays coordination on every unrelated read.",
        ] } },
      { t: "Monotonic reads matter too: a user should never see their name change back to an older value as they move between replicas. Sticky routing per session solves both problems at once and is the reason session affinity still exists in front of eventually consistent stores." },

      { type: "exercise", title: "Exercise: three APIs, three settings", prompt: "You run one 5-replica store. Choose W and R, and name the guarantee you give up, for: (a) a bank ledger entry, (b) a product catalogue page, (c) a shopping cart that must not lose an item the user just added but may show a stale price.", hint: "Start from the failure you must survive, then from the staleness the user would notice. The cart is the interesting one: it needs read-your-writes, not global strong consistency.", solution: "(a) N=5, W=3, R=3: survives two failures, R+W>N, ledger reads never stale. You give up write availability under three simultaneous failures and pay two round trips. (b) N=5, W=3, R=1: catalogue pages tolerate seconds of staleness; reads are single-replica and cacheable. You give up freshness, not durability. (c) N=5, W=3, R=1 plus a session token: the cart write returns its version, and the user's next read is served by a replica at least that fresh, or from their session cache. You get read-your-writes without strong consistency for everyone else." },

      { h: true, t: "5. Checklist before you claim a consistency model" },
      { type: "checklist", items: [
        "Every read and write path has explicit N, W and R, or an explicit reason to inherit the default.",
        "You can name the failure that stops writes, and whether that is acceptable.",
        "Client libraries return the newest version, not the first response.",
        "Read-your-writes is solved at the session layer for user-facing writes.",
        "You have measured fan-out tail latency, not just per-node latency.",
        "The write path is idempotent, because retries after a timeout are inevitable.",
      ] },
    ],
    quiz: [
      { q: "With N=5, W=2 and R=2, what does a read guarantee?", a: "Nothing about freshness", o: ["Nothing about freshness", "The latest write", "Two-failure tolerance for strong reads", "Serializable isolation"], why: "R+W=4 is not greater than N=5, so the read and write sets need not overlap. Writes survive three node failures and reads are cheap, but a read may miss the newest write." },
      { q: "Why does a read against 5 replicas have a worse p99 than a read against 1?", a: "It waits for the slowest of several responses", o: ["It waits for the slowest of several responses", "It uses more CPU per request", "It bypasses the cache", "It requires a quorum of writes"], why: "Fan-out makes the request as slow as the slowest participant, so the cluster tail is the per-node extreme tail — the p99 of the maximum is roughly the per-node p99.8." },
      { q: "A user saves a new avatar and immediately sees the old one. The most likely cause is:", a: "The read hit a replica that had not caught up", o: ["The read hit a replica that had not caught up", "The write was lost", "The quorum was too large", "The index was stale"], why: "This is the classic read-your-writes gap. The write succeeded; the follow-up read was routed to a lagging replica. Session affinity or a version token fixes it without changing cluster-wide consistency." },
      { q: "Which setting gives the fastest reads while still surviving one node failure for writes?", a: "N=3, W=2, R=1", o: ["N=3, W=2, R=1", "N=3, W=3, R=1", "N=3, W=2, R=2", "N=5, W=3, R=3"], why: "W=2 of 3 tolerates one failure, and R=1 contacts a single replica. The trade is that reads may be stale, since R+W=3 is not greater than N." },
    ],
  },

  {
    id: "caching-in-practice",
    title: "Caching in Practice: Hit Ratios, Eviction and Stampedes",
    subtitle: "Decide with arithmetic whether a cache is worth it — and how it will fail.",
    track: "architecture",
    level: "Intermediate",
    minutes: 30,
    modules: ["aws-book", "ch11", "s-tips"],
    outcomes: [
      "Compute the latency benefit and break-even hit ratio of a cache.",
      "Choose an eviction policy that matches the workload's access pattern.",
      "Pick an invalidation strategy and state its staleness window.",
      "Prevent a cache stampede from turning a cold cache into an outage.",
    ],
    blocks: [
      { type: "callout", tone: "key", title: "Caches are a bet on locality", t: "A cache only helps if the same data is requested again before it changes. If your access pattern has no reuse, a cache adds a lookup, a copy and an invalidation bug for nothing." },

      { h: true, t: "1. Where the cache sits decides what it can fix" },
      { type: "table", head: ["Layer", "Typical hit ratio", "What it removes", "What it cannot fix"], rows: [
        ["Browser / client", "50-80% for repeat visits", "The whole request", "First visit, cross-device, personalised data"],
        ["CDN / edge", "80-99% for static assets", "Network distance and origin load", "Anything user-specific unless keyed carefully"],
        ["Application (Redis, memcached)", "70-95% for hot reads", "Database round trips", "Consistency; it adds a second source of truth"],
        ["Database buffer pool", "Workload dependent", "Disk reads", "Query planning cost, connection limits"],
      ] },
      { t: "Choose the layer by the cost you are trying to remove. A CDN cannot fix a slow join, and an application cache cannot fix a 400 ms cross-continent round trip." },

      { h: true, t: "2. The arithmetic that justifies (or kills) the cache" },
      { t: "Let h be the hit ratio, L_cache the cache latency and L_origin the origin latency. Average latency is h·L_cache + (1-h)·L_origin. Set that equal to your target and solve for h to get the break-even ratio." },
      { type: "callout", tone: "note", title: "Worked: 90/10 at 2 ms and 120 ms", t: "0.9 × 2 + 0.1 × 120 = 13.8 ms, against 120 ms uncached — an 8.7× improvement. Break-even for a 20 ms target: h × 2 + (1-h) × 120 < 20 gives h > 84.7%. Below that hit ratio the cache is not buying you the latency you promised." },
      { t: "Capacity follows the same logic. Suppose the table is 40 GB, and 20% of rows serve 80% of requests. An 8 GB cache can hold that hot set; the expected hit ratio is near 80%, not 100%, because the remaining 20% of requests touch cold rows that will always miss. Size for the working set, not for the table." },

      { h: true, t: "3. Read and write patterns" },
      { type: "table", head: ["Pattern", "How it works", "Staleness window", "Use when"], rows: [
        ["Cache-aside", "App reads cache, on miss reads origin and populates", "Until TTL or explicit invalidation", "Default for read-heavy data"],
        ["Read-through", "Cache library loads from origin on miss", "Same as cache-aside", "You want the logic in one place"],
        ["Write-through", "Write to cache and origin together", "None, if the write is atomic", "Reads must never see old data"],
        ["Write-behind", "Write to cache, flush to origin later", "Until flush", "Write-heavy, loss-tolerant data"],
        ["Refresh-ahead", "Refresh hot keys before expiry", "Near zero", "Predictable hot keys, latency-critical reads"],
      ] },
      { type: "callout", tone: "warn", title: "The two hard problems, restated", t: "Invalidation is hard because the cache does not know why the data changed. A write path that forgets one of five update routes leaves a stale entry until TTL. Versioned keys (user:42:v7) make invalidation a pointer swap, at the cost of garbage you must collect." },

      { h: true, t: "4. Eviction: pick for the access pattern, not by habit" },
      { type: "compare",
        left: { title: "Good fits", items: [
          "LRU: recency-dominated traffic such as sessions and feeds.",
          "LFU: stable popularity, where a one-off scan should not evict hot keys.",
          "TTL-only: data with a natural lifetime, such as tokens or price quotes.",
          "Allowlist: never cache the paths that must always be correct (balances, permissions).",
        ] },
        right: { title: "Common mistakes", items: [
          "LRU in front of a nightly full scan: the scan evicts everything useful.",
          "Unbounded cache: it becomes a memory leak with a hit ratio.",
          "No metric on evictions: you cannot tell 'too small' from 'wrong policy'.",
          "Caching authorisation decisions with no invalidation on role change.",
        ] } },
      { t: "Belady's optimal policy — evict the item whose next use is furthest away — is not implementable online, but it is the right benchmark. If your measured hit ratio is close to Belady's for a trace, your policy is fine and the cache is simply too small." },

      { h: true, t: "5. Stampedes, and the math that prevents them" },
      { t: "Ten thousand requests per second hit a key with a 60-second TTL. If the key expires everywhere at once, all 10,000 requests miss in the same instant and the origin receives 10,000 queries for one row. It was handling 167 per second." },
      { type: "steps", items: [
        "Jitter the TTL: store ttl = base + random(0, base × 0.2). Expiries spread across a 12-second window, cutting the burst by an order of magnitude.",
        "Coalesce misses: the first request takes a per-key lock and recomputes; the rest wait briefly and read the fresh value.",
        "Serve stale while revalidating: return the expired value immediately and refresh in the background. Staleness is bounded by the refresh time, not the TTL.",
        "Add a negative cache for missing keys, with a short TTL, so a request for a nonexistent id does not hammer the origin.",
        "Warm the cache after deploys and before known traffic spikes, rather than letting the first users warm it.",
      ] },
      { type: "exercise", title: "Exercise: is the cache worth it?", prompt: "Origin latency is 200 ms p50, cache lookup is 5 ms. Product wants p50 under 50 ms. Your measured hit ratio is 78%. Does the cache meet the target, and what would you change?", hint: "Compute the average, then the break-even hit ratio for the target.", solution: "Average = 0.78 × 5 + 0.22 × 200 = 3.9 + 44 = 47.9 ms, so it just meets the target. Break-even for 50 ms: 5h + 200(1-h) < 50 gives h > 76.9%. At 78% you have almost no margin — one traffic shift defeats the promise. Options: raise the hit ratio with a larger cache or better key design, cut origin latency for misses, or use stale-while-revalidate so misses are cheap instead of slow." },

      { h: true, t: "6. Operating a cache" },
      { type: "checklist", items: [
        "Hit ratio, evictions and miss latency are on a dashboard, per key family.",
        "Every cached entity has a stated maximum staleness.",
        "Writes invalidate through one code path, not five.",
        "Keys are versioned or namespaced so a schema change cannot serve old shapes.",
        "A cold cache is tested: can the origin survive 100% miss traffic?",
        "Sensitive data is not cached in shared layers without per-user keying.",
      ] },
    ],
    quiz: [
      { q: "Cache hit ratio is 80%, cache latency 2 ms, origin 120 ms. Average latency is:", a: "25.6 ms", o: ["25.6 ms", "24 ms", "96 ms", "61 ms"], why: "0.8 × 2 + 0.2 × 120 = 1.6 + 24 = 25.6 ms. The miss path dominates because misses are 20% of traffic paying 120 ms." },
      { q: "Why does adding random jitter to TTLs reduce origin load?", a: "It spreads expiries so keys do not miss simultaneously", o: ["It spreads expiries so keys do not miss simultaneously", "It makes entries live longer", "It increases the hit ratio directly", "It removes the need for invalidation"], why: "Synchronised expiry turns a steady miss rate into a burst. Jitter flattens the burst back into the steady rate the origin was sized for." },
      { q: "A nightly job scans the whole table through a cache using LRU. The likely result is:", a: "Hot keys are evicted and the hit ratio collapses", o: ["Hot keys are evicted and the hit ratio collapses", "The scan gets faster and nothing else changes", "The origin load drops", "LRU converts into LFU"], why: "A full scan touches every key once, and LRU treats each as the most recent. Useful hot entries are pushed out, so the next real traffic misses. LFU or a separate cache for scans avoids this." },
      { q: "Which data should be allowlisted out of the cache entirely?", a: "Balances and permission checks", o: ["Balances and permission checks", "Product descriptions", "Rendered CSS and images", "Public user profiles"], why: "Some reads must always be correct or must reflect a change immediately. Caching them turns every invalidation bug into a financial or security incident." },
    ],
  },

  {
    id: "resilience-patterns",
    title: "Resilience Patterns That Actually Hold",
    subtitle: "Timeouts, retries, breakers and bulkheads, sized with numbers instead of hope.",
    track: "architecture",
    level: "Intermediate",
    minutes: 35,
    modules: ["ch10", "ch02", "s-large"],
    outcomes: [
      "Derive per-call timeouts from an endpoint SLO.",
      "Compute retry amplification and bound it.",
      "Implement a circuit breaker with explicit states and thresholds.",
      "Isolate dependencies with bulkheads and degrade deliberately.",
    ],
    blocks: [
      { type: "callout", tone: "key", title: "The goal is not zero failures", t: "It is a bounded, predictable failure. A service that returns a stale answer in 30 ms is healthy under stress; one that holds 2,000 threads waiting 30 seconds is down, and it takes its callers with it." },

      { h: true, t: "1. Timeouts come from a budget, not from a default" },
      { t: "Write the endpoint's latency budget first, then divide it. A product page has a 800 ms p99 target. The handler needs 100 ms for its own work, and calls three dependencies sequentially: recommendations, inventory, pricing." },
      { type: "table", head: ["Step", "Budget", "Rule"], rows: [
        ["Handler own work", "100 ms", "Fixed cost"],
        ["Inventory (must be correct)", "250 ms", "Hard dependency: fail the page if exceeded"],
        ["Pricing (must be correct)", "250 ms", "Hard dependency"],
        ["Recommendations (nice to have)", "150 ms", "Soft dependency: on timeout, render without it"],
        ["Remaining slack", "50 ms", "Absorbs GC, network jitter, TLS handshakes"],
      ] },
      { t: "Two design rules fall out of the table. First, a timeout longer than the caller's remaining budget is wasted waiting: the caller has already given up, so the callee is doing work nobody will read. Second, soft dependencies should time out earlier and degrade, not fail the request." },

      { h: true, t: "2. Retries multiply load — compute by how much" },
      { t: "If a call fails with probability p and you attempt it A times, the expected number of calls per logical request is (1 - p^A) / (1 - p). That is your load multiplier against a failing dependency." },
      { type: "table", head: ["Failure rate", "Attempts", "Load multiplier", "Effective failure rate"], rows: [
        ["20%", "3", "1.24×", "0.8%"],
        ["50%", "3", "1.75×", "12.5%"],
        ["50%", "5", "1.94×", "3.1%"],
        ["90%", "5", "4.10×", "0.01% but the dependency is gone"],
      ] },
      { type: "callout", tone: "warn", title: "Three layers of retries is 27 calls", t: "If the gateway retries 3 times, the service retries 3 times, and the client retries 3 times, one user action can become 27 backend calls — precisely when the backend is already failing. Retry at one layer only, and make that layer's budget global." },
      { t: "Retries also require idempotency. A timeout does not mean the write failed; it means you do not know. Without an idempotency key, the retry creates a second order." },

      { h: true, t: "3. Backoff with jitter, in code" },
      { c: true, t: `// Full jitter: sleep = random(0, min(cap, base * 2^attempt))
// The randomness is not decoration — it prevents synchronised retry storms.
async function withRetry(fn, { attempts = 3, base = 100, cap = 2000 } = {}) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn({ attempt });
    } catch (err) {
      lastError = err;
      if (!err.retryable) throw err;          // 4xx: retrying cannot help
      const ceiling = Math.min(cap, base * 2 ** attempt);
      await sleep(Math.random() * ceiling);
    }
  }
  throw lastError;
}` },
      { t: "Note what the code refuses to do: retry non-retryable errors, retry forever, or retry without a cap. A retry loop that ignores those three rules is a self-inflicted denial of service." },

      { h: true, t: "4. Circuit breakers: fail fast, recover carefully" },
      { type: "flow", caption: "Breaker state machine", nodes: [
        { label: "Closed", sub: "calls flow; count failures in a rolling window" },
        { label: "Open", sub: "fail immediately for a cooldown; no calls leave" },
        { label: "Half-open", sub: "allow a few trial calls" },
        { label: "Closed", sub: "trials succeed; reset counters" },
      ] },
      { t: "Thresholds matter more than the pattern. A breaker that opens after 3 failures out of 10 will flap on normal noise. Use a ratio over a minimum sample: open when error rate exceeds 50% with at least 20 requests in 30 seconds, cool down for 10 seconds, then allow 3 trial requests." },
      { type: "callout", tone: "tip", title: "Breakers protect the caller, not the callee", t: "The point is to stop your threads, connections and memory being consumed by calls that cannot succeed. It does nothing for the failing service — that needs load shedding and backpressure on its side." },

      { h: true, t: "5. Bulkheads: bound the blast radius" },
      { t: "A service pool of 100 database connections shared by three features is one pool with three ways to die. Give each feature its own slice: 60 for the interactive path, 25 for background jobs, 15 for admin tools. When the nightly job saturates its 25, users still have 60." },
      { t: "The same idea applies to thread pools per dependency, separate queues per tenant, and separate clusters per customer tier. You are choosing who gets hurt first, deliberately, instead of letting arrival order decide." },

      { h: true, t: "6. Degrade on purpose" },
      { type: "table", head: ["Dependency fails", "Bad response", "Good response"], rows: [
        ["Recommendations", "Whole page errors", "Render page without the carousel"],
        ["Avatar service", "Grey broken images", "Default avatar, retry in background"],
        ["Live inventory count", "Stale 'in stock' promise", "Show 'check availability' instead"],
        ["Pricing", "Page shows old price", "Fail the page: wrong money is worse than no page"],
      ] },
      { t: "Write this table down before the incident. Deciding under pressure which data may be stale is how teams ship a financial bug." },

      { type: "exercise", title: "Exercise: size the defences", prompt: "Your API calls a payments provider. p99 is 1.2 s, the endpoint SLA is 2 s, and the provider has had two 20-minute outages this quarter. Design timeout, retry, breaker and fallback.", hint: "Ask what a duplicate charge costs versus a failed checkout, and what the user should see during an outage.", solution: "Timeout 1.5 s (inside the 2 s budget, above the provider p99 so normal traffic completes). One retry, only for timeouts and 5xx, with an idempotency key so a duplicate cannot charge twice — effective failure rate falls from ~1% to ~0.01% while load rises ~1.01×. Breaker: open at 50% errors over 20 requests in 30 s, 10 s cooldown, 3 half-open trials. Fallback: queue the payment attempt and show 'processing', never a fake success — a wrong charge is worse than a delayed one. Alert on open breaker, not just on errors." },

      { h: true, t: "7. Review checklist" },
      { type: "checklist", items: [
        "Every outgoing call has an explicit timeout below the caller's remaining budget.",
        "Retries happen at one layer, with a cap, jitter, and idempotency.",
        "Breakers use a ratio with a minimum sample, not a raw failure count.",
        "Connection and thread pools are partitioned by feature or tenant.",
        "Each soft dependency has a written degraded mode.",
        "Dashboards show open breakers, retry rate and pool saturation.",
      ] },
    ],
    quiz: [
      { q: "The endpoint budget is 500 ms and the callee's timeout is 2 s. The problem is:", a: "The caller gives up long before the callee stops working", o: ["The caller gives up long before the callee stops working", "The timeout is too short to be safe", "Timeouts should be identical everywhere", "The callee will retry too often"], why: "A timeout longer than the caller's remaining budget wastes the callee's capacity on responses nobody will read. Timeouts should shrink as they go down the call chain." },
      { q: "At 50% failure, 5 attempts give roughly what load multiplier?", a: "1.94×", o: ["1.94×", "5×", "2.5×", "1.05×"], why: "(1 - 0.5^5)/(1 - 0.5) = (1 - 0.03125)/0.5 = 1.94. Retries roughly double the load on an already failing dependency while cutting the user-visible failure rate to about 3%." },
      { q: "A circuit breaker primarily protects:", a: "The caller's resources", o: ["The caller's resources", "The failing service", "The database schema", "The cache hit ratio"], why: "It stops the caller from spending threads, connections and memory on calls that cannot succeed. The failing service needs its own shedding and backpressure." },
      { q: "Retrying a payment timeout without an idempotency key risks:", a: "Charging the customer twice", o: ["Charging the customer twice", "A slower checkout", "Losing the breaker state", "A cache stampede"], why: "A timeout means unknown outcome, not failure. The original request may have succeeded; the retry creates a second charge unless the provider can deduplicate by key." },
    ],
  }
);
