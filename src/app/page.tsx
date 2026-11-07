import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { NumbersStrip } from "@/components/NumbersStrip";
import { RepairPath } from "@/components/home/RepairPath";
import { Explorer } from "@/components/modality/Explorer";
import { ToolsSection, PartsSection, ServiceSection, ProofSection } from "@/components/home/Sections";
import { FaqList } from "@/components/FaqList";
import { ContactQuick } from "@/components/home/ContactQuick";
import { claim, numerosDoTopo, type Claim } from "@/config/claims";
import { modalidadesAtivas } from "@/config/site";
import { conteudoModalidades } from "@/content/modalidades";
import { pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { schemaNegocio } from "@/lib/schema";

export const metadata = pageMeta({
  title: "Best Medical | Engenharia clínica em diagnóstico por imagem",
  description:
    "Manutenção preventiva e corretiva, reparo de bobinas e placas e peças com laudo para ressonância, tomografia e hemodinâmica. Plantão 24h.",
  path: "/",
});
import { explorador, reparar } from "@/content/home";
import { getFaq } from "@/content/faq";

export default async function Home() {
  const t = await getTranslations("numeros");
  const numeros = numerosDoTopo.map(claim).filter((c): c is Claim => c !== null);
  const eco = reparar.economia();
  const items = modalidadesAtivas.map((m) => ({ ...conteudoModalidades[m.id], sigla: m.sigla, rota: m.rota }));
  const faq = getFaq();

  return (
    <>
      <JsonLd data={schemaNegocio()} />
      <Hero />
      <NumbersStrip title={t("titulo")} items={numeros} />

      <RepairPath
        id={reparar.id}
        eyebrow={reparar.eyebrow}
        titulo={reparar.titulo}
        passos={reparar.passos}
        fecho={reparar.fecho}
        economia={eco ? { valor: eco.valor, rotulo: eco.rotulo, detalhe: eco.detalhe } : null}
        labels={{ diagnostico: "Diagnóstico", decisao: "Reparável e seguro?", reparo: "Reparo", troca: "Troca", operacao: "Em operação" }}
      />

      <section id={explorador.id} aria-labelledby="ex-t" className="scroll-mt-20 border-t border-line bg-bg-2/50 py-24 md:py-32">
        <div className="wrap">
          <div className="reveal mb-10 grid gap-4 md:mb-12 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="hud mb-3 text-accent">{explorador.eyebrow}</p>
              <h2 id="ex-t" className="max-w-[20ch] text-[clamp(28px,3.4vw,52px)] font-extrabold leading-[1.05] tracking-[-0.03em]">{explorador.titulo}</h2>
            </div>
            <p className="text-[17px] text-ink-soft lg:justify-self-end">{explorador.texto}</p>
          </div>
          <Explorer items={items} verDetalhes={explorador.verDetalhes} nota={explorador.nota} />
        </div>
      </section>

      <ToolsSection />
      <PartsSection />
      <ServiceSection />
      <ProofSection />

      <section id="faq" aria-labelledby="faq-t" className="scroll-mt-20 py-24 md:py-32">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
          <div className="reveal">
            <p className="hud mb-3 text-accent">Perguntas frequentes</p>
            <h2 id="faq-t" className="max-w-[16ch] text-[clamp(28px,3.4vw,48px)] font-extrabold leading-[1.05] tracking-[-0.03em]">O que gestores perguntam antes de chamar.</h2>
            <Link href="/perguntas-frequentes" className="mt-6 inline-block text-accent underline underline-offset-4">Ver todas as perguntas</Link>
          </div>
          <FaqList items={faq} />
        </div>
      </section>

      <ContactQuick />
    </>
  );
}
