/**
 * Afirmações do site. Um valor único por afirmação, com fonte e período.
 * valor vazio ("") = não renderiza em lugar nenhum.
 * confirmado:false = pendente de validação pela operação (// CONFIRMAR).
 */
export type Claim = {
  valor: string; // texto exibido, ex.: "30% a 50%"
  numero?: number; // para contagem animada (opcional)
  prefixo?: string;
  sufixo?: string;
  rotulo: string;
  detalhe?: string;
  fonte: string;
  periodo: string;
  confirmado: boolean;
};

/** Antes de publicar, ligue para exibir só o que foi confirmado. */
export const claimsPolicy = {
  somenteConfirmados: false, // CONFIRMAR: mudar para true no lançamento
};

export const claims = {
  // CONFIRMAR: valor único (o site atual traz "até 45%" e "30% a 50%")
  economia: {
    valor: "30% a 50%",
    rotulo: "de economia em manutenção e peças",
    detalhe: "em relação ao fabricante; varia por contrato e equipamento",
    fonte: "", // CONFIRMAR fonte (valor veio do site atual bestmedical.ai.studio)
    periodo: "",
    confirmado: false,
  },
  // CONFIRMAR
  slaEmergencia: {
    valor: "4 h",
    numero: 4,
    prefixo: "até ",
    sufixo: " h",
    rotulo: "para resposta em emergências",
    fonte: "", // CONFIRMAR fonte (valor veio do site atual bestmedical.ai.studio)
    periodo: "",
    confirmado: false,
  },
  // CONFIRMAR: fonte e período
  disponibilidade: {
    valor: "99,4%",
    rotulo: "de disponibilidade média",
    detalhe: "parques sob contrato de gestão",
    fonte: "", // CONFIRMAR fonte (valor veio do site atual bestmedical.ai.studio)
    periodo: "",
    confirmado: false,
  },
  // CONFIRMAR
  pecasEstoque: {
    valor: "+2.500",
    numero: 2500,
    prefixo: "+",
    rotulo: "peças e módulos em estoque",
    fonte: "", // CONFIRMAR fonte (valor veio do site atual bestmedical.ai.studio)
    periodo: "",
    confirmado: false,
  },
  // CONFIRMAR
  equipamentosAtivos: {
    valor: "+450",
    numero: 450,
    prefixo: "+",
    rotulo: "equipamentos atendidos",
    detalhe: "no Brasil e no exterior",
    fonte: "", // CONFIRMAR fonte (valor veio do site atual bestmedical.ai.studio)
    periodo: "",
    confirmado: false,
  },
  // CONFIRMAR
  garantiaPecas: {
    valor: "90 a 180 dias",
    rotulo: "de garantia nas peças",
    fonte: "", // CONFIRMAR fonte (valor veio do site atual bestmedical.ai.studio)
    periodo: "",
    confirmado: false,
  },
  // CONFIRMAR
  testeBancadaBaseTroca: {
    valor: "Teste em bancada antes da expedição",
    rotulo: "inclusive na base de troca",
    fonte: "", // CONFIRMAR fonte (brief / site atual)
    periodo: "",
    confirmado: false,
  },
} satisfies Record<string, Claim>;

/** Termos de peças: definição única usada em todo o site. // CONFIRMAR redação */
export const termosPecas = {
  nova: "Peça sem uso anterior, com nota fiscal e laudo de teste.",
  revisada: "Peça usada, inspecionada e testada em bancada, com substituição de itens de desgaste quando necessário.",
  remanufaturada: "Peça desmontada e reconstruída com componentes novos nos pontos de falha, testada e laudada.",
  baseDeTroca: "Você envia a peça danificada e recebe uma equivalente testada, com abatimento no valor.",
} as const;

export type ClaimKey = keyof typeof claims;

export function claim(key: ClaimKey): Claim | null {
  const c: Claim = claims[key];
  if (!c.valor) return null;
  if (claimsPolicy.somenteConfirmados && !c.confirmado) return null;
  return c;
}

/** Números exibidos na faixa do topo, em ordem. */
export const numerosDoTopo: ClaimKey[] = ["slaEmergencia", "disponibilidade", "pecasEstoque", "equipamentosAtivos"];
