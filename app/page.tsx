import Link from "next/link";
import { CtaButton } from "@/components/cta/cta-button";
import { LeadMagnetImpression } from "@/components/lead-magnet/lead-magnet-impression";
import { getFeaturedArticles } from "@/lib/content/articles";

export default function Home() {
  const featuredArticles = getFeaturedArticles(3);

  return (
    <div>
      <LeadMagnetImpression source="homepage_hero" />

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-14">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-xl sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Catholic Theology Formation Hub
          </p>

          <h1 className="mt-5 max-w-3xl text-4xl leading-tight sm:text-5xl">
            Learn Scripture and doctrine with a modern, searchable Catholic study experience.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--color-muted)] sm:text-lg">
            Read Scripture chapter-by-chapter, discover theology articles fast, and guide new visitors into
            a conversion-focused lead magnet funnel.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <CtaButton
              href="/lead-magnet"
              leadMagnetSource="homepage_primary"
              leadMagnetMode="second-click"
            >
              Get the Free eBook
            </CtaButton>
            <CtaButton href="/bible" variant="secondary">
              Open Bible Reader
            </CtaButton>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-6 pb-16 sm:grid-cols-3">
        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Lead Magnet Funnel</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            CTA triggers, second-click popup behavior, conversion analytics, and automated PDF delivery.
          </p>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Online Bible Reader</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Mobile-first chapter reading with static generation and direct verse linking for study workflows.
          </p>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Static Site Search</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Build-time index pipeline with weighted ranking across theology articles, Bible passages, and resources.
          </p>
        </article>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-3xl">Featured Articles</h2>
          <Link href="/articles" className="text-sm font-semibold text-[var(--color-accent)]">
            View all
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredArticles.map((article) => (
            <article
              key={article.slug}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            >
              <h3 className="text-xl font-semibold">{article.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{article.excerpt}</p>
              <Link
                href={`/articles/${article.slug}`}
                className="mt-5 inline-flex text-sm font-semibold text-[var(--color-accent)]"
              >
                Read article
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
