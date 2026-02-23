import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChapterNavigation } from "@/components/bible/chapter-navigation";
import {
  getAdjacentChapter,
  getAllChapterParams,
  getBookSummaryBySlug,
  getChapterData,
} from "@/lib/bible/data";

type BibleChapterPageProps = {
  params: Promise<{
    book: string;
    chapter: string;
  }>;
};

export async function generateStaticParams() {
  return getAllChapterParams();
}

export async function generateMetadata({ params }: BibleChapterPageProps): Promise<Metadata> {
  const { book, chapter } = await params;
  const bookSummary = getBookSummaryBySlug(book);

  if (!bookSummary) {
    return {
      title: "Bible Chapter Not Found | Holy Ground Theology",
    };
  }

  return {
    title: `${bookSummary.name} ${chapter} | Bible Reader`,
    description: `Read ${bookSummary.name} ${chapter} in the Holy Ground Bible reader.`,
  };
}

export default async function BibleChapterPage({ params }: BibleChapterPageProps) {
  const { book, chapter } = await params;
  const chapterNumber = Number(chapter);

  if (Number.isNaN(chapterNumber)) {
    notFound();
  }

  const [bookSummary, chapterData] = await Promise.all([
    Promise.resolve(getBookSummaryBySlug(book)),
    getChapterData(book, chapterNumber),
  ]);

  if (!bookSummary || !chapterData) {
    notFound();
  }

  const previous = getAdjacentChapter(bookSummary.slug, chapterNumber, "prev");
  const next = getAdjacentChapter(bookSummary.slug, chapterNumber, "next");

  return (
    <article className="mx-auto w-full max-w-4xl px-6 pb-20 pt-12">
      <header className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm">
        <Link href={`/bible/${bookSummary.slug}`} className="text-sm font-semibold text-[var(--color-accent)]">
          {bookSummary.name} chapters
        </Link>

        <h1 className="mt-4 text-4xl">
          {bookSummary.name} {chapterData.number}
        </h1>
        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{bookSummary.summary}</p>
      </header>

      <section className="mt-8 space-y-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
        {chapterData.verses.map((verse) => (
          <p key={verse.number} id={`v${verse.number}`} className="text-base leading-8 text-[var(--color-text)]">
            <a
              href={`#v${verse.number}`}
              className="mr-2 inline-block min-w-6 align-top text-xs font-semibold text-[var(--color-accent)]"
              aria-label={`Link to verse ${verse.number}`}
            >
              {verse.number}
            </a>
            <span>{verse.text}</span>
          </p>
        ))}
      </section>

      <ChapterNavigation previous={previous} next={next} />
    </article>
  );
}
