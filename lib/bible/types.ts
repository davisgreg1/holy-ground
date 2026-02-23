export type BibleManifest = {
  translation: {
    id: string;
    name: string;
    shortName: string;
    license: string;
  };
  books: BibleBookSummary[];
};

export type BibleBookSummary = {
  slug: string;
  name: string;
  abbreviation: string;
  testament: "old" | "new";
  chapters: number[];
  summary: string;
};

export type BibleBook = {
  slug: string;
  name: string;
  chapters: BibleChapter[];
};

export type BibleChapter = {
  number: number;
  verses: BibleVerse[];
};

export type BibleVerse = {
  number: number;
  text: string;
};
