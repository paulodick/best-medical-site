import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const ogSize = { width: 1200, height: 630 };

/** Imagem Open Graph 1200×630 gerada no build (sem foto de banco, sem marca de fabricante). */
export async function renderOg({ hud, titulo, rodape }: { hud: string; titulo: string; rodape?: string }) {
  const simbolo = await readFile(join(process.cwd(), "src/og/simbolo.png"));
  const src = `data:image/png;base64,${simbolo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", background: "#07121B", color: "#E7EEF3", backgroundImage: "linear-gradient(rgba(144,222,246,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(144,222,246,.06) 1px, transparent 1px)", backgroundSize: "48px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={84} height={84} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>{site.nome}</span>
            <span style={{ fontSize: 22, color: "#8DA2B3" }}>{site.lema}</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span style={{ fontSize: 24, letterSpacing: 4, color: "#90DEF6", textTransform: "uppercase" }}>{hud}</span>
          <span style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 1000 }}>{titulo}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#B4C4D1" }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#90DEF6" }} />
          <span>{rodape ?? `Plantão 24h · ${site.abrangencia} · ${site.endereco.bairro}, ${site.endereco.cidade}`}</span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 6, background: "#90DEF6" }} />
      </div>
    ),
    { ...ogSize },
  );
}
