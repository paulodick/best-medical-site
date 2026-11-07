import { PageHeader } from "@/components/PageHeader";
import { ContactQuick } from "@/components/home/ContactQuick";
import { bobinas as b } from "@/content/paginas";
import { whatsappHref } from "@/lib/contact";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: b.seo.title, description: b.seo.description, path: "/reparo-bobinas-ressonancia" });

export default function Page() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Soluções" }, { label: "Reparo de bobinas" }]} hud={b.hud} h1={b.h1} intro={b.intro}>
        <div className="mt-8 flex flex-wrap gap-3" data-local="pagina-bobinas">
          <a href={whatsappHref("comercial", "comercial", "Quero avaliar o reparo de uma bobina de RM.")} target="_blank" rel="noopener" className="btn btn-primary">Enviar bobina para avaliação</a>
          <a href="#contato" className="btn btn-ghost">Solicitar orçamento</a>
        </div>
      </PageHeader>
      <section aria-labelledby="sinais-t" className="py-20 md:py-28">
        <div className="wrap grid gap-10 lg:grid-cols-2 lg:gap-20">
          <h2 id="sinais-t" className="text-[clamp(26px,3vw,42px)] font-extrabold leading-tight tracking-[-0.03em]">{b.sinais.titulo}</h2>
          <ul className="grid gap-3">
            {b.sinais.itens.map((s) => (
              <li key={s} className="flex gap-3 rounded-[12px] border border-line bg-bg-2 p-5 text-[17px]"><span aria-hidden="true" className="text-accent">◆</span>{s}</li>
            ))}
          </ul>
        </div>
      </section>
      <section aria-labelledby="proc-t" className="border-t border-line bg-bg-2/50 py-20 md:py-28">
        <div className="wrap">
          <h2 id="proc-t" className="mb-12 text-[clamp(26px,3vw,42px)] font-extrabold tracking-[-0.03em]">{b.processo.titulo}</h2>
          <ol className="grid gap-px overflow-hidden rounded-[14px] border border-line bg-line md:grid-cols-5">
            {b.processo.etapas.map((e, i) => (
              <li key={e.t} className="bg-bg p-6">
                <span className="hud text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-lg font-bold">{e.t}</h3>
                <p className="mt-2 text-[15px] text-ink-soft">{e.d}</p>
              </li>
            ))}
          </ol>
          {b.emprestimo && <p className="mt-8 max-w-[60ch] text-[16px] text-ink-soft">{b.emprestimo}</p>}
        </div>
      </section>
      <ContactQuick titulo="Envie a bobina para diagnóstico." />
    </>
  );
}
