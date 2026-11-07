/** Eventos via dataLayer. O GTM só carrega após consentimento; antes disso os eventos ficam na fila local. */
export type TrackEvent =
  | "generate_lead" | "click_whatsapp" | "click_tel" | "click_email" | "form_open" | "form_start"
  | "scanner_interact" | "modality_select" | "hotspot_open" | "wizard_start" | "wizard_complete"
  | "simulator_result" | "parque_complete" | "guide_open" | "guide_cta_click" | "faq_open" | "search_open";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: TrackEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
