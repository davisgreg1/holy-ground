import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

function toSlug(value) {
  return value
    .toLowerCase()
    .replace(/["'.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripStrongsMarkup(text) {
  return text
    .replace(/\{[^}]+\}/g, "")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

async function loadJson(relativePath) {
  const fullPath = path.join(projectRoot, relativePath);
  const content = await readFile(fullPath, "utf8");
  return JSON.parse(content);
}

function buildBibleChapterDocuments(kjvPayload) {
  const chapterMap = new Map();

  for (const verse of kjvPayload.verses) {
    const key = `${verse.book}:${verse.chapter}`;

    if (!chapterMap.has(key)) {
      chapterMap.set(key, {
        book: verse.book,
        bookName: verse.book_name,
        chapter: verse.chapter,
        verses: [],
      });
    }

    chapterMap.get(key).verses.push(stripStrongsMarkup(verse.text));
  }

  return [...chapterMap.values()]
    .sort((a, b) => (a.book === b.book ? a.chapter - b.chapter : a.book - b.book))
    .map((chapterEntry) => ({
      id: `bible:${toSlug(chapterEntry.bookName)}:${chapterEntry.chapter}`,
      type: "bible",
      title: `${chapterEntry.bookName} ${chapterEntry.chapter}`,
      url: `/bible/${toSlug(chapterEntry.bookName)}/${chapterEntry.chapter}`,
      excerpt: chapterEntry.verses.slice(0, 2).join(" "),
      content: chapterEntry.verses.join(" "),
      keywords: [chapterEntry.bookName, `chapter ${chapterEntry.chapter}`, "scripture", "bible"],
      updatedAt: new Date().toISOString().slice(0, 10),
    }));
}

async function buildIndex() {
  const [articles, kjvPayload] = await Promise.all([
    loadJson("content/articles.json"),
    loadJson("kjv_strongs.json"),
  ]);

  const articleDocs = articles.map((article) => ({
    id: `article:${article.slug}`,
    type: "article",
    title: article.title,
    url: `/articles/${article.slug}`,
    excerpt: article.excerpt,
    content: article.body.join(" "),
    keywords: article.topics,
    updatedAt: article.updatedAt,
  }));

  const bibleChapterDocs = buildBibleChapterDocuments(kjvPayload);

  const resourceDocs = [
    {
      id: "resource:lead-magnet",
      type: "resource",
      title: "Free Catholic Theology eBook",
      url: "/lead-magnet",
      excerpt:
        "Download the beginner-friendly Catholic theology guide and start a focused 7-day reading plan.",
      content:
        "Lead magnet funnel, theology guide, free PDF, Catholic doctrine quickstart, conversion checklist.",
      keywords: ["ebook", "guide", "free", "catholic", "theology"],
      updatedAt: new Date().toISOString().slice(0, 10),
    },
  ];

  const documents = [...articleDocs, ...bibleChapterDocs, ...resourceDocs];

  const index = {
    generatedAt: new Date().toISOString(),
    totalDocuments: documents.length,
    documents,
  };

  const publicDir = path.join(projectRoot, "public");
  await mkdir(publicDir, { recursive: true });
  await writeFile(
    path.join(publicDir, "search-index.json"),
    JSON.stringify(index),
    "utf8",
  );

  console.log(
    `Built search index with ${index.totalDocuments} documents at public/search-index.json`,
  );
}

buildIndex().catch((error) => {
  console.error("Failed to build search index", error);
  process.exitCode = 1;
});
