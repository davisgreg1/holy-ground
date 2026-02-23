"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics/track";
import { cn } from "@/lib/ui/cn";
import { useLeadMagnet } from "./lead-magnet-provider";

type LeadMagnetTriggerLinkProps = {
  className?: string;
  href?: string;
  source: string;
  triggerMode?: "instant" | "second-click";
  children: React.ReactNode;
};

export function LeadMagnetTriggerLink({
  className,
  href = "/lead-magnet",
  source,
  triggerMode = "instant",
  children,
}: LeadMagnetTriggerLinkProps) {
  const { openLeadMagnet, hasAccess, downloadUrl } = useLeadMagnet();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setArmed(false);
    }, 5000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [armed]);

  const targetHref = hasAccess && downloadUrl ? downloadUrl : href;

  return (
    <div className="space-y-2">
      <Link
        href={targetHref}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
          className,
        )}
        onClick={(event) => {
          if (hasAccess && downloadUrl) {
            trackEvent("lead_magnet_download", {
              source,
              location: "trigger_link",
            });

            return;
          }

          if (triggerMode === "second-click" && !armed) {
            event.preventDefault();
            setArmed(true);

            trackEvent("lead_magnet_second_click", {
              source,
            });

            return;
          }

          event.preventDefault();
          openLeadMagnet(source);
        }}
      >
        {children}
      </Link>
      {armed ? (
        <p className="text-xs font-medium tracking-wide text-[var(--color-muted)]">
          One more click to open your free guide.
        </p>
      ) : null}
    </div>
  );
}
