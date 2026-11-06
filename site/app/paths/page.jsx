import PathCards from "@/components/PathCards";

export const metadata = { title: "Learning paths" };

export default function PathsPage() {
  return (
    <>
      <h1>Learning paths</h1>
      <p className="muted">
        Each path orders modules and tutorials so that every idea is introduced before it is used. You can start
        anywhere, but the order is deliberate.
      </p>
      <PathCards />
    </>
  );
}
