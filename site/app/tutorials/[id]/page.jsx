import Link from "next/link";
import { notFound } from "next/navigation";
import Blocks from "@/components/Blocks";
import Quiz from "@/components/Quiz";
import TutorialComplete from "@/components/TutorialComplete";
import TermEnhancer from "@/components/TermEnhancer";
import { tutorials, tutorialById, docById, trackName } from "@/lib/data";

export function generateStaticParams() {
  return tutorials.map((t) => ({ id: t.id }));
}

export function generateMetadata({ params }) {
  const t = tutorialById[params.id];
  return { title: t ? t.title : "Tutorial" };
}

export default function TutorialPage({ params }) {
  const t = tutorialById[params.id];
  if (!t) notFound();

  const index = tutorials.findIndex((x) => x.id === t.id);
  const prev = index > 0 ? tutorials[index - 1] : null;
  const next = index < tutorials.length - 1 ? tutorials[index + 1] : null;

  return (
    <>
      <Link className="crumb" href="/tutorials">← All tutorials</Link>
      <header className="module-head tut-head">
        <div className="module-top">
          <span className="badge">{trackName[t.track] || t.track}</span>
          <span className="muted">{t.level} · {t.minutes} min</span>
        </div>
        <h1>{t.title}</h1>
        <p className="summary">{t.subtitle}</p>
        <div className="outcomes">
          <h3>You will learn to</h3>
          <ul>
            {t.outcomes.map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        </div>
        {t.modules && t.modules.length ? (
          <p className="prereqs">
            <span className="muted">Companion references: </span>
            {t.modules.map((mid, i) => (
              <span key={mid}>
                {i ? ", " : ""}
                {docById[mid] ? <Link href={`/modules/${mid}`}>{docById[mid].title}</Link> : mid}
              </span>
            ))}
          </p>
        ) : null}
      </header>

      <article className="lesson tutorial-body">
        <TermEnhancer>
          <Blocks blocks={t.blocks} />
        </TermEnhancer>
        <Quiz questions={t.quiz} store={{ type: "tutorial", id: t.id }} />
        <footer className="lesson-controls">
          <TutorialComplete id={t.id} />
        </footer>
        <nav className="module-nav">
          {prev ? <Link className="module-nav-link prev" href={`/tutorials/${prev.id}`}>← {prev.title}</Link> : <span />}
          {next ? <Link className="module-nav-link next" href={`/tutorials/${next.id}`}>{next.title} →</Link> : <span />}
        </nav>
      </article>
    </>
  );
}
