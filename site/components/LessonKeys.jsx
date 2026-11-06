"use client";

// Arrow-key lesson navigation (← / →), matching the vanilla app.
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LessonKeys({ prev, next }) {
  const router = useRouter();
  useEffect(() => {
    function key(e) {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable) return;
      if (e.target.closest && e.target.closest("input, textarea, [contenteditable]")) return;
      if (e.key === "ArrowRight" && next != null) router.push(next);
      else if (e.key === "ArrowLeft" && prev != null) router.push(prev);
    }
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [prev, next, router]);
  return null;
}
