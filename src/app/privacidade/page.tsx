import { PageHeader } from "@/components/PageHeader";
import { privacidade as p } from "@/content/privacidade";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: p.seo.title, description: p.seo.description, path: "/privacidade" });

export default function Page() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Privacidade" }]} h1={p.h1} intro={p.atualizado} />
      <article className="wrap max-w-[860px] py-16 md:py-24">
        {p.secoes.map((s) => (
          <section key={s.t} className="mb-10">
            <h2 className="text-[24px] font-bold">{s.t}</h2>
            {s.p.map((t) => <p key={t} className="mt-3 text-[17px] leading-relaxed text-ink-soft">{t}</p>)}
          </section>
        ))}
        <button type="button" data-consent-open className="btn btn-ghost">Preferências de cookies</button>
      </article>
    </>
  );
}
