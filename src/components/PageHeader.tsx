import Link from "next/link";
import { ReadingProgress } from "./PageChrome";
import { JsonLd } from "./JsonLd";
import { schemaTrilha } from "@/lib/schema";

export type Crumb = { label: string; href?: string };

/** Cabeçalho das páginas internas: breadcrumb + H1 + introdução + progresso de leitura. */
export function PageHeader({
  crumbs, hud, h1, intro, children, progress = true,
}: { crumbs: Crumb[]; hud?: string; h1: string; intro?: string; children?: React.ReactNode; progress?: boolean }) {
  return (
    <>
      <JsonLd data={schemaTrilha([{ label: "Início", href: "/" }, ...crumbs])} />
      {progress && <ReadingProgress />}
      <header className="hero-bg relative isolate overflow-hidden border-b border-line pb-14 pt-[112px] md:pb-20 md:pt-[136px]">
        <div className="wrap">
          <nav aria-label="Trilha de navegação" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-[14px] text-ink-mute">
              {[{ label: "Início", href: "/" }, ...crumbs].map((c, i, arr) => (
                <li key={c.label} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {c.href && i < arr.length - 1 ? (
                    <Link href={c.href} className="hover:text-accent">{c.label}</Link>
                  ) : (
                    <span aria-current="page" className="text-ink-soft">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          {hud && <p className="hud mb-4 text-accent">{hud}</p>}
          <h1 className="max-w-[20ch] text-[clamp(34px,4.6vw,68px)] font-extrabold leading-[1.03] tracking-[-0.035em]">{h1}</h1>
          {intro && <p className="mt-6 max-w-[60ch] text-[17px] leading-relaxed text-ink-soft md:text-[19px]">{intro}</p>}
          {children}
        </div>
      </header>
    </>
  );
}
