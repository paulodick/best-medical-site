import { site } from "@/config/site";
import { fechamento } from "@/content/home";
import { emailHref, telHref, whatsappHref } from "@/lib/contact";
import { LeadFormLazy } from "@/components/form/LeadFormLazy";

/** 11 · Fechamento: formulário de chamado + WhatsApp + telefone + e-mail. */
export function ContactQuick({ titulo = fechamento.titulo, as: H = "h2" }: { titulo?: string; as?: "h1" | "h2" }) {
  const items = [
    { label: "WhatsApp do plantão", value: site.contato.whatsappExibicao, href: whatsappHref("emergencia", "emergencia"), ext: true },
    { label: "Telefone", value: site.contato.telefoneFixoExibicao, href: telHref },
    { label: "E-mail", value: site.contato.email, href: emailHref },
  ];
  return (
    <section id={fechamento.id} aria-labelledby="contato-t" data-local="contato" className="scroll-mt-20 border-t border-line py-24 md:py-32">
      <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div>
          <p className="hud mb-4 text-accent">{fechamento.eyebrow}</p>
          <H id="contato-t" className="max-w-[18ch] text-[clamp(30px,3.6vw,52px)] font-extrabold leading-[1.05] tracking-[-0.03em]">{titulo}</H>
          <p className="mt-5 max-w-[46ch] text-[17px] text-ink-soft">{fechamento.texto}</p>
          <ul className="mt-8 grid gap-3">
            {items.map((i) => (
              <li key={i.label}>
                <a
                  href={i.href}
                  {...(i.ext ? { target: "_blank", rel: "noopener" } : {})}
                  className="flex items-center justify-between gap-4 rounded-[10px] border border-line bg-bg-2 px-5 py-4 transition-colors hover:border-accent/50"
                >
                  <span>
                    <span className="hud block text-ink-mute">{i.label}</span>
                    <span className="mt-1 block text-lg font-semibold">{i.value}</span>
                  </span>
                  <span aria-hidden="true" className="text-accent">→</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[16px] border border-line bg-bg-2/60 p-5 md:p-8">
          <LeadFormLazy />
        </div>
      </div>
    </section>
  );
}
