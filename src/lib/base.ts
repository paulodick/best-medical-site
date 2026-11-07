/**
 * Subcaminho de publicação (ex.: "/best-medical-site" no GitHub Pages). Vazio no domínio final.
 * next/link e next/router já aplicam o basePath; use asset() só em caminhos crus (img, fetch).
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (p: string) => `${basePath}${p}`;

/** Prévia (ex.: GitHub Pages): fora dos buscadores para não competir com o domínio oficial. */
export const isPreview = process.env.NEXT_PUBLIC_PREVIEW === "1";
