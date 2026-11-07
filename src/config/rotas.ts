import { modalidadesAtivas } from "./site";
import { ferramentas, solucoes } from "./nav";
import { conteudos } from "@/content/conteudos";

/** Rotas indexáveis (sitemap e llms.txt). Rascunhos (published:false) ficam de fora. */
export const rotasPublicas: { path: string; prioridade: number; freq: "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", prioridade: 1, freq: "weekly" },
  ...modalidadesAtivas.map((m) => ({ path: m.rota, prioridade: 0.9, freq: "monthly" as const })),
  ...solucoes.filter((s) => !modalidadesAtivas.some((m) => m.rota === s.href)).map((s) => ({ path: s.href, prioridade: 0.8, freq: "monthly" as const })),
  ...ferramentas.map((f) => ({ path: f.href, prioridade: 0.7, freq: "monthly" as const })),
  { path: "/perguntas-frequentes", prioridade: 0.6, freq: "monthly" },
  { path: "/conformidade", prioridade: 0.6, freq: "monthly" },
  { path: "/privacidade", prioridade: 0.2, freq: "yearly" },
  ...conteudos.filter((c) => c.published).map((c) => ({ path: `/conteudos/${c.slug}`, prioridade: 0.5, freq: "monthly" as const })),
];
