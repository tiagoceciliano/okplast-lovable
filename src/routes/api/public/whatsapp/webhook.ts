import { createFileRoute } from "@tanstack/react-router";
import { verifyWebhookRequest } from "@lovable.dev/webhooks-js";

// Recebe mensagens e status do WhatsApp encaminhados pelo conector Lovable.
// Cada entrega é gravada em whatsapp_webhook_events antes de ser processada.

import { digits, findOrCreateConversa, textFromMessage, type Db } from "@/lib/whatsapp-inbound.server";
const RANK: Record<string, number> = { accepted: 0, enviando: 0, sent: 1, delivered: 2, read: 3, failed: 4 };

/** Retorna true quando concluído; false quando precisa aguardar (ex.: status antes da mensagem enviada). */
async function processEvent(db: Db, event: string, payload: any): Promise<boolean> {
  const value = payload?.entry?.[0]?.changes?.[0]?.value ?? {};
  const field = payload?.entry?.[0]?.changes?.[0]?.field ?? "";

  // Atualizações de modelos (aprovação, categoria, qualidade) enviadas pela Meta.
  if (String(field).startsWith("message_template") || field === "template_category_update" || value.message_template_id) {
    const metaId = String(value.message_template_id ?? "");
    if (!metaId) return true;
    const { data: t } = await db.from("whatsapp_templates").select("id,status,categoria").eq("meta_id", metaId).maybeSingle();
    if (!t) return true;
    const upd: any = {};
    let desc = "";
    let tipo = "status";
    if (value.event) { upd.status = value.event; upd.motivo = value.reason && value.reason !== "NONE" ? value.reason : null; desc = `${t.status} → ${value.event}`; }
    if (value.new_category) { tipo = "categoria"; upd.categoria = value.new_category; upd.categoria_anterior = value.previous_category ?? t.categoria; desc = `${value.previous_category ?? t.categoria} → ${value.new_category}`; }
    if (value.new_quality_score) { tipo = "qualidade"; upd.qualidade = value.new_quality_score; desc = `Qualidade: ${value.new_quality_score}`; }
    if (Object.keys(upd).length) {
      await db.from("whatsapp_templates").update(upd).eq("id", t.id);
      await db.from("whatsapp_template_eventos").insert({ template_id: t.id, tipo, descricao: desc });
    }
    return true;
  }


  if (event === "whatsapp.message") {
    const contacts = value.contacts ?? [];
    for (const m of value.messages ?? []) {
      const from = digits(m.from);
      const nome = contacts.find((c: any) => c.wa_id === m.from)?.profile?.name ?? null;
      const { tipo, conteudo } = textFromMessage(m);
      const when = m.timestamp ? new Date(Number(m.timestamp) * 1000).toISOString() : new Date().toISOString();

      const { data: exists } = await db.from("whatsapp_mensagens").select("id").eq("wa_message_id", m.id).maybeSingle();
      if (exists) continue;

      const conv = await findOrCreateConversa(db, from, nome, conteudo);
      const { error: insErr } = await db.from("whatsapp_mensagens").insert({
        conversa_id: conv.id, wa_message_id: m.id, direcao: "entrada", tipo, conteudo, created_at: when,
      });
      if (insErr) {
        if (String(insErr.code) === "23505") continue;
        throw insErr;
      }
      const { error: upErr } = await db.from("whatsapp_conversas").update({
        nome_contato: nome ?? conv.nome_contato,
        ultima_mensagem: conteudo,
        ultima_mensagem_em: when,
        ultima_entrada_cliente_em: when,
        nao_lidas: (conv.nao_lidas ?? 0) + 1,
        resolvida_em: null, // cliente escreveu: reabre o atendimento antigo

      }).eq("id", conv.id);
      if (upErr) throw upErr;
    }
    return true;
  }

  if (event === "whatsapp.status") {
    let allDone = true;
    for (const st of value.statuses ?? []) {
      const { data: msg, error } = await db.from("whatsapp_mensagens")
        .select("id, status").eq("wa_message_id", st.id).maybeSingle();
      if (error) throw error;
      if (!msg) { allDone = false; continue; }
      if ((RANK[st.status] ?? 0) < (RANK[msg.status] ?? 0)) continue;
      const { error: upErr } = await db.from("whatsapp_mensagens").update({
        status: st.status,
        erro: st.errors?.[0] ? `${st.errors[0].title ?? ""} ${st.errors[0].message ?? ""}`.trim() : null,
      }).eq("id", msg.id);
      if (upErr) throw upErr;
    }
    return allDone;
  }

  // Outros eventos: apenas armazenados.
  return true;
}

async function runRow(db: Db, row: { id: string; event: string; payload: any; attempts: number }) {
  try {
    const done = await processEvent(db, row.event, row.payload);
    await db.from("whatsapp_webhook_events").update(
      done
        ? { processed_at: new Date().toISOString(), processing_error: null, attempts: row.attempts + 1 }
        : { processing_error: "aguardando mensagem enviada", attempts: row.attempts + 1 },
    ).eq("id", row.id);
    return true;
  } catch (e: any) {
    await db.from("whatsapp_webhook_events").update({
      processing_error: String(e?.message ?? e).slice(0, 500), attempts: row.attempts + 1,
    }).eq("id", row.id);
    return false;
  }
}

async function recoverPending(db: Db, skipId: string) {
  const { data } = await db.from("whatsapp_webhook_events")
    .select("id, event, payload, attempts")
    .is("processed_at", null).lt("attempts", 30).neq("id", skipId)
    .order("attempts", { ascending: true }).order("received_at", { ascending: true })
    .limit(5);
  for (const row of data ?? []) await runRow(db, row);
}

export const Route = createFileRoute("/api/public/whatsapp/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["WHATSAPP_API_KEY"];
        if (!secret) return new Response("not configured", { status: 500 });

        let payload: any;
        try {
          ({ payload } = await verifyWebhookRequest({ req: request, secret, maxBodyBytes: 4 * 1024 * 1024 }));
        } catch {
          return new Response("invalid signature", { status: 401 });
        }

        const deliveryId = request.headers.get("x-lovable-delivery");
        const event = request.headers.get("x-lovable-event");
        if (!deliveryId || !event) return new Response("missing headers", { status: 400 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const db = supabaseAdmin as Db;

        const { error: insErr } = await db.from("whatsapp_webhook_events")
          .upsert({ delivery_id: deliveryId, event, payload }, { onConflict: "delivery_id", ignoreDuplicates: true });
        if (insErr) {
          console.error("Falha ao gravar evento WhatsApp:", insErr);
          return new Response("db error", { status: 500 });
        }
        const { data: row, error: selErr } = await db.from("whatsapp_webhook_events")
          .select("id, event, payload, attempts, processed_at").eq("delivery_id", deliveryId).single();
        if (selErr || !row) return new Response("db error", { status: 500 });

        if (!row.processed_at) {
          const ok = await runRow(db, row);
          if (!ok) return new Response("processing failed", { status: 500 });
        }

        try { await recoverPending(db, row.id); } catch (e) { console.error("Recuperação:", e); }
        return new Response("ok", { status: 200 });
      },
    },
  },
});
