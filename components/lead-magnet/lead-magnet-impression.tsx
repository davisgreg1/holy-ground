"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/track";

export function LeadMagnetImpression({
  source,
}: {
  source: string;
}) {
  useEffect(() => {
    trackEvent("lead_magnet_impression", {
      source,
    });
  }, [source]);

  return null;
}
