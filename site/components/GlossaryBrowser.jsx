"use client";

// Glossary browser: search, category chips, letter groups.
import { useMemo, useState } from "react";
import Link from "next/link";
import glossary from "@/data/glossary.json";
import docsFile from "@/data/docs.json";
import tutorials from "@/data/tutorials.json";

const docById = Object.fromEntries(docsFile.docs.map((d) => [d.id, d]));
const tutById = Object.fromEntries(tutorials.map((t) => [t.id, t]));

export default function GlossaryBrowser() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");

  const cats = useMemo(() => {
    const set = [...new Set(glossary.map((g) => g.cat))].sort((a, b) => a.localeCompare(b));
    return ["all", ...set];
  }, []);

  const list = useMemo(() => {
    const n = query.trim().toLowerCase();
    return glossary
      .filter((g) => {
        if (cat !== "all" && g.cat !== cat) return false;
        if (!n) return true;
        const hay = [g.term, g.def, (g.see || []).map((id) => (docById[id] || {}).title || "").join(" ")].join(" ").toLowerCase();
        return n.split(/\s+/).every((w) => hay.includes(w));
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [query, cat]);

  return (
    <>
      <section className="toolbar">
        <input
          type="search"
          placeholder="Search terms and definitions…"
          aria-label="Search glossary"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="chips">
          {cats.map((c) => (
            <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </section>

      <p className="result-count">{list.length}{list.length === 1 ? " term" : " terms"}</p>
      <div className="glossary">
        {(() => {
          const rows = [];
          let letter = "";
          list.forEach((g) => {
            const l = g.term[0].toUpperCase();
            if (l !== letter) {
              letter = l;
              rows.push(<p key={`L${l}`} className="glossary-letter">{l}</p>);
            }
            rows.push(
              <div key={g.term} className="gloss-row">
                <div className="gloss-head">
                  <h3>{g.term}</h3>
                  <span className="tag">{g.cat}</span>
                </div>
                <p className="gloss-def">{g.def}</p>
                {(g.see || []).length || (g.tut || []).length ? (
                  <p className="gloss-see">
                    {(g.see || []).map((id, i) => (
                      <span key={`m${id}`}>
                        {i ? " · " : ""}
                        {docById[id] ? <Link href={`/modules/${id}`}>{docById[id].title}</Link> : id}
                      </span>
                    ))}
                    {(g.tut || []).length ? "  ·  Tutorial: " : ""}
                    {(g.tut || []).map((id, i) => (
                      <span key={`t${id}`}>
                        {i ? ", " : ""}
                        {tutById[id] ? <Link href={`/tutorials/${id}`}>{tutById[id].title}</Link> : id}
                      </span>
                    ))}
                  </p>
                ) : null}
              </div>
            );
          });
          return rows;
        })()}
      </div>
      {!list.length ? <p className="empty">No terms match.</p> : null}
    </>
  );
}
