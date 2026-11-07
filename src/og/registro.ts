import { rotasPublicas } from "@/config/rotas";
import { modalidadesAtivas } from "@/config/site";
import { conteudoModalidades } from "@/content/modalidades";
import { assistente, guia, parque, simulador } from "@/content/ferramentas";
import { bobinas, conformidadePagina, faqPagina, pecasPagina } from "@/content/paginas";
import { privacidade } from "@/content/privacidade";
import { conteudos } from "@/content/conteudos";

type Og = { hud: string; titulo: string };

const fixos: Record<string, Og> = {
  "/": { hud: "Engenharia clínica · diagnóstico por imagem", titulo: "Menos troca desnecessária. Mais disponibilidade para o seu parque de imagem." },
  "/reparo-bobinas-ressonancia": { hud: bobinas.hud, titulo: bobinas.h1 },
  "/pecas-e-base-de-troca": { hud: pecasPagina.hud, titulo: pecasPagina.h1 },
  "/ferramentas/reparar-ou-trocar": { hud: "Ferramenta · assistente", titulo: assistente.h1 },
  "/ferramentas/simulador-parada": { hud: "Ferramenta · simulador", titulo: simulador.h1 },
  "/ferramentas/monte-seu-parque": { hud: "Ferramenta · inventário", titulo: parque.h1 },
  "/guia-de-falhas": { hud: "Ferramenta · consulta", titulo: guia.h1 },
  "/perguntas-frequentes": { hud: "Dúvidas de gestores", titulo: faqPagina.h1 },
  "/conformidade": { hud: "Empresa · documentos", titulo: conformidadePagina.h1 },
  "/privacidade": { hud: "LGPD", titulo: privacidade.h1 },
};

/** Arquivo da imagem OG de uma rota: "/" → "inicio", "/ferramentas/x" → "ferramentas-x". */
export const ogSlug = (path: string) => (path === "/" ? "inicio" : path.replace(/^\/|\/$/g, "").replace(/\//g, "-"));

export function ogDaRota(path: string): Og {
  const m = modalidadesAtivas.find((x) => x.rota === path);
  if (m) return { hud: conteudoModalidades[m.id].hud, titulo: conteudoModalidades[m.id].seo.h1 };
  const c = conteudos.find((x) => `/conteudos/${x.slug}` === path);
  if (c) return { hud: "Conteúdo", titulo: c.titulo };
  return fixos[path] ?? fixos["/"];
}

export const rotasComOg = () => rotasPublicas.map((r) => r.path);
