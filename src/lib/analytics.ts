/**
 * Analytics hooks. Provider-agnostic: pushes to window.dataLayer (GTM/GA4) and
 * calls gtag if present. No-op when no analytics ID is configured. Never send PII.
 */
export type AnalyticsEvent =
  | "landing_page_view" | "cta_click" | "phone_click"
  | "form_start" | "form_submit" | "form_submit_error" | "form_validation_failure";

declare global {
  interface Window { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void }
}

export function track(event: AnalyticsEvent, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
    if (process.env.NODE_ENV === "development") console.debug("[analytics]", event, params);
  } catch { /* analytics must never break the page */ }
}
