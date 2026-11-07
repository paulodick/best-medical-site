import { site } from "@/config/site";
import { asset } from "@/lib/base";

/**
 * O lockup oficial tem o nome em azul-escuro, ilegível sobre fundo escuro.
 * No cabeçalho mostramos só o símbolo (recorte do próprio arquivo, sem alteração) + o nome em texto.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span aria-hidden="true" className="relative block h-[42px] w-[38px] shrink-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(site.logo.lockup)}
          alt=""
          width={60}
          height={61}
          className="absolute left-[-11px] top-0 h-auto w-[60px] max-w-none"
          fetchPriority="high"
        />
      </span>
      <span className="text-[19px] font-extrabold tracking-[-0.02em]">{site.nome}</span>
    </span>
  );
}
