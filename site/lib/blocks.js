// Rich-text helpers shared by the server-rendered block renderer.
const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
export function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ESC[c]);
}

function routeToHref(h) {
  const parts = h.split("/");
  const kind = parts[1];
  const id = parts[2];
  switch (kind) {
    case "module":
      return id ? `/modules/${id}` : "/modules";
    case "tutorial":
      return id ? `/tutorials/${id}` : "/tutorials";
    case "path":
      return id ? `/paths/${id}` : "/paths";
    case "paths":
      return "/paths";
    case "glossary":
      return "/glossary";
    case "cards":
      return "/flashcards";
    default:
      return null;
  }
}

// Minimal inline formatting: **bold**, `code`, [text](#/route) → internal <a>.
export function inlineHtml(s) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\((#\/[^)\s]+)\)/g, (m, text, href) => {
      const t = routeToHref(href);
      return t ? `<a href="${t}">${text}</a>` : text;
    });
}
