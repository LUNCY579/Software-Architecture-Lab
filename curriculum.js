// Curriculum layer: learning paths + per-module teaching metadata.
// Paths reference modules (data.js ids) and tutorials (tutorials-*.js ids).

window.FIELD_GUIDE_PATHS = [
  {
    id: "foundations",
    name: "Software Architecture Foundations",
    tagline: "From requirements to a documented, defensible design.",
    level: "Beginner",
    hours: 6,
    description:
      "Start here if architecture is new to you. You will learn what architecture actually is, how to gather requirements and quality goals, how the classic styles differ, and how to draw and document a design other people can build from. No distributed-systems background needed.",
    outcomes: [
      "Explain the difference between architecture, design and implementation.",
      "Turn business requirements into quality attributes you can test.",
      "Choose between layered, monolith, service-based and microservice styles.",
      "Draw a system context, container and sequence diagram that a stranger can read.",
      "Write an architecture decision record that records the trade-off, not just the outcome.",
    ],
    steps: [
      { kind: "module", id: "ch11", why: "The vocabulary: scalability, reliability, maintainability, consistency, and the blueprint questions every design must answer." },
      { kind: "module", id: "ch12", why: "What the backend actually consists of — servers, APIs, data, auth, queues — before you start splitting it." },
      { kind: "module", id: "ch07", why: "Requirements analysis and architecture evaluation (ATAM/SAAM), so decisions are tested against goals." },
      { kind: "module", id: "ch08", why: "The design trade-offs: consistency vs latency, dynamic load balancing, monitoring from day one." },
      { kind: "module", id: "ch03", why: "Diagram types and when each one earns its place." },
      { kind: "tutorial", id: "diagrams-and-adrs", why: "Practise the C4 levels and write a real ADR for a design you have seen." },
      { kind: "module", id: "ch09", why: "Keeping documentation alive across sprints instead of letting it rot." },
    ],
  },
  {
    id: "distributed",
    name: "Distributed Systems Engineer",
    tagline: "Consistency, caches, retries and failure — with the arithmetic.",
    level: "Intermediate",
    hours: 8,
    description:
      "The engineering core. You will reason about CAP and PACELC without hand-waving, size a quorum, compute whether a cache is worth it, and make a service survive a dependency that has stopped answering.",
    outcomes: [
      "Place a design on the CAP and PACELC axes and justify the choice.",
      "Compute read/write quorum sizes and explain the failure each one tolerates.",
      "Estimate cache hit ratio, latency and the cost of a stampede.",
      "Design timeouts, bounded retries with jitter, circuit breakers and fallbacks that fail safely.",
      "State an RPO/RTO target and derive a backup and restore plan from it.",
    ],
    steps: [
      { kind: "module", id: "ch01", why: "Nodes, partitioning, failover and the consistency spectrum." },
      { kind: "tutorial", id: "consistency-and-quorums", why: "The worked arithmetic behind CAP, quorums and read-your-writes." },
      { kind: "module", id: "ch10", why: "The pattern catalogue: ambassador, circuit breaker, CQRS, event sourcing." },
      { kind: "tutorial", id: "resilience-patterns", why: "Build the failure handling: budgets, backoff maths, breaker states, bulkheads." },
      { kind: "module", id: "aws-book", why: "Trade-off vocabulary and the caching chapter, at book depth. Large — read in two sittings." },
      { kind: "tutorial", id: "caching-in-practice", why: "Hit-ratio maths, eviction, invalidation and stampede control." },
      { kind: "tutorial", id: "disaster-recovery-plan", why: "Turn an availability promise into concrete backup frequency and a tested restore." },
      { kind: "module", id: "s-large", why: "What actually happens when a whole cloud region degrades." },
    ],
  },
  {
    id: "microservices",
    name: "Microservices Practitioner",
    tagline: "Split a system without building a distributed monolith.",
    level: "Intermediate",
    hours: 7,
    description:
      "Microservices fail in predictable ways: wrong boundaries, shared databases, synchronous chains, unclear ownership. This path is about drawing the lines in the right place and keeping them.",
    outcomes: [
      "Derive service boundaries from business capabilities rather than technical layers.",
      "Decide between choreography and orchestration for a given flow.",
      "Design a read model and an event log that can be replayed.",
      "Keep a service's data private and still answer cross-service queries.",
      "Explain the cost of a service you do not split.",
    ],
    steps: [
      { kind: "module", id: "ch02", why: "The pattern, its benefits, and its real costs." },
      { kind: "module", id: "ch05", why: "Why monoliths hurt, with Walmart and Netflix as evidence." },
      { kind: "module", id: "decoding-ms", why: "The anti-pattern checklist: distributed monolith, shared ownership, missing fallbacks." },
      { kind: "module", id: "ch04", why: "API flow diagrams as the contract between teams." },
      { kind: "tutorial", id: "cqrs-and-event-sourcing", why: "Separate reads from writes and rebuild state from an event log." },
      { kind: "tutorial", id: "schema-to-service", why: "Give each service its own schema — and prove it with constraints and roles." },
      { kind: "module", id: "s-modernization", why: "How the data layer has to change when the app is distributed." },
    ],
  },
  {
    id: "data",
    name: "Data & Resilience Engineer",
    tagline: "Schemas, indexes, regions, backups and failure drills.",
    level: "Intermediate",
    hours: 7,
    description:
      "The database is where architecture becomes irreversible. This path covers modelling, distributed SQL behaviour, tuning, TTL, backups, and the difference between high availability and disaster recovery.",
    outcomes: [
      "Model entities and relationships, then enforce them with constraints.",
      "Read an execution plan and choose indexes deliberately.",
      "Place data regionally and explain the latency and compliance consequences.",
      "Use TTL and partitioning to keep hot tables small.",
      "Distinguish HA from DR and design a restore you have actually rehearsed.",
    ],
    steps: [
      { kind: "module", id: "s-schema", why: "Constraints as the first line of data quality." },
      { kind: "tutorial", id: "schema-to-service", why: "Worked schema: keys, checks, indexes and row-level access." },
      { kind: "module", id: "s-enterprise", why: "How a distributed SQL database keeps ACID while scaling writes." },
      { kind: "module", id: "s-tips", why: "Seven tuning levers, from partial indexes to admission control." },
      { kind: "module", id: "g-ttl", why: "Row-level TTL and partition staggering under game-scale ingestion." },
      { kind: "module", id: "s-backups", why: "Managed vs customer-managed backups and point-in-time restore windows." },
      { kind: "module", id: "s-dr", why: "RPO/RTO, off-site storage, and whole-cluster loss." },
      { kind: "tutorial", id: "disaster-recovery-plan", why: "Write the plan and run the drill against real numbers." },
      { kind: "module", id: "s-11-failures", why: "Eleven failure modes and how a resilient cluster absorbs them." },
    ],
  },
  {
    id: "gaming",
    name: "Multiplayer Backend Engineer",
    tagline: "Netcode, sessions, matchmaking and game-scale data.",
    level: "Advanced",
    hours: 8,
    description:
      "A multiplayer game is a distributed system with a 50 ms deadline. This path follows the request path: client prediction, authoritative simulation, session placement, matchmaking, and the storage that survives a live-ops event.",
    outcomes: [
      "Explain what the client may predict and what only the server may decide.",
      "Size a tick rate and bandwidth budget for a given genre.",
      "Design a matchmaking loop with tickets, pools and a match function.",
      "Place game servers for latency and choose a session model.",
      "Expire and partition short-lived game data without hurting peak load.",
    ],
    steps: [
      { kind: "module", id: "g-tools", why: "Map each backend concern to a tool, so the rest of the path has names." },
      { kind: "module", id: "g-network", why: "Client-server, peer-to-peer and hybrid, chosen by genre and tolerance for cheating." },
      { kind: "module", id: "g-getgud", why: "Authoritative servers, client prediction and reconciliation." },
      { kind: "tutorial", id: "netcode-and-latency", why: "The tick loop with real numbers: input delay, correction, interpolation, bandwidth." },
      { kind: "module", id: "g-realtime", why: "Why the hot path stays in memory and why server placement is physics." },
      { kind: "module", id: "g-modern-services", why: "Shared services, entitlements and multi-region data locality." },
      { kind: "module", id: "g-open-match-guide", why: "Tickets, profiles, Director and the match function." },
      { kind: "tutorial", id: "matchmaking-by-design", why: "Design the pools, the quality function and the latency budget end to end." },
      { kind: "module", id: "g-ttl", why: "TTL and regional rows for MMORPG-scale writes." },
      { kind: "module", id: "g-patterns", why: "Game loop, command pattern and decoupling — the code-level view." },
    ],
  },
  {
    id: "documentation",
    name: "Architecture Communication & EA",
    tagline: "Make the design legible to engineers, executives and auditors.",
    level: "Beginner",
    hours: 4,
    description:
      "An architecture nobody can read is an architecture nobody follows. This path covers diagram craft, API flows, enterprise strategy, decision records, and keeping documentation current inside an agile process.",
    outcomes: [
      "Pick the diagram that answers the question being asked.",
      "Apply layout, notation and accessibility rules so a diagram survives review.",
      "Connect business goals to technology choices in an enterprise context.",
      "Record decisions as ADRs and keep them versioned.",
      "Fit documentation work into sprint 0, planning, review and retrospective.",
    ],
    steps: [
      { kind: "module", id: "ch03", why: "System, sequence and network diagrams: purpose and parts." },
      { kind: "module", id: "ms-diagram", why: "Standard microservice components and the notation that goes with them." },
      { kind: "module", id: "ch04", why: "API flow diagrams as executable-looking contracts." },
      { kind: "tutorial", id: "diagrams-and-adrs", why: "Draw the four C4 levels and write the decision record behind them." },
      { kind: "module", id: "ch06", why: "Enterprise architecture: aligning technology with business goals." },
      { kind: "module", id: "ch09", why: "Documentation as a maintained activity, not a deliverable." },
      { kind: "module", id: "hyperautomation", why: "Process orchestration across IT and business — the EA view of workflows." },
    ],
  },
];

// Per-module teaching metadata. Modules not listed fall back to the
// hand-written key takeaways in data.js as their objectives.
window.FIELD_GUIDE_GUIDE = {
  ch01: {
    level: "Intermediate", minutes: 35,
    objectives: [
      "Describe what makes a system distributed and what that costs you.",
      "Compare strong and eventual consistency, and say when each is acceptable.",
      "Explain failover with heartbeats and why a standby is not free.",
      "Choose hash, range or directory partitioning for a given access pattern.",
      "Name the anti-patterns: weak monitoring and improper sharding.",
    ],
    prereqs: [],
  },
  ch02: {
    level: "Intermediate", minutes: 45,
    objectives: [
      "Explain independent deployability and why it is the actual goal.",
      "Give each service its own data store and justify the duplication.",
      "Design for partial failure with retries, timeouts and circuit breakers.",
      "Weigh inter-service communication and consistency costs against scaling gains.",
      "Apply service discovery, API gateway and event-driven patterns.",
    ],
    prereqs: ["ch12"],
  },
  ch03: {
    level: "Beginner", minutes: 25,
    objectives: [
      "Match the diagram type to the question: structure, sequence or deployment.",
      "Label actors, lifelines, messages and activation bars correctly.",
      "Apply the minimal-detail rule and cut decoration.",
      "Review someone else's diagram for ambiguity and staleness.",
    ],
    prereqs: [],
  },
  ch04: {
    level: "Beginner", minutes: 25,
    objectives: [
      "Trace one API call across its internal components.",
      "Write a flow that a new engineer can follow without a meeting.",
      "Detect when a service change breaks an agreed flow.",
    ],
    prereqs: ["ch03"],
  },
  ch05: {
    level: "Beginner", minutes: 40,
    objectives: [
      "Explain the failure modes of a monolith in concrete terms.",
      "Derive service boundaries from business domains (DDD).",
      "Use case studies as evidence rather than fashion.",
      "State the operational cost of many languages and stacks.",
    ],
    prereqs: [],
  },
  ch06: {
    level: "Beginner", minutes: 30,
    objectives: [
      "Connect a business goal to a technology decision.",
      "Run lightweight, agile EA instead of a big upfront plan.",
      "Manage stakeholders, standardisation and complexity.",
    ],
    prereqs: [],
  },
  ch07: {
    level: "Intermediate", minutes: 35,
    objectives: [
      "Convert requirements into testable quality objectives.",
      "Walk the SAD sequence: requirements, objectives, current state, design, plan.",
      "Evaluate an architecture with ATAM/SAAM style questioning.",
      "Apply CAP as a design constraint rather than a slogan.",
    ],
    prereqs: ["ch11"],
  },
  ch08: {
    level: "Advanced", minutes: 50,
    objectives: [
      "Quantify the latency cost of strong consistency.",
      "Design dynamic load balancing and health checking.",
      "Instrument monitoring and logging before launch.",
      "Recognise that many nodes running one monolith is still a monolith.",
    ],
    prereqs: ["ch01", "ch07"],
  },
  ch09: {
    level: "Beginner", minutes: 35,
    objectives: [
      "Treat documentation as the source of truth for design intent.",
      "Version and refresh diagrams so they do not drift.",
      "Embed documentation work in sprint 0, planning, review and retro.",
    ],
    prereqs: ["ch03"],
  },
  ch10: {
    level: "Advanced", minutes: 45,
    objectives: [
      "Apply ambassador and circuit breaker to isolate failure.",
      "Split reads and writes with CQRS and scale each side.",
      "Model state as an event log and replay it to any point.",
      "Define clear interfaces, choose protocols deliberately, secure every service.",
    ],
    prereqs: ["ch02"],
  },
  ch11: {
    level: "Beginner", minutes: 30,
    objectives: [
      "Name the quality goals every architecture trades off.",
      "Fill in the design blueprint: purpose, scope, constraints, storage, scaling.",
      "Compare horizontal and vertical scaling on availability and complexity.",
      "Explain what a load balancer and a cache each buy you.",
    ],
    prereqs: [],
  },
  ch12: {
    level: "Beginner", minutes: 30,
    objectives: [
      "List the components a backend is made of and what each is responsible for.",
      "Recognise when a message queue, cache or orchestrator is justified.",
      "Iterate on backend design instead of specifying everything upfront.",
    ],
    prereqs: [],
  },
  "decoding-ms": {
    level: "Intermediate", minutes: 25,
    objectives: [
      "Recognise a distributed monolith and explain why it is the worst of both worlds.",
      "Align one team with one end-to-end process.",
      "Choose choreography or orchestration per flow.",
      "Design fallbacks so a partial outage degrades instead of failing.",
    ],
    prereqs: ["ch02"],
  },
  "ms-diagram": {
    level: "Beginner", minutes: 25,
    objectives: [
      "Use the standard component vocabulary: gateway, registry, queue, orchestrator.",
      "Apply hierarchy, alignment, white space and restrained colour.",
      "Split an overcrowded diagram into focused ones.",
    ],
    prereqs: ["ch03"],
  },
  "aws-book": {
    level: "Advanced", minutes: 150,
    objectives: [
      "Apply the fallacies of distributed computing to a real design.",
      "Reason explicitly about time vs space, latency vs throughput, consistency vs availability.",
      "Choose an eviction policy and justify it against the workload.",
      "Design read-intensive and write-intensive caching strategies.",
    ],
    prereqs: ["ch11"],
  },
  hyperautomation: {
    level: "Beginner", minutes: 30,
    objectives: [
      "Describe the four stages of a hyperautomation stack.",
      "Identify a process worth automating and one that is not.",
      "Explain why IT/business collaboration is the usual bottleneck.",
    ],
    prereqs: [],
  },
  "g-network": {
    level: "Intermediate", minutes: 30,
    objectives: [
      "Pick client-server, peer-to-peer or hybrid from genre and cheat tolerance.",
      "Explain authority and why it decides your trust model.",
      "Estimate the connection count that makes peer-to-peer impractical.",
    ],
    prereqs: [],
  },
  "g-getgud": {
    level: "Advanced", minutes: 40,
    objectives: [
      "Trace input -> server simulation -> state broadcast -> local correction.",
      "Explain prediction and reconciliation and what each one hides.",
      "Compare hosting options such as GameLift and Photon.",
    ],
    prereqs: ["g-network"],
  },
  "g-realtime": {
    level: "Advanced", minutes: 25,
    objectives: [
      "Explain why the real-time hot path avoids the database.",
      "Relate server placement to the speed of light.",
      "Decide what a session loads once and keeps in memory.",
    ],
    prereqs: ["g-network"],
  },
  "g-modern-services": {
    level: "Advanced", minutes: 30,
    objectives: [
      "Design shared services such as entitlements and bound their blast radius.",
      "Place player data near the player without breaking consistency.",
      "List the reliability goals a game backend must hit.",
    ],
    prereqs: [],
  },
  "g-open-match-guide": {
    level: "Advanced", minutes: 30,
    objectives: [
      "Trace the ticket -> profile -> match function -> assignment loop.",
      "Write the match function as the only place your logic lives.",
      "Explain what Open Match handles for you.",
    ],
    prereqs: [],
  },
  "g-ttl": {
    level: "Advanced", minutes: 25,
    objectives: [
      "Choose which tables deserve a TTL.",
      "Set and change TTL during a live event.",
      "Stagger deletions and partition to protect peak throughput.",
    ],
    prereqs: ["s-schema"],
  },
  "g-patterns": {
    level: "Advanced", minutes: 120,
    objectives: [
      "Explain why simplicity is a performance strategy in game code.",
      "Apply the command pattern to input, undo/redo and replay.",
      "Separate sequencing, behavioural and optimisation concerns.",
    ],
    prereqs: [],
  },
  "s-schema": {
    level: "Beginner", minutes: 25,
    objectives: [
      "Model entities and relationships before writing queries.",
      "Enforce correctness with primary keys, foreign keys, types and checks.",
      "Grant least-privilege access with roles.",
    ],
    prereqs: [],
  },
  "s-enterprise": {
    level: "Intermediate", minutes: 50,
    objectives: [
      "Explain how distributed SQL keeps ACID while scaling writes.",
      "Describe automated failover and self-healing.",
      "Reason about multi-cloud and lock-in.",
    ],
    prereqs: [],
  },
  "s-tips": {
    level: "Advanced", minutes: 30,
    objectives: [
      "Choose partial, composite or covering indexes deliberately.",
      "Read a distributed plan and find the imbalance.",
      "Use regions and admission control to protect important queries.",
    ],
    prereqs: ["s-schema"],
  },
  "s-dr": {
    level: "Intermediate", minutes: 25,
    objectives: [
      "Separate high availability from disaster recovery.",
      "Derive backup frequency from an RPO.",
      "Design a restore that survives losing the primary region.",
    ],
    prereqs: [],
  },
  "s-11-failures": {
    level: "Intermediate", minutes: 25,
    objectives: [
      "Classify failures: application, resource, network, node.",
      "Explain how quorum and failover preserve correctness.",
      "Use monitoring to catch depletion before it becomes an outage.",
    ],
    prereqs: [],
  },
  "s-large": {
    level: "Advanced", minutes: 25,
    objectives: [
      "Explain how a provider outage becomes your outage.",
      "Trace a cascading failure through retries and load shifts.",
      "Apply centralised config, automated deploy and patching.",
    ],
    prereqs: ["s-dr"],
  },
  "s-backups": {
    level: "Intermediate", minutes: 20,
    objectives: [
      "Compare managed and customer-managed backups.",
      "Configure an external connection to object storage.",
      "Use incremental backups and the GC window for point-in-time restore.",
    ],
    prereqs: [],
  },
  "s-molt": {
    level: "Intermediate", minutes: 20,
    objectives: [
      "Separate schema conversion, data movement and verification.",
      "Plan verification before cutover.",
    ],
    prereqs: [],
  },
  "s-postgres": {
    level: "Advanced", minutes: 25,
    objectives: [
      "Explain why compatibility is a spectrum, not a checkbox.",
      "Compare forking PostgreSQL with rewriting its SQL layer.",
    ],
    prereqs: [],
  },
  "s-modernization": {
    level: "Beginner", minutes: 20,
    objectives: [
      "Define a modern application in structural terms.",
      "Explain why the data layer decides whether modernization succeeds.",
    ],
    prereqs: [],
  },
  "s-payments": {
    level: "Intermediate", minutes: 15,
    objectives: [
      "List the non-negotiables of a payment data store.",
      "Explain how compliance constrains data placement.",
    ],
    prereqs: [],
  },
  "g-tools": { level: "Beginner", minutes: 15, objectives: ["Map each backend concern to a plausible tool.", "Recognise that tool choice follows requirements."], prereqs: [] },
  "g-medium-backend": { level: "Beginner", minutes: 20, objectives: ["Explain why backend scalability decides launch success.", "Balance scaling ambition against cost."], prereqs: [] },
  "g-open-match-intro": { level: "Intermediate", minutes: 20, objectives: ["Describe Open Match's components and Redis-backed state.", "Explain why matchmaking is hard at scale."], prereqs: [] },
  "g-sebi": { level: "Intermediate", minutes: 25, objectives: ["Map a regulatory framework onto the Govern/Identify/Protect/Detect/Respond/Recover functions.", "List example controls such as segmentation and encryption."], prereqs: [] },
  "w-next-async": { level: "Beginner", minutes: 15, objectives: ["Explain why a Client Component cannot be async.", "Choose between server fetching, client fetching and the promise-through-context pattern."], prereqs: [] },
  "w-piskel": { level: "Beginner", minutes: 5, objectives: ["Recognise a terms-of-service document as a licensing artefact, not architecture material."], prereqs: [] },
};
