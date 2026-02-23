export type SearchDocumentType = "article" | "bible" | "resource";

export type SearchDocument = {
  id: string;
  type: SearchDocumentType;
  title: string;
  url: string;
  excerpt: string;
  content: string;
  keywords: string[];
  updatedAt?: string;
};

export type RankedSearchResult = SearchDocument & {
  score: number;
};
