import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaButton } from "@/components/cta/cta-button";
import { getArticleBySlug, getArticleSlugs } from "@/lib/content/articles";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | Holy Ground Theology",
    };
  }

  return {
    title: `${article.title} | Holy Ground Theology`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-6 pb-20 pt-12">
      <header className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
          Updated {article.updatedAt}
        </p>
        <h1 className="mt-4 text-4xl leading-tight">{article.title}</h1>
        <p className="mt-4 text-base leading-7 text-[var(--color-muted)]">{article.excerpt}</p>

        <div className="mt-6">
          <CtaButton
            href="/lead-magnet"
            leadMagnetSource={`article_${article.slug}`}
            leadMagnetMode="second-click"
            className="text-xs"
          >
            Download Free Theology Guide
          </CtaButton>
        </div>
      </header>

      <section className="mt-10 space-y-6 text-base leading-8 text-[var(--color-text)]">
        {article.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
    </article>
  );
}
