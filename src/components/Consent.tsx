"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/config/site";

const KEY = "bm_consent";
type Choice = "granted" | "denied";

// gtag precisa enfileirar o objeto `arguments` (formato esperado pelo GTM)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function gtag(..._args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments as unknown as Record<string, unknown>);
}

function loadGtm() {
  if (!site.gtmId || document.getElementById("gtm-js")) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.id = "gtm-js";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(site.gtmId)}`;
  document.head.appendChild(s);
}

/**
 * Consent Mode v2: o padrão "negado" é declarado no <head> (ver layout).
 * GTM e qualquer script de análise só carregam depois do "Aceitar".
 */
export function Consent() {
  // null = automático: o banner já vem no HTML (pinta junto com a página, sem atrasar o LCP)
  // e o script do <head> o esconde (classe consent-set) quando já existe uma escolha salva.
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(KEY); } catch { /* sem armazenamento */ }
    const t = setTimeout(() => { if (saved === "granted") apply("granted", false); }, 0);
    const onClick = (e: MouseEvent) => { if ((e.target as Element).closest?.("[data-consent-open]")) setOpen(true); };
    document.addEventListener("click", onClick);
    return () => { clearTimeout(t); document.removeEventListener("click", onClick); };
  }, []);

  function apply(c: Choice, persist = true) {
    if (persist) { try { localStorage.setItem(KEY, c); } catch { /* ignore */ } }
    const v = c === "granted" ? "granted" : "denied";
    gtag("consent", "update", { ad_storage: v, analytics_storage: v, ad_user_data: v, ad_personalization: v });
    if (c === "granted") loadGtm();
    document.documentElement.classList.add("consent-set");
    setOpen(false);
  }

  if (open === false) return null;
  return (
    <section
      aria-label="Preferências de cookies"
      data-consent-banner
      data-auto={open === null ? "" : undefined}
      className="fixed inset-x-3 bottom-[84px] z-[60] mx-auto max-w-[720px] rounded-[14px] border border-line-strong bg-bg-2/95 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl md:bottom-6"
    >
      <p className="text-[15px] text-ink-soft">
        Usamos cookies de medição para entender o uso do site e melhorar o atendimento. Nenhum script de análise roda sem o seu aceite.{" "}
        <Link href="/privacidade" className="text-accent underline underline-offset-4">Política de Privacidade</Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => apply("granted")} className="btn btn-primary !min-h-[44px]">Aceitar</button>
        <button type="button" onClick={() => apply("denied")} className="btn btn-ghost !min-h-[44px]">Recusar</button>
      </div>
    </section>
  );
}
