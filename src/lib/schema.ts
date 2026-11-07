import { modalidadesAtivas, site } from "@/config/site";
import { canonicalPath } from "./seo";

const abs = (p: string) => `${site.urlDoSite}${canonicalPath(p)}`;
export const ORG_ID = `${site.urlDoSite}/#organizacao`;
export const NEGOCIO_ID = `${site.urlDoSite}/#negocio`;

const endereco = () => {
  const e = site.endereco;
  return {
    "@type": "PostalAddress",
    ...(e.rua ? { streetAddress: [e.rua, e.numero, e.complemento].filter(Boolean).join(", ") } : {}),
    addressLocality: e.cidade,
    addressRegion: e.uf,
    postalCode: e.cep,
    addressCountry: e.pais,
  };
};

const contato = {
  "@type": "ContactPoint",
  contactType: "technical support",
  telephone: `+${site.contato.whatsappEmergencia}`,
  email: site.contato.email,
  availableLanguage: ["pt-BR"],
  hoursAvailable: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "00:00", closes: "23:59" },
};

/** Organization + WebSite: em todas as páginas (layout). */
export function schemaGlobal() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: site.nome,
        legalName: site.razaoSocial,
        taxID: site.cnpj,
        url: abs("/"),
        logo: `${site.urlDoSite}${site.logo.lockup}`,
        slogan: site.lema,
        email: site.contato.email,
        telephone: site.contato.telefoneFixo,
        address: endereco(),
        contactPoint: [contato],
        sameAs: [`https://www.instagram.com/${site.contato.instagram}/`],
      },
      { "@type": "WebSite", "@id": `${site.urlDoSite}/#site`, url: abs("/"), name: site.nome, inLanguage: "pt-BR", publisher: { "@id": ORG_ID } },
    ],
  };
}

/** LocalBusiness (ProfessionalService): home e conformidade. */
export function schemaNegocio() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": NEGOCIO_ID,
    name: site.nome,
    parentOrganization: { "@id": ORG_ID },
    url: abs("/"),
    image: `${site.urlDoSite}/og/inicio.png`,
    logo: `${site.urlDoSite}${site.logo.lockup}`,
    telephone: site.contato.telefoneFixo,
    email: site.contato.email,
    address: endereco(),
    areaServed: [{ "@type": "Country", name: "Brasil" }],
    knowsAbout: modalidadesAtivas.map((m) => m.nome),
    contactPoint: [contato],
  };
}

/** Service por modalidade. */
export function schemaServico({ nome, descricao, path, servicos }: { nome: string; descricao: string; path: string; servicos: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: nome,
    serviceType: "Manutenção de equipamentos de diagnóstico por imagem",
    description: descricao,
    url: abs(path),
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "Brasil" },
    hasOfferCatalog: { "@type": "OfferCatalog", name: nome, itemListElement: servicos.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s } })) },
  };
}

/** BreadcrumbList das páginas internas. */
export function schemaTrilha(itens: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    // itens intermediários sem página própria (ex.: "Ferramentas") ficam de fora
    itemListElement: itens.filter((c, i) => c.href || i === itens.length - 1).map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: abs(c.href) } : {}) })),
  };
}
