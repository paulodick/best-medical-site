/* Conduz a interação-assinatura: cursor (desktop), dedo (toque) ou rolagem/ciclo
 * lento (fallback). Com movimento reduzido, mostra o interior inteiro e para. */
(function () {
  window.dataLayer = window.dataLayer || [];

  // cabeçalho sólido ao rolar (comum aos estudos)
  const hdr = document.querySelector(".hdr");
  const onScroll = () => hdr && hdr.classList.toggle("is-solid", scrollY > 24);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  window.driveEquip = function (host, refs, api) {
    if (window.eqReduced()) { api.full(); host.dataset.state = "static"; return; }
    const svg = refs.svg;
    const pt = svg.createSVGPoint();
    let tx = 400, ty = 290, x = 400, y = 290;
    let user = false, lastUser = 0, sent = false;
    const coarse = matchMedia("(pointer: coarse)").matches;

    const toSvg = (cx, cy) => {
      pt.x = cx; pt.y = cy;
      const p = pt.matrixTransform(svg.getScreenCTM().inverse());
      return [p.x, p.y];
    };
    const move = (e) => {
      [tx, ty] = toSvg(e.clientX, e.clientY);
      user = true; lastUser = performance.now();
      if (!sent) { sent = true; dataLayer.push({ event: "scanner_interact", input: e.pointerType }); }
    };
    // desktop: o cursor em qualquer ponto do hero conduz a varredura
    (host.closest("[data-scan-area]") || host).addEventListener("pointermove", move);
    host.addEventListener("pointerdown", move);

    const tick = (now) => {
      if (!user || now - lastUser > 2600) {
        user = false;
        const phase = now / 3600 + (coarse ? scrollY * 0.008 : 0);
        tx = 400 + 300 * Math.sin(phase);
        ty = 290 + 90 * Math.sin(phase * 1.7);
      }
      x += (tx - x) * 0.12; y += (ty - y) * 0.12;
      api.apply(x, y, user);
      let best = null, bd = 1e9;
      for (const l of refs.labels) {
        const d = Math.hypot(+l.dataset.x - x, (+l.dataset.y - y) * 0.6);
        if (d < bd) { bd = d; best = l; }
      }
      refs.labels.forEach((l) => l.classList.toggle("is-hot", l === best && bd < 140));
      if (api.readout) api.readout(x, y, bd < 140 ? best : null);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
})();
