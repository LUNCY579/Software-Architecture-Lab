"use client";

// Tutorial cards with completion state.
import { useEffect, useState } from "react";
import Link from "next/link";
import tutorials from "@/data/tutorials.json";
import { loadProgress, tutorialDone } from "@/lib/progress";

const trackName = { architecture: "Architecture", gaming: "Gaming Backend", sql: "SQL & Databases", web: "Web & Tools" };

export default function TutorialCards({ limit }) {
  const [p, setP] = useState(null);
  useEffect(() => setP(loadProgress()), []);

  return (
    <section className="grid tut-grid">
      {(limit ? tutorials.slice(0, limit) : tutorials).map((t) => {
        const done = p ? tutorialDone(p, t.id) : false;
        return (
          <article key={t.id} className={`card tutorial-card${done ? " is-done" : ""}`}>
            <p className="kicker">{t.level} · {t.minutes} min · {(t.modules || []).length} sources</p>
            <h2><Link href={`/tutorials/${t.id}`}>{t.title}</Link></h2>
            <p className="summary">{t.subtitle}</p>
            <div className="card-foot">
              <span className="badge">{trackName[t.track] || t.track}</span>
              <Link className="btn small" href={`/tutorials/${t.id}`}>{done ? "Review" : "Open"}</Link>
            </div>
          </article>
        );
      })}
    </section>
  );
}
