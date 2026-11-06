import GlossaryBrowser from "@/components/GlossaryBrowser";

export const metadata = { title: "Glossary" };

export default function GlossaryPage() {
  return (
    <>
      <h1>Glossary</h1>
      <p className="muted">
        Every term the library relies on, defined in a sentence or two, with links to where it is taught.
      </p>
      <GlossaryBrowser />
    </>
  );
}
