import { expect, test, type Page } from "@playwright/test";
import { semBanner } from "./rotas";

const ENDPOINT = "https://formulario.teste/lead";
const eventos = (page: Page) => page.evaluate(() => ((window as unknown as { dataLayer?: { event?: string }[] }).dataLayer ?? []).map((d) => d.event).filter(Boolean));

async function preencherEmergencia(page: Page) {
  await page.locator("#lf-nome").fill("Teste Playwright");
  await page.locator("#lf-tel").fill("11912345678");
  await expect(page.locator("#lf-tel")).toHaveValue("(11) 91234-5678");
  await page.locator("#lf-mod").selectOption("rm");
  await page.locator('input[name="consentimento"]').check();
}

test.beforeEach(async ({ page }) => { await page.addInitScript(semBanner); });

test("emergência: plantão no WhatsApp a 1 clique da home", async ({ page, isMobile }) => {
  await page.goto("/");
  const plantao = isMobile
    ? page.getByRole("navigation", { name: /atalhos|contato/i }).getByRole("link", { name: /Plantão 24h/ })
    : page.locator("header").getByRole("link", { name: /Plantão 24h/ });
  await expect(plantao.first()).toBeVisible();
  await expect(plantao.first()).toHaveAttribute("href", /wa\.me\/5511918661002/);
});

test("formulário sem endpoint: abre o WhatsApp com os dados digitados", async ({ page }) => {
  await page.goto("/#contato");
  await preencherEmergencia(page);
  const [popup] = await Promise.all([page.waitForEvent("popup"), page.getByRole("button", { name: /Acionar plantão/ }).click()]);
  const texto = decodeURIComponent(popup.url()).replace(/\+/g, " ");
  expect(texto).toContain("Teste Playwright");
  expect(texto).toMatch(/BM-\d{6}-[A-Z0-9]{4}/);
  await expect(page.getByText("Seu chamado está pronto para enviar.")).toBeVisible();
  expect(await eventos(page)).toContain("generate_lead");
});

test.describe("formulário com endpoint", () => {
  test.use({ baseURL: "http://localhost:4611" });

  test("sucesso: confirma e oferece continuar no WhatsApp", async ({ page }) => {
    let corpo: Record<string, unknown> = {};
    await page.route(ENDPOINT, async (r) => { corpo = r.request().postDataJSON(); await r.fulfill({ status: 200, body: "{}" }); });
    await page.goto("/?utm_source=teste&utm_campaign=e2e#contato");
    await preencherEmergencia(page);
    await page.getByRole("button", { name: /Acionar plantão/ }).click();
    await expect(page.getByText("Recebemos seu chamado.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Continuar no WhatsApp" })).toHaveAttribute("href", /wa\.me|whatsapp/);
    expect(corpo.nome).toBe("Teste Playwright");
    expect(JSON.stringify(corpo.atribuicao)).toContain("teste");
  });

  test("falha: cai no WhatsApp sem perder o que foi digitado", async ({ page }) => {
    await page.route(ENDPOINT, (r) => r.fulfill({ status: 500, body: "erro" }));
    await page.goto("/#contato");
    await preencherEmergencia(page);
    const [popup] = await Promise.all([page.waitForEvent("popup"), page.getByRole("button", { name: /Acionar plantão/ }).click()]);
    expect(decodeURIComponent(popup.url()).replace(/\+/g, " ")).toContain("Teste Playwright");
    await expect(page.getByText(/Não conseguimos enviar pelo formulário/)).toBeVisible();
  });
});

test("simulador: resultado e evento", async ({ page }) => {
  await page.goto("/ferramentas/simulador-parada/");
  await page.locator("#sim-exames").fill("40");
  await page.locator("#sim-diasConvencional").fill("8");
  await expect(page.getByText("R$ 34.000").first()).toBeVisible();
  await expect(page.getByText("R$ 272.000")).toBeVisible();
  await expect(page.getByText("Estimativa; depende dos dados informados.")).toBeVisible();
  await expect.poll(() => eventos(page), { timeout: 4000 }).toContain("simulator_result");
});

test("assistente: 5 perguntas, orientação e formulário pré-preenchido", async ({ page }) => {
  await page.goto("/ferramentas/reparar-ou-trocar/");
  for (const t of [/Tomografia computadorizada/, /Imagem com artefato/, /falha intermitente/, /Sem contrato/, /Nesta semana/]) {
    await page.getByRole("button", { name: t }).first().click();
  }
  await expect(page.getByRole("heading", { name: /Vale avaliar o componente/ })).toBeVisible();
  await page.getByRole("button", { name: "Abrir chamado com estas respostas" }).click();
  await expect(page.locator("#lf-mod")).toHaveValue("tc");
  expect(await eventos(page)).toEqual(expect.arrayContaining(["wizard_start", "wizard_complete"]));
});

test("monte seu parque: resumo segue para o formulário", async ({ page }) => {
  await page.goto("/ferramentas/monte-seu-parque/");
  await page.getByRole("button", { name: "Mais um: Ressonância magnética, Sem contrato" }).click();
  await page.getByRole("button", { name: "Mais um: Tomografia computadorizada, Com contrato" }).click();
  await page.getByRole("button", { name: "Enviar resumo para a engenharia" }).click();
  await expect(page.locator('[name="equipamento"]')).toHaveValue(/RM: 1.*TC: 1/);
  expect(await eventos(page)).toContain("parque_complete");
});

test("guia de falhas: busca, filtro e aviso fixo", async ({ page }) => {
  await page.goto("/guia-de-falhas/");
  await expect(page.getByRole("note")).toContainText("Em caso de dúvida, não execute e acione o plantão.");
  await page.locator("#guia-q").fill("helio");
  await expect(page.locator("li[id]")).toHaveCount(1);
  await page.locator("#guia-q").fill("");
  await page.getByRole("button", { name: "Falha crítica" }).click();
  await expect(page.locator("li[id]")).toHaveCount(3);
  await expect(page.getByText(/SLA/)).toHaveCount(0);
});

test("busca global encontra conteúdo", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) await page.getByRole("button", { name: "Buscar" }).click();
  else await page.keyboard.press("Control+k");
  await page.getByRole("combobox").fill("bobina");
  await expect(page.getByRole("option", { name: /Bobinas de RF/ })).toBeVisible();
});

test.describe("teclado e menu", () => {
  test("pular para o conteúdo e dropdown por teclado", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop");
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: /Pular para o conteúdo/ });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#conteudo")).toBeFocused();
    const sol = page.getByRole("button", { name: "Soluções" });
    await sol.focus();
    await page.keyboard.press("Enter");
    await expect(sol).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(sol).toHaveAttribute("aria-expanded", "false");
  });

  test("menu móvel abre, prende o foco e fecha com Esc", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile");
    await page.goto("/");
    const botao = page.getByRole("button", { name: "Menu" });
    await botao.click();
    const menu = page.getByRole("dialog");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: /Plantão 24h/ })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(botao).toBeFocused();
  });
});
