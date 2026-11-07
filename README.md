# Best Medical: site

Next.js 16 (App Router, exportação estática), TypeScript estrito, Tailwind CSS 4, React Hook Form + Zod e next-intl (preparado para pt, en e es; só pt é publicado).

## Rodar

```bash
npm install
cp .env.example .env.local   # preencha o que tiver
npm run dev                  # http://localhost:3000
npm run build                # gera out/ (site estático)
```

## Variáveis de ambiente

| Variável | Para quê | Vazia |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Domínio final: canonical, sitemap, Open Graph, JSON-LD, llms.txt | usa `https://www.bestmedical.com.br` |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager (`GTM-XXXX`). Só carrega depois do "Aceitar" no banner | GTM não carrega |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Recebe o POST JSON do formulário de chamado | o formulário abre o WhatsApp com tudo o que foi digitado |

As três são lidas no build: depois de mudar, rode `npm run build` de novo.

## Onde trocar conteúdo

Nenhum dado de negócio fica nos componentes. Campo vazio não renderiza.

| O quê | Arquivo |
|---|---|
| Contatos, razão social, CNPJ, endereço, responsáveis técnicos, fotos, mensagens do WhatsApp, modalidades confirmadas (`confirmada: true`), casos, depoimentos e documentos | `src/config/site.ts` |
| Números e afirmações (economia, SLA, estoque…) com fonte e período; termos de peças | `src/config/claims.ts` |
| Menu (Soluções, Ferramentas) | `src/config/nav.ts` |
| Textos da home e das páginas | `src/content/home.ts`, `src/content/paginas.ts`, `src/content/modalidades.ts` |
| Ferramentas: perguntas e resultados do assistente, premissas do simulador, guia de falhas | `src/content/ferramentas.ts` |
| Perguntas frequentes | `src/content/faq.ts` |
| Artigos (`/conteudos/…`): `published: false` = noindex e fora do sitemap | `src/content/conteudos.ts` |
| Política de privacidade | `src/content/privacidade.ts` |
| Textos de interface | `messages/pt.json` |
| Cores e tipografia | `src/app/globals.css` (`@theme`) e `docs/DESIGN.md` |

Marcadores no código:
- `// CONFIRMAR`: veio do site atual e precisa ser validado pela operação.
- `// REVISAR COM RESPONSÁVEL TÉCNICO`: frase técnica (componentes, condutas do guia, regra do assistente).
- `REVISAR COM JURÍDICO`: política de privacidade.

Antes de publicar, defina `claimsPolicy.somenteConfirmados = true` em `claims.ts` para exibir só os números confirmados (com `confirmado: true`).

## Formulário de chamado

POST JSON para `NEXT_PUBLIC_FORM_ENDPOINT` com: `ref` (código BM-AAMMDD-XXXX), campos do formulário, `pagina`, `url`, `atribuicao` (utm_*, gclid, fbclid), `ferramenta` e `dadosFerramenta` (assistente, simulador ou parque) e `enviadoEm`. Resposta 2xx = sucesso. Sem endpoint, erro ou demora acima de 8 s: abre o WhatsApp com os dados e o código.

## Medição (GTM)

Consent Mode v2 com padrão negado no `<head>`. Eventos enviados ao `dataLayer`:
`generate_lead`, `click_whatsapp`, `click_tel`, `click_email`, `form_open`, `form_start`, `scanner_interact`, `modality_select`, `hotspot_open`, `wizard_start`, `wizard_complete`, `simulator_result`, `parque_complete`, `guide_open`, `guide_cta_click`, `faq_open`, `search_open`.

## SEO e IA

Gerados no build: `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/busca.json` e uma imagem Open Graph 1200×630 por página em `/og/<rota>.png`. JSON-LD: Organization e WebSite (todas as páginas), ProfessionalService (home e conformidade), Service (modalidades), FAQPage e BreadcrumbList.

## Verificação

```bash
npm run verificar
```

Roda, em ordem: lint, typecheck, build de teste (gera `out/` e `.teste-endpoint/`, um build com endpoint falso para testar envio e falha), testes Playwright (desktop e celular: SEO, acessibilidade com axe, console e 404, consentimento, movimento reduzido, emergência, formulário com e sem endpoint, simulador, assistente, parque, guia, busca, teclado e menu móvel) e Lighthouse CI no perfil móvel (falha se Performance < 90 ou Acessibilidade, SEO e Boas práticas < 95). Os testes usam o Google Chrome instalado na máquina; para o Lighthouse, se precisar, defina `CHROME_PATH`.

## Prévia no GitHub Pages

A cada push na branch `main`, o workflow `.github/workflows/pages.yml` roda lint, typecheck e build, e publica em `https://<usuário>.github.io/<repositório>/`. A prévia sai com `noindex` e `robots.txt` bloqueando tudo, para não competir com o domínio oficial nos buscadores. As variáveis `NEXT_PUBLIC_BASE_PATH` e `NEXT_PUBLIC_PREVIEW` só existem para isso.

## Publicar

`npm run build` gera a pasta `out/`. Cada rota sai como `rota/index.html`, então qualquer hospedagem estática serve sem regra de reescrita (Netlify, Vercel, Cloudflare Pages, S3, Apache, Nginx). Configure a página de erro como `404.html`.

Documentação: `docs/DESIGN.md`, `docs/CONTENT.md`, `BRIEF.md`. Estudos visuais iniciais em `estudos/`. Screenshots de cada fase em `docs/screenshots/`.
