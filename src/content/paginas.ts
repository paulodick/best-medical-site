/** Textos das páginas internas. Frases técnicas: // REVISAR COM RESPONSÁVEL TÉCNICO */

export const bobinas = {
  seo: {
    title: "Reparo de bobinas de ressonância magnética | Best Medical",
    description: "Reparo de bobinas de RM em bancada: diagnóstico de conectores, pré-amplificadores e desacoplamento, teste final e laudo. Antes de trocar, avaliamos.",
  },
  hud: "RM · bobinas de RF",
  h1: "Reparo de bobinas de ressonância magnética",
  intro: "Bobina com queda de sinal ou falha de reconhecimento nem sempre precisa ser trocada. Avaliamos em bancada e reparamos quando o defeito é localizado e o reparo é seguro.",
  sinais: {
    titulo: "Sinais de que a bobina precisa de avaliação",
    itens: [
      "Queda da relação sinal-ruído em uma bobina específica", // REVISAR COM RESPONSÁVEL TÉCNICO
      "Bobina não reconhecida pelo sistema ou com erro intermitente", // REVISAR COM RESPONSÁVEL TÉCNICO
      "Artefatos que somem ao trocar de bobina", // REVISAR COM RESPONSÁVEL TÉCNICO
      "Dano em cabo, conector ou carcaça", // REVISAR COM RESPONSÁVEL TÉCNICO
    ],
  },
  processo: {
    titulo: "Como a bobina passa pela bancada",
    etapas: [
      { t: "Recebimento", d: "Registro do número de série, do sintoma relatado e do estado de entrada." },
      { t: "Teste de bancada", d: "Medições para localizar o defeito: canais, conectores e circuitos de desacoplamento." },
      { t: "Diagnóstico e orçamento", d: "Você recebe o diagnóstico e decide entre reparar, trocar ou usar base de troca." },
      { t: "Reparo", d: "Substituição dos componentes com defeito." },
      { t: "Teste final e laudo", d: "Novo teste completo e laudo que acompanha a bobina na devolução." },
    ],
  },
  emprestimo:
    "Durante o reparo, verificamos a disponibilidade de bobina de empréstimo para o seu modelo.", // CONFIRMAR (site atual cita bobinas de empréstimo)
};

export const pecasPagina = {
  seo: {
    title: "Peças com laudo e base de troca | Best Medical",
    description: "Peças novas, revisadas, remanufaturadas e base de troca para RM, TC e hemodinâmica. Teste em bancada, laudo e garantia em cada peça.",
  },
  hud: "Peças · base de troca",
  h1: "Peças com laudo e base de troca",
  intro: "Cada peça tem origem registrada, teste em bancada, laudo e garantia. Você escolhe a condição (nova, revisada, remanufaturada ou base de troca) sabendo exatamente o que cada uma significa.",
  baseTroca: {
    titulo: "Como funciona a base de troca",
    passos: [
      "Você informa o código da peça e o equipamento.",
      "Enviamos uma peça equivalente, testada e com laudo.",
      "Você devolve a peça danificada no prazo combinado.",
      "O valor da peça devolvida é abatido do total.",
    ],
  },
};

export const conformidadePagina = {
  seo: {
    title: "Conformidade, laudos e documentos | Best Medical",
    description: "Dados da empresa, normas seguidas, laudo com ART e documentos para licitação da Best Medical, engenharia clínica para diagnóstico por imagem.",
  },
  h1: "Conformidade e documentos",
  intro: "Dados da empresa, normas que seguimos e os documentos que enviamos para cadastro de fornecedor e licitação.",
  normas: {
    titulo: "Normas e laudos",
    itens: [
      "RDC Anvisa nº 509/2021: gerenciamento de tecnologias em saúde", // CONFIRMAR
      "RDC Anvisa nº 611/2022: radiodiagnóstico", // CONFIRMAR
      "Laudo técnico ao final de cada atendimento, com ART quando aplicável", // CONFIRMAR
      "Instrumentos com calibração rastreável", // CONFIRMAR
    ],
  },
};

export const faqPagina = {
  seo: {
    title: "Perguntas frequentes | Best Medical",
    description: "Atendimento em todo o Brasil, equipamentos multimarcas, Anvisa, emergência, contratos e garantia de peças: as dúvidas mais comuns de gestores.",
  },
  h1: "Perguntas frequentes",
  intro: "As dúvidas mais comuns de gestores de clínicas, hospitais e centros de diagnóstico.",
};
