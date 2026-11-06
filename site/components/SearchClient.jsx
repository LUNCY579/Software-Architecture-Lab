"use client";

// Site-wide search page (client): filters modules, tutorials and glossary terms.
import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import docsFile from "@/data/docs.json";
import tutorials from "@/data/tutorials.json";
import glossary from "@/data/glossary.json";
import catalogList from "@/data/catalog.json";
import guides from "@/data/guides.json";
import lessonsIndex from "@/data/lessons-index.json";
import { loadProgress, doneCount } from "@/lib/progress";

const trackName = Object.fromEntries(docsFile.tracks.map((t) => [t.id, t.name]));
const catalog = Object.fromEntries(catalogList.map((c) => [c.id, c]));
const docById2 = Object.fromEntries(docsFile.docs.map((d) => [d.id, d]));

export default function SearchClient() {
  const params = useSearchParams();
  const [p, setP] = useState(null);
  const [input, setInput] = useState(params.get("q") || "");
  const q = (input || params.get("q") || "").trim().toLowerCase();

  useEffect(() => setP(loadProgress()), []);

  const results = useMemo(() => {
    if (!q) return null;
    const n = q.split(/\s+/);
    const hit = (text) => n.every((w) => String(text).toLowerCase().includes(w));
    return {
      mods: docsFile.docs.filter((d) => hit([d.title, d.summary, d.tags.join(" "), d.points.join(" ")].join(" "))),
      tuts: tutorials.filter((t) => hit([t.title, t.subtitle, t.outcomes.join(" "), t.hay].join(" "))),
      terms: glossary.filter((g) => hit(g.term + " " + g.def)),
      lessons: lessonsIndex.filter((l) => hit(l.title + " " + l.text)),
    };
  }, [q]);

  function excerpt(text) {
    const first = q.split(/\s+/)[0];
    const at = text.indexOf(first);
    if (at === -1) return text.slice(0, 150);
    return "…" + text.slice(Math.max(0, at - 60), at + 140).trim() + "…";
  }

  return (
    <>
      <section className="toolbar">
        <input
          type="search"
          placeholder="Search everything…"
          aria-label="Search everything"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </section>
      {!results ? (
        <p className="muted">Type in the search box above.</p>
      ) : !results.mods.length && !results.tuts.length && !results.terms.length && !results.lessons.length ? (
        <p className="empty">Nothing matched. Try a shorter term.</p>
      ) : (
        <>
          {results.tuts.length ? (
            <>
              <h2 className="search-group">Tutorials ({results.tuts.length})</h2>
              <section className="grid tut-grid">
                {results.tuts.map((t) => (
                  <article key={t.id} className="card tutorial-card">
                    <p className="kicker">{t.level} · {t.minutes} min</p>
                    <h2><Link href={`/tutorials/${t.id}`}>{t.title}</Link></h2>
                    <p className="summary">{t.subtitle}</p>
                  </article>
                ))}
              </section>
            </>
          ) : null}
          {results.lessons.length ? (
            <>
              <h2 className="search-group">Lessons ({results.lessons.length})</h2>
              <div className="glossary compact">
                {results.lessons.slice(0, 40).map((l) => (
                  <div key={`${l.m}-${l.i}`} className="gloss-row">
                    <h3>
                      <Link href={`/modules/${l.m}/${l.i}`}>{l.title}</Link>
                    </h3>
                    <p className="gloss-see">
                      {(docById2[l.m] || {}).title || l.m} · <span className="muted">{excerpt(l.text)}</span>
                    </p>
                  </div>
                ))}
                {results.lessons.length > 40 ? (
                  <p className="muted">…and {results.lessons.length - 40} more lessons. Refine your search.</p>
                ) : null}
              </div>
            </>
          ) : null}
          {results.terms.length ? (
            <>
              <h2 className="search-group">Glossary ({results.terms.length})</h2>
              <div className="glossary compact">
                {results.terms.map((g) => (
                  <div key={g.term} className="gloss-row">
                    <h3><Link href="/glossary">{g.term}</Link></h3>
                    <p className="gloss-def">{g.def}</p>
                  </div>
                ))}
              </div>
            </>
          ) : null}
          {results.mods.length ? (
            <>
              <h2 className="search-group">Modules ({results.mods.length})</h2>
              <section className="grid">
                {results.mods.map((d) => {
                  const total = catalog[d.id] ? catalog[d.id].lessons : 0;
                  const done = p ? doneCount(p, d.id, total) : 0;
                  const g = guides[d.id] || {};
                  return (
                    <article key={d.id} className="card">
                      <h2><Link href={`/modules/${d.id}`}>{d.title}</Link></h2>
                      <p className="summary">{d.summary}</p>
                      <p className="stats">{[g.level, g.minutes ? `${g.minutes} min` : "", total ? `${done} of ${total} done` : ""].filter(Boolean).join(" · ")}</p>
                      <div className="card-foot">
                        <span className="badge">{trackName[d.track] || d.track}</span>
                        <Link className="btn small" href={`/modules/${d.id}/0`}>{done ? "Continue" : "Start"}</Link>
                      </div>
                    </article>
                  );
                })}
              </section>
            </>
          ) : null}
        </>
      )}
    </>
  );
}
