"use client";

// Enriches rendered prose with inline glossary term tooltips (hover/tap).
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import glossary from "@/data/glossary.json";

function reEscape(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const termByLower = {};
glossary.forEach((g) => (termByLower[g.term.toLowerCase()] = g));
const termPattern = glossary.length
  ? new RegExp(
      "\\b(" +
        glossary
          .slice()
          .sort((a, b) => b.term.length - a.term.length)
          .map((g) => reEscape(g.term))
          .join("|") +
        ")\\b",
      "gi"
    )
  : null;

export default function TermEnhancer({ children }) {
  const hostRef = useRef(null);
  const [pop, setPop] = useState(null); // {term, def, cat, x, y}

  useEffect(() => {
    const root = hostRef.current;
    if (!root || !termPattern) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentNode;
        if (!p || /^(CODE|PRE|BUTTON|A|H1|H2|H3|SUMMARY)$/.test(p.tagName)) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue || node.nodeValue.length < 4) return NodeFilter.FILTER_REJECT;
        termPattern.lastIndex = 0;
        return termPattern.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    const texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach((node) => {
      const text = node.nodeValue;
      termPattern.lastIndex = 0;
      const frag = document.createDocumentFragment();
      let last = 0;
      let m;
      let linked = 0;
      while ((m = termPattern.exec(text)) !== null && linked < 4) {
        const term = termByLower[m[1].toLowerCase()];
        if (!term) continue;
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "gterm";
        btn.textContent = m[1];
        btn.setAttribute("data-term", term.term);
        frag.appendChild(btn);
        last = m.index + m[0].length;
        linked++;
      }
      if (!linked) return;
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  }, [children]);

  function showAt(btn) {
    const g = termByLower[(btn.getAttribute("data-term") || "").toLowerCase()];
    if (!g) return;
    const r = btn.getBoundingClientRect();
    const w = 340;
    const left = Math.min(Math.max(10, r.left + r.width / 2 - w / 2), window.innerWidth - w - 10);
    const y = r.bottom + 8;
    setPop({ term: g.term, def: g.def, cat: g.cat, left, top: y, above: false });
    // Flip above the term if it would overflow the viewport.
    requestAnimationFrame(() => {
      setPop((p) => {
        if (!p) return p;
        const h = 180; // approx; CSS clamps
        if (p.top + h > window.innerHeight - 10) return { ...p, top: Math.max(10, r.top - h - 8), above: true };
        return p;
      });
    });
  }

  useEffect(() => {
    function over(e) {
      const btn = e.target.closest && e.target.closest(".gterm");
      if (btn) showAt(btn);
      else if (e.target.closest && !e.target.closest(".term-pop")) setPop(null);
    }
    function out(e) {
      if (e.target.closest && e.target.closest(".gterm")) {
        // let pointer move to the popover
      }
    }
    function click(e) {
      const btn = e.target.closest && e.target.closest(".gterm");
      if (btn) showAt(btn);
      else if (!e.target.closest || !e.target.closest(".term-pop")) setPop(null);
    }
    function scroll() {
      setPop(null);
    }
    function key(e) {
      if (e.key === "Escape") setPop(null);
    }
    document.addEventListener("mouseover", over);
    document.addEventListener("click", click);
    document.addEventListener("mouseout", out);
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mouseover", over);
      document.removeEventListener("click", click);
      document.removeEventListener("mouseout", out);
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("keydown", key);
    };
  }, []);

  return (
    <>
      <div ref={hostRef}>{children}</div>
      {pop ? (
        <div
          className="term-pop"
          role="tooltip"
          style={{ left: pop.left, top: pop.top, width: "min(340px, calc(100vw - 20px))" }}
        >
          <p className="term-pop-term">{pop.term}</p>
          <p className="term-pop-def">{pop.def}</p>
          <p className="term-pop-foot">
            <span className="tag">{pop.cat}</span>
            <Link className="term-pop-link" href="/glossary">
              Glossary →
            </Link>
          </p>
        </div>
      ) : null}
    </>
  );
}
