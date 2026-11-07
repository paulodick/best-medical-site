/** Rotas públicas testadas (espelha src/config/rotas.ts com as modalidades confirmadas). */
export const rotas = [
  "/",
  "/manutencao-ressonancia-magnetica/",
  "/manutencao-tomografia-tubos-raios-x/",
  "/hemodinamica-arcos-cirurgicos/",
  "/reparo-bobinas-ressonancia/",
  "/pecas-e-base-de-troca/",
  "/ferramentas/reparar-ou-trocar/",
  "/ferramentas/simulador-parada/",
  "/ferramentas/monte-seu-parque/",
  "/guia-de-falhas/",
  "/perguntas-frequentes/",
  "/conformidade/",
  "/privacidade/",
];

/** Marca o consentimento como recusado para o banner não cobrir o conteúdo nos testes de fluxo. */
export const semBanner = () => { try { localStorage.setItem("bm_consent", "denied"); } catch { /* */ } };
