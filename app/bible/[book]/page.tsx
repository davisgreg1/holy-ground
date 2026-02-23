import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBibleBooks, getBookSummaryBySlug } from "@/lib/bible/data";

type BibleBookPageProps = {
  params: Promise<{
    book: string;
  }>;
};

export async function generateStaticParams() {
  return getBibleBooks().map((book) => ({ book: book.slug }));
}

export async function generateMetadata({ params }: BibleBookPageProps): Promise<Metadata> {
  const { book } = await params;
  const bookSummary = getBookSummaryBySlug(book);

  if (!bookSummary) {
    return {
      title: "Bible Book Not Found | Holy Ground Theology",
    };
  }

  return {
    title: `${bookSummary.name} | Bible Reader`,
    description: bookSummary.summary,
  };
}

export default async function BibleBookPage({ params }: BibleBookPageProps) {
  const { book } = await params;
  const bookSummary = getBookSummaryBySlug(book);

  if (!bookSummary) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-6 pb-20 pt-12">
      <Link href="/bible" className="text-sm font-semibold text-[var(--color-accent)]">
        Back to all books
      </Link>

      <h1 className="mt-4 text-4xl">{bookSummary.name}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
        {bookSummary.summary}
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {bookSummary.chapters.map((chapterNumber) => (
          <Link
            key={chapterNumber}
            href={`/bible/${bookSummary.slug}/${chapterNumber}`}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 text-sm font-semibold text-[var(--color-text)]"
          >
            Chapter {chapterNumber}
          </Link>
        ))}
      </div>
    </section>
  );
}
