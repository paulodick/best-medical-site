import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { MobileDock } from "@/components/MobileDock";
import { ContactTracker } from "@/components/ContactTracker";
import { Footer } from "@/components/Footer";
import { Consent } from "@/components/Consent";
import { RevealObserver } from "@/components/RevealObserver";
import { BackToTop } from "@/components/PageChrome";
import { JsonLd } from "@/components/JsonLd";
import { schemaGlobal } from "@/lib/schema";
import { whatsappHref } from "@/lib/contact";
import { site } from "@/config/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], display: "swap", weight: ["400", "500", "600", "700", "800"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], display: "swap", weight: ["500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.urlDoSite),
  title: { default: "Best Medical | Engenharia clínica em diagnóstico por imagem", template: "%s | Best Medical" },
  description:
    "Manutenção preventiva e corretiva, reparo de bobinas e placas e peças com laudo para ressonância, tomografia e hemodinâmica. Plantão 24h.",
};

export const viewport: Viewport = { themeColor: "#07121b", colorScheme: "dark" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const c = await getTranslations("comum");
  const plantaoHref = whatsappHref("emergencia", "emergencia");
  return (
    <html lang="pt-BR" className={`${jakarta.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        {/* JS ativo (para .reveal) + Consent Mode v2 com padrão negado, antes de qualquer tag */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');try{if(localStorage.getItem('bm_consent'))document.documentElement.classList.add('consent-set')}catch(e){}window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});",
          }}
        />
        <JsonLd data={schemaGlobal()} />
      </head>
      <body className="min-h-svh pb-[76px] md:pb-0">
        <a
          href="#conteudo"
          className="fixed left-4 top-[-60px] z-[100] rounded-lg bg-accent px-4 py-2.5 font-bold text-on-accent focus:top-3"
        >
          {c("pularConteudo")}
        </a>
        <Header
            plantaoHref={plantaoHref}
            labels={{
              inicio: c("inicio"),
              navPrincipal: c("navPrincipal"),
              plantao: c("plantao"),
              menu: c("menu"),
              fecharMenu: c("fecharMenu"),
              solicitarAtendimento: c("solicitarAtendimento"),
            }}
          />
          <main id="conteudo" tabIndex={-1} className="outline-none">{children}</main>
          <Footer />
          <MobileDock label={c("contatoRapido")} plantao={c("plantao")} solicitar={c("solicitarAtendimento")} plantaoHref={plantaoHref} />
          <ContactTracker />
          <RevealObserver />
          <Consent />
          <BackToTop />
      </body>
    </html>
  );
}
