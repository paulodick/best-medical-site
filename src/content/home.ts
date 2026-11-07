/** Textos das seções da home. Números vêm de claims.ts; contatos de site.ts. */
import { claim, termosPecas } from "@/config/claims";

export const reparar = {
  id: "reparar",
  eyebrow: "Reparar antes de trocar",
  titulo: "Troca é a última etapa, não a primeira.",
  passos: [
    {
      n: "01",
      hud: "Diagnóstico",
      titulo: "Diagnóstico antes do orçamento",
      texto:
        "Antes de falar em peça nova, localizamos a falha: logs, testes de subsistema e medições. O orçamento vem depois do diagnóstico, e não no lugar dele.",
    },
    {
      n: "02",
      hud: "Reparo",
      titulo: "Reparo quando é seguro e econômico",
      texto:
        "Se o componente pode ser reparado com segurança, reparamos: bobinas, placas e módulos voltam testados em bancada e com laudo.",
    },
    {
      n: "03",
      hud: "Troca",
      titulo: "Troca só quando necessária",
      texto:
        "Quando o reparo não compensa ou não é seguro, indicamos a troca e mostramos o porquê, com a opção de peça nova, revisada, remanufaturada ou em base de troca.",
    },
  ],
  fecho: "A Best Medical ganha quando o cliente economiza.",
  economia: () => claim("economia"),
};

export const explorador = {
  id: "modalidades",
  eyebrow: "Explorador de modalidades",
  titulo: "Escolha o equipamento. Veja onde atuamos.",
  texto: "Toque nos pontos para ver o que fazemos em cada componente.",
  verDetalhes: "Ver detalhes da modalidade",
  nota: "Descrição técnica genérica; o escopo de cada atendimento é definido após o diagnóstico.",
};

export const ferramentasSecao = {
  id: "ferramentas",
  eyebrow: "Ferramentas",
  titulo: "Meça, compare e decida antes de ligar.",
  itens: [
    { href: "/ferramentas/reparar-ou-trocar", hud: "Assistente · 5 perguntas", titulo: "Reparar ou trocar?", texto: "Uma orientação preliminar sobre o caminho mais provável para o seu caso." },
    { href: "/ferramentas/simulador-parada", hud: "Simulador", titulo: "Quanto custa a máquina parada", texto: "Exames por dia, ticket médio e dias de parada: veja o impacto e as premissas." },
    { href: "/ferramentas/monte-seu-parque", hud: "Inventário", titulo: "Monte seu parque", texto: "Marque seus equipamentos e a situação de cada um. Recebemos um resumo pronto." },
    { href: "/guia-de-falhas", hud: "Consulta", titulo: "Guia de falhas", texto: "Sintomas frequentes e a conduta preliminar segura enquanto o técnico não chega." },
  ],
};

export const pecas = {
  id: "pecas",
  eyebrow: "Peças e base de troca",
  titulo: "O caminho de cada peça, do recebimento à garantia.",
  etapas: [
    { hud: "01", titulo: "Recebimento", texto: "Registro de origem, número de série e estado de entrada." },
    { hud: "02", titulo: "Teste", texto: "Teste funcional em bancada antes da expedição." },
    { hud: "03", titulo: "Laudo", texto: "Laudo do teste acompanha a peça, com rastreabilidade." },
    { hud: "04", titulo: "Garantia", texto: "Nota fiscal e garantia formal da Best Medical." },
  ],
  garantia: () => claim("garantiaPecas"),
  termos: [
    { termo: "Nova", def: termosPecas.nova },
    { termo: "Revisada", def: termosPecas.revisada },
    { termo: "Remanufaturada", def: termosPecas.remanufaturada },
    { termo: "Base de troca", def: termosPecas.baseDeTroca },
  ],
  cta: "Consultar uma peça",
  link: "Ver peças e base de troca",
};

export const atendimento = {
  id: "atendimento",
  eyebrow: "Como atendemos",
  titulo: "Do chamado ao laudo, em cinco etapas.",
  etapas: [
    { titulo: "Chamado", texto: "Pelo WhatsApp do plantão, telefone ou formulário. Você recebe um código de referência." },
    { titulo: "Triagem", texto: "Um especialista entende os sintomas, pede logs e fotos e identifica a peça provável." },
    { titulo: "Diagnóstico", texto: "Remoto ou no local, para confirmar a causa antes de qualquer orçamento." },
    { titulo: "Execução", texto: "Reparo ou troca, com peça testada e o equipamento de volta à operação." },
    { titulo: "Laudo", texto: "Relatório técnico do que foi feito, com ART quando aplicável." },
  ],
  sla: () => claim("slaEmergencia"),
};

export const prova = {
  id: "conformidade",
  eyebrow: "Prova e conformidade",
  titulo: "Quem somos, no papel.",
  empresa: "Empresa",
  responsaveis: "Responsáveis técnicos",
  documentos: "Documentos para licitação",
  documentosTexto: "Enviamos sob solicitação:",
  pedirDocumentos: "Solicitar documentos",
  laudo: "Exemplo de laudo",
  casos: "Casos",
  depoimentos: "Depoimentos",
  verConformidade: "Ver página de conformidade",
};

export const fechamento = {
  id: "contato",
  eyebrow: "Contato",
  titulo: "Equipamento parado? Fale com a engenharia agora.",
  texto: "Use o plantão para emergências. Para orçamento, auditoria ou contrato, deixe os dados e retornamos.",
};
