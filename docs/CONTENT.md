# CONTENT — mapa de páginas, textos e pendências

Fontes lidas em 2026-11-06:
- **bestmedical.com.br**: landing única com 5 modalidades em uma frase cada, "sempre a favor da vida", Instagram e WhatsApp (wa.link). Sem FAQ, sem números e sem contatos além desses.
- **bestmedical.ai.studio**: SPA lida no navegador. Tem hero, números, especialidades por modalidade, simulador, comparativo, guia de falhas (6 itens), peças/hub logístico e FAQ (6 perguntas).

## Mapa de páginas

| Rota | H1 | Status |
|---|---|---|
| `/` | Menos troca desnecessária. Mais disponibilidade para o seu parque de imagem. | Fase 1 (hero) e Fase 2 |
| `/manutencao-ressonancia-magnetica` | Manutenção de ressonância magnética | Fase 2 |
| `/reparo-bobinas-ressonancia` | Reparo de bobinas de ressonância magnética | Fase 2 |
| `/manutencao-tomografia-tubos-raios-x` | Manutenção de tomografia e tubos de raios X | Fase 2 |
| `/hemodinamica-arcos-cirurgicos` | Manutenção de hemodinâmica e arcos cirúrgicos | Fase 2 |
| `/mamografia-raios-x` | Manutenção de mamografia e raios X | Só se `modalidades.mamografiaRx.confirmada` |
| `/pecas-e-base-de-troca` | Peças com laudo e base de troca | Fase 2 |
| `/ferramentas/reparar-ou-trocar` | Reparar ou trocar? | Fase 3 (pronta) |
| `/ferramentas/simulador-parada` | Simulador de parada | Fase 3 (pronta) |
| `/ferramentas/monte-seu-parque` | Monte seu parque | Fase 3 (pronta) |
| `/guia-de-falhas` | Guia de falhas | Fase 3 (pronta) |
| `/perguntas-frequentes` | Perguntas frequentes | Fase 2 |
| `/conformidade` | Conformidade e documentos | Fase 2 |
| `/privacidade` | Política de privacidade | Fase 2 |
| `/conteudos/[slug]` | (por conteúdo) | `published:false`, noindex |

## Reaproveitado do site atual (com ajustes de regra)

| Conteúdo | Origem | Ajuste |
|---|---|---|
| Componentes por modalidade (criogenia/coldhead, gradientes X·Y·Z, cadeia RF; tubos, gerador AT, detectores/DAS; flat panel, tubos de fluoroscopia, arco em C; detectores DR, colimadores) | ai.studio | Frases genéricas marcadas `// REVISAR COM RESPONSÁVEL TÉCNICO`; nomes comerciais de fabricante removidos |
| Guia de falhas (6 itens) | ai.studio | **SLA por item removido** (regra do brief); aviso fixo adicionado |
| Simulador: exames/dia 5–80 (padrão 24), ticket R$ 150–2.500 (padrão 850), dias parados 1–15 (padrão 5) | ai.studio | Adicionado "dias com a Best Medical" (padrão 1) e premissas visíveis; frase "Estimativa; depende dos dados informados." |
| FAQ (6 perguntas) | ai.studio | Números passam a vir do `claims.ts`; "peças originais" vira o termo definido; nomes de marca só em texto com a nota de titularidade |
| Contratos Full / Light / sob demanda | ai.studio (FAQ) | Mantidos como texto; `// CONFIRMAR` |
| "A favor da vida" | bestmedical.com.br | Fecho do rodapé |

## Removido por regra do brief
- "Preços cartelizados", "Frequentemente em desacordo com as normas sanitárias" e a coluna "Assistência genérica" do comparativo.
- "Peças originais" e "peças homologadas" passam a "nova, revisada, remanufaturada, base de troca", com definição.
- A contradição "até 45%" (hero) × "30% a 50%" (tabela): fica um valor único em `claims.economia`.
- "Especialistas GE, Siemens, Philips e Canon" como selo: marcas só em texto, com a nota "Marcas citadas pertencem a seus titulares".
- SLA por item do guia de falhas (4h, 6h, 8h, 12h).

## Depende de confirmação (`src/config/claims.ts`, marcado `// CONFIRMAR`)

| Afirmação | Valor pré-preenchido | Origem |
|---|---|---|
| Economia vs. fabricante | 30% a 50% | brief + ai.studio |
| SLA de emergência (`slaEmergenciaHoras`) | 4 h | brief + ai.studio |
| Disponibilidade média sob contrato | 99,4% | ai.studio |
| Peças em estoque | +2.500 | ai.studio |
| Equipamentos ativos atendidos | +450 | ai.studio |
| Garantia de peças | 90 a 180 dias | ai.studio |
| Teste em bancada na base de troca | sim | brief + ai.studio |
| Laudo com ART, engenheiro com CREA, calibração rastreável RBC | sim | ai.studio |
| RDC Anvisa 509/2021 e 611/2022 | citadas | ai.studio |
| Mamografia e raios X | `confirmada: false` | bestmedical.com.br |

Interruptor global `claimsPolicy.somenteConfirmados`: com `true`, só aparecem as afirmações com `confirmado: true`. Ligue antes de publicar.

## O cliente precisa preencher
- Rua e número, responsáveis técnicos e CREA, `urlDoSite`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_FORM_ENDPOINT`.
- Fonte e período de cada número; casos, depoimentos e logos de clientes com autorização.
- Fotos reais (laboratório, estoque, equipe), que hoje são placeholders trocáveis pelo `site.ts`.
- Versão do logo para fundo escuro (opcional).
