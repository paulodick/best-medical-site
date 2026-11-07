import type { ModalidadeId } from "@/content/types";

/** Vistas explodidas próprias (sem marca de fabricante). viewBox 600x500; hotspots em % batem com o desenho. */
export function Diagram({ id }: { id: ModalidadeId }) {
  return (
    <svg viewBox="0 0 600 500" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <pattern id={`dg-${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="rgb(144 222 246 / .06)" />
        </pattern>
      </defs>
      <rect width="600" height="500" fill={`url(#dg-${id})`} />
      <g className="dg">{SHAPES[id]}</g>
    </svg>
  );
}

const rungs = (cx: number, cy: number, rx: number, ry: number, n = 16) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
    return <line key={i} x1={x.toFixed(1)} y1={(y - 18).toFixed(1)} x2={x.toFixed(1)} y2={(y + 18).toFixed(1)} className="dg-acc" />;
  });

const SHAPES: Record<ModalidadeId, React.ReactNode> = {
  rm: (
    <>
      <line x1="40" y1="250" x2="570" y2="250" className="dg-axis" />
      {/* magneto / criostato */}
      <ellipse cx="132" cy="250" rx="62" ry="196" className="dg-body" />
      <ellipse cx="132" cy="250" rx="40" ry="150" className="dg-line" />
      <ellipse cx="132" cy="250" rx="30" ry="118" className="dg-coil" />
      {/* bobina RF (gaiola) */}
      <ellipse cx="300" cy="250" rx="34" ry="112" className="dg-line" />
      {rungs(300, 250, 34, 112)}
      {/* gradientes */}
      <ellipse cx="456" cy="250" rx="46" ry="150" className="dg-line" />
      <path d="M430 150 q26 -20 52 0 v60 q-26 20 -52 0 Z M430 290 q26 -20 52 0 v60 q-26 20 -52 0 Z" className="dg-grad" />
      {/* cabeçote frio */}
      <rect x="276" y="12" width="48" height="36" rx="6" className="dg-body" />
      <path d="M300 48 V70 H150 V60" className="dg-dash" />
      {/* mesa */}
      <path d="M90 420 H560 L540 446 H110 Z" className="dg-body" />
      <line x1="140" y1="433" x2="510" y2="433" className="dg-acc" />
    </>
  ),
  tc: (
    <>
      <circle cx="300" cy="250" r="190" className="dg-body" />
      <circle cx="300" cy="250" r="160" className="dg-line" />
      <circle cx="300" cy="250" r="96" className="dg-bore" />
      {/* tubo */}
      <rect x="262" y="48" width="76" height="44" rx="10" className="dg-body" />
      <path d="M300 92 L250 170 M300 92 L350 170" className="dg-beam" />
      {/* detector (arco) */}
      <path d="M215 395 A170 170 0 0 0 385 395" className="dg-det" />
      {/* gerador */}
      <rect x="66" y="140" width="72" height="62" rx="8" className="dg-body" />
      <path d="M138 171 H150" className="dg-dash" />
      {/* mesa */}
      <rect x="150" y="290" width="400" height="22" rx="6" className="dg-body" />
    </>
  ),
  hemo: (
    <>
      {/* arco em C */}
      <path d="M372 58 A192 192 0 0 0 372 442" className="dg-arc" />
      <path d="M180 250 H90 V470 H190" className="dg-line" />
      {/* detector */}
      <rect x="318" y="34" width="108" height="34" rx="6" className="dg-body" />
      {/* tubo */}
      <rect x="336" y="410" width="72" height="44" rx="8" className="dg-body" />
      <path d="M372 410 L340 72 M372 410 L404 72" className="dg-beam" />
      {/* mesa */}
      <rect x="290" y="288" width="290" height="18" rx="5" className="dg-body" />
      <path d="M520 306 V470" className="dg-line" />
    </>
  ),
  mamorx: (
    <>
      <rect x="270" y="30" width="60" height="440" rx="10" className="dg-line" />
      <rect x="230" y="40" width="140" height="44" rx="10" className="dg-body" />
      <path d="M300 84 L250 360 M300 84 L350 360" className="dg-beam" />
      <rect x="220" y="240" width="160" height="14" rx="4" className="dg-acc-fill" />
      <rect x="210" y="372" width="180" height="40" rx="6" className="dg-body" />
    </>
  ),
};
