import { claim } from "@/config/claims";
import { rotasPublicas } from "@/config/rotas";
import { modalidadesAtivas, site } from "@/config/site";
import { conteudoModalidades } from "@/content/modalidades";
import { getFaq } from "@/content/faq";
import { canonicalPath } from "@/lib/seo";

export const dynamic = "force-static";

/** /llms.txt: resumo da empresa para assistentes de IA (formato llmstxt.org). Tudo vem do config. */
export function GET() {
  const u = (p: string) => `${site.urlDoSite}${canonicalPath(p)}`;
  const e = site.endereco;
  const endereco = [[e.rua, e.numero].filter(Boolean).join(", "), e.bairro, `${e.cidade} - ${e.uf}`, `CEP ${e.cep}`].filter(Boolean).join(", ");
  const sla = claim("slaEmergencia");
  const linhas = [
    `# ${site.nome}`,
    "",
    `> Engenharia clínica independente para diagnóstico por imagem: manutenção preventiva e corretiva, reparo de bobinas e placas e fornecimento de peças com laudo para ${modalidadesAtivas.map((m) => m.nome.toLowerCase()).join(", ")}. Sede em ${e.bairro}, ${e.cidade}. Atendimento: ${site.abrangencia}.`,
    "",
    "Princípio de trabalho: diagnóstico antes do orçamento; reparo quando é seguro e econômico; troca só quando necessária.",
    "",
    "## Contato",
    "",
    `- Plantão 24h (WhatsApp): +${site.contato.whatsappEmergencia}${sla ? ` (resposta em emergências: ${sla.valor})` : ""}`,
    `- Telefone: ${site.contato.telefoneFixoExibicao}`,
    `- E-mail: ${site.contato.email}`,
    `- Endereço: ${endereco}`,
    `- Razão social: ${site.razaoSocial} · CNPJ ${site.cnpj}`,
    "",
    "## Serviços por modalidade",
    "",
    ...modalidadesAtivas.map((m) => `- [${m.nome}](${u(m.rota)}): ${conteudoModalidades[m.id].resumo}`),
    `- [Reparo de bobinas de ressonância](${u("/reparo-bobinas-ressonancia")}): diagnóstico e reparo em bancada, com teste final e laudo.`,
    `- [Peças e base de troca](${u("/pecas-e-base-de-troca")}): peças novas, revisadas, remanufaturadas e base de troca, com teste, laudo e garantia.`,
    "",
    "## Ferramentas",
    "",
    `- [Reparar ou trocar?](${u("/ferramentas/reparar-ou-trocar")}): orientação preliminar em 5 perguntas.`,
    `- [Simulador de parada](${u("/ferramentas/simulador-parada")}): receita de exames perdida por dia de equipamento parado.`,
    `- [Monte seu parque](${u("/ferramentas/monte-seu-parque")}): resumo do parque de equipamentos para avaliação.`,
    `- [Guia de falhas](${u("/guia-de-falhas")}): sintomas frequentes e conduta preliminar segura.`,
    "",
    "## Perguntas frequentes",
    "",
    ...getFaq().map((f) => `- ${f.q} ${f.a}`),
    "",
    "## Páginas",
    "",
    ...rotasPublicas.map((r) => `- ${u(r.path)}`),
    "",
    "Marcas citadas pertencem a seus titulares.",
    "",
  ];
  return new Response(linhas.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
