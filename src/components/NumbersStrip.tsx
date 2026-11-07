"use client";

import { useEffect, useRef } from "react";
import type { Claim } from "@/config/claims";

const fmt = new Intl.NumberFormat("pt-BR");

/**
 * Faixa de números. Recebe só os claims com valor (os vazios já foram filtrados).
 * O HTML estático traz o valor final (SEO, sem JS, movimento reduzido); a contagem roda uma vez ao entrar na tela.
 */
export function NumbersStrip({ title, items }: { title: string; items: Claim[] }) {
  const ref = useRef<HTMLDListElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = [...root.querySelectorAll<HTMLElement>("[data-n]")];
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const t0 = performance.now();
        const run = (now: number) => {
          const k = Math.min(1, (now - t0) / 1200);
          const e = 1 - Math.pow(1 - k, 3);
          els.forEach((el) => {
            const n = Number(el.dataset.n);
            el.textContent = `${el.dataset.pre ?? ""}${fmt.format(Math.round(n * e))}${el.dataset.suf ?? ""}`;
          });
          if (k < 1) requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
      },
      { threshold: 0.4 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  if (!items.length) return null;

  return (
    <section aria-label={title} className="border-y border-line bg-bg-2/60">
      <dl ref={ref} className="wrap grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:py-12 lg:grid-cols-4">
        {items.map((c) => (
          <div key={c.rotulo} className="border-l border-line pl-4 md:pl-6">
            <dt className="sr-only">{c.rotulo}</dt>
            <dd className="m-0">
              <span
                className="block text-[34px] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-ink md:text-[48px]"
                {...(c.numero !== undefined ? { "data-n": c.numero, "data-pre": c.prefixo ?? "", "data-suf": c.sufixo ?? "" } : {})}
              >
                {c.numero !== undefined ? `${c.prefixo ?? ""}${fmt.format(c.numero)}${c.sufixo ?? ""}` : c.valor}
              </span>
              <span className="mt-3 block text-[15px] leading-snug text-ink-soft">{c.rotulo}</span>
              {c.detalhe && <span className="mt-1 block text-[13px] text-ink-mute">{c.detalhe}</span>}
              {(c.fonte || c.periodo) && (
                <span className="hud mt-2 block !text-[10.5px] text-ink-mute/80">
                  {[c.periodo, c.fonte].filter(Boolean).join(" · ")}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
