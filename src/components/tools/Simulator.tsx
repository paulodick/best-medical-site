"use client";

import { useEffect, useRef, useState } from "react";
import { simulador } from "@/content/ferramentas";
import { setPrefill } from "@/lib/lead";
import { track } from "@/lib/track";
import { AnimatedNumber, brl, irParaContato } from "./shared";

type Campo = keyof typeof simulador.campos;
const C = simulador.campos;

export function Simulator({ modalidades }: { modalidades: { id: string; sigla: string; label: string }[] }) {
  const [mod, setMod] = useState(modalidades[0]?.id ?? "");
  const [v, setV] = useState<Record<Campo, number>>({
    exames: C.exames.padrao, ticket: C.ticket.padrao, diasConvencional: C.diasConvencional.padrao, diasBest: C.diasBest.padrao,
  });
  const set = (k: Campo, n: number) =>
    setV((o) => {
      const x = { ...o, [k]: n };
      if (k === "diasConvencional" && x.diasBest > n) x.diasBest = n;
      if (k === "diasBest" && x.diasConvencional < n) x.diasConvencional = n;
      return x;
    });

  const porDia = v.exames * v.ticket;
  const atual = porDia * v.diasConvencional;
  const best = porDia * v.diasBest;
  const dif = atual - best;
  const modLabel = modalidades.find((m) => m.id === mod)?.label ?? "";

  // evento quando a pessoa para de mexer (1,5 s)
  const touched = useRef(false);
  useEffect(() => {
    if (!touched.current) return;
    const t = setTimeout(() => track("simulator_result", { modalidade: mod, ...v, perda_dia: porDia, diferenca: dif }), 1500);
    return () => clearTimeout(t);
  }, [mod, v, porDia, dif]);

  const enviar = () => {
    const resumo = `Simulador: ${modLabel}, ${v.exames} exames/dia, ticket ${brl(v.ticket)}, ${v.diasConvencional} dia(s) parado(s) hoje vs ${v.diasBest} no cenário informado. Receita de exames por dia parado: ${brl(porDia)}.`;
    setPrefill({ ferramenta: "simulador", modo: "completo", tipo: "contrato", modalidade: mod, sintoma: resumo, dados: { modalidade: mod, ...v, porDia, atual, best, diferenca: dif } });
    irParaContato();
  };

  const slider = (k: Campo, fmt: (n: number) => string = String) => {
    const c = C[k];
    const fill = ((v[k] - c.min) / (c.max - c.min)) * 100;
    return (
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor={`sim-${k}`} className="text-[15px] font-semibold">{c.label}</label>
          <output htmlFor={`sim-${k}`} className="font-mono text-[18px] text-accent">{fmt(v[k])}</output>
        </div>
        <input
          id={`sim-${k}`} type="range" className="range mt-2" min={c.min} max={c.max} step={c.passo} value={v[k]}
          style={{ ["--fill" as string]: `${fill}%` }}
          onChange={(e) => { touched.current = true; set(k, Number(e.target.value)); }}
          aria-valuetext={fmt(v[k])}
        />
        <div className="hud flex justify-between text-ink-mute"><span>{fmt(c.min)}</span><span>{fmt(c.max)}</span></div>
      </div>
    );
  };

  const dias = (n: number, cor: string) => (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${C.diasConvencional.max}, minmax(0,1fr))` }} aria-hidden="true">
      {Array.from({ length: C.diasConvencional.max }, (_, i) => <span key={i} className="day" style={{ background: i < n ? cor : "var(--color-line)", opacity: i < n ? 1 : 0.6 }} />)}
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
      <div className="grid content-start gap-8">
        <fieldset>
          <legend className="text-[15px] font-semibold">Modalidade</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {modalidades.map((m) => (
              <button key={m.id} type="button" aria-pressed={mod === m.id} onClick={() => { touched.current = true; setMod(m.id); }}
                className={`btn !min-h-[44px] !px-4 ${mod === m.id ? "btn-primary" : "btn-ghost"}`}>{m.label}</button>
            ))}
          </div>
        </fieldset>
        {slider("exames")}
        {slider("ticket", brl)}
        {slider("diasConvencional", (n) => `${n} ${n === 1 ? "dia" : "dias"}`)}
        {slider("diasBest", (n) => `${n} ${n === 1 ? "dia" : "dias"}`)}
      </div>

      <div className="rounded-[16px] border border-line bg-bg-2 p-6 md:p-8" aria-live="polite">
        <p className="hud text-accent">Resultado · {modLabel}</p>
        <p className="mt-4 text-[15px] text-ink-soft">Receita de exames que deixa de entrar por dia parado</p>
        <p className="mt-1 text-[clamp(36px,5vw,60px)] font-extrabold leading-none tracking-[-0.03em]"><AnimatedNumber value={porDia} format={brl} /></p>

        <div className="mt-8 grid gap-5">
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-4 text-[15px]">
              <span className="text-ink-soft">Cenário atual · {v.diasConvencional} {v.diasConvencional === 1 ? "dia" : "dias"}</span>
              <AnimatedNumber value={atual} format={brl} className="font-mono font-semibold text-danger" />
            </div>
            {dias(v.diasConvencional, "var(--color-danger)")}
          </div>
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-4 text-[15px]">
              <span className="text-ink-soft">Cenário com a Best Medical · {v.diasBest} {v.diasBest === 1 ? "dia" : "dias"}</span>
              <AnimatedNumber value={best} format={brl} className="font-mono font-semibold text-accent" />
            </div>
            {dias(v.diasBest, "var(--color-accent)")}
          </div>
        </div>

        <div className="mt-8 rounded-[12px] border border-accent/40 bg-accent/[0.06] p-5">
          <p className="text-[15px] text-ink-soft">Diferença entre os cenários</p>
          <p className="mt-1 text-[clamp(28px,3.4vw,40px)] font-extrabold leading-none tracking-[-0.03em] text-accent"><AnimatedNumber value={dif} format={brl} /></p>
        </div>

        <p className="mt-5 text-[14px] font-semibold text-ink">{simulador.nota}</p>
        <details className="mt-3 text-[14px] text-ink-soft">
          <summary className="cursor-pointer text-ink-soft hover:text-accent">Premissas do cálculo</summary>
          <ul className="mt-3 grid list-disc gap-1.5 pl-5">{simulador.premissas.map((p) => <li key={p}>{p}</li>)}</ul>
        </details>

        <button type="button" onClick={enviar} className="btn btn-primary mt-8 w-full sm:w-auto" data-local="simulador">Falar com a engenharia sobre este cenário</button>
      </div>
    </div>
  );
}
