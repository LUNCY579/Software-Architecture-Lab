import LibraryBrowser from "@/components/LibraryBrowser";

export const metadata = { title: "Reference library" };

export default function ModulesPage() {
  return (
    <>
      <h1>Reference library</h1>
      <p className="muted">
        Extracted text from the source PDFs, one module per document. Every module carries its figures, quizzes with
        answers, teaching objectives and completion tracking.
      </p>
      <LibraryBrowser />
    </>
  );
}
