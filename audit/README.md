# Accuracy & Completeness Audit

Audit of the 40 learning modules and the `data.js` digest in this repository against their 40 source PDFs. Prepared 6 November 2026.

## Open the report

- **Dashboard:** double-click `index.html` (no server needed; `audit-data.js` and `audit.css` sit beside it).
- **Full narrative:** `AUDIT-REPORT.md` — executive summary, method, cross-cutting findings, corrections, omissions and a section for every module.
- **Raw findings:** `audit-data.js` — the structured data the dashboard renders.

## Headline results

| Measure | Result |
|---|---|
| PDFs → modules → digest entries | 40 → 40 → 40, no orphans or duplicates |
| Module words vs source words | 118,301 vs 118,290 (ratio 1.00; 37/40 modules at 0.98+) |
| Digest accuracy | 27 accurate · 9 minor issues · 4 graded C (5 P1 factual fixes) |
| Figures extracted | 238 — none displayed |
| Navigation/table artefacts rendered as content | 373 blocks |
| Quiz questions | 393; 99 show the answer in the stem, 41 are navigation-derived, 102 have no matching source sentence |
| Lessons with no quiz | 28 (plus one module with none) |

## The digests that need correction

1. **ch05** — says microservices make debugging harder; the source lists more efficient debugging as a benefit.
2. **g-tools** — describes a ten-section backend checklist as a quick tool-mapping table.
3. **s-schema** — attributes table access to roles; the source uses a user-defined schema.
4. **s-enterprise** — adds an ACID claim and misstates the five architecture attributes.
5. **s-large** — claims continuous security patching, which the source does not mention (graded B, fixed at P1).

## What is missing

- All diagrams and figures (0 of 238 shown).
- Table structure: concept/description, pattern summaries, comparison tables.
- Digest-level content: the g-tools checklist, two of the seven s-tips, CSCRF Parts III–IV, the hyperautomation 86% statistic.
- Section structure and provenance: 86 generic "Part N" lesson titles, nine modules with no headings, no page/section references.
- Assessment: 28 lessons with no quiz.

## Method

Text was extracted with `pdftotext -enc UTF-8`. Each module was compared with the PDF named in its `source` field using word ratios, 7-word shingle matching, source-coverage scoring, entity/number checks over every digest claim, and a manual read of each claim against its nearest source passages. Every quiz answer was checked against the PDF, the assembled stem and the option list.

Limits: figures were not OCR'd, so the audit can show a figure is missing but not whether its caption is faithful. Paraphrase was judged by reading source context; subtle shifts of emphasis can survive. PDFs are treated as the authority, not as independently verified facts.

## Scope note

This audit covers the 40 source PDFs, the 40 files in `modules/`, the 40 entries in `data.js` and the 393 generated quiz questions. A separate pedagogy layer (`curriculum.js`, `tutorials-*.js`, `glossary.js`) and `REVIEW.md` appeared in the repository while the audit was running; they are not included in these measurements. The module files and `data.js` themselves were unchanged throughout.

## Files

```
audit/
  index.html        browsable dashboard
  audit.css         styles
  audit-data.js     structured findings
  AUDIT-REPORT.md   full written report
  README.md         this file
```
