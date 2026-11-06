import Link from "next/link";
import HeroClient from "@/components/HeroClient";
import PathCards from "@/components/PathCards";
import TutorialCards from "@/components/TutorialCards";
import LibraryBrowser from "@/components/LibraryBrowser";
import { docs, catalog, tutorials, glossary, paths } from "@/lib/data";

function statTile(n, label) {
  return (
    <div className="stat">
      <span className="stat-num">{n}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function Home() {
  const totalLessons = Object.values(catalog).reduce((n, c) => n + c.lessons, 0);

  return (
    <>
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="kicker">Self-paced field guide</p>
            <h1>Learn software architecture by reasoning about trade-offs</h1>
            <p className="hero-sub">
              {paths.length} guided paths, {tutorials.length} hands-on tutorials with worked examples, and a reference
              library of {docs.length} source modules. Progress is saved in this browser.
            </p>
            <HeroClient />
          </div>
          <div />
        </div>
      </section>

      <section className="stat-grid">
        {statTile(paths.length, "learning paths")}
        {statTile(tutorials.length, "tutorials")}
        {statTile(totalLessons, "reference lessons")}
        {statTile(glossary.length, "glossary terms")}
        {statTile(433, "explained quiz answers")}
      </section>

      <div className="section-head">
        <div>
          <h2>Learning paths</h2>
          <p className="muted">An ordered route with a reason for every step. Start with Foundations if you are new.</p>
        </div>
        <Link className="link-more" href="/paths">All paths →</Link>
      </div>
      <PathCards limit={3} />

      <div className="section-head">
        <div>
          <h2>Hands-on tutorials</h2>
          <p className="muted">Original explainers with worked numbers, code, exercises and explained answers.</p>
        </div>
        <Link className="link-more" href="/tutorials">All tutorials →</Link>
      </div>
      <TutorialCards limit={3} />

      <div className="section-head">
        <div>
          <h2>Reference library</h2>
          <p className="muted">
            Extracted text from the source PDFs, one module per document — each with figures, quizzes and completion
            tracking.
          </p>
        </div>
        <Link className="link-more" href="/modules">All modules →</Link>
      </div>
      <LibraryBrowser />
    </>
  );
}
