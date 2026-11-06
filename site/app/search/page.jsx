import { Suspense } from "react";
import SearchClient from "@/components/SearchClient";

export const metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <>
      <h1>Search</h1>
      <Suspense fallback={<p className="muted">Loading…</p>}>
        <SearchClient />
      </Suspense>
    </>
  );
}
