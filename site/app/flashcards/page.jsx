import Flashcards from "@/components/Flashcards";

export const metadata = { title: "Flashcards" };

export default function FlashcardsPage() {
  return (
    <>
      <h1>Flashcards</h1>
      <p className="muted">
        Spaced repetition over the glossary. Rate how well you recalled each term — “Again” brings it back in ten
        minutes, “Good” and “Easy” push it days away.
      </p>
      <Flashcards />
    </>
  );
}
