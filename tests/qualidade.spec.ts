import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { rotas } from "./rotas";

test.describe("SEO e arquivos de descoberta", () => {
  test("cada rota tem title, description, canonical e H1 únicos", async ({ page }) => {
    const vistos = { title: new Set<string>(), desc: new Set<string>(), canon: new Set<string>() };
    for (const r of rotas) {
      await page.goto(r);
      const d = await page.evaluate(() => ({
        title: document.title,
        desc: document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content ?? "",
        canon: document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? "",
        h1: document.querySelectorAll("h1").length,
        og: document.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content ?? "",
      }));
      expect(d.h1, `${r}: um H1`).toBe(1);
      expect(d.title.length, `${r}: title até 60`).toBeLessThanOrEqual(60);
      expect(d.desc.length, `${r}: description 50–155`).toBeGreaterThanOrEqual(50);
      expect(d.desc.length).toBeLessThanOrEqual(155);
      expect(d.canon.endsWith(r), `${r}: canonical`).toBe(true);
      expect(d.og, `${r}: og:image`).toMatch(/\/og\/[a-z0-9-]+\.png$/);
      for (const k of ["title", "desc", "canon"] as const) {
        expect(vistos[k].has(d[k]), `${r}: ${k} duplicado`).toBe(false);
        vistos[k].add(d[k]);
      }
    }
  });

  test("robots.txt, sitemap.xml, llms.txt e imagens OG respondem 200", async ({ request }) => {
    for (const f of ["/robots.txt", "/sitemap.xml", "/llms.txt", "/busca.json", "/og/inicio.png", "/og/guia-de-falhas.png"]) {
      const r = await request.get(f);
      expect(r.status(), f).toBe(200);
    }
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).not.toContain("exemplo-rascunho");
  });

  test("rascunho de conteúdo fica fora do índice", async ({ page }) => {
    await page.goto("/conteudos/exemplo-rascunho/");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});

test.describe("Acessibilidade (axe, WCAG 2.2 AA)", () => {
  for (const r of rotas) {
    test(`sem violações: ${r}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" }); // estado final das animações
      await page.goto(r, { waitUntil: "networkidle" });
      const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      const resumo = res.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
      expect(resumo, resumo.join("\n")).toEqual([]);
    });
  }
});

test.describe("Console, consentimento e movimento reduzido", () => {
  test("zero erros de console e zero 404 nas rotas", async ({ page }) => {
    const erros: string[] = [];
    page.on("console", (m) => { if (m.type() === "error") erros.push(m.text()); });
    page.on("pageerror", (e) => erros.push(e.message));
    page.on("response", (r) => { if (r.status() >= 400) erros.push(`${r.status()} ${r.url()}`); });
    for (const r of rotas) await page.goto(r, { waitUntil: "networkidle" });
    expect(erros).toEqual([]);
  });

  test("nenhum script de análise antes do consentimento; Consent Mode negado por padrão", async ({ page }) => {
    const analise: string[] = [];
    page.on("request", (r) => { if (/googletagmanager|google-analytics|doubleclick|facebook\.net/.test(r.url())) analise.push(r.url()); });
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.getByRole("button", { name: "Aceitar" })).toBeVisible();
    const consent = await page.evaluate(() => JSON.stringify((window as unknown as { dataLayer: unknown[] }).dataLayer?.[0] ?? null));
    expect(consent).toContain("denied");
    expect(analise).toEqual([]);
  });

  test("com movimento reduzido o conteúdo aparece completo", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("#reparar")).toHaveAttribute("data-mode", "static");
    await expect(page.getByText("A Best Medical ganha quando o cliente economiza.")).toBeVisible();
    const escondidos = await page.locator(".reveal").evaluateAll((els) => els.filter((e) => getComputedStyle(e).opacity === "0").length);
    expect(escondidos).toBe(0);
  });
});
