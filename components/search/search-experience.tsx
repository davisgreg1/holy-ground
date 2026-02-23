"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics/track";
import { rankSearchResults } from "@/lib/search/ranking";
import type { SearchDocument, SearchDocumentType } from "@/lib/search/types";

const TYPE_FILTERS: Array<{ value: "all" | SearchDocumentType; label: string }> = [
  { value: "all", label: "All" },
  { value: "article", label: "Articles" },
  { value: "bible", label: "Bible" },
  { value: "resource", label: "Resources" },
];

type SearchIndexPayload = {
  generatedAt: string;
  totalDocuments: number;
  documents: SearchDocument[];
};

export function SearchExperience() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [typeFilter, setTypeFilter] = useState<"all" | SearchDocumentType>(
    (searchParams.get("type") as "all" | SearchDocumentType | null) ?? "all",
  );
  const [payload, setPayload] = useState<SearchIndexPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const nextQuery = searchParams.get("q") ?? "";
    const nextFilter =
      (searchParams.get("type") as "all" | SearchDocumentType | null) ?? "all";

    setQuery(nextQuery);
    setTypeFilter(nextFilter);
  }, [searchParams]);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);

      try {
        const response = await fetch("/search-index.json");
        const nextPayload = (await response.json()) as SearchIndexPayload;

        if (active) {
          setPayload(nextPayload);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  const rankedResults = useMemo(() => {
    if (!payload?.documents?.length) {
      return [];
    }

    return rankSearchResults(payload.documents, query, typeFilter).slice(0, 20);
  }, [payload?.documents, query, typeFilter]);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    const timeout = window.setTimeout(() => {
      trackEvent("search_performed", {
        query,
        typeFilter,
        resultCount: rankedResults.length,
      });
    }, 350);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [query, rankedResults.length, typeFilter]);

  function updateSearch(nextQuery: string, nextFilter: "all" | SearchDocumentType) {
    const params = new URLSearchParams();

    if (nextQuery) {
      params.set("q", nextQuery);
    }

    if (nextFilter !== "all") {
      params.set("type", nextFilter);
    }

    router.replace(`/search${params.toString() ? `?${params.toString()}` : ""}`, {
      scroll: false,
    });
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-12">
      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-lg sm:p-8">
        <h1 className="text-3xl font-semibold text-[var(--color-text)]">Search Theology Content</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Build-time indexed search for articles, Bible chapters, and resources.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-[2fr_1fr]">
          <input
            value={query}
            onChange={(event) => {
              const nextQuery = event.target.value;
              setQuery(nextQuery);
              updateSearch(nextQuery, typeFilter);
            }}
            placeholder="Search doctrine, sacraments, Scripture passages..."
            className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text)]"
            aria-label="Search query"
          />

          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide ${
                  typeFilter === filter.value
                    ? "bg-[var(--color-accent)] text-white"
                    : "border border-[var(--color-border)] bg-transparent text-[var(--color-muted)]"
                }`}
                onClick={() => {
                  setTypeFilter(filter.value);
                  updateSearch(query, filter.value);
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <p className="text-sm text-[var(--color-muted)]">Loading search index...</p>
          ) : null}

          {!loading && !query.trim() ? (
            <p className="text-sm text-[var(--color-muted)]">
              Type a query to search {payload?.totalDocuments ?? 0} indexed documents.
            </p>
          ) : null}

          {!loading && query.trim() && rankedResults.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)]">
              No matches. Try broader keywords like Eucharist, Tradition, grace, or John.
            </p>
          ) : null}

          <ul className="space-y-4">
            {rankedResults.map((result) => (
              <li key={result.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                  <span>{result.type}</span>
                  <span aria-hidden="true">/</span>
                  <span>Score {Math.round(result.score)}</span>
                </div>
                <Link
                  href={result.url}
                  className="mt-2 block text-lg font-semibold text-[var(--color-text)]"
                  onClick={() => {
                    trackEvent("search_result_click", {
                      query,
                      resultId: result.id,
                      type: result.type,
                    });
                  }}
                >
                  {result.title}
                </Link>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{result.excerpt}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
