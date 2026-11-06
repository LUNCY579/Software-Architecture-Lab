// Authored tutorials, part 3 of 3: disaster recovery, netcode, matchmaking,
// documentation, and the capstone design review.

window.FIELD_GUIDE_TUTORIALS = window.FIELD_GUIDE_TUTORIALS || [];

window.FIELD_GUIDE_TUTORIALS.push(
  {
    id: "disaster-recovery-plan",
    title: "Disaster Recovery: Turning an Availability Promise into a Plan",
    subtitle: "RPO, RTO, backup sizing and the drill that proves any of it works.",
    track: "sql",
    level: "Intermediate",
    minutes: 30,
    modules: ["s-dr", "s-backups", "s-11-failures", "s-large"],
    outcomes: [
      "Distinguish high availability from disaster recovery.",
      "Derive backup frequency from an RPO and a restore strategy from an RTO.",
      "Size backup storage and restore time with real arithmetic.",
      "Write a runbook that another engineer can execute at 3 a.m.",
    ],
    blocks: [
      { type: "callout", tone: "key", title: "HA is not DR", t: "High availability keeps serving when a node dies. Disaster recovery restores service when the whole cluster, region or data set is gone — including the case where the data itself was corrupted an hour ago and replicated everywhere." },

      { h: true, t: "1. Start from two numbers" },
      { type: "table", head: ["Term", "Question it answers", "Drives"], rows: [
        ["RPO", "How much data may we lose?", "Backup frequency, replication mode, WAL retention"],
        ["RTO", "How long may we be down?", "Warm standby vs pilot light vs restore-from-backup"],
      ] },
      { t: "A 99.95% availability target allows about 21.6 minutes of downtime per month. If your RTO is 4 hours, you cannot meet that target with a restore-from-backup strategy alone — you need a standby that can take over in minutes." },
      { type: "callout", tone: "note", title: "Worked: backup interval vs RPO", t: "Full backups nightly and no continuous log means an RPO of up to 24 hours: a failure at 23:59 loses a day. Continuous change capture into object storage every 5 minutes gives an RPO of 5 minutes, at the cost of storage and a restore that must replay those increments." },

      { h: true, t: "2. Restore time is arithmetic, not optimism" },
      { t: "Suppose the database is 2 TB and the restore path sustains 100 MB/s from object storage. That is 2,000,000 MB / 100 MB/s = 20,000 seconds, or about 5.5 hours — before replaying increments and rebuilding indexes." },
      { type: "steps", items: [
        "Measure the actual restore throughput, not the vendor's peak.",
        "Add replay time for the incremental log up to the failure point.",
        "Add index rebuild and verification time.",
        "Add DNS/connection cutover and cache warmup.",
        "Compare with the RTO. If it does not fit, change the strategy instead of the slide.",
      ] },
      { type: "table", head: ["Strategy", "RTO", "RPO", "Cost", "Use when"], rows: [
        ["Backup and restore", "Hours", "Minutes to hours", "Low", "Internal tools, dev/test"],
        ["Pilot light", "30-60 min", "Minutes", "Medium", "Data tier running, compute off"],
        ["Warm standby", "Minutes", "Seconds", "High", "Revenue-critical systems"],
        ["Active-active", "Near zero", "Near zero (or conflict rules)", "Highest", "Global, latency-critical"],
      ] },

      { h: true, t: "3. Store backups where the failure cannot reach them" },
      { t: "A backup in the same region, on the same account, with the same credentials is not a backup — it is a copy that shares the blast radius. Use a separate account or project, a separate region, immutable retention, and credentials that the production cluster cannot delete." },
      { type: "callout", tone: "warn", title: "The ransomware and fat-finger cases", t: "Point-in-time recovery is what saves you when an operator or an attacker deletes the data and the deletion replicates. Retention must be longer than your detection time. Thirty days is a common floor for business data; seven days is usually too short to notice a silent corruption." },

      { h: true, t: "4. Verify, don't assume" },
      { t: "Restore verification has three levels, and most teams only do the first." },
      { type: "checklist", items: [
        "The backup job reports success.",
        "A restore of a sample table completes into a scratch environment.",
        "A full restore is timed against the RTO, quarterly, with the on-call engineer driving.",
        "Row counts and checksums are compared against the source before cutover.",
        "The runbook was followed by someone who did not write it.",
      ] },

      { h: true, t: "5. The runbook, in the order you will need it" },
      { type: "steps", items: [
        "Declare the incident and name one decision-maker. Ambiguous authority doubles the outage.",
        "Stop the damage: revoke credentials, stop the job, isolate the cluster.",
        "Choose the restore point. Ask what the last known-good state was, not what the latest backup is.",
        "Restore into a new environment, never over the damaged one.",
        "Validate with business queries: counts, totals, a few recent records.",
        "Cut over, then watch error rate and latency for twice as long as you think you need.",
        "Write the timeline while it is fresh; the postmortem is the only part that prevents the repeat.",
      ] },

      { type: "exercise", title: "Exercise: pick a strategy", prompt: "A B2B SaaS has a 4-hour RTO, a 15-minute RPO, a 3 TB database and a restore rate of 150 MB/s. Their contract fines 10% of monthly fees per hour of downtime. What do you recommend, and what does it cost versus a warm standby?", hint: "Compute restore time first; then decide whether the fine and the engineering cost justify a standby.", solution: "Restore alone is 3,000,000 MB / 150 MB/s ≈ 5.5 hours, so restore-from-backup misses the 4-hour RTO before increments and index rebuilds. Options: raise restore throughput with parallel download and pre-built indexes (may reach ~3 hours), or run a warm standby in a second region with continuous replication: RTO minutes, RPO seconds, at roughly double compute plus cross-region egress. Given the contractual fine, the standby pays for itself on the first incident; keep nightly logical backups off-site as the corruption escape hatch, because replication faithfully copies corruption." },

      { h: true, t: "6. What to show in review" },
      { type: "checklist", items: [
        "RPO and RTO are written down and owned by a named person.",
        "Backup frequency and retention follow from those numbers.",
        "Backups live in a separate account and region, with immutable retention.",
        "The last restore drill has a date, a duration and a person.",
        "There is a documented decision on what data is allowed to be lost.",
      ] },
    ],
    quiz: [
      { q: "A 3 TB database restores at 150 MB/s. Restore time is about:", a: "5.5 hours", o: ["5.5 hours", "33 minutes", "20 minutes", "2 hours"], why: "3 TB ≈ 3,000,000 MB; divided by 150 MB/s gives ~20,000 s, or 5.5 hours — before replaying increments and rebuilding indexes." },
      { q: "Which risk does replication alone NOT protect against?", a: "Corruption or deletion that replicates to the standby", o: ["Corruption or deletion that replicates to the standby", "A node failure", "A disk failure", "A rack power loss"], why: "Replication copies whatever happens, including a bad migration or a deletion. Only point-in-time recovery with retention beyond your detection window lets you go back before the damage." },
      { q: "RPO primarily determines:", a: "How often changes must be captured", o: ["How often changes must be captured", "How many replicas you run", "Which region serves reads", "How fast failover is"], why: "RPO is acceptable data loss, so it sets capture frequency (and replication mode). RTO sets the recovery mechanism and its speed." },
      { q: "The safest place to stop a cascading outage is:", a: "Early, by revoking access and isolating the failing component", o: ["Early, by revoking access and isolating the failing component", "After the postmortem", "By restarting every service at once", "By restoring from the latest backup immediately"], why: "Damage control comes before diagnosis. Restoring before you know what was corrupted risks re-introducing the fault and destroying evidence." },
    ],
  },

  {
    id: "netcode-and-latency",
    title: "Netcode: Ticks, Prediction and the Latency Budget",
    subtitle: "How a 100 ms round trip becomes a playable game, with the numbers behind it.",
    track: "gaming",
    level: "Advanced",
    minutes: 45,
    modules: ["g-getgud", "g-network", "g-realtime", "g-patterns"],
    outcomes: [
      "Trace input, simulation, broadcast and correction through a tick loop.",
      "Choose a tick rate and compute the resulting input delay.",
      "Explain what the client may predict safely and what it may not.",
      "Estimate bandwidth per player and decide what needs interest management.",
    ],
    blocks: [
      { type: "callout", tone: "key", title: "The constraint is physics plus trust", t: "Light takes about 67 ms to cross the Atlantic in fibre. No architecture removes that. Netcode exists to hide the round trip from the player without handing authority to the client, because the client is the adversary." },

      { h: true, t: "1. The loop" },
      { type: "flow", caption: "One tick, 30 times per second", nodes: [
        { label: "Client input", sub: "move, fire, sequence number" },
        { label: "Server queue", sub: "ordered per player" },
        { label: "Simulate", sub: "advance world by dt" },
        { label: "Broadcast", sub: "snapshot + last acked input" },
        { label: "Client", sub: "reconcile, interpolate" },
      ] },
      { t: "Every input is numbered. The server acknowledges the last input it applied. The client keeps unacknowledged inputs so it can replay them after a correction. That sequence number is the spine of the whole design." },

      { h: true, t: "2. Tick rate, and what it really costs" },
      { type: "table", head: ["Tick rate", "Tick length", "Suits", "Cost"], rows: [
        ["10 Hz", "100 ms", "Strategy, board games", "Cheap; visible latency in action games"],
        ["20 Hz", "50 ms", "Casual action, co-op", "Moderate; acceptable for slow projectiles"],
        ["30 Hz", "33 ms", "Shooters, MOBAs", "Common baseline"],
        ["60 Hz", "17 ms", "Competitive shooters, racing", "Double CPU; sharper hit registration"],
        ["128 Hz", "8 ms", "Esports, LAN", "Very expensive; marginal for remote play"],
      ] },
      { t: "Doubling the tick rate doubles simulation cost and roughly doubles snapshot production. It does not halve the player's round trip. Beyond about 60 Hz the visible benefit is mostly hit registration, which is why competitive shooters pay for it and co-op games do not." },

      { h: true, t: "3. The latency budget, itemised" },
      { t: "Take a 100 ms RTT player on a 30 Hz server. One-way trip is 50 ms. The input waits for the next tick (up to 33 ms), the server simulates (say 2 ms), and the snapshot travels back (50 ms). That is up to 135 ms before the player sees their own action — enough to feel wrong." },
      { t: "Client-side prediction removes the two network legs for the local player: the client applies the input immediately and shows the result. What remains is correction when the server disagrees." },
      { type: "compare",
        left: { title: "Safe to predict", items: [
          "Your own movement, animation and camera.",
          "Weapon fire effects and local audio.",
          "UI acknowledgement of an action.",
        ] },
        right: { title: "Never predict authoritatively", items: [
          "Damage dealt to another player.",
          "Loot, currency or inventory changes.",
          "Match outcome, scoring, or rank.",
          "Anything the server must be able to reject.",
        ] } },
      { type: "callout", tone: "warn", title: "Prediction is a loan against reconciliation", t: "Every predicted action must be correctable. If a prediction can produce an effect that cannot be undone — a purchase, a kill, a rank change — do not predict it. Show a pending state instead." },

      { h: true, t: "4. Reconciliation without visible snapping" },
      { t: "The server sends the authoritative state plus the last input it processed. The client compares that state with its own record of that tick, drops acknowledged inputs, replays the remainder, and blends the visual difference over a few frames." },
      { c: true, t: `function onSnapshot(snap) {
  // 1. Rewind to the server's authoritative state
  state = snap.state;

  // 2. Replay inputs the server has not acknowledged yet
  for (const input of pendingAfter(snap.lastAckedInput)) {
    state = simulate(state, input, TICK_DT);
  }

  // 3. Present smoothly: the renderer lerps toward the corrected state
  //    instead of teleporting the camera.
  renderer.blendToward(state, BLEND_MS);
}` },
      { t: "The blend is not cosmetic. A hard snap of 40 cm is read by players as a bug or as cheating; the same correction spread over 100 ms is read as normal movement." },

      { h: true, t: "5. Other players are interpolated, not predicted" },
      { t: "You cannot know another player's next input, so their movement is rendered slightly in the past — typically 100 ms behind the newest snapshot — and interpolated between the two most recent states. This trades a little accuracy for smooth motion despite jitter and packet loss." },
      { t: "Extrapolation is the alternative: predict where they are going. It looks better on a clean network and much worse when someone stops, turns, or lags. Most games interpolate; a few extrapolate with a short cap." },

      { h: true, t: "6. Bandwidth: do the multiplication before the design review" },
      { t: "Sixty-four players, 20 snapshots per second, 60 bytes of state per player: 64 × 20 × 60 = 76,800 bytes per second per client, about 77 KB/s down — 0.6 Mbit/s. That is fine. Now make it 200 players in an open world: 240 KB/s per client, and the server is producing 200 × 200 × 20 × 60 bytes ≈ 48 MB/s of egress." },
      { type: "steps", items: [
        "Interest management: only send entities within a radius or in the same room. This is the single biggest win.",
        "Delta compression: send changed fields against the last acknowledged snapshot.",
        "Quantisation: positions as 16-bit fixed point instead of 32-bit floats.",
        "Priority: update nearby combatants every tick, distant ones every few ticks.",
        "Reliability split: state on unreliable datagrams, events (chat, purchases) on a reliable channel.",
      ] },
      { type: "callout", tone: "note", title: "TCP is usually the wrong transport for state", t: "Head-of-line blocking means one lost packet stalls every later packet, including fresher state that supersedes it. Games send state over UDP with their own sequencing, and use reliable channels only for events that must not be lost." },

      { type: "exercise", title: "Exercise: budget a 40-player shooter", prompt: "40 players, 30 Hz, 48 bytes per player snapshot. Compute per-client downstream bandwidth. Then decide what to do for a player with 2% packet loss and 180 ms RTT.", hint: "Multiply players × rate × bytes. For the bad connection, think about what to drop first and what must remain authoritative.", solution: "40 × 30 × 48 = 57,600 B/s ≈ 58 KB/s down per client, ~0.46 Mbit/s — comfortable. For the 180 ms / 2% player: keep authority on the server, increase interpolation delay to ~200 ms so two snapshots usually arrive in time, send redundant recent snapshots so a lost packet is covered by the next, reduce their update rate for distant entities, and never let them predict damage. If they still cannot keep up, degrade their view (fewer entities) rather than their correctness." },

      { h: true, t: "7. Review checklist" },
      { type: "checklist", items: [
        "Every input is sequenced and acknowledged.",
        "Each predicted action is reversible or purely cosmetic.",
        "Corrections are blended, never snapped.",
        "Remote players are interpolated with a stated delay.",
        "Bandwidth is computed, not estimated, at target player count.",
        "Interest management exists before the world grows.",
      ] },
    ],
    quiz: [
      { q: "Why does the client keep unacknowledged inputs?", a: "To replay them after a server correction", o: ["To replay them after a server correction", "To reduce bandwidth", "To encrypt traffic", "To validate other players"], why: "The server's snapshot reflects only inputs it has processed. The client rewinds to that state and reapplies pending inputs, so the local view stays consistent and responsive." },
      { q: "A 30 Hz server adds up to how much delay before simulating a new input?", a: "33 ms", o: ["33 ms", "8 ms", "100 ms", "17 ms"], why: "Inputs are processed on ticks; worst case is one full tick period, 1/30 s ≈ 33 ms. Higher tick rates shrink this, at higher CPU cost." },
      { q: "Which should never be client-predicted as final?", a: "Damage dealt to another player", o: ["Damage dealt to another player", "Local camera movement", "Your own footstep audio", "UI button feedback"], why: "Predicted damage can be rejected by the server, producing a visible lie and an exploit path. Predict only what you can undo." },
      { q: "Interest management mainly reduces:", a: "Per-client bandwidth and server egress", o: ["Per-client bandwidth and server egress", "Tick rate", "Input latency", "Matchmaking time"], why: "Sending only nearby entities cuts both the snapshot size and the fan-out. It scales better than any compression tweak." },
    ],
  },

  {
    id: "matchmaking-by-design",
    title: "Matchmaking by Design",
    subtitle: "Tickets, pools, quality functions and the queue-time trade you cannot avoid.",
    track: "gaming",
    level: "Advanced",
    minutes: 40,
    modules: ["g-open-match-guide", "g-open-match-intro", "g-tools", "g-modern-services"],
    outcomes: [
      "Trace a ticket from submission to assigned game server.",
      "Design pool expansion that trades match quality for queue time deliberately.",
      "Write a match function with an explicit quality metric.",
      "Size the matcher from queue depth and arrival rate.",
    ],
    blocks: [
      { type: "callout", tone: "key", title: "Matchmaking is a search with a deadline", t: "Perfect matches exist in theory and never in your queue. Every design decision is about how fast to widen the search before the player leaves." },

      { h: true, t: "1. The pipeline" },
      { type: "flow", caption: "Open Match style flow", nodes: [
        { label: "Client", sub: "requests a match" },
        { label: "Frontend", sub: "creates ticket in pool" },
        { label: "Director", sub: "calls FetchMatches" },
        { label: "Match function", sub: "reads tickets, proposes matches" },
        { label: "Backend", sub: "assigns game server" },
      ] },
      { t: "The ticket carries what the matcher needs: player id, skill rating, region, party size, mode, and enqueue time. The pool is the set of tickets eligible to be matched together. The profile declares the match shape — 5v5, one region, rating band. The match function is the only custom code, and it returns proposed matches with a quality score." },
      { type: "callout", tone: "note", title: "Separate matchmaking from server allocation", t: "Finding ten compatible players and finding a machine to host them are different problems with different failure modes. Keep the match function pure: given tickets and a profile, propose matches. Let the Director handle allocation, retries and player connection details." },

      { h: true, t: "2. The unavoidable trade" },
      { t: "Queue time and match quality pull in opposite directions. Tighten the rating band and the queue gets longer; widen it and stomp rates rise. You cannot escape this, so make it explicit and measurable." },
      { type: "table", head: ["Queue age", "Rating band", "Region set", "Expected effect"], rows: [
        ["0-15 s", "±50", "Same region", "High quality, low pop-out"],
        ["15-40 s", "±150", "Same region", "Good quality, wider skill"],
        ["40-90 s", "±300", "Neighbouring regions", "Acceptable, some latency cost"],
        ["90 s+", "±600", "Any region with ping < 150 ms", "Match now or lose the player"],
      ] },
      { type: "callout", tone: "warn", title: "Never widen latency to save skill", t: "A 200 ms match is not a worse version of a good match; it is unplayable for a competitive game. Widen skill first, then backfill with bots, then let the player leave. Latency has a hard ceiling; rating does not." },

      { h: true, t: "3. Sizing the matcher with arithmetic" },
      { t: "Suppose 2,000 players are queued in a mode, matches need 10 players, and arrivals are 40 players per second. A pool with 2,000 candidates produces 200 potential matches instantly if the band is wide enough; at ±50 rating only about 3% of candidates qualify, so the effective pool is 60 players — six matches, roughly 15 seconds of arrivals." },
      { type: "steps", items: [
        "Estimate eligible candidates as queue depth × fraction inside the band.",
        "Divide by players per match to get matches available now.",
        "Compare with arrival rate to estimate wait: wait ≈ playersPerMatch / arrivalRate when the pool is empty.",
        "If wait exceeds the mode's tolerance, either widen the band or accept bots/backfill.",
      ] },
      { t: "For this mode, an empty pool means 10 / 40 = 0.25 s between qualifying arrivals, so waits are dominated by search quality rather than supply — which is why band widening matters more than matcher speed. In a low-population mode at 2 players per second, the same match takes 5 s of arrivals: supply is the problem, and no algorithm fixes it. That is when you backfill." },

      { h: true, t: "4. The match function" },
      { c: true, t: `// Pure function: tickets + profile -> proposed matches with a score.
function matchFunction(tickets, profile) {
  const proposals = [];
  const sorted = tickets.sort(byEnqueueTime);   // fairness first

  for (const anchor of sorted) {
    if (anchor.used) continue;
    const candidates = tickets
      .filter(t => !t.used && t.id !== anchor.id)
      .filter(t => t.region === anchor.region)
      .filter(t => Math.abs(t.rating - anchor.rating) <= anchor.band)
      .sort((a, b) => Math.abs(a.rating - anchor.rating) - Math.abs(b.rating - anchor.rating));

    const team = [anchor, ...candidates.slice(0, profile.playersPerMatch - 1)];
    if (team.length < profile.playersPerMatch) continue;

    team.forEach(t => { t.used = true; });
    proposals.push({
      tickets: team.map(t => t.id),
      quality: qualityScore(team),        // 0..1, higher is better
      latency: worstPing(team),
    });
  }
  return proposals.filter(p => p.quality >= profile.minQuality);
}` },
      { t: "Two properties matter. Sorting by enqueue time prevents starvation: the oldest ticket always anchors first. And quality is a number, not a boolean, so you can log it and tune thresholds against real data instead of arguing." },
      { type: "callout", tone: "tip", title: "Log the counterfactual", t: "For every match, record the quality you accepted and the quality you would have had 10 seconds later. That single metric tells you whether your bands are too tight or too loose, and it is impossible to reconstruct after the fact." },

      { h: true, t: "5. Failure modes" },
      { type: "table", head: ["Symptom", "Likely cause", "Fix"], rows: [
        ["Queue grows without matches", "Band too tight for population", "Pool expansion over time; backfill bots"],
        ["Same players repeatedly matched", "No rematch penalty", "Track recent opponents, add a diversity term"],
        ["Players load into a dead lobby", "Match accepted but server allocation failed", "Reserve capacity before accepting; timeout and requeue"],
        ["High cancellation at 60 s", "No feedback and no expansion", "Show estimated wait and an expanding search indicator"],
        ["Matcher CPU spikes", "Full scan over all tickets every cycle", "Index by region and rating; process in bounded batches"],
      ] },

      { type: "exercise", title: "Exercise: design a 3v3 mode at low population", prompt: "3v3, 400 players queued globally, 6 players per match, 15 players/second arriving, players tolerate 45 seconds. Design the pools and expansion, and handle a region with only 40 queued players.", hint: "Compute the wait from arrivals first, then decide whether skill bands or regions must widen.", solution: "Global supply gives 6/15 = 0.4 s per match, so waits are quality-bound, not supply-bound. Use a single pool keyed by mode, band ±75 expanding every 15 s to ±300, region preferred but allow cross-region under 120 ms. For the 40-player region, supply gives one match per 0.4 s only if those players are eligible; with ±75 perhaps 20% qualify, so waits stretch to ~2 s of arrivals — fine. The real risk is a 40-player region at night where 6 simultaneous players may not exist: allow cross-region after 20 s, backfill with bots after 40 s, and never widen ping past 120 ms." },

      { h: true, t: "6. Review checklist" },
      { type: "checklist", items: [
        "Expansion policy is written per mode, with time thresholds.",
        "Latency has a hard ceiling; skill does not.",
        "The match function is pure and returns a quality score.",
        "Queue time, match quality and cancellation rate are all measured.",
        "Server allocation failure has a defined player-visible path.",
        "Bots or backfill exist for low-population modes.",
      ] },
    ],
    quiz: [
      { q: "The oldest tickets anchor first in the match function in order to:", a: "Prevent starvation of long-waiting players", o: ["Prevent starvation of long-waiting players", "Reduce CPU cost", "Improve region grouping", "Avoid using a quality score"], why: "Without an age-first anchor, a steady stream of new players can keep matching each other while old tickets wait indefinitely. Fairness has to be explicit." },
      { q: "Which dimension should never be widened to shorten a queue?", a: "Latency beyond the game's playable ceiling", o: ["Latency beyond the game's playable ceiling", "Skill rating band", "Region grouping within a ping limit", "Party-size flexibility"], why: "Skill mismatch degrades a match; latency can make it unplayable. Widening skill is a quality decision; widening ping is a correctness decision." },
      { q: "In Open Match, your custom logic belongs in:", a: "The match function", o: ["The match function", "The ticket store", "The Director's HTTP client", "Redis"], why: "Open Match supplies the frontend, pools, ticket storage and the fetch loop. The match function is the extension point that decides which tickets form a match." },
      { q: "A match is accepted but the game server fails to start. The user-visible requirement is:", a: "A defined timeout and requeue, without losing the player", o: ["A defined timeout and requeue, without losing the player", "Silent failure", "A full client restart", "Returning to the main menu"], why: "Allocation is the most failure-prone step. The player must be returned to the queue with priority, or the match quality work is wasted." },
    ],
  },

  {
    id: "diagrams-and-adrs",
    title: "Diagrams and Decision Records",
    subtitle: "Draw four levels of detail, then write down why — so the design survives you.",
    track: "architecture",
    level: "Beginner",
    minutes: 30,
    modules: ["ch03", "ms-diagram", "ch09", "ch04"],
    outcomes: [
      "Draw context, container, component and sequence views without mixing audiences.",
      "Apply the notation and layout rules that keep a diagram reviewable.",
      "Write an ADR that records the trade-off and the rejected option.",
      "Keep diagrams from drifting away from the running system.",
    ],
    blocks: [
      { type: "callout", tone: "key", title: "A diagram answers one question", t: "If you cannot say which question a diagram answers, it will answer none. 'Show me the whole system' is not a question; 'what does a checkout request touch?' is." },

      { h: true, t: "1. Four levels, four audiences" },
      { type: "table", head: ["Level", "Shows", "Audience", "Rule"], rows: [
        ["Context", "The system as one box, users, external systems", "Executives, new joiners", "No internal detail at all"],
        ["Container", "Deployable units and their protocols", "Engineers, SRE, security", "Every arrow is a real network call"],
        ["Component", "Modules inside one container", "The team that owns it", "Only for the container under discussion"],
        ["Code", "Classes and interfaces", "Nobody, usually", "Generate it or skip it"],
      ] },
      { type: "flow", caption: "Container view of a course platform", nodes: [
        { label: "Browser", sub: "web app" },
        { label: "API", sub: "HTTPS / JSON" },
        { label: "Worker", sub: "queue consumer" },
        { label: "Postgres", sub: "primary + replica" },
        { label: "Object store", sub: "video, backups" },
      ] },
      { t: "Notice what the container view omits: no classes, no tables, no library choices. Every box is something you deploy; every arrow is something that can fail at 3 a.m." },

      { h: true, t: "2. Notation rules that survive review" },
      { type: "compare",
        left: { title: "Do", items: [
          "One direction per arrow, labelled with the protocol or intent.",
          "Group by trust boundary or deployment boundary, not by colour preference.",
          "Keep boxes axis-aligned; let white space carry grouping.",
          "Split a diagram that needs zooming to read.",
          "Include a legend when you use shapes or colours for meaning.",
        ] },
        right: { title: "Avoid", items: [
          "Arrows without labels: is that a call, an event, or a dependency?",
          "Mixing runtime flow and static structure in one picture.",
          "Colour as the only carrier of meaning — inaccessible and unprintable.",
          "A diagram that includes the database but not who may write to it.",
          "Decorative icons that imply technology you do not use.",
        ] } },
      { type: "callout", tone: "warn", title: "Stale diagrams are worse than none", t: "A missing diagram makes people ask. A wrong diagram makes them build on a false assumption. If a diagram is not regenerated or reviewed as part of the change, delete it." },

      { h: true, t: "3. The ADR" },
      { t: "An architecture decision record is one page, immutable once accepted. It exists so that in eight months nobody re-litigates a settled question or silently reverses it." },
      { type: "table", head: ["Field", "Content"], rows: [
        ["Status", "proposed / accepted / superseded by ADR-014"],
        ["Context", "The forces: load, deadline, team size, compliance, existing stack"],
        ["Decision", "One sentence, active voice: 'We will cache product pages at the edge for 60 s.'"],
        ["Alternatives", "What else was considered, and the specific reason each lost"],
        ["Consequences", "What gets easier, what gets harder, what we must now monitor"],
      ] },
      { c: true, t: `# ADR-007: Edge-cache product pages instead of adding read replicas

Status: accepted (2026-03-04)

Context
  Product pages are 78% of read traffic and tolerate seconds of staleness.
  p95 is 340 ms with a single primary; the catalogue table is 40 GB and
  only ~20% of rows are requested in any hour.

Decision
  Cache rendered product pages at the CDN for 60 s, keyed by product id
  and locale, purged on catalogue publish.

Alternatives
  - Read replicas: scales reads but leaves 340 ms origin latency for every
    cache miss and adds failover surface.
  - Application cache: helps, but does not remove the network round trip
    for distant users.

Consequences
  + p95 for cached pages ~40 ms; primary read load drops by an estimated 80%.
  - Up to 60 s of stale price display: price changes must purge immediately.
  - New dependency on the CDN's purge API; alert if purge failures exceed 0.1%.` },
      { t: "The value is in the alternatives and consequences. A decision without rejected options is a note, not a record — six months later nobody knows whether the alternative was considered or simply missed." },

      { h: true, t: "4. Keeping it true" },
      { type: "steps", items: [
        "Store diagrams and ADRs next to the code they describe, in the same repository.",
        "Make the diagram part of the pull request for changes that add a component or a call.",
        "Generate what can be generated: service maps from deployment metadata, ER diagrams from migrations.",
        "Review the context diagram once a quarter with the people on call, not with the people who drew it.",
        "Supersede ADRs; never edit history. The chain of decisions is the useful artefact.",
      ] },

      { type: "exercise", title: "Exercise: write the ADR you are avoiding", prompt: "Your team is arguing about whether to split the monolith. Write the ADR in six fields, including what you would have to believe for the split to pay off.", hint: "Consequences should be measurable. 'Better scalability' is not a consequence; 'deploy frequency from weekly to daily' is.", solution: "Context: 14 engineers, weekly release train, one deploy blocking all features, checkout and catalogue sharing a database with lock contention. Decision: keep the monolith, extract the notification worker only, revisit in two quarters. Alternatives: full split (3-5x operational load for a 14-person team, no independent scaling need demonstrated), modular monolith with enforced package boundaries (chosen as the middle path). Consequences: + release train unchanged, contention reduced by moving the worker; - no independent scaling yet; must monitor deploy duration and cross-module coupling, and set a review date. What we would have to believe: that deploy coordination, not infrastructure, is the actual bottleneck — if profiling later shows catalogue load starving checkout, the decision is superseded." },

      { h: true, t: "5. Review checklist" },
      { type: "checklist", items: [
        "Each diagram states its question and audience.",
        "Every arrow is labelled; every box is deployable at container level.",
        "Colour is never the only signal; a legend exists where needed.",
        "ADRs have alternatives and measurable consequences.",
        "Diagrams and ADRs live with the code and are reviewed on change.",
      ] },
    ],
    quiz: [
      { q: "A container diagram should show:", a: "Deployable units and the protocols between them", o: ["Deployable units and the protocols between them", "Classes and interfaces", "Every database table", "Team org charts"], why: "Containers are the deployable/runtime units — apps, services, data stores. Classes belong at code level, tables at data level, and neither helps a runtime discussion." },
      { q: "The most valuable part of an ADR is:", a: "The alternatives and their rejection reasons", o: ["The alternatives and their rejection reasons", "The title", "The author list", "The diagram"], why: "Without the rejected options, the record cannot prevent the same debate recurring, and nobody can tell whether a constraint has since changed." },
      { q: "Why is an unlabelled arrow a defect?", a: "It hides whether it is a synchronous call, an event, or a dependency", o: ["It hides whether it is a synchronous call, an event, or a dependency", "It makes the file larger", "It breaks the legend", "It duplicates the context diagram"], why: "The label carries the failure semantics. A synchronous call can block the caller; an event cannot. The reader cannot review coupling without it." },
      { q: "Which practice keeps documentation honest?", a: "Reviewing diagrams in the pull request that changes the system", o: ["Reviewing diagrams in the pull request that changes the system", "Rewriting all docs quarterly", "Keeping diagrams in a wiki nobody edits", "Only documenting at project start"], why: "Drift happens at change time. Making the diagram part of the change review is the only mechanism that keeps it within a commit of reality." },
    ],
  },

  {
    id: "capstone-design-review",
    title: "Capstone: Design and Defend a Global Live Classroom",
    subtitle: "Requirements, estimates, a design, and the review questions that expose it.",
    track: "architecture",
    level: "Advanced",
    minutes: 60,
    modules: ["ch07", "ch08", "ch11", "ch12", "s-enterprise", "aws-book"],
    outcomes: [
      "Convert a vague product brief into requirements and quality scenarios.",
      "Produce capacity estimates before drawing anything.",
      "Choose a consistency and caching model per data type.",
      "Run a design review against failure, cost and operability.",
    ],
    blocks: [
      { t: "This is the synthesis exercise. Everything in the library shows up somewhere: requirements, consistency, caching, resilience, data placement, documentation. Work it on paper before reading the model answer." },

      { h: true, t: "The brief" },
      { t: "Build a live-classroom platform. Instructors run sessions for up to 500 concurrent learners with video, slides, a shared code editor, polls and chat. Sessions are recorded. Learners keep progress and notes forever. The company sells to schools in the EU, India and the US, and each region's data-protection rules must be respected. Target: 1 million monthly active learners, with a Monday 09:00 peak in each region." },

      { h: true, t: "Step 1 — Requirements you can test" },
      { type: "table", head: ["Quality", "Scenario", "Target"], rows: [
        ["Latency", "Chat message visible to all participants in a 500-person session", "p95 < 300 ms in-region"],
        ["Availability", "A learner can open a recorded lesson", "99.95% monthly"],
        ["Durability", "A submitted assignment is never lost", "0 loss after acknowledgement"],
        ["Consistency", "A learner's own note appears immediately on refresh", "read-your-writes"],
        ["Compliance", "EU learner data stays in the EU", "no cross-region copy of PII"],
        ["Cost", "Video egress per learner-hour", "< $0.02"],
      ] },
      { type: "callout", tone: "note", title: "Why scenarios beat adjectives", t: "'Scalable' cannot be reviewed. '500 participants, p95 under 300 ms' can be measured, argued about, and failed honestly." },

      { h: true, t: "Step 2 — Estimates before architecture" },
      { t: "1M monthly active learners. Monday peak: assume 8% of MAU concurrent at once, across three regions, so about 80,000 concurrent, of which perhaps 60% are in live sessions: 48,000 live participants, in sessions of ~300, so roughly 160 concurrent sessions per peak region." },
      { type: "table", head: ["Quantity", "Working", "Result"], rows: [
        ["Concurrent live participants", "1M × 8% × 60%", "48,000"],
        ["Sessions at peak", "48,000 / 300", "160"],
        ["Chat messages", "48,000 × 0.2 msg/s", "9,600 msg/s"],
        ["Poll votes", "bursty, 48,000 in 10 s", "4,800/s for 10 s"],
        ["Recording egress", "48,000 × 1.5 Mbit/s", "72 Gbit/s at peak"],
        ["Storage per month", "48,000 hrs × 0.5 GB/hr", "24 TB"],
      ] },
      { t: "Two numbers change the design immediately. 72 Gbit/s of video egress makes a CDN mandatory — you cannot serve that from application servers, and the cost target forces aggressive edge caching of recordings. And 9,600 messages/second is trivial for a broker but impossible for a single WebSocket server, so chat needs fan-out and interest management." },

      { h: true, t: "Step 3 — Shape of the system" },
      { type: "flow", caption: "One region; replicated by data class", nodes: [
        { label: "CDN", sub: "recordings, static assets" },
        { label: "Edge gateway", sub: "auth, rate limits, routing" },
        { label: "Session service", sub: "WebSocket fan-out per room" },
        { label: "Chat / polls", sub: "broker + stream" },
        { label: "Core API", sub: "courses, progress, notes" },
        { label: "Regional SQL", sub: "PII pinned to region" },
        { label: "Object store", sub: "recordings, assignments" },
      ] },
      { t: "The key structural decision: split by data class, not by feature. Video is immutable and cacheable at the edge. Live session state is ephemeral and in memory. Learner records are transactional and must respect residency. Forcing all three through one service is what produces a system that is slow at video and fragile at records." },

      { h: true, t: "Step 4 — Decide per data type" },
      { type: "table", head: ["Data", "Consistency", "Placement", "Store"], rows: [
        ["Live session state", "Ephemeral, leader-per-room", "In-region memory", "Redis + room owner"],
        ["Chat history", "Eventual, ordered per room", "Region of session", "Stream + regional store"],
        ["Progress and notes", "Read-your-writes", "Learner's region", "Regional SQL, pinned"],
        ["Recordings", "Immutable once published", "Global CDN", "Object storage"],
        ["Assignments", "Durable, idempotent submit", "Learner's region", "Regional SQL + object store"],
        ["Billing", "Strong, single writer", "One region", "Primary + outbox"],
      ] },
      { type: "callout", tone: "warn", title: "Residency is a design constraint, not a deployment setting", t: "If EU PII may not leave the EU, then a global user table, a global search index and a global analytics warehouse are all violations. Group data by residency class first, then design around it." },

      { h: true, t: "Step 5 — Where this design fails" },
      { type: "steps", items: [
        "A session's room owner dies mid-class. Need reconnect + state replay from the last snapshot, and a client that tolerates a visible pause.",
        "Chat fan-out saturates on a 5,000-person keynote. Need sampling or read-only mode above a threshold, and this must be product-approved before the event.",
        "A Monday peak coincides with a CDN regional incident. Need a lower-bitrate fallback and a session-materials-only mode.",
        "Assignment submission retries after a timeout. Need idempotency keys, or students submit twice and see two grades.",
        "A schema change to progress tables during term time. Need expand/contract and a migration window.",
        "Cost blowout from recording egress. Need per-region cost dashboards and a storage tiering policy.",
      ] },

      { h: true, t: "Step 6 — The review questions" },
      { type: "checklist", items: [
        "What is the single point of failure, and what happens in the 30 seconds after it dies?",
        "Which number in the estimate is most likely wrong, and how would you find out cheaply?",
        "What data can be stale, for how long, and who notices?",
        "What happens at 3× peak? What breaks first, and does it break safely?",
        "How do you deploy this on a Monday morning without dropping a live class?",
        "Which part would you delete if the budget were cut in half?",
      ] },
      { t: "The answer to the last question is the real test of an architecture: if nothing can be removed, the design has no priorities, only wishes." },

      { type: "exercise", title: "Capstone deliverable", prompt: "Produce the one-page design: six quality scenarios with numbers, capacity estimates, a container diagram, a consistency/placement table, and your top three risks with mitigations. Then run the six review questions against it.", hint: "Do the estimates before the diagram. Most designs fail because the numbers came after the picture.", solution: "A defensible answer has: (1) at least one hard latency and one durability scenario; (2) peak concurrency derived from MAU rather than guessed, with the multiplication visible; (3) a diagram where every arrow is a network call and every box is deployable; (4) consistency stated per data type, including which reads may be stale; (5) named failure modes with a user-visible behaviour, not just a mitigation; (6) an explicit statement of what you would cut. If your design cannot name what it would cut under budget pressure, it has not made a trade — it has listed everything you want." },
    ],
    quiz: [
      { q: "Why estimate capacity before drawing the architecture?", a: "The numbers eliminate whole design options early", o: ["The numbers eliminate whole design options early", "Diagrams are optional", "It makes the document longer", "It replaces quality scenarios"], why: "72 Gbit/s of egress settles the CDN question instantly. Without the multiplication, teams draw components they cannot afford and discover it in production." },
      { q: "Which data class should be pinned to a region for residency?", a: "Learner PII such as names and notes", o: ["Learner PII such as names and notes", "Published recordings", "Public course catalogue", "Aggregate page-view counts"], why: "Residency constrains personal data. Recordings and public catalogues are not personal; aggregates usually must be de-identified, which is a separate decision." },
      { q: "A 500-person session at 20 Hz chat fan-out is a problem mainly because:", a: "Per-room fan-out multiplies server egress and connection count", o: ["Per-room fan-out multiplies server egress and connection count", "The database cannot store messages", "Redis cannot publish", "WebSockets cannot scale"], why: "Each message is copied to every participant, so cost grows with participants × messages. That is why interest management, sampling and read-only modes exist." },
      { q: "The strongest sign of a prioritised design is:", a: "A clear answer to what would be removed under budget pressure", o: ["A clear answer to what would be removed under budget pressure", "A large diagram with many services", "Using the newest database", "Documenting every component equally"], why: "Architecture is the art of deciding what not to build. A design where nothing can be cut has made no trade-offs, so it cannot be defended under constraint." },
    ],
  }
);
