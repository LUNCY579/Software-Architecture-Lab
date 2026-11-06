// Server-side data access. All content is build-time JSON (SSG), so no
// runtime data source is needed.
import docsFile from "@/data/docs.json";
import catalogList from "@/data/catalog.json";
import paths from "@/data/paths.json";
import tutorials from "@/data/tutorials.json";
import glossary from "@/data/glossary.json";
import guides from "@/data/guides.json";
import figures from "@/data/figures.json";
import moduleIndex from "@/data/modules-index.js";

export const tracks = docsFile.tracks;
export const docs = docsFile.docs;
export const docById = Object.fromEntries(docs.map((d) => [d.id, d]));
export const trackName = Object.fromEntries(tracks.map((t) => [t.id, t.name]));
export const catalog = Object.fromEntries(catalogList.map((c) => [c.id, c]));
export const pathById = Object.fromEntries(paths.map((p) => [p.id, p]));
export const tutorialById = Object.fromEntries(tutorials.map((t) => [t.id, t]));
export const guide = guides;
export { paths, tutorials, glossary, figures };

export function getModule(id) {
  return moduleIndex[id] || null;
}

export function lessonTotal(id) {
  return catalog[id] ? catalog[id].lessons : 0;
}

export function moduleMeta(id) {
  const g = guide[id] || {};
  const bits = [];
  if (g.level) bits.push(g.level);
  if (g.minutes) bits.push(`${g.minutes} min`);
  if (catalog[id]) bits.push(`${catalog[id].lessons} lessons`);
  return bits.join(" · ");
}

export function moduleObjectives(id) {
  const g = guide[id] || {};
  if (g.objectives && g.objectives.length) return g.objectives;
  return docById[id] ? docById[id].points : [];
}

export function relatedTutorials(moduleId) {
  return tutorials.filter((t) => (t.modules || []).indexOf(moduleId) !== -1);
}

export function figLabel(name) {
  const m = String(name).match(/^p(\d+)-(\d+)/);
  return m ? `p. ${Number(m[1])} · figure ${Number(m[2])}` : String(name).replace(/\.png$/, "");
}

export function firstIncompleteHref(steps) {
  // Server-side default: the first step (progress is client-only).
  const s = steps[0];
  if (!s) return "/";
  return s.kind === "tutorial" ? `/tutorials/${s.id}` : `/modules/${s.id}`;
}
