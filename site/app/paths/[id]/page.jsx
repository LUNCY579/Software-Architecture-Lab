import Link from "next/link";
import { notFound } from "next/navigation";
import PathSteps from "@/components/PathSteps";
import { paths, pathById, tutorialById, docById, moduleMeta } from "@/lib/data";

export function generateStaticParams() {
  return paths.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }) {
  const p = pathById[params.id];
  return { title: p ? p.name : "Learning path" };
}

export default function PathPage({ params }) {
  const p = pathById[params.id];
  if (!p) notFound();

  const steps = p.steps.map((s) => ({
    ...s,
    title: s.kind === "tutorial" ? (tutorialById[s.id] || {}).title || s.id : (docById[s.id] || {}).title || s.id,
    meta: s.kind === "tutorial"
      ? `${(tutorialById[s.id] || {}).level || ""} · ${tutorialById[s.id] ? tutorialById[s.id].minutes : ""} min`
      : moduleMeta(s.id),
  }));

  return (
    <>
      <Link className="crumb" href="/paths">← All paths</Link>
      <header className="module-head path-head">
        <p className="kicker">{p.level} · about {p.hours} hours · {p.steps.length} steps</p>
        <h1>{p.name}</h1>
        <p className="summary">{p.description}</p>
        <div className="outcomes">
          <h3>By the end you can</h3>
          <ul>
            {p.outcomes.map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        </div>
        <div className="hero-actions">
          <Link className="btn" href={steps[0].kind === "tutorial" ? `/tutorials/${steps[0].id}` : `/modules/${steps[0].id}`}>
            Start path
          </Link>
        </div>
      </header>
      <PathSteps steps={steps} />
    </>
  );
}
