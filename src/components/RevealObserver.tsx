"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Um observador para todos os .reveal e para as linhas do tempo [data-progress]. */
export function RevealObserver() {
  const path = usePathname();
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>(".reveal:not(.is-in), [data-progress]")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add("is-in");
          if (el.hasAttribute("data-progress")) el.style.setProperty("--p", "1");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);
  return null;
}
