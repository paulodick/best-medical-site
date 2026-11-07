"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

/** Placeholder com a altura aproximada do formulário (evita CLS). */
function Reserva() {
  return <div aria-hidden="true" className="min-h-[560px] animate-pulse rounded-[10px] bg-bg-3/40 motion-reduce:animate-none" />;
}

const LeadForm = dynamic(() => import("./LeadForm").then((m) => m.LeadForm), { ssr: false, loading: Reserva });

/**
 * Carrega o formulário (React Hook Form + Zod) só quando a seção de contato se aproxima,
 * quando uma ferramenta envia pré-preenchimento ou quando a pessoa interage com a página.
 * Os contatos diretos ao lado continuam disponíveis no HTML desde o primeiro carregamento.
 */
export function LeadFormLazy() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ligar = () => setOn(true);
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) ligar(); }, { rootMargin: "900px 0px" });
    io.observe(el);
    window.addEventListener("bm:prefill", ligar);
    return () => { io.disconnect(); window.removeEventListener("bm:prefill", ligar); };
  }, []);
  return <div ref={ref}>{on ? <LeadForm /> : <Reserva />}</div>;
}
