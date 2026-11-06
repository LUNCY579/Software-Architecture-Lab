# Content & Platform Review

*Review of the material in this folder, and the plan behind the learning platform built on top of it.*

---

## 1. What is actually in the folder

| Asset | Count | Notes |
| --- | --- | --- |
| Source PDFs | 40 | 18 in the root, 11 in `GamingBackend/`, 11 in `SQLdatabase/` |
| Extracted body text | ~118,765 words | from `modules/*.js` |
| Lessons | 188 | generated, one module per PDF |
| Quiz questions | 393 | auto-generated fill-in-the-blank |
| Extracted figures | 238 PNGs | `modules/media/<module>/`, currently **never displayed** |
| Hand-written metadata | 40 entries | `data.js` — titles, summaries, key takeaways, tags |
| Application code | ~550 lines | `index.html`, `app.js`, `styles.css` |

### The corpus, by track

**Architecture (16 documents).** The core is a 12-chapter "Multiplayer" series (distributed systems, microservices, diagrams, API flows, enterprise architecture, system analysis, system architecture, documentation, distributed design patterns, system design primer, backend architecture). Around it sit a Camunda microservices handbook, a DevTeam.Space microservices examples piece, a diagram best-practices article, an O'Reilly *System Design on AWS* excerpt, and a Camunda hyperautomation guide.

**Gaming backend (11 documents).** Multiplayer network models, authoritative servers, client prediction, matchmaking with Open Match (two documents), CockroachDB reference architecture for games, row-level TTL for MMORPGs, and an excerpt of Nystrom's *Game Programming Patterns*.

**SQL & databases (11 documents).** Schema design, MOLT migrations, CockroachDB enterprise architecture, payment orchestration, backups to S3, three failure/disaster-recovery papers, distributed SQL tuning, application modernization, and PostgreSQL compatibility.

**Web & tools (2 documents).** A Next.js async-Client-Component fix and a sprite editor's terms of service.

The bulk of the teaching value is real: the 12-chapter series is coherent, the CockroachDB resilience set is unusually concrete, and the gaming material covers the full path from netcode to matchmaking.

---

## 2. Honest quality audit

### 2.1 What the generated modules get right

- **Structure.** 188 lessons with a stable `{title, blocks[{h,c,t}], quiz[]}` shape make the content uniform and cheap to navigate.
- **Metadata.** `data.js` summaries and key takeaways are genuinely written, not extracted — they are the best pedagogical prose in the repo.
- **Progress.** Per-lesson completion and per-question answers persist in `localStorage`, and the home grid shows real completion meters.
- **Access.** Semantic headings, focus rings, keyboard lesson navigation, and a `prefers-color-scheme` palette.

### 2.2 What is wrong with the extracted content

1. **It is a PDF dump, not a textbook.** Blocks are cut at hard page/column boundaries, so sentences split mid-clause between lessons. The reader sees fragments presented as paragraphs.
2. **Layout noise became headings.** `ch01` contains heading blocks that are literally `"Concept"` and `"Description"` — the column headers of a table in the PDF. Every tabular source produces this artefact.
3. **No code, no formulas, no figures.** The sources contain SQL (`ALTER TABLE ... SET (ttl_expire_after ...)`), YAML, and diagrams. The pipeline flattened all of it to prose, and the 238 extracted images are never referenced by the renderer.
4. **Quiz distractors are semantically unrelated.** `ch02` asks: *"…circuit breakers to handle faults and ensure system ____."* with options `Managing`, `API`, `resilience`, `ownership`. Three options are lifted from elsewhere in the document; only one is even the right part of speech. A guesser learns nothing and a learner is misled.
5. **No answer explanations.** Feedback is "Correct." or "The answer is X." — the single highest-value teaching moment in a quiz is discarded.
6. **No learning frame.** There are no objectives, prerequisites, difficulty, time estimates, or "what you should be able to do afterwards" anywhere.
7. **Uneven depth.** `s-payments` is 716 words in one lesson; `aws-book` is 19,880 words across 21. 16 of 40 modules have two lessons or fewer — too thin to function as a module.
8. **No path through it.** The library is a flat grid sorted by nothing. A beginner has no way to know that chapter 11 (primer) should precede chapter 1 (distributed systems).
9. **Provenance and copyright risk.** Several PDFs are browser print-to-PDF captures of published articles (Cockroach Labs blog, camunda handbook, Medium posts, an O'Reilly book excerpt). The modules reproduce that text **verbatim**. That is acceptable for private study; publishing it as a public textbook would be redistribution of copyrighted work. The platform should therefore keep extracted text as a private reference layer and present **original** teaching prose (tutorials, breakdowns, exercises) as the public-facing surface, always linking back to the source.
10. **One module is not educational at all.** `w-piskel` is a tool's terms of service; it has zero quiz questions and teaches nothing about architecture. It belongs in an appendix, not the library.

---

## 3. Platform gaps (what the site could not do)

- No curriculum, sequencing, or prerequisites.
- No site-wide search — the home box filters module cards only, and the in-module find only filters the sidebar.
- No glossary. Terms like *quorum*, *PACELC*, *bulkhead*, *RPO/RTO*, *projection*, *tick rate* appear once and are never defined again.
- No exercises, worked examples, or anything that requires the learner to produce something.
- No visuals, despite 238 extracted figures sitting unused.
- No cross-linking between the gaming, SQL, and architecture tracks, even where they discuss the same idea (e.g. multi-region data locality).
- No print/read mode, no per-module "next up" recommendation.

---

## 4. What this build adds

A pedagogy layer on top of the existing library. Nothing about the original modules was deleted; they remain the reference text.

### New content

| File | Purpose |
| --- | --- |
| `curriculum.js` | 6 learning paths (ordered, with a reason for every step) + per-module objectives, level, time estimate, prerequisites |
| `tutorials-core.js`, `tutorials-systems.js` | 10 authored, original tutorials with worked examples, diagrams, code, exercises and explained quizzes |
| `glossary.js` | 162 terms with definitions, categories and links back to where each is used |
| `REVIEW.md` | This document |

### New platform features

- **Learning paths** with per-step completion and "continue where you left off".
- **Tutorials** as first-class pages: outcomes, prerequisites, rich blocks (callouts, tables, flows, side-by-side comparisons, collapsible exercises and solutions), explained quizzes, completion tracking.
- **Glossary** with search, category filters, and cross-links to modules and tutorials.
- **Site-wide quick find** across modules, tutorials and glossary terms.
- **Module pages** gain objectives, level, time, prerequisite chips, related tutorials, and prev/next module navigation.
- **Quiz explanations** — every authored question now says *why* the answer is right.

### Still open (recommended next)

1. Replace verbatim module text with original prose for public distribution, keeping the PDFs as a private reference.
2. Regenerate the 393 auto-questions with proper distractors and explanations, or retire them in favour of authored checks.
3. Caption and place the 238 extracted figures, or redraw them as diagrams.
4. Split `aws-book` (21 lessons) and `g-patterns` (16 lessons) into sub-modules; merge the 16 two-lesson stubs into their track's neighbours.
5. Add a spaced-repetition deck generated from the glossary.

---

## 5. Second pass: interface & interactivity

Built on the sections above; content and code are unchanged except where noted.

### Verified
- All 40 modules, 188 lessons, 393 questions, and 33 figure-bearing media folders parse and load (`node --check`, headless smoke test of every route).
- Every route (`/`, paths, path detail, module, tutorial, glossary, search) renders without errors in headless Chromium.

### New features
| Feature | File(s) | What it does |
| --- | --- | --- |
| Live quick find | `app.js`, `styles.css` | The header search now shows a grouped dropdown (modules / tutorials / glossary) as you type, with ↑/↓/Enter/Esc keyboard navigation. Pressing Enter still opens the full search page; typing no longer hijacks the whole view. `/` focuses search from anywhere. |
| Inline glossary tooltips | `app.js`, `styles.css` | Lesson and tutorial paragraphs auto-link the first occurrences of glossary terms (dotted underline). Hover, focus or tap shows a definition popover with a category tag and a link into the glossary. Skips code, headings and quiz content; capped per paragraph. |
| Figures gallery + lightbox | `modules/figures.js` (generated manifest), `app.js`, `styles.css` | The 238 extracted PDF figures are finally visible: every module page gets a collapsible "Figures from the source document" grid (page + figure caption, lazy-loaded). Clicking opens a lightbox with ‹ › navigation, arrow keys and Escape. |
| Flashcards (spaced repetition) | `app.js`, `styles.css`, `index.html` | New `#/cards` route in the nav. Glossary-driven deck with category decks, flip-to-reveal cards, Again/Good/Easy grading on expanding intervals (10 min → 35 days), due/well-known counters, and keyboard grading (Space, 1/2/3). Progress persists in `localStorage` (`fieldguide-cards-v1`). |
| Quiz retake | `app.js` | Answered module/tutorial quizzes gain a "Retake quiz" button that clears the saved answers and restores interactivity. |
| Reading progress bar | `app.js`, `styles.css` | A 3px scroll-progress bar appears under the header on module and tutorial pages. |

### Still open
- All items in section 4's "recommended next" list remain valid; the flashcards item (5) is now done.

## 6. Compiled textbooks

`node build-textbooks.js` assembles the entire library into end-to-end Markdown books under `textbooks/`:

- `00-complete-field-guide.md` — everything in one volume: 6 learning paths, all 40 reference chapters (every lesson, all 433 quiz answers, all 238 figures), the 10 tutorials, the 162-term glossary, and a source appendix (~167k words).
- `01-architecture-textbook.md`, `02-gaming-backend-textbook.md`, `03-sql-databases-textbook.md`, `04-web-tools-textbook.md` — per-track editions with linked tables of contents, track glossaries and cross-referenced tutorials.
- `README.md` — index.

Chapters carry provenance (source PDF, level, reading time, objectives) and every quiz question ships with its answer and, for authored questions, the explanation. Figure images resolve via the relative `modules/media/` paths, so the books stay inside the project folder. The copyright note from §2.2 applies to the reference chapters: private study, not public redistribution.

## 7. Next.js upgrade

The learning interface is now a **Next.js 14 (App Router) app** in `site/`, fully statically generated: **254 pages** at build time, including all **188 lesson pages** as individual URLs (`/modules/<id>/<lesson>`).

| Area | Before (vanilla SPA) | Now (Next.js) |
| --- | --- | --- |
| Routing | hash-based, one page | real URLs, 254 static pages, per-lesson deep links |
| Rendering | all client-side | server-rendered content (lessons, tutorials, figures, glossary data in the HTML) + small client islands for progress |
| Data | `window.*` globals, runtime script loads | build-time JSON (`npm run export-data` regenerates `site/data/`) |
| SEO/metadata | static title | per-page `generateMetadata` for every module, lesson, tutorial, path |
| Content parity | — | everything from the vanilla app carried over: paths, tutorials, modules, lessons, quizzes with answers & retakes, figures + lightbox, glossary tooltips, flashcards, quick find, theme, progress (same localStorage key — existing progress carries over) |

**Run it:** `cd site && npm install && npm run dev` (or `npm run build && npm start`). Content changes: edit the vanilla data files, then `npm run export-data` and rebuild.

### Review of displayed module content (§7 audit)
- 40 modules / 188 lessons / 433 answered questions (393 auto-generated still lack written explanations; the 40 authored ones have them).
- 238 figures all display; 7 modules have none (their sources are text-only): decoding-ms, hyperautomation, g-tools, g-network, g-patterns, s-backups, w-piskel.
- 16 modules remain thin (≤2 lessons); 3 are single-lesson stubs (s-payments, s-tips, s-modernization). Splitting/merging is still the top content task.
- Every module page now shows: objectives, level, time, prerequisites, related tutorials, provenance + word/question counts, figures, full lesson list with quiz counts, and prev/next navigation.

## 8. Improvement pass

1. **All 393 auto-generated quizzes upgraded** (was: answers only, unrelated distractors):
   - **392/393 questions now carry an explanation** that quotes the exact source sentence containing the answer.
   - **385/393 got rebuilt distractors** — same-lesson words with matching capitalisation and ±2-character length, so options are plausible same-part-of-speech candidates instead of random words.
   - The upgrade lives in `site/scripts/export-data.mjs`, which rewrites `modules/*.js` (vanilla app), `site/data/*.json` (Next.js app) — one pipeline, everywhere in sync.
   - The Markdown textbooks were regenerated, so all 392 explanations appear there too.
2. **Full-text lesson search** — the search page now indexes every lesson body (188 lessons), returning excerpts with links to the exact lesson URL.
3. **Cross-linked modules** — every module page gains "Related modules" (shared tags) and "Key terms" chips (glossary terms taught in it).
4. **Lesson reading time** — every lesson shows a words/200 wpm estimate in its header.
5. Re-verified: `npm run build` ✓ 254/254 static pages; every route smoke-tested; vanilla `modules/*.js` still parse; textbook counts updated (433 answers, 392 with explanations).
