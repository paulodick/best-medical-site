import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { isPreview } from "@/lib/base";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: isPreview ? [{ userAgent: "*", disallow: "/" }] : [{ userAgent: "*", allow: "/" }], // rascunhos saem do índice pelo noindex da própria página
    sitemap: `${site.urlDoSite}/sitemap.xml`,
    host: site.urlDoSite,
  };
}
