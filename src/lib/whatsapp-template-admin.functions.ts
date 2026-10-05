import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireCaller } from "@/lib/supabase-server";

// Criação, sincronização e exclusão de modelos (templates) na Meta via conector WhatsApp.
const GATEWAY_URL = "https://connector-gateway.lovable.dev/whatsapp";

function headers() {
  const L = process.env["LOVABLE_API_KEY"];
  const W = process.env["WHATSAPP_API_KEY"];
  if (!L || !W) throw new Error("Conexão WhatsApp não configurada");
  return { Authorization: `Bearer ${L}`, "X-Connection-Api-Key": W, "Content-Type": "application/json" };
}

function metaError(text: string): string {
  try {
    const e = JSON.parse(text)?.error;
    return e?.error_user_msg || e?.error_user_title || e?.message || "Falha na Meta";
  } catch { return "Falha na Meta"; }
}

async function syncAll(admin: any) {
  const resp = await fetch(`${GATEWAY_URL}/message_templates?fields=id,name,status,language,category,components,rejected_reason,quality_score&limit=200`, { headers: headers() });
  const text = await resp.text();
  if (!resp.ok) { console.error("sync templates", resp.status, text); throw new Error(metaError(text)); }
  const list = (JSON.parse(text).data ?? []) as any[];
  const { data: locais } = await admin.from("whatsapp_templates").select("id,meta_id,nome,idioma,status,categoria");
  const ids: string[] = [];
  for (const t of list) {
    ids.push(t.id);
    const local = (locais ?? []).find((l: any) => l.meta_id === t.id || (l.nome === t.name && l.idioma === t.language));
    const row = {
      meta_id: t.id, nome: t.name, idioma: t.language, categoria: t.category, status: t.status,
      motivo: t.rejected_reason && t.rejected_reason !== "NONE" ? t.rejected_reason : null,
      qualidade: t.quality_score?.score ?? null, componentes: t.components ?? [],
    };
    if (local) {
      const extra: any = {};
      if (local.categoria !== t.category) extra.categoria_anterior = local.categoria;
      await admin.from("whatsapp_templates").update({ ...row, ...extra }).eq("id", local.id);
      if (local.status !== t.status) await admin.from("whatsapp_template_eventos").insert({ template_id: local.id, tipo: "status", descricao: `${local.status} → ${t.status}` });
      if (local.categoria !== t.category) await admin.from("whatsapp_template_eventos").insert({ template_id: local.id, tipo: "categoria", descricao: `${local.categoria} → ${t.category}` });
    } else {
      await admin.from("whatsapp_templates").insert(row);
    }
  }
  return { total: list.length };
}

export const syncWhatsappTemplates = createServerFn({ method: "POST" }).handler(async () => {
  const { admin } = await requireCaller(getRequestHeader("Authorization"), ["admin", "gestor"]);
  return syncAll(admin);
});

const createSchema = z.object({
  nome: z.string().regex(/^[a-z0-9_]{1,512}$/),
  idioma: z.string().min(2).max(10),
  categoria: z.enum(["MARKETING", "UTILITY", "AUTHENTICATION"]),
  componentes: z.array(z.any()).max(10),
  validade: z.number().int().min(30).max(86400).optional(),
});

export const createWhatsappTemplate = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => createSchema.parse(d))
  .handler(async ({ data }) => {
    const { admin } = await requireCaller(getRequestHeader("Authorization"), ["admin", "gestor"]);
    const body: any = { name: data.nome, language: data.idioma, category: data.categoria, components: data.componentes };
    if (data.validade) body.message_send_ttl_seconds = data.validade;
    const resp = await fetch(`${GATEWAY_URL}/message_templates`, { method: "POST", headers: headers(), body: JSON.stringify(body) });
    const text = await resp.text();
    if (!resp.ok) { console.error("create template", resp.status, text); return { ok: false as const, erro: metaError(text) }; }
    const r = JSON.parse(text) as { id: string; status: string; category: string };
    const { data: row } = await admin.from("whatsapp_templates").upsert({
      meta_id: r.id, nome: data.nome, idioma: data.idioma, categoria: r.category ?? data.categoria,
      status: r.status ?? "PENDING", componentes: data.componentes,
      categoria_anterior: r.category && r.category !== data.categoria ? data.categoria : null,
    }, { onConflict: "nome,idioma" }).select("id").single();
    if (row) await admin.from("whatsapp_template_eventos").insert({ template_id: row.id, tipo: "criado", descricao: `Enviado para análise (${r.status})` });
    return { ok: true as const, status: r.status, categoria: r.category };
  });

export const deleteWhatsappTemplate = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { admin } = await requireCaller(getRequestHeader("Authorization"), ["admin", "gestor"]);
    const { data: t } = await admin.from("whatsapp_templates").select("*").eq("id", data.id).single();
    if (!t) throw new Error("Modelo não encontrado");
    const q = new URLSearchParams({ name: t.nome });
    if (t.meta_id) q.set("hsm_id", t.meta_id);
    const resp = await fetch(`${GATEWAY_URL}/message_templates?${q}`, { method: "DELETE", headers: headers() });
    const text = await resp.text();
    if (!resp.ok && resp.status !== 404) return { ok: false as const, erro: metaError(text) };
    await admin.from("whatsapp_templates").delete().eq("id", data.id);
    return { ok: true as const };
  });
