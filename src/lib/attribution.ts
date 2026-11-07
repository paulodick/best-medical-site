"use client";
/** Captura utm_*, gclid e fbclid na primeira visita da sessão (sessionStorage). */
const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const;
const STORE = "bm_attr";

export type Attribution = Partial<Record<(typeof KEYS)[number] | "landing", string>>;

export function captureAttribution() {
  try {
    if (sessionStorage.getItem(STORE)) return;
    const p = new URLSearchParams(location.search);
    const a: Attribution = { landing: location.pathname };
    for (const k of KEYS) {
      const v = p.get(k);
      if (v) a[k] = v.slice(0, 200);
    }
    sessionStorage.setItem(STORE, JSON.stringify(a));
  } catch {
    /* armazenamento indisponível: segue sem atribuição */
  }
}

export function getAttribution(): Attribution {
  try {
    return JSON.parse(sessionStorage.getItem(STORE) ?? "{}") as Attribution;
  } catch {
    return {};
  }
}
