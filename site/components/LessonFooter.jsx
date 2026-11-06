"use client";

// Lesson footer: complete toggle + prev/next lesson links.
import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProgress, saveProgress, lessonDone } from "@/lib/progress";

export default function LessonFooter({ id, idx, prev, next }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDone(lessonDone(loadProgress(), id, idx));
  }, [id, idx]);

  function toggle() {
    const p = loadProgress();
    p.lessons[id] = p.lessons[id] || {};
    const nowDone = !lessonDone(p, id, idx);
    if (nowDone) p.lessons[id][String(idx)] = true;
    else delete p.lessons[id][String(idx)];
    p.last = { kind: "module", id, idx, at: Date.now() };
    saveProgress(p);
    setDone(nowDone);
  }

  return (
    <footer className="lesson-controls">
      {prev != null ? (
        <Link className="btn ghost" href={`/modules/${id}/${prev}`}>← Previous</Link>
      ) : (
        <span className="btn ghost" aria-disabled="true">← Previous</span>
      )}
      <button className={`btn${done ? " done" : ""}`} type="button" aria-pressed={done} onClick={toggle}>
        {done ? "✓ Completed" : "Mark lesson complete"}
      </button>
      {next != null ? (
        <Link className="btn ghost" href={`/modules/${id}/${next}`}>Next →</Link>
      ) : (
        <span className="btn ghost" aria-disabled="true">Next →</span>
      )}
    </footer>
  );
}
