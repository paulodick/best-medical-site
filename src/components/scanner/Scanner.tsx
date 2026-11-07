"use client";

import { useEffect, useRef } from "react";
import { housing, arc, saddle, rungs, labels, type LabelId } from "./geometry";
import { track } from "@/lib/track";

type Props = {
  title: string;
  desc: string;
  names: Record<LabelId, string>;
  readout: { titulo: string; ocioso: string; estatico: string; dica: string };
  corner: string;
  lema: string;
};

const BAND = 220; // largura da faixa revelada atrás da linha
const START_X = 520; // posição inicial (HTML estático, antes da hidratação)

/**
 * Interação-assinatura "Raio-X do seu parque".
 * A linha de varredura segue o cursor (desktop), o dedo (toque) ou, em ocioso, um ciclo lento que no
 * toque soma a rolagem. A máscara revela a camada interna. Com movimento reduzido: interior inteiro, parado.
 * Tudo roda por refs + requestAnimationFrame, sem re-render do React.
 */
export function Scanner({ title, desc, names, readout, corner, lema }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const maskRef = useRef<SVGRectElement>(null);
  const scanRef = useRef<SVGLineElement>(null);
  const nameRef = useRef<HTMLElement>(null);
  const posRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const host = hostRef.current!;
    const svg = svgRef.current!;
    const mask = maskRef.current!;
    const scan = scanRef.current!;
    const labelEls = [...svg.querySelectorAll<SVGGElement>(".eq-label")];

    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const setStatic = () => {
      host.dataset.scanner = "static";
      mask.setAttribute("x", "-60");
      mask.setAttribute("width", "960");
      mask.setAttribute("fill", "#fff");
      if (nameRef.current) nameRef.current.textContent = readout.estatico;
      if (posRef.current) posRef.current.textContent = "";
    };
    if (reduce.matches) {
      setStatic();
      return;
    }

    const area = (host.closest("[data-scan-area]") as HTMLElement | null) ?? host;
    const coarse = matchMedia("(pointer: coarse)").matches;
    let tx = START_X, ty = 290, x = START_X, y = 290;
    let user = false, lastUser = 0, sent = false, raf = 0, visible = true;
    let lastHot: Element | null = null;
    let lastName = "";

    const toSvg = (cx: number, cy: number) => {
      const m = svg.getScreenCTM();
      if (!m) return [tx, ty];
      const pt = new DOMPoint(cx, cy).matrixTransform(m.inverse());
      return [pt.x, pt.y];
    };
    const onMove = (e: PointerEvent) => {
      [tx, ty] = toSvg(e.clientX, e.clientY);
      user = true;
      lastUser = performance.now();
      if (!sent) {
        sent = true;
        track("scanner_interact", { input: e.pointerType });
      }
    };

    const tick = (now: number) => {
      if (!user || now - lastUser > 2600) {
        user = false;
        const phase = now / 3600 + (coarse ? window.scrollY * 0.008 : 0) + 0.4;
        tx = 400 + 300 * Math.sin(phase);
        ty = 290 + 90 * Math.sin(phase * 1.7);
      }
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      mask.setAttribute("x", String(x - BAND));
      scan.setAttribute("x1", String(x));
      scan.setAttribute("x2", String(x));

      let best: SVGGElement | null = null, bd = 1e9;
      for (const l of labelEls) {
        const d = Math.hypot(+l.dataset.x! - x, (+l.dataset.y! - y) * 0.6);
        if (d < bd) { bd = d; best = l; }
      }
      const hot = bd < 140 ? best : null;
      if (hot !== lastHot) {
        lastHot?.classList.remove("is-hot");
        hot?.classList.add("is-hot");
        lastHot = hot;
      }
      const name = hot ? names[hot.dataset.id as LabelId] : readout.ocioso;
      if (name !== lastName && nameRef.current) { nameRef.current.textContent = name; lastName = name; }
      if (posRef.current) posRef.current.textContent = `x ${String(Math.round(x)).padStart(3, "0")} · y ${String(Math.round(y)).padStart(3, "0")}`;
      if (visible) raf = requestAnimationFrame(tick);
    };

    // pausa fora da tela (economia de CPU e INP)
    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was) raf = requestAnimationFrame(tick);
    });
    io.observe(host);

    area.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerdown", onMove, { passive: true });
    const onReduce = () => { if (reduce.matches) { cancelAnimationFrame(raf); visible = false; setStatic(); } };
    reduce.addEventListener("change", onReduce);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      area.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onMove);
      reduce.removeEventListener("change", onReduce);
    };
  }, [names, readout]);

  const shell = (
    <g>
      <ellipse className="eq-shadow" cx="400" cy="628" rx="250" ry="16" />
      <path className="eq-housing" fillRule="evenodd" d={housing} />
      <circle className="eq-line" cx="400" cy="290" r="214" />
      <circle className="eq-lip" cx="400" cy="290" r="136" />
      <rect className="eq-led" x="360" y="72" width="80" height="9" rx="4.5" />
      <g className="eq-bolt">
        <circle cx="222" cy="122" r="5" /><circle cx="578" cy="122" r="5" />
        <circle cx="222" cy="458" r="5" /><circle cx="578" cy="458" r="5" />
      </g>
      <rect className="eq-line" x="172" y="268" width="9" height="44" rx="4.5" />
      <rect className="eq-line" x="619" y="268" width="9" height="44" rx="4.5" />
      <path className="eq-table" d="M336 372 H464 L548 540 H252 Z" />
      <path className="eq-ecg" d="M318 450 H372 l6 -10 l6 18 l7 -34 l7 40 l6 -14 H480" />
      <rect className="eq-housing" x="244" y="540" width="312" height="30" rx="8" />
      <rect className="eq-led" x="330" y="551" width="140" height="7" rx="3.5" />
      <rect className="eq-base" x="290" y="570" width="220" height="52" rx="6" />
    </g>
  );

  const core = (
    <g mask="url(#eqMask)">
      <path className="eq-core-bg" fillRule="evenodd" d={housing} />
      <path className="eq-core-bg" d="M336 372 H464 L548 540 H252 Z M244 540 h312 v30 h-312 Z M290 570 h220 v52 h-220 Z" />
      <g clipPath="url(#eqHousingClip)"><rect x="0" y="0" width="800" height="660" fill="url(#eqGrid)" /></g>
      <g className="eq-ring">
        <circle cx="400" cy="290" r="226" /><circle cx="400" cy="290" r="144" />
        <path className="eq-dash" d={arc(235, -170, -10)} />
      </g>
      <g className="eq-ring eq-mag">
        <circle cx="400" cy="290" r="208" /><circle cx="400" cy="290" r="195" /><circle cx="400" cy="290" r="182" />
      </g>
      <g className="eq-ring eq-grad">
        {[-90, 0, 90, 180].map((d) => <path key={d} d={saddle(d)} />)}
        {[-45, 45, 135, 225].map((d) => <path key={d} className="eq-faint" d={saddle(d)} />)}
        <circle className="eq-faint" cx="400" cy="290" r="159" />
      </g>
      <g className="eq-ring eq-rf">
        {rungs.map(([[x1, y1], [x2, y2]], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />)}
        <circle cx="400" cy="290" r="131" /><circle cx="400" cy="290" r="141" />
      </g>
      <g className="eq-cold">
        <rect x="378" y="4" width="44" height="40" rx="6" />
        <path d="M392 44 V66 M408 44 V66 M370 14 H340 V0" />
      </g>
      <g className="eq-rail">
        <path d="M300 410 L270 536 M500 410 L530 536 M330 470 H470" />
        <rect x="346" y="584" width="108" height="26" rx="4" />
      </g>
      <g>
        {labels.map(({ id, p: [px, py], l: [lx, ly], anchor }) => {
          const elbow = anchor === "end" ? lx + 14 : lx - 14;
          return (
            <g key={id} className="eq-label" data-id={id} data-x={px} data-y={py}>
              <polyline points={`${px},${py} ${elbow},${ly} ${lx},${ly}`} />
              <circle cx={px} cy={py} r="4" />
              <text x={anchor === "end" ? lx - 6 : lx + 6} y={ly + 4} textAnchor={anchor}>
                {names[id].toUpperCase()}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );

  return (
    <div className="relative">
      <span className="hud pointer-events-none absolute left-[4%] top-0 hidden text-ink-mute lg:block">{corner}</span>
      <div ref={hostRef} className="relative touch-pan-y select-none" data-scanner="live">
        <svg ref={svgRef} className="eq-svg" viewBox="-50 -10 900 660" role="img" aria-labelledby="eqT eqD">
          <title id="eqT">{title}</title>
          <desc id="eqD">{desc}</desc>
          <defs>
            <pattern id="eqGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" className="eq-gridline" />
            </pattern>
            <clipPath id="eqHousingClip"><path fillRule="evenodd" d={housing} /></clipPath>
            <linearGradient id="eqBandGrad" x1="0" x2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset=".55" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" />
            </linearGradient>
            <mask id="eqMask" maskUnits="userSpaceOnUse" x="-60" y="-20" width="960" height="700">
              <rect ref={maskRef} x={START_X - BAND} y="-20" width={BAND} height="700" fill="url(#eqBandGrad)" />
            </mask>
          </defs>
          {shell}
          {core}
          <line ref={scanRef} className="eq-scan" x1={START_X} y1="-10" x2={START_X} y2="650" />
        </svg>
      </div>
      <div
        className="mt-2 hidden min-w-[230px] gap-1 rounded-[10px] border border-line bg-bg-2/75 px-3.5 py-3 backdrop-blur-md lg:absolute lg:bottom-[-2%] lg:left-0 lg:mt-0 lg:grid"
        aria-hidden="true"
      >
        <small className="hud text-ink-mute">{readout.titulo}</small>
        <b ref={nameRef} className="font-mono text-[13px] font-semibold tracking-[0.06em] text-accent">{readout.dica}</b>
        <small ref={posRef} className="hud text-ink-mute">x 000 · y 000</small>
        <small className="hud mt-1 border-t border-line pt-2 text-ink-mute">{lema}</small>
      </div>
    </div>
  );
}
