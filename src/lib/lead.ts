import { z } from "zod";
import { modalidadesAtivas, site } from "@/config/site";

export const tiposSolicitacao = [
  { id: "emergencia", label: "Emergência: equipamento parado" },
  { id: "corretiva", label: "Manutenção corretiva" },
  { id: "contrato", label: "Contrato de manutenção / preventiva" },
  { id: "peca", label: "Peça ou base de troca" },
  { id: "auditoria", label: "Auditoria técnica do parque" },
] as const;

export const opcoesModalidade = [...modalidadesAtivas.map((m) => ({ id: m.id as string, label: m.nome })), { id: "outra", label: "Outra / não sei" }];

const digits = (s: string) => s.replace(/\D/g, "");

/** Máscara BR: (11) 91234-5678 / (11) 4979-4500 */
export function maskPhone(v: string) {
  const d = digits(v).replace(/^55(?=\d{10,11}$)/, "").slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export const leadSchema = z.object({
  modo: z.enum(["emergencia", "completo"]),
  nome: z.string().trim().min(2, "Informe seu nome."),
  telefone: z.string().refine((v) => /^\d{10,11}$/.test(digits(v)), "Informe um telefone com DDD."),
  modalidade: z.string().min(1, "Escolha a modalidade."),
  sintoma: z.string().max(600, "Use até 600 caracteres.").optional(),
  tipo: z.string().optional(),
  email: z.union([z.literal(""), z.email("E-mail inválido.")]).optional(),
  instituicao: z.string().max(120).optional(),
  cidade: z.string().max(80).optional(),
  equipamento: z.string().max(160).optional(),
  consentimento: z.literal(true, { error: "É preciso autorizar o contato para enviar." }),
  website: z.string().max(0).optional(), // honeypot
});

export type LeadInput = z.input<typeof leadSchema>;

export function makeRef() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BM-${ymd}-${rnd}`;
}

export function leadToWhatsappText(v: LeadInput, ref: string, origem?: string) {
  const mod = opcoesModalidade.find((m) => m.id === v.modalidade)?.label ?? v.modalidade;
  const tipo = tiposSolicitacao.find((t) => t.id === v.tipo)?.label;
  return [
    v.modo === "emergencia" ? site.mensagensWhatsapp.emergencia : site.mensagensWhatsapp.comercial,
    `Código: ${ref}`,
    `Nome: ${v.nome}`,
    `Telefone: ${maskPhone(v.telefone)}`,
    `Modalidade: ${mod}`,
    tipo && `Solicitação: ${tipo}`,
    v.instituicao && `Instituição: ${v.instituicao}`,
    v.cidade && `Cidade/UF: ${v.cidade}`,
    v.equipamento && `Equipamento: ${v.equipamento}`,
    v.email && `E-mail: ${v.email}`,
    v.sintoma && `Detalhes: ${v.sintoma}`,
    origem && `[origem: ${origem}]`,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Dados vindos das ferramentas (assistente, simulador, parque) para pré-preencher o formulário. */
export type Prefill = Partial<Pick<LeadInput, "modo" | "modalidade" | "sintoma" | "tipo" | "equipamento">> & {
  ferramenta?: "assistente" | "simulador" | "parque";
  dados?: Record<string, unknown>;
};
export const PREFILL_KEY = "bm_prefill";

export function setPrefill(p: Prefill) {
  try { sessionStorage.setItem(PREFILL_KEY, JSON.stringify(p)); } catch { /* sem armazenamento */ }
  window.dispatchEvent(new Event("bm:prefill"));
}
export function getPrefill(): Prefill | null {
  try { return JSON.parse(sessionStorage.getItem(PREFILL_KEY) ?? "null") as Prefill | null; } catch { return null; }
}
