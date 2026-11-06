"use client";

// Spaced-repetition flashcards over the glossary.
import { useEffect, useState } from "react";
import Link from "next/link";
import glossary from "@/data/glossary.json";
import docsFile from "@/data/docs.json";

const CARDS_KEY = "fieldguide-cards-v1";
const INTERVALS = [10 * 60000, 86400000, 3 * 86400000, 7 * 86400000, 16 * 86400000, 35 * 86400000];
const docById = Object.fromEntries(docsFile.docs.map((d) => [d.id, d]));

function loadCards() {
  try {
    const c = JSON.parse(localStorage.getItem(CARDS_KEY));
    if (c && typeof c === "object") return c;
  } catch (e) {
    /* ignore */
  }
  return {};
}

const catOf = (g) => g.cat || "General";

export default function Flashcards() {
  const [state, setState] = useState(null); // {cards, cat, practiceAll, queue, current, revealed}
  const [cats, setCats] = useState([]);

  useEffect(() => {
    setCats(["all", ...[...new Set(glossary.map(catOf))].sort((a, b) => a.localeCompare(b))]);
    const cards = loadCards();
    setState({ cards, cat: "all", practiceAll: false, queue: [], current: null, revealed: false, session: { answered: 0, again: 0, good: 0, easy: 0 } });
  }, []);

  useEffect(() => {
    if (!state) return;
    buildQueue(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.cat]);

  function buildQueue(s) {
    const now = Date.now();
    const queue = glossary
      .filter((g) => (s.cat === "all" || catOf(g) === s.cat) && (s.practiceAll || recFor(s.cards, g.term).due <= now))
      .sort((a, b) => recFor(s.cards, a.term).due - recFor(s.cards, b.term).due || a.term.localeCompare(b.term));
    setState({ ...s, queue, current: queue[0] || null, revealed: false });
  }

  function recFor(cards, term) {
    if (!cards[term]) cards[term] = { box: 0, due: 0 };
    return cards[term];
  }

  function persist(cards) {
    try {
      localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
    } catch (e) {
      /* ignore */
    }
  }

  function flip() {
    setState((s) => (s ? { ...s, revealed: !s.revealed } : s));
  }

  function answer(kind) {
    setState((s) => {
      if (!s || !s.current || !s.revealed) return s;
      const cards = { ...s.cards };
      const rec = { ...(cards[s.current.term] || { box: 0, due: 0 }) };
      if (kind === 0) rec.box = 0;
      else rec.box = Math.min(rec.box + kind, INTERVALS.length - 1);
      rec.due = Date.now() + INTERVALS[rec.box];
      cards[s.current.term] = rec;
      persist(cards);
      const key = ["again", "good", "easy"][kind];
      const session = { ...s.session, answered: s.session.answered + 1, [key]: s.session[key] + 1 };
      const queue = s.queue.slice(1);
      return { ...s, cards, queue, current: queue[0] || null, revealed: false, session };
    });
  }

  useEffect(() => {
    function key(e) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        flip();
      } else if (state && state.revealed && ["1", "2", "3"].includes(e.key)) {
        answer(Number(e.key) - 1);
      }
    }
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.current, state?.revealed]);

  if (!state) return <div className="card-stage"><p className="muted">Loading cards…</p></div>;

  const inDeck = glossary.filter((g) => state.cat === "all" || catOf(g) === state.cat);
  const now = Date.now();
  const due = inDeck.filter((g) => recFor(state.cards, g.term).due <= now).length;
  const mastered = inDeck.filter((g) => recFor(state.cards, g.term).box >= 4).length;
  const g = state.current;

  return (
    <>
      <section className="toolbar">
        <div className="chips">
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              className="chip"
              aria-pressed={state.cat === c}
              onClick={() => setState({ ...state, cat: c, practiceAll: false })}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </section>
      <p className="result-count cards-status">
        {inDeck.length} cards in this deck · {due} due · {mastered} well known
        {state.session.answered ? ` · this session: ${state.session.answered} reviewed (${state.session.again} again / ${state.session.good} good / ${state.session.easy} easy)` : ""}
      </p>
      <div className="card-stage">
        {!g ? (
          <div className="card-done">
            <p className="card-done-title">All caught up.</p>
            <p className="muted">No cards are due in this deck right now. Come back later, or practise everything anyway.</p>
            <button
              className="btn ghost"
              type="button"
              onClick={() => setState({ ...state, practiceAll: true })}
            >
              Practice all {inDeck.length} cards
            </button>
          </div>
        ) : (
          <article
            className={`fcard${state.revealed ? " is-open" : ""}`}
            tabIndex={0}
            onClick={(e) => {
              if (e.target.closest("a, button")) return;
              flip();
            }}
          >
            <p className="fcard-hint">{state.revealed ? "Rate your recall" : "Tap the card or press Space to reveal"}</p>
            <h2>{g.term}</h2>
            <p className="tag">{catOf(g)}</p>
            {state.revealed ? (
              <>
                <p className="fcard-def">{g.def}</p>
                {(g.see || []).length ? (
                  <p className="fcard-see">
                    {(g.see || []).map((id, i) => (
                      <span key={id}>
                        {i ? " · " : ""}
                        {docById[id] ? <Link href={`/modules/${id}`}>{docById[id].title}</Link> : id}
                      </span>
                    ))}
                  </p>
                ) : null}
                <div className="fcard-actions">
                  <button className="btn small fc-again" type="button" onClick={() => answer(0)}>Again</button>
                  <button className="btn small fc-good" type="button" onClick={() => answer(1)}>Good</button>
                  <button className="btn small fc-easy" type="button" onClick={() => answer(2)}>Easy</button>
                </div>
              </>
            ) : null}
          </article>
        )}
      </div>
    </>
  );
}
