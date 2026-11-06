// Compile the whole library into end-to-end Markdown textbooks.
// Run: node build-textbooks.js  → writes textbooks/*.md
// Sources: data.js, modules/*, tutorials-*.js, curriculum.js, glossary.js, modules/figures.js
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

// ---- load the app data into a `window` stub -------------------------------
global.window = globalThis;

function load(file, extra) {
  vm.runInThisContext(fs.readFileSync(file, "utf8") + (extra || ""), { filename: file });
}

load("data.js", "\n;globalThis.LIBRARY = LIBRARY;");
load("modules/catalog.js");
load("modules/figures.js");
load("curriculum.js");
load("glossary.js");
load("tutorials-core.js");
load("tutorials-data.js");
load("tutorials-systems.js");

const docs = globalThis.LIBRARY.docs;
const tracks = globalThis.LIBRARY.tracks;
const trackName = {};
tracks.forEach((t) => (trackName[t.id] = t.name));

const catalogById = {};
(globalThis.FIELD_GUIDE_CATALOG || []).forEach((c) => (catalogById[c.id] = c));
const figures = globalThis.FIELD_GUIDE_FIGURES || {};
const paths = globalThis.FIELD_GUIDE_PATHS || [];
const tutorials = globalThis.FIELD_GUIDE_TUTORIALS || [];
const glossary = globalThis.FIELD_GUIDE_GLOSSARY || [];
const guide = globalThis.FIELD_GUIDE_GUIDE || {};

// modules are lazy-loaded in the app; load them all here
globalThis.FIELD_GUIDE_MODULES = globalThis.FIELD_GUIDE_MODULES || {};
fs.readdirSync("modules").forEach((f) => {
  if (/^[a-z0-9-]+\.js$/.test(f) && !["catalog.js", "figures.js"].includes(f)) {
    load(path.join("modules", f));
  }
});
const mods = globalThis.FIELD_GUIDE_MODULES;
const docById = {};
docs.forEach((d) => (docById[d.id] = d));

// ---- helpers ----------------------------------------------------------------
function slugify(s) {
  return String(s).toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function figLabel(name) {
  const m = String(name).match(/^p(\d+)-(\d+)/);
  return m ? `p. ${Number(m[1])} · figure ${Number(m[2])}` : String(name).replace(/\.png$/, "");
}

function words(blocks) {
  return (blocks || []).reduce((n, b) => n + String(b.t || "").split(/\s+/).filter(Boolean).length, 0);
}

// Cross-reference resolution for [text](#/route) links inside authored text.
function makeInline(book) {
  return function inline(s) {
    return String(s).replace(/\[([^\]]+)\]\((#\/[^)\s]+)\)/g, function (_, text, href) {
      const parts = href.split("/");
      const kind = parts[1], id = parts[2];
      if (kind === "module" && docById[id]) {
        if (book && book.chapterSlug[id]) return `[${text}](#${book.chapterSlug[id]})`;
        return `${text} *(see reference module: ${docById[id].title})*`;
      }
      if (kind === "tutorial" && tutorials.find((t) => t.id === id)) {
        const t = tutorials.find((t) => t.id === id);
        if (book && book.tutorialSlug[id]) return `[${text}](#${book.tutorialSlug[id]})`;
        return `${text} *(see tutorial: ${t.title})*`;
      }
      if (kind === "path" && paths.find((p) => p.id === id)) {
        const p = paths.find((p) => p.id === id);
        return `${text} *(learning path: ${p.name})*`;
      }
      if (kind === "paths") return `${text} *(learning paths)*`;
      if (kind === "glossary") return `${text} *(glossary)*`;
      return text;
    });
  };
}

// ---- block renderer -----------------------------------------------------------
function renderBlocks(blocks, inline, out) {
  (blocks || []).forEach((b) => {
    if (b.type === "table") {
      if (b.caption) out.push(`**${b.caption}**`, "");
      const esc = (c) => inline(String(c)).replace(/\|/g, "\\|").replace(/\n/g, " ");
      out.push(`| ${(b.head || []).map(esc).join(" | ")} |`);
      out.push(`| ${(b.head || []).map(() => "---").join(" | ")} |`);
      (b.rows || []).forEach((r) => out.push(`| ${r.map(esc).join(" | ")} |`));
      out.push("");
    } else if (b.type === "callout") {
      const label = { note: "Note", warn: "Warning", tip: "Tip", key: "Key idea" }[b.tone] || "Note";
      const body = (b.title ? `**${b.title}.** ` : "") + inline(b.t);
      out.push(...String(body).split("\n").map((l) => `> ${label !== "Note" ? `**${label}:** ` : " "}${l}`.replace(">  ", "> ")));
      out.push("");
    } else if (b.type === "steps") {
      (b.items || []).forEach((it, i) => out.push(`${i + 1}. ${inline(it)}`));
      out.push("");
    } else if (b.type === "compare") {
      const esc = (c) => inline(String(c)).replace(/\|/g, "\\|");
      out.push(`| ${esc(b.left.title)} | ${esc(b.right.title)} |`);
      out.push("| --- | --- |");
      const n = Math.max((b.left.items || []).length, (b.right.items || []).length);
      for (let i = 0; i < n; i++) {
        out.push(`| ${b.left.items && b.left.items[i] ? esc(b.left.items[i]) : " "} | ${b.right.items && b.right.items[i] ? esc(b.right.items[i]) : " "} |`);
      }
      out.push("");
    } else if (b.type === "flow") {
      if (b.caption) out.push(`**${b.caption}**`, "");
      const line = (b.nodes || []).map((n) => (n.sub ? `**${n.label}** (${n.sub})` : `**${n.label}**`)).join(" → ");
      out.push(line, "");
    } else if (b.type === "exercise") {
      const exTitle = String(b.title).replace(/^Exercise[:\s—-]+/i, "");
      out.push("> **Exercise — " + inline(exTitle) + "**", "");
      out.push(...String(inline(b.prompt)).split("\n").map((l) => `> ${l}`));
      out.push("");
      if (b.hint) out.push(`> *Hint:* ${inline(b.hint)}`, "");
      if (b.solution) out.push(`> *Worked answer:* ${inline(b.solution)}`, "");
    } else if (b.type === "checklist") {
      (b.items || []).forEach((it) => out.push(`- [ ] ${inline(it)}`));
      out.push("");
    } else if (b.h) {
      out.push(`#### ${inline(b.t)}`, "");
    } else if (b.c) {
      out.push("```", String(b.t), "```", "");
    } else {
      out.push(inline(b.t), "");
    }
  });
}

function renderQuiz(quiz, out) {
  if (!quiz || !quiz.length) return;
  out.push("**Check your understanding.**", "");
  quiz.forEach((q, qi) => {
    const ai = (q.o || []).indexOf(q.a);
    out.push(`**Q${qi + 1}.** ${q.q}`, "");
    (q.o || []).forEach((o, oi) => out.push(`- ${String.fromCharCode(65 + oi)}. ${o}`));
    out.push("");
    out.push(`✅ **Answer: ${String.fromCharCode(65 + ai)} — ${q.a}.**`);
    if (q.why) out.push(`> **Why:** ${q.why}`);
    out.push("");
  });
}

function renderFigures(id, out, rel) {
  const figs = figures[id] || [];
  if (!figs.length) return;
  out.push(`##### Figures from the source document`, "");
  figs.forEach((f) => {
    const src = `${rel}modules/media/${id}/${f}`;
    out.push(`![${figLabel(f)}](${src})`, "", `*${figLabel(f)}.*`, "");
  });
}

// ---- book builder --------------------------------------------------------------
const TOTAL_WORDS = docs.reduce((n, d) => n + ((catalogById[d.id] || {}).words || 0), 0);

function buildBook(track, { complete } = {}) {
  const bookDocs = complete ? docs : docs.filter((d) => d.track === track.id);
  const trackId = track.id;
  const bookTutorials = complete
    ? tutorials
    : tutorials.filter((t) => t.track === trackId || (t.modules || []).some((m) => docById[m] && docById[m].track === trackId));
  const bookTutIds = new Set(bookTutorials.map((t) => t.id));
  const bookDocIds = new Set(bookDocs.map((d) => d.id));

  const chapterSlug = {}, tutorialSlug = {};
  bookDocs.forEach((d, i) => (chapterSlug[d.id] = `${i + 1}-${slugify(d.title)}`));
  bookTutorials.forEach((t, i) => (tutorialSlug[t.id] = `tutorial-${i + 1}-${slugify(t.title)}`));
  const inline = makeInline(complete ? null : { chapterSlug: chapterSlug, tutorialSlug: tutorialSlug });

  const out = [];
  const titleName = complete ? "The Complete Field Guide" : `${trackName[trackId]} Textbook`;
  const bookDocsWords = bookDocs.reduce((n, d) => n + ((catalogById[d.id] || {}).words || 0), 0);
  const bookLessons = bookDocs.reduce((n, d) => n + ((catalogById[d.id] || {}).lessons || 0), 0);
  const bookQuestions = bookDocs.reduce((n, d) => n + ((catalogById[d.id] || {}).questions || 0), 0);
  const bookFigures = bookDocs.reduce((n, d) => n + (figures[d.id] || []).length, 0);

  // ---- front matter ----
  out.push(`# ${titleName}`, "");
  out.push(`*Compiled end-to-end edition of the Architecture & Backend Field Guide — generated locally on ${new Date().toISOString().slice(0, 10)}.*`, "");
  out.push(`**Contents:** ${bookDocs.length} reference chapters · ${bookLessons} lessons · ${bookQuestions} quiz questions with answers · ${bookTutorials.length} tutorials · ${bookFigures} figures · ${bookDocsWords.toLocaleString()} words of reference text.`, "");
  if (complete) {
    out.push(`**Also inside:** ${paths.length} guided learning paths and the full ${glossary.length}-term glossary.`, "");
  }
  out.push(
    "> **Provenance & use.** Reference chapters reproduce text extracted from the PDFs stored alongside this book, kept here for private study. Tutorials, learning paths and the glossary are original to this guide. Do not redistribute the reference chapters publicly; link or credit the original sources instead.",
    "",
    "Figure images are loaded from the `modules/media/` folders, so keep this book inside the project folder for the pictures to display.",
    "",
  );

  // ---- TOC ----
  out.push("## Table of contents", "");
  if (complete) {
    out.push("- [Part 0 — Learning paths](#part-0--learning-paths)");
  }
  out.push(`- [Part I — Reference chapters](#part-i--reference-chapters)`);
  bookDocs.forEach((d, i) => {
    const g = guide[d.id] || {};
    out.push(`  - [${i + 1}. ${d.title}](#${chapterSlug[d.id]}) — ${g.level || ""}${g.level ? " · " : ""}${g.minutes || "?"} min${g.minutes ? "" : ""}`);
  });
  out.push(`- [Part II — Tutorials](#part-ii--tutorials)`);
  bookTutorials.forEach((t, i) => out.push(`  - [T${i + 1}. ${t.title}](#${tutorialSlug[t.id]}) — ${t.level} · ${t.minutes} min`));
  out.push(`- [Part III — Glossary](#part-iii--glossary)`);
  out.push(`- [Appendix — Source documents](#appendix--source-documents)`);
  out.push("");

  // ---- Part 0: paths (complete edition only) ----
  if (complete) {
    out.push("---", "", "# Part 0 — Learning paths", "");
    out.push("*Each path orders chapters and tutorials so that every idea is introduced before it is used.*", "");
    paths.forEach((p, pi) => {
      out.push(`## Path ${pi + 1}. ${p.name}`, "");
      out.push(`*${p.tagline}* · **${p.level}** · about **${p.hours} hours** · ${p.steps.length} steps`, "");
      out.push(p.description, "");
      out.push("**By the end you can:**", "");
      p.outcomes.forEach((o) => out.push(`- ${o}`));
      out.push("");
      out.push(`| # | Type | Step | Why it is here |`);
      out.push(`| --- | --- | --- | --- |`);
      p.steps.forEach((s, si) => {
        const isTut = s.kind === "tutorial";
        const title = isTut ? (tutorials.find((t) => t.id === s.id) || {}).title : docById[s.id] ? docById[s.id].title : s.id;
        const link = isTut ? `[${title}](#${tutorialSlug[s.id]})` : `[${title}](#${chapterSlug[s.id]})`;
        out.push(`| ${si + 1} | ${isTut ? "Tutorial" : "Reference"} | ${link} | ${s.why.replace(/\|/g, "\\|")} |`);
      });
      out.push("");
    });
  }

  // ---- Part I: chapters ----
  out.push("---", "", "# Part I — Reference chapters", "");
  bookDocs.forEach((d, i) => {
    const mod = mods[d.id];
    const g = guide[d.id] || {};
    const cat = catalogById[d.id] || {};
    out.push(`## ${i + 1}. ${d.title}`, "");
    out.push(
      `*Reference chapter ${i + 1} of ${bookDocs.length} · source: \`${d.source}\` · ${cat.lessons || 0} lessons · ${(cat.words || 0).toLocaleString()} words${g.level ? ` · level: ${g.level}` : ""}${g.minutes ? ` · reading time: ~${g.minutes} min` : ""}*`,
      "",
    );
    out.push(`**Overview.** ${d.summary}`, "");
    const objectives = (g.objectives && g.objectives.length ? g.objectives : d.points) || [];
    out.push("**What you should be able to do:**", "");
    objectives.forEach((o) => out.push(`- ${o}`));
    out.push("");
    if (g.prereqs && g.prereqs.length) {
      out.push(`**Read first:** ${g.prereqs.map((pid) => (docById[pid] ? docById[pid].title : pid)).join(" · ")}`, "");
    }
    const rel = complete ? "../modules/" : "../modules/";
    (mod ? mod.lessons : []).forEach((lesson, li) => {
      if (/^NEXT CHAPTER/i.test(lesson.title)) return; // navigation stub, not content
      out.push(`### Lesson ${li + 1} — ${lesson.title}`, "");
      renderBlocks(lesson.blocks, inline, out);
      renderQuiz(lesson.quiz, out);
    });
    renderFigures(d.id, out, rel);
    out.push("---", "");
  });

  // ---- Part II: tutorials ----
  out.push("# Part II — Tutorials", "");
  out.push("*Original, authored teaching chapters with worked examples, exercises and explained answers.*", "");
  bookTutorials.forEach((t, i) => {
    out.push(`## Tutorial ${i + 1}. ${t.title}`, "");
    out.push(`*${t.subtitle} · ${t.level} · ~${t.minutes} min · companion modules: ${(t.modules || []).map((m) => (docById[m] ? docById[m].title : m)).join(" · ") || "—"}*`, "");
    out.push("**You will learn to:**", "");
    t.outcomes.forEach((o) => out.push(`- ${o}`));
    out.push("");
    renderBlocks(t.blocks, inline, out);
    renderQuiz(t.quiz, out);
    out.push("---", "");
  });

  // ---- Part III: glossary ----
  const terms = glossary.filter((g) =>
    (g.see || []).some((id) => bookDocIds.has(id)) || (g.tut || []).some((id) => bookTutIds.has(id))
  ).sort((a, b) => a.term.localeCompare(b.term));
  out.push("# Part III — Glossary", "");
  out.push(`*${terms.length} terms used across this book, with pointers back to where each is taught.*`, "");
  terms.forEach((g) => {
    const see = (g.see || []).filter((id) => bookDocIds.has(id))
      .map((id) => { const d = docById[id]; const i = bookDocs.indexOf(d); return d ? `[${d.title}](#${chapterSlug[id]})` : id; });
    const tut = (g.tut || []).filter((id) => bookTutIds.has(id))
      .map((id) => { const t = tutorials.find((x) => x.id === id); const i = bookTutorials.indexOf(t); return t ? `[${t.title}](#${tutorialSlug[id]})` : id; });
    const refs = see.concat(tut.map((s) => `tutorial: ${s}`)).join(" · ");
    out.push(`**${g.term}** *(${g.cat})* — ${g.def}${refs ? `\n\n*Taught in:* ${refs}` : ""}`, "");
  });

  // ---- appendix ----
  out.push("---", "", "# Appendix — Source documents", "");
  out.push(`| # | Module | Source PDF | Lessons | Words | Questions | Figures |`);
  out.push(`| --- | --- | --- | --- | --- | --- | --- |`);
  bookDocs.forEach((d, i) => {
    const cat = catalogById[d.id] || {};
    out.push(`| ${i + 1} | ${d.title} | \`${d.source}\` | ${cat.lessons || 0} | ${(cat.words || 0).toLocaleString()} | ${cat.questions || 0} | ${(figures[d.id] || []).length} |`);
  });
  out.push("", `*Corpus total across the whole library: ${docs.length} documents, ${TOTAL_WORDS.toLocaleString()} words.*`, "");

  return out.join("\n");
}

// ---- write the books ------------------------------------------------------------
fs.mkdirSync("textbooks", { recursive: true });
const trackBooks = tracks.map((t, i) => ({
  file: `textbooks/0${i + 1}-${slugify(trackName[t.id])}-textbook.md`,
  md: buildBook(t),
}));
const complete = { file: "textbooks/00-complete-field-guide.md", md: buildBook(tracks[0], { complete: true }) };

[complete, ...trackBooks].forEach((b) => {
  fs.writeFileSync(b.file, b.md.replace(/\n{3,}/g, "\n\n"));
  console.log(`${b.file}  ${(fs.statSync(b.file).size / 1024).toFixed(0)} KB`);
});

// ---- README index ----
const readmes = [];
readmes.push("# Textbooks", "");
readmes.push(`End-to-end books compiled from this workspace on ${new Date().toISOString().slice(0, 10)}. Regenerate any time with \`node build-textbooks.js\`.`, "");
readmes.push("| Book | Contents |");
readmes.push("| --- | --- |");
[complete, ...trackBooks].forEach((b) => {
  const size = (fs.statSync(b.file).size / 1024).toFixed(0);
  readmes.push(`| [${path.basename(b.file)}](${path.basename(b.file)}) | ${size} KB |`);
});
readmes.push("", "Each book contains: front matter with provenance, a linked table of contents, all reference chapters (every lesson, every quiz **with answers**, figures), the authored tutorials, the track glossary, and an appendix of source PDFs. The complete edition adds the six learning paths and the full glossary.", "");
fs.writeFileSync("textbooks/README.md", readmes.join("\n"));
console.log("textbooks/README.md written");
