"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { site } from "@/config/site";
import { getAttribution } from "@/lib/attribution";
import { track } from "@/lib/track";
import {
  getPrefill, leadSchema, leadToWhatsappText, makeRef, maskPhone, opcoesModalidade, tiposSolicitacao,
  type LeadInput, type Prefill,
} from "@/lib/lead";

const DRAFT = "bm_lead_draft";
type Estado = { kind: "form" } | { kind: "ok"; ref: string; wa: string } | { kind: "fallback"; ref: string; wa: string; motivo: "sem-endpoint" | "falha" };

const waLink = (text: string, modo: string) =>
  `https://wa.me/${modo === "emergencia" ? site.contato.whatsappEmergencia : site.contato.whatsappComercial}?text=${encodeURIComponent(text)}`;

/**
 * Formulário de chamado. Nunca bloqueia o contato:
 * sem endpoint ou com falha, abre o WhatsApp com tudo o que foi digitado (e mantém o rascunho).
 */
export function LeadForm() {
  const [estado, setEstado] = useState<Estado>({ kind: "form" });
  const [origem, setOrigem] = useState<Prefill | null>(null);
  const started = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { modo: "emergencia", nome: "", telefone: "", modalidade: "", sintoma: "", tipo: "emergencia", email: "", instituicao: "", cidade: "", equipamento: "", website: "" },
  });
  const modo = watch("modo");

  // rascunho + pré-preenchimento das ferramentas e do link "auditoria"
  useEffect(() => {
    try {
      const d = JSON.parse(sessionStorage.getItem(DRAFT) ?? "null");
      if (d) reset({ ...d, consentimento: undefined, website: "" });
    } catch { /* ignore */ }
    const apply = () => {
      const p = getPrefill();
      const q = new URLSearchParams(location.search).get("tipo");
      if (p) {
        setOrigem(p);
        (["modo", "modalidade", "sintoma", "tipo", "equipamento"] as const).forEach((k) => { if (p[k]) setValue(k, p[k] as string); });
      }
      if (q && tiposSolicitacao.some((t) => t.id === q)) { setValue("tipo", q); setValue("modo", q === "emergencia" ? "emergencia" : "completo"); }
    };
    apply();
    window.addEventListener("bm:prefill", apply);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { track("form_open", { pagina: location.pathname }); io.disconnect(); } });
    if (rootRef.current) io.observe(rootRef.current);
    const sub = watch((v, { type }) => {
      if (!started.current && type === "change") { started.current = true; track("form_start", { modo: v.modo }); }
      try { const { consentimento: _c, website: _w, ...rest } = v; void _c; void _w; sessionStorage.setItem(DRAFT, JSON.stringify(rest)); } catch { /* ignore */ }
    });
    return () => { window.removeEventListener("bm:prefill", apply); io.disconnect(); sub.unsubscribe(); };
  }, [reset, setValue, watch]);

  const onSubmit = async (v: LeadInput) => {
    const ref = makeRef();
    const attr = getAttribution();
    const origemTxt = [attr.utm_source, attr.utm_medium, attr.utm_campaign].filter(Boolean).join(" / ") + (origem?.ferramenta ? ` · ${origem.ferramenta}` : "");
    const wa = waLink(leadToWhatsappText(v, ref, origemTxt.trim() || undefined), v.modo);
    if (v.website) { setEstado({ kind: "ok", ref, wa }); return; } // honeypot: finge sucesso

    const payload = {
      ref,
      ...v,
      telefone: maskPhone(v.telefone),
      website: undefined,
      pagina: location.pathname,
      url: location.href,
      atribuicao: attr,
      ferramenta: origem?.ferramenta ?? null,
      dadosFerramenta: origem?.dados ?? null,
      enviadoEm: new Date().toISOString(),
    };

    if (!site.formEndpoint) {
      track("generate_lead", { modo: v.modo, via: "whatsapp", ferramenta: origem?.ferramenta });
      window.open(wa, "_blank", "noopener");
      setEstado({ kind: "fallback", ref, wa, motivo: "sem-endpoint" });
      return;
    }
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 8000);
      const r = await fetch(site.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: ctrl.signal });
      clearTimeout(t);
      if (!r.ok) throw new Error(String(r.status));
      track("generate_lead", { modo: v.modo, via: "formulario", ferramenta: origem?.ferramenta });
      try { sessionStorage.removeItem(DRAFT); } catch { /* ignore */ }
      setEstado({ kind: "ok", ref, wa });
    } catch {
      track("generate_lead", { modo: v.modo, via: "whatsapp_fallback", ferramenta: origem?.ferramenta });
      window.open(wa, "_blank", "noopener");
      setEstado({ kind: "fallback", ref, wa, motivo: "falha" });
    }
  };

  const field = "mt-1.5 w-full rounded-[10px] border border-line-strong bg-bg-3 px-4 py-3 text-[16px] text-ink placeholder:text-ink-mute/70 focus:border-accent focus:outline-none aria-invalid:border-danger";
  const label = "block text-[14px] font-semibold";
  const err = (m?: string) => (m ? <p className="mt-1 text-[13px] text-danger" role="alert">{m}</p> : null);

  if (estado.kind !== "form") {
    const ok = estado.kind === "ok";
    return (
      <div ref={rootRef} className="rounded-[14px] border border-accent/40 bg-bg-2 p-6 md:p-8" role="status" aria-live="polite">
        <p className="hud text-accent">{ok ? "Pedido recebido" : "Continue pelo WhatsApp"}</p>
        <h3 className="mt-2 text-2xl font-bold">{ok ? "Recebemos seu chamado." : "Seu chamado está pronto para enviar."}</h3>
        <p className="mt-3 text-ink-soft">
          Código de referência: <b className="font-mono text-ink">{estado.ref}</b>.{" "}
          {ok
            ? "Para agilizar, continue a conversa pelo WhatsApp com os dados já preenchidos."
            : estado.motivo === "falha"
              ? "Não conseguimos enviar pelo formulário agora. Abrimos o WhatsApp com tudo o que você digitou; se não abriu, use o botão abaixo."
              : "Abrimos o WhatsApp com tudo o que você digitou; se não abriu, use o botão abaixo."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={estado.wa} target="_blank" rel="noopener" className="btn btn-primary">Continuar no WhatsApp</a>
          <button type="button" onClick={() => setEstado({ kind: "form" })} className="btn btn-ghost">Voltar ao formulário</button>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef}>
      <div role="radiogroup" aria-label="Tipo de formulário" className="mb-6 grid grid-cols-2 gap-1 rounded-[12px] border border-line bg-bg-2 p-1">
        {(["emergencia", "completo"] as const).map((m) => (
          <label key={m} className={`flex min-h-[44px] cursor-pointer items-center justify-center rounded-[9px] text-[14px] font-semibold has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${modo === m ? "bg-accent text-on-accent" : "text-ink-soft"}`}>
            <input type="radio" value={m} {...register("modo")} className="sr-only" onChange={(e) => { setValue("modo", e.target.value as LeadInput["modo"]); setValue("tipo", m === "emergencia" ? "emergencia" : "corretiva"); }} />
            {m === "emergencia" ? "Emergência" : "Solicitação completa"}
          </label>
        ))}
      </div>

      {origem?.ferramenta && (
        <p className="mb-5 rounded-[10px] border border-line bg-bg-3/60 px-4 py-3 text-[14px] text-ink-soft">
          Dados da ferramenta <b className="text-ink">{origem.ferramenta}</b> serão enviados junto com o pedido.
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="lf-nome" className={label}>Nome</label>
            <input id="lf-nome" autoComplete="name" className={field} aria-invalid={!!errors.nome} aria-describedby={errors.nome ? "lf-nome-e" : undefined} {...register("nome")} />
            <div id="lf-nome-e">{err(errors.nome?.message)}</div>
          </div>
          <div>
            <label htmlFor="lf-tel" className={label}>Telefone ou WhatsApp</label>
            <input
              id="lf-tel" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(11) 91234-5678" className={field}
              aria-invalid={!!errors.telefone} aria-describedby={errors.telefone ? "lf-tel-e" : undefined}
              {...register("telefone", { onChange: (e) => setValue("telefone", maskPhone(e.target.value)) })}
            />
            <div id="lf-tel-e">{err(errors.telefone?.message)}</div>
          </div>
        </div>
        <div>
          <label htmlFor="lf-mod" className={label}>Modalidade</label>
          <select id="lf-mod" className={field} aria-invalid={!!errors.modalidade} aria-describedby={errors.modalidade ? "lf-mod-e" : undefined} {...register("modalidade")}>
            <option value="">Selecione</option>
            {opcoesModalidade.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
          <div id="lf-mod-e">{err(errors.modalidade?.message)}</div>
        </div>

        {modo === "completo" && (
          <>
            <div>
              <label htmlFor="lf-tipo" className={label}>Tipo de solicitação</label>
              <select id="lf-tipo" className={field} {...register("tipo")}>
                {tiposSolicitacao.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="lf-inst" className={label}>Instituição <span className="font-normal text-ink-mute">(opcional)</span></label>
                <input id="lf-inst" autoComplete="organization" className={field} {...register("instituicao")} />
              </div>
              <div>
                <label htmlFor="lf-cid" className={label}>Cidade/UF <span className="font-normal text-ink-mute">(opcional)</span></label>
                <input id="lf-cid" autoComplete="address-level2" className={field} {...register("cidade")} />
              </div>
              <div>
                <label htmlFor="lf-email" className={label}>E-mail <span className="font-normal text-ink-mute">(opcional)</span></label>
                <input id="lf-email" type="email" autoComplete="email" className={field} aria-invalid={!!errors.email} {...register("email")} />
                {err(errors.email?.message)}
              </div>
              <div>
                <label htmlFor="lf-eq" className={label}>Fabricante e modelo <span className="font-normal text-ink-mute">(opcional)</span></label>
                <input id="lf-eq" className={field} {...register("equipamento")} />
              </div>
            </div>
          </>
        )}

        <div>
          <label htmlFor="lf-sint" className={label}>{modo === "emergencia" ? "Sintoma" : "Detalhes"} <span className="font-normal text-ink-mute">(opcional)</span></label>
          <textarea id="lf-sint" rows={3} className={field} placeholder={modo === "emergencia" ? "Ex.: alarme de hélio, erro no tubo, sem imagem" : "Conte o que precisa"} {...register("sintoma")} />
          {err(errors.sintoma?.message)}
        </div>

        {/* honeypot: invisível para pessoas */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
          <label htmlFor="lf-web">Site</label>
          <input id="lf-web" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        <div>
          <label className="flex items-start gap-3 text-[14px] text-ink-soft">
            <input type="checkbox" className="mt-0.5 size-5 shrink-0 accent-[#90def6]" aria-invalid={!!errors.consentimento} {...register("consentimento")} />
            <span>
              Autorizo a Best Medical a usar estes dados para responder ao meu pedido, conforme a{" "}
              <Link href="/privacidade" className="text-accent underline underline-offset-4">Política de Privacidade</Link>.
            </span>
          </label>
          {err(errors.consentimento?.message)}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={isSubmitting} className="btn btn-primary disabled:opacity-60">
            {isSubmitting ? "Enviando…" : modo === "emergencia" ? "Acionar plantão" : "Enviar solicitação"}
          </button>
          <p className="text-[13px] text-ink-mute">Se o envio falhar, abrimos o WhatsApp com seus dados.</p>
        </div>
      </form>
    </div>
  );
}
