"use client";

// Tutorial completion toggle.
import { useEffect, useState } from "react";
import { loadProgress, saveProgress, tutorialDone } from "@/lib/progress";

export default function TutorialComplete({ id }) {
  const [done, setDone] = useState(false);
  useEffect(() => setDone(tutorialDone(loadProgress(), id)), [id]);

  function toggle() {
    const p = loadProgress();
    if (tutorialDone(p, id)) delete p.tutorials[id];
    else p.tutorials[id] = true;
    p.last = { kind: "tutorial", id, at: Date.now() };
    saveProgress(p);
    setDone(!done);
  }

  return (
    <button className={`btn${done ? " done" : ""}`} type="button" aria-pressed={done} onClick={toggle}>
      {done ? "✓ Tutorial complete" : "Mark tutorial complete"}
    </button>
  );
}
