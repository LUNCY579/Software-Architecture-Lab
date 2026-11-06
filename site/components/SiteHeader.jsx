"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import docsFile from "@/data/docs.json";
import tutorials from "@/data/tutorials.json";
import glossary from "@/data/glossary.json";

const NAV = [
  ["/modules", "Library", "library"],
  ["/paths", "Paths", "paths"],
  ["/tutorials", "Tutorials", "tutorials"],
  ["/glossary", "Glossary", "glossary"],
  ["/flashcards", "Cards", "cards"],
];

function score(text, n) {
  const i = text.indexOf(n);
  if (i === 0) return 3;
  if (i > 0) return 2;
  return 0;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const boxRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  // Close the menu on navigation.
  useEffect(() => {
    setOpen(false);
    setActive(-1);
  }, [pathname]);

  function search(text) {
    setQ(text);
    const n = text.trim().toLowerCase();
    if (n.length < 2) {
      setItems([]);
      return;
    }
    const found = [];
    docsFile.docs.forEach((d) => {
      let s = score(d.title.toLowerCase(), n);
      if (!s) s = score(d.summary.toLowerCase(), n) || (d.tags.join(" ").toLowerCase().includes(n) ? 1 : 0);
      if (s) found.push({ kind: "Module", title: d.title, sub: d.summary, href: `/modules/${d.id}`, s });
    });
    tutorials.forEach((t) => {
      let s = score(t.title.toLowerCase(), n);
      if (!s) s = score(t.subtitle.toLowerCase(), n) ? 1 : 0;
      if (s) found.push({ kind: "Tutorial", title: t.title, sub: t.subtitle, href: `/tutorials/${t.id}`, s });
    });
    glossary.forEach((g) => {
      let s = score(g.term.toLowerCase(), n);
      if (!s && g.def.toLowerCase().includes(n)) s = 1;
      if (s) found.push({ kind: "Glossary", title: g.term, sub: g.def, href: `/glossary`, s });
    });
    found.sort((a, b) => b.s - a.s);
    setItems(found.slice(0, 8));
    setActive(-1);
    setOpen(true);
  }

  function go(item) {
    setOpen(false);
    setQ("");
    router.push(item.href);
  }

  function onKey(e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!items.length) return;
      e.preventDefault();
      setActive((a) => (a + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active > -1 && items[active]) go(items[active]);
      else if (q.trim()) {
        setOpen(false);
        router.push(`/search?q=${encodeURIComponent(q.trim())}`);
        setQ("");
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  function toggleTheme() {
    const next = dark ? "light" : "dark";
    setDark(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("fieldguide-theme", next);
    } catch (e) {
      /* storage unavailable */
    }
  }

  const section =
    pathname === "/" ? "library" : pathname.split("/")[1] === "flashcards" ? "cards" : pathname.split("/")[1];

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">A</span>
          <span className="brand-text">
            <span className="brand-name">Architecture Field Guide</span>
            <span className="brand-sub">System design in practice</span>
          </span>
        </Link>
        <nav className="site-nav" aria-label="Sections">
          {NAV.map(([href, label, key]) => (
            <Link key={key} href={href} className={section === key ? "is-active" : ""}>
              {label}
            </Link>
          ))}
        </nav>
        <form
          className="quickfind"
          ref={boxRef}
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            ref={inputRef}
            type="search"
            placeholder="Search everything… ( / )"
            aria-label="Search everything"
            autoComplete="off"
            value={q}
            onChange={(e) => search(e.target.value)}
            onKeyDown={onKey}
            onFocus={() => q.trim() && setOpen(true)}
          />
          {open ? (
            <div className="qf-menu">
              {!items.length ? (
                <p className="qf-empty">
                  {q.trim().length >= 2
                    ? "No matches — press Enter for a full search."
                    : "Type to search modules, tutorials and the glossary."}
                </p>
              ) : null}
              {items.map((item, i) => (
                <button
                  key={item.href + item.title}
                  type="button"
                  className={`qf-item${i === active ? " is-active" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(item)}
                >
                  <span className="qf-kind">{item.kind}</span>
                  <span className="qf-text">
                    <strong>{item.title}</strong>
                    <span className="qf-sub">{item.sub}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </form>
        <button
          className="theme-toggle"
          type="button"
          aria-label="Switch theme"
          aria-pressed={dark}
          onClick={toggleTheme}
        >
          {dark ? "☀" : "☾"}
        </button>
      </div>
    </header>
  );
}
