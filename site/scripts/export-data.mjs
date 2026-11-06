// Exports every data source of the field guide into JSON for the Next.js app.
// Run from site/:  npm run export-data   (reads the project root two levels up)
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import url from "node:url";

const here = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const out = path.resolve(here, "..", "data");
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(path.join(out, "modules"), { recursive: true });

global.window = globalThis;
const load = (f, extra = "") =>
  vm.runInThisContext(fs.readFileSync(path.join(root, f), "utf8") + extra, { filename: f });

load("data.js", "\n;globalThis.LIBRARY = LIBRARY;");
load("modules/catalog.js");
load("modules/figures.js");
load("curriculum.js");
load("glossary.js");
load("tutorials-core.js");
load("tutorials-data.js");
load("tutorials-systems.js");

const moduleFiles = fs
  .readdirSync(path.join(root, "modules"))
  .filter((f) => /^[a-z0-9-]+\.js$/.test(f) && !["catalog.js", "figures.js"].includes(f));
moduleFiles.forEach((f) => load(path.join("modules", f)));

const j = (file, value) => fs.writeFileSync(path.join(out, file), JSON.stringify(value));

j("docs.json", { tracks: globalThis.LIBRARY.tracks, docs: globalThis.LIBRARY.docs });
j("catalog.json", globalThis.FIELD_GUIDE_CATALOG);
j("figures.json", globalThis.FIELD_GUIDE_FIGURES || {});
j("paths.json", globalThis.FIELD_GUIDE_PATHS);
j("glossary.json", globalThis.FIELD_GUIDE_GLOSSARY);
j("guides.json", globalThis.FIELD_GUIDE_GUIDE);

// Tutorials get a precomputed search haystack.
const tutorials = globalThis.FIELD_GUIDE_TUTORIALS.map((t) => ({
  ...t,
  hay: [t.title, t.subtitle, (t.outcomes || []).join(" "), (t.blocks || []).map((b) => b.t || "").join(" ")].join(" ").toLowerCase(),
}));
j("tutorials.json", tutorials);

// One JSON per module, and an index module that imports them all.
// Auto-generated quizzes get an upgrade layer first:
//   1. an explanation quoting the source sentence that contains the answer
//   2. distractors drawn from the same lesson with matching case and length
function upgradeModule(mod) {
  let explained = 0;
  let reDistracted = 0;
  (mod.lessons || []).forEach((lesson) => {
    const fullText = lesson.blocks.map((b) => String(b.t || "")).join(" ");
    const sentences = fullText.split(/(?<=[.!?])\s+/);
    (lesson.quiz || []).forEach((q) => {
      if (!q || !q.a || !Array.isArray(q.o)) return;
      // --- 1. explanation: find the source sentence that answers the blank ---
      if (!q.why) {
        const needleWords = q.q.replace(/_+/g, " ").toLowerCase().split(/\W+/).filter((w) => w.length > 3);
        const answerLower = q.a.toLowerCase();
        let best = null;
        let bestScore = 0;
        sentences.forEach((s) => {
          const norm = s.toLowerCase();
          if (!norm.includes(answerLower)) return;
          const normWords = new Set(norm.split(/\W+/));
          let sc = 3;
          needleWords.forEach((w) => {
            if (normWords.has(w)) sc++;
          });
          if (sc > bestScore) {
            bestScore = sc;
            best = s.trim();
          }
        });
        if (best && bestScore >= Math.max(4, Math.ceil(needleWords.length / 2) + 3)) {
          q.why =
            "From the source text: “" +
            (best.length > 380 ? best.slice(0, 380) + "…”" : best) +
            "”";
          explained++;
        }
      }
      // --- 2. distractors: same-lesson words, same case, similar length ---
      if (/^[A-Za-z][A-Za-z-]*$/.test(q.a) && q.o.length === 4) {
        const answerCase = /^[A-Z]/.test(q.a);
        const alen = q.a.length;
        const freq = new Map();
        (fullText.match(/[A-Za-z][A-Za-z-]+/g) || []).forEach((t) => {
          if (t.toLowerCase() === q.a.toLowerCase()) return;
          if (/^[A-Z]/.test(t) !== answerCase) return;
          if (Math.abs(t.length - alen) > 2) return;
          const key = t.toLowerCase();
          if (q.q.toLowerCase().includes(key)) return;
          freq.set(key, (freq.get(key) || 0) + 1);
        });
        const opts = [...freq.keys()].sort(
          (a, b) => freq.get(b) - freq.get(a) || Math.abs(a.length - alen) - Math.abs(b.length - alen)
        );
        if (opts.length >= 3) {
          const distractors = opts.slice(0, 3).map((k) => (answerCase ? k[0].toUpperCase() + k.slice(1) : k));
          const pos = [...q.q].reduce((n, c) => n + c.charCodeAt(0), 0) % 4;
          q.o = [...distractors.slice(0, pos), q.a, ...distractors.slice(pos)];
          reDistracted++;
        }
      }
    });
  });
  return { explained, reDistracted };
}

const ids = [];
let explainedTotal = 0;
let reDistractedTotal = 0;
moduleFiles.forEach((f) => {
  const m = globalThis.FIELD_GUIDE_MODULES[f.replace(/\.js$/, "")];
  if (!m) return;
  const up = upgradeModule(m);
  explainedTotal += up.explained;
  reDistractedTotal += up.reDistracted;
  ids.push(m.id);
  j(path.join("modules", `${m.id}.json`), m);
  // keep the vanilla app and textbooks in sync: rewrite modules/<id>.js
  fs.writeFileSync(
    path.join(root, "modules", `${f}`),
    `// Generated by build/build-modules.js; quiz explanations + distractors added by site/scripts/export-data.mjs. Do not edit by hand.\nwindow.FIELD_GUIDE_MODULES = window.FIELD_GUIDE_MODULES || {};\nwindow.FIELD_GUIDE_MODULES[${JSON.stringify(m.id)}] = ${JSON.stringify(m)};\n`
  );
});
const imports = ids.map((id) => `import m_${id.replace(/-/g, "_")} from "./modules/${id}.json";`).join("\n");
const entries = ids.map((id) => `  "${id}": m_${id.replace(/-/g, "_")},`).join("\n");
fs.writeFileSync(path.join(out, "modules-index.js"), `// Generated by scripts/export-data.mjs — do not edit.\n${imports}\n\nexport default {\n${entries}\n};\n`);

// Full-text search index over every lesson (title + body text, lowercased).
const lessonsIndex = [];
ids.forEach((id) => {
  const m = globalThis.FIELD_GUIDE_MODULES[id];
  (m.lessons || []).forEach((lesson, i) => {
    lessonsIndex.push({
      m: id,
      i,
      title: lesson.title,
      text: lesson.blocks.map((b) => String(b.t || "")).join(" ").toLowerCase(),
    });
  });
});
j("lessons-index.json", lessonsIndex);

console.log(`Exported ${ids.length} modules + 7 data files → site/data/`);
console.log(`Quiz upgrade: ${explainedTotal} questions gained explanations, ${reDistractedTotal} got same-text distractors.`);
