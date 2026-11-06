"use client";

// Learning path cards with live progress meters.
import { useEffect, useState } from "react";
import Link from "next/link";
import paths from "@/data/paths.json";
import catalogList from "@/data/catalog.json";
import { loadProgress, moduleDone, tutorialDone } from "@/lib/progress";

const catalog = Object.fromEntries(catalogList.map((c) => [c.id, c]));
const tutTitles = {};
import tutorialsJson from "@/data/tutorials.json";
tutorialsJson.forEach((t) => (tutTitles[t.id] = t.title));

export default function PathCards({ limit }) {
  const [p, setP] = useState(null);
  useEffect(() => setP(loadProgress()), []);

  function stepDone(step) {
    if (!p) return false;
    return step.kind === "tutorial"
      ? tutorialDone(p, step.id)
      : moduleDone(p, step.id, catalog[step.id] ? catalog[step.id].lessons : 0);
  }

  return (
    <section className="grid paths-grid">
      {(limit ? paths.slice(0, limit) : paths).map((path) => {
        const done = path.steps.filter(stepDone).length;
        const complete = done === path.steps.length;
        const next = path.steps.find((s) => !stepDone(s)) || path.steps[0];
        const href = next.kind === "tutorial" ? `/tutorials/${next.id}` : `/modules/${next.id}`;
        return (
          <article key={path.id} className={`card path-card${complete ? " is-done" : ""}`}>
            <p className="kicker">{path.level} · {path.hours} hours · {path.steps.length} steps</p>
            <h2><Link href={`/paths/${path.id}`}>{path.name}</Link></h2>
            <p className="summary">{path.tagline}</p>
            <div className="meter">
              <div className="meter-bar">
                <span style={{ width: `${Math.round((done / path.steps.length) * 100)}%` }} />
              </div>
            </div>
            <p className="stats">{done} of {path.steps.length} steps complete</p>
            <div className="card-foot">
              <span className="tag">{path.hours} hours</span>
              <Link className="btn small" href={`/paths/${path.id}`}>
                {done ? (complete ? "Review" : "Continue") : "Start path"}
              </Link>
            </div>
          </article>
        );
      })}
    </section>
  );
}
