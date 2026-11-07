import Link from "next/link";

/** Barra inferior fixa no celular: os dois contatos a um toque. */
export function MobileDock({ label, plantao, solicitar, plantaoHref }: { label: string; plantao: string; solicitar: string; plantaoHref: string }) {
  return (
    <nav
      aria-label={label}
      data-local="dock"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-bg/85 px-3 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl md:hidden"
    >
      <a href={plantaoHref} target="_blank" rel="noopener" className="btn btn-primary !min-h-[50px] !gap-2 !px-2 whitespace-nowrap text-sm">
        <span className="live-dot" aria-hidden="true" />
        {plantao}
      </a>
      <Link href="/#contato" className="btn btn-ghost !min-h-[50px] !px-2 whitespace-nowrap text-sm">
        {solicitar}
      </Link>
    </nav>
  );
}
