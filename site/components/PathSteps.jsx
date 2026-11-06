"use client";

// Path step list with live completion ticks.
import { useEffect, useState } from "react";
import Link from "next/link";
import catalogList from "@/data/catalog.json";
import { loadProgress, moduleDone, tutorialDone } from "@/lib/progress";

const catalog = Object.fromEntries(catalogList.map((c) => [c.id, c]));

export default function PathSteps({ steps }) {
  const [p, setP] = useState(null);
  useEffect(() => setP(loadProgress()), []);

  function stepDone(step) {
    if (!p) return false;
    return step.kind === "tutorial"
      ? tutorialDone(p, step.id)
      : moduleDone(p, step.id, catalog[step.id] ? catalog[step.id].lessons : 0);
  }

  return (
    <ol className="step-list">
      {steps.map((step, i) => {
        const done = stepDone(step);
        return (
          <li key={i} className={`step${done ? " is-done" : ""}`}>
            <span className="step-num">{done ? "✓" : i + 1}</span>
            <div className="step-body">
              <div className="step-title">
                <Link href={step.kind === "tutorial" ? `/tutorials/${step.id}` : `/modules/${step.id}`}>
                  {step.title}
                </Link>
                <span className="tag">{step.kind === "tutorial" ? "Tutorial" : "Reference"}</span>
              </div>
              <p className="step-why">{step.why}</p>
              <p className="muted small">{step.meta}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
