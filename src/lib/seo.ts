import type { Metadata } from "next";
import { site } from "@/config/site";
import { ogSlug } from "@/og/registro";
import { isPreview } from "./base";

/** Metadados por rota: title (até 60), description (até 155), canonical e Open Graph. */
/** Com trailingSlash: true, a URL canônica termina em barra. */
export const canonicalPath = (p: string) => (p.endsWith("/") ? p : `${p}/`);

export function pageMeta({ title, description, path, noindex = false }: { title: string; description: string; path: string; noindex?: boolean }): Metadata {
  const url = canonicalPath(path);
  const og = `${site.urlDoSite}/og/${ogSlug(noindex ? "/" : path)}.png`; // rascunho não gera imagem própria
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `${site.urlDoSite}${url}` },
    robots: noindex || isPreview ? { index: false, follow: false } : undefined,
    twitter: { card: "summary_large_image", title, description, images: [og] },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: site.nome,
      title,
      description,
      url: `${site.urlDoSite}${url}`,
      images: [{ url: og, width: 1200, height: 630, alt: title }],
    },
  };
}
