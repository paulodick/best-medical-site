import Link from "next/link";
import { notFound } from "next/navigation";
import { modalidadesAtivas } from "@/config/site";
import { conteudoModalidades } from "@/content/modalidades";
import { PageHeader } from "@/components/PageHeader";
import { Explorer } from "@/components/modality/Explorer";
import { ContactQuick } from "@/components/home/ContactQuick";
import { whatsappHref } from "@/lib/contact";
import { pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { schemaServico } from "@/lib/schema";

export const dynamicParams = false;

/** Uma página por modalidade confirmada (mamografia/raios X só entra com confirmada:true). */
export function generateStaticParams() {
  return modalidadesAtivas.map((m) => ({ modalidade: m.rota.slice(1) }));
}

const find = (slug: string) => modalidadesAtivas.find((m) => m.rota === `/${slug}`);

export async function generateMetadata({ params }: { params: Promise<{ modalidade: string }> }) {
  const m = find((await params).modalidade);
  if (!m) return {};
  const c = conteudoModalidades[m.id];
  return pageMeta({ title: c.seo.title, description: c.seo.description, path: m.rota });
}

export default async function ModalidadePage({ params }: { params: Promise<{ modalidade: string }> }) {
  const m = find((await params).modalidade);
  if (!m) notFound();
  const c = conteudoModalidades[m.id];
  const outras = modalidadesAtivas.filter((x) => x.id !== m.id);

  return (
    <>
      <JsonLd data={schemaServico({ nome: c.seo.h1, descricao: c.seo.description, path: m.rota, servicos: c.servicos })} />
      <PageHeader crumbs={[{ label: "Soluções" }, { label: c.titulo }]} hud={c.hud} h1={c.seo.h1} intro={c.seo.intro}>
        <div className="mt-8 flex flex-wrap gap-3" data-local={`pagina-${m.id}`}>
          <a href={whatsappHref("emergencia", "emergencia", `Modalidade: ${c.titulo}`)} target="_blank" rel="noopener" className="btn btn-primary">
            <span className="live-dot" aria-hidden="true" />Plantão 24h
          </a>
          <Link href="/?tipo=auditoria#contato" className="btn btn-ghost">Solicitar auditoria técnica</Link>
        </div>
      </PageHeader>

      <section aria-labelledby="servicos-t" className="py-20 md:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div>
            <p className="hud mb-3 text-accent">O que fazemos</p>
            <h2 id="servicos-t" className="text-[clamp(26px,3vw,42px)] font-extrabold leading-tight tracking-[-0.03em]">{c.resumo}</h2>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-2">
            {c.servicos.map((s, i) => (
              <li key={s} className="bg-bg p-6">
                <span className="hud text-ink-mute">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 text-[17px] font-semibold leading-snug">{s}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="vista-t" className="border-t border-line bg-bg-2/50 py-20 md:py-28">
        <div className="wrap">
          <p className="hud mb-3 text-accent">Vista explodida</p>
          <h2 id="vista-t" className="mb-10 text-[clamp(26px,3vw,42px)] font-extrabold tracking-[-0.03em]">Componentes que avaliamos antes de indicar a troca</h2>
          <Explorer
            items={[{ ...c, sigla: m.sigla, rota: "/guia-de-falhas" }]}
            verDetalhes="Consultar o guia de falhas"
            nota="Descrição técnica genérica; o escopo de cada atendimento é definido após o diagnóstico."
          />
        </div>
      </section>

      {outras.length > 0 && (
        <nav aria-label="Outras modalidades" className="border-t border-line py-14">
          <div className="wrap flex flex-wrap items-center gap-3">
            <span className="hud mr-2 text-ink-mute">Outras modalidades</span>
            {outras.map((o) => <Link key={o.id} href={o.rota} className="btn btn-ghost !min-h-[42px]">{o.nome}</Link>)}
            <Link href="/reparo-bobinas-ressonancia" className="btn btn-ghost !min-h-[42px]">Reparo de bobinas de RM</Link>
          </div>
        </nav>
      )}

      <ContactQuick titulo={`Fale com a engenharia sobre ${c.titulo.toLowerCase()}.`} />
    </>
  );
}
