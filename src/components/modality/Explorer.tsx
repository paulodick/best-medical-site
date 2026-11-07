"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { ModalidadeConteudo } from "@/content/modalidades";
import type { ModalidadeId } from "@/content/types";
import { track } from "@/lib/track";
import { Diagram } from "./Diagram";

type Item = ModalidadeConteudo & { sigla: string; rota: string };

/** Seletor de modalidade + vista explodida com hotspots clicáveis. */
export function Explorer({ items, verDetalhes, nota, initial }: { items: Item[]; verDetalhes: string; nota: string; initial?: ModalidadeId }) {
  const [mod, setMod] = useState<ModalidadeId>(initial ?? items[0].id);
  const current = items.find((i) => i.id === mod) ?? items[0];
  const [hot, setHot] = useState<string>(current.hotspots[0].id);
  const spot = current.hotspots.find((h) => h.id === hot) ?? current.hotspots[0];
  const uid = useId();
  const single = items.length === 1;

  const pick = (id: ModalidadeId) => {
    const next = items.find((i) => i.id === id)!;
    setMod(id);
    setHot(next.hotspots[0].id);
    track("modality_select", { modalidade: id });
  };

  return (
    <div>
      {!single && (
        <div role="tablist" aria-label="Modalidades" className="mb-6 flex flex-wrap gap-2">
          {items.map((i) => (
            <button
              key={i.id}
              role="tab"
              type="button"
              id={`${uid}-tab-${i.id}`}
              aria-selected={i.id === mod}
              aria-controls={`${uid}-panel`}
              onClick={() => pick(i.id)}
              onKeyDown={(e) => {
                const idx = items.findIndex((x) => x.id === mod);
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                  const n = items[(idx + (e.key === "ArrowRight" ? 1 : items.length - 1)) % items.length];
                  pick(n.id);
                  document.getElementById(`${uid}-tab-${n.id}`)?.focus();
                }
              }}
              tabIndex={i.id === mod ? 0 : -1}
              className="hud min-h-[44px] rounded-full border border-line-strong px-4 text-ink-soft aria-selected:border-accent aria-selected:bg-accent aria-selected:text-on-accent"
            >
              {i.sigla} <span className="sr-only">· {i.titulo}</span>
            </button>
          ))}
        </div>
      )}

      <div id={`${uid}-panel`} role={single ? undefined : "tabpanel"} aria-labelledby={single ? undefined : `${uid}-tab-${mod}`} className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-10">
        <div key={mod} className="ex-fade relative overflow-hidden rounded-[14px] border border-line bg-bg-2/70">
          <span className="hud absolute left-4 top-3 text-ink-mute">{current.hud}</span>
          <div className="relative">
            <Diagram id={mod} />
            {current.hotspots.map((h, i) => (
              <button
                key={h.id}
                type="button"
                aria-pressed={h.id === spot.id}
                aria-controls={`${uid}-spot`}
                onClick={() => { setHot(h.id); track("hotspot_open", { modalidade: mod, componente: h.id }); }}
                className="ex-hot absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
              >
                <span className="sr-only">{h.nome}</span>
                <span aria-hidden="true" className="ex-dot font-mono text-[11px] font-semibold">{i + 1}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <p className="hud text-accent">{current.titulo}</p>
          <p className="mt-2 text-[17px] text-ink-soft">{current.resumo}</p>
          <div id={`${uid}-spot`} aria-live="polite" className="mt-6 rounded-[12px] border border-line bg-bg-3/60 p-5">
            <p className="hud text-ink-mute">{String(current.hotspots.indexOf(spot) + 1).padStart(2, "0")} · componente</p>
            <h3 className="mt-1 text-xl font-bold">{spot.nome}</h3>
            <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">{spot.fazemos}</p>
          </div>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Componentes">
            {current.hotspots.map((h, i) => (
              <li key={h.id}>
                <button
                  type="button"
                  onClick={() => { setHot(h.id); track("hotspot_open", { modalidade: mod, componente: h.id }); }}
                  aria-pressed={h.id === spot.id}
                  className="min-h-[36px] rounded-full border border-line px-3 text-[13px] text-ink-soft aria-pressed:border-accent aria-pressed:text-ink"
                >
                  {i + 1}. {h.nome}
                </button>
              </li>
            ))}
          </ul>
          <Link href={current.rota} className="btn btn-ghost mt-6 self-start">{verDetalhes} →</Link>
          <p className="mt-4 text-[13px] text-ink-mute">{nota}</p>
        </div>
      </div>
    </div>
  );
}
