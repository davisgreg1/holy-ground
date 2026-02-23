import { Suspense } from "react";
import { SearchExperience } from "@/components/search/search-experience";

export const metadata = {
  title: "Search | Holy Ground Theology",
  description: "Search Catholic theology articles, Bible chapters, and free resources.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-12">
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-sm text-[var(--color-muted)] sm:p-8">
            Loading search...
          </div>
        </section>
      }
    >
      <SearchExperience />
    </Suspense>
  );
}
