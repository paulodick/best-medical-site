/* Ilustração própria de um equipamento de RM estilizado, sem marca de fabricante.
 * Duas camadas: .eq-shell (carcaça) e .eq-core (interior: magneto, gradientes,
 * bobina RF, criogenia, mesa). Cores vêm de variáveis CSS de cada estudo.
 * mode: "band" (faixa de varredura), "lens" (lente circular), "explode" (vista explodida)
 */
(function () {
  const C = { x: 400, y: 290 };
  const housing =
    "M340 40 H460 A200 200 0 0 1 660 240 V340 A200 200 0 0 1 460 540 H340 A200 200 0 0 1 140 340 V240 A200 200 0 0 1 340 40 Z " +
    `M${C.x - 128} ${C.y} a128 128 0 1 0 256 0 a128 128 0 1 0 -256 0 Z`;

  const pol = (r, deg) => {
    const a = (deg * Math.PI) / 180;
    return [C.x + r * Math.cos(a), C.y + r * Math.sin(a)];
  };
  const arc = (r, a0, a1) => {
    const [x0, y0] = pol(r, a0), [x1, y1] = pol(r, a1);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  };
  const saddle = (deg) => {
    const [ax, ay] = pol(168, deg - 32), [bx, by] = pol(168, deg + 32);
    const [cx, cy] = pol(150, deg + 32), [dx, dy] = pol(150, deg - 32);
    return `M${ax.toFixed(1)} ${ay.toFixed(1)} A168 168 0 0 1 ${bx.toFixed(1)} ${by.toFixed(1)} L${cx.toFixed(1)} ${cy.toFixed(1)} A150 150 0 0 0 ${dx.toFixed(1)} ${dy.toFixed(1)} Z`;
  };

  let rungs = "";
  for (let i = 0; i < 24; i++) {
    const [x0, y0] = pol(131, i * 15), [x1, y1] = pol(141, i * 15);
    rungs += `<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}"/>`;
  }
  let saddles = "";
  for (const d of [-90, 0, 90, 180]) saddles += `<path d="${saddle(d)}"/>`;
  for (const d of [-45, 45, 135, 225]) saddles += `<path class="eq-faint" d="${saddle(d)}" transform="scale(1) "/>`;

  // rótulos: [id, texto, ponto, rótulo, âncora]
  const labels = [
    ["rf", "BOBINA DE CORPO · RF", pol(136, -140), [126, 96], "end"],
    ["grad", "GRADIENTES X · Y · Z", pol(160, -40), [674, 96], "start"],
    ["mag", "MAGNETO PRINCIPAL", pol(198, 165), [126, 404], "end"],
    ["cryo", "SISTEMA CRIOGÊNICO", [424, 30], [674, 30], "start"],
    ["mesa", "MESA E ACIONAMENTO", [520, 512], [674, 560], "start"]
  ];
  const labelSvg = labels
    .map(([id, t, [px, py], [lx, ly], anc]) => {
      const elbow = anc === "end" ? lx + 14 : lx - 14;
      return `<g class="eq-label" data-id="${id}" data-x="${px.toFixed(0)}" data-y="${py.toFixed(0)}">
        <polyline points="${px.toFixed(1)},${py.toFixed(1)} ${elbow},${ly} ${lx},${ly}"/>
        <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4"/>
        <text x="${anc === "end" ? lx - 6 : lx + 6}" y="${ly + 4}" text-anchor="${anc}">${t}</text></g>`;
    })
    .join("");

  const shellParts = `
    <ellipse class="eq-shadow" cx="400" cy="628" rx="250" ry="16"/>
    <path class="eq-housing" fill-rule="evenodd" d="${housing}"/>
    <circle class="eq-line" cx="400" cy="290" r="214"/>
    <circle class="eq-lip" cx="400" cy="290" r="136"/>
    <rect class="eq-led" x="360" y="72" width="80" height="9" rx="4.5"/>
    <g class="eq-bolt"><circle cx="222" cy="122" r="5"/><circle cx="578" cy="122" r="5"/><circle cx="222" cy="458" r="5"/><circle cx="578" cy="458" r="5"/></g>
    <rect class="eq-line" x="172" y="268" width="9" height="44" rx="4.5"/><rect class="eq-line" x="619" y="268" width="9" height="44" rx="4.5"/>
    <path class="eq-table" d="M336 372 H464 L548 540 H252 Z"/>
    <path class="eq-ecg" d="M318 450 H372 l6 -10 l6 18 l7 -34 l7 40 l6 -14 H480"/>
    <rect class="eq-housing" x="244" y="540" width="312" height="30" rx="8"/>
    <rect class="eq-led" x="330" y="551" width="140" height="7" rx="3.5"/>
    <rect class="eq-base" x="290" y="570" width="220" height="52" rx="6"/>`;

  const coreParts = `
    <path class="eq-core-bg" fill-rule="evenodd" d="${housing}"/>
    <path class="eq-core-bg" d="M336 372 H464 L548 540 H252 Z M244 540 h312 v30 h-312 Z M290 570 h220 v52 h-220 Z"/>
    <g clip-path="url(#eqHousingClip)"><rect width="800" height="660" fill="url(#eqGrid)"/></g>
    <g class="eq-ring eq-cryo" data-layer="0">
      <circle cx="400" cy="290" r="226"/><circle cx="400" cy="290" r="144"/>
      <path class="eq-dash" d="${arc(235, -170, -10)}"/>
    </g>
    <g class="eq-ring eq-mag" data-layer="1">
      <circle cx="400" cy="290" r="208"/><circle cx="400" cy="290" r="195"/><circle cx="400" cy="290" r="182"/>
    </g>
    <g class="eq-ring eq-grad" data-layer="2">${saddles}<circle class="eq-faint" cx="400" cy="290" r="159"/></g>
    <g class="eq-ring eq-rf" data-layer="3">${rungs}<circle cx="400" cy="290" r="131"/><circle cx="400" cy="290" r="141"/></g>
    <g class="eq-cold">
      <rect x="378" y="4" width="44" height="40" rx="6"/><path d="M392 44 V66 M408 44 V66 M370 14 H340 V0"/>
    </g>
    <g class="eq-rail"><path d="M300 410 L270 536 M500 410 L530 536 M330 470 H470"/><rect x="346" y="584" width="108" height="26" rx="4"/></g>
    <g class="eq-labels">${labelSvg}</g>`;

  window.buildEquip = function (el, mode) {
    const defs = `<defs>
      <pattern id="eqGrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" class="eq-gridline"/></pattern>
      <clipPath id="eqHousingClip"><path fill-rule="evenodd" d="${housing}"/></clipPath>
      <linearGradient id="eqBandGrad" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="#fff"/><stop offset="1" stop-color="#fff"/></linearGradient>
      <radialGradient id="eqLensGrad"><stop offset=".72" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <mask id="eqMask" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="660">
        ${mode === "band" ? '<rect id="eqMaskShape" x="-220" y="0" width="220" height="660" fill="url(#eqBandGrad)"/>' : ""}
        ${mode === "lens" ? '<circle id="eqMaskShape" cx="-300" cy="290" r="150" fill="url(#eqLensGrad)"/>' : ""}
      </mask>
      <clipPath id="eqLeftHalf"><rect x="-200" y="-50" width="600" height="760"/></clipPath>
      <clipPath id="eqRightHalf"><rect x="400" y="-50" width="600" height="760"/></clipPath>
    </defs>`;
    const shell =
      mode === "explode"
        ? `<g class="eq-shell eq-half" id="eqShellL" clip-path="url(#eqLeftHalf)">${shellParts}</g><g class="eq-shell eq-half" id="eqShellR" clip-path="url(#eqRightHalf)">${shellParts}</g>`
        : `<g class="eq-shell">${shellParts}</g>`;
    const core = `<g class="eq-core" id="eqCore" ${mode === "explode" ? "" : 'mask="url(#eqMask)"'}>${coreParts}</g>`;
    const order = mode === "explode" ? core + shell : shell + core;
    el.innerHTML = `<svg class="eq-svg" viewBox="-50 -10 900 660" role="img" aria-labelledby="eqT eqD">
      <title id="eqT">Equipamento de ressonância magnética em corte</title>
      <desc id="eqD">Ilustração da Best Medical: a carcaça externa e, por dentro, magneto principal, bobinas de gradiente, bobina de corpo de radiofrequência, sistema criogênico e mesa, que são os componentes que avaliamos antes de indicar uma troca.</desc>
      ${defs}${order}
      <line id="eqScan" class="eq-scan" x1="-10" y1="-10" x2="-10" y2="650"/>
    </svg>`;
    return {
      svg: el.querySelector("svg"),
      mask: el.querySelector("#eqMaskShape"),
      scan: el.querySelector("#eqScan"),
      labels: [...el.querySelectorAll(".eq-label")],
      core: el.querySelector("#eqCore"),
      rings: [...el.querySelectorAll(".eq-ring")],
      shellL: el.querySelector("#eqShellL"),
      shellR: el.querySelector("#eqShellR")
    };
  };

  window.eqReduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
})();
