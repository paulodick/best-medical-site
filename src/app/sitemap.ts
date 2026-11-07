import type { MetadataRoute } from "next";
import { rotasPublicas } from "@/config/rotas";
import { site } from "@/config/site";
import { canonicalPath } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  return rotasPublicas.map((r) => ({ url: `${site.urlDoSite}${canonicalPath(r.path)}`, lastModified: agora, changeFrequency: r.freq, priority: r.prioridade }));
}
