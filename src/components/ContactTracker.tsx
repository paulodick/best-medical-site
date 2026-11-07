"use client";

import { useEffect } from "react";
import { captureAttribution, getAttribution } from "@/lib/attribution";
import { track } from "@/lib/track";

/**
 * Um único ouvinte para todos os links de contato:
 * - registra click_whatsapp / click_tel / click_email (intenção, com o local do clique);
 * - anexa a origem (UTMs/gclid/fbclid) ao texto do WhatsApp no momento do clique.
 */
export function ContactTracker() {
  useEffect(() => {
    captureAttribution();
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const local = a.closest("[data-local]")?.getAttribute("data-local") ?? "pagina";
      if (href.startsWith("https://wa.me/")) {
        track("click_whatsapp", { local, pagina: location.pathname });
        const attr = getAttribution();
        const origem = [attr.utm_source, attr.utm_medium, attr.utm_campaign].filter(Boolean).join(" / ");
        const ids = [attr.gclid && "gclid", attr.fbclid && "fbclid"].filter(Boolean).join(",");
        if (origem || ids) {
          const url = new URL(href);
          const text = url.searchParams.get("text") ?? "";
          if (!text.includes("[origem:")) {
            url.searchParams.set("text", `${text}\n[origem: ${[origem, ids].filter(Boolean).join(" · ")}]`);
            a.href = url.toString();
          }
        }
      } else if (href.startsWith("tel:")) {
        track("click_tel", { local, pagina: location.pathname });
      } else if (href.startsWith("mailto:")) {
        track("click_email", { local, pagina: location.pathname });
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
