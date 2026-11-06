# Accuracy & Completeness Audit

**Subject:** the 40 learning modules and the `data.js` digest in this folder, checked against their source PDFs.

**Date:** 6 November 2026 · **Scope:** 40 modules, 702 PDF pages, 118,290 source words, 118,301 module words, 393 quiz questions.

---

## 1. Executive summary

The material is **faithful but not yet a course**.

- **Fidelity is high.** The module bodies contain essentially the same number of words as the source PDFs (118,301 vs 118,290; 37 of 40 modules at 98-100%). The prose is genuinely from the documents: verbatim block matching scores 0.95-1.00, and all 393 quiz answers occur in their source.
- **The digest is mostly accurate.** 27 of 40 summaries are accurate at the level of specific claims; 9 have minor overreach; 4 are graded C (ch05, g-tools, s-schema, s-enterprise). A fifth, s-large (graded B), also carries an unsupported claim and is included in the P1 fixes.
- **Completeness fails on everything that is not prose.** All 238 extracted figures are unused, tables are flattened, and 373 navigation/table artefacts are rendered as lesson text.
- **The quiz layer is not trustworthy.** 99 of 393 questions (25%) reveal the answer in the assembled stem, 41 are built from chapter titles, 102 have no matching source sentence, and 28 lessons have no quiz.
- **The site is also a copyright risk.** Near-verbatim reproduction of O'Reilly, Camunda, Multiplayer and Medium material is fine for a private study copy but not for publication.

### Scorecard

| Dimension | Result | Assessment |
|---|---|---|
| Source mapping | 40 / 40 PDFs mapped | Pass |
| Catalog consistency | 0 mismatches | Pass |
| Digest accuracy | 27 accurate · 9 minor · 4 needs correction | Mostly pass, 4 fixes |
| Prose coverage | ~98% of source words present | Pass (as a copy) |
| Figure/diagram coverage | 0 of 238 displayed | Fail |
| Lesson structure | 86 generic titles · 9 modules with no headings | Fail |
| Quiz validity | 99 answer leaks · 41 navigation-derived · 28 lessons unassessed | Fail |
| Copyright posture | Near-verbatim copies | Risk |

**Bottom line:** do not treat the module pages as condensed explanations; they are searchable transcripts. The summaries are a reasonable orientation layer once the four factual errors below are corrected, but the library is missing its diagrams, its tables and a usable assessment layer.

---

## 2. What was audited

The folder contains 40 PDFs, 40 `modules/*.js` files and 40 `data.js` entries. Each module was compared with the PDF named in its `source` field. The audit covers:

1. **Digest accuracy** - every summary sentence and bullet (219 claims) checked for proper nouns, numbers and technical assertions, then read against the relevant source passages.
2. **Module fidelity** - word ratios, verbatim shingle matching, and a search for text that is not in the source.
3. **Completeness** - source prose coverage, figures, tables, code and section structure.
4. **Quiz correctness** - each answer checked against the source, the stem and the option list.
5. **Site mechanics** - source mapping, catalog counts and the presence of orphan or duplicate entries.

### Method and limits

- Text was extracted with `pdftotext -enc UTF-8`; running heads and short navigation lines were filtered before coverage scoring.
- **Verbatim score** is the share of 7-word shingles in a module block that also occur in its PDF. **Coverage** is the word-weighted share of PDF paragraphs whose shingles occur in the module.
- Claims were checked mechanically for named entities and numbers, then reviewed manually against the nearest source passages. This catches fabricated specifics; it cannot prove that every paraphrase preserves the author's intent.
- Figures were not OCR'd. The audit can show that a figure is missing from the site, not whether its caption was reproduced correctly.
- The PDFs are treated as the authority. Where a PDF is itself a secondary source (blog tutorials, vendor guides), the audit checks consistency with that document, not independent truth.

---

## 3. Corpus-level findings

### 3.1 The modules are transcripts, not lessons

Total module text is 118,301 words against 118,290 words of PDF text (ratio 1.00). The distribution is tight: 37 of 40 modules are at 0.98-1.00, and the three below are extraction losses (s-backups 0.94, g-ttl 0.97, g-sebi 0.98).

This matters in three ways:

- **Pedagogy:** a lesson that is a 3,000-word article with 'Part 2' as its title is a reading assignment, not instruction. There is no chunking, no worked example, no prerequisite chain.
- **Copyright:** the site reproduces the sources rather than summarising them. The O'Reilly excerpt, Camunda guides and Medium articles are copied at essentially full length.
- **Maintenance:** any source correction has to be re-extracted; the 'summary' layer is the only editorial content and it is not what the lesson pages show.

### 3.2 The visual layer is missing

238 PNGs were extracted into `modules/media/<module>/` but nothing displays them. The block schema (`h`, `c`, `t`) has no image type, and no module references a media path. The loss is worst exactly where it hurts most:

| Module | Images extracted | Why it matters |
|---|---:|---|
| g-sebi | 25 | SEBI's Cybersecurity and Cyber Resilience Framework |
| g-modern-services | 20 | How to Build Modern Gaming Services |
| g-ttl | 17 | Row-Level TTL in CockroachDB for MMORPGs |
| g-open-match-intro | 17 | Open Match: Overview and Step-by-Step Introduction |
| aws-book | 14 | System Design on AWS (excerpt) |
| g-medium-backend | 13 | Creating a Scalable Backend for Multiplayer Games |
| ch08 | 11 | System Architecture Design |
| ch10 | 10 | Distributed Systems Design |
| ch11 | 10 | System Design Primer |
| ch03 | 8 | Software Architecture Diagram Example |

The diagram tutorials (ch03, ch05, ms-diagram) and the reference architectures (g-modern-services, g-ttl, g-sebi) are the clearest failures: the text explains figures the reader cannot see.

### 3.3 Extraction artefacts are presented as content

373 blocks are recognisable non-content: site navigation, table headers, chapter cross-reference lists, newsletter forms, author bylines and page headers. Examples:

- `ch01` lesson 1: `Concept` and `Description` as paragraphs, from a table header.
- `ch02` lesson 10: a list of other chapters ('Chapter 5 ... Chapter 7 ...') used as lesson text and as quiz material.
- `g-ttl` lesson 2: 'Work email', 'Submit', 'We will email you updates about CockroachDB. You can unsubscribe at any time.'
- `g-sebi` lesson 1: the two authors' names as headings; the disclaimer and body paragraphs rendered as code.
- `aws-book`: running page headers such as 'System Design Concepts | 7' and table-of-contents lines.

### 3.4 Structure is arbitrary

86 lesson titles are 'Part N'. Sixteen modules have no headings at all (ch05, g-network, g-getgud, g-open-match-guide, s-schema, s-molt, s-enterprise, s-payments, s-backups, s-11-failures, s-dr, s-large, s-tips, s-modernization, s-postgres, w-piskel). The largest paragraph is 493 words; 39 blocks exceed 350 words, 26 of them in aws-book.

A reader cannot see the source's own section structure, cannot skim, and cannot tell what a lesson is meant to teach.

### 3.5 The quiz layer

| Metric | Count | Share |
|---|---:|---:|
| Questions | 393 | 100% |
| Answer visible in the stem/heading | 99 | 25% |
| Built from chapter/navigation text | 41 | 10% |
| No matching source sentence | 102 | 26% |
| Generic one-word answer | 41 | 10% |
| Lessons with no quiz | 28 | - |

The generator's answer key is usually *correct* (every answer occurs in the PDF), but the stems are often malformed because heading text is glued to the sentence before the blank. Typical failures:

- `ch02` L10: 'Example Chapter 5: Microservices Diagram ... Chapter 7: _____ Analysis and Design' -> answer 'System'. This tests a table of contents, not microservices.
- `ch01` L2: '_____/Sharding Partitioning (or sharding) is...' -> answer 'Partitioning'. The answer is printed immediately after the blank.
- `ch03` L2: 'Benefits of software architecture diagrams _____ architecture diagrams provide numerous benefits...' -> answer 'Software'. Ungrammatical and self-answering.

### 3.6 Digest accuracy

| Grade | Meaning | Modules |
|---|---|---:|
| A | Accurate at the level of checkable claims | 27 |
| B | Minor overreach or unsupported detail | 9 |
| C | Concrete factual error to fix | 4 |

The four C-grade digests:

1. **ch05** - says microservices make debugging harder; the source lists 'more efficient debugging' as a benefit.
2. **g-tools** - describes a ten-section backend checklist as a 'quick map' to tools.
3. **s-schema** - attributes access control to roles; the source uses a user-defined schema.
4. **s-enterprise** - invents an ACID claim and misstates the five architecture attributes.

### 3.7 What the audit did *not* find

- No fabricated quiz answers.
- No missing or orphaned modules: 40 PDFs -> 40 modules -> 40 entries.
- No catalog drift: the advertised lesson, question and word counts match the generated files.
- No wholesale hallucination in the digest: the entity/number check over 219 claims produced one genuine miss, and the manual review found paraphrase errors rather than invented topics.

---

## 4. Corrections required

### P1 - factual, fix before using the digest

**s-enterprise** - Five architecture attributes are misstated; ACID is attributed to a document that never uses the term.  
*Fix:* Replace the bullet with the source's five: Operational Excellence, Security, Reliability, Performance, Cost-Efficiency. Say 'transactionally consistent', not ACID, or cite a source that says ACID.

**s-schema** - 'Use roles to grant access' describes the wrong mechanism.  
*Fix:* Say 'create a user-defined schema containing only orders and shipments so the PII table is out of scope'. Remove 'checks' unless CHECK constraints are actually discussed.

**g-tools** - The digest describes only the tool-mapping table and omits the document's ten-section backend checklist.  
*Fix:* Rewrite the summary around the checklist (auth, matchmaking, sessions, state sync, rules, persistence, security, social, analytics, operations) and treat the tool table as one section.

**ch05** - 'Harder debugging' contradicts the source, which lists 'more efficient debugging' as a microservices benefit.  
*Fix:* Replace with the source's actual downsides: too many languages, integration effort, operational overhead. Remove the debugging claim.

**s-large** - 'Continuous security patching' is not in the source.  
*Fix:* List the source's mitigations: centralised configuration, automated deployment, RBAC, encryption at rest/TLS, audit logging and monitoring.

### P2 - accuracy and completeness

**g-sebi** - CSCRF is described as two-part; it has four parts.  
*Fix:* Add Part III (Compliance Formats) and Part IV (Annexures and References), or say 'four parts' explicitly.

**ch10** - Ambassador is said to handle 'retries'; the source says logging, monitoring and routing.  
*Fix:* Swap 'retries' for 'routing'.

**ms-diagram** - 'Use color sparingly' is not the source's advice.  
*Fix:* Say 'use color purposefully and consistently to highlight essential elements'.

**s-molt** - 'Migrations are only done when the data is verified' overstates the source.  
*Fix:* Say 'MOLT Verify checks that the migration succeeded and that the data is complete'.

**s-tips** - Two of the seven tips (schema design, transaction retries) are missing from the digest.  
*Fix:* Add both; the summary currently covers five of seven.

**ch01** - The anti-pattern list drops 'ineffective data management'.  
*Fix:* Restore the third item.

### P3 - structural

**all** - 238 figures are extracted but never displayed; 373 navigation/table artefacts remain; 108 code blocks in w-next-async are split lines.  
*Fix:* Add an image block type and reference the extracted PNGs; strip chrome at generation time; render code and tables as structured blocks.

---

## 5. What critical content is missing

Because the module bodies are copies, missing *prose* is limited (about 2% of source words). The critical gaps are elsewhere:

1. **Figures and diagrams** - 0 of 238 displayed. The most damaging losses are the sequence/network diagrams in ch03, the microservice diagrams in ch05 and ms-diagram, the multi-region reference architecture in g-modern-services, and the TTL/SEBI diagrams.
2. **Tables** - the concept/description table (ch01), pattern summary (ch10), comparison tables (aws-book, ch08, s-enterprise), and the compliance-area tables (g-sebi) are flattened into prose.
3. **Digest-level omissions** - the g-tools checklist; s-tips tips 1 and 3; CSCRF Parts III and IV; the hyperautomation 86% orchestration statistic; the aws-book's other chapters (only an excerpt is present, although the module title does not say so).
4. **Assessment** - 28 lessons have no quiz; w-piskel has none at all; 3-question modules cannot cover 7 tips or a 10-section checklist.
5. **Structure and provenance** - no source section names, page references or stated learning objectives. The reader cannot tell which part of a 66-page book a lesson comes from.
6. **Code and formulas** - SQL is inlined, TypeScript is split into 108 single-line blocks, and tables of commands lose their formatting.

---

## 6. Per-module analysis

Each section gives the measured shape of the module, the verdict on the digest, the claims that were verified against the source, the errors or risks found, what is missing, and the quiz state. Grades: **A** accurate/clean, **B** minor issues/usable but incomplete, **C** needs correction/structurally broken.

### ch01 - Distributed Systems Architecture

`Chapter 1 Distributed Systems Architecture_ Tutorial & Best Practices _ Multiplayer.pdf` · 21 pages · 3,655 source words · 3,642 module words · 5 lessons · 12 questions

| | |
|---|---|
| Digest grade | **B - Minor issues** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 1.00 |
| Figures extracted / displayed | 2 / 0 |
| Artefact blocks | 13 |
| Generic lesson titles | 3 of 5 |
| Longest block | 234 words |
| Lessons without a quiz | 1 |

Accurate digest; the module is a near-verbatim copy of the article with table and navigation artefacts.

**Verified against the source**
- Four architecture shapes (client-server, peer-to-peer, 3-tier, N-tier) match the source.
- Failover via a heartbeat between at least two servers is described correctly.
- Strong, causal and linearizable consistency, plus last-write-wins and vector clocks, are all present in the source.
- Hash-, range- and directory-based partitioning and the directory's application-layer flexibility are supported.
- Quorum voting explicitly 'helps balance consistency and availability' in the source.

**Errors and risks**
- The anti-pattern bullet drops the source's third item, 'ineffective data management'.
- Lesson 1 renders table headers 'Concept' and 'Description' as body paragraphs.
- Three of five lesson titles are the generic 'Part 1/Part 2/Part 3'.
- 13 extraction artefacts: navigation/table fragments in lesson text.

**Missing or degraded**
- Both article figures are extracted to modules/media/ch01 but never shown; the module has no image block type.
- Table rows are flattened into prose, losing the concept/description structure.

**Quiz:** 12 questions; 3 defective (the answer is already visible in the assembled stem or heading).

---
### ch02 - Microservices Design Pattern

`Chapter 2 Microservices Design Pattern_ Tutorial & Best Practices _ Multiplayer.pdf` · 30 pages · 4,859 source words · 4,822 module words · 10 lessons · 23 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 0.99 |
| Figures extracted / displayed | 7 / 0 |
| Artefact blocks | 17 |
| Generic lesson titles | 2 of 10 |
| Longest block | 231 words |
| Lessons without a quiz | 1 |

Accurate and well supported; main weaknesses are raw-text artefacts and quiz generation.

**Verified against the source**
- Each service owning its data and the autonomy argument match the source.
- APIs keeping services loosely coupled and technology-independent is stated directly.
- Retries, timeouts and circuit breakers as isolation mechanisms are all named in the source.
- Independent horizontal scaling of hot services and the challenges (communication, consistency, complexity) are supported.
- Service discovery, API gateways and event-driven architecture are the source's own list of remedies.

**Errors and risks**
- 17 artefacts, including a chapter cross-reference list (Chapter 5/7/9...) rendered as lesson content.
- Two lesson titles are generic ('Part 1', 'Part 2').
- 6 quiz defects, several of them built from the navigation list.

**Missing or degraded**
- All 7 diagrams are extracted yet unused, so the illustrated architecture examples are absent.
- Tables comparing patterns are flattened into prose.

**Quiz:** 23 questions; 6 defective; several questions test chapter titles rather than concepts.

---
### ch03 - Software Architecture Diagram Example

`Chapter 3 Software Architecture Diagram Example & Tutorial _ Multiplayer.pdf` · 21 pages · 2,763 source words · 2,737 module words · 5 lessons · 5 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **C - Structurally broken** |
| Word ratio | 0.99 |
| Figures extracted / displayed | 8 / 0 |
| Artefact blocks | 9 |
| Generic lesson titles | 2 of 5 |
| Longest block | 242 words |
| Lessons without a quiz | 1 |

Digest is faithful, but this is a diagram tutorial whose diagrams are entirely absent from the module.

**Verified against the source**
- The three diagram types (system architecture, sequence, network) match.
- Sequence-diagram elements (actors, lifelines, activation bars, messages) are listed exactly.
- Benefits (communication, early problem detection, documentation) and the five-step process are supported.
- The over/under-detail and stale-diagram pitfalls are stated almost verbatim in the source.

**Errors and risks**
- Navigation boilerplate ('Sign Pricing Team Contact Docs...') appears as the opening lesson text.
- 8 extracted images are unused in a module that exists to teach diagramming.
- Only 5 quiz questions for 5 lessons and 2,737 words.

**Missing or degraded**
- Every worked example diagram and the sequence-diagram legend.
- The article's visual comparison of diagram types.

**Quiz:** 5 questions; 1 defective.

---
### ch04 - API Flow Diagram

`Chapter 4 API Flow Diagram_ Best Practices & Examples _ Multiplayer.pdf` · 15 pages · 2,817 source words · 2,805 module words · 5 lessons · 7 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 1.00 |
| Figures extracted / displayed | 6 / 0 |
| Artefact blocks | 13 |
| Generic lesson titles | 2 of 5 |
| Longest block | 344 words |
| Lessons without a quiz | 0 |

Accurate digest of a short how-to; module text is faithful but illustration-free.

**Verified against the source**
- Defining API behaviour, onboarding and cross-team collaboration are the source's stated uses.
- The 'create account' high-level example and the drill-down into components are supported.
- The claim that diagrams reveal how a change affects other components is a fair reading of the source.
- Generative AI moving toward automatic code/diagram syncing is stated in the source.

**Errors and risks**
- 13 artefacts, mostly site navigation and newsletter text.
- Two generic lesson titles.
- 2 quiz defects.

**Missing or degraded**
- All 6 flow diagrams are unused, removing the article's main teaching device.
- The step-by-step bank-account example survives only as prose.

**Quiz:** 7 questions; 2 defective.

---
### ch05 - Microservices Architecture Diagram Examples

`Chapter 5 Microservices Architecture Diagram Examples - DevTeam.Space.pdf` · 13 pages · 3,963 source words · 3,932 module words · 4 lessons · 12 questions

| | |
|---|---|
| Digest grade | **C - Needs correction** |
| Module grade | **C - Structurally broken** |
| Word ratio | 0.99 |
| Figures extracted / displayed | 8 / 0 |
| Artefact blocks | 4 |
| Generic lesson titles | 4 of 4 |
| Longest block | 493 words |
| Lessons without a quiz | 0 |

Mostly grounded, but one bullet contradicts the source and the module has no section structure.

**Verified against the source**
- The Walmart case study is accurate: the site could not handle 6 million page views per minute over consecutive Black Fridays.
- The Netflix story is accurate: a missing semicolon in 2008 took the site down; the migration completed by December 2011.
- DDD, RESTful APIs and leadership buy-in are the source's own recommendations.
- The 'too many languages' downside is explicitly called a double-edged sword in the source.

**Errors and risks**
- FACTUAL: 'Downsides: ... harder debugging' contradicts the source, which lists 'more efficient debugging' as a benefit of microservices.
- 'One bug or deploy can take down the whole product' overstates the source's single-bug anecdote.
- No headings at all; four blocks exceed 350 words (one is 493 words).
- All four lesson titles are generic ('Part 1'-'Part 4').

**Missing or degraded**
- 8 extracted diagrams are unused.
- The article's pros/cons comparison and architecture sketches are lost to prose.

**Quiz:** 12 questions; 2 defective.

---
### ch06 - Enterprise Architecture Strategy

`Chapter 6 Enterprise Architecture Strategy_ Best Practices _ Multiplayer.pdf` · 17 pages · 2,550 source words · 2,526 module words · 5 lessons · 11 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 0.99 |
| Figures extracted / displayed | 7 / 0 |
| Artefact blocks | 12 |
| Generic lesson titles | 1 of 5 |
| Longest block | 253 words |
| Lessons without a quiz | 0 |

Accurate summary of enterprise-architecture strategy; raw-text artefacts remain.

**Verified against the source**
- Aligning architecture decisions with long-term business goals is the source's central argument.
- Agile EA, shared architecture responsibility and lean/modular design are all supported.
- Diagrams aid visualisation, communication and planning of IT structures, as stated.
- Tooling categories (modelling, collaboration, analysis) and the four challenges match the source.

**Errors and risks**
- 12 artefacts, including table headers and navigation.
- 1 generic lesson title.
- 2 quiz defects.

**Missing or degraded**
- 7 extracted diagrams/tables are unused.
- The EA tooling comparison table is flattened into prose.

**Quiz:** 11 questions; 2 defective.

---
### ch07 - System Analysis and Design

`Chapter 7 System Analysis and Design_ Tutorial & Best Practices _ Multiplayer.pdf` · 20 pages · 3,253 source words · 3,210 module words · 5 lessons · 13 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 0.99 |
| Figures extracted / displayed | 7 / 0 |
| Artefact blocks | 9 |
| Generic lesson titles | 2 of 5 |
| Longest block | 257 words |
| Lessons without a quiz | 0 |

Accurate; the five-step SAD flow, ATAM/SAAM and CAP are all correctly represented.

**Verified against the source**
- Requirements -> objectives -> current-system examination -> feature design -> implementation plan is quoted almost exactly.
- ATAM and SAAM are correctly described as architecture-evaluation methods against project objectives.
- The CAP theorem is attributed correctly and framed as a consistency/availability/partition trade-off.
- AI-assisted analysis, cloud design platforms and DevOps tooling are the source's listed trends.

**Errors and risks**
- 9 artefacts (navigation/table fragments).
- 2 generic lesson titles.
- 2 quiz defects.

**Missing or degraded**
- 7 extracted figures are unused.
- The evaluation-method comparison is prose-only.

**Quiz:** 13 questions; 2 defective.

---
### ch08 - System Architecture Design

`Chapter 8 System Architecture Design_ Tutorial & Best Practices _ Multiplayer.pdf` · 31 pages · 5,135 source words · 5,124 module words · 8 lessons · 20 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 1.00 |
| Figures extracted / displayed | 11 / 0 |
| Artefact blocks | 14 |
| Generic lesson titles | 5 of 8 |
| Longest block | 222 words |
| Lessons without a quiz | 0 |

Accurate; the monolith-across-nodes point is quoted correctly and the design trade-offs are well captured.

**Verified against the source**
- Strong consistency costs latency while eventual consistency can serve stale data - supported.
- Up-front versus agile design balance and dynamic load balancing are both explicit in the source.
- Monitoring and centralised logging from the start are recommended in the source.
- 'Each node runs the complete stack' for a distributed monolith matches the source nearly verbatim.

**Errors and risks**
- 14 artefacts, including repeated navigation text.
- 5 of 8 lesson titles are generic.
- 9 quiz defects.

**Missing or degraded**
- 11 extracted figures are unused.
- The consistency-model comparison table is flattened.

**Quiz:** 20 questions; 9 defective - the highest defect rate among the 12 core chapters.

---
### ch09 - Software Architecture Documentation

`Chapter 9 Software Architecture Documentation_ Tutorial & Best Practices _ Multiplayer.pdf` · 22 pages · 3,470 source words · 3,448 module words · 8 lessons · 12 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 0.99 |
| Figures extracted / displayed | 8 / 0 |
| Artefact blocks | 14 |
| Generic lesson titles | 1 of 8 |
| Longest block | 255 words |
| Lessons without a quiz | 3 |

Accurate; including the full sprint-by-sprint documentation plan.

**Verified against the source**
- Technical debt and costly rework from neglected documentation are stated in the source.
- Dynamic diagrams staying relevant and the case for versioned artefacts are supported.
- Sprint 0, sprint planning, execution, review and retrospective are all present in the source.
- Ongoing maintenance rather than a one-off deliverable is the source's conclusion.

**Errors and risks**
- 14 artefacts, including site navigation and newsletter boilerplate.
- 4 quiz defects.

**Missing or degraded**
- 8 extracted figures are unused.
- The phase-by-phase documentation table is flattened into prose.

**Quiz:** 12 questions; 4 defective.

---
### ch10 - Distributed Systems Design

`Chapter 10 Distributed Systems Design_ Tutorial & Best Practices _ Multiplayer.pdf` · 23 pages · 4,139 source words · 4,117 module words · 7 lessons · 14 questions

| | |
|---|---|
| Digest grade | **B - Minor issues** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 0.99 |
| Figures extracted / displayed | 10 / 0 |
| Artefact blocks | 14 |
| Generic lesson titles | 2 of 7 |
| Longest block | 278 words |
| Lessons without a quiz | 0 |

Accurate on the seven patterns and seven practices, with one invented detail in the ambassador bullet.

**Verified against the source**
- Seven design patterns and seven best practices are both explicitly counted in the source.
- Circuit breaker, CQRS and event sourcing definitions match the source.
- The seven practices (design up front, split by function, clear interfaces, protocols, security, monitoring, docs) are all present.

**Errors and risks**
- FACTUAL: the ambassador bullet says it offloads 'retries'; the source lists logging, monitoring and routing. Routing is dropped and retries is not in the source.
- 14 artefacts, including the pattern-summary table flattened into a paragraph.
- 2 quiz defects.

**Missing or degraded**
- 10 extracted diagrams are unused.
- The pattern summary table loses its columns.

**Quiz:** 14 questions; 2 defective.

---
### ch11 - System Design Primer

`Chapter 11 System Design Primer & Examples _ Multiplayer.pdf` · 26 pages · 4,164 source words · 4,117 module words · 6 lessons · 13 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 0.99 |
| Figures extracted / displayed | 10 / 0 |
| Artefact blocks | 12 |
| Generic lesson titles | 3 of 6 |
| Longest block | 244 words |
| Lessons without a quiz | 1 |

Accurate primer digest; all seven quality goals and both scaling models are correct.

**Verified against the source**
- Scalability, reliability, maintainability, consistency, security, networking and performance are the source's list.
- The design blueprint's seven areas match.
- Horizontal versus vertical scaling trade-offs are described correctly, including the single-machine ceiling.
- Load balancing and caching benefits match the source.

**Errors and risks**
- 12 artefacts.
- 3 generic lesson titles.
- 5 quiz defects.

**Missing or degraded**
- 10 extracted figures are unused.
- The scaling comparison is prose-only.

**Quiz:** 13 questions; 5 defective.

---
### ch12 - Backend Architecture

`Chapter 12 Backend Architecture_ Tutorial & Best Practices _ Multiplayer.pdf` · 17 pages · 2,897 source words · 2,860 module words · 6 lessons · 12 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 0.99 |
| Figures extracted / displayed | 6 / 0 |
| Artefact blocks | 15 |
| Generic lesson titles | 1 of 6 |
| Longest block | 249 words |
| Lessons without a quiz | 1 |

Accurate; backend components, iterative design and failure costs are all correctly summarised.

**Verified against the source**
- Servers, databases, APIs and auth are the source's common components; queues, caches and orchestration are the 'more complex' additions.
- Iterative/RDUF design is recommended by the source.
- Downtime, maintainability and security risks of poor backend design are stated.

**Errors and risks**
- 15 artefacts, including navigation and repeated headings.
- 1 generic lesson title.
- 3 quiz defects.

**Missing or degraded**
- 6 extracted diagrams are unused.
- The component table is flattened.

**Quiz:** 12 questions; 3 defective.

---
### decoding-ms - Decoding Microservices: Best Practices Handbook

`Decoding Microservices_ Best Practices Handbook for Developers.pdf` · 8 pages · 2,009 source words · 1,974 module words · 3 lessons · 7 questions

| | |
|---|---|
| Digest grade | **B - Minor issues** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 0.98 |
| Figures extracted / displayed | 0 / 0 |
| Artefact blocks | 5 |
| Generic lesson titles | 0 of 3 |
| Longest block | 276 words |
| Lessons without a quiz | 0 |

Good short digest; one bullet (fallbacks) is not clearly supported by the handbook's text.

**Verified against the source**
- Avoiding the distributed monolith and aligning services to business domains are the handbook's first two rules.
- Shared process ownership ('if everybody owns it, nobody owns it') is quoted correctly.
- Choreography/orchestration balance, security from the start, central monitoring and one data store per service are all explicit.

**Errors and risks**
- The 'plan fallbacks so services degrade gracefully' bullet could not be matched to source wording; the handbook talks about fault tolerance and failure handling, not fallbacks specifically.
- 5 artefacts.
- 4 quiz defects.

**Missing or degraded**
- The handbook's six-rule summary card is flattened into prose.
- No figures exist in the source, so nothing visual is missing.

**Quiz:** 7 questions; 4 defective.

---
### ms-diagram - Microservices Diagram: Best Practices

`Microservices Diagram_ Best Practices & Examples _ Multiplayer.pdf` · 19 pages · 2,726 source words · 2,707 module words · 7 lessons · 6 questions

| | |
|---|---|
| Digest grade | **B - Minor issues** |
| Module grade | **C - Structurally broken** |
| Word ratio | 0.99 |
| Figures extracted / displayed | 5 / 0 |
| Artefact blocks | 7 |
| Generic lesson titles | 2 of 7 |
| Longest block | 239 words |
| Lessons without a quiz | 3 |

Useful component list, but one recommendation is misstated and the diagram examples are absent.

**Verified against the source**
- Microservice, API gateway, service registry, load balancer, event bus and orchestrator are the source's components.
- Splitting large architectures into smaller diagrams is recommended verbatim.
- Inconsistent notation as a pitfall is supported.

**Errors and risks**
- FACTUAL: 'use color sparingly' misstates the source, which says use color 'purposefully and consistently' to highlight essential elements.
- 40 headings for 7 lessons - the module is over-fragmented into fragments.
- 6 quiz questions for 7 lessons is very thin.

**Missing or degraded**
- All 5 example diagrams are unused - fatal for a diagramming guide.
- The component/shape table is flattened.

**Quiz:** 6 questions; no defects detected, but coverage is thin.

---
### aws-book - System Design on AWS (excerpt)

`System Design on AWS.pdf` · 66 pages · 19,779 source words · 19,847 module words · 21 lessons · 55 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **C - Structurally broken** |
| Word ratio | 1.00 |
| Figures extracted / displayed | 14 / 0 |
| Artefact blocks | 58 |
| Generic lesson titles | 14 of 21 |
| Longest block | 448 words |
| Lessons without a quiz | 1 |

Digest is accurate, but the module is raw book text: page headers, TOC, figure captions and split code.

**Verified against the source**
- The concept list, four trade-off pairs and five guidelines match the book's Chapter 1 structure.
- Belady's algorithm, queue-, recency- and frequency-based policies and the allowlist policy are all correct.
- Cache invalidation and read-/write-intensive strategies are present.

**Errors and risks**
- 58 artefacts: running page headers ('System Design Concepts | 7'), table-of-contents lines, figure captions and copyright text appear as lesson content.
- 26 blocks exceed 350 words (longest 448); 53 code blocks are fragments split from listings.
- 14 of 21 lesson titles are generic ('Part N').
- 17 quiz defects out of 55.

**Missing or degraded**
- 14 extracted figures/diagrams are unused.
- Tables and code listings lose their formatting and structure.
- Only an excerpt of the book is present, but the module presents it as a complete treatment of 'System Design on AWS'.

**Quiz:** 55 questions; 17 defective.

---
### hyperautomation - Hyperautomation Tech Stack Guide

`The Ultimate Guide to Building Your Hyperautomation Tech Stack.pdf` · 15 pages · 4,068 source words · 3,986 module words · 9 lessons · 14 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 0.98 |
| Figures extracted / displayed | 0 / 0 |
| Artefact blocks | 14 |
| Generic lesson titles | 1 of 9 |
| Longest block | 353 words |
| Lessons without a quiz | 2 |

Accurate; the four-stage stack and the 62% collaboration statistic are both verified.

**Verified against the source**
- Design/implement -> test/deploy -> automate/manage -> analyse/improve are the guide's exact four stages.
- The 62% figure is exact: '62% of IT decision-makers and business leaders say ... IT and business users cannot easily collaborate on individual processes'.
- Legacy modernisation and human work such as compliance checks are the guide's own examples.
- The three challenges (complex business-critical processes, IT/business disconnect, infrastructure limits) are supported.

**Errors and risks**
- 14 artefacts; one block exceeds 350 words.
- 14 quiz questions for 9 lessons; 3 defective.
- The guide's other statistics (86% orchestration, 50 endpoints, 19% growth) are omitted from the digest.

**Missing or degraded**
- The guide's stage-by-stage capability tables are flattened into prose.
- The 86% process-orchestration statistic, a headline finding, is absent.

**Quiz:** 14 questions; 3 defective.

---
### g-tools - Gaming Backend: Suggested Tool Mapping

`GamingBackend/Gaming Backend.pdf` · 9 pages · 810 source words · 946 module words · 2 lessons · 3 questions

| | |
|---|---|
| Digest grade | **C - Needs correction** |
| Module grade | **C - Structurally broken** |
| Word ratio | 1.17 |
| Figures extracted / displayed | 0 / 0 |
| Artefact blocks | 5 |
| Generic lesson titles | 1 of 2 |
| Longest block | 142 words |
| Lessons without a quiz | 1 |

MATERIAL MISREPRESENTATION: the PDF is a ten-section backend checklist; the digest describes only its small tool-mapping table.

**Verified against the source**
- Every row of the tool-mapping table is transcribed correctly (NestJS + PostgreSQL/Redis, Open Match/Redwood, WebSocket + Redis + PG, Agones/GameLift/Firebase, Redis pub-sub/Socket.IO, PostgreSQL/TimescaleDB/ClickHouse, Next.js + NestJS).
- The mapping is explicitly 'based on your stack', as the digest says.

**Errors and risks**
- FRAMING ERROR: the document is titled 'Comprehensive Backend Game Logic Checklist' and spends most of its 1,009 words on ten areas (auth, matchmaking, sessions, state sync, rules, persistence, security, social, analytics, operations). The digest's 'quick map from each backend concern to a tool' omits that checklist entirely.
- 'WebSockets' (plural) vs the source's 'WebSocket' - cosmetic.
- Only 2 lessons and 3 quiz questions for the whole checklist.

**Missing or degraded**
- The entire ten-section checklist - the substantive content of the document.
- Operational and infrastructure concerns, matchmaking edge cases and security/fairness controls.

**Quiz:** 3 questions; all 3 defective (answer visible in the stem).

---
### g-realtime - Building a Scalable Multiplayer Game Architecture

`GamingBackend/Building a Scalable Multiplayer Game Architecture.pdf` · 7 pages · 1,305 source words · 1,280 module words · 2 lessons · 3 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 0.98 |
| Figures extracted / displayed | 2 / 0 |
| Artefact blocks | 1 |
| Generic lesson titles | 1 of 2 |
| Longest block | 329 words |
| Lessons without a quiz | 1 |

Accurate and well attributed; the module is short but faithful.

**Verified against the source**
- Author is Kevin Glass, Founding Engineer at Rune - attribution is correct.
- The video-conferencing/WebRTC comparison is in the source.
- Geographic placement of real-time regional servers and persistent player connections are both explicit.
- Avoiding database reads in core network flows and preloading session data in memory is quoted closely.

**Errors and risks**
- Only one heading; a 329-word wall of text.
- 3 quiz questions for 1,280 words.

**Missing or degraded**
- Both architecture diagrams are extracted but unused.

**Quiz:** 3 questions; 1 defective.

---
### g-medium-backend - Creating a Scalable Backend for Multiplayer Games

`GamingBackend/Creating Scalable Backend Architecture for Multiplayer Games _ by Argentics _ Medium.pdf` · 13 pages · 1,726 source words · 1,703 module words · 4 lessons · 9 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 0.99 |
| Figures extracted / displayed | 13 / 0 |
| Artefact blocks | 8 |
| Generic lesson titles | 1 of 4 |
| Longest block | 268 words |
| Lessons without a quiz | 1 |

Accurate overview of scalability, containers and security; screenshots are absent.

**Verified against the source**
- Load balancing to prevent any single server being overloaded is defined correctly.
- Cloud, containers and microservices with autoscaling are the source's technology answer.
- HTTPS/TLS and encryption of sensitive data such as passwords are both recommended.
- Balancing scalability against budget is the article's explicit conclusion.

**Errors and risks**
- 13 images extracted (many are article screenshots); none are displayed.
- 8 artefacts; 10 code-fragment blocks.

**Missing or degraded**
- The architecture and autoscaling illustrations.
- The article's cost discussion loses its examples.

**Quiz:** 9 questions; 2 defective.

---
### g-network - How to Build Multiplayer Games and Network Architectures

`GamingBackend/How to Build Multiplayer Games and Network Architectures.pdf` · 12 pages · 2,079 source words · 2,104 module words · 3 lessons · 7 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **C - Structurally broken** |
| Word ratio | 1.01 |
| Figures extracted / displayed | 0 / 0 |
| Artefact blocks | 1 |
| Generic lesson titles | 3 of 3 |
| Longest block | 235 words |
| Lessons without a quiz | 0 |

Accurate digest; the module has no headings at all and reads as one continuous block.

**Verified against the source**
- FPS/racing games needing near-real-time updates and dedicated servers is supported.
- Overcooked as a small co-op P2P example is exact.
- Client-server authority and broadcast, P2P latency/trust trade-offs and hybrid PUBG are all in the source.

**Errors and risks**
- Zero headings; 11 paragraphs with no section breaks.
- All 3 lesson titles are generic.
- 7 quiz questions for 3 lessons.

**Missing or degraded**
- The network-topology diagrams are not represented (no images extracted).
- Protocol comparison content is flattened.

**Quiz:** 7 questions; 2 defective.

---
### g-getgud - Mastering Multiplayer Game Architecture: Choosing the Right Approach

`GamingBackend/Mastering Multiplayer Game Architecture_ Choosing the Right Approach - Getgud.io.pdf` · 35 pages · 3,804 source words · 3,778 module words · 5 lessons · 15 questions

| | |
|---|---|
| Digest grade | **B - Minor issues** |
| Module grade | **C - Structurally broken** |
| Word ratio | 0.99 |
| Figures extracted / displayed | 1 / 0 |
| Artefact blocks | 11 |
| Generic lesson titles | 5 of 5 |
| Longest block | 148 words |
| Lessons without a quiz | 0 |

Mostly accurate, but hosting options are misframed as cons and the module has no headings.

**Verified against the source**
- Server-controlled logic making cheating harder and a single source of truth are both stated.
- Inputs to the server, state back to clients, and client-side prediction with server reconciliation are all covered.
- AWS GameLift and Photon Engine are named in the source.

**Errors and risks**
- FRAMING: 'Client-server cons: the server carries heavy load and needs solid hosting (examples: GameLift, Photon)' presents the source's server-technology options as drawbacks; the source lists them under 'Server Selection'.
- Zero headings; 11 artefacts; all 5 lesson titles generic.
- 6 quiz defects out of 15.

**Missing or degraded**
- The only extracted diagram is unused.
- The comparison tables are flattened into prose.

**Quiz:** 15 questions; 6 defective.

---
### g-modern-services - How to Build Modern Gaming Services

`GamingBackend/How to build modern gaming services — with reference architecture.pdf` · 14 pages · 1,785 source words · 1,777 module words · 3 lessons · 7 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **C - Structurally broken** |
| Word ratio | 1.00 |
| Figures extracted / displayed | 20 / 0 |
| Artefact blocks | 10 |
| Generic lesson titles | 2 of 3 |
| Longest block | 310 words |
| Lessons without a quiz | 0 |

Accurate summary of the reference architecture, but all 20 architecture diagrams are absent.

**Verified against the source**
- Shared services (entitlements) reused across games is the article's premise.
- The outage blast-radius risk and data-loss example are supported.
- The five requirements (near-instant consistency, resilient availability, elastic scalability, low latency, minimal complexity) are exact.
- Data locality and multi-region deployment are central to the source.

**Errors and risks**
- 20 extracted diagrams/screenshots are unused - the 'reference architecture' is delivered as text only.
- 10 artefacts; 2 generic lesson titles.

**Missing or degraded**
- The multi-region reference architecture diagram, the article's main artefact.
- The entitlements service flow diagram.

**Quiz:** 7 questions; all 7 defective (primarily answer-in-stem).

---
### g-ttl - Row-Level TTL in CockroachDB for MMORPGs

`GamingBackend/Managing Row-Level TTL in CockroachDB for High-Traffic MMORPGs.pdf` · 13 pages · 1,376 source words · 1,339 module words · 2 lessons · 6 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **C - Structurally broken** |
| Word ratio | 0.97 |
| Figures extracted / displayed | 17 / 0 |
| Artefact blocks | 11 |
| Generic lesson titles | 1 of 2 |
| Longest block | 199 words |
| Lessons without a quiz | 0 |

Technically accurate, but the source's PDF extraction is garbled and the module reproduces the damage plus newsletter boilerplate.

**Verified against the source**
- TTL candidates (session logs, temporary inventories, buffs, auction listings, matchmaking queues) match.
- CREATE TABLE ... WITH (ttl_expire_after = '24h') and ALTER TABLE ... SET (ttl_expire_after = ...) are correct.
- Staggering deletions and range partitioning for high ingestion are recommended by the source.
- REGIONAL BY ROW for multi-region locality is correctly described.

**Errors and risks**
- Garbled text survives into the module (e.g. 'AdTdTiLtiionnMaMlly...' in the REGIONAL BY ROW section), plus mojibake replacement characters.
- Newsletter form text ('Work email', 'Submit', 'unsubscribe') appears as lesson content.
- 17 images unused; 11 artefacts; 1 quiz defect.

**Missing or degraded**
- SQL examples are run inline instead of formatted code blocks.
- The step-by-step TTL diagrams are absent.

**Quiz:** 6 questions; 1 defective.

---
### g-open-match-guide - Matchmaking using Open Match

`GamingBackend/Matchmaking using Open Match _ Open Match.pdf` · 5 pages · 951 source words · 946 module words · 2 lessons · 3 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **C - Structurally broken** |
| Word ratio | 0.99 |
| Figures extracted / displayed | 3 / 0 |
| Artefact blocks | 0 |
| Generic lesson titles | 1 of 2 |
| Longest block | 404 words |
| Lessons without a quiz | 1 |

Accurate on the matchmaking flow; the module is three paragraphs, one of them 404 words.

**Verified against the source**
- Director -> FetchMatches -> MatchFunction -> tickets -> matches is the exact sequence.
- Match profiles filtering tickets and custom logic living in the Match Function are correct.
- Assignments and SetAssignment are described consistently with the source.

**Errors and risks**
- Only 3 paragraphs and no headings; a single 404-word block.
- 3 quiz questions for the whole guide.

**Missing or degraded**
- The 3 sequence/architecture diagrams are unused.
- The step-by-step allocation flow is compressed into prose.

**Quiz:** 3 questions; no defects detected.

---
### g-open-match-intro - Open Match: Overview and Step-by-Step Introduction

`GamingBackend/Open Match experience_ overview and step-by-step introduction _ by Argentics _ Medium.pdf` · 13 pages · 1,400 source words · 1,381 module words · 3 lessons · 6 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 0.99 |
| Figures extracted / displayed | 17 / 0 |
| Artefact blocks | 7 |
| Generic lesson titles | 0 of 3 |
| Longest block | 231 words |
| Lessons without a quiz | 1 |

Accurate introduction; attribution to Unity and the Kubernetes/Redis details are correct.

**Verified against the source**
- Open Match is described as an open-source Kubernetes-based framework co-founded with Unity.
- Front end tickets, Director, dedicated servers and the matcher roles are correct.
- The Redis-backed state store is stated explicitly.
- The Halloween Doodle 2018 scale example is in the source.

**Errors and risks**
- 17 images unused; 7 artefacts.
- 1 quiz defect.

**Missing or degraded**
- The architecture overview and flow diagrams.
- The step-by-step walkthrough's screenshots.

**Quiz:** 6 questions; 1 defective.

---
### g-patterns - Game Programming Patterns (overview)

`GamingBackend/Gaming Pattern Overview.pdf` · 40 pages · 10,349 source words · 10,854 module words · 16 lessons · 24 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **C - Structurally broken** |
| Word ratio | 1.05 |
| Figures extracted / displayed | 0 / 0 |
| Artefact blocks | 37 |
| Generic lesson titles | 1 of 16 |
| Longest block | 472 words |
| Lessons without a quiz | 5 |

Accurate overview, but the module reproduces front matter, TOC and page numbers as lesson content.

**Verified against the source**
- Chapter 1's architecture/performance/simplicity argument is correctly summarised.
- The Command pattern with configurable input and undo/redo is the correct chapter focus.
- The four later categories (sequencing, behavioural, decoupling, optimisation) are exact.

**Errors and risks**
- 37 artefacts: table of contents, copyright/front matter, page numbers and figure captions.
- 7 blocks exceed 350 words (longest 472); 19 code fragments.
- 24 quiz questions for 16 lessons.

**Missing or degraded**
- All book figures are absent (no images extracted).
- The excerpt only covers the introduction and Command chapter, but the digest describes the whole book's later sections without saying they are not included.

**Quiz:** 24 questions; 2 defective.

---
### g-sebi - SEBI's Cybersecurity and Cyber Resilience Framework

`GamingBackend/Decoding SEBI’s Cybersecurity and Cyber Resilience Framework.pdf` · 19 pages · 1,834 source words · 1,792 module words · 4 lessons · 9 questions

| | |
|---|---|
| Digest grade | **B - Minor issues** |
| Module grade | **C - Structurally broken** |
| Word ratio | 0.98 |
| Figures extracted / displayed | 25 / 0 |
| Artefact blocks | 11 |
| Generic lesson titles | 1 of 4 |
| Longest block | 207 words |
| Lessons without a quiz | 1 |

Mostly accurate, but the digest understates the framework's structure (four parts, not two) and the module is badly mangled.

**Verified against the source**
- The CSCRF objectives (reduce cyber risk, align with best practice, cut audit toil) are quoted correctly.
- The six functions (Governance/Identify/Protect/Detect/Respond/Recover) and the example controls are in the source.
- The disclaimer that this is not legal advice matches the source's disclaimer.

**Errors and risks**
- INCOMPLETE: the digest says the framework is 'structured into parts: objectives and standards, then guidelines'. The source defines four parts, adding Part III Compliance Formats and Part IV Annexures and References.
- The module renders author names as headings, the disclaimer and body paragraphs as code blocks, and contains mojibake ('SEBI�s').
- 11 artefacts, including newsletter and 'Keep reading' boilerplate.
- Misfiled: a securities-market compliance blog sits in the Gaming Backend track only because of its folder.

**Missing or degraded**
- Parts III and IV of the framework are absent from the digest.
- 25 extracted figures/diagrams are unused.
- The compliance-area tables are flattened.

**Quiz:** 9 questions; all 9 defective (answer-in-stem).

---
### s-schema - Database Schema: SQL Examples and Best Practices

`SQLdatabase/Database schema_ SQL schema examples and best practices.pdf` · 14 pages · 1,986 source words · 1,949 module words · 2 lessons · 6 questions

| | |
|---|---|
| Digest grade | **C - Needs correction** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 0.98 |
| Figures extracted / displayed | 1 / 0 |
| Artefact blocks | 5 |
| Generic lesson titles | 2 of 2 |
| Longest block | 195 words |
| Lessons without a quiz | 0 |

One mechanism is misattributed: the source uses a user-defined schema for access control, not roles.

**Verified against the source**
- The users/orders/products example with primary and foreign keys is exact.
- Automatic schema enforcement on every write is stated in the source.
- Designing the schema before application code is the article's advice.

**Errors and risks**
- FACTUAL: 'Use roles to grant access to some tables...' - the source describes creating a user-defined schema (e.g. logistics) containing only orders and shipments, so the PII table is inaccessible. 'Roles' does not appear in the source.
- The bullet adds 'checks' to keys/types; the source discusses primary/foreign keys and data types, not CHECK constraints.
- 5 artefacts; 2 generic lesson titles.

**Missing or degraded**
- The example schema diagram is unused.
- The SQL DDL examples are flattened into prose.

**Quiz:** 6 questions; 2 defective.

---
### s-molt - Accelerate Data Migrations with MOLT Schema Conversion Tool

`SQLdatabase/Accelerate Data Migrations with MOLT Schema Conversion Tool.pdf` · 11 pages · 1,116 source words · 1,122 module words · 2 lessons · 6 questions

| | |
|---|---|
| Digest grade | **B - Minor issues** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 1.00 |
| Figures extracted / displayed | 4 / 0 |
| Artefact blocks | 1 |
| Generic lesson titles | 2 of 2 |
| Longest block | 193 words |
| Lessons without a quiz | 0 |

Accurate on MOLT's tools; one claim overstates what the source guarantees about verification.

**Verified against the source**
- MOLT = Migrate Off Legacy Tools; SCT, Fetch and Verify are correctly named.
- SCT's GUI showing incompatibilities and suggested changes is supported.
- Legacy sources (Oracle, MySQL, SQL Server) are correct.

**Errors and risks**
- 'Migrations are only done when the data is verified as accurate and complete' overstates the source, which says you 'can check with MOLT Verify that your migration has been successful'.
- 2 generic lesson titles; 1 artefact.

**Missing or degraded**
- 4 screenshots of the SCT GUI are unused.
- The conversion workflow's step detail is compressed.

**Quiz:** 6 questions; 1 defective.

---
### s-enterprise - CockroachDB: An Enterprise Architecture Overview

`SQLdatabase/CockroachDB_ An Enterprise Architecture Overview.pdf` · 39 pages · 6,177 source words · 6,177 module words · 8 lessons · 14 questions

| | |
|---|---|
| Digest grade | **C - Needs correction** |
| Module grade | **C - Structurally broken** |
| Word ratio | 1.00 |
| Figures extracted / displayed | 4 / 0 |
| Artefact blocks | 15 |
| Generic lesson titles | 7 of 8 |
| Longest block | 233 words |
| Lessons without a quiz | 2 |

Two accuracy problems: the digest invents ACID wording and misstates the source's five architecture attributes.

**Verified against the source**
- No single point of failure, automated failover and self-healing are all stated.
- Cloud lock-in avoidance across clouds or own hardware is correct.
- Gaming, routing/logistics and generative AI are listed use cases.
- Audit logging for HIPAA/GDPR/SOC 2 is accurate.

**Errors and risks**
- FACTUAL: 'Gives ACID consistency...' - the word ACID does not appear in this document; the source says 'transactionally consistent'.
- FACTUAL: the source's five attributes are Operational Excellence, Security, Reliability, Performance and Cost-Efficiency. The digest replaces this with 'automation, scalability, security, reliability, performance and simplified operations', dropping cost-efficiency and adding items that are not the source's list.
- Zero headings, 7 of 8 lesson titles generic, 15 artefacts.
- 4 quiz defects.

**Missing or degraded**
- 4 extracted figures are unused.
- The five-attribute structure is lost in the module and misrepresented in the digest.

**Quiz:** 14 questions; 4 defective.

---
### s-payments - Payment Orchestration with Spreedly and CockroachDB

`SQLdatabase/Payment orchestration with Spreedly and CockroachDB.pdf` · 8 pages · 722 source words · 716 module words · 1 lessons · 3 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 0.99 |
| Figures extracted / displayed | 2 / 0 |
| Artefact blocks | 3 |
| Generic lesson titles | 1 of 1 |
| Longest block | 140 words |
| Lessons without a quiz | 0 |

Accurate customer story; 'NoSQL' is a small inference beyond the source's 'key-value store'.

**Verified against the source**
- SOC 2 and PCI-DSS, zero data loss and near-constant uptime are all in the source.
- The move from a legacy key-value store to CockroachDB is stated.
- Security and GDPR data-localisation benefits are cited.

**Errors and risks**
- The digest says 'key-value NoSQL store'; the source says only 'legacy key-value store'. NoSQL is a reasonable inference but not stated.
- One lesson and 3 questions for the whole case study.
- 3 artefacts.

**Missing or degraded**
- 2 images are unused.
- The event's customer quotes and migration detail are compressed.

**Quiz:** 3 questions; no defects detected, but coverage is minimal.

---
### s-backups - Simplifying CockroachDB Backups to S3

`SQLdatabase/Simplifying CockroachDB Backups to S3_ A Guided Approach.pdf` · 9 pages · 1,012 source words · 953 module words · 2 lessons · 5 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 0.94 |
| Figures extracted / displayed | 0 / 0 |
| Artefact blocks | 2 |
| Generic lesson titles | 2 of 2 |
| Longest block | 137 words |
| Lessons without a quiz | 0 |

Accurate and practical; the backup paths and external-connection steps are correctly represented.

**Verified against the source**
- Managed backups are default in CockroachDB Cloud and visible under Backup and Restore.
- Customer-managed backups use EXTERNAL CONNECTION to S3.
- External connection for abstraction vs specified authentication for control is the source's advice.
- Incremental/revision-history backups and the GC window are described correctly.
- Dropping an existing external connection before recreating it is in the source.

**Errors and risks**
- No images (the console walkthrough is text-only).
- 2 generic lesson titles; 5 questions for 2 lessons.

**Missing or degraded**
- The console screenshots and the S3 bucket layout are absent.
- The full command sequence is partly flattened.

**Quiz:** 5 questions; no defects detected.

---
### s-11-failures - Surviving 11 Application and Database Failures

`SQLdatabase/Surviving 11 Application and Database Failures with CockroachDB.pdf` · 15 pages · 1,443 source words · 1,440 module words · 2 lessons · 6 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 1.00 |
| Figures extracted / displayed | 4 / 0 |
| Artefact blocks | 1 |
| Generic lesson titles | 2 of 2 |
| Longest block | 152 words |
| Lessons without a quiz | 0 |

Accurate catalogue of failure modes and resilience features.

**Verified against the source**
- Unhandled exceptions, crashes, resource exhaustion and network outages are all covered.
- Transactional consistency plus automated failover is the source's core claim.
- Workload spreading, monitoring/self-healing and configuration-drift reduction are all explicit.

**Errors and risks**
- 1 artefact; 4 images unused.
- 2 generic lesson titles; 6 questions for 2 lessons.

**Missing or degraded**
- The 11-failure checklist table is flattened into prose.
- The failure-scenario diagrams are absent.

**Quiz:** 6 questions; 1 defective.

---
### s-dr - Surviving Failures: Disaster Recovery with CockroachDB

`SQLdatabase/Surviving Failures_ Disaster Recovery with CockroachDB.pdf` · 12 pages · 1,027 source words · 1,050 module words · 2 lessons · 5 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 1.02 |
| Figures extracted / displayed | 5 / 0 |
| Artefact blocks | 1 |
| Generic lesson titles | 2 of 2 |
| Longest block | 169 words |
| Lessons without a quiz | 0 |

Accurate disaster-recovery digest; RPO/RTO, PITR and off-site storage are all correct.

**Verified against the source**
- Region outage, catastrophic corruption and accidental deletion are the source's whole-cluster risks.
- PITR via continuous backup and revision history is correct.
- S3, GCS and Azure Blob as off-site targets are named.
- RPO/RTO are defined and used to size the recovery plan.

**Errors and risks**
- 1 artefact; 5 images unused.
- 2 generic lesson titles; 5 questions for 2 lessons.

**Missing or degraded**
- The DR topology diagrams are absent.
- The backup/restore command examples are compressed.

**Quiz:** 5 questions; no defects detected.

---
### s-large - Surviving Large-Scale Failures with CockroachDB

`SQLdatabase/Surviving Large-Scale Failures with CockroachDB.pdf` · 10 pages · 911 source words · 916 module words · 2 lessons · 4 questions

| | |
|---|---|
| Digest grade | **B - Minor issues** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 1.00 |
| Figures extracted / displayed | 4 / 0 |
| Artefact blocks | 4 |
| Generic lesson titles | 2 of 2 |
| Longest block | 145 words |
| Lessons without a quiz | 0 |

Mostly accurate, but 'continuous security patching' is not in the source.

**Verified against the source**
- AWS/Azure/GCP outages and cascading failures are the article's framing.
- Centralised configuration and automated deployment to reduce drift are stated.
- RBAC, encryption at rest and TLS in transit are explicit.
- Audit logging is part of the security discussion.

**Errors and risks**
- FACTUAL: 'continuous security patching' is not mentioned in the source. The source recommends centralised configuration, automated deployment, RBAC, encryption and monitoring.
- 4 artefacts; 2 generic lesson titles.
- 4 questions for 2 lessons.

**Missing or degraded**
- 4 images are unused.
- The provider-outage examples are compressed.

**Quiz:** 4 questions; no defects detected.

---
### s-tips - Top 7 Tips for Optimizing a Distributed SQL Database

`SQLdatabase/Top 7 Tips for Optimizing Your Distributed SQL Database.pdf` · 7 pages · 599 source words · 618 module words · 1 lessons · 3 questions

| | |
|---|---|
| Digest grade | **B - Minor issues** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 1.03 |
| Figures extracted / displayed | 1 / 0 |
| Artefact blocks | 3 |
| Generic lesson titles | 1 of 1 |
| Longest block | 130 words |
| Lessons without a quiz | 0 |

Accurate but incomplete: the digest mentions only five of the seven tips.

**Verified against the source**
- Partial/composite indexes, index monitoring, EXPLAIN ANALYZE (DISTSQL), super regions, automated backups and range/admission control are all in the source.
- Seven numbered tips exist in the source.

**Errors and risks**
- INCOMPLETE: the digest omits tip 1 (design schemas for distribution) and tip 3 (embrace transaction retries), two of the seven.
- One lesson and 3 questions for all seven tips.
- 3 artefacts.

**Missing or degraded**
- Two of the seven tips are absent from the digest.
- The per-tip reference tables are flattened.

**Quiz:** 3 questions; no defects detected, but only 3 of 7 tips are assessed.

---
### s-modernization - What is Application Modernization?

`SQLdatabase/What is Application Modernization_.pdf` · 9 pages · 908 source words · 895 module words · 1 lessons · 3 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 0.99 |
| Figures extracted / displayed | 1 / 0 |
| Artefact blocks | 3 |
| Generic lesson titles | 1 of 1 |
| Longest block | 160 words |
| Lessons without a quiz | 0 |

Accurate and concise; the distributed-SQL value proposition is correctly stated.

**Verified against the source**
- Microservices, container infrastructure and a distributed transactional data layer are the source's three traits of a modern app.
- Data modernisation bridging legacy stores and cloud is stated.
- ACID, horizontal read/write scale, no single point of failure and governance are quoted from the source.
- Data locality as a differentiator is supported.

**Errors and risks**
- One lesson and 3 questions for the whole article.
- 3 artefacts.

**Missing or degraded**
- The one extracted image is unused.
- The modernization-path diagram is absent.

**Quiz:** 3 questions; no defects detected.

---
### s-postgres - PostgreSQL-Compatible Databases: Two Approaches

`SQLdatabase/“PostgreSQL Compatible Databases”_ A Tale of Two Approaches.pdf` · 14 pages · 1,466 source words · 1,437 module words · 2 lessons · 6 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **B - Usable but incomplete** |
| Word ratio | 0.98 |
| Figures extracted / displayed | 4 / 0 |
| Artefact blocks | 2 |
| Generic lesson titles | 2 of 2 |
| Longest block | 210 words |
| Lessons without a quiz | 0 |

Accurate; the fork-versus-rewrite argument and the three advantages of owning the stack are correct.

**Verified against the source**
- Compatibility depends on which PostgreSQL features matter to the application.
- Forking still requires mapping the forked SQL layer to distributed storage.
- CockroachDB rewrote the PostgreSQL-compatible SQL layer from scratch.
- The three advantages (less technical debt, better distributed performance, customer-experience optimisation) are in the source.

**Errors and risks**
- 2 generic lesson titles; 2 artefacts.
- 6 questions for 2 lessons.

**Missing or degraded**
- 4 diagrams are unused.
- The comparison table of approaches is flattened.

**Quiz:** 6 questions; no defects detected.

---
### w-next-async - Next.js: No async Client Component

`No async Client Component _ Next.js.pdf` · 6 pages · 640 source words · 657 module words · 2 lessons · 4 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **C - Structurally broken** |
| Word ratio | 1.03 |
| Figures extracted / displayed | 1 / 0 |
| Artefact blocks | 1 |
| Generic lesson titles | 0 of 2 |
| Longest block | 72 words |
| Lessons without a quiz | 0 |

Digest is correct, but the module's code is split line-by-line into 108 separate code blocks, destroying readability.

**Verified against the source**
- React Client Components cannot be async functions - exact.
- Fix 1 (convert to a Server Component) and Fix 2 (useEffect/SWR/React Query) are the documented options.
- Fix 3 (promise from a Server Component resolved with use()) matches the docs, including the Context Provider variant.
- Server-side fetching is the docs' recommended approach.

**Errors and risks**
- 157 blocks for 657 words; 108 blocks marked as code are individual lines, line numbers or fragments.
- Code fragments are misclassified as headings (e.g. '3 // This will cause an error').
- The module reads as a PDF dump rather than a lesson.

**Missing or degraded**
- Proper syntax-highlighted code blocks and the page's tabbed examples.
- The docs' navigation chrome is included instead.

**Quiz:** 4 questions; 2 defective.

---
### w-piskel - Piskel: Free Online Sprite Editor (Terms)

`Piskel - Free online sprite editor.pdf` · 4 pages · 617 source words · 617 module words · 1 lessons · 0 questions

| | |
|---|---|
| Digest grade | **A - Accurate** |
| Module grade | **C - Structurally broken** |
| Word ratio | 1.00 |
| Figures extracted / displayed | 0 / 0 |
| Artefact blocks | 0 |
| Generic lesson titles | 0 of 1 |
| Longest block | 270 words |
| Lessons without a quiz | 1 |

Accurate summary of the terms, but this is a terms-of-service page with no quiz and little learning value.

**Verified against the source**
- Under-13 users need parental permission - stated.
- Acceptable-use restrictions, including obtaining other users' passwords, are stated.
- You may use your sprites commercially and Piskel claims no rights over them.
- Material changes get at least 30 days' notice; last updated June 16, 2021.

**Errors and risks**
- Zero quiz questions for the only lesson.
- The module is raw legal text with site chrome ('Downloads About ...').
- Included in a learning library despite being a ToS page, not architecture content.

**Missing or degraded**
- No assessment or learning objective.
- The privacy-policy section is referenced but not included.

**Quiz:** 0 questions - the only module with no assessment.

---

## 7. Recommendations

1. **Fix the P1/P2 digest errors first.** They are small, local edits to `data.js`; the rest of the library is broadly sound.
2. **Decide what the product is.** Either publish real condensed lessons (rewrite, cite, chunk by source section) or present the modules honestly as annotated reading with the full text. The current middle ground - a summary card above a full-text dump - sets the wrong expectation.
3. **Render the figures.** Add an image block type and reference the existing `modules/media/<id>/*.png` files with captions. For diagram tutorials this is the difference between a course and a transcript.
4. **Strip chrome at build time.** Drop repeated navigation, table headers, chapter cross-reference lists and newsletter forms; keep the source's headings.
5. **Rebuild the quiz layer.** Generate a question only when the blank is inside a clean sentence, the answer is not in the stem, and four plausible, distinct options exist. Add coverage so every lesson has at least three questions.
6. **Add structure and provenance.** Use the source's section titles for lessons, add page/section references, and state one learning objective per lesson.
7. **Add automated QA gates.** Fail the build when the verbatim ratio is over ~0.6 (if the goal is summarisation), when an artefact pattern is detected, when an answer appears in its stem, or when a module is missing figures its source contains.
8. **Resolve copyright.** Keep the site private, obtain permission, or replace the verbatim text with genuine summaries. The O'Reilly excerpt is the highest-risk item.

---

## 8. Appendix

**Files delivered**

- `audit/index.html` - browsable dashboard with per-module detail and filters.
- `audit/audit-data.js` - the structured findings used by the dashboard.
- `audit/AUDIT-REPORT.md` - this report.
- `audit/README.md` - scope, method and headline results.

**Metric definitions**

- **Word ratio:** module words / PDF words. ~1.0 means a full copy.
- **Verbatim score:** share of 7-word shingles in a module block also present in the PDF.
- **Coverage:** word-weighted share of PDF paragraphs represented in the module.
- **Artefact:** a block matching navigation, table-header, cross-reference, newsletter or byline patterns.
- **Answer in stem:** the correct option string occurs in the assembled question text before the options.

**Module inventory**

| Module | Track | Source pages | Words | Digest | Module | Figures | Quiz |
|---|---|---:|---:|---|---|---:|---:|
| ch01 | architecture | 21 | 3,642 | B | B | 2 | 12 |
| ch02 | architecture | 30 | 4,822 | A | B | 7 | 23 |
| ch03 | architecture | 21 | 2,737 | A | C | 8 | 5 |
| ch04 | architecture | 15 | 2,805 | A | B | 6 | 7 |
| ch05 | architecture | 13 | 3,932 | C | C | 8 | 12 |
| ch06 | architecture | 17 | 2,526 | A | B | 7 | 11 |
| ch07 | architecture | 20 | 3,210 | A | B | 7 | 13 |
| ch08 | architecture | 31 | 5,124 | A | B | 11 | 20 |
| ch09 | architecture | 22 | 3,448 | A | B | 8 | 12 |
| ch10 | architecture | 23 | 4,117 | B | B | 10 | 14 |
| ch11 | architecture | 26 | 4,117 | A | B | 10 | 13 |
| ch12 | architecture | 17 | 2,860 | A | B | 6 | 12 |
| decoding-ms | architecture | 8 | 1,974 | B | B | 0 | 7 |
| ms-diagram | architecture | 19 | 2,707 | B | C | 5 | 6 |
| aws-book | architecture | 66 | 19,847 | A | C | 14 | 55 |
| hyperautomation | architecture | 15 | 3,986 | A | B | 0 | 14 |
| g-tools | gaming | 9 | 946 | C | C | 0 | 3 |
| g-realtime | gaming | 7 | 1,280 | A | B | 2 | 3 |
| g-medium-backend | gaming | 13 | 1,703 | A | B | 13 | 9 |
| g-network | gaming | 12 | 2,104 | A | C | 0 | 7 |
| g-getgud | gaming | 35 | 3,778 | B | C | 1 | 15 |
| g-modern-services | gaming | 14 | 1,777 | A | C | 20 | 7 |
| g-ttl | gaming | 13 | 1,339 | A | C | 17 | 6 |
| g-open-match-guide | gaming | 5 | 946 | A | C | 3 | 3 |
| g-open-match-intro | gaming | 13 | 1,381 | A | B | 17 | 6 |
| g-patterns | gaming | 40 | 10,854 | A | C | 0 | 24 |
| g-sebi | gaming | 19 | 1,792 | B | C | 25 | 9 |
| s-schema | sql | 14 | 1,949 | C | B | 1 | 6 |
| s-molt | sql | 11 | 1,122 | B | B | 4 | 6 |
| s-enterprise | sql | 39 | 6,177 | C | C | 4 | 14 |
| s-payments | sql | 8 | 716 | A | B | 2 | 3 |
| s-backups | sql | 9 | 953 | A | B | 0 | 5 |
| s-11-failures | sql | 15 | 1,440 | A | B | 4 | 6 |
| s-dr | sql | 12 | 1,050 | A | B | 5 | 5 |
| s-large | sql | 10 | 916 | B | B | 4 | 4 |
| s-tips | sql | 7 | 618 | B | B | 1 | 3 |
| s-modernization | sql | 9 | 895 | A | B | 1 | 3 |
| s-postgres | sql | 14 | 1,437 | A | B | 4 | 6 |
| w-next-async | web | 6 | 657 | A | C | 1 | 4 |
| w-piskel | web | 4 | 617 | A | C | 0 | 0 |
