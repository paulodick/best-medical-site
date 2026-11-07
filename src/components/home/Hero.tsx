import { useTranslations } from "next-intl";
import Link from "next/link";
import { Scanner } from "@/components/scanner/Scanner";
import { whatsappHref } from "@/lib/contact";
import { listaModalidades, modalidadesAtivas, site } from "@/config/site";

export function Hero() {
  const t = useTranslations("hero");
  const c = useTranslations("comum");
  const s = useTranslations("scanner");
  const st = useTranslations("status");

  const status = [
    { k: st("modalidades"), v: listaModalidades() },
    { k: st("abrangencia"), v: site.abrangencia },
    { k: st("base"), v: `${site.endereco.bairro}, ${site.endereco.cidade}` },
    { k: st("atendimento"), v: st("atendimentoValor") },
  ];

  return (
    <section data-scan-area data-local="hero" className="hero-bg relative isolate overflow-hidden pb-10 pt-[96px] lg:min-h-svh lg:pt-[104px]">
      <div className="wrap">
        <div className="grid items-center gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-4">
          <div className="order-2 lg:order-1">
            <p className="hud mb-5 flex flex-wrap gap-x-4 gap-y-2 text-accent">
              <span className="inline-flex items-center gap-2"><span className="live-dot" aria-hidden="true" />{c("plantao")}</span>
              <span>{modalidadesAtivas.map((m) => m.sigla).join(" · ")}</span>
              <span>{site.abrangencia}</span>
            </p>
            <h1 className="max-w-[13ch] text-[clamp(34px,4.5vw,76px)] font-extrabold leading-[1.02] tracking-[-0.035em]">
              {t("h1a")} <span className="font-semibold text-ink-soft">{t("h1b")}</span>
            </h1>
            <p className="my-6 max-w-[54ch] text-[17px] leading-relaxed text-ink-soft md:text-[19px]">{t("sub")}</p>
            <div className="flex flex-wrap gap-3">
              <a href={whatsappHref("emergencia", "emergencia")} target="_blank" rel="noopener" className="btn btn-primary">
                <span className="live-dot" aria-hidden="true" />
                {c("plantao")}
              </a>
              <Link href="/?tipo=auditoria#contato" className="btn btn-ghost">{c("solicitarAuditoria")}</Link>
            </div>
          </div>
          <div className="order-1 mx-auto w-full max-w-[440px] lg:order-2 lg:max-w-none">
            <Scanner
              title={t("ilustracaoTitulo")}
              desc={t("ilustracaoDesc")}
              names={{ rf: s("rf"), grad: s("grad"), mag: s("mag"), cryo: s("cryo"), mesa: s("mesa") }}
              readout={{ titulo: t("leituraTitulo"), ocioso: t("leituraOcioso"), estatico: t("leituraEstatico"), dica: t("leituraDica") }}
              corner={t("scannerCanto")}
              lema={t("scannerLema")}
            />
          </div>
        </div>

        <dl aria-label={st("titulo")} className="mt-11 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-line bg-line lg:grid-cols-4">
          {status.map((i) => (
            <div key={i.k} className="bg-bg-2 px-4 py-3.5">
              <dt className="hud text-ink-mute">{i.k}</dt>
              <dd className="mt-1 text-[15px] font-semibold leading-snug">{i.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
