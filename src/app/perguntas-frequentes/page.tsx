import { PageHeader } from "@/components/PageHeader";
import { FaqList } from "@/components/FaqList";
import { ContactQuick } from "@/components/home/ContactQuick";
import { getFaq } from "@/content/faq";
import { faqPagina as f } from "@/content/paginas";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: f.seo.title, description: f.seo.description, path: "/perguntas-frequentes" });

export default function Page() {
  const faq = getFaq();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((q) => ({ "@type": "Question", name: q.q, acceptedAnswer: { "@type": "Answer", text: q.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHeader crumbs={[{ label: "Perguntas frequentes" }]} h1={f.h1} intro={f.intro} />
      <section className="py-16 md:py-24"><div className="wrap max-w-[960px]"><FaqList items={faq} /></div></section>
      <ContactQuick titulo="Não encontrou sua resposta? Pergunte à engenharia." />
    </>
  );
}
