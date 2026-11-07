/**
 * Conteúdo das ferramentas (Fase 3). Nada aqui é diagnóstico: são orientações preliminares.
 * Frases técnicas: // REVISAR COM RESPONSÁVEL TÉCNICO
 */
import type { ModalidadeId } from "./types";

/* ───────── Assistente "Reparar ou trocar?" ───────── */

export type Opcao = { id: string; label: string; hint?: string };
export type Pergunta = { id: "modalidade" | "sintoma" | "parado" | "cobertura" | "urgencia"; titulo: string; ajuda?: string; opcoes: Opcao[] };

export const assistente = {
  seo: {
    title: "Reparar ou trocar? Assistente | Best Medical",
    description: "Cinco perguntas sobre o seu equipamento de imagem e uma orientação preliminar sobre o caminho mais provável: reparo, troca ou avaliação.",
  },
  h1: "Reparar ou trocar?",
  intro: "Cinco perguntas rápidas. No fim, você recebe uma orientação preliminar e pode abrir o chamado com as respostas já preenchidas.",
  aviso: "Orientação preliminar, sem diagnóstico definitivo. A decisão entre reparo e troca só é tomada depois da avaliação técnica.",
  perguntas: [
    { id: "modalidade", titulo: "Qual equipamento?", opcoes: [] }, // preenchida com as modalidades ativas do config
    {
      id: "sintoma",
      titulo: "O que está acontecendo?",
      opcoes: [
        { id: "parado", label: "Não liga, não inicia ou não conclui exames" },
        { id: "erro", label: "Alarme ou código de erro no console" },
        { id: "imagem", label: "Imagem com artefato, ruído ou perda de qualidade" },
        { id: "acessorio", label: "Falha em acessório ou componente específico", hint: "bobina, detector, mesa, tubo" },
        { id: "anormal", label: "Ruído, aquecimento ou comportamento fora do normal" },
      ],
    },
    {
      id: "parado",
      titulo: "Como o equipamento está agora?",
      opcoes: [
        { id: "parado", label: "Parado" },
        { id: "restricao", label: "Funcionando com restrição" },
        { id: "intermitente", label: "Funcionando, com falha intermitente" },
        { id: "normal", label: "Funcionando normalmente; quero planejar" },
      ],
    },
    {
      id: "cobertura",
      titulo: "Qual é a cobertura atual?",
      opcoes: [
        { id: "garantia", label: "Em garantia do fabricante" },
        { id: "contrato", label: "Com contrato de manutenção" },
        { id: "sem", label: "Sem contrato" },
        { id: "naosei", label: "Não sei" },
      ],
    },
    {
      id: "urgencia",
      titulo: "Para quando você precisa de resposta?",
      opcoes: [
        { id: "agora", label: "Agora: a agenda está parada" },
        { id: "semana", label: "Nesta semana" },
        { id: "planejamento", label: "Sem urgência: quero avaliação ou orçamento" },
      ],
    },
  ] satisfies Pergunta[],
  /** Textos do resultado. // REVISAR COM RESPONSÁVEL TÉCNICO */
  resultado: {
    emergencia: {
      hud: "Prioridade: plantão",
      titulo: "Acione o plantão agora.",
      texto: "Com o equipamento parado e a agenda comprometida, o primeiro passo é a triagem pelo plantão. A equipe identifica a falha provável pelos sintomas e registros e define se o atendimento começa remoto ou no local.",
    },
    componente: {
      hud: "Caminho provável: diagnóstico de componente",
      titulo: "Vale avaliar o componente antes de pensar em troca.",
      texto: "Falhas de imagem ou de um acessório específico costumam ser localizáveis em um componente. Quando o defeito é localizado e o reparo é seguro, o componente pode ser reparado e testado em bancada.",
    },
    sistema: {
      hud: "Caminho provável: diagnóstico do sistema",
      titulo: "Comece pelo diagnóstico, não pelo orçamento de peça.",
      texto: "Alarmes, códigos de erro e comportamento anormal podem ter mais de uma origem. O diagnóstico separa causa de consequência antes de qualquer indicação de troca.",
    },
    planejamento: {
      hud: "Caminho provável: avaliação planejada",
      titulo: "Bom momento para uma avaliação técnica.",
      texto: "Com o equipamento funcionando, dá para planejar: avaliar o estado dos componentes críticos, a preventiva e a cobertura antes que a falha pare a agenda.",
    },
    notas: {
      garantia: "Em garantia: verifique primeiro o que a garantia do fabricante cobre. Podemos avaliar o que estiver fora da cobertura.",
      contrato: "Com contrato: confira o escopo e o prazo do contrato atual. Se quiser, comparamos com uma proposta nossa.",
      sem: "Sem contrato: o atendimento pode ser avulso, com orçamento prévio, ou por contrato.",
      naosei: "Se não souber a cobertura, informe o número de série no chamado e verificamos com você.",
    },
  },
};

/* ───────── Simulador de parada ───────── */

export const simulador = {
  seo: {
    title: "Simulador de parada de equipamento | Best Medical",
    description: "Quanto custa cada dia de ressonância, tomografia ou hemodinâmica parada? Informe exames por dia, ticket médio e dias parados. Premissas visíveis.",
  },
  h1: "Simulador de parada",
  intro: "Informe os dados da sua unidade e veja a receita de exames que deixa de entrar enquanto o equipamento está parado.",
  campos: {
    exames: { label: "Exames por dia", min: 5, max: 80, passo: 1, padrao: 24 },
    ticket: { label: "Ticket médio por exame (R$)", min: 150, max: 2500, passo: 50, padrao: 850 },
    diasConvencional: { label: "Dias parados com a assistência atual", min: 1, max: 15, passo: 1, padrao: 5 },
    diasBest: { label: "Dias parados no cenário com a Best Medical", min: 1, max: 15, passo: 1, padrao: 1 },
  },
  premissas: [
    "Receita bruta de exames: exames por dia × ticket médio × dias parados.",
    "Não inclui remarcações, horas extras, multas contratuais nem custos de peça.",
    "Os dias parados são os que você informa. O prazo real depende do diagnóstico, da peça e do contrato.",
  ],
  nota: "Estimativa; depende dos dados informados.",
};

/* ───────── Monte seu parque ───────── */

export const parque = {
  seo: {
    title: "Monte seu parque de imagem | Best Medical",
    description: "Marque os equipamentos de imagem da sua unidade e a situação de cada um (garantia, contrato, sem contrato) e envie um resumo para a engenharia.",
  },
  h1: "Monte seu parque",
  intro: "Marque quantos equipamentos você tem por modalidade e a situação de cada um. O resumo segue com o seu chamado, e a conversa começa do ponto certo.",
  situacoes: [
    { id: "garantia", label: "Em garantia", curto: "garantia" },
    { id: "contrato", label: "Com contrato", curto: "contrato" },
    { id: "sem", label: "Sem contrato", curto: "sem contrato" },
  ] as const,
  max: 20,
  leituras: {
    sem: "Equipamentos sem contrato ficam sem prazo de atendimento definido. Uma auditoria técnica mostra o estado de cada um e o custo de cobri-los.",
    garantia: "Equipamentos em garantia: vale planejar o pós-garantia antes do vencimento.",
    contrato: "Equipamentos com contrato: podemos comparar escopo, prazo e cobertura de peças com o contrato atual.",
  },
};

/* ───────── Guia de falhas ───────── */

export type Prioridade = "critica" | "alerta";
export type ItemGuia = {
  id: string;
  modalidade: ModalidadeId;
  prioridade: Prioridade;
  sintoma: string;
  termos: string;
  causa: string;
  conduta: string;
};

export const guia = {
  seo: {
    title: "Guia de falhas de equipamentos de imagem | Best Medical",
    description: "Sintomas frequentes em ressonância, tomografia e hemodinâmica, a origem provável e a conduta preliminar segura enquanto o técnico não chega.",
  },
  h1: "Guia de falhas",
  intro: "Procure pelo sintoma ou pelo termo que aparece no console. Cada item traz a origem provável e a conduta preliminar segura enquanto a equipe técnica não chega.",
  aviso:
    "Orientação preliminar para a equipe técnica do cliente. Não substitui o manual do fabricante nem o responsável técnico. Em caso de dúvida, não execute e acione o plantão.",
  prioridades: { critica: "Falha crítica", alerta: "Alerta técnico" } satisfies Record<Prioridade, string>,
  /** Origem: bestmedical.ai.studio, sem SLA por item. // REVISAR COM RESPONSÁVEL TÉCNICO (todos os itens) */
  itens: [
    {
      id: "rm-helio",
      modalidade: "rm",
      prioridade: "critica",
      sintoma: "Alarme de baixa pressão de hélio ou cabeçote frio (coldhead) inoperante",
      termos: "helio hélio criogenia compressor coldhead cabeçote pressão quench",
      causa: "Falha no compressor de hélio, vazamento nas linhas flexíveis de alta pressão ou perda de eficiência do cabeçote frio.",
      conduta: "Não desligue o chiller nem a alimentação elétrica da RM. Anote a pressão indicada no compressor e acione o plantão imediatamente.",
    },
    {
      id: "rm-bobina",
      modalidade: "rm",
      prioridade: "alerta",
      sintoma: "Queda da relação sinal-ruído (SNR) ou falha de imagem em uma bobina específica",
      termos: "bobina snr sinal ruído artefato conector desacoplamento pré-amplificador",
      causa: "Dano nos circuitos de desacoplamento, mau contato no conector da mesa ou pré-amplificador integrado com defeito.",
      conduta: "Se possível, repita o exame com outra bobina para separar falha da porta da mesa de falha do acessório. Informe o resultado no chamado.",
    },
    {
      id: "tc-anel",
      modalidade: "tc",
      prioridade: "alerta",
      sintoma: "Artefatos em anel (ring artifacts) ou ruído concêntrico nas imagens",
      termos: "anel ring artifact artefato ruído concêntrico detector das calibração",
      causa: "Descalibração de canal do detector, resíduo no trajeto do feixe ou ganho não linear no sistema de aquisição (DAS).",
      conduta: "Se a equipe for treinada para isso, execute a calibração de ar prevista no console. Se o artefato persistir, suspenda os exames afetados e acione o plantão.",
    },
    {
      id: "tc-tubo",
      modalidade: "tc",
      prioridade: "critica",
      sintoma: "Disparo de raios X interrompido com erro de aquecimento do tubo ou de kV",
      termos: "tubo overheat kv fault aquecimento disparo gerador anodo óleo radiador",
      causa: "Capacidade térmica do anodo saturada, falha na circulação de óleo do tubo ou início de arco elétrico no tubo.",
      conduta: "Aguarde o ciclo de resfriamento indicado pelo sistema, sem forçar novos disparos. Verifique se as entradas de ar do gantry estão desobstruídas e acione o plantão.",
    },
    {
      id: "hemo-flat",
      modalidade: "hemo",
      prioridade: "critica",
      sintoma: "Linhas pretas verticais ou perda de área de imagem no detector flat panel",
      termos: "flat panel detector linhas pretas perda imagem fibra óptica arco",
      causa: "Falha de comunicação na leitura da matriz do detector ou desconexão do cabo de dados.",
      conduta: "Reinicie o sistema de aquisição seguindo a sequência de inicialização do fabricante. Evite movimentar o arco em C até a avaliação dos conectores.",
    },
    {
      id: "mamorx-compressao",
      modalidade: "mamorx",
      prioridade: "alerta",
      sintoma: "Erro de colimador ou bloqueio da pá de compressão no mamógrafo",
      termos: "mamografia colimador compressão pá bloqueio sensor motor",
      causa: "Sensor óptico de fim de curso sujo, motor travado ou célula de carga descalibrada.",
      conduta: "Use a liberação manual de segurança da compressão. Não force a descida motorizada da pá.",
    },
  ] satisfies ItemGuia[],
};
