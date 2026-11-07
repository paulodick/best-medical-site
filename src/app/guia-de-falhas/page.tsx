import { PageHeader } from "@/components/PageHeader";
import { ContactQuick } from "@/components/home/ContactQuick";
import { Guide } from "@/components/tools/Guide";
import { modalidadesAtivas } from "@/config/site";
import { guia } from "@/content/ferramentas";
import { whatsappHref } from "@/lib/contact";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ ...guia.seo, path: "/guia-de-falhas" });

export default function Page() {
  const ativas = new Set<string>(modalidadesAtivas.map((m) => m.id));
  const itens = guia.itens.filter((i) => ativas.has(i.modalidade)); // mamografia só entra se confirmada
  const plantao = Object.fromEntries(itens.map((i) => [i.id, whatsappHref("emergencia", "emergencia", `Guia de falhas: ${i.sintoma}`)]));
  return (
    <>
      <PageHeader crumbs={[{ label: "Ferramentas" }, { label: "Guia de falhas" }]} hud="Ferramenta · consulta" h1={guia.h1} intro={guia.intro} />
      <section aria-label="Guia de falhas" className="py-12 md:py-20">
        <div className="wrap">
          <Guide itens={itens} modalidades={modalidadesAtivas.map((m) => ({ id: m.id, sigla: m.sigla, nome: m.nome }))} plantao={plantao} />
        </div>
      </section>
      <ContactQuick titulo="Sintoma fora da lista? Fale com o plantão." />
    </>
  );
}
