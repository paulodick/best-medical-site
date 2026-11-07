import { PageHeader } from "@/components/PageHeader";
import { ContactQuick } from "@/components/home/ContactQuick";
import { Wizard } from "@/components/tools/Wizard";
import { modalidadesAtivas } from "@/config/site";
import { assistente } from "@/content/ferramentas";
import { whatsappHref } from "@/lib/contact";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ ...assistente.seo, path: "/ferramentas/reparar-ou-trocar" });

export default function Page() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Ferramentas" }, { label: "Reparar ou trocar?" }]} hud="Ferramenta · assistente" h1={assistente.h1} intro={assistente.intro} progress={false} />
      <section aria-label="Assistente" className="py-16 md:py-24">
        <div className="wrap">
          <Wizard modalidades={modalidadesAtivas.map((m) => ({ id: m.id, label: m.nome }))} plantaoHref={whatsappHref("emergencia", "emergencia", "Origem: assistente Reparar ou trocar?")} />
        </div>
      </section>
      <ContactQuick titulo="Abra o chamado com as suas respostas." />
    </>
  );
}
