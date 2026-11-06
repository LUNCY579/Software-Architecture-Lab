# Architecture & Backend Field Guide

A self-paced learning workspace for software architecture and system design, built from
a curated library of 40 source PDFs across three tracks — **Architecture**, **Gaming
Backend**, and **SQL & Databases** — plus original tutorials, learning paths, a glossary,
and compiled textbooks.

## What's in the repository

| Path | What it is |
| --- | --- |
| `*.pdf`, `GamingBackend/`, `SQLdatabase/` | The 40 source documents (kept on disk; **not** tracked in git) |
| `index.html`, `app.js`, `data.js`, `modules/` | A zero-dependency vanilla learning app: library, paths, tutorials, glossary, flashcards, figure lightbox, term tooltips |
| `site/` | The **Next.js 14 (App Router)** version — 254 statically generated pages, one URL per lesson |
| `site/data/` | Build-time JSON exported from the vanilla data files (`npm run export-data`) |
| `textbooks/` | Compiled end-to-end Markdown textbooks (regenerated, not tracked) |
| `build-textbooks.js` | Deterministic textbook compiler |
| `REVIEW.md` | The evolving content & platform review log |

## Learning content at a glance

- 6 ordered learning paths with a reason for every step
- 10 authored tutorials with worked examples, exercises and explained answers
- 40 reference modules · 188 lessons · 433 quiz questions (392 with source-quoting explanations)
- 162-term glossary, inlined as hover tooltips throughout the reading views
- 238 figures extracted from the source PDFs, browsable per module with a lightbox
- Spaced-repetition flashcards over the glossary (10 min → 35 day intervals)

## Run it

Vanilla (no install):

```
# open index.html in a browser
```

Next.js app:

```
cd site
npm install
npm run export-data   # refresh site/data from the vanilla sources
npm run dev           # http://localhost:3000
```

Production: `npm run build && npm start`.

Textbooks: `node build-textbooks.js` → `textbooks/`.

## Progress

Lesson completion, quiz answers and flashcard scheduling persist in the browser's
`localStorage` (`fieldguide-progress-v2` / `fieldguide-cards-v1`) and are shared by both
apps.

## Notes

- Reference modules reproduce text extracted from the source PDFs — fine for private
  study, **not** for public redistribution. Tutorials, paths and the glossary are
  original to this guide.
- `.gitignore` is a whitelist: code and documents are tracked; PDFs, media, generated
  books and build artifacts are not.
