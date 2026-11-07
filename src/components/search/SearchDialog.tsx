"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SearchItem } from "@/content/search";
import { asset } from "@/lib/base";

const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
let cache: SearchItem[] | null = null;

/** Carregado só no primeiro uso (import dinâmico a partir do cabeçalho). */
export default function SearchDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<SearchItem[]>(cache ?? []);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const d = ref.current!;
    d.showModal();
    inputRef.current?.focus();
    if (!cache) fetch(asset("/busca.json")).then((r) => r.json()).then((j: SearchItem[]) => { cache = j; setItems(j); }).catch(() => {});
    const close = () => onClose();
    d.addEventListener("close", close);
    return () => d.removeEventListener("close", close);
  }, [onClose]);

  const results = useMemo(() => {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return items.filter((i) => ["Modalidade", "Ferramenta", "Contato"].includes(i.tipo)).slice(0, 8);
    return items
      .map((i) => {
        const t = norm(i.titulo), b = norm(`${i.tipo} ${i.texto}`);
        let score = 0;
        for (const term of terms) {
          if (t.includes(term)) score += 3;
          else if (b.includes(term)) score += 1;
          else return null;
        }
        return { i, score };
      })
      .filter((x): x is { i: SearchItem; score: number } => x !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((x) => x.i);
  }, [q, items]);

  const go = (it: SearchItem) => { ref.current?.close(); router.push(it.href); };

  return (
    <dialog
      ref={ref}
      aria-label="Buscar no site"
      className="mx-auto mt-[10vh] w-[min(640px,calc(100%-24px))] rounded-[16px] border border-line-strong bg-bg-2 p-0 text-ink shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" className="text-ink-mute"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" /></svg>
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded="true"
          aria-controls="busca-lista"
          aria-activedescendant={results[sel] ? `busca-${sel}` : undefined}
          aria-label="Buscar modalidades, ferramentas, peças e perguntas"
          placeholder="Buscar: bobina, tubo, hélio, simulador…"
          value={q}
          onChange={(e) => { setQ(e.target.value); setSel(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
            if (e.key === "Enter" && results[sel]) { e.preventDefault(); go(results[sel]); }
          }}
          className="h-14 w-full bg-transparent text-[17px] outline-none placeholder:text-ink-mute"
        />
        <kbd className="hud rounded border border-line px-1.5 py-0.5 text-ink-mute">Esc</kbd>
      </div>
      <ul id="busca-lista" role="listbox" aria-label="Resultados" className="max-h-[56vh] overflow-y-auto p-2">
        {results.length === 0 && <li className="px-3 py-6 text-center text-ink-mute">Nada encontrado. Tente outro termo ou acione o plantão.</li>}
        {results.map((it, i) => (
          <li
            key={`${it.href}-${it.titulo}`}
            id={`busca-${i}`}
            role="option"
            aria-selected={i === sel}
            onMouseEnter={() => setSel(i)}
            onClick={() => go(it)}
            className="cursor-pointer rounded-[10px] px-3 py-2.5 aria-selected:bg-accent/10"
          >
            <span className="hud block text-ink-mute">{it.tipo}</span>
            <span className="block font-semibold">{it.titulo}</span>
          </li>
        ))}
      </ul>
    </dialog>
  );
}
