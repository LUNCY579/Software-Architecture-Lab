import Link from "next/link";
import { notFound } from "next/navigation";
import FiguresGallery from "@/components/FiguresGallery";
import LessonFinder from "@/components/LessonFinder";
import { docs, docById, getModule, catalog, guide, trackName, moduleObjectives, relatedTutorials, figures, moduleMeta, glossary } from "@/lib/data";

export function generateStaticParams() {
  return docs.map((d) => ({ id: d.id }));
}

export function generateMetadata({ params }) {
  const d = docById[params.id];
  return { title: d ? d.title : "Module" };
}

export default function ModulePage({ params }) {
  const d = docById[params.id];
  if (!d) notFound();
  const mod = getModule(d.id);
  if (!mod) notFound();

  const g = guide[d.id] || {};
  const figs = figures[d.id] || [];
  const tuts = relatedTutorials(d.id);
  const relatedDocs = docs
    .filter((x) => x.id !== d.id && x.tags.some((t) => d.tags.includes(t)))
    .map((x) => ({ x, n: x.tags.filter((t) => d.tags.includes(t)).length }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 4)
    .map((r) => r.x);
  const keyTerms = glossary.filter((g) => (g.see || []).includes(d.id)).slice(0, 10);
  const pos = docs.findIndex((x) => x.id === d.id);
  const prevMod = pos > 0 ? docs[pos - 1] : null;
  const nextMod = pos > -1 && pos < docs.length - 1 ? docs[pos + 1] : null;

  return (
    <>
      <Link className="crumb" href="/modules">← All modules</Link>
      <header className="module-head">
        <div className="module-top">
          <span className="badge">{trackName[d.track] || d.track}</span>
          <span className="muted">{moduleMeta(d.id)}</span>
        </div>
        <h1>{d.title}</h1>
        <p className="summary">{d.summary}</p>
        <div className="outcomes">
          <h3>What you should be able to do</h3>
          <ul>
            {moduleObjectives(d.id).map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        </div>
        {g.prereqs && g.prereqs.length ? (
          <p className="prereqs">
            <span className="muted">Read first: </span>
            {g.prereqs.map((pid, i) => (
              <span key={pid}>
                {i ? ", " : ""}
                {docById[pid] ? <Link href={`/modules/${pid}`}>{docById[pid].title}</Link> : pid}
              </span>
            ))}
          </p>
        ) : null}
        {tuts.length ? (
          <div className="related">
            <span className="muted">Practise with: </span>
            {tuts.map((t, i) => (
              <span key={t.id}>
                {i ? " · " : ""}
                <Link href={`/tutorials/${t.id}`}>{t.title}</Link>
              </span>
            ))}
          </div>
        ) : null}
        {relatedDocs.length ? (
          <div className="related">
            <span className="muted">Related modules: </span>
            {relatedDocs.map((r, i) => (
              <span key={r.id}>
                {i ? " · " : ""}
                <Link href={`/modules/${r.id}`}>{r.title}</Link>
              </span>
            ))}
          </div>
        ) : null}
        {keyTerms.length ? (
          <div className="related tags" style={{ marginTop: 10 }}>
            <span className="muted">Key terms: </span>
            {keyTerms.map((k) => (
              <Link key={k.term} className="tag" href="/glossary">{k.term}</Link>
            ))}
          </div>
        ) : null}
        <div className="module-meta">
          <a className="btn ghost small" href={`/${encodeURI(d.source)}`} target="_blank" rel="noopener">
            Open original PDF
          </a>
          {d.tags.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
        <p className="provenance">
          Reference text extracted from the source PDF ({catalog[d.id] ? catalog[d.id].words.toLocaleString() : "?"}{" "}
          words, {mod.lessons.length} lessons, {catalog[d.id] ? catalog[d.id].questions : 0} questions).
        </p>
      </header>

      <FiguresGallery moduleId={d.id} figures={figs} title={d.title} />

      <h2 className="section-head" style={{ marginTop: 28 }}>
        <div>
          <h2>Lessons</h2>
          <p className="muted">Work through in order; every lesson ends with an explained check.</p>
        </div>
      </h2>
      <div className="module-layout">
        <LessonFinder id={d.id} lessons={mod.lessons} current={-1} />
        <div>
          <ol className="step-list">
            {mod.lessons.map((lesson, i) => (
              <li key={i} className="step">
                <span className="step-num">{i + 1}</span>
                <div className="step-body">
                  <div className="step-title">
                    <Link href={`/modules/${d.id}/${i}`}>{lesson.title}</Link>
                    {lesson.quiz && lesson.quiz.length ? (
                      <span className="tag">{lesson.quiz.length} questions</span>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <nav className="module-nav">
        {prevMod ? <Link className="module-nav-link prev" href={`/modules/${prevMod.id}`}>← {prevMod.title}</Link> : <span />}
        {nextMod ? <Link className="module-nav-link next" href={`/modules/${nextMod.id}`}>{nextMod.title} →</Link> : <span />}
      </nav>
    </>
  );
}
