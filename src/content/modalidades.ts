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
  /** o que é a peça, em linguagem simples (opcional) */
  oQue?: string; // REVISAR COM RESPONSÁVEL TÉCNICO
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
      { id: "criogenia", nome: "Sistema criogênico", x: 44, y: 12, oQue: "Cabeçote frio no alto do magneto, ligado ao compressor: mantém o hélio líquido que deixa o magneto supercondutor.", fazemos: "Acompanhamos pressão e nível de hélio e fazemos a manutenção preventiva de cabeçote frio e compressor." },
      { id: "magneto", nome: "Magneto principal", x: 24, y: 27, oQue: "Bobinas supercondutoras dentro do criostato, imersas em hélio, que geram o campo principal.", fazemos: "Verificamos estabilidade de campo e homogeneidade dentro dos procedimentos de manutenção preventiva." },
      { id: "gradiente", nome: "Gradientes", x: 62, y: 37.6, oQue: "Camada entre o magneto e a bobina de corpo que varia o campo nos eixos X, Y e Z para localizar o sinal na imagem.", fazemos: "Testamos amplificadores e bobinas de gradiente X, Y e Z para localizar a falha antes de indicar a troca de módulo." },
      { id: "bobinas", nome: "Bobinas de RF", x: 38.5, y: 47, oQue: "A bobina de corpo, embutida em volta do túnel, e as bobinas de recepção colocadas sobre o paciente: emitem e captam o sinal de radiofrequência.", fazemos: "Avaliamos conectores, pré-amplificadores e circuitos de desacoplamento e reparamos a bobina em bancada quando o defeito é localizado." },
      { id: "mesa", nome: "Mesa e acionamento", x: 86.5, y: 71, oQue: "Leva o paciente para dentro do túnel e faz a ligação das bobinas de recepção.", fazemos: "Revisamos acionamento, sensores de posição e conectores de bobina na mesa do paciente." },
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
  mamo: {
    id: "mamo",
    hud: "MG · digital e CR",
    titulo: "Mamografia",
    resumo: "Mamógrafos digitais e CR: cabeçote do tubo, bandeja de compressão, detector ou porta-cassetes e braço em C.",
    servicos: [
      "Tubos, filtros e colimação de mamografia", // REVISAR COM RESPONSÁVEL TÉCNICO
      "Sistema de compressão: motor, freio e célula de carga", // REVISAR COM RESPONSÁVEL TÉCNICO
      "Detectores DR, porta-cassetes e grade", // REVISAR COM RESPONSÁVEL TÉCNICO
      "Movimentos do braço em C: altura e angulação", // REVISAR COM RESPONSÁVEL TÉCNICO
    ],
    hotspots: [
      { id: "tubo", nome: "Cabeçote do tubo", x: 42, y: 16.4, oQue: "Abriga o tubo de raios X, os filtros e o colimador, no alto do braço em C.", fazemos: "Avaliamos tubo, filtros e colimação conforme o procedimento de manutenção." },
      { id: "protetor", nome: "Protetor facial", x: 22.8, y: 36.8, oQue: "Placa transparente que afasta o rosto da paciente do feixe e do cabeçote.", fazemos: "Conferimos fixação e integridade do protetor e de seus encaixes." },
      { id: "compressao", nome: "Bandeja de compressão", x: 41, y: 52.2, oQue: "Pá transparente que desce sobre a mama para espalhar e imobilizar o tecido durante a exposição.", fazemos: "Revisamos motor, freio, sensores de fim de curso e célula de carga, e conferimos a força indicada." },
      { id: "detector", nome: "Detector ou porta-cassetes", x: 41, y: 71.2, oQue: "O suporte onde a mama apoia. Embaixo dele fica o detector digital ou, em sistemas CR, o porta-cassetes (bucky) com a grade.", fazemos: "Verificamos detector, grade e calibração após qualquer intervenção." },
      { id: "braco", nome: "Braço em C e coluna", x: 77, y: 46, oQue: "Estrutura que sobe, desce e gira o conjunto para as incidências, como a crânio-caudal e a oblíqua.", fazemos: "Revisamos motores, freios e sensores de altura e angulação." },
    ],
    seo: {
      title: "Manutenção de mamógrafos | Best Medical",
      description: "Manutenção de mamógrafos digitais e CR: tubo, colimação, bandeja de compressão, detector ou porta-cassetes e braço em C.",
      h1: "Manutenção de mamografia",
      intro: "Tubo, compressão, detector e braço em C avaliados antes de qualquer orçamento de troca, com laudo ao final.",
    },
  },
  rx: {
    id: "rx",
    hud: "RX · DR e CR",
    titulo: "Raios X",
    resumo: "Salas de radiologia geral: tubo e colimador, estativas, bucky mural e de mesa, detectores DR e gerador.",
    servicos: [
      "Tubos de radiologia geral e colimadores manuais e motorizados", // REVISAR COM RESPONSÁVEL TÉCNICO
      "Estativas porta-tubo e murais: trilhos, freios e contrapeso", // REVISAR COM RESPONSÁVEL TÉCNICO
      "Bucky mural e de mesa, grades e detectores DR", // REVISAR COM RESPONSÁVEL TÉCNICO
      "Geradores e cabos de alta tensão", // REVISAR COM RESPONSÁVEL TÉCNICO
    ],
    hotspots: [
      { id: "tubo", nome: "Tubo e colimador", x: 53.7, y: 30, oQue: "O tubo produz os raios X. O colimador, logo abaixo, limita o campo com lâminas e mostra a área a ser exposta com uma luz.", fazemos: "Avaliamos tubo, lâmpada e lâminas do colimador e o alinhamento entre luz e campo." },
      { id: "estativa", nome: "Estativa porta-tubo", x: 74, y: 15, oQue: "A coluna que sustenta o tubo e permite movê-lo na altura, ao longo do trilho e em rotação. Pode ser de piso ou de teto.", fazemos: "Revisamos trilhos, freios, cabos de sustentação e contrapeso." },
      { id: "bucky-mural", nome: "Bucky mural", x: 14, y: 50.6, oQue: "O receptor na parede para exames em pé, como o de tórax. Guarda o detector ou o cassete atrás da grade antidifusora.", fazemos: "Verificamos o movimento da grade, as travas e o encaixe do detector." },
      { id: "estativa-mural", nome: "Estativa mural", x: 7.2, y: 82, oQue: "A coluna vertical que segura o bucky mural e ajusta a altura dele ao paciente.", fazemos: "Revisamos contrapeso, freio e deslizamento da coluna." },
      { id: "mesa", nome: "Mesa e bucky de mesa", x: 53.7, y: 64.8, oQue: "O tampo onde o paciente deita. O bucky de mesa corre por baixo do tampo, com a grade e o detector.", fazemos: "Revisamos freios do tampo, trilho do bucky e movimento da grade." },
      { id: "gerador", nome: "Gerador de alta tensão", x: 88.3, y: 78, oQue: "Converte a energia da rede na alta tensão que alimenta o tubo durante a exposição.", fazemos: "Testamos gerador e cabos de alta tensão antes de indicar a troca de placa." },
    ],
    seo: {
      title: "Manutenção de raios X | Best Medical",
      description: "Manutenção de salas de raios X: tubo e colimador, estativas, bucky mural e de mesa, detectores DR e gerador de alta tensão.",
      h1: "Manutenção de raios X",
      intro: "Tubo, estativas, buckys e gerador avaliados antes de qualquer orçamento de troca, com laudo ao final.",
    },
  },
};
