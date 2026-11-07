/**
 * Conteúdo técnico por modalidade. Base: site atual (bestmedical.ai.studio), reescrito sem marcas e sem promessas.
 * Todas as frases técnicas: // REVISAR COM RESPONSÁVEL TÉCNICO
 */
import type { ModalidadeId } from "./types";

export type Hotspot = {
  id: string;
  nome: string;
  /** posição no diagrama, em % do viewBox */
  x: number;
  y: number;
  /** o que fazemos ali: uma frase técnica genérica */
  fazemos: string; // REVISAR COM RESPONSÁVEL TÉCNICO
};

export type ModalidadeConteudo = {
  id: ModalidadeId;
  hud: string;
  titulo: string;
  resumo: string;
  servicos: string[];
  hotspots: Hotspot[];
  // SEO da página da modalidade
  seo: { title: string; description: string; h1: string; intro: string };
};

export const conteudoModalidades: Record<ModalidadeId, ModalidadeConteudo> = {
  rm: {
    id: "rm",
    hud: "RM · 1.5T / 3.0T",
    titulo: "Ressonância magnética",
    resumo:
      "Manutenção preventiva e corretiva de sistemas de alto campo: criogenia, gradientes, cadeia de radiofrequência e bobinas.",
    servicos: [
      "Monitoramento de hélio, cabeçote frio (coldhead) e compressor", // REVISAR COM RESPONSÁVEL TÉCNICO
      "Amplificadores e bobinas de gradiente X, Y e Z", // REVISAR COM RESPONSÁVEL TÉCNICO
      "Cadeia de transmissão e recepção de RF", // REVISAR COM RESPONSÁVEL TÉCNICO
      "Diagnóstico e reparo de bobinas de recepção em bancada", // REVISAR COM RESPONSÁVEL TÉCNICO
    ],
    hotspots: [
      { id: "bobinas", nome: "Bobinas de RF", x: 50, y: 30, fazemos: "Avaliamos conectores, pré-amplificadores e circuitos de desacoplamento e reparamos a bobina em bancada quando o defeito é localizado." },
      { id: "criogenia", nome: "Sistema criogênico", x: 50, y: 6, fazemos: "Acompanhamos pressão e nível de hélio e fazemos a manutenção preventiva de cabeçote frio e compressor." },
      { id: "gradiente", nome: "Gradientes", x: 76, y: 34, fazemos: "Testamos amplificadores e bobinas de gradiente X, Y e Z para localizar a falha antes de indicar a troca de módulo." },
      { id: "magneto", nome: "Magneto principal", x: 22, y: 60, fazemos: "Verificamos estabilidade de campo e homogeneidade dentro dos procedimentos de manutenção preventiva." },
      { id: "mesa", nome: "Mesa e acionamento", x: 64, y: 86, fazemos: "Revisamos acionamento, sensores de posição e conectores de bobina na mesa do paciente." },
    ],
    seo: {
      title: "Manutenção de ressonância magnética | Best Medical",
      description:
        "Manutenção preventiva e corretiva de ressonância magnética: criogenia, gradientes, RF e bobinas. Engenharia clínica independente, plantão 24h.",
      h1: "Manutenção de ressonância magnética",
      intro:
        "Criogenia, gradientes, cadeia de RF e bobinas avaliados por dentro antes de qualquer orçamento de troca. Atendimento em todo o Brasil e no exterior.",
    },
  },
  tc: {
    id: "tc",
    hud: "TC · multislice",
    titulo: "Tomografia computadorizada",
    resumo: "Tubos de raios X, gerador de alta tensão, detectores e gantry, com calibração após a intervenção.",
    servicos: [
      "Tubos de raios X novos, revisados ou remanufaturados", // REVISAR COM RESPONSÁVEL TÉCNICO
      "Geradores de alta tensão (inversores e tanques)", // REVISAR COM RESPONSÁVEL TÉCNICO
      "Detectores e sistema de aquisição de dados (DAS)", // REVISAR COM RESPONSÁVEL TÉCNICO
      "Diagnóstico de gantry e calibração após intervenção", // REVISAR COM RESPONSÁVEL TÉCNICO
    ],
    hotspots: [
      { id: "tubo", nome: "Tubo de raios X", x: 50, y: 14, fazemos: "Analisamos histórico de uso, filamento e anodo e indicamos tubo novo, revisado ou remanufaturado conforme o caso." },
      { id: "gerador", nome: "Gerador de alta tensão", x: 20, y: 34, fazemos: "Testamos inversores e tanque de alta tensão para separar falha do gerador de falha do tubo." },
      { id: "detector", nome: "Detector e DAS", x: 50, y: 82, fazemos: "Verificamos canais do detector e do sistema de aquisição e executamos calibrações após a intervenção." },
      { id: "gantry", nome: "Gantry", x: 82, y: 40, fazemos: "Revisamos rotação, refrigeração e transmissão de dados do gantry na manutenção preventiva." },
      { id: "mesa", nome: "Mesa", x: 56, y: 60, fazemos: "Revisamos movimentação e sensores de posição da mesa." },
    ],
    seo: {
      title: "Manutenção de tomografia e tubos de raios X | Best Medical",
      description:
        "Manutenção de tomógrafos: tubos de raios X, gerador de alta tensão, detectores e gantry. Diagnóstico antes do orçamento. Plantão 24h.",
      h1: "Manutenção de tomografia e tubos de raios X",
      intro:
        "Tubo, gerador, detector e gantry: localizamos a falha antes de indicar a peça, e a troca de tubo só entra quando é necessária.",
    },
  },
  hemo: {
    id: "hemo",
    hud: "HEMO · arco em C",
    titulo: "Hemodinâmica e arcos cirúrgicos",
    resumo: "Salas de hemodinâmica, angiografia e arcos cirúrgicos: detectores flat panel, tubos de fluoroscopia e posicionamento.",
    servicos: [
      "Detectores digitais flat panel", // REVISAR COM RESPONSÁVEL TÉCNICO
      "Tubos de fluoroscopia e radiografia", // REVISAR COM RESPONSÁVEL TÉCNICO
      "Arco em C e motores de posicionamento", // REVISAR COM RESPONSÁVEL TÉCNICO
      "Geradores e sistema de aquisição de imagem", // REVISAR COM RESPONSÁVEL TÉCNICO
    ],
    hotspots: [
      { id: "arco", nome: "Arco em C", x: 24, y: 46, fazemos: "Revisamos motores, freios e sensores de posicionamento do arco e da estativa." },
      { id: "detector", nome: "Detector flat panel", x: 62, y: 12, fazemos: "Avaliamos leitura, conexões de dados e calibração do detector antes de indicar a troca." },
      { id: "tubo", nome: "Tubo de fluoroscopia", x: 62, y: 84, fazemos: "Analisamos o tubo e a refrigeração para separar falha do tubo de falha do gerador." },
      { id: "mesa", nome: "Mesa de procedimento", x: 86, y: 60, fazemos: "Revisamos movimentação e travas da mesa de procedimento." },
    ],
    seo: {
      title: "Manutenção de hemodinâmica e arcos cirúrgicos | Best Medical",
      description:
        "Manutenção de hemodinâmica, angiografia e arcos cirúrgicos: detectores flat panel, tubos e posicionamento. Plantão 24h em todo o Brasil.",
      h1: "Manutenção de hemodinâmica e arcos cirúrgicos",
      intro:
        "Sala parada é procedimento remarcado. Detector, tubo e arco em C avaliados com prioridade, com laudo ao final.",
    },
  },
  mamorx: {
    id: "mamorx",
    hud: "MG · RX digital",
    titulo: "Mamografia e raios X",
    resumo: "Mamografia digital e radiologia geral: detectores DR, tubos, colimadores e sistema de compressão.",
    servicos: [
      "Detectores DR", // REVISAR COM RESPONSÁVEL TÉCNICO
      "Tubos de mamografia e de radiologia geral", // REVISAR COM RESPONSÁVEL TÉCNICO
      "Colimadores manuais e motorizados", // REVISAR COM RESPONSÁVEL TÉCNICO
      "Sistema de compressão", // REVISAR COM RESPONSÁVEL TÉCNICO
    ],
    hotspots: [
      { id: "tubo", nome: "Tubo", x: 50, y: 12, fazemos: "Avaliamos tubo e colimação conforme o procedimento de manutenção." },
      { id: "compressao", nome: "Compressão", x: 50, y: 50, fazemos: "Revisamos sensores, motor e célula de carga do sistema de compressão." },
      { id: "detector", nome: "Detector", x: 50, y: 78, fazemos: "Verificamos detector e calibração após intervenção." },
    ],
    seo: {
      title: "Manutenção de mamografia e raios X | Best Medical",
      description: "Manutenção de mamógrafos e equipamentos de raios X digital: detectores, tubos, colimadores e compressão.",
      h1: "Manutenção de mamografia e raios X",
      intro: "Detectores, tubos, colimadores e compressão, com laudo ao final.",
    },
  },
};
