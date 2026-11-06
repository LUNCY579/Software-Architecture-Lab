// Client-side progress store. Shares the same localStorage key and shape as
// the original vanilla app, so existing progress carries over unchanged.
export const PROGRESS_KEY = "fieldguide-progress-v2";

const EMPTY = { lessons: {}, quiz: {}, tutorials: {}, tquiz: {}, last: null };

export function loadProgress() {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const p = JSON.parse(localStorage.getItem(PROGRESS_KEY));
    if (p && p.lessons && p.quiz) {
      p.tutorials = p.tutorials || {};
      p.tquiz = p.tquiz || {};
      return p;
    }
  } catch (e) {
    /* corrupt storage: start fresh */
  }
  return { ...EMPTY };
}

export function saveProgress(p) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  } catch (e) {
    /* storage unavailable */
  }
}

export function lessonDone(p, id, idx) {
  return !!(p.lessons[id] && p.lessons[id][String(idx)]);
}

export function doneCount(p, id, total) {
  const m = p.lessons[id] || {};
  return Object.keys(m).filter((k) => m[k] && Number(k) < total).length;
}

export function moduleDone(p, id, total) {
  return total > 0 && doneCount(p, id, total) >= total;
}

export function tutorialDone(p, id) {
  return !!p.tutorials[id];
}
