import { PageHeader } from "@/components/PageHeader";
import { ContactQuick } from "@/components/home/ContactQuick";
import { Simulator } from "@/components/tools/Simulator";
import { modalidadesAtivas } from "@/config/site";
import { simulador } from "@/content/ferramentas";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ ...simulador.seo, path: "/ferramentas/simulador-parada" });

export default function Page() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Ferramentas" }, { label: "Simulador de parada" }]} hud="Ferramenta · simulador" h1={simulador.h1} intro={simulador.intro} progress={false} />
      <section aria-label="Simulador" className="py-16 md:py-24">
        <div className="wrap">
          <Simulator modalidades={modalidadesAtivas.map((m) => ({ id: m.id, sigla: m.sigla, label: m.curto.charAt(0).toUpperCase() + m.curto.slice(1) }))} />
        </div>
      </section>
      <ContactQuick titulo="Quer reduzir os dias parados? Fale com a engenharia." />
    </>
  );
}
