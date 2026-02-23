import articlesData from "@/content/articles.json";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
  topics: string[];
  body: string[];
};

const articles = articlesData as Article[];

export function getAllArticles(): Article[] {
  return [...articles].sort((a, b) =>
    a.updatedAt < b.updatedAt ? 1 : -1,
  );
}

export function getFeaturedArticles(limit = 3): Article[] {
  return getAllArticles().slice(0, limit);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getArticleSlugs(): string[] {
  return articles.map((article) => article.slug);
}
