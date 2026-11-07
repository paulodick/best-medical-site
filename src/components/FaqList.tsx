"use client";

import type { Faq } from "@/content/faq";
import { track } from "@/lib/track";

/** Acordeão com <details> nativo: teclado e leitores de tela funcionam sem JS. */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details
          key={f.id}
          id={`faq-${f.id}`}
          className="group scroll-mt-28"
          onToggle={(e) => { if ((e.currentTarget as HTMLDetailsElement).open) track("faq_open", { pergunta: f.id }); }}
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[17px] font-semibold md:text-[19px] [&::-webkit-details-marker]:hidden">
            <span>{f.q}</span>
            <span aria-hidden="true" className="mt-1 grid size-6 shrink-0 place-items-center rounded-full border border-line-strong text-accent transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="max-w-[70ch] pb-6 text-[16px] leading-relaxed text-ink-soft">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
