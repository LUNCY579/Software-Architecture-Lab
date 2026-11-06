import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h1>Not found</h1>
      <p className="muted">That page doesn’t exist in this guide.</p>
      <p><Link className="btn" href="/">Back to the home page</Link></p>
    </>
  );
}
