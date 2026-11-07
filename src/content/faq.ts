/**
 * FAQ: base no site atual (bestmedical.ai.studio), reescrita para não contradizer claims.ts.
 * Números e prazos vêm do config; se o claim estiver vazio, a frase correspondente sai.
 */
import { claim } from "@/config/claims";
import { listaModalidades, site } from "@/config/site";

export type Faq = { id: string; q: string; a: string };

export function getFaq(): Faq[] {
  const sla = claim("slaEmergencia");
  const garantia = claim("garantiaPecas");
  const itens: (Faq | null)[] = [
    {
      id: "abrangencia",
      q: "A Best Medical atende em todo o Brasil e no exterior?",
      a: `Sim. A base técnica fica em ${site.endereco.bairro}, ${site.endereco.cidade}, e coordena atendimentos presenciais, suporte remoto e envio de peças para todo o Brasil e para outros países.`,
    },
    {
      id: "multimarcas",
      q: "Vocês atendem equipamentos fora da garantia do fabricante e de várias marcas?",
      a: `Sim. Atendemos parques multimarcas de ${listaModalidades().toLowerCase()}, com contratos, chamados avulsos e fornecimento de peças, inclusive para sistemas que o fabricante já deixou de suportar. Marcas citadas pertencem a seus titulares.`, // CONFIRMAR
    },
    {
      id: "conformidade",
      q: "Os serviços seguem as exigências da Anvisa e da vigilância sanitária?",
      a: "Os serviços seguem a RDC Anvisa nº 509/2021 e, para radiodiagnóstico, a RDC nº 611/2022. Ao final, emitimos laudo técnico com ART assinada por engenheiro habilitado no CREA.", // CONFIRMAR
    },
    {
      id: "emergencia",
      q: "Como funciona o atendimento quando o equipamento para?",
      a: `Você aciona o plantão pelo WhatsApp. Um especialista faz a triagem pelos sintomas e pelos registros do equipamento, identifica a peça provável e aciona o engenheiro de campo mais próximo${sla ? `. Em emergências, o prazo de resposta é de ${sla.prefixo ?? ""}${sla.valor}` : ""}.`,
    },
    {
      id: "contratos",
      q: "Quais modalidades de contrato vocês oferecem?",
      a: "Três: contrato completo (preventiva, corretiva e peças), contrato de mão de obra (preventiva e corretiva, com condição diferenciada em peças) e atendimento sob demanda (chamado avulso com orçamento prévio).", // CONFIRMAR
    },
    {
      id: "garantia",
      q: "As peças têm garantia?",
      a: `Sim. Toda peça sai com laudo de teste em bancada${garantia ? ` e garantia de ${garantia.valor}` : " e garantia"}. Na base de troca, você envia a peça danificada e recebe uma equivalente testada, com abatimento no valor.`,
    },
  ];
  return itens.filter((f): f is Faq => f !== null);
}
