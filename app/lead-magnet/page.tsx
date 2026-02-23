import { CtaButton } from "@/components/cta/cta-button";
import { LeadMagnetImpression } from "@/components/lead-magnet/lead-magnet-impression";

export const metadata = {
  title: "Free Catholic Theology eBook | Holy Ground Theology",
  description:
    "Unlock the Catholic Theology Starter Guide and receive immediate PDF delivery plus study prompts.",
};

export default function LeadMagnetPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 pb-20 pt-12">
      <LeadMagnetImpression source="lead_magnet_page" />

      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-lg sm:p-10">
        <h1 className="text-4xl leading-tight">Free Catholic Theology Starter Guide</h1>
        <p className="mt-4 text-base leading-7 text-[var(--color-muted)]">
          A short, practical PDF that helps new readers understand Scripture, Tradition, sacramental theology,
          and where to begin in Catholic study.
        </p>

        <ul className="mt-6 space-y-2 text-sm leading-6 text-[var(--color-text)]">
          <li>7-day reading framework for Scripture and doctrine</li>
          <li>Clear glossary of common theological terms</li>
          <li>Starter bibliography for ongoing formation</li>
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <CtaButton
            href="/lead-magnet"
            leadMagnetSource="lead_magnet_page_cta"
            leadMagnetMode="instant"
          >
            Unlock the Free PDF
          </CtaButton>
          <CtaButton href="/bible" variant="secondary">
            Explore the Bible Reader
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
