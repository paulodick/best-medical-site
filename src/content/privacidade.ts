import { site } from "@/config/site";

/** Política de privacidade (LGPD). // REVISAR COM JURÍDICO antes de publicar */
export const privacidade = {
  seo: {
    title: "Política de privacidade | Best Medical",
    description: "Como a Best Medical coleta, usa e protege dados pessoais enviados pelo site, de acordo com a LGPD (Lei 13.709/2018).",
  },
  h1: "Política de privacidade",
  atualizado: "Versão inicial: novembro de 2026", // ATUALIZAR na publicação
  secoes: [
    {
      t: "Quem é o controlador",
      p: [`${site.razaoSocial}, CNPJ ${site.cnpj}, com sede em ${site.endereco.bairro}, ${site.endereco.cidade} - ${site.endereco.uf}. Contato para assuntos de privacidade: ${site.contato.email}.`],
    },
    {
      t: "Quais dados coletamos",
      p: [
        "Dados que você informa nos formulários e ferramentas: nome, telefone/WhatsApp, e-mail, instituição, cidade, modalidade e descrição do equipamento ou do problema.",
        "Dados de navegação, somente se você aceitar os cookies de medição: páginas visitadas, origem da visita (parâmetros de campanha) e interações com o site.",
      ],
    },
    {
      t: "Para que usamos",
      p: [
        "Responder ao seu pedido de atendimento, orçamento, auditoria ou documentos (base legal: procedimentos preliminares a contrato, a pedido do titular).",
        "Medir e melhorar o site e as campanhas, apenas com o seu consentimento.",
      ],
    },
    {
      t: "Com quem compartilhamos",
      p: [
        "Com prestadores que operam serviços para nós (hospedagem, recebimento de formulários, ferramentas de medição), sob obrigação de confidencialidade. Não vendemos dados pessoais.",
        "Ao escolher continuar pelo WhatsApp, a conversa passa a seguir também os termos desse serviço.",
      ],
    },
    {
      t: "Cookies e medição",
      p: [
        "Scripts de análise só são carregados depois que você clica em \"Aceitar\" no aviso de cookies. Você pode mudar a escolha a qualquer momento em \"Preferências de cookies\", no rodapé.",
      ],
    },
    {
      t: "Por quanto tempo guardamos",
      p: ["Pelo tempo necessário para atender ao pedido e cumprir obrigações legais. Depois disso, os dados são excluídos ou anonimizados."],
    },
    {
      t: "Seus direitos",
      p: [
        `Você pode pedir confirmação, acesso, correção, anonimização, portabilidade ou exclusão dos seus dados, e revogar o consentimento, escrevendo para ${site.contato.email}.`,
      ],
    },
  ],
};
