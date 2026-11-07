import Link from "next/link";
import { ferramentas } from "@/config/nav";
import { modalidadesAtivas } from "@/config/site";
import { whatsappHref } from "@/lib/contact";

export const metadata = { title: { absolute: "Página não encontrada | Best Medical" }, robots: { index: false } };

export default function NotFound() {
  return (
    <section className="hero-bg relative isolate overflow-hidden pb-24 pt-[136px]">
      <div className="wrap max-w-[960px]">
        <p className="hud text-accent">Erro 404 · sinal perdido</p>
        <h1 className="mt-4 text-[clamp(34px,5vw,64px)] font-extrabold leading-tight tracking-[-0.03em]">Esta página não existe.</h1>
        <p className="mt-4 text-[18px] text-ink-soft">Se o equipamento está parado, não perca tempo aqui:</p>
        <div className="mt-6 flex flex-wrap gap-3" data-local="404">
          <a href={whatsappHref("emergencia", "emergencia")} target="_blank" rel="noopener" className="btn btn-primary"><span className="live-dot" aria-hidden="true" />Plantão 24h</a>
          <Link href="/#contato" className="btn btn-ghost">Solicitar atendimento</Link>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          <nav aria-label="Modalidades">
            <p className="hud mb-3 text-ink-mute">Modalidades</p>
            <ul className="grid gap-2">{modalidadesAtivas.map((m) => <li key={m.id}><Link href={m.rota} className="text-lg hover:text-accent">{m.nome}</Link></li>)}</ul>
          </nav>
          <nav aria-label="Ferramentas">
            <p className="hud mb-3 text-ink-mute">Ferramentas</p>
            <ul className="grid gap-2">{ferramentas.map((f) => <li key={f.href}><Link href={f.href} className="text-lg hover:text-accent">{f.label}</Link></li>)}</ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
