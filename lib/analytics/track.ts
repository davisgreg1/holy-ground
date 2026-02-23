export type AnalyticsEventName =
  | "lead_magnet_impression"
  | "lead_magnet_open"
  | "lead_magnet_second_click"
  | "lead_magnet_submit"
  | "lead_magnet_conversion"
  | "lead_magnet_download"
  | "search_performed"
  | "search_result_click"
  | "bible_navigation";

type AnalyticsPayload = Record<string, string | number | boolean>;

type AnalyticsWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (
    command: string,
    eventName: string,
    eventPayload: AnalyticsPayload,
  ) => void;
};

export function trackEvent(
  event: AnalyticsEventName,
  payload: AnalyticsPayload = {},
): void {
  if (typeof window === "undefined") {
    return;
  }

  const analyticsWindow = window as AnalyticsWindow;

  if (Array.isArray(analyticsWindow.dataLayer)) {
    analyticsWindow.dataLayer.push({
      event,
      ...payload,
    });
  }

  if (typeof analyticsWindow.gtag === "function") {
    analyticsWindow.gtag("event", event, payload);
  }

  window.dispatchEvent(
    new CustomEvent("analytics:event", {
      detail: {
        event,
        payload,
      },
    }),
  );
}
