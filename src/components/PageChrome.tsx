"use client";

import { useEffect, useRef, useState } from "react";

/** Barra de progresso de leitura (páginas longas). */
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement.scrollHeight - innerHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-[72px] z-40 h-0.5 bg-transparent">
      <div ref={ref} className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}

/** Voltar ao topo: aparece depois de ~1,5 tela. */
export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(scrollY > innerHeight * 1.5);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <button
      type="button"
      aria-label="Voltar ao topo"
      onClick={() => {
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        document.getElementById("conteudo")?.focus({ preventScroll: true });
      }}
      className={`fixed bottom-[88px] right-4 z-40 grid size-12 place-items-center rounded-full border border-line-strong bg-bg-2/90 text-accent backdrop-blur transition-opacity md:bottom-6 md:right-6 ${show ? "opacity-100" : "pointer-events-none opacity-0"}`}
      tabIndex={show ? 0 : -1}
    >
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path d="M6 14l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
    </button>
  );
}
