import { defineConfig, devices } from "@playwright/test";

/**
 * Testes de ponta a ponta sobre o build estático.
 * Antes: `npm run build:teste` (gera out/ sem endpoint e .teste-endpoint/ com endpoint de teste).
 * Usa o Chrome instalado na máquina (channel: "chrome").
 */
export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: "http://localhost:4610", channel: "chrome", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome", viewport: { width: 1280, height: 800 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  webServer: [
    { command: "npx serve out -l 4610 --no-clipboard", port: 4610, reuseExistingServer: true },
    { command: "npx serve .teste-endpoint -l 4611 --no-clipboard", port: 4611, reuseExistingServer: true },
  ],
});
