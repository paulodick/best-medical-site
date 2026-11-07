import Link from "next/link";
import { site } from "@/config/site";
import { solucoes, ferramentas } from "@/config/nav";
import { emailHref, telHref, whatsappHref } from "@/lib/contact";
import { Logo } from "./Logo";

export function Footer() {
  const e = site.endereco;
  const linhaEndereco = [[e.rua, e.numero].filter(Boolean).join(", "), e.complemento, e.bairro, `${e.cidade} - ${e.uf}`, `CEP ${e.cep}`]
    .filter(Boolean)
    .join(" · ");
  return (
    <footer data-local="rodape" className="border-t border-line bg-bg-2/60 pb-10 pt-16">
      <div className="wrap grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-[36ch] text-[15px] text-ink-soft">{site.assinatura}</p>
          <address className="mt-5 text-[14px] not-italic leading-relaxed text-ink-mute">
            {site.razaoSocial}<br />CNPJ {site.cnpj}<br />{linhaEndereco}
          </address>
        </div>
        <nav aria-label="Soluções">
          <p className="hud mb-3 text-ink-mute">Soluções</p>
          <ul className="grid gap-2 text-[15px]">{solucoes.map((l) => <li key={l.href}><Link href={l.href} className="hover:text-accent">{l.label}</Link></li>)}</ul>
        </nav>
        <nav aria-label="Ferramentas">
          <p className="hud mb-3 text-ink-mute">Ferramentas</p>
          <ul className="grid gap-2 text-[15px]">
            {ferramentas.map((l) => <li key={l.href}><Link href={l.href} className="hover:text-accent">{l.label}</Link></li>)}
            <li><Link href="/perguntas-frequentes" className="hover:text-accent">Perguntas frequentes</Link></li>
          </ul>
        </nav>
        <div>
          <p className="hud mb-3 text-ink-mute">Contato</p>
          <ul className="grid gap-2 text-[15px]">
            <li><a href={whatsappHref("emergencia", "emergencia")} target="_blank" rel="noopener" className="hover:text-accent">WhatsApp {site.contato.whatsappExibicao}</a></li>
            <li><a href={telHref} className="hover:text-accent">{site.contato.telefoneFixoExibicao}</a></li>
            <li><a href={emailHref} className="hover:text-accent">{site.contato.email}</a></li>
            <li><a href={`https://www.instagram.com/${site.contato.instagram}/`} target="_blank" rel="noopener" className="hover:text-accent">Instagram @{site.contato.instagram}</a></li>
          </ul>
        </div>
      </div>
      <div className="wrap mt-12 flex flex-col gap-3 border-t border-line pt-6 text-[13px] text-ink-mute md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {site.nome}. Marcas citadas pertencem a seus titulares.</p>
        <ul className="flex flex-wrap gap-5">
          <li><Link href="/privacidade" className="hover:text-accent">Privacidade</Link></li>
          <li><Link href="/conformidade" className="hover:text-accent">Conformidade</Link></li>
          <li><button type="button" data-consent-open className="hover:text-accent">Preferências de cookies</button></li>
        </ul>
      </div>
    </footer>
  );
}
