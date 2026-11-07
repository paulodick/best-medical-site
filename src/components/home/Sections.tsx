import Link from "next/link";
import { ferramentasSecao, pecas, atendimento, prova as provaTxt } from "@/content/home";
import { prova, site } from "@/config/site";
import { whatsappHref } from "@/lib/contact";

function Head({ eyebrow, titulo, id, align = "left" }: { eyebrow: string; titulo: string; id: string; align?: "left" | "center" }) {
  return (
    <div className={`reveal mb-10 md:mb-14 ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className="hud mb-3 text-accent">{eyebrow}</p>
      <h2 id={id} className={`max-w-[22ch] text-[clamp(28px,3.4vw,52px)] font-extrabold leading-[1.05] tracking-[-0.03em] ${align === "center" ? "mx-auto" : ""}`}>
        {titulo}
      </h2>
    </div>
  );
}

/** 6 · Ferramentas: grade de instrumentos (cada um com URL própria) */
export function ToolsSection() {
  const s = ferramentasSecao;
  return (
    <section id={s.id} aria-labelledby={`${s.id}-t`} className="scroll-mt-20 py-24 md:py-32">
      <div className="wrap">
        <Head eyebrow={s.eyebrow} titulo={s.titulo} id={`${s.id}-t`} />
        <ul className="grid gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {s.itens.map((it, i) => (
            <li key={it.href} className="reveal bg-bg" style={{ transitionDelay: `${i * 80}ms` }}>
              <Link href={it.href} className="group flex h-full min-h-[220px] flex-col p-6 transition-colors hover:bg-bg-2 md:p-7">
                <span className="hud text-ink-mute">{String(i + 1).padStart(2, "0")} · {it.hud}</span>
                <span className="mt-auto pt-10 text-[22px] font-bold leading-tight">{it.titulo}</span>
                <span className="mt-2 text-[15px] text-ink-soft">{it.texto}</span>
                <span aria-hidden="true" className="mt-5 text-accent transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** 7 · Peças e base de troca: linha do tempo horizontal + termos definidos */
export function PartsSection() {
  const s = pecas;
  const garantia = s.garantia();
  return (
    <section id={s.id} aria-labelledby={`${s.id}-t`} data-local="pecas" className="scroll-mt-20 border-t border-line bg-bg-2/50 py-24 md:py-32">
      <div className="wrap">
        <Head eyebrow={s.eyebrow} titulo={s.titulo} id={`${s.id}-t`} />
        <div className="tl-h reveal relative" data-progress>
          <div aria-hidden="true" className="absolute left-0 right-0 top-[11px] hidden h-px bg-line md:block">
            <div className="tl-fill h-px bg-accent" />
          </div>
          <ol className="grid gap-8 md:grid-cols-4 md:gap-6">
            {s.etapas.map((e) => (
              <li key={e.hud} className="relative pl-8 md:pl-0 md:pt-10">
                <span aria-hidden="true" className="absolute left-0 top-0.5 size-[22px] rounded-full border-2 border-accent bg-bg md:top-0" />
                <p className="hud text-ink-mute">{e.hud}</p>
                <h3 className="mt-1 text-xl font-bold">{e.titulo}</h3>
                <p className="mt-2 text-[15px] text-ink-soft">
                  {e.texto}
                  {e.titulo === "Garantia" && garantia ? ` Prazo: ${garantia.valor}.` : ""}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <dl className="mt-16 grid gap-px overflow-hidden rounded-[14px] border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {s.termos.map((t) => (
            <div key={t.termo} className="reveal bg-bg p-6">
              <dt className="hud text-accent">{t.termo}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-ink-soft">{t.def}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={whatsappHref("comercial", "comercial", "Quero consultar uma peça.")} target="_blank" rel="noopener" className="btn btn-primary">{s.cta}</a>
          <Link href="/pecas-e-base-de-troca" className="btn btn-ghost">{s.link} →</Link>
        </div>
      </div>
    </section>
  );
}

/** 8 · Como atendemos: linha do tempo vertical do chamado */
export function ServiceSection() {
  const s = atendimento;
  const sla = s.sla();
  return (
    <section id={s.id} aria-labelledby={`${s.id}-t`} className="scroll-mt-20 py-24 md:py-32">
      <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Head eyebrow={s.eyebrow} titulo={s.titulo} id={`${s.id}-t`} />
          {sla && (
            <div className="reveal rounded-[14px] border border-line bg-bg-2 p-6">
              <p className="hud text-ink-mute">Emergência</p>
              <p className="mt-2 text-[44px] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-accent">
                {sla.prefixo}{sla.numero ?? sla.valor}{sla.sufixo}
              </p>
              <p className="mt-2 text-[15px] text-ink-soft">{sla.rotulo}</p>
            </div>
          )}
        </div>
        <ol className="relative grid gap-0 border-l border-line">
          {s.etapas.map((e, i) => (
            <li key={e.titulo} className="reveal relative pb-10 pl-8 last:pb-0 md:pl-12">
              <span aria-hidden="true" className="hud absolute -left-[17px] top-0 grid size-[34px] place-items-center rounded-full border border-accent bg-bg text-accent">
                {i + 1}
              </span>
              <h3 className="pt-1 text-[22px] font-bold">{e.titulo}</h3>
              <p className="mt-2 max-w-[52ch] text-[16px] leading-relaxed text-ink-soft">{e.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** 9 · Prova e conformidade: tudo condicional ao config */
export function ProofSection() {
  const t = provaTxt;
  const docs = prova.documentosLicitacao;
  const resp = site.responsaveisTecnicos;
  const depo = prova.depoimentos.filter((d) => d.autorizado);
  const logos = prova.logosClientes.filter((l) => l.autorizado);
  const endereco = [
    [site.endereco.rua, site.endereco.numero].filter(Boolean).join(", "),
    site.endereco.bairro,
    `${site.endereco.cidade} - ${site.endereco.uf}`,
    `CEP ${site.endereco.cep}`,
  ].filter(Boolean).join(" · ");
  return (
    <section id={t.id} aria-labelledby={`${t.id}-t`} data-local="prova" className="scroll-mt-20 border-t border-line bg-bg-2/50 py-24 md:py-32">
      <div className="wrap">
        <Head eyebrow={t.eyebrow} titulo={t.titulo} id={`${t.id}-t`} />

        {prova.casos.length > 0 && (
          <div className="mb-14">
            <h3 className="hud mb-4 text-ink-mute">{t.casos}</h3>
            <ul className="grid gap-4 md:grid-cols-2">
              {prova.casos.map((c, i) => (
                <li key={i} className="rounded-[14px] border border-line bg-bg p-6">
                  <p className="hud text-accent">{c.modalidade}</p>
                  <p className="mt-3"><b>Problema:</b> {c.problema}</p>
                  <p className="mt-1"><b>Ação:</b> {c.acao}</p>
                  <p className="mt-1"><b>Resultado:</b> {c.resultado}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {depo.length > 0 && (
          <ul className="mb-14 grid gap-4 md:grid-cols-2">
            {depo.map((d, i) => (
              <li key={i}><figure className="rounded-[14px] border border-line bg-bg p-6"><blockquote className="text-lg">“{d.texto}”</blockquote><figcaption className="mt-3 text-sm text-ink-mute">{d.nome}, {d.cargo} · {d.instituicao}</figcaption></figure></li>
            ))}
          </ul>
        )}
        {logos.length > 0 && (
          <ul className="mb-14 flex flex-wrap items-center gap-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {logos.map((l) => <li key={l.nome}><img src={l.src} alt={l.nome} className="h-10 w-auto opacity-80" loading="lazy" /></li>)}
          </ul>
        )}

        <div className="grid gap-px overflow-hidden rounded-[14px] border border-line bg-line lg:grid-cols-3">
          <div className="reveal bg-bg p-6 md:p-8">
            <h3 className="hud text-accent">{t.empresa}</h3>
            <dl className="mt-4 grid gap-3 text-[15px]">
              <div><dt className="text-ink-mute">Razão social</dt><dd className="font-semibold">{site.razaoSocial}</dd></div>
              <div><dt className="text-ink-mute">CNPJ</dt><dd className="font-semibold tabular-nums">{site.cnpj}</dd></div>
              <div><dt className="text-ink-mute">Endereço</dt><dd className="font-semibold">{endereco}</dd></div>
            </dl>
          </div>
          <div className="reveal bg-bg p-6 md:p-8">
            <h3 className="hud text-accent">{t.responsaveis}</h3>
            {resp.length > 0 ? (
              <ul className="mt-4 grid gap-3 text-[15px]">
                {resp.map((r) => <li key={r.crea}><b>{r.nome}</b><br /><span className="text-ink-soft">{r.titulo} · CREA {r.crea}</span></li>)}
              </ul>
            ) : (
              <p className="mt-4 text-[15px] text-ink-soft">Nome e registro no CREA informados no laudo de cada atendimento e sob solicitação.</p>
            )}
            {prova.laudoExemplo && (
              <a href={prova.laudoExemplo} className="mt-5 inline-block text-accent underline underline-offset-4">{t.laudo}</a>
            )}
          </div>
          {docs.length > 0 && (
            <div className="reveal bg-bg p-6 md:p-8">
              <h3 className="hud text-accent">{t.documentos}</h3>
              <p className="mt-4 text-[15px] text-ink-soft">{t.documentosTexto}</p>
              <ul className="mt-2 grid gap-1.5 text-[15px]">
                {docs.map((d) => <li key={d} className="flex gap-2"><span aria-hidden="true" className="text-accent">·</span>{d}</li>)}
              </ul>
              <a href={whatsappHref("comercial", "comercial", "Gostaria de receber os documentos para licitação.")} target="_blank" rel="noopener" className="btn btn-ghost mt-5">{t.pedirDocumentos}</a>
            </div>
          )}
        </div>
        <Link href="/conformidade" className="mt-6 inline-block text-[15px] text-accent underline underline-offset-4">{t.verConformidade}</Link>
      </div>
    </section>
  );
}
