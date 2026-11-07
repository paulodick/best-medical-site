"use client";

import { useMemo, useRef, useState } from "react";
import { assistente, type Pergunta } from "@/content/ferramentas";
import { setPrefill } from "@/lib/lead";
import { track } from "@/lib/track";
import { irParaContato } from "./shared";

type Respostas = Partial<Record<Pergunta["id"], string>>;

export function Wizard({ modalidades, plantaoHref }: { modalidades: { id: string; label: string }[]; plantaoHref: string }) {
  const perguntas = useMemo<Pergunta[]>(
    () => assistente.perguntas.map((p) => (p.id === "modalidade" ? { ...p, opcoes: [...modalidades, { id: "outra", label: "Outro equipamento" }] } : p)),
    [modalidades],
  );
  const [passo, setPasso] = useState(0);
  const [r, setR] = useState<Respostas>({});
  const titulo = useRef<HTMLHeadingElement>(null);
  const fim = passo >= perguntas.length;

  const focar = () => requestAnimationFrame(() => {
    const el = titulo.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    const top = el.getBoundingClientRect().top;
    if (top < 90 || top > innerHeight * 0.6) el.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });
  const escolher = (pid: Pergunta["id"], oid: string) => {
    if (Object.keys(r).length === 0) track("wizard_start", {});
    const novo = { ...r, [pid]: oid };
    setR(novo);
    const prox = passo + 1;
    setPasso(prox);
    if (prox >= perguntas.length) track("wizard_complete", { ...novo, caminho: caminho(novo) });
    focar();
  };

  const rotulo = (pid: Pergunta["id"]) => perguntas.find((p) => p.id === pid)?.opcoes.find((o) => o.id === r[pid])?.label ?? "";

  if (fim) {
    const c = caminho(r);
    const res = assistente.resultado[c];
    const nota = r.cobertura ? assistente.resultado.notas[r.cobertura as keyof typeof assistente.resultado.notas] : null;
    const resumo = perguntas.map((p) => `${p.titulo} ${rotulo(p.id)}`).join(" | ");
    const abrir = () => {
      setPrefill({
        ferramenta: "assistente",
        modo: c === "emergencia" ? "emergencia" : "completo",
        tipo: c === "emergencia" ? "emergencia" : c === "planejamento" ? "auditoria" : "corretiva",
        modalidade: r.modalidade === "outra" ? "outra" : r.modalidade,
        sintoma: `Assistente "Reparar ou trocar?": ${resumo}`,
        dados: { respostas: r, caminho: c },
      });
      irParaContato();
    };
    return (
      <div className="ex-fade grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-14">
        <div className={`rounded-[16px] border p-6 md:p-10 ${c === "emergencia" ? "border-accent/60 bg-accent/[0.06]" : "border-line bg-bg-2"}`}>
          <p className="hud text-accent">{res.hud}</p>
          <h2 ref={titulo} tabIndex={-1} className="mt-3 scroll-mt-32 text-[clamp(26px,3vw,40px)] font-extrabold leading-tight tracking-[-0.03em] focus:outline-none">{res.titulo}</h2>
          <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-ink-soft">{res.texto}</p>
          {nota && <p className="mt-4 max-w-[60ch] border-l-2 border-steel pl-4 text-[15px] leading-relaxed text-ink-soft">{nota}</p>}
          <div className="mt-8 flex flex-wrap gap-3" data-local="assistente">
            {c === "emergencia" ? (
              <>
                <a href={plantaoHref} target="_blank" rel="noopener" className="btn btn-primary"><span className="live-dot" aria-hidden="true" />Plantão 24h no WhatsApp</a>
                <button type="button" onClick={abrir} className="btn btn-ghost">Abrir chamado com estas respostas</button>
              </>
            ) : (
              <button type="button" onClick={abrir} className="btn btn-primary">Abrir chamado com estas respostas</button>
            )}
            <button type="button" onClick={() => { setR({}); setPasso(0); focar(); }} className="btn btn-ghost">Refazer</button>
          </div>
          <p className="mt-6 text-[13px] leading-relaxed text-ink-mute">{assistente.aviso}</p>
        </div>
        <div>
          <p className="hud mb-4 text-ink-mute">Suas respostas</p>
          <dl className="grid gap-px overflow-hidden rounded-[14px] border border-line bg-line">
            {perguntas.map((p, i) => (
              <div key={p.id} className="flex items-start justify-between gap-4 bg-bg px-5 py-4">
                <div>
                  <dt className="text-[13px] text-ink-mute">{p.titulo}</dt>
                  <dd className="mt-0.5 font-semibold">{rotulo(p.id)}</dd>
                </div>
                <button type="button" onClick={() => { setPasso(i); focar(); }} className="shrink-0 text-[14px] text-accent underline-offset-4 hover:underline" aria-label={`Alterar: ${p.titulo}`}>Alterar</button>
              </div>
            ))}
          </dl>
        </div>
      </div>
    );
  }

  const p = perguntas[passo];
  return (
    <div className="mx-auto max-w-[760px]">
      <div className="mb-8 flex items-center gap-4">
        <span className="hud text-accent">{String(passo + 1).padStart(2, "0")} / {String(perguntas.length).padStart(2, "0")}</span>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-line" role="progressbar" aria-label="Progresso do assistente" aria-valuemin={0} aria-valuemax={perguntas.length} aria-valuenow={passo}>
          <div className="h-full origin-left bg-accent transition-transform duration-500" style={{ transform: `scaleX(${passo / perguntas.length})` }} />
        </div>
      </div>
      <fieldset key={p.id} className="ex-fade">
        <legend className="contents">
          <h2 ref={titulo} tabIndex={-1} className="scroll-mt-40 text-[clamp(26px,3vw,40px)] font-extrabold leading-tight tracking-[-0.03em] focus:outline-none">{p.titulo}</h2>
        </legend>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {p.opcoes.map((o, i) => {
            const sel = r[p.id] === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => escolher(p.id, o.id)}
                aria-pressed={sel}
                className={`group flex min-h-[64px] items-center gap-4 rounded-[12px] border px-5 py-4 text-left transition-colors hover:border-accent/60 hover:bg-bg-3 ${sel ? "border-accent bg-bg-3" : "border-line bg-bg-2"}`}
              >
                <span aria-hidden="true" className="hud grid size-7 shrink-0 place-items-center rounded-full border border-line-strong text-ink-mute group-hover:border-accent group-hover:text-accent">{String.fromCharCode(65 + i)}</span>
                <span>
                  <span className="block text-[16px] font-semibold leading-snug">{o.label}</span>
                  {o.hint && <span className="mt-0.5 block text-[14px] text-ink-mute">{o.hint}</span>}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>
      {passo > 0 && (
        <button type="button" onClick={() => { setPasso(passo - 1); focar(); }} className="mt-8 text-[15px] text-ink-soft underline-offset-4 hover:text-accent hover:underline">← Voltar</button>
      )}
    </div>
  );
}

/** Regra da orientação preliminar. // REVISAR COM RESPONSÁVEL TÉCNICO */
function caminho(r: Respostas): "emergencia" | "componente" | "sistema" | "planejamento" {
  if (r.parado === "parado" || r.urgencia === "agora") return "emergencia";
  if (r.parado === "normal" && r.urgencia === "planejamento") return "planejamento";
  if (r.sintoma === "imagem" || r.sintoma === "acessorio") return "componente";
  if (r.parado === "normal") return "planejamento";
  return "sistema";
}
