import kjvStrongsData from "@/kjv_strongs.json";
import type { BibleBook, BibleBookSummary, BibleChapter, BibleManifest } from "./types";

type KJVMeta = {
  module?: string;
  name?: string;
  shortname?: string;
  copyright_statement?: string;
};

type KJVVerse = {
  book_name: string;
  book: number;
  chapter: number;
  verse: number;
  text: string;
};

type KJVStrongsPayload = {
  metadata: KJVMeta;
  verses: KJVVerse[];
};

type InternalBook = {
  bookNumber: number;
  slug: string;
  name: string;
  abbreviation: string;
  testament: "old" | "new";
  chaptersMap: Map<number, BibleChapter>;
};

const kjvPayload = kjvStrongsData as KJVStrongsPayload;

function stripStrongsMarkup(text: string): string {
  return text
    .replace(/\{[^}]+\}/g, "")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/['.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toAbbreviation(bookName: string): string {
  const special: Record<string, string> = {
    "Song of Solomon": "Song",
    "1 Samuel": "1Sam",
    "2 Samuel": "2Sam",
    "1 Kings": "1Kgs",
    "2 Kings": "2Kgs",
    "1 Chronicles": "1Chr",
    "2 Chronicles": "2Chr",
    "1 Corinthians": "1Cor",
    "2 Corinthians": "2Cor",
    "1 Thessalonians": "1Ths",
    "2 Thessalonians": "2Ths",
    "1 Timothy": "1Tim",
    "2 Timothy": "2Tim",
    "1 Peter": "1Pet",
    "2 Peter": "2Pet",
    "1 John": "1Jn",
    "2 John": "2Jn",
    "3 John": "3Jn",
  };

  if (special[bookName]) {
    return special[bookName];
  }

  const words = bookName.split(" ").filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 3);
  }

  return words.map((word) => word.slice(0, 1)).join("");
}

function buildBookSummary(book: InternalBook): BibleBookSummary {
  return {
    slug: book.slug,
    name: book.name,
    abbreviation: book.abbreviation,
    testament: book.testament,
    chapters: [...book.chaptersMap.keys()].toSorted((a, b) => a - b),
    summary:
      book.testament === "old"
        ? `Old Testament reading from ${book.name}.`
        : `New Testament reading from ${book.name}.`,
  };
}

function buildBookData(book: InternalBook): BibleBook {
  return {
    slug: book.slug,
    name: book.name,
    chapters: [...book.chaptersMap.values()]
      .toSorted((a, b) => a.number - b.number)
      .map((chapter) => ({
        number: chapter.number,
        verses: chapter.verses.toSorted((a, b) => a.number - b.number),
      })),
  };
}

const internalBooks = new Map<number, InternalBook>();

for (const verse of kjvPayload.verses) {
  const currentBook = internalBooks.get(verse.book);

  const book =
    currentBook ??
    {
      bookNumber: verse.book,
      slug: toSlug(verse.book_name),
      name: verse.book_name,
      abbreviation: toAbbreviation(verse.book_name),
      testament: verse.book <= 39 ? "old" : "new",
      chaptersMap: new Map<number, BibleChapter>(),
    };

  if (!currentBook) {
    internalBooks.set(verse.book, book);
  }

  const currentChapter = book.chaptersMap.get(verse.chapter);

  const chapter =
    currentChapter ??
    {
      number: verse.chapter,
      verses: [],
    };

  if (!currentChapter) {
    book.chaptersMap.set(verse.chapter, chapter);
  }

  chapter.verses.push({
    number: verse.verse,
    text: stripStrongsMarkup(verse.text),
  });
}

const sortedBooks = [...internalBooks.values()].toSorted(
  (a, b) => a.bookNumber - b.bookNumber,
);

const manifest: BibleManifest = {
  translation: {
    id: kjvPayload.metadata.module ?? "kjv_strongs",
    name: kjvPayload.metadata.name ?? "King James Version with Strong's",
    shortName: kjvPayload.metadata.shortname ?? "KJV Strongs",
    license: kjvPayload.metadata.copyright_statement ?? "Public domain or module-defined licensing",
  },
  books: sortedBooks.map((book) => buildBookSummary(book)),
};

const bookDataBySlug = new Map<string, BibleBook>(
  sortedBooks.map((book) => {
    const bookData = buildBookData(book);
    return [bookData.slug, bookData] as const;
  }),
);

export function getBibleManifest(): BibleManifest {
  return manifest;
}

export function getBibleBooks(): BibleBookSummary[] {
  return manifest.books;
}

export function getBookSummaryBySlug(slug: string): BibleBookSummary | undefined {
  return manifest.books.find((book) => book.slug === slug);
}

export async function getBookData(slug: string): Promise<BibleBook | null> {
  return bookDataBySlug.get(slug) ?? null;
}

export async function getChapterData(
  slug: string,
  chapterNumber: number,
): Promise<BibleChapter | null> {
  const book = await getBookData(slug);

  if (!book) {
    return null;
  }

  return book.chapters.find((chapter) => chapter.number === chapterNumber) ?? null;
}

export function getAllChapterParams(): Array<{ book: string; chapter: string }> {
  return manifest.books.flatMap((book) =>
    book.chapters.map((chapterNumber) => ({
      book: book.slug,
      chapter: String(chapterNumber),
    })),
  );
}

export function getAdjacentChapter(
  slug: string,
  chapterNumber: number,
  direction: "prev" | "next",
): { book: string; chapter: number } | null {
  const flattened = manifest.books.flatMap((book) =>
    book.chapters.map((chapter) => ({ book: book.slug, chapter })),
  );

  const currentIndex = flattened.findIndex(
    (entry) => entry.book === slug && entry.chapter === chapterNumber,
  );

  if (currentIndex === -1) {
    return null;
  }

  const targetIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
  return flattened[targetIndex] ?? null;
}
