// Generated audit data - do not edit by hand.
window.AUDIT_DATA = {
 "meta": {
  "title": "Accuracy & Completeness Audit",
  "subtitle": "Architecture & Backend Learning Modules vs. their 40 source PDFs",
  "generated": "2026-11-06",
  "pages": 702,
  "pdfWords": 118290,
  "moduleWords": 118301,
  "modules": 40,
  "questions": 393,
  "images": 238,
  "artefacts": 373,
  "longBlocks": 39,
  "genericTitles": 86,
  "answerInStem": 99,
  "navDerived": 41,
  "noSourceClause": 102,
  "lessonsWithoutQuiz": 28,
  "ratio": 1.0,
  "grades": {
   "A": 27,
   "B": 9,
   "C": 4
  },
  "moduleGrades": {
   "A": 0,
   "B": 25,
   "C": 15
  }
 },
 "crossCutting": [
  {
   "severity": "critical",
   "title": "Modules are full-text copies, not lessons",
   "text": "Across 40 modules, the lesson text totals 118,301 words against 118,290 words of extracted PDF text (ratio 1.00). 37 of 40 modules are at 0.98 or above. The module pages reproduce the sources almost wholesale; the 'condensed' layer is only data.js's summary and bullet list.",
   "evidence": "Word counts per module in the table; verbatim shingle match 0.95-1.00 for prose blocks."
  },
  {
   "severity": "critical",
   "title": "All 238 extracted figures are unused",
   "text": "238 PNGs were extracted into modules/media/<id>/ but no module or script references them; the block schema only supports heading, code and paragraph. Diagram-led documents therefore lose their main teaching device.",
   "evidence": "grep for 'media/' in modules and app.js returns no hits; module block keys are only h/c/t."
  },
  {
   "severity": "high",
   "title": "Version/navigation text is rendered as course content",
   "text": "373 blocks are identifiable artefacts: 'Multiplayer'/'Blog'/'Contact' nav, table headers 'Concept'/'Description', chapter cross-reference lists, newsletter forms, author names and page headers. They are displayed as lesson paragraphs and sometimes turned into quiz questions.",
   "evidence": "Artifact detector + manual inspection of ch01, ch02, g-ttl, g-sebi, aws-book."
  },
  {
   "severity": "high",
   "title": "Lesson structure does not follow the sources",
   "text": "86 of 188 lesson titles are generic ('Part 1', 'Part 2'...). 16 modules have zero headings, so the reader gets an undifferentiated wall of text. The largest single block is 493 words.",
   "evidence": "Per-module heading and generic-title counts."
  },
  {
   "severity": "high",
   "title": "The quiz layer is unreliable",
   "text": "Of 393 cloze questions, 99 (25%) show the answer in the assembled stem or heading, 41 are derived from chapter/navigation text, and 102 have no matching source sentence. 28 lessons have no quiz at all, and one module has none.",
   "evidence": "Automated stem/answer comparison and source-clause lookup; examples in the module sections."
  },
  {
   "severity": "high",
   "title": "Digest contains factual errors, not just simplifications",
   "text": "Four digests are graded C (ch05, g-tools, s-schema, s-enterprise) and a fifth, s-large (graded B), also carries an unsupported claim; nine have minor issues in total. Errors include a contradicted debugging claim, a misattributed access-control mechanism, an invented five-attribute list, and a document that is mostly omitted.",
   "evidence": "Each error is quoted against the source in the per-module sections."
  },
  {
   "severity": "medium",
   "title": "Tables, code and formulas lose their structure",
   "text": "PDF tables are flattened into prose, SQL and TypeScript are inlined or split line-by-line (w-next-async has 108 code blocks, mostly single lines), and comparison tables become unreadable paragraphs.",
   "evidence": "Block-shape statistics and inspection of w-next-async, g-ttl, aws-book."
  },
  {
   "severity": "medium",
   "title": "Copyright exposure",
   "text": "The modules reproduce copyrighted material almost verbatim, including an O'Reilly book excerpt, Camunda guides, Multiplayer tutorials and Medium articles. Local personal use is one thing; publishing or redistributing this site would require permission or a genuine summarisation pass.",
   "evidence": "Word ratios near 1.0 and verbatim shingle scores 0.95-1.00."
  },
  {
   "severity": "low",
   "title": "Track labels are folder-based, not topical",
   "text": "g-sebi (a securities-market compliance blog) sits in Gaming Backend and w-piskel (a terms-of-service page) sits in Web & Tools. The tracks describe where a file was stored, not what it teaches.",
   "evidence": "data.js track assignment vs document content."
  }
 ],
 "positives": [
  "All 40 PDFs map to exactly one module and one data.js entry; no orphans, no duplicates.",
  "Catalog lesson/question/word counts match the generated modules exactly (0 mismatches).",
  "Every one of the 393 quiz answers appears somewhere in its source PDF; no answer was fabricated.",
  "Digest claims are strongly grounded: a proper-noun/number check over all 219 summary claims produced only one genuine miss (ACID in s-enterprise).",
  "Most digests (28 of 40) are accurate at the level of specific, checkable claims."
 ],
 "modules": [
  {
   "id": "ch01",
   "title": "Distributed Systems Architecture",
   "track": "architecture",
   "source": "Chapter 1 Distributed Systems Architecture_ Tutorial & Best Practices _ Multiplayer.pdf",
   "pages": 21,
   "pdfWords": 3655,
   "moduleWords": 3642,
   "ratio": 0.996,
   "lessons": 5,
   "questions": 12,
   "images": 2,
   "headings": 20,
   "longBlocks": 0,
   "longestBlock": 234,
   "codeBlocks": 1,
   "artefacts": 13,
   "genericTitles": 3,
   "digestGrade": "B",
   "moduleGrade": "B",
   "verdict": "Accurate digest; the module is a near-verbatim copy of the article with table and navigation artefacts.",
   "verified": [
    "Four architecture shapes (client-server, peer-to-peer, 3-tier, N-tier) match the source.",
    "Failover via a heartbeat between at least two servers is described correctly.",
    "Strong, causal and linearizable consistency, plus last-write-wins and vector clocks, are all present in the source.",
    "Hash-, range- and directory-based partitioning and the directory's application-layer flexibility are supported.",
    "Quorum voting explicitly 'helps balance consistency and availability' in the source."
   ],
   "issues": [
    "The anti-pattern bullet drops the source's third item, 'ineffective data management'.",
    "Lesson 1 renders table headers 'Concept' and 'Description' as body paragraphs.",
    "Three of five lesson titles are the generic 'Part 1/Part 2/Part 3'.",
    "13 extraction artefacts: navigation/table fragments in lesson text."
   ],
   "missing": [
    "Both article figures are extracted to modules/media/ch01 but never shown; the module has no image block type.",
    "Table rows are flattened into prose, losing the concept/description structure."
   ],
   "quizNote": "12 questions; 3 defective (the answer is already visible in the assembled stem or heading).",
   "quizStats": {
    "total": 12,
    "answerInStem": 3,
    "navDerived": 0,
    "noSourceClause": 3,
    "genericAnswer": 1
   },
   "lessonsWithoutQuiz": 1
  },
  {
   "id": "ch02",
   "title": "Microservices Design Pattern",
   "track": "architecture",
   "source": "Chapter 2 Microservices Design Pattern_ Tutorial & Best Practices _ Multiplayer.pdf",
   "pages": 30,
   "pdfWords": 4859,
   "moduleWords": 4822,
   "ratio": 0.992,
   "lessons": 10,
   "questions": 23,
   "images": 7,
   "headings": 34,
   "longBlocks": 0,
   "longestBlock": 231,
   "codeBlocks": 2,
   "artefacts": 17,
   "genericTitles": 2,
   "digestGrade": "A",
   "moduleGrade": "B",
   "verdict": "Accurate and well supported; main weaknesses are raw-text artefacts and quiz generation.",
   "verified": [
    "Each service owning its data and the autonomy argument match the source.",
    "APIs keeping services loosely coupled and technology-independent is stated directly.",
    "Retries, timeouts and circuit breakers as isolation mechanisms are all named in the source.",
    "Independent horizontal scaling of hot services and the challenges (communication, consistency, complexity) are supported.",
    "Service discovery, API gateways and event-driven architecture are the source's own list of remedies."
   ],
   "issues": [
    "17 artefacts, including a chapter cross-reference list (Chapter 5/7/9...) rendered as lesson content.",
    "Two lesson titles are generic ('Part 1', 'Part 2').",
    "6 quiz defects, several of them built from the navigation list."
   ],
   "missing": [
    "All 7 diagrams are extracted yet unused, so the illustrated architecture examples are absent.",
    "Tables comparing patterns are flattened into prose."
   ],
   "quizNote": "23 questions; 6 defective; several questions test chapter titles rather than concepts.",
   "quizStats": {
    "total": 23,
    "answerInStem": 6,
    "navDerived": 5,
    "noSourceClause": 6,
    "genericAnswer": 5
   },
   "lessonsWithoutQuiz": 1
  },
  {
   "id": "ch03",
   "title": "Software Architecture Diagram Example",
   "track": "architecture",
   "source": "Chapter 3 Software Architecture Diagram Example & Tutorial _ Multiplayer.pdf",
   "pages": 21,
   "pdfWords": 2763,
   "moduleWords": 2737,
   "ratio": 0.991,
   "lessons": 5,
   "questions": 5,
   "images": 8,
   "headings": 24,
   "longBlocks": 0,
   "longestBlock": 242,
   "codeBlocks": 1,
   "artefacts": 9,
   "genericTitles": 2,
   "digestGrade": "A",
   "moduleGrade": "C",
   "verdict": "Digest is faithful, but this is a diagram tutorial whose diagrams are entirely absent from the module.",
   "verified": [
    "The three diagram types (system architecture, sequence, network) match.",
    "Sequence-diagram elements (actors, lifelines, activation bars, messages) are listed exactly.",
    "Benefits (communication, early problem detection, documentation) and the five-step process are supported.",
    "The over/under-detail and stale-diagram pitfalls are stated almost verbatim in the source."
   ],
   "issues": [
    "Navigation boilerplate ('Sign Pricing Team Contact Docs...') appears as the opening lesson text.",
    "8 extracted images are unused in a module that exists to teach diagramming.",
    "Only 5 quiz questions for 5 lessons and 2,737 words."
   ],
   "missing": [
    "Every worked example diagram and the sequence-diagram legend.",
    "The article's visual comparison of diagram types."
   ],
   "quizNote": "5 questions; 1 defective.",
   "quizStats": {
    "total": 5,
    "answerInStem": 1,
    "navDerived": 1,
    "noSourceClause": 1,
    "genericAnswer": 2
   },
   "lessonsWithoutQuiz": 1
  },
  {
   "id": "ch04",
   "title": "API Flow Diagram",
   "track": "architecture",
   "source": "Chapter 4 API Flow Diagram_ Best Practices & Examples _ Multiplayer.pdf",
   "pages": 15,
   "pdfWords": 2817,
   "moduleWords": 2805,
   "ratio": 0.996,
   "lessons": 5,
   "questions": 7,
   "images": 6,
   "headings": 16,
   "longBlocks": 0,
   "longestBlock": 344,
   "codeBlocks": 0,
   "artefacts": 13,
   "genericTitles": 2,
   "digestGrade": "A",
   "moduleGrade": "B",
   "verdict": "Accurate digest of a short how-to; module text is faithful but illustration-free.",
   "verified": [
    "Defining API behaviour, onboarding and cross-team collaboration are the source's stated uses.",
    "The 'create account' high-level example and the drill-down into components are supported.",
    "The claim that diagrams reveal how a change affects other components is a fair reading of the source.",
    "Generative AI moving toward automatic code/diagram syncing is stated in the source."
   ],
   "issues": [
    "13 artefacts, mostly site navigation and newsletter text.",
    "Two generic lesson titles.",
    "2 quiz defects."
   ],
   "missing": [
    "All 6 flow diagrams are unused, removing the article's main teaching device.",
    "The step-by-step bank-account example survives only as prose."
   ],
   "quizNote": "7 questions; 2 defective.",
   "quizStats": {
    "total": 7,
    "answerInStem": 2,
    "navDerived": 5,
    "noSourceClause": 4,
    "genericAnswer": 3
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "ch05",
   "title": "Microservices Architecture Diagram Examples",
   "track": "architecture",
   "source": "Chapter 5 Microservices Architecture Diagram Examples - DevTeam.Space.pdf",
   "pages": 13,
   "pdfWords": 3963,
   "moduleWords": 3932,
   "ratio": 0.992,
   "lessons": 4,
   "questions": 12,
   "images": 8,
   "headings": 0,
   "longBlocks": 4,
   "longestBlock": 493,
   "codeBlocks": 0,
   "artefacts": 4,
   "genericTitles": 4,
   "digestGrade": "C",
   "moduleGrade": "C",
   "verdict": "Mostly grounded, but one bullet contradicts the source and the module has no section structure.",
   "verified": [
    "The Walmart case study is accurate: the site could not handle 6 million page views per minute over consecutive Black Fridays.",
    "The Netflix story is accurate: a missing semicolon in 2008 took the site down; the migration completed by December 2011.",
    "DDD, RESTful APIs and leadership buy-in are the source's own recommendations.",
    "The 'too many languages' downside is explicitly called a double-edged sword in the source."
   ],
   "issues": [
    "FACTUAL: 'Downsides: ... harder debugging' contradicts the source, which lists 'more efficient debugging' as a benefit of microservices.",
    "'One bug or deploy can take down the whole product' overstates the source's single-bug anecdote.",
    "No headings at all; four blocks exceed 350 words (one is 493 words).",
    "All four lesson titles are generic ('Part 1'-'Part 4')."
   ],
   "missing": [
    "8 extracted diagrams are unused.",
    "The article's pros/cons comparison and architecture sketches are lost to prose."
   ],
   "quizNote": "12 questions; 2 defective.",
   "quizStats": {
    "total": 12,
    "answerInStem": 2,
    "navDerived": 0,
    "noSourceClause": 3,
    "genericAnswer": 1
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "ch06",
   "title": "Enterprise Architecture Strategy",
   "track": "architecture",
   "source": "Chapter 6 Enterprise Architecture Strategy_ Best Practices _ Multiplayer.pdf",
   "pages": 17,
   "pdfWords": 2550,
   "moduleWords": 2526,
   "ratio": 0.991,
   "lessons": 5,
   "questions": 11,
   "images": 7,
   "headings": 13,
   "longBlocks": 0,
   "longestBlock": 253,
   "codeBlocks": 1,
   "artefacts": 12,
   "genericTitles": 1,
   "digestGrade": "A",
   "moduleGrade": "B",
   "verdict": "Accurate summary of enterprise-architecture strategy; raw-text artefacts remain.",
   "verified": [
    "Aligning architecture decisions with long-term business goals is the source's central argument.",
    "Agile EA, shared architecture responsibility and lean/modular design are all supported.",
    "Diagrams aid visualisation, communication and planning of IT structures, as stated.",
    "Tooling categories (modelling, collaboration, analysis) and the four challenges match the source."
   ],
   "issues": [
    "12 artefacts, including table headers and navigation.",
    "1 generic lesson title.",
    "2 quiz defects."
   ],
   "missing": [
    "7 extracted diagrams/tables are unused.",
    "The EA tooling comparison table is flattened into prose."
   ],
   "quizNote": "11 questions; 2 defective.",
   "quizStats": {
    "total": 11,
    "answerInStem": 2,
    "navDerived": 5,
    "noSourceClause": 3,
    "genericAnswer": 2
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "ch07",
   "title": "System Analysis and Design",
   "track": "architecture",
   "source": "Chapter 7 System Analysis and Design_ Tutorial & Best Practices _ Multiplayer.pdf",
   "pages": 20,
   "pdfWords": 3253,
   "moduleWords": 3210,
   "ratio": 0.987,
   "lessons": 5,
   "questions": 13,
   "images": 7,
   "headings": 24,
   "longBlocks": 0,
   "longestBlock": 257,
   "codeBlocks": 2,
   "artefacts": 9,
   "genericTitles": 2,
   "digestGrade": "A",
   "moduleGrade": "B",
   "verdict": "Accurate; the five-step SAD flow, ATAM/SAAM and CAP are all correctly represented.",
   "verified": [
    "Requirements -> objectives -> current-system examination -> feature design -> implementation plan is quoted almost exactly.",
    "ATAM and SAAM are correctly described as architecture-evaluation methods against project objectives.",
    "The CAP theorem is attributed correctly and framed as a consistency/availability/partition trade-off.",
    "AI-assisted analysis, cloud design platforms and DevOps tooling are the source's listed trends."
   ],
   "issues": [
    "9 artefacts (navigation/table fragments).",
    "2 generic lesson titles.",
    "2 quiz defects."
   ],
   "missing": [
    "7 extracted figures are unused.",
    "The evaluation-method comparison is prose-only."
   ],
   "quizNote": "13 questions; 2 defective.",
   "quizStats": {
    "total": 13,
    "answerInStem": 2,
    "navDerived": 4,
    "noSourceClause": 4,
    "genericAnswer": 0
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "ch08",
   "title": "System Architecture Design",
   "track": "architecture",
   "source": "Chapter 8 System Architecture Design_ Tutorial & Best Practices _ Multiplayer.pdf",
   "pages": 31,
   "pdfWords": 5135,
   "moduleWords": 5124,
   "ratio": 0.998,
   "lessons": 8,
   "questions": 20,
   "images": 11,
   "headings": 16,
   "longBlocks": 0,
   "longestBlock": 222,
   "codeBlocks": 1,
   "artefacts": 14,
   "genericTitles": 5,
   "digestGrade": "A",
   "moduleGrade": "B",
   "verdict": "Accurate; the monolith-across-nodes point is quoted correctly and the design trade-offs are well captured.",
   "verified": [
    "Strong consistency costs latency while eventual consistency can serve stale data - supported.",
    "Up-front versus agile design balance and dynamic load balancing are both explicit in the source.",
    "Monitoring and centralised logging from the start are recommended in the source.",
    "'Each node runs the complete stack' for a distributed monolith matches the source nearly verbatim."
   ],
   "issues": [
    "14 artefacts, including repeated navigation text.",
    "5 of 8 lesson titles are generic.",
    "9 quiz defects."
   ],
   "missing": [
    "11 extracted figures are unused.",
    "The consistency-model comparison table is flattened."
   ],
   "quizNote": "20 questions; 9 defective - the highest defect rate among the 12 core chapters.",
   "quizStats": {
    "total": 20,
    "answerInStem": 9,
    "navDerived": 4,
    "noSourceClause": 3,
    "genericAnswer": 4
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "ch09",
   "title": "Software Architecture Documentation",
   "track": "architecture",
   "source": "Chapter 9 Software Architecture Documentation_ Tutorial & Best Practices _ Multiplayer.pdf",
   "pages": 22,
   "pdfWords": 3470,
   "moduleWords": 3448,
   "ratio": 0.994,
   "lessons": 8,
   "questions": 12,
   "images": 8,
   "headings": 35,
   "longBlocks": 0,
   "longestBlock": 255,
   "codeBlocks": 0,
   "artefacts": 14,
   "genericTitles": 1,
   "digestGrade": "A",
   "moduleGrade": "B",
   "verdict": "Accurate; including the full sprint-by-sprint documentation plan.",
   "verified": [
    "Technical debt and costly rework from neglected documentation are stated in the source.",
    "Dynamic diagrams staying relevant and the case for versioned artefacts are supported.",
    "Sprint 0, sprint planning, execution, review and retrospective are all present in the source.",
    "Ongoing maintenance rather than a one-off deliverable is the source's conclusion."
   ],
   "issues": [
    "14 artefacts, including site navigation and newsletter boilerplate.",
    "4 quiz defects."
   ],
   "missing": [
    "8 extracted figures are unused.",
    "The phase-by-phase documentation table is flattened into prose."
   ],
   "quizNote": "12 questions; 4 defective.",
   "quizStats": {
    "total": 12,
    "answerInStem": 4,
    "navDerived": 3,
    "noSourceClause": 3,
    "genericAnswer": 1
   },
   "lessonsWithoutQuiz": 3
  },
  {
   "id": "ch10",
   "title": "Distributed Systems Design",
   "track": "architecture",
   "source": "Chapter 10 Distributed Systems Design_ Tutorial & Best Practices _ Multiplayer.pdf",
   "pages": 23,
   "pdfWords": 4139,
   "moduleWords": 4117,
   "ratio": 0.995,
   "lessons": 7,
   "questions": 14,
   "images": 10,
   "headings": 22,
   "longBlocks": 0,
   "longestBlock": 278,
   "codeBlocks": 1,
   "artefacts": 14,
   "genericTitles": 2,
   "digestGrade": "B",
   "moduleGrade": "B",
   "verdict": "Accurate on the seven patterns and seven practices, with one invented detail in the ambassador bullet.",
   "verified": [
    "Seven design patterns and seven best practices are both explicitly counted in the source.",
    "Circuit breaker, CQRS and event sourcing definitions match the source.",
    "The seven practices (design up front, split by function, clear interfaces, protocols, security, monitoring, docs) are all present."
   ],
   "issues": [
    "FACTUAL: the ambassador bullet says it offloads 'retries'; the source lists logging, monitoring and routing. Routing is dropped and retries is not in the source.",
    "14 artefacts, including the pattern-summary table flattened into a paragraph.",
    "2 quiz defects."
   ],
   "missing": [
    "10 extracted diagrams are unused.",
    "The pattern summary table loses its columns."
   ],
   "quizNote": "14 questions; 2 defective.",
   "quizStats": {
    "total": 14,
    "answerInStem": 2,
    "navDerived": 5,
    "noSourceClause": 3,
    "genericAnswer": 3
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "ch11",
   "title": "System Design Primer",
   "track": "architecture",
   "source": "Chapter 11 System Design Primer & Examples _ Multiplayer.pdf",
   "pages": 26,
   "pdfWords": 4164,
   "moduleWords": 4117,
   "ratio": 0.989,
   "lessons": 6,
   "questions": 13,
   "images": 10,
   "headings": 22,
   "longBlocks": 0,
   "longestBlock": 244,
   "codeBlocks": 0,
   "artefacts": 12,
   "genericTitles": 3,
   "digestGrade": "A",
   "moduleGrade": "B",
   "verdict": "Accurate primer digest; all seven quality goals and both scaling models are correct.",
   "verified": [
    "Scalability, reliability, maintainability, consistency, security, networking and performance are the source's list.",
    "The design blueprint's seven areas match.",
    "Horizontal versus vertical scaling trade-offs are described correctly, including the single-machine ceiling.",
    "Load balancing and caching benefits match the source."
   ],
   "issues": [
    "12 artefacts.",
    "3 generic lesson titles.",
    "5 quiz defects."
   ],
   "missing": [
    "10 extracted figures are unused.",
    "The scaling comparison is prose-only."
   ],
   "quizNote": "13 questions; 5 defective.",
   "quizStats": {
    "total": 13,
    "answerInStem": 5,
    "navDerived": 2,
    "noSourceClause": 3,
    "genericAnswer": 2
   },
   "lessonsWithoutQuiz": 1
  },
  {
   "id": "ch12",
   "title": "Backend Architecture",
   "track": "architecture",
   "source": "Chapter 12 Backend Architecture_ Tutorial & Best Practices _ Multiplayer.pdf",
   "pages": 17,
   "pdfWords": 2897,
   "moduleWords": 2860,
   "ratio": 0.987,
   "lessons": 6,
   "questions": 12,
   "images": 6,
   "headings": 19,
   "longBlocks": 0,
   "longestBlock": 249,
   "codeBlocks": 2,
   "artefacts": 15,
   "genericTitles": 1,
   "digestGrade": "A",
   "moduleGrade": "B",
   "verdict": "Accurate; backend components, iterative design and failure costs are all correctly summarised.",
   "verified": [
    "Servers, databases, APIs and auth are the source's common components; queues, caches and orchestration are the 'more complex' additions.",
    "Iterative/RDUF design is recommended by the source.",
    "Downtime, maintainability and security risks of poor backend design are stated."
   ],
   "issues": [
    "15 artefacts, including navigation and repeated headings.",
    "1 generic lesson title.",
    "3 quiz defects."
   ],
   "missing": [
    "6 extracted diagrams are unused.",
    "The component table is flattened."
   ],
   "quizNote": "12 questions; 3 defective.",
   "quizStats": {
    "total": 12,
    "answerInStem": 3,
    "navDerived": 3,
    "noSourceClause": 6,
    "genericAnswer": 2
   },
   "lessonsWithoutQuiz": 1
  },
  {
   "id": "decoding-ms",
   "title": "Decoding Microservices: Best Practices Handbook",
   "track": "architecture",
   "source": "Decoding Microservices_ Best Practices Handbook for Developers.pdf",
   "pages": 8,
   "pdfWords": 2009,
   "moduleWords": 1974,
   "ratio": 0.983,
   "lessons": 3,
   "questions": 7,
   "images": 0,
   "headings": 8,
   "longBlocks": 0,
   "longestBlock": 276,
   "codeBlocks": 0,
   "artefacts": 5,
   "genericTitles": 0,
   "digestGrade": "B",
   "moduleGrade": "B",
   "verdict": "Good short digest; one bullet (fallbacks) is not clearly supported by the handbook's text.",
   "verified": [
    "Avoiding the distributed monolith and aligning services to business domains are the handbook's first two rules.",
    "Shared process ownership ('if everybody owns it, nobody owns it') is quoted correctly.",
    "Choreography/orchestration balance, security from the start, central monitoring and one data store per service are all explicit."
   ],
   "issues": [
    "The 'plan fallbacks so services degrade gracefully' bullet could not be matched to source wording; the handbook talks about fault tolerance and failure handling, not fallbacks specifically.",
    "5 artefacts.",
    "4 quiz defects."
   ],
   "missing": [
    "The handbook's six-rule summary card is flattened into prose.",
    "No figures exist in the source, so nothing visual is missing."
   ],
   "quizNote": "7 questions; 4 defective.",
   "quizStats": {
    "total": 7,
    "answerInStem": 4,
    "navDerived": 0,
    "noSourceClause": 2,
    "genericAnswer": 1
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "ms-diagram",
   "title": "Microservices Diagram: Best Practices",
   "track": "architecture",
   "source": "Microservices Diagram_ Best Practices & Examples _ Multiplayer.pdf",
   "pages": 19,
   "pdfWords": 2726,
   "moduleWords": 2707,
   "ratio": 0.993,
   "lessons": 7,
   "questions": 6,
   "images": 5,
   "headings": 40,
   "longBlocks": 0,
   "longestBlock": 239,
   "codeBlocks": 2,
   "artefacts": 7,
   "genericTitles": 2,
   "digestGrade": "B",
   "moduleGrade": "C",
   "verdict": "Useful component list, but one recommendation is misstated and the diagram examples are absent.",
   "verified": [
    "Microservice, API gateway, service registry, load balancer, event bus and orchestrator are the source's components.",
    "Splitting large architectures into smaller diagrams is recommended verbatim.",
    "Inconsistent notation as a pitfall is supported."
   ],
   "issues": [
    "FACTUAL: 'use color sparingly' misstates the source, which says use color 'purposefully and consistently' to highlight essential elements.",
    "40 headings for 7 lessons - the module is over-fragmented into fragments.",
    "6 quiz questions for 7 lessons is very thin."
   ],
   "missing": [
    "All 5 example diagrams are unused - fatal for a diagramming guide.",
    "The component/shape table is flattened."
   ],
   "quizNote": "6 questions; no defects detected, but coverage is thin.",
   "quizStats": {
    "total": 6,
    "answerInStem": 0,
    "navDerived": 0,
    "noSourceClause": 0,
    "genericAnswer": 1
   },
   "lessonsWithoutQuiz": 3
  },
  {
   "id": "aws-book",
   "title": "System Design on AWS (excerpt)",
   "track": "architecture",
   "source": "System Design on AWS.pdf",
   "pages": 66,
   "pdfWords": 19779,
   "moduleWords": 19847,
   "ratio": 1.003,
   "lessons": 21,
   "questions": 55,
   "images": 14,
   "headings": 78,
   "longBlocks": 26,
   "longestBlock": 448,
   "codeBlocks": 53,
   "artefacts": 58,
   "genericTitles": 14,
   "digestGrade": "A",
   "moduleGrade": "C",
   "verdict": "Digest is accurate, but the module is raw book text: page headers, TOC, figure captions and split code.",
   "verified": [
    "The concept list, four trade-off pairs and five guidelines match the book's Chapter 1 structure.",
    "Belady's algorithm, queue-, recency- and frequency-based policies and the allowlist policy are all correct.",
    "Cache invalidation and read-/write-intensive strategies are present."
   ],
   "issues": [
    "58 artefacts: running page headers ('System Design Concepts | 7'), table-of-contents lines, figure captions and copyright text appear as lesson content.",
    "26 blocks exceed 350 words (longest 448); 53 code blocks are fragments split from listings.",
    "14 of 21 lesson titles are generic ('Part N').",
    "17 quiz defects out of 55."
   ],
   "missing": [
    "14 extracted figures/diagrams are unused.",
    "Tables and code listings lose their formatting and structure.",
    "Only an excerpt of the book is present, but the module presents it as a complete treatment of 'System Design on AWS'."
   ],
   "quizNote": "55 questions; 17 defective.",
   "quizStats": {
    "total": 55,
    "answerInStem": 17,
    "navDerived": 3,
    "noSourceClause": 9,
    "genericAnswer": 3
   },
   "lessonsWithoutQuiz": 1
  },
  {
   "id": "hyperautomation",
   "title": "Hyperautomation Tech Stack Guide",
   "track": "architecture",
   "source": "The Ultimate Guide to Building Your Hyperautomation Tech Stack.pdf",
   "pages": 15,
   "pdfWords": 4068,
   "moduleWords": 3986,
   "ratio": 0.98,
   "lessons": 9,
   "questions": 14,
   "images": 0,
   "headings": 4,
   "longBlocks": 1,
   "longestBlock": 353,
   "codeBlocks": 2,
   "artefacts": 14,
   "genericTitles": 1,
   "digestGrade": "A",
   "moduleGrade": "B",
   "verdict": "Accurate; the four-stage stack and the 62% collaboration statistic are both verified.",
   "verified": [
    "Design/implement -> test/deploy -> automate/manage -> analyse/improve are the guide's exact four stages.",
    "The 62% figure is exact: '62% of IT decision-makers and business leaders say ... IT and business users cannot easily collaborate on individual processes'.",
    "Legacy modernisation and human work such as compliance checks are the guide's own examples.",
    "The three challenges (complex business-critical processes, IT/business disconnect, infrastructure limits) are supported."
   ],
   "issues": [
    "14 artefacts; one block exceeds 350 words.",
    "14 quiz questions for 9 lessons; 3 defective.",
    "The guide's other statistics (86% orchestration, 50 endpoints, 19% growth) are omitted from the digest."
   ],
   "missing": [
    "The guide's stage-by-stage capability tables are flattened into prose.",
    "The 86% process-orchestration statistic, a headline finding, is absent."
   ],
   "quizNote": "14 questions; 3 defective.",
   "quizStats": {
    "total": 14,
    "answerInStem": 3,
    "navDerived": 0,
    "noSourceClause": 5,
    "genericAnswer": 1
   },
   "lessonsWithoutQuiz": 2
  },
  {
   "id": "g-tools",
   "title": "Gaming Backend: Suggested Tool Mapping",
   "track": "gaming",
   "source": "GamingBackend/Gaming Backend.pdf",
   "pages": 9,
   "pdfWords": 810,
   "moduleWords": 946,
   "ratio": 1.168,
   "lessons": 2,
   "questions": 3,
   "images": 0,
   "headings": 12,
   "longBlocks": 0,
   "longestBlock": 142,
   "codeBlocks": 3,
   "artefacts": 5,
   "genericTitles": 1,
   "digestGrade": "C",
   "moduleGrade": "C",
   "verdict": "MATERIAL MISREPRESENTATION: the PDF is a ten-section backend checklist; the digest describes only its small tool-mapping table.",
   "verified": [
    "Every row of the tool-mapping table is transcribed correctly (NestJS + PostgreSQL/Redis, Open Match/Redwood, WebSocket + Redis + PG, Agones/GameLift/Firebase, Redis pub-sub/Socket.IO, PostgreSQL/TimescaleDB/ClickHouse, Next.js + NestJS).",
    "The mapping is explicitly 'based on your stack', as the digest says."
   ],
   "issues": [
    "FRAMING ERROR: the document is titled 'Comprehensive Backend Game Logic Checklist' and spends most of its 1,009 words on ten areas (auth, matchmaking, sessions, state sync, rules, persistence, security, social, analytics, operations). The digest's 'quick map from each backend concern to a tool' omits that checklist entirely.",
    "'WebSockets' (plural) vs the source's 'WebSocket' - cosmetic.",
    "Only 2 lessons and 3 quiz questions for the whole checklist."
   ],
   "missing": [
    "The entire ten-section checklist - the substantive content of the document.",
    "Operational and infrastructure concerns, matchmaking edge cases and security/fairness controls."
   ],
   "quizNote": "3 questions; all 3 defective (answer visible in the stem).",
   "quizStats": {
    "total": 3,
    "answerInStem": 3,
    "navDerived": 0,
    "noSourceClause": 3,
    "genericAnswer": 0
   },
   "lessonsWithoutQuiz": 1
  },
  {
   "id": "g-realtime",
   "title": "Building a Scalable Multiplayer Game Architecture",
   "track": "gaming",
   "source": "GamingBackend/Building a Scalable Multiplayer Game Architecture.pdf",
   "pages": 7,
   "pdfWords": 1305,
   "moduleWords": 1280,
   "ratio": 0.981,
   "lessons": 2,
   "questions": 3,
   "images": 2,
   "headings": 1,
   "longBlocks": 0,
   "longestBlock": 329,
   "codeBlocks": 0,
   "artefacts": 1,
   "genericTitles": 1,
   "digestGrade": "A",
   "moduleGrade": "B",
   "verdict": "Accurate and well attributed; the module is short but faithful.",
   "verified": [
    "Author is Kevin Glass, Founding Engineer at Rune - attribution is correct.",
    "The video-conferencing/WebRTC comparison is in the source.",
    "Geographic placement of real-time regional servers and persistent player connections are both explicit.",
    "Avoiding database reads in core network flows and preloading session data in memory is quoted closely."
   ],
   "issues": [
    "Only one heading; a 329-word wall of text.",
    "3 quiz questions for 1,280 words."
   ],
   "missing": [
    "Both architecture diagrams are extracted but unused."
   ],
   "quizNote": "3 questions; 1 defective.",
   "quizStats": {
    "total": 3,
    "answerInStem": 1,
    "navDerived": 0,
    "noSourceClause": 2,
    "genericAnswer": 0
   },
   "lessonsWithoutQuiz": 1
  },
  {
   "id": "g-medium-backend",
   "title": "Creating a Scalable Backend for Multiplayer Games",
   "track": "gaming",
   "source": "GamingBackend/Creating Scalable Backend Architecture for Multiplayer Games _ by Argentics _ Medium.pdf",
   "pages": 13,
   "pdfWords": 1726,
   "moduleWords": 1703,
   "ratio": 0.987,
   "lessons": 4,
   "questions": 9,
   "images": 13,
   "headings": 16,
   "longBlocks": 0,
   "longestBlock": 268,
   "codeBlocks": 10,
   "artefacts": 8,
   "genericTitles": 1,
   "digestGrade": "A",
   "moduleGrade": "B",
   "verdict": "Accurate overview of scalability, containers and security; screenshots are absent.",
   "verified": [
    "Load balancing to prevent any single server being overloaded is defined correctly.",
    "Cloud, containers and microservices with autoscaling are the source's technology answer.",
    "HTTPS/TLS and encryption of sensitive data such as passwords are both recommended.",
    "Balancing scalability against budget is the article's explicit conclusion."
   ],
   "issues": [
    "13 images extracted (many are article screenshots); none are displayed.",
    "8 artefacts; 10 code-fragment blocks."
   ],
   "missing": [
    "The architecture and autoscaling illustrations.",
    "The article's cost discussion loses its examples."
   ],
   "quizNote": "9 questions; 2 defective.",
   "quizStats": {
    "total": 9,
    "answerInStem": 2,
    "navDerived": 0,
    "noSourceClause": 1,
    "genericAnswer": 0
   },
   "lessonsWithoutQuiz": 1
  },
  {
   "id": "g-network",
   "title": "How to Build Multiplayer Games and Network Architectures",
   "track": "gaming",
   "source": "GamingBackend/How to Build Multiplayer Games and Network Architectures.pdf",
   "pages": 12,
   "pdfWords": 2079,
   "moduleWords": 2104,
   "ratio": 1.012,
   "lessons": 3,
   "questions": 7,
   "images": 0,
   "headings": 0,
   "longBlocks": 0,
   "longestBlock": 235,
   "codeBlocks": 0,
   "artefacts": 1,
   "genericTitles": 3,
   "digestGrade": "A",
   "moduleGrade": "C",
   "verdict": "Accurate digest; the module has no headings at all and reads as one continuous block.",
   "verified": [
    "FPS/racing games needing near-real-time updates and dedicated servers is supported.",
    "Overcooked as a small co-op P2P example is exact.",
    "Client-server authority and broadcast, P2P latency/trust trade-offs and hybrid PUBG are all in the source."
   ],
   "issues": [
    "Zero headings; 11 paragraphs with no section breaks.",
    "All 3 lesson titles are generic.",
    "7 quiz questions for 3 lessons."
   ],
   "missing": [
    "The network-topology diagrams are not represented (no images extracted).",
    "Protocol comparison content is flattened."
   ],
   "quizNote": "7 questions; 2 defective.",
   "quizStats": {
    "total": 7,
    "answerInStem": 2,
    "navDerived": 0,
    "noSourceClause": 1,
    "genericAnswer": 0
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "g-getgud",
   "title": "Mastering Multiplayer Game Architecture: Choosing the Right Approach",
   "track": "gaming",
   "source": "GamingBackend/Mastering Multiplayer Game Architecture_ Choosing the Right Approach - Getgud.io.pdf",
   "pages": 35,
   "pdfWords": 3804,
   "moduleWords": 3778,
   "ratio": 0.993,
   "lessons": 5,
   "questions": 15,
   "images": 1,
   "headings": 0,
   "longBlocks": 0,
   "longestBlock": 148,
   "codeBlocks": 0,
   "artefacts": 11,
   "genericTitles": 5,
   "digestGrade": "B",
   "moduleGrade": "C",
   "verdict": "Mostly accurate, but hosting options are misframed as cons and the module has no headings.",
   "verified": [
    "Server-controlled logic making cheating harder and a single source of truth are both stated.",
    "Inputs to the server, state back to clients, and client-side prediction with server reconciliation are all covered.",
    "AWS GameLift and Photon Engine are named in the source."
   ],
   "issues": [
    "FRAMING: 'Client-server cons: the server carries heavy load and needs solid hosting (examples: GameLift, Photon)' presents the source's server-technology options as drawbacks; the source lists them under 'Server Selection'.",
    "Zero headings; 11 artefacts; all 5 lesson titles generic.",
    "6 quiz defects out of 15."
   ],
   "missing": [
    "The only extracted diagram is unused.",
    "The comparison tables are flattened into prose."
   ],
   "quizNote": "15 questions; 6 defective.",
   "quizStats": {
    "total": 15,
    "answerInStem": 6,
    "navDerived": 0,
    "noSourceClause": 2,
    "genericAnswer": 1
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "g-modern-services",
   "title": "How to Build Modern Gaming Services",
   "track": "gaming",
   "source": "GamingBackend/How to build modern gaming services — with reference architecture.pdf",
   "pages": 14,
   "pdfWords": 1785,
   "moduleWords": 1777,
   "ratio": 0.996,
   "lessons": 3,
   "questions": 7,
   "images": 20,
   "headings": 5,
   "longBlocks": 0,
   "longestBlock": 310,
   "codeBlocks": 1,
   "artefacts": 10,
   "genericTitles": 2,
   "digestGrade": "A",
   "moduleGrade": "C",
   "verdict": "Accurate summary of the reference architecture, but all 20 architecture diagrams are absent.",
   "verified": [
    "Shared services (entitlements) reused across games is the article's premise.",
    "The outage blast-radius risk and data-loss example are supported.",
    "The five requirements (near-instant consistency, resilient availability, elastic scalability, low latency, minimal complexity) are exact.",
    "Data locality and multi-region deployment are central to the source."
   ],
   "issues": [
    "20 extracted diagrams/screenshots are unused - the 'reference architecture' is delivered as text only.",
    "10 artefacts; 2 generic lesson titles."
   ],
   "missing": [
    "The multi-region reference architecture diagram, the article's main artefact.",
    "The entitlements service flow diagram."
   ],
   "quizNote": "7 questions; all 7 defective (primarily answer-in-stem).",
   "quizStats": {
    "total": 7,
    "answerInStem": 0,
    "navDerived": 0,
    "noSourceClause": 1,
    "genericAnswer": 1
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "g-ttl",
   "title": "Row-Level TTL in CockroachDB for MMORPGs",
   "track": "gaming",
   "source": "GamingBackend/Managing Row-Level TTL in CockroachDB for High-Traffic MMORPGs.pdf",
   "pages": 13,
   "pdfWords": 1376,
   "moduleWords": 1339,
   "ratio": 0.973,
   "lessons": 2,
   "questions": 6,
   "images": 17,
   "headings": 3,
   "longBlocks": 0,
   "longestBlock": 199,
   "codeBlocks": 0,
   "artefacts": 11,
   "genericTitles": 1,
   "digestGrade": "A",
   "moduleGrade": "C",
   "verdict": "Technically accurate, but the source's PDF extraction is garbled and the module reproduces the damage plus newsletter boilerplate.",
   "verified": [
    "TTL candidates (session logs, temporary inventories, buffs, auction listings, matchmaking queues) match.",
    "CREATE TABLE ... WITH (ttl_expire_after = '24h') and ALTER TABLE ... SET (ttl_expire_after = ...) are correct.",
    "Staggering deletions and range partitioning for high ingestion are recommended by the source.",
    "REGIONAL BY ROW for multi-region locality is correctly described."
   ],
   "issues": [
    "Garbled text survives into the module (e.g. 'AdTdTiLtiionnMaMlly...' in the REGIONAL BY ROW section), plus mojibake replacement characters.",
    "Newsletter form text ('Work email', 'Submit', 'unsubscribe') appears as lesson content.",
    "17 images unused; 11 artefacts; 1 quiz defect."
   ],
   "missing": [
    "SQL examples are run inline instead of formatted code blocks.",
    "The step-by-step TTL diagrams are absent."
   ],
   "quizNote": "6 questions; 1 defective.",
   "quizStats": {
    "total": 6,
    "answerInStem": 1,
    "navDerived": 0,
    "noSourceClause": 3,
    "genericAnswer": 0
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "g-open-match-guide",
   "title": "Matchmaking using Open Match",
   "track": "gaming",
   "source": "GamingBackend/Matchmaking using Open Match _ Open Match.pdf",
   "pages": 5,
   "pdfWords": 951,
   "moduleWords": 946,
   "ratio": 0.995,
   "lessons": 2,
   "questions": 3,
   "images": 3,
   "headings": 0,
   "longBlocks": 1,
   "longestBlock": 404,
   "codeBlocks": 0,
   "artefacts": 0,
   "genericTitles": 1,
   "digestGrade": "A",
   "moduleGrade": "C",
   "verdict": "Accurate on the matchmaking flow; the module is three paragraphs, one of them 404 words.",
   "verified": [
    "Director -> FetchMatches -> MatchFunction -> tickets -> matches is the exact sequence.",
    "Match profiles filtering tickets and custom logic living in the Match Function are correct.",
    "Assignments and SetAssignment are described consistently with the source."
   ],
   "issues": [
    "Only 3 paragraphs and no headings; a single 404-word block.",
    "3 quiz questions for the whole guide."
   ],
   "missing": [
    "The 3 sequence/architecture diagrams are unused.",
    "The step-by-step allocation flow is compressed into prose."
   ],
   "quizNote": "3 questions; no defects detected.",
   "quizStats": {
    "total": 3,
    "answerInStem": 0,
    "navDerived": 0,
    "noSourceClause": 0,
    "genericAnswer": 0
   },
   "lessonsWithoutQuiz": 1
  },
  {
   "id": "g-open-match-intro",
   "title": "Open Match: Overview and Step-by-Step Introduction",
   "track": "gaming",
   "source": "GamingBackend/Open Match experience_ overview and step-by-step introduction _ by Argentics _ Medium.pdf",
   "pages": 13,
   "pdfWords": 1400,
   "moduleWords": 1381,
   "ratio": 0.986,
   "lessons": 3,
   "questions": 6,
   "images": 17,
   "headings": 17,
   "longBlocks": 0,
   "longestBlock": 231,
   "codeBlocks": 6,
   "artefacts": 7,
   "genericTitles": 0,
   "digestGrade": "A",
   "moduleGrade": "B",
   "verdict": "Accurate introduction; attribution to Unity and the Kubernetes/Redis details are correct.",
   "verified": [
    "Open Match is described as an open-source Kubernetes-based framework co-founded with Unity.",
    "Front end tickets, Director, dedicated servers and the matcher roles are correct.",
    "The Redis-backed state store is stated explicitly.",
    "The Halloween Doodle 2018 scale example is in the source."
   ],
   "issues": [
    "17 images unused; 7 artefacts.",
    "1 quiz defect."
   ],
   "missing": [
    "The architecture overview and flow diagrams.",
    "The step-by-step walkthrough's screenshots."
   ],
   "quizNote": "6 questions; 1 defective.",
   "quizStats": {
    "total": 6,
    "answerInStem": 1,
    "navDerived": 0,
    "noSourceClause": 1,
    "genericAnswer": 0
   },
   "lessonsWithoutQuiz": 1
  },
  {
   "id": "g-patterns",
   "title": "Game Programming Patterns (overview)",
   "track": "gaming",
   "source": "GamingBackend/Gaming Pattern Overview.pdf",
   "pages": 40,
   "pdfWords": 10349,
   "moduleWords": 10854,
   "ratio": 1.049,
   "lessons": 16,
   "questions": 24,
   "images": 0,
   "headings": 12,
   "longBlocks": 7,
   "longestBlock": 472,
   "codeBlocks": 19,
   "artefacts": 37,
   "genericTitles": 1,
   "digestGrade": "A",
   "moduleGrade": "C",
   "verdict": "Accurate overview, but the module reproduces front matter, TOC and page numbers as lesson content.",
   "verified": [
    "Chapter 1's architecture/performance/simplicity argument is correctly summarised.",
    "The Command pattern with configurable input and undo/redo is the correct chapter focus.",
    "The four later categories (sequencing, behavioural, decoupling, optimisation) are exact."
   ],
   "issues": [
    "37 artefacts: table of contents, copyright/front matter, page numbers and figure captions.",
    "7 blocks exceed 350 words (longest 472); 19 code fragments.",
    "24 quiz questions for 16 lessons."
   ],
   "missing": [
    "All book figures are absent (no images extracted).",
    "The excerpt only covers the introduction and Command chapter, but the digest describes the whole book's later sections without saying they are not included."
   ],
   "quizNote": "24 questions; 2 defective.",
   "quizStats": {
    "total": 24,
    "answerInStem": 2,
    "navDerived": 1,
    "noSourceClause": 7,
    "genericAnswer": 2
   },
   "lessonsWithoutQuiz": 5
  },
  {
   "id": "g-sebi",
   "title": "SEBI's Cybersecurity and Cyber Resilience Framework",
   "track": "gaming",
   "source": "GamingBackend/Decoding SEBI’s Cybersecurity and Cyber Resilience Framework.pdf",
   "pages": 19,
   "pdfWords": 1834,
   "moduleWords": 1792,
   "ratio": 0.977,
   "lessons": 4,
   "questions": 9,
   "images": 25,
   "headings": 7,
   "longBlocks": 0,
   "longestBlock": 207,
   "codeBlocks": 5,
   "artefacts": 11,
   "genericTitles": 1,
   "digestGrade": "B",
   "moduleGrade": "C",
   "verdict": "Mostly accurate, but the digest understates the framework's structure (four parts, not two) and the module is badly mangled.",
   "verified": [
    "The CSCRF objectives (reduce cyber risk, align with best practice, cut audit toil) are quoted correctly.",
    "The six functions (Governance/Identify/Protect/Detect/Respond/Recover) and the example controls are in the source.",
    "The disclaimer that this is not legal advice matches the source's disclaimer."
   ],
   "issues": [
    "INCOMPLETE: the digest says the framework is 'structured into parts: objectives and standards, then guidelines'. The source defines four parts, adding Part III Compliance Formats and Part IV Annexures and References.",
    "The module renders author names as headings, the disclaimer and body paragraphs as code blocks, and contains mojibake ('SEBI�s').",
    "11 artefacts, including newsletter and 'Keep reading' boilerplate.",
    "Misfiled: a securities-market compliance blog sits in the Gaming Backend track only because of its folder."
   ],
   "missing": [
    "Parts III and IV of the framework are absent from the digest.",
    "25 extracted figures/diagrams are unused.",
    "The compliance-area tables are flattened."
   ],
   "quizNote": "9 questions; all 9 defective (answer-in-stem).",
   "quizStats": {
    "total": 9,
    "answerInStem": 5,
    "navDerived": 0,
    "noSourceClause": 2,
    "genericAnswer": 2
   },
   "lessonsWithoutQuiz": 1
  },
  {
   "id": "s-schema",
   "title": "Database Schema: SQL Examples and Best Practices",
   "track": "sql",
   "source": "SQLdatabase/Database schema_ SQL schema examples and best practices.pdf",
   "pages": 14,
   "pdfWords": 1986,
   "moduleWords": 1949,
   "ratio": 0.981,
   "lessons": 2,
   "questions": 6,
   "images": 1,
   "headings": 0,
   "longBlocks": 0,
   "longestBlock": 195,
   "codeBlocks": 0,
   "artefacts": 5,
   "genericTitles": 2,
   "digestGrade": "C",
   "moduleGrade": "B",
   "verdict": "One mechanism is misattributed: the source uses a user-defined schema for access control, not roles.",
   "verified": [
    "The users/orders/products example with primary and foreign keys is exact.",
    "Automatic schema enforcement on every write is stated in the source.",
    "Designing the schema before application code is the article's advice."
   ],
   "issues": [
    "FACTUAL: 'Use roles to grant access to some tables...' - the source describes creating a user-defined schema (e.g. logistics) containing only orders and shipments, so the PII table is inaccessible. 'Roles' does not appear in the source.",
    "The bullet adds 'checks' to keys/types; the source discusses primary/foreign keys and data types, not CHECK constraints.",
    "5 artefacts; 2 generic lesson titles."
   ],
   "missing": [
    "The example schema diagram is unused.",
    "The SQL DDL examples are flattened into prose."
   ],
   "quizNote": "6 questions; 2 defective.",
   "quizStats": {
    "total": 6,
    "answerInStem": 2,
    "navDerived": 0,
    "noSourceClause": 2,
    "genericAnswer": 0
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "s-molt",
   "title": "Accelerate Data Migrations with MOLT Schema Conversion Tool",
   "track": "sql",
   "source": "SQLdatabase/Accelerate Data Migrations with MOLT Schema Conversion Tool.pdf",
   "pages": 11,
   "pdfWords": 1116,
   "moduleWords": 1122,
   "ratio": 1.005,
   "lessons": 2,
   "questions": 6,
   "images": 4,
   "headings": 0,
   "longBlocks": 0,
   "longestBlock": 193,
   "codeBlocks": 2,
   "artefacts": 1,
   "genericTitles": 2,
   "digestGrade": "B",
   "moduleGrade": "B",
   "verdict": "Accurate on MOLT's tools; one claim overstates what the source guarantees about verification.",
   "verified": [
    "MOLT = Migrate Off Legacy Tools; SCT, Fetch and Verify are correctly named.",
    "SCT's GUI showing incompatibilities and suggested changes is supported.",
    "Legacy sources (Oracle, MySQL, SQL Server) are correct."
   ],
   "issues": [
    "'Migrations are only done when the data is verified as accurate and complete' overstates the source, which says you 'can check with MOLT Verify that your migration has been successful'.",
    "2 generic lesson titles; 1 artefact."
   ],
   "missing": [
    "4 screenshots of the SCT GUI are unused.",
    "The conversion workflow's step detail is compressed."
   ],
   "quizNote": "6 questions; 1 defective.",
   "quizStats": {
    "total": 6,
    "answerInStem": 1,
    "navDerived": 0,
    "noSourceClause": 1,
    "genericAnswer": 0
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "s-enterprise",
   "title": "CockroachDB: An Enterprise Architecture Overview",
   "track": "sql",
   "source": "SQLdatabase/CockroachDB_ An Enterprise Architecture Overview.pdf",
   "pages": 39,
   "pdfWords": 6177,
   "moduleWords": 6177,
   "ratio": 1.0,
   "lessons": 8,
   "questions": 14,
   "images": 4,
   "headings": 0,
   "longBlocks": 0,
   "longestBlock": 233,
   "codeBlocks": 5,
   "artefacts": 15,
   "genericTitles": 7,
   "digestGrade": "C",
   "moduleGrade": "C",
   "verdict": "Two accuracy problems: the digest invents ACID wording and misstates the source's five architecture attributes.",
   "verified": [
    "No single point of failure, automated failover and self-healing are all stated.",
    "Cloud lock-in avoidance across clouds or own hardware is correct.",
    "Gaming, routing/logistics and generative AI are listed use cases.",
    "Audit logging for HIPAA/GDPR/SOC 2 is accurate."
   ],
   "issues": [
    "FACTUAL: 'Gives ACID consistency...' - the word ACID does not appear in this document; the source says 'transactionally consistent'.",
    "FACTUAL: the source's five attributes are Operational Excellence, Security, Reliability, Performance and Cost-Efficiency. The digest replaces this with 'automation, scalability, security, reliability, performance and simplified operations', dropping cost-efficiency and adding items that are not the source's list.",
    "Zero headings, 7 of 8 lesson titles generic, 15 artefacts.",
    "4 quiz defects."
   ],
   "missing": [
    "4 extracted figures are unused.",
    "The five-attribute structure is lost in the module and misrepresented in the digest."
   ],
   "quizNote": "14 questions; 4 defective.",
   "quizStats": {
    "total": 14,
    "answerInStem": 4,
    "navDerived": 0,
    "noSourceClause": 2,
    "genericAnswer": 0
   },
   "lessonsWithoutQuiz": 2
  },
  {
   "id": "s-payments",
   "title": "Payment Orchestration with Spreedly and CockroachDB",
   "track": "sql",
   "source": "SQLdatabase/Payment orchestration with Spreedly and CockroachDB.pdf",
   "pages": 8,
   "pdfWords": 722,
   "moduleWords": 716,
   "ratio": 0.992,
   "lessons": 1,
   "questions": 3,
   "images": 2,
   "headings": 0,
   "longBlocks": 0,
   "longestBlock": 140,
   "codeBlocks": 1,
   "artefacts": 3,
   "genericTitles": 1,
   "digestGrade": "A",
   "moduleGrade": "B",
   "verdict": "Accurate customer story; 'NoSQL' is a small inference beyond the source's 'key-value store'.",
   "verified": [
    "SOC 2 and PCI-DSS, zero data loss and near-constant uptime are all in the source.",
    "The move from a legacy key-value store to CockroachDB is stated.",
    "Security and GDPR data-localisation benefits are cited."
   ],
   "issues": [
    "The digest says 'key-value NoSQL store'; the source says only 'legacy key-value store'. NoSQL is a reasonable inference but not stated.",
    "One lesson and 3 questions for the whole case study.",
    "3 artefacts."
   ],
   "missing": [
    "2 images are unused.",
    "The event's customer quotes and migration detail are compressed."
   ],
   "quizNote": "3 questions; no defects detected, but coverage is minimal.",
   "quizStats": {
    "total": 3,
    "answerInStem": 0,
    "navDerived": 0,
    "noSourceClause": 1,
    "genericAnswer": 0
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "s-backups",
   "title": "Simplifying CockroachDB Backups to S3",
   "track": "sql",
   "source": "SQLdatabase/Simplifying CockroachDB Backups to S3_ A Guided Approach.pdf",
   "pages": 9,
   "pdfWords": 1012,
   "moduleWords": 953,
   "ratio": 0.942,
   "lessons": 2,
   "questions": 5,
   "images": 0,
   "headings": 0,
   "longBlocks": 0,
   "longestBlock": 137,
   "codeBlocks": 2,
   "artefacts": 2,
   "genericTitles": 2,
   "digestGrade": "A",
   "moduleGrade": "B",
   "verdict": "Accurate and practical; the backup paths and external-connection steps are correctly represented.",
   "verified": [
    "Managed backups are default in CockroachDB Cloud and visible under Backup and Restore.",
    "Customer-managed backups use EXTERNAL CONNECTION to S3.",
    "External connection for abstraction vs specified authentication for control is the source's advice.",
    "Incremental/revision-history backups and the GC window are described correctly.",
    "Dropping an existing external connection before recreating it is in the source."
   ],
   "issues": [
    "No images (the console walkthrough is text-only).",
    "2 generic lesson titles; 5 questions for 2 lessons."
   ],
   "missing": [
    "The console screenshots and the S3 bucket layout are absent.",
    "The full command sequence is partly flattened."
   ],
   "quizNote": "5 questions; no defects detected.",
   "quizStats": {
    "total": 5,
    "answerInStem": 0,
    "navDerived": 0,
    "noSourceClause": 2,
    "genericAnswer": 0
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "s-11-failures",
   "title": "Surviving 11 Application and Database Failures",
   "track": "sql",
   "source": "SQLdatabase/Surviving 11 Application and Database Failures with CockroachDB.pdf",
   "pages": 15,
   "pdfWords": 1443,
   "moduleWords": 1440,
   "ratio": 0.998,
   "lessons": 2,
   "questions": 6,
   "images": 4,
   "headings": 0,
   "longBlocks": 0,
   "longestBlock": 152,
   "codeBlocks": 0,
   "artefacts": 1,
   "genericTitles": 2,
   "digestGrade": "A",
   "moduleGrade": "B",
   "verdict": "Accurate catalogue of failure modes and resilience features.",
   "verified": [
    "Unhandled exceptions, crashes, resource exhaustion and network outages are all covered.",
    "Transactional consistency plus automated failover is the source's core claim.",
    "Workload spreading, monitoring/self-healing and configuration-drift reduction are all explicit."
   ],
   "issues": [
    "1 artefact; 4 images unused.",
    "2 generic lesson titles; 6 questions for 2 lessons."
   ],
   "missing": [
    "The 11-failure checklist table is flattened into prose.",
    "The failure-scenario diagrams are absent."
   ],
   "quizNote": "6 questions; 1 defective.",
   "quizStats": {
    "total": 6,
    "answerInStem": 1,
    "navDerived": 0,
    "noSourceClause": 3,
    "genericAnswer": 1
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "s-dr",
   "title": "Surviving Failures: Disaster Recovery with CockroachDB",
   "track": "sql",
   "source": "SQLdatabase/Surviving Failures_ Disaster Recovery with CockroachDB.pdf",
   "pages": 12,
   "pdfWords": 1027,
   "moduleWords": 1050,
   "ratio": 1.022,
   "lessons": 2,
   "questions": 5,
   "images": 5,
   "headings": 0,
   "longBlocks": 0,
   "longestBlock": 169,
   "codeBlocks": 0,
   "artefacts": 1,
   "genericTitles": 2,
   "digestGrade": "A",
   "moduleGrade": "B",
   "verdict": "Accurate disaster-recovery digest; RPO/RTO, PITR and off-site storage are all correct.",
   "verified": [
    "Region outage, catastrophic corruption and accidental deletion are the source's whole-cluster risks.",
    "PITR via continuous backup and revision history is correct.",
    "S3, GCS and Azure Blob as off-site targets are named.",
    "RPO/RTO are defined and used to size the recovery plan."
   ],
   "issues": [
    "1 artefact; 5 images unused.",
    "2 generic lesson titles; 5 questions for 2 lessons."
   ],
   "missing": [
    "The DR topology diagrams are absent.",
    "The backup/restore command examples are compressed."
   ],
   "quizNote": "5 questions; no defects detected.",
   "quizStats": {
    "total": 5,
    "answerInStem": 0,
    "navDerived": 0,
    "noSourceClause": 2,
    "genericAnswer": 0
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "s-large",
   "title": "Surviving Large-Scale Failures with CockroachDB",
   "track": "sql",
   "source": "SQLdatabase/Surviving Large-Scale Failures with CockroachDB.pdf",
   "pages": 10,
   "pdfWords": 911,
   "moduleWords": 916,
   "ratio": 1.005,
   "lessons": 2,
   "questions": 4,
   "images": 4,
   "headings": 0,
   "longBlocks": 0,
   "longestBlock": 145,
   "codeBlocks": 0,
   "artefacts": 4,
   "genericTitles": 2,
   "digestGrade": "B",
   "moduleGrade": "B",
   "verdict": "Mostly accurate, but 'continuous security patching' is not in the source.",
   "verified": [
    "AWS/Azure/GCP outages and cascading failures are the article's framing.",
    "Centralised configuration and automated deployment to reduce drift are stated.",
    "RBAC, encryption at rest and TLS in transit are explicit.",
    "Audit logging is part of the security discussion."
   ],
   "issues": [
    "FACTUAL: 'continuous security patching' is not mentioned in the source. The source recommends centralised configuration, automated deployment, RBAC, encryption and monitoring.",
    "4 artefacts; 2 generic lesson titles.",
    "4 questions for 2 lessons."
   ],
   "missing": [
    "4 images are unused.",
    "The provider-outage examples are compressed."
   ],
   "quizNote": "4 questions; no defects detected.",
   "quizStats": {
    "total": 4,
    "answerInStem": 0,
    "navDerived": 0,
    "noSourceClause": 1,
    "genericAnswer": 1
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "s-tips",
   "title": "Top 7 Tips for Optimizing a Distributed SQL Database",
   "track": "sql",
   "source": "SQLdatabase/Top 7 Tips for Optimizing Your Distributed SQL Database.pdf",
   "pages": 7,
   "pdfWords": 599,
   "moduleWords": 618,
   "ratio": 1.032,
   "lessons": 1,
   "questions": 3,
   "images": 1,
   "headings": 0,
   "longBlocks": 0,
   "longestBlock": 130,
   "codeBlocks": 0,
   "artefacts": 3,
   "genericTitles": 1,
   "digestGrade": "B",
   "moduleGrade": "B",
   "verdict": "Accurate but incomplete: the digest mentions only five of the seven tips.",
   "verified": [
    "Partial/composite indexes, index monitoring, EXPLAIN ANALYZE (DISTSQL), super regions, automated backups and range/admission control are all in the source.",
    "Seven numbered tips exist in the source."
   ],
   "issues": [
    "INCOMPLETE: the digest omits tip 1 (design schemas for distribution) and tip 3 (embrace transaction retries), two of the seven.",
    "One lesson and 3 questions for all seven tips.",
    "3 artefacts."
   ],
   "missing": [
    "Two of the seven tips are absent from the digest.",
    "The per-tip reference tables are flattened."
   ],
   "quizNote": "3 questions; no defects detected, but only 3 of 7 tips are assessed.",
   "quizStats": {
    "total": 3,
    "answerInStem": 0,
    "navDerived": 0,
    "noSourceClause": 2,
    "genericAnswer": 0
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "s-modernization",
   "title": "What is Application Modernization?",
   "track": "sql",
   "source": "SQLdatabase/What is Application Modernization_.pdf",
   "pages": 9,
   "pdfWords": 908,
   "moduleWords": 895,
   "ratio": 0.986,
   "lessons": 1,
   "questions": 3,
   "images": 1,
   "headings": 0,
   "longBlocks": 0,
   "longestBlock": 160,
   "codeBlocks": 0,
   "artefacts": 3,
   "genericTitles": 1,
   "digestGrade": "A",
   "moduleGrade": "B",
   "verdict": "Accurate and concise; the distributed-SQL value proposition is correctly stated.",
   "verified": [
    "Microservices, container infrastructure and a distributed transactional data layer are the source's three traits of a modern app.",
    "Data modernisation bridging legacy stores and cloud is stated.",
    "ACID, horizontal read/write scale, no single point of failure and governance are quoted from the source.",
    "Data locality as a differentiator is supported."
   ],
   "issues": [
    "One lesson and 3 questions for the whole article.",
    "3 artefacts."
   ],
   "missing": [
    "The one extracted image is unused.",
    "The modernization-path diagram is absent."
   ],
   "quizNote": "3 questions; no defects detected.",
   "quizStats": {
    "total": 3,
    "answerInStem": 0,
    "navDerived": 0,
    "noSourceClause": 2,
    "genericAnswer": 1
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "s-postgres",
   "title": "PostgreSQL-Compatible Databases: Two Approaches",
   "track": "sql",
   "source": "SQLdatabase/“PostgreSQL Compatible Databases”_ A Tale of Two Approaches.pdf",
   "pages": 14,
   "pdfWords": 1466,
   "moduleWords": 1437,
   "ratio": 0.98,
   "lessons": 2,
   "questions": 6,
   "images": 4,
   "headings": 0,
   "longBlocks": 0,
   "longestBlock": 210,
   "codeBlocks": 1,
   "artefacts": 2,
   "genericTitles": 2,
   "digestGrade": "A",
   "moduleGrade": "B",
   "verdict": "Accurate; the fork-versus-rewrite argument and the three advantages of owning the stack are correct.",
   "verified": [
    "Compatibility depends on which PostgreSQL features matter to the application.",
    "Forking still requires mapping the forked SQL layer to distributed storage.",
    "CockroachDB rewrote the PostgreSQL-compatible SQL layer from scratch.",
    "The three advantages (less technical debt, better distributed performance, customer-experience optimisation) are in the source."
   ],
   "issues": [
    "2 generic lesson titles; 2 artefacts.",
    "6 questions for 2 lessons."
   ],
   "missing": [
    "4 diagrams are unused.",
    "The comparison table of approaches is flattened."
   ],
   "quizNote": "6 questions; no defects detected.",
   "quizStats": {
    "total": 6,
    "answerInStem": 1,
    "navDerived": 0,
    "noSourceClause": 3,
    "genericAnswer": 0
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "w-next-async",
   "title": "Next.js: No async Client Component",
   "track": "web",
   "source": "No async Client Component _ Next.js.pdf",
   "pages": 6,
   "pdfWords": 640,
   "moduleWords": 657,
   "ratio": 1.027,
   "lessons": 2,
   "questions": 4,
   "images": 1,
   "headings": 10,
   "longBlocks": 0,
   "longestBlock": 72,
   "codeBlocks": 108,
   "artefacts": 1,
   "genericTitles": 0,
   "digestGrade": "A",
   "moduleGrade": "C",
   "verdict": "Digest is correct, but the module's code is split line-by-line into 108 separate code blocks, destroying readability.",
   "verified": [
    "React Client Components cannot be async functions - exact.",
    "Fix 1 (convert to a Server Component) and Fix 2 (useEffect/SWR/React Query) are the documented options.",
    "Fix 3 (promise from a Server Component resolved with use()) matches the docs, including the Context Provider variant.",
    "Server-side fetching is the docs' recommended approach."
   ],
   "issues": [
    "157 blocks for 657 words; 108 blocks marked as code are individual lines, line numbers or fragments.",
    "Code fragments are misclassified as headings (e.g. '3 // This will cause an error').",
    "The module reads as a PDF dump rather than a lesson."
   ],
   "missing": [
    "Proper syntax-highlighted code blocks and the page's tabbed examples.",
    "The docs' navigation chrome is included instead."
   ],
   "quizNote": "4 questions; 2 defective.",
   "quizStats": {
    "total": 4,
    "answerInStem": 2,
    "navDerived": 0,
    "noSourceClause": 0,
    "genericAnswer": 0
   },
   "lessonsWithoutQuiz": 0
  },
  {
   "id": "w-piskel",
   "title": "Piskel: Free Online Sprite Editor (Terms)",
   "track": "web",
   "source": "Piskel - Free online sprite editor.pdf",
   "pages": 4,
   "pdfWords": 617,
   "moduleWords": 617,
   "ratio": 1.0,
   "lessons": 1,
   "questions": 0,
   "images": 0,
   "headings": 0,
   "longBlocks": 0,
   "longestBlock": 270,
   "codeBlocks": 1,
   "artefacts": 0,
   "genericTitles": 0,
   "digestGrade": "A",
   "moduleGrade": "C",
   "verdict": "Accurate summary of the terms, but this is a terms-of-service page with no quiz and little learning value.",
   "verified": [
    "Under-13 users need parental permission - stated.",
    "Acceptable-use restrictions, including obtaining other users' passwords, are stated.",
    "You may use your sprites commercially and Piskel claims no rights over them.",
    "Material changes get at least 30 days' notice; last updated June 16, 2021."
   ],
   "issues": [
    "Zero quiz questions for the only lesson.",
    "The module is raw legal text with site chrome ('Downloads About ...').",
    "Included in a learning library despite being a ToS page, not architecture content."
   ],
   "missing": [
    "No assessment or learning objective.",
    "The privacy-policy section is referenced but not included."
   ],
   "quizNote": "0 questions - the only module with no assessment.",
   "quizStats": {
    "total": 0,
    "answerInStem": 0,
    "navDerived": 0,
    "noSourceClause": 0,
    "genericAnswer": 0
   },
   "lessonsWithoutQuiz": 1
  }
 ],
 "corrections": [
  {
   "priority": "P1",
   "id": "s-enterprise",
   "issue": "Five architecture attributes are misstated; ACID is attributed to a document that never uses the term.",
   "fix": "Replace the bullet with the source's five: Operational Excellence, Security, Reliability, Performance, Cost-Efficiency. Say 'transactionally consistent', not ACID, or cite a source that says ACID."
  },
  {
   "priority": "P1",
   "id": "s-schema",
   "issue": "'Use roles to grant access' describes the wrong mechanism.",
   "fix": "Say 'create a user-defined schema containing only orders and shipments so the PII table is out of scope'. Remove 'checks' unless CHECK constraints are actually discussed."
  },
  {
   "priority": "P1",
   "id": "g-tools",
   "issue": "The digest describes only the tool-mapping table and omits the document's ten-section backend checklist.",
   "fix": "Rewrite the summary around the checklist (auth, matchmaking, sessions, state sync, rules, persistence, security, social, analytics, operations) and treat the tool table as one section."
  },
  {
   "priority": "P1",
   "id": "ch05",
   "issue": "'Harder debugging' contradicts the source, which lists 'more efficient debugging' as a microservices benefit.",
   "fix": "Replace with the source's actual downsides: too many languages, integration effort, operational overhead. Remove the debugging claim."
  },
  {
   "priority": "P1",
   "id": "s-large",
   "issue": "'Continuous security patching' is not in the source.",
   "fix": "List the source's mitigations: centralised configuration, automated deployment, RBAC, encryption at rest/TLS, audit logging and monitoring."
  },
  {
   "priority": "P2",
   "id": "g-sebi",
   "issue": "CSCRF is described as two-part; it has four parts.",
   "fix": "Add Part III (Compliance Formats) and Part IV (Annexures and References), or say 'four parts' explicitly."
  },
  {
   "priority": "P2",
   "id": "ch10",
   "issue": "Ambassador is said to handle 'retries'; the source says logging, monitoring and routing.",
   "fix": "Swap 'retries' for 'routing'."
  },
  {
   "priority": "P2",
   "id": "ms-diagram",
   "issue": "'Use color sparingly' is not the source's advice.",
   "fix": "Say 'use color purposefully and consistently to highlight essential elements'."
  },
  {
   "priority": "P2",
   "id": "s-molt",
   "issue": "'Migrations are only done when the data is verified' overstates the source.",
   "fix": "Say 'MOLT Verify checks that the migration succeeded and that the data is complete'."
  },
  {
   "priority": "P2",
   "id": "s-tips",
   "issue": "Two of the seven tips (schema design, transaction retries) are missing from the digest.",
   "fix": "Add both; the summary currently covers five of seven."
  },
  {
   "priority": "P2",
   "id": "ch01",
   "issue": "The anti-pattern list drops 'ineffective data management'.",
   "fix": "Restore the third item."
  },
  {
   "priority": "P3",
   "id": "all",
   "issue": "238 figures are extracted but never displayed; 373 navigation/table artefacts remain; 108 code blocks in w-next-async are split lines.",
   "fix": "Add an image block type and reference the extracted PNGs; strip chrome at generation time; render code and tables as structured blocks."
  }
 ]
};
