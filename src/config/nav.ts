import { modalidadesAtivas } from "./site";

export type NavLink = { label: string; href: string; hint?: string; sigla?: string };

export const solucoes: NavLink[] = [
  ...modalidadesAtivas.map((m) => ({ label: m.nome, href: m.rota, sigla: m.sigla })),
  { label: "Reparo de bobinas de RM", href: "/reparo-bobinas-ressonancia", sigla: "RF" },
  { label: "Peças e base de troca", href: "/pecas-e-base-de-troca", sigla: "PÇ" },
];

export const ferramentas: NavLink[] = [
  { label: "Reparar ou trocar?", href: "/ferramentas/reparar-ou-trocar", hint: "Orientação preliminar em 5 perguntas" },
  { label: "Simulador de parada", href: "/ferramentas/simulador-parada", hint: "Quanto custa cada dia parado" },
  { label: "Monte seu parque", href: "/ferramentas/monte-seu-parque", hint: "Resumo dos seus equipamentos" },
  { label: "Guia de falhas", href: "/guia-de-falhas", hint: "Conduta preliminar por sintoma" },
];

export const mainNav = {
  solucoes: { label: "Soluções", items: solucoes },
  reparar: { label: "Reparar antes de trocar", href: "/#reparar", sectionId: "reparar" },
  ferramentas: { label: "Ferramentas", items: ferramentas },
  conformidade: { label: "Conformidade", href: "/conformidade" },
  contato: { label: "Contato", href: "/#contato", sectionId: "contato" },
};
