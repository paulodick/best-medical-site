import { PageHeader } from "@/components/PageHeader";
import { ProofSection } from "@/components/home/Sections";
import { ContactQuick } from "@/components/home/ContactQuick";
import { conformidadePagina as c } from "@/content/paginas";
import { pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { schemaNegocio } from "@/lib/schema";

export const metadata = pageMeta({ title: c.seo.title, description: c.seo.description, path: "/conformidade" });

export default function Page() {
  return (
    <>
      <JsonLd data={schemaNegocio()} />
      <PageHeader crumbs={[{ label: "Conformidade" }]} h1={c.h1} intro={c.intro} />
      <section aria-labelledby="normas-t" className="py-20 md:py-28">
        <div className="wrap grid gap-10 lg:grid-cols-2 lg:gap-20">
          <h2 id="normas-t" className="text-[clamp(26px,3vw,42px)] font-extrabold tracking-[-0.03em]">{c.normas.titulo}</h2>
          <ul className="grid gap-3">
            {c.normas.itens.map((s) => <li key={s} className="rounded-[12px] border border-line bg-bg-2 p-5 text-[17px]">{s}</li>)}
          </ul>
        </div>
      </section>
      <ProofSection />
      <ContactQuick titulo="Precisa dos documentos para cadastro ou licitação?" />
    </>
  );
}
