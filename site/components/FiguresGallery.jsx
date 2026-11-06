"use client";

// Figures extracted from the source PDF, with a lightbox viewer.
import { useEffect, useState } from "react";
import { figLabel } from "@/lib/data";

export default function FiguresGallery({ moduleId, figures, title }) {
  const [open, setOpen] = useState(-1);

  useEffect(() => {
    if (open === -1) return;
    function key(e) {
      if (e.key === "Escape") setOpen(-1);
      else if (e.key === "ArrowLeft") setOpen((i) => (i - 1 + figures.length) % figures.length);
      else if (e.key === "ArrowRight") setOpen((i) => (i + 1) % figures.length);
    }
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open, figures.length]);

  if (!figures || !figures.length) return null;
  const src = (f) => `/modules/media/${moduleId}/${encodeURIComponent(f)}`;

  return (
    <>
      <details className="figures">
        <summary>Figures from the source document ({figures.length})</summary>
        <div className="fig-grid">
          {figures.map((f, i) => (
            <button
              key={f}
              type="button"
              className="fig-thumb"
              aria-label={`Enlarge figure ${figLabel(f)}`}
              onClick={() => setOpen(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src(f)} alt={figLabel(f)} loading="lazy" />
              <span className="fig-cap">{figLabel(f)}</span>
            </button>
          ))}
        </div>
      </details>
      {open !== -1 ? (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && setOpen(-1)}>
          <button className="lb-btn lb-prev" type="button" onClick={() => setOpen((i) => (i - 1 + figures.length) % figures.length)}>
            ‹
          </button>
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src(figures[open])} alt={figLabel(figures[open])} />
            <p className="lb-cap">
              {(title ? `${title} — ` : "") + figLabel(figures[open])} ({open + 1} of {figures.length})
            </p>
          </figure>
          <button className="lb-btn lb-next" type="button" onClick={() => setOpen((i) => (i + 1) % figures.length)}>
            ›
          </button>
          <button className="lb-btn lb-close" type="button" onClick={() => setOpen(-1)}>
            ×
          </button>
        </div>
      ) : null}
    </>
  );
}
