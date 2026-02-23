import Link from "next/link";
import { CtaButton } from "@/components/cta/cta-button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/bible", label: "Bible Reader" },
  { href: "/search", label: "Search" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-wide text-[var(--color-text)]">
          Holy Ground Theology
        </Link>

        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-[var(--color-muted)]">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-[var(--color-text)]">
              {item.label}
            </Link>
          ))}
        </nav>

        <CtaButton
          href="/lead-magnet"
          leadMagnetSource="header_cta"
          leadMagnetMode="second-click"
          className="text-xs"
        >
          Free eBook
        </CtaButton>
      </div>
    </header>
  );
}
