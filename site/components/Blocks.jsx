// Server-rendered rich content blocks (same model as the vanilla app).
import { esc, inlineHtml } from "@/lib/blocks";

function P({ t, className, as = "p" }) {
  const Tag = as;
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: inlineHtml(t) }} />;
}

export default function Blocks({ blocks }) {
  const out = [];
  (blocks || []).forEach((b, i) => {
    if (b.type === "table") {
      out.push(
        <div key={i}>
          {b.caption ? <p className="table-caption">{b.caption}</p> : null}
          <div className="table-wrap">
            <table className="content-table">
              <thead>
                <tr>
                  {(b.head || []).map((h, hi) => (
                    <th key={hi} dangerouslySetInnerHTML={{ __html: inlineHtml(h) }} />
                  ))}
                </tr>
              </thead>
              <tbody>
                {(b.rows || []).map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} dangerouslySetInnerHTML={{ __html: inlineHtml(cell) }} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else if (b.type === "callout") {
      out.push(
        <aside key={i} className={`callout ${b.tone || "note"}`}>
          {b.title ? <p className="callout-title">{b.title}</p> : null}
          <P t={b.t} />
        </aside>
      );
    } else if (b.type === "steps") {
      out.push(
        <ol key={i} className="steps">
          {(b.items || []).map((item, ii) => (
            <li key={ii} dangerouslySetInnerHTML={{ __html: inlineHtml(item) }} />
          ))}
        </ol>
      );
    } else if (b.type === "compare") {
      out.push(
        <div key={i} className="compare">
          {[b.left, b.right].map((side, si) => (
            <div key={si} className={`compare-col ${si === 0 ? "do" : "avoid"}`}>
              <h4>{side.title}</h4>
              <ul>
                {(side.items || []).map((it, ii) => (
                  <li key={ii} dangerouslySetInnerHTML={{ __html: inlineHtml(it) }} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    } else if (b.type === "flow") {
      out.push(
        <div key={i}>
          {b.caption ? <p className="table-caption">{b.caption}</p> : null}
          <div className="flow">
            {(b.nodes || []).map((n, ni) => (
              <div key={ni} className="flow-node">
                <span className="flow-label">{n.label}</span>
                {n.sub ? <span className="flow-sub">{n.sub}</span> : null}
                {ni < b.nodes.length - 1 ? <span className="flow-arrow">→</span> : null}
              </div>
            ))}
          </div>
        </div>
      );
    } else if (b.type === "exercise") {
      const title = String(b.title).replace(/^Exercise[:\s—-]+/i, "");
      out.push(
        <details key={i} className="exercise">
          <summary>Exercise: {esc(title)}</summary>
          <P t={b.prompt} />
          {b.hint ? (
            <details className="hint">
              <summary>Hint</summary>
              <P t={b.hint} />
            </details>
          ) : null}
          {b.solution ? (
            <details className="solution">
              <summary>Worked answer</summary>
              <P t={b.solution} />
            </details>
          ) : null}
        </details>
      );
    } else if (b.type === "checklist") {
      out.push(
        <ul key={i} className="checklist">
          {(b.items || []).map((it, ii) => (
            <li key={ii} dangerouslySetInnerHTML={{ __html: inlineHtml(it) }} />
          ))}
        </ul>
      );
    } else if (b.h) {
      out.push(<h3 key={i}>{b.t}</h3>);
    } else if (b.c) {
      out.push(
        <pre key={i} className="code">
          <code>{b.t}</code>
        </pre>
      );
    } else {
      out.push(<P key={i} t={b.t} />);
    }
  });
  return <>{out}</>;
}
