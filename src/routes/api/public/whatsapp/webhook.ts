import { createFileRoute } from "@tanstack/react-router";
import { verifyWebhookRequest } from "@lovable.dev/webhooks-js";

// Recebe mensagens e status do WhatsApp encaminhados pelo conector Lovable.
// Cada entrega é gravada em whatsapp_webhook_events antes de ser processada.

type Db = any;

const digits = (s: unknown) => String(s ?? "").replace(/\D/g, "");
const formatBR = (wa: string) => {
  const d = wa.replace(/^55/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return wa;
};
const RANK: Record<string, number> = { accepted: 0, enviando: 0, sent: 1, delivered: 2, read: 3, failed: 4 };

function textFromMessage(m: any): { tipo: string; conteudo: string } {
  switch (m.type) {
    case "text": return { tipo: "text", conteudo: m.text?.body ?? "" };
    case "button": return { tipo: "button", conteudo: m.button?.text ?? "" };
    case "interactive":
      return { tipo: "interactive", conteudo: m.interactive?.button_reply?.title ?? m.interactive?.list_reply?.title ?? "" };
    case "image": return { tipo: "image", conteudo: m.image?.caption || "[Imagem]" };
    case "document": return { tipo: "document", conteudo: m.document?.filename || "[Documento]" };
    case "audio": return { tipo: "audio", conteudo: "[Áudio]" };
    case "video": return { tipo: "video", conteudo: m.video?.caption || "[Vídeo]" };
    case "sticker": return { tipo: "sticker", conteudo: "[Figurinha]" };
    case "location": return { tipo: "location", conteudo: `[Localização] ${m.location?.latitude},${m.location?.longitude}` };
    case "reaction": return { tipo: "reaction", conteudo: m.reaction?.emoji ?? "" };
    default: return { tipo: m.type || "unknown", conteudo: `[${m.type}]` };
  }
}

async function findOrCreateConversa(db: Db, from: string, nome: string | null, conteudo: string) {
  // Um único atendimento por número: casa pelos 8 últimos dígitos (cobre variação do 9º dígito).
  const { data: convs, error } = await db.from("whatsapp_conversas").select("*")
    .like("telefone", `%${from.slice(-8)}`).order("created_at").limit(1);
  if (error) throw error;
  if (convs?.[0]) return convs[0];

  const tail = from.replace(/^55/, "");
  const { data: negs } = await db.from("negociacoes")
    .select("id, telefone, responsavel_id")
    .ilike("telefone", `%${tail.slice(-4)}%`)
    .order("created_at", { ascending: false }).limit(50);
  let neg: any = (negs ?? []).find((n: any) => digits(n.telefone).endsWith(tail.slice(-8)));
  let responsavel: string | null = neg?.responsavel_id ?? null;

  if (!neg) {
    const { data: ativos } = await db.from("whatsapp_numbers")
      .select("user_id, peso").eq("ativo", true).eq("recebe_lead", true).not("user_id", "is", null);
    if (ativos?.length) {
      const total = ativos.reduce((s: number, n: any) => s + Math.max(0, n.peso ?? 0), 0);
      let pick: any = ativos[0];
      if (total > 0) {
        let r = Math.random() * total;
        for (const n of ativos) { r -= Math.max(0, n.peso ?? 0); if (r <= 0) { pick = n; break; } }
      }
      responsavel = pick.user_id;
    }
    const { data: last } = await db.from("negociacoes").select("posicao")
      .eq("etapa", "entrada").order("posicao", { ascending: false }).limit(1).maybeSingle();
    const { data: created, error: negErr } = await db.from("negociacoes").insert({
      nome_cliente: nome || formatBR(from),
      telefone: formatBR(from),
      etapa: "entrada",
      responsavel_id: responsavel,
      produto: "Chapa Inteira",
      mensagem: conteudo,
      utm_source: "whatsapp_api",
      posicao: (last?.posicao ?? 0) + 1,
    }).select("id").single();
    if (negErr) throw negErr;
    neg = created;
  }

  const { data: novo, error: convErr } = await db.from("whatsapp_conversas").upsert({
    telefone: from, nome_contato: nome, negociacao_id: neg?.id ?? null, responsavel_id: responsavel,
  }, { onConflict: "telefone" }).select("*").single();
  if (convErr) throw convErr;
  return novo;
}

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
