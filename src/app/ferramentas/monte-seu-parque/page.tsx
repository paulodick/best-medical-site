import { PageHeader } from "@/components/PageHeader";
import { ContactQuick } from "@/components/home/ContactQuick";
import { Parque } from "@/components/tools/Parque";
import { modalidadesAtivas } from "@/config/site";
import { parque } from "@/content/ferramentas";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ ...parque.seo, path: "/ferramentas/monte-seu-parque" });

export default function Page() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Ferramentas" }, { label: "Monte seu parque" }]} hud="Ferramenta · inventário" h1={parque.h1} intro={parque.intro} progress={false} />
      <section aria-label="Monte seu parque" className="py-16 md:py-24">
        <div className="wrap">
          <Parque modalidades={modalidadesAtivas.map((m) => ({ id: m.id, sigla: m.sigla, nome: m.nome }))} />
        </div>
      </section>
      <ContactQuick titulo="Envie o resumo e receba a avaliação do seu parque." />
    </>
  );
}
