"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics/track";

type ChapterLink = {
  book: string;
  chapter: number;
};

export function ChapterNavigation({
  previous,
  next,
}: {
  previous: ChapterLink | null;
  next: ChapterLink | null;
}) {
  return (
    <nav className="mt-10 grid gap-3 border-t border-[var(--color-border)] pt-6 sm:grid-cols-2" aria-label="Chapter navigation">
      {previous ? (
        <Link
          href={`/bible/${previous.book}/${previous.chapter}`}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm font-medium text-[var(--color-text)]"
          onClick={() => {
            trackEvent("bible_navigation", {
              direction: "previous",
              chapter: `${previous.book}-${previous.chapter}`,
            });
          }}
        >
          Previous: {previous.book} {previous.chapter}
        </Link>
      ) : (
        <span className="rounded-xl border border-dashed border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-muted)]">
          Start of available reader content
        </span>
      )}

      {next ? (
        <Link
          href={`/bible/${next.book}/${next.chapter}`}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm font-medium text-[var(--color-text)] sm:text-right"
          onClick={() => {
            trackEvent("bible_navigation", {
              direction: "next",
              chapter: `${next.book}-${next.chapter}`,
            });
          }}
        >
          Next: {next.book} {next.chapter}
        </Link>
      ) : (
        <span className="rounded-xl border border-dashed border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-muted)] sm:text-right">
          End of available reader content
        </span>
      )}
    </nav>
  );
}
