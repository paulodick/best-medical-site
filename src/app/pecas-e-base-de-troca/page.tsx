import { PageHeader } from "@/components/PageHeader";
import { PartsSection } from "@/components/home/Sections";
import { ContactQuick } from "@/components/home/ContactQuick";
import { pecasPagina as p } from "@/content/paginas";
import { whatsappHref } from "@/lib/contact";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: p.seo.title, description: p.seo.description, path: "/pecas-e-base-de-troca" });

export default function Page() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Soluções" }, { label: "Peças e base de troca" }]} hud={p.hud} h1={p.h1} intro={p.intro}>
        <div className="mt-8 flex flex-wrap gap-3" data-local="pagina-pecas">
          <a href={whatsappHref("comercial", "comercial", "Quero consultar uma peça.")} target="_blank" rel="noopener" className="btn btn-primary">Consultar uma peça</a>
        </div>
      </PageHeader>
      <PartsSection />
      <section aria-labelledby="bt-t" className="py-20 md:py-28">
        <div className="wrap grid gap-10 lg:grid-cols-2 lg:gap-20">
          <h2 id="bt-t" className="text-[clamp(26px,3vw,42px)] font-extrabold leading-tight tracking-[-0.03em]">{p.baseTroca.titulo}</h2>
          <ol className="grid gap-3">
            {p.baseTroca.passos.map((s, i) => (
              <li key={s} className="flex gap-4 rounded-[12px] border border-line bg-bg-2 p-5 text-[17px]"><span className="hud mt-1 text-accent">{String(i + 1).padStart(2, "0")}</span>{s}</li>
            ))}
          </ol>
        </div>
      </section>
      <ContactQuick titulo="Precisa de uma peça? Fale com a engenharia." />
    </>
  );
}
