import Link from "next/link";
import { getBibleManifest } from "@/lib/bible/data";

export const metadata = {
  title: "Bible Reader | Holy Ground Theology",
  description: "Read Scripture chapter-by-chapter in a mobile-friendly Catholic Bible reader.",
};

export default function BiblePage() {
  const manifest = getBibleManifest();

  const oldTestament = manifest.books.filter((book) => book.testament === "old");
  const newTestament = manifest.books.filter((book) => book.testament === "new");

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-12">
      <h1 className="text-4xl">Online Bible Reader</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
        Translation: {manifest.translation.name}. Fast chapter navigation designed for daily reading and theological
        study.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl">Old Testament</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {oldTestament.map((book) => (
              <Link
                key={book.slug}
                href={`/bible/${book.slug}`}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
              >
                <h3 className="text-lg font-semibold">{book.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{book.summary}</p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl">New Testament</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {newTestament.map((book) => (
              <Link
                key={book.slug}
                href={`/bible/${book.slug}`}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
              >
                <h3 className="text-lg font-semibold">{book.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{book.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
