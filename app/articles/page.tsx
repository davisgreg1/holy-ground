import Link from "next/link";
import { CtaButton } from "@/components/cta/cta-button";
import { getAllArticles } from "@/lib/content/articles";

export const metadata = {
  title: "Theology Articles | Holy Ground Theology",
  description: "Explore Catholic theology articles on Scripture, doctrine, prayer, and spiritual life.",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-12">
      <h1 className="text-4xl">Theology Articles</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
        Editorial content for seekers, catechists, and committed Catholics who want clear, faithful explanations.
      </p>

      <div className="mt-4">
        <CtaButton
          href="/lead-magnet"
          leadMagnetSource="articles_top"
          leadMagnetMode="second-click"
          className="text-xs"
        >
          Get the Free eBook
        </CtaButton>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <article
            key={article.slug}
            className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
              Updated {article.updatedAt}
            </p>
            <h2 className="mt-3 text-xl font-semibold">{article.title}</h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-[var(--color-muted)]">{article.excerpt}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {article.topics.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-1 text-xs font-medium text-[var(--color-muted)]"
                >
                  {topic}
                </span>
              ))}
            </div>

            <Link href={`/articles/${article.slug}`} className="mt-5 text-sm font-semibold text-[var(--color-accent)]">
              Read article
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
