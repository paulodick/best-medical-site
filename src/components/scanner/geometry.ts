/** Geometria da ilustração própria de RM (sem marca de fabricante). viewBox -50 -10 900 660. */
export const C = { x: 400, y: 290 };

export const housing =
  "M340 40 H460 A200 200 0 0 1 660 240 V340 A200 200 0 0 1 460 540 H340 A200 200 0 0 1 140 340 V240 A200 200 0 0 1 340 40 Z " +
  `M${C.x - 128} ${C.y} a128 128 0 1 0 256 0 a128 128 0 1 0 -256 0 Z`;

export const pol = (r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [+(C.x + r * Math.cos(a)).toFixed(1), +(C.y + r * Math.sin(a)).toFixed(1)];
};

export const arc = (r: number, a0: number, a1: number) => {
  const [x0, y0] = pol(r, a0);
  const [x1, y1] = pol(r, a1);
  return `M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`;
};

export const saddle = (deg: number) => {
  const [ax, ay] = pol(168, deg - 32);
  const [bx, by] = pol(168, deg + 32);
  const [cx, cy] = pol(150, deg + 32);
  const [dx, dy] = pol(150, deg - 32);
  return `M${ax} ${ay} A168 168 0 0 1 ${bx} ${by} L${cx} ${cy} A150 150 0 0 0 ${dx} ${dy} Z`;
};

export const rungs = Array.from({ length: 24 }, (_, i) => [pol(131, i * 15), pol(141, i * 15)] as const);

export type LabelId = "rf" | "grad" | "mag" | "cryo" | "mesa";

/** [id, ponto no componente, posição do rótulo, âncora] */
export const labels: { id: LabelId; p: [number, number]; l: [number, number]; anchor: "start" | "end" }[] = [
  { id: "rf", p: pol(136, -140), l: [126, 96], anchor: "end" },
  { id: "grad", p: pol(160, -40), l: [674, 96], anchor: "start" },
  { id: "mag", p: pol(198, 165), l: [126, 404], anchor: "end" },
  { id: "cryo", p: [424, 30], l: [674, 30], anchor: "start" },
  { id: "mesa", p: [520, 512], l: [674, 560], anchor: "start" },
];
