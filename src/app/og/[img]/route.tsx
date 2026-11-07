import { ogDaRota, ogSlug, rotasComOg } from "@/og/registro";
import { renderOg } from "@/og/render";

export const dynamic = "force-static";
export const dynamicParams = false;

/** /og/<rota>.png — uma imagem 1200×630 por página indexável, gerada no build. */
export function generateStaticParams() {
  return rotasComOg().map((p) => ({ img: `${ogSlug(p)}.png` }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ img: string }> }) {
  const { img } = await params;
  const path = rotasComOg().find((p) => `${ogSlug(p)}.png` === img) ?? "/";
  return renderOg(ogDaRota(path));
}
