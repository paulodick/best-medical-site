"use client";

import { useEffect, useRef } from "react";

export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

/** Leva ao formulário de chamado da própria página (já pré-preenchido via setPrefill). */
export function irParaContato() {
  const el = document.getElementById("contato");
  if (!el) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  // foco no primeiro campo quando o formulário (carregado sob demanda) estiver pronto
  let n = 0;
  const t = setInterval(() => {
    const f = el.querySelector<HTMLInputElement>("#lf-nome");
    if (f || ++n > 30) { clearInterval(t); f?.focus({ preventScroll: true }); }
  }, 100);
}

/** Número que anima até o valor (sem re-render: escreve direto no nó). Respeita movimento reduzido. */
export function AnimatedNumber({ value, format, className }: { value: number; format: (n: number) => string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(value);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const start = from.current;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || start === value) { el.textContent = format(value); from.current = value; return; }
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 600);
      const e = 1 - Math.pow(1 - k, 3);
      const v = start + (value - start) * e;
      el.textContent = format(Math.round(v));
      from.current = v;
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, format]);
  return <span ref={ref} className={className}>{format(value)}</span>;
}
