"use client";

// Explained quiz with persistence (same storage shape as the vanilla app).
import { useEffect, useState } from "react";
import { loadProgress, saveProgress } from "@/lib/progress";

export default function Quiz({ questions, store }) {
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    const p = loadProgress();
    const s =
      store.type === "module"
        ? (p.quiz[store.id] || {})[String(store.idx)] || {}
        : p.tquiz[store.id] || {};
    setSaved({ ...s });
  }, [store.id, store.idx, store.type]);

  if (!questions || !questions.length) return null;
  if (saved === null) return <section className="quiz" aria-busy="true" />;

  const answered = Object.keys(saved).length;
  const correct = Object.keys(saved).filter((k) => saved[k].ok).length;

  function persist(next) {
    setSaved(next);
    const p = loadProgress();
    if (store.type === "module") {
      p.quiz[store.id] = p.quiz[store.id] || {};
      p.quiz[store.id][String(store.idx)] = next;
    } else {
      p.tquiz[store.id] = next;
    }
    saveProgress(p);
  }

  function pick(qi, opt, answer) {
    if (saved[String(qi)]) return;
    persist({ ...saved, [String(qi)]: { pick: opt, ok: opt === answer } });
  }

  function retake() {
    persist({});
  }

  return (
    <section className="quiz">
      <h3>Check your understanding</h3>
      <p className="muted">
        {answered
          ? `Score: ${correct} of ${questions.length} correct`
          : "Pick the answer that fits. Every question explains the reasoning."}
      </p>
      {answered ? (
        <button className="btn ghost small quiz-retake" type="button" onClick={retake}>
          Retake quiz
        </button>
      ) : null}
      {questions.map((q, qi) => {
        const state = saved[String(qi)];
        return (
          <div className="qitem" key={qi}>
            <p className="qprompt">{q.q}</p>
            <div className="options">
              {q.o.map((opt, oi) => {
                const cls = ["option"];
                if (state) {
                  if (opt === q.a) cls.push("correct");
                  if (opt === state.pick && !state.ok) cls.push("chosen-wrong");
                }
                return (
                  <button
                    key={oi}
                    type="button"
                    className={cls.join(" ")}
                    disabled={!!state}
                    onClick={() => pick(qi, opt, q.a)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {state ? (
              <>
                <p className={state.ok ? "feedback good" : "feedback bad"}>
                  {state.ok ? "Correct." : `Not quite. The answer is “${q.a}”.`}
                </p>
                {q.why ? <p className="feedback-why">{q.why}</p> : null}
              </>
            ) : null}
          </div>
        );
      })}
    </section>
  );
}
