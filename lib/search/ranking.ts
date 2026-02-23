import type { RankedSearchResult, SearchDocument } from "./types";

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "that",
  "with",
  "from",
  "this",
  "into",
  "unto",
  "are",
  "you",
  "your",
  "was",
  "have",
]);

const normalizedDocumentCache = new WeakMap<
  SearchDocument,
  {
    title: string;
    content: string;
    keywords: string;
  }
>();

export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenizeQuery(value: string): string[] {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function getNormalizedDocument(document: SearchDocument) {
  const cached = normalizedDocumentCache.get(document);

  if (cached) {
    return cached;
  }

  const normalized = {
    title: normalizeText(document.title),
    content: normalizeText(document.content),
    keywords: normalizeText(document.keywords.join(" ")),
  };

  normalizedDocumentCache.set(document, normalized);
  return normalized;
}

function scoreDocument(document: SearchDocument, query: string, queryTokens: string[]): number {
  if (queryTokens.length === 0) {
    return 0;
  }

  const normalized = getNormalizedDocument(document);

  let score = 0;

  if (normalized.title === query) {
    score += 120;
  }

  if (normalized.title.includes(query)) {
    score += 40;
  }

  if (normalized.content.includes(query)) {
    score += 20;
  }

  queryTokens.forEach((token) => {
    if (normalized.title.startsWith(token)) {
      score += 22;
    }

    if (normalized.title.includes(token)) {
      score += 14;
    }

    if (normalized.keywords.includes(token)) {
      score += 12;
    }

    if (normalized.content.includes(token)) {
      score += 5;
    }
  });

  if (document.type === "article") {
    score += 3;
  }

  return score;
}

export function rankSearchResults(
  documents: SearchDocument[],
  rawQuery: string,
  typeFilter: "all" | SearchDocument["type"] = "all",
): RankedSearchResult[] {
  const query = normalizeText(rawQuery);
  const tokens = tokenizeQuery(rawQuery);

  if (!query) {
    return [];
  }

  return documents
    .filter((document) => (typeFilter === "all" ? true : document.type === typeFilter))
    .map((document) => ({
      ...document,
      score: scoreDocument(document, query, tokens),
    }))
    .filter((document) => document.score > 0)
    .toSorted((a, b) => {
      if (a.score === b.score) {
        return a.title.localeCompare(b.title);
      }

      return b.score - a.score;
    });
}
