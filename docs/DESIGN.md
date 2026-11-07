# DESIGN — Best Medical · "Sala de comando de imagem"

Direção aprovada: **Estudo A · Torre de controle** (`estudos/a-torre.html`). Escuro calmo, dados precisos, ciano só como acento.

## Origem das cores
Extraídas de `public/brand/logo-best-medical.webp`:

| Amostra no logo | Hex | Vira |
|---|---|---|
| Linha de ECG | `#90DEF6` / `#82DBF8` | `accent` |
| Anel de aço | `#4E7598` / `#516D91` | `steel` |
| Nome "Best Medical" | `#303D50` | base de `bg` (escurecida para azul-petróleo) |
| Lema | `#2B3339` | `graphite` |

## Tokens (`src/app/globals.css`, `@theme`)

| Token | Valor | Uso | Contraste sobre `bg` |
|---|---|---|---|
| `bg` | `#07121B` | Fundo da página | — |
| `bg-2` | `#0B1823` | Faixas, cartões | — |
| `bg-3` | `#102231` | Cartão em foco, inputs | — |
| `ink` | `#E7EEF3` | Texto principal | 16,6:1 |
| `ink-soft` | `#B4C4D1` | Texto secundário | 10,6:1 |
| `ink-mute` | `#8DA2B3` | Rótulos, notas | 7,0:1 |
| `accent` | `#90DEF6` | Botão principal, varredura, HUD | 12,4:1 |
| `on-accent` | `#05202C` | Texto sobre accent | 11,3:1 |
| `steel` | `#5C86A6` | Ilustração, linhas | (não usado em texto) |
| `line` | `rgba(144,222,246,.12)` | Divisórias, grid | — |
| `line-strong` | `rgba(180,196,209,.35)` | Botão fantasma | — |
| `danger` | `#FFB4A8` | Erros de formulário | 11,0:1 |

Regras: o acento aparece no botão principal, na varredura, nos rótulos HUD e no pico. Sem degradê roxo, texto em degradê ou neon. O "brilho ciano" é só um `drop-shadow` de 6px na linha de varredura.

## Tipografia
- **Plus Jakarta Sans** (400–800) para títulos e texto, e **JetBrains Mono** (500–600) para o micro-HUD. Ambas via `next/font/google` com `display: swap`.
- Escala: 12 (HUD) · 15 · 17 · 20 · 28 · 40 · 56 · 76. H1 `clamp(34px, 4.5vw, 76px)`, peso 800, tracking −0,035em.
- HUD: mono 12px, caixa alta, tracking 0,08em. Números: `tabular-nums`.
- Corpo: 16–17px, máximo de 65 caracteres por linha.

## Grid e espaço
- Container máximo de 1360px, gutter de 20px (mobile) e 40px (≥768).
- Espaçamento: 8 · 16 · 24 · 40 · 64 · 104 · 160.
- Breakpoints testados: 375 · 768 · 1280 · 1920. O menu completo entra a partir de 1100px.
- Fundo do hero: grid técnico de 48px com máscara radial e linhas de varredura a 1,8% de opacidade.

## Movimento
| Onde | Família | Detalhe |
|---|---|---|
| Hero | Máscara interativa | Varredura segue o cursor/dedo; ciclo lento em ocioso; no toque, a fase soma a rolagem |
| Números | Contagem | Sobe uma vez ao entrar na tela (IntersectionObserver), 1,2s |
| Reparar antes de trocar (pico) | Cena fixa + traço | `position: sticky` com ~4 telas; o caminho SVG se desenha com `stroke-dashoffset` |
| Modalidades | Troca de vista | Crossfade e hotspots com pulso discreto |
| Peças / Atendimento | Linha do tempo horizontal / vertical | Famílias diferentes em seções vizinhas |

- Só `transform` e `opacity` (e atributos SVG na máscara).
- Com `prefers-reduced-motion`, tudo para: o interior do equipamento aparece inteiro, os números aparecem no valor final e as cenas fixas viram blocos normais.
- Lenis fica desligado (opcional, não incluído na Fase 1).

## Componentes (Fase 1)
- `Header`: logo (símbolo recortado + nome em texto), nav, mega-menu de Soluções e menu de Ferramentas, botão Plantão 24h, menu móvel em `dialog`.
- `MobileDock`: barra inferior fixa (<768) com Plantão 24h (WhatsApp) e Solicitar atendimento.
- `Hero` + `Scanner`: ilustração SVG própria de RM em duas camadas; a máscara é controlada por rAF, sem re-render do React.
- `NumbersStrip`: lê `claims.ts` e não renderiza nada sem valor.
- `StatusStrip`: fatos do `site.ts` (modalidades, abrangência, base, atendimento).
- Botões: `primary` (accent), `ghost` (borda), altura mínima de 48px, foco com contorno ciano de 2px.

## Logo
O nome do lockup é escuro (`#303D50`) e some sobre o fundo escuro. Por isso o cabeçalho usa o símbolo recortado com o nome em texto HTML. O logo completo só aparece sobre superfície clara. **Pendente:** versão do logo para fundo escuro, se existir.
