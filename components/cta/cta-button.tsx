import Link from "next/link";
import { cn } from "@/lib/ui/cn";
import { LeadMagnetTriggerLink } from "@/components/lead-magnet/lead-magnet-trigger-link";

type CtaButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  leadMagnetSource?: string;
  leadMagnetMode?: "instant" | "second-click";
};

export function CtaButton({
  href,
  children,
  className,
  variant = "primary",
  leadMagnetSource,
  leadMagnetMode = "instant",
}: CtaButtonProps) {
  const variantStyles =
    variant === "primary"
      ? "bg-[var(--color-accent)] text-white"
      : "border border-[var(--color-border-strong)] bg-transparent text-[var(--color-text)]";

  const sharedStyles = cn(
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5",
    variantStyles,
    className,
  );

  if (leadMagnetSource) {
    return (
      <LeadMagnetTriggerLink
        href={href}
        source={leadMagnetSource}
        triggerMode={leadMagnetMode}
        className={sharedStyles}
      >
        {children}
      </LeadMagnetTriggerLink>
    );
  }

  return (
    <Link href={href} className={sharedStyles}>
      {children}
    </Link>
  );
}
