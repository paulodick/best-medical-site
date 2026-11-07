"use client";

import { useEffect, useMemo, useState } from "react";
import { guia, type ItemGuia, type Prioridade } from "@/content/ferramentas";
import { track } from "@/lib/track";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function Guide({ itens, modalidades, plantao }: {
  itens: ItemGuia[];
  modalidades: { id: string; sigla: string; nome: string }[];
  plantao: Record<string, string>; // id do item → link do WhatsApp
}) {
  const [q, setQ] = useState("");
  const [mod, setMod] = useState("todas");
  const [pri, setPri] = useState<"todas" | Prioridade>("todas");

  useEffect(() => { track("guide_open", { pagina: location.pathname }); }, []);

  const lista = useMemo(() => {
    const termos = norm(q).split(/\s+/).filter(Boolean);
    return itens.filter((i) => {
      if (mod !== "todas" && i.modalidade !== mod) return false;
      if (pri !== "todas" && i.prioridade !== pri) return false;
      const txt = norm(`${i.sintoma} ${i.termos} ${i.causa}`);
      return termos.every((t) => txt.includes(t));
    });
  }, [itens, q, mod, pri]);

  const chip = (ativo: boolean) => `btn !min-h-[40px] !px-4 !text-[14px] ${ativo ? "btn-primary" : "btn-ghost"}`;
  const nomeMod = (id: string) => modalidades.find((m) => m.id === id)?.nome ?? id;

  return (
    <div>
      <div role="note" className="sticky top-[72px] z-30 -mx-4 mb-8 border-y border-accent/40 bg-bg-2/95 px-4 py-3 backdrop-blur md:mx-0 md:rounded-[12px] md:border md:px-5">
        <p className="flex gap-3 text-[14px] leading-relaxed text-ink md:text-[15px]">
          <span aria-hidden="true" className="mt-0.5 font-mono text-accent">!</span>
          <span>{guia.aviso}</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <label htmlFor="guia-q" className="text-[15px] font-semibold">Buscar sintoma ou termo do console</label>
          <input id="guia-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ex.: hélio, anel, flat panel, bobina"
            className="mt-1.5 w-full rounded-[10px] border border-line-strong bg-bg-3 px-4 py-3 text-[16px] text-ink placeholder:text-ink-mute/70 focus:border-accent focus:outline-none" />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por modalidade">
          <button type="button" aria-pressed={mod === "todas"} onClick={() => setMod("todas")} className={chip(mod === "todas")}>Todas</button>
          {modalidades.map((m) => <button key={m.id} type="button" aria-pressed={mod === m.id} onClick={() => setMod(m.id)} className={chip(mod === m.id)}>{m.sigla}</button>)}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por prioridade">
          <button type="button" aria-pressed={pri === "todas"} onClick={() => setPri("todas")} className={chip(pri === "todas")}>Toda prioridade</button>
          {(Object.keys(guia.prioridades) as Prioridade[]).map((p) => <button key={p} type="button" aria-pressed={pri === p} onClick={() => setPri(p)} className={chip(pri === p)}>{guia.prioridades[p]}</button>)}
        </div>
      </div>

      <p className="hud mt-8 text-ink-mute" aria-live="polite">{lista.length} {lista.length === 1 ? "resultado" : "resultados"}</p>
      <ul className="mt-4 grid gap-4 lg:grid-cols-2">
        {lista.map((i) => (
          <li key={i.id} id={i.id} className="flex scroll-mt-40 flex-col rounded-[14px] border border-line bg-bg-2 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="hud text-ink-mute">{nomeMod(i.modalidade)}</span>
              <span className={`hud rounded-full border px-2.5 py-1 ${i.prioridade === "critica" ? "border-danger/50 text-danger" : "border-steel text-ink-soft"}`}>{guia.prioridades[i.prioridade]}</span>
            </div>
            <h2 className="mt-3 text-[19px] font-bold leading-snug">{i.sintoma}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft"><b className="font-semibold text-ink">Origem provável: </b>{i.causa}</p>
            <div className="mt-4 rounded-[10px] border-l-2 border-accent bg-bg p-4">
              <p className="hud text-accent">Conduta preliminar</p>
              <p className="mt-1.5 text-[15px] leading-relaxed">{i.conduta}</p>
            </div>
            <div className="mt-auto pt-5" data-local="guia">
              <a href={plantao[i.id]} target="_blank" rel="noopener" onClick={() => track("guide_cta_click", { item: i.id, modalidade: i.modalidade })} className="btn btn-primary !min-h-[44px]">
                <span className="live-dot" aria-hidden="true" />Acionar plantão
              </a>
            </div>
          </li>
        ))}
      </ul>
      {lista.length === 0 && (
        <div className="mt-4 rounded-[14px] border border-line bg-bg-2 p-6">
          <p className="font-semibold">Nenhum item com esses filtros.</p>
          <p className="mt-1 text-ink-soft">Descreva o sintoma ao plantão: a triagem é feita pelos sintomas e registros do equipamento.</p>
          <button type="button" onClick={() => { setQ(""); setMod("todas"); setPri("todas"); }} className="btn btn-ghost mt-4">Limpar filtros</button>
        </div>
      )}
    </div>
  );
}
