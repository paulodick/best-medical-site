"use client";

import { useState } from "react";
import { parque } from "@/content/ferramentas";
import { setPrefill } from "@/lib/lead";
import { track } from "@/lib/track";
import { irParaContato } from "./shared";

type Sit = (typeof parque.situacoes)[number]["id"];
type Linha = Record<Sit, number>;
const vazio = (): Linha => ({ garantia: 0, contrato: 0, sem: 0 });

export function Parque({ modalidades }: { modalidades: { id: string; sigla: string; nome: string }[] }) {
  const [p, setP] = useState<Record<string, Linha>>(() => Object.fromEntries(modalidades.map((m) => [m.id, vazio()])));
  const [obs, setObs] = useState("");

  const mudar = (mid: string, s: Sit, d: number) =>
    setP((o) => ({ ...o, [mid]: { ...o[mid], [s]: Math.max(0, Math.min(parque.max, o[mid][s] + d)) } }));

  const total = (l: Linha) => l.garantia + l.contrato + l.sem;
  const porSit = (s: Sit) => modalidades.reduce((a, m) => a + p[m.id][s], 0);
  const geral = modalidades.reduce((a, m) => a + total(p[m.id]), 0);
  const linhasResumo = modalidades
    .filter((m) => total(p[m.id]) > 0)
    .map((m) => `${m.sigla}: ${total(p[m.id])} (${parque.situacoes.filter((s) => p[m.id][s.id]).map((s) => `${p[m.id][s.id]} ${s.curto}`).join(", ")})`);

  const enviar = () => {
    const texto = `Parque: ${linhasResumo.join("; ")}.${obs.trim() ? ` Marcas/modelos: ${obs.trim()}` : ""}`;
    const dominante = modalidades.slice().sort((a, b) => total(p[b.id]) - total(p[a.id]))[0];
    track("parque_complete", { total: geral, garantia: porSit("garantia"), contrato: porSit("contrato"), sem: porSit("sem") });
    setPrefill({
      ferramenta: "parque", modo: "completo", tipo: porSit("sem") > 0 ? "auditoria" : "contrato",
      modalidade: dominante?.id, equipamento: texto.slice(0, 160), sintoma: texto,
      dados: { parque: p, observacoes: obs.trim() },
    });
    irParaContato();
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-14">
      <div className="grid content-start gap-4">
        {modalidades.map((m) => (
          <fieldset key={m.id} className={`rounded-[14px] border p-5 transition-colors md:p-6 ${total(p[m.id]) ? "border-accent/50 bg-bg-2" : "border-line bg-bg-2/60"}`}>
            <legend className="sr-only">{m.nome}</legend>
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <p className="text-[18px] font-bold"><span className="hud mr-2 text-accent">{m.sigla}</span>{m.nome}</p>
              <span className="font-mono text-ink-mute" aria-hidden="true">{total(p[m.id])}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {parque.situacoes.map((s) => {
                const n = p[m.id][s.id];
                return (
                  <div key={s.id} className="flex items-center justify-between gap-3 rounded-[10px] border border-line bg-bg px-3 py-2 sm:flex-col sm:items-stretch sm:gap-1 sm:py-3">
                    <span className="whitespace-nowrap text-[14px] text-ink-soft sm:text-center" id={`pq-${m.id}-${s.id}`}>{s.label}</span>
                    <div className="flex items-center gap-1 sm:justify-between" role="group" aria-labelledby={`pq-${m.id}-${s.id}`}>
                      <button type="button" onClick={() => mudar(m.id, s.id, -1)} disabled={!n} aria-label={`Menos um: ${m.nome}, ${s.label}`}
                        className="grid size-10 place-items-center rounded-[8px] text-xl text-ink-soft hover:bg-bg-3 hover:text-accent disabled:opacity-30">−</button>
                      <output aria-live="polite" className={`w-6 text-center font-mono text-[17px] ${n ? "text-accent" : "text-ink-mute"}`}>{n}</output>
                      <button type="button" onClick={() => mudar(m.id, s.id, 1)} disabled={n >= parque.max} aria-label={`Mais um: ${m.nome}, ${s.label}`}
                        className="grid size-10 place-items-center rounded-[8px] text-xl text-ink-soft hover:bg-bg-3 hover:text-accent disabled:opacity-30">+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </fieldset>
        ))}
        <div>
          <label htmlFor="pq-obs" className="text-[15px] font-semibold">Marcas e modelos <span className="font-normal text-ink-mute">(opcional)</span></label>
          <textarea id="pq-obs" value={obs} onChange={(e) => setObs(e.target.value.slice(0, 400))} rows={3} placeholder="Ex.: RM 1.5T de 2012; TC 64 canais"
            className="mt-1.5 w-full rounded-[10px] border border-line-strong bg-bg-3 px-4 py-3 text-[16px] text-ink placeholder:text-ink-mute/70 focus:border-accent focus:outline-none" />
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start" aria-labelledby="pq-resumo">
        <div className="rounded-[16px] border border-line bg-bg-2 p-6 md:p-8" aria-live="polite">
          <p id="pq-resumo" className="hud text-accent">Resumo do parque</p>
          <p className="mt-3 text-[clamp(40px,5vw,64px)] font-extrabold leading-none tracking-[-0.03em]">{geral}</p>
          <p className="text-ink-soft">{geral === 1 ? "equipamento" : "equipamentos"}</p>
          <dl className="mt-6 grid grid-cols-3 gap-2">
            {parque.situacoes.map((s) => (
              <div key={s.id} className="rounded-[10px] border border-line bg-bg p-3">
                <dt className="text-[12px] leading-tight text-ink-mute">{s.label}</dt>
                <dd className={`mt-1 font-mono text-[20px] ${s.id === "sem" && porSit("sem") ? "text-danger" : ""}`}>{porSit(s.id)}</dd>
              </div>
            ))}
          </dl>
          {geral > 0 ? (
            <ul className="mt-6 grid gap-3 text-[15px] leading-relaxed text-ink-soft">
              {parque.situacoes.filter((s) => porSit(s.id) > 0).map((s) => <li key={s.id} className="border-l-2 border-line-strong pl-3">{parque.leituras[s.id]}</li>)}
            </ul>
          ) : (
            <p className="mt-6 text-[15px] text-ink-mute">Use + e − para marcar os equipamentos da sua unidade.</p>
          )}
          <button type="button" onClick={enviar} disabled={geral === 0} className="btn btn-primary mt-8 w-full disabled:cursor-not-allowed disabled:opacity-40" data-local="parque">
            Enviar resumo para a engenharia
          </button>
        </div>
      </aside>
    </div>
  );
}
