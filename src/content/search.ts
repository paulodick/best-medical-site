import { ferramentas, solucoes } from "@/config/nav";
import { modalidadesAtivas } from "@/config/site";
import { conteudoModalidades } from "./modalidades";
import { getFaq } from "./faq";
import { pecas } from "./home";
import { guia } from "./ferramentas";

export type SearchItem = { tipo: string; titulo: string; href: string; texto: string };

/** Índice da busca global (gerado no build em /busca.json). */
export function buildSearchIndex(): SearchItem[] {
  const mods = modalidadesAtivas.flatMap((m) => {
    const c = conteudoModalidades[m.id];
    return [
      { tipo: "Modalidade", titulo: c.titulo, href: m.rota, texto: `${c.resumo} ${c.servicos.join(" ")}` },
      ...c.hotspots.map((h) => ({ tipo: c.titulo, titulo: h.nome, href: m.rota, texto: h.fazemos })),
    ];
  });
  const outras = solucoes
    .filter((s) => !modalidadesAtivas.some((m) => m.rota === s.href))
    .map((s) => ({ tipo: "Solução", titulo: s.label, href: s.href, texto: "" }));
  const tools = ferramentas.map((f) => ({ tipo: "Ferramenta", titulo: f.label, href: f.href, texto: f.hint ?? "" }));
  const falhas = guia.itens
    .filter((i) => modalidadesAtivas.some((m) => m.id === i.modalidade))
    .map((i) => ({ tipo: "Guia de falhas", titulo: i.sintoma, href: `/guia-de-falhas#${i.id}`, texto: `${i.termos} ${i.causa}` }));
  const termos = pecas.termos.map((t) => ({ tipo: "Peças", titulo: `Peça ${t.termo.toLowerCase()}`, href: "/pecas-e-base-de-troca", texto: t.def }));
  const faq = getFaq().map((f) => ({ tipo: "Pergunta", titulo: f.q, href: `/perguntas-frequentes#faq-${f.id}`, texto: f.a }));
  const paginas = [
    { tipo: "Página", titulo: "Conformidade e documentos", href: "/conformidade", texto: "RDC Anvisa laudo ART CREA licitação CNPJ" },
    { tipo: "Página", titulo: "Política de privacidade", href: "/privacidade", texto: "LGPD dados pessoais cookies" },
    { tipo: "Contato", titulo: "Plantão 24h e formulário de chamado", href: "/#contato", texto: "emergência WhatsApp telefone e-mail atendimento" },
  ];
  return [...mods, ...outras, ...tools, ...falhas, ...termos, ...faq, ...paginas];
}
