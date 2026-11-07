import { site } from "@/config/site";

type Canal = "emergencia" | "comercial";
type Mensagem = keyof typeof site.mensagensWhatsapp;

/** Link do WhatsApp (sem atribuição: usado no HTML estático; o clique anexa UTMs em tempo real). */
export function whatsappHref(canal: Canal = "emergencia", mensagem: Mensagem = "emergencia", extra = "") {
  const numero = canal === "emergencia" ? site.contato.whatsappEmergencia : site.contato.whatsappComercial;
  const texto = [site.mensagensWhatsapp[mensagem], extra].filter(Boolean).join("\n");
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

export const telHref = `tel:${site.contato.telefoneFixo}`;
export const emailHref = `mailto:${site.contato.email}`;
