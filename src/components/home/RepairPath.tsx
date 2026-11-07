"use client";

import { useEffect, useRef } from "react";

type Passo = { n: string; hud: string; titulo: string; texto: string };
type Props = {
  id: string;
  eyebrow: string;
  titulo: string;
  passos: Passo[];
  fecho: string;
  economia: { valor: string; rotulo: string; detalhe?: string } | null;
  labels: { diagnostico: string; decisao: string; reparo: string; troca: string; operacao: string };
};

/**
 * PICO da página. Cena fixa (~4 telas): o caminho de decisão se desenha com a rolagem.
 * Atualiza só atributos/classes via refs (sem re-render). Movimento reduzido: tudo visível, sem cena fixa.
 */
export function RepairPath({ id, eyebrow, titulo, passos, fecho, economia, labels }: Props) {
  const secRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = secRef.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sec.dataset.mode = "static";
      return;
    }
    sec.dataset.mode = "scroll";
    const main = sec.querySelector<SVGPathElement>("[data-path=main]")!;
    const alt = sec.querySelector<SVGPathElement>("[data-path=alt]")!;
    const nodes = [...sec.querySelectorAll<SVGGElement>("[data-node]")];
    const steps = [...sec.querySelectorAll<HTMLElement>("[data-step]")];
    const fechoEl = sec.querySelector<HTMLElement>("[data-fecho]")!;
    const bar = sec.querySelector<HTMLElement>("[data-bar]")!;
    let raf = 0;

    const render = () => {
      raf = 0;
      const r = sec.getBoundingClientRect();
      const span = r.height - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / (span || 1)));
      const pm = Math.min(1, p / 0.72);
      const pa = Math.min(1, Math.max(0, (p - 0.5) / 0.3));
      main.style.strokeDashoffset = String(1 - pm);
      alt.style.strokeDashoffset = String(1 - pa);
      nodes.forEach((n) => n.classList.toggle("is-on", p >= Number(n.dataset.at)));
      const active = p < 0.3 ? 0 : p < 0.6 ? 1 : 2;
      steps.forEach((s, i) => s.classList.toggle("is-active", i === active));
      fechoEl.classList.toggle("is-on", p > 0.86);
      sec.classList.toggle("is-final", p > 0.86);
      bar.style.transform = `scaleY(${p})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(render); };
    render();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const node = (x: number, y: number, label: string, at: number, kind: "main" | "alt" | "end" = "main") => (
    <g data-node data-at={at} className={`rp-node rp-n-${kind}`} transform={`translate(${x} ${y})`}>
      <rect x="-78" y="-22" width="156" height="44" rx="10" />
      <text y="5" textAnchor="middle">{label}</text>
    </g>
  );

  return (
    <section ref={secRef} id={id} data-mode="static" aria-labelledby={`${id}-t`} className="rp relative scroll-mt-0 border-t border-line">
      <div className="rp-stage">
        <div className="wrap grid h-full items-center gap-6 py-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <p className="hud mb-4 text-accent">{eyebrow}</p>
            <h2 id={`${id}-t`} className="max-w-[16ch] text-[clamp(28px,3.6vw,56px)] font-extrabold leading-[1.04] tracking-[-0.03em]">
              {titulo}
            </h2>
            <div data-steps className="relative mt-6 pl-6 md:mt-10">
              <span aria-hidden="true" className="absolute left-0 top-1 h-[calc(100%-8px)] w-px bg-line">
                <span data-bar className="block h-full w-px origin-top bg-accent" style={{ transform: "scaleY(0)" }} />
              </span>
              <ol className="grid gap-5 md:gap-7">
                {passos.map((p) => (
                  <li key={p.n} data-step className="rp-step">
                    <p className="hud text-ink-mute"><span className="text-accent">{p.n}</span> · {p.hud}</p>
                    <h3 className="mt-1 text-[19px] font-bold leading-snug md:text-[22px]">{p.titulo}</h3>
                    <p className="rp-step-text mt-2 max-w-[52ch] text-[15px] leading-relaxed text-ink-soft md:text-[17px]"><span>{p.texto}</span></p>
                  </li>
                ))}
              </ol>
            </div>
              <div data-fecho className="rp-fecho mt-8 md:mt-10">
                <p className="max-w-[28ch] text-[clamp(22px,2.4vw,34px)] font-extrabold leading-tight tracking-[-0.02em] text-accent">{fecho}</p>
                {economia && (
                  <p className="mt-2 text-[14px] text-ink-mute">
                    {economia.valor} {economia.rotulo}{economia.detalhe ? `, ${economia.detalhe}` : ""}.
                  </p>
                )}
              </div>
          </div>

          <div className="order-1 lg:order-2">
            <svg viewBox="0 0 600 560" className="rp-svg mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${labels.diagnostico}, ${labels.decisao}, ${labels.reparo}, ${labels.troca}, ${labels.operacao}`}>
              <defs>
                <pattern id="rpGrid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="rgb(144 222 246 / .06)" /></pattern>
              </defs>
              <rect width="600" height="560" fill="url(#rpGrid)" />
              {/* trilhos apagados */}
              <path className="rp-track" d="M300 70 V190 M300 250 C300 320 470 300 470 370 V380 M470 420 C470 480 300 460 300 500 M300 250 C300 320 130 300 130 370 V380 M130 420 C130 480 300 460 300 500" />
              {/* caminho principal: diagnóstico → decisão → reparo → operação */}
              <path data-path="main" pathLength={1} className="rp-main" d="M300 70 V190 M300 250 C300 320 470 300 470 370 V380 M470 420 C470 480 300 460 300 500" />
              {/* desvio: troca, só quando necessária */}
              <path data-path="alt" pathLength={1} className="rp-alt" d="M300 250 C300 320 130 300 130 370 V380 M130 420 C130 480 300 460 300 500" />
              {node(300, 48, labels.diagnostico, 0)}
              <g data-node data-at={0.2} className="rp-node rp-n-main" transform="translate(300 220)">
                <path d="M0 -32 L120 0 L0 32 L-120 0 Z" />
                <text y="5" textAnchor="middle">{labels.decisao}</text>
              </g>
              {node(470, 400, labels.reparo, 0.45)}
              {node(130, 400, labels.troca, 0.72, "alt")}
              {node(300, 522, labels.operacao, 0.8, "end")}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
