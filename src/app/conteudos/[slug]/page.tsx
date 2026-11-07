import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { conteudos } from "@/content/conteudos";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return conteudos.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = conteudos.find((x) => x.slug === slug);
  if (!c) return {};
  return pageMeta({ title: `${c.titulo} | Best Medical`, description: c.resumo, path: `/conteudos/${c.slug}`, noindex: !c.published });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = conteudos.find((x) => x.slug === slug);
  if (!c) notFound();
  return (
    <>
      <PageHeader crumbs={[{ label: "Conteúdos" }, { label: c.titulo }]} h1={c.titulo} intro={c.resumo} />
      <article className="wrap max-w-[760px] py-16">
        {c.corpo.map((p) => <p key={p} className="mt-4 text-[18px] leading-relaxed text-ink-soft">{p}</p>)}
      </article>
    </>
  );
}
