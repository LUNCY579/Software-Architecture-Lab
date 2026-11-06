"use client";

// Thin scroll-progress bar for reading pages.
import { useEffect, useRef } from "react";

export default function ReadProgress() {
  const fill = useRef(null);
  useEffect(() => {
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      if (fill.current) fill.current.style.width = Math.min(100, Math.max(0, pct)) + "%";
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="readbar is-on" aria-hidden="true">
      <span ref={fill} />
    </div>
  );
}
