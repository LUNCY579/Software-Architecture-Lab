"use client";

// Home hero island: overall progress ring + "continue where you left off".
import { useEffect, useState } from "react";
import Link from "next/link";
import docsFile from "@/data/docs.json";
import catalogList from "@/data/catalog.json";
import paths from "@/data/paths.json";
import tutorials from "@/data/tutorials.json";
import { loadProgress, moduleDone, doneCount, tutorialDone } from "@/lib/progress";

const catalog = Object.fromEntries(catalogList.map((c) => [c.id, c]));
const docById = Object.fromEntries(docsFile.docs.map((d) => [d.id, d]));
const tutById = Object.fromEntries(tutorials.map((t) => [t.id, t]));

export default function HeroClient() {
  const [p, setP] = useState(null);

  useEffect(() => setP(loadProgress()), []);

  if (!p) return null;

  let totalLessons = 0;
  let doneLessons = 0;
  docsFile.docs.forEach((d) => {
    const total = catalog[d.id] ? catalog[d.id].lessons : 0;
    totalLessons += total;
    doneLessons += doneCount(p, d.id, total);
  });
  const pct = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0;

  function stepDone(step) {
    return step.kind === "tutorial"
      ? tutorialDone(p, step.id)
      : moduleDone(p, step.id, catalog[step.id] ? catalog[step.id].lessons : 0);
  }

  let target = null;
  const last = p.last;
  if (last && last.kind === "module" && docById[last.id]) {
    const total = catalog[last.id] ? catalog[last.id].lessons : 0;
    if (!moduleDone(p, last.id, total)) {
      target = { href: `/modules/${last.id}/${last.idx || 0}`, label: `Module · ${docById[last.id].title}` };
    }
  }
  if (!target && last && last.kind === "tutorial" && tutById[last.id]) {
    target = { href: `/tutorials/${last.id}`, label: `Tutorial · ${tutById[last.id].title}` };
  }
  if (!target) {
    const path = paths[0];
    const step = path.steps.find((s) => !stepDone(s)) || path.steps[0];
    target = {
      href: step.kind === "tutorial" ? `/tutorials/${step.id}` : `/modules/${step.id}`,
      label: `${path.name} · ${step.kind === "tutorial" ? tutById[step.id].title : docById[step.id].title}`,
    };
  }

  const doneModules = docsFile.docs.filter((d) => {
    const total = catalog[d.id] ? catalog[d.id].lessons : 0;
    return moduleDone(p, d.id, total);
  }).length;
  const doneTuts = tutorials.filter((t) => tutorialDone(p, t.id)).length;

  return (
    <>
      <div className="hero-actions">
        <Link className="btn" href={target.href}>Continue learning</Link>
        <Link className="btn ghost" href="/paths">Browse paths</Link>
      </div>
      <p className="hero-note">Next up: {target.label}</p>
      <aside className="hero-panel">
        <p className="hero-panel-label">Overall progress</p>
        <div className="hero-progress">
          <div className="ring" style={{ "--pct": String(pct) }}>
            <span>{pct}%</span>
          </div>
          <div>
            <strong>{doneLessons} of {totalLessons}</strong>
            <p>lessons complete · {doneModules}/{docsFile.docs.length} modules · {doneTuts}/{tutorials.length} tutorials</p>
          </div>
        </div>
        <div className="hero-divider" />
        <p className="hero-panel-label">Next up</p>
        <p className="hero-next">{target.label}</p>
        <Link className="btn small" href={target.href}>Resume</Link>
      </aside>
    </>
  );
}
