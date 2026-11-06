"use client";

// Reference library browser: search, track filters, hide-completed, progress meters.
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import docsFile from "@/data/docs.json";
import catalogList from "@/data/catalog.json";
import guides from "@/data/guides.json";
import { loadProgress, doneCount, moduleDone } from "@/lib/progress";

const trackName = Object.fromEntries(docsFile.tracks.map((t) => [t.id, t.name]));
const catalog = Object.fromEntries(catalogList.map((c) => [c.id, c]));

export default function LibraryBrowser() {
  const [p, setP] = useState(() => (typeof window === "undefined" ? null : loadProgress()));
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState("all");
  const [hideDone, setHideDone] = useState(false);

  useEffect(() => setP(loadProgress()), []);

  const list = useMemo(() => {
    const n = query.trim().toLowerCase();
    return docsFile.docs.filter((d) => {
      const total = catalog[d.id] ? catalog[d.id].lessons : 0;
      if (track !== "all" && d.track !== track) return false;
      if (hideDone && p && moduleDone(p, d.id, total)) return false;
      if (!n) return true;
      const hay = [d.title, d.summary, trackName[d.track], d.tags.join(" "), d.points.join(" ")].join(" ").toLowerCase();
      return n.split(/\s+/).every((w) => hay.includes(w));
    });
  }, [query, track, hideDone, p]);

  return (
    <>
      <section className="toolbar">
        <input
          type="search"
          placeholder="Search modules, tags or key points…"
          aria-label="Search modules"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="chips">
          {[{ id: "all", name: "All" }].concat(docsFile.tracks).map((t) => {
            const count = t.id === "all" ? docsFile.docs.length : docsFile.docs.filter((d) => d.track === t.id).length;
            return (
              <button
                key={t.id}
                type="button"
                className="chip"
                aria-pressed={track === t.id}
                onClick={() => setTrack(t.id)}
              >
                {t.name} <span className="count">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="toolbar-row">
          <label className="toggle">
            <input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} />
            Hide completed modules
          </label>
        </div>
      </section>

      <p className="result-count">{list.length}{list.length === 1 ? " module" : " modules"}</p>
      <section className="grid">
        {list.map((d) => {
          const total = catalog[d.id] ? catalog[d.id].lessons : 0;
          const done = p ? doneCount(p, d.id, total) : 0;
          const g = guides[d.id] || {};
          const meta = [g.level, g.minutes ? `${g.minutes} min` : "", total ? `${total} lessons` : ""].filter(Boolean).join(" · ");
          return (
            <article key={d.id} className={`card${total && done >= total ? " is-done" : ""}`}>
              <h2><Link href={`/modules/${d.id}`}>{d.title}</Link></h2>
              <p className="summary">{d.summary}</p>
              <p className="stats">{meta} · {done} of {total} done</p>
              <div className="meter">
                <div className="meter-bar">
                  <span style={{ width: `${total ? Math.round((done / total) * 100) : 0}%` }} />
                </div>
              </div>
              <div className="tags">
                {d.tags.slice(0, 4).map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
              <div className="card-foot">
                <span className="badge">{trackName[d.track] || d.track}</span>
                <Link className="btn small" href={`/modules/${d.id}/0`}>{done ? "Continue" : "Start"}</Link>
              </div>
            </article>
          );
        })}
      </section>
      {!list.length ? <p className="empty">No modules match. Try another search or track.</p> : null}
    </>
  );
}
