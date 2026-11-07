"use client";

import Link from "next/link";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { track } from "@/lib/track";

const SearchDialog = lazy(() => import("./search/SearchDialog"));
import { mainNav, type NavLink } from "@/config/nav";
import { Logo } from "./Logo";

type Labels = {
  inicio: string;
  navPrincipal: string;
  plantao: string;
  menu: string;
  fecharMenu: string;
  solicitarAtendimento: string;
};

function Dropdown({
  id, label, items, wide, open, setOpen,
}: { id: string; label: string; items: NavLink[]; wide?: boolean; open: boolean; setOpen: (v: string | null) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(id)}
      onMouseLeave={() => setOpen(null)}
      onBlur={(e) => { if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(null); }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`dd-${id}`}
        onClick={() => setOpen(open ? null : id)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[15px] font-medium text-ink-soft hover:bg-accent/8 hover:text-ink aria-expanded:text-ink"
      >
        {label}
        <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <div
        id={`dd-${id}`}
        hidden={!open}
        className={`absolute left-1/2 top-full -translate-x-1/2 pt-3 ${wide ? "w-[560px]" : "w-[360px]"}`}
      >
        <ul className={`grid gap-1 rounded-xl border border-line bg-bg-2/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl ${wide ? "grid-cols-2" : ""}`}>
          {items.map((it) => (
            <li key={it.href}>
              <Link
                href={it.href}
                prefetch={false}
                onClick={() => setOpen(null)}
                className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-accent/8 focus-visible:bg-accent/8"
              >
                {it.sigla && <span className="hud mt-0.5 w-12 shrink-0 text-accent">{it.sigla}</span>}
                <span>
                  <span className="block text-[15px] font-semibold text-ink">{it.label}</span>
                  {it.hint && <span className="block text-[13px] text-ink-mute">{it.hint}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Header({ labels, plantaoHref }: { labels: Labels; plantaoHref: string }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [search, setSearch] = useState(false);
  const openSearch = useCallback(() => { setSearch(true); track("search_open"); }, []);
  const closeSearch = useCallback(() => setSearch(false), []);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearch(true); track("search_open", { via: "atalho" }); }
    };
    window.addEventListener("keydown", onKey);

    // estado ativo conforme a seção visível
    const ids = [mainNav.reparar.sectionId, mainNav.contato.sectionId];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      io.disconnect();
    };
  }, []);

  const linkCls = (id?: string) =>
    `rounded-lg px-3 py-2 text-[15px] font-medium hover:bg-accent/8 hover:text-ink ${active && id === active ? "text-accent" : "text-ink-soft"}`;

  const closeDialog = () => dialogRef.current?.close();

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        solid ? "border-line bg-bg/80 backdrop-blur-xl" : "border-transparent"
      }`}
    >
      <div className="wrap flex h-[72px] items-center gap-3">
        <Link href="/" aria-label={labels.inicio} className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label={labels.navPrincipal} className="ml-auto hidden items-center gap-1 min-[1100px]:flex">
          <Dropdown id="solucoes" label={mainNav.solucoes.label} items={mainNav.solucoes.items} wide open={open === "solucoes"} setOpen={setOpen} />
          <Link href={mainNav.reparar.href} className={linkCls(mainNav.reparar.sectionId)} aria-current={active === "reparar" ? "location" : undefined}>
            {mainNav.reparar.label}
          </Link>
          <Dropdown id="ferramentas" label={mainNav.ferramentas.label} items={mainNav.ferramentas.items} open={open === "ferramentas"} setOpen={setOpen} />
          <Link href={mainNav.conformidade.href} prefetch={false} className={linkCls()}>{mainNav.conformidade.label}</Link>
          <Link href={mainNav.contato.href} className={linkCls(mainNav.contato.sectionId)} aria-current={active === "contato" ? "location" : undefined}>
            {mainNav.contato.label}
          </Link>
        </nav>

        <button
          type="button"
          onClick={openSearch}
          aria-keyshortcuts="Control+K Meta+K"
          className="ml-auto flex min-h-[42px] items-center gap-2 rounded-[10px] border border-line px-3 text-sm text-ink-soft hover:text-ink min-[1100px]:ml-1"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" /></svg>
          <span className="sr-only">Buscar</span>
          <kbd aria-hidden="true" className="hud hidden text-ink-mute xl:inline">⌘K</kbd>
        </button>
        <a href={plantaoHref} className="btn btn-primary hidden !min-h-[42px] !px-4 md:inline-flex" target="_blank" rel="noopener">
          <span className="live-dot" aria-hidden="true" />
          {labels.plantao}
        </a>
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          aria-haspopup="dialog"
          className="min-h-[42px] rounded-[10px] border border-line-strong px-4 text-sm font-semibold min-[1100px]:hidden"
        >
          {labels.menu}
        </button>
      </div>

      {/* Menu móvel: <dialog> nativo = foco preso, Esc fecha, fundo inerte */}
      <dialog
        ref={dialogRef}
        aria-label={labels.menu}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-ink backdrop:bg-black/60"
        onClick={(e) => { if (e.target === dialogRef.current) closeDialog(); }}
      >
        <div className="wrap flex h-[72px] items-center">
          <Logo />
          <button type="button" onClick={closeDialog} className="ml-auto min-h-[42px] rounded-[10px] border border-line-strong px-4 text-sm font-semibold" autoFocus>
            {labels.fecharMenu}
          </button>
        </div>
        <nav aria-label={labels.navPrincipal} className="wrap grid gap-8 pb-40 pt-4">
          {[mainNav.solucoes, mainNav.ferramentas].map((g) => (
            <div key={g.label}>
              <p className="hud mb-3 text-ink-mute">{g.label}</p>
              <ul className="grid gap-1">
                {g.items.map((it) => (
                  <li key={it.href}>
                    <Link href={it.href} prefetch={false} onClick={closeDialog} className="block rounded-lg py-2.5 text-lg font-semibold">
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <ul className="grid gap-1 border-t border-line pt-6">
            {[mainNav.reparar, mainNav.conformidade, mainNav.contato].map((l) => (
              <li key={l.href}>
                <Link href={l.href} prefetch={false} onClick={closeDialog} className="block py-2.5 text-lg font-semibold">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="fixed inset-x-0 bottom-0 grid grid-cols-2 gap-2 border-t border-line bg-bg-2 px-3 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5">
          <a href={plantaoHref} target="_blank" rel="noopener" className="btn btn-primary !px-2 text-sm">
            <span className="live-dot" aria-hidden="true" />{labels.plantao}
          </a>
          <Link href="/#contato" onClick={closeDialog} className="btn btn-ghost !px-2 text-sm">{labels.solicitarAtendimento}</Link>
        </div>
      </dialog>
      {search && (
        <Suspense fallback={null}>
          <SearchDialog onClose={closeSearch} />
        </Suspense>
      )}
    </header>
  );
}
