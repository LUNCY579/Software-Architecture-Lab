import TutorialCards from "@/components/TutorialCards";

export const metadata = { title: "Hands-on tutorials" };

export default function TutorialsPage() {
  return (
    <>
      <h1>Hands-on tutorials</h1>
      <p className="muted">
        Original tutorials written for this guide. Each one states its outcomes, works through real numbers, and ends
        with exercises and explained questions. The reference modules are listed so you can go deeper.
      </p>
      <TutorialCards />
    </>
  );
}
