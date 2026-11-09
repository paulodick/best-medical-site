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

const SHAPES: Record<ModalidadeId, React.ReactNode> = {
  /* RM em corte lateral: criostato com o magneto, gradientes, bobina de corpo e o túnel; cabeçote frio ligado ao compressor */
  rm: (
    <>
      <line x1="40" y1="250" x2="580" y2="250" className="dg-axis" />
      {/* carcaça */}
      <rect x="86" y="74" width="348" height="352" rx="44" className="dg-line" />
      {/* criostato e magneto (bobinas supercondutoras) */}
      <rect x="104" y="96" width="312" height="80" rx="14" className="dg-body" />
      <rect x="104" y="324" width="312" height="80" rx="14" className="dg-body" />
      {[134, 196, 258, 320, 370].map((x) => (
        <g key={x}>
          <rect x={x} y="112" width="30" height="40" rx="4" className="dg-coil-box" />
          <rect x={x} y="348" width="30" height="40" rx="4" className="dg-coil-box" />
        </g>
      ))}
      {/* gradientes */}
      <rect x="112" y="180" width="296" height="16" rx="4" className="dg-grad" />
      <rect x="112" y="304" width="296" height="16" rx="4" className="dg-grad" />
      {/* bobina de corpo de RF */}
      <line x1="118" y1="203" x2="402" y2="203" className="dg-acc" />
      <line x1="118" y1="297" x2="402" y2="297" className="dg-acc" />
      {/* túnel */}
      <rect x="86" y="208" width="348" height="84" className="dg-bore" />
      {/* cabeçote frio e linhas de hélio até o compressor */}
      <rect x="244" y="30" width="44" height="66" rx="6" className="dg-body" />
      <path d="M288 46 H500 V60 M288 58 H488 V60" className="dg-dash" />
      <rect x="470" y="60" width="96" height="70" rx="8" className="dg-body" />
      <path d="M486 80 H550 M486 94 H550 M486 108 H550" className="dg-line" />
      {/* mesa e bobina de recepção sobre o paciente */}
      <rect x="140" y="262" width="436" height="14" rx="5" className="dg-body" />
      <path d="M196 262 C196 230 266 230 266 262" className="dg-acc" />
      <path d="M470 276 V440 M440 440 H540" className="dg-line" />
      <rect x="486" y="296" width="70" height="120" rx="8" className="dg-body" />
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
  /* Mamógrafo de lado: coluna, braço em C, cabeçote do tubo, protetor facial, bandeja de compressão e detector/porta-cassetes */
  mamo: (
    <>
      <path d="M330 486 H560" className="dg-line" />
      {/* coluna */}
      <rect x="430" y="24" width="64" height="456" rx="10" className="dg-body" />
      {/* braço em C com eixo de rotação */}
      <rect x="352" y="70" width="34" height="320" rx="10" className="dg-body" />
      <path d="M386 230 H430" className="dg-line" />
      <circle cx="408" cy="230" r="18" className="dg-acc-fill" />
      {/* cabeçote do tubo e colimador */}
      <rect x="150" y="44" width="236" height="76" rx="18" className="dg-body" />
      <circle cx="252" cy="82" r="14" className="dg-line" />
      <path d="M228 120 H276 L268 140 H236 Z" className="dg-body" />
      {/* protetor facial */}
      <rect x="132" y="128" width="10" height="112" rx="3" className="dg-acc-fill" />
      {/* feixe: borda do tórax reta, do lado da paciente */}
      <path d="M252 140 L160 336 M252 140 L330 336" className="dg-beam" />
      {/* bandeja de compressão e seu carro */}
      <path d="M150 238 V262 H340" className="dg-acc" />
      <rect x="150" y="256" width="194" height="10" rx="3" className="dg-acc-fill" />
      <rect x="340" y="236" width="14" height="40" rx="3" className="dg-body" />
      {/* mama (contorno) */}
      <path d="M150 266 C210 268 268 290 276 334" className="dg-dash" />
      {/* suporte da mama: detector ou porta-cassetes com grade */}
      <rect x="150" y="334" width="204" height="44" rx="6" className="dg-body" />
      <line x1="164" y1="356" x2="338" y2="356" className="dg-det-thin" />
      {/* pedais */}
      <rect x="250" y="466" width="60" height="16" rx="4" className="dg-body" />
    </>
  ),
  /* Sala de raios X: estativa porta-tubo, tubo e colimador, mesa com bucky, estativa e bucky mural, gerador */
  rx: (
    <>
      <path d="M20 478 H580" className="dg-line" />
      {/* estativa mural + bucky mural */}
      <rect x="30" y="64" width="26" height="414" rx="6" className="dg-body" />
      <rect x="56" y="168" width="52" height="170" rx="8" className="dg-body" />
      <line x1="84" y1="184" x2="84" y2="322" className="dg-det-thin" />
      {/* trilho de piso e estativa porta-tubo */}
      <rect x="300" y="468" width="240" height="10" rx="3" className="dg-line" />
      <rect x="432" y="40" width="24" height="430" rx="6" className="dg-body" />
      <rect x="334" y="140" width="100" height="16" rx="4" className="dg-body" />
      {/* tubo e colimador */}
      <rect x="270" y="112" width="104" height="48" rx="22" className="dg-body" />
      <path d="M302 160 H342 V196 H302 Z" className="dg-body" />
      <rect x="312" y="196" width="20" height="6" className="dg-acc-fill" />
      <path d="M322 202 L262 300 M322 202 L382 300" className="dg-beam" />
      {/* mesa e bucky de mesa */}
      <rect x="140" y="292" width="300" height="14" rx="5" className="dg-body" />
      <rect x="250" y="310" width="144" height="28" rx="6" className="dg-body" />
      <line x1="264" y1="324" x2="380" y2="324" className="dg-det-thin" />
      <path d="M210 306 V478 M190 478 H230" className="dg-line" />
      {/* gerador e cabos de alta tensão */}
      <rect x="490" y="300" width="80" height="168" rx="8" className="dg-body" />
      <path d="M506 330 H554 M506 346 H554" className="dg-line" />
      <path d="M520 300 C520 210 400 130 372 128" className="dg-dash" />
    </>
  ),
};
