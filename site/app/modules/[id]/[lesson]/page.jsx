import Link from "next/link";
import { notFound } from "next/navigation";
import Blocks from "@/components/Blocks";
import Quiz from "@/components/Quiz";
import TermEnhancer from "@/components/TermEnhancer";
import LessonFinder from "@/components/LessonFinder";
import LessonFooter from "@/components/LessonFooter";
import ReadProgress from "@/components/ReadProgress";
import { docs, docById, getModule, figures } from "@/lib/data";

export function generateStaticParams() {
  const out = [];
  docs.forEach((d) => {
    const mod = getModule(d.id);
    if (mod) mod.lessons.forEach((_, i) => out.push({ id: d.id, lesson: String(i) }));
  });
  return out;
}

export function generateMetadata({ params }) {
  const d = docById[params.id];
  const mod = d ? getModule(d.id) : null;
  const lesson = mod && mod.lessons[Number(params.lesson)];
  return { title: lesson ? `${lesson.title} — ${d.title}` : "Lesson" };
}

export default function LessonPage({ params }) {
  const d = docById[params.id];
  const mod = d ? getModule(d.id) : null;
  const idx = Number(params.lesson);
  if (!d || !mod || !mod.lessons[idx]) notFound();

  const lesson = mod.lessons[idx];
  const total = mod.lessons.length;
  const lessonWords = lesson.blocks.reduce((n, b) => n + String(b.t || "").split(/\s+/).filter(Boolean).length, 0);
  const readMins = Math.max(1, Math.round(lessonWords / 200));
  const figs = figures[d.id] || [];
  const pos = docs.findIndex((x) => x.id === d.id);
  const prevMod = pos > 0 ? docs[pos - 1] : null;
  const nextMod = pos > -1 && pos < docs.length - 1 ? docs[pos + 1] : null;

  return (
    <>
      <ReadProgress />
      <div className="module-layout">
        <LessonFinder id={d.id} lessons={mod.lessons} current={idx} />
        <article className="lesson">
          <p className="muted lesson-kicker">
            <Link href={`/modules/${d.id}`}>{d.title}</Link> · Lesson {idx + 1} of {total} · ~{readMins} min read
          </p>
          <h2>{lesson.title}</h2>
          <TermEnhancer>
            <Blocks blocks={lesson.blocks} />
          </TermEnhancer>
          <Quiz questions={lesson.quiz} store={{ type: "module", id: d.id, idx }} />
          <LessonFooter id={d.id} idx={idx} prev={idx > 0 ? idx - 1 : null} next={idx < total - 1 ? idx + 1 : null} />
          <nav className="module-nav">
            {prevMod ? <Link className="module-nav-link prev" href={`/modules/${prevMod.id}`}>← {prevMod.title}</Link> : <span />}
            {nextMod ? <Link className="module-nav-link next" href={`/modules/${nextMod.id}`}>{nextMod.title} →</Link> : <span />}
          </nav>
          {figs.length ? (
            <p className="muted small" style={{ marginTop: 18 }}>
              This module also includes {figs.length} extracted figures on its{" "}
              <Link href={`/modules/${d.id}`}>overview page</Link>.
            </p>
          ) : null}
        </article>
      </div>
    </>
  );
}
