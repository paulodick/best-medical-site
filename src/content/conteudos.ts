/** Conteúdos (artigos). published:false = gerado com noindex e fora do sitemap. */
export type Conteudo = { slug: string; titulo: string; resumo: string; published: boolean; corpo: string[] };

export const conteudos: Conteudo[] = [
  {
    slug: "exemplo-rascunho",
    titulo: "Rascunho de conteúdo",
    resumo: "Modelo de página de conteúdo. Substitua pelo primeiro artigo e mude published para true.",
    published: false,
    corpo: ["Este é um rascunho. Ele não aparece no menu, no sitemap nem nos buscadores."],
  },
];
