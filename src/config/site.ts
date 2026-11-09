/**
 * Dados institucionais da Best Medical. Todo dado de negócio vive aqui ou em claims.ts.
 * Campo vazio ("") = não renderiza.
 */
export const site = {
  nome: "Best Medical",
  lema: "When uptime matters.", // lema em inglês presente no logotipo
  assinatura: "Sempre a favor da vida.", // bestmedical.com.br
  razaoSocial: "Bestmedical Comércio e Serviço Ltda. - ME",
  cnpj: "50.320.883/0001-95",

  contato: {
    whatsappEmergencia: "5511918661002",
    whatsappComercial: "5511918661002",
    telefoneFixo: "+551149794500",
    telefoneFixoExibicao: "+55 11 4979-4500",
    whatsappExibicao: "(11) 91866-1002",
    email: "contato@bestmedical.com.br",
    instagram: "bestmedicalimg",
  },

  endereco: {
    rua: "", // PREENCHER
    numero: "", // PREENCHER
    complemento: "",
    bairro: "Pinheiros",
    cidade: "São Paulo",
    uf: "SP",
    cep: "05422-000",
    pais: "BR",
  },

  abrangencia: "Todo o Brasil e exterior",

  responsaveisTecnicos: [] as { nome: string; titulo: string; crea: string }[], // PREENCHER

  urlDoSite: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestmedical.com.br").replace(/\/$/, ""), // CONFIRMAR domínio final (canonical, sitemap, OG)
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "",

  logo: {
    lockup: "/brand/logo-best-medical.webp", // nome escuro: usar só sobre fundo claro
    lockupLargura: 1457,
    lockupAltura: 1472,
    paraFundoEscuro: "", // PREENCHER se existir versão clara do logotipo
  },

  /** Mensagens pré-preenchidas do WhatsApp (o código de referência e UTMs são anexados) */
  mensagensWhatsapp: {
    emergencia: "Olá, Best Medical. Plantão 24h: tenho um equipamento parado.",
    comercial: "Olá, Best Medical. Gostaria de solicitar atendimento.",
    auditoria: "Olá, Best Medical. Gostaria de solicitar uma auditoria técnica do meu parque.",
  },

  /** Fotos reais (laboratório, estoque, equipe). Vazio = placeholder ilustrado. */
  fotos: {
    laboratorio: "",
    estoque: "",
    equipe: "",
  },
} as const;

/** Modalidades. Mamografia e raios X vêm do site institucional: confirmar com a operação (confirmada:false tira rota, menu e sitemap). */
export const modalidades = [
  { id: "rm", sigla: "RM", curto: "ressonância", nome: "Ressonância magnética", rota: "/manutencao-ressonancia-magnetica", confirmada: true },
  { id: "tc", sigla: "TC", curto: "tomografia", nome: "Tomografia computadorizada", rota: "/manutencao-tomografia-tubos-raios-x", confirmada: true },
  { id: "hemo", sigla: "HEMO", curto: "hemodinâmica", nome: "Hemodinâmica e arcos cirúrgicos", rota: "/hemodinamica-arcos-cirurgicos", confirmada: true },
  { id: "mamo", sigla: "MG", curto: "mamografia", nome: "Mamografia", rota: "/manutencao-mamografia", confirmada: true }, // CONFIRMAR
  { id: "rx", sigla: "RX", curto: "raios X", nome: "Raios X", rota: "/manutencao-raios-x", confirmada: true }, // CONFIRMAR
] as const;

export const modalidadesAtivas = modalidades.filter((m) => m.confirmada);

/** "Ressonância, tomografia e hemodinâmica" a partir das modalidades confirmadas */
export function listaModalidades() {
  const n = modalidadesAtivas.map((m) => m.curto);
  const txt = n.length > 1 ? `${n.slice(0, -1).join(", ")} e ${n[n.length - 1]}` : (n[0] ?? "");
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}

/** Prova social e conformidade. Tudo condicional: lista vazia = bloco não aparece. Nada fictício. */
export type Caso = {
  modalidade: string;
  problema: string;
  acao: string;
  resultado: string; // com número e período, ex.: "equipamento de volta em 2 dias (mar/2026)"
  autorizadoPor: string; // quem autorizou o uso
};
export type Depoimento = { texto: string; nome: string; cargo: string; instituicao: string; autorizado: boolean };
export type LogoCliente = { nome: string; src: string; autorizado: boolean };

export const prova = {
  casos: [] as Caso[], // PREENCHER
  depoimentos: [] as Depoimento[], // PREENCHER (só com autorização)
  logosClientes: [] as LogoCliente[], // PREENCHER (só com autorização)
  laudoExemplo: "", // PREENCHER: caminho de um PDF/imagem de laudo com ART, com dados do cliente ocultos
  // CONFIRMAR: lista de documentos que a Best Medical envia para licitação
  documentosLicitacao: [
    "Cartão CNPJ e contrato social",
    "Certidões negativas de débitos",
    "Registro da empresa e dos responsáveis técnicos no CREA",
    "Modelo de laudo técnico com ART",
  ],
};
