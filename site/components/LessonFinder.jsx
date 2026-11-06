"use client";

// Lesson sidebar: filterable list of a module's lessons with completion ticks
// and a progress meter.
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadProgress, lessonDone, doneCount } from "@/lib/progress";

export default function LessonFinder({ id, lessons, current }) {
  const [p, setP] = useState(null);
  const [q, setQ] = useState("");
  useEffect(() => setP(loadProgress()), []);

  const visible = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return lessons.map((l, i) => ({ i, title: l.title }));
    return lessons
      .map((l, i) => ({ i, title: l.title, text: l.blocks.map((b) => b.t || "").join(" ") }))
      .filter((l) => (l.title + " " + l.text).toLowerCase().includes(n));
  }, [q, lessons]);

  return (
    <aside className="lesson-nav">
      <p className="muted small sidebar-progress" data-total={lessons.length}>
        <Meter id={id} total={lessons.length} progress={p} />
      </p>
      <input
        className="find"
        type="search"
        placeholder="Find in this module…"
        aria-label="Find in this module"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <ol className="nav-list">
        {visible.map((l) => {
          const done = p ? lessonDone(p, id, l.i) : false;
          return (
            <li key={l.i}>
              <Link href={`/modules/${id}/${l.i}`} className={l.i === current ? "current" : ""}>
                <span className="nav-num">{l.i + 1}</span>
                <span className="nav-title">{l.title}</span>
                {done ? <span className="nav-done">✓</span> : null}
              </Link>
            </li>
          );
        })}
      </ol>
      {q.trim() && !visible.length ? (
        <p className="muted">No lessons contain “{q}”.</p>
      ) : null}
    </aside>
  );
}

function Meter({ id, total, progress }) {
  if (!progress) return null;
  const done = doneCount(progress, id, total);
  return (
    <>
      {done} of {total} lessons complete
      <span className="meter" style={{ margin: "4px 0 0" }}>
        <span className="meter-bar">
          <span style={{ width: `${total ? Math.round((done / total) * 100) : 0}%` }} />
        </span>
      </span>
    </>
  );
}
