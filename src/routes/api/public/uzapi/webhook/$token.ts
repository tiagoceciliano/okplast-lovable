import { createFileRoute } from "@tanstack/react-router";
import { digits, findOrCreateConversa, textFromMessage, type Db } from "@/lib/whatsapp-inbound.server";

// Recebe eventos da Uzapi (números via QR Code). O token secreto na URL identifica a conexão.
const RANK: Record<string, number> = { accepted: 0, enviando: 0, sent: 1, delivered: 2, read: 3, failed: 4 };

async function processar(db: Db, inst: any, payload: any) {
  const { acharQr, acharStatus } = await import("@/lib/uzapi.server");
  for (const entry of payload?.entry ?? []) {
    for (const change of entry?.changes ?? []) {
      const field = String(change?.field ?? "");
      const value = change?.value ?? {};
      const meuNumero = digits(value?.metadata?.display_phone_number);
      if (field === "connection" || field === "authentication" || /qr|auth/i.test(field)) {
        const conn = value?.status?.[0]?.connection;
        const status = conn === "connected" ? "conectado" : conn ? "desconectado" : acharStatus(value);
        const qr = acharQr(value);
        const upd: any = {};
        if (status) upd.status = status;
        if (qr && status !== "conectado") { upd.qr_code = qr; upd.qr_atualizado_em = new Date().toISOString(); upd.status = "aguardando_qr"; }
        if (status === "conectado") upd.qr_code = null;
        if (meuNumero) upd.telefone = meuNumero;
        if (Object.keys(upd).length) await db.from("whatsapp_instancias").update(upd).eq("id", inst.id);
        continue;
      }
      for (const st of value?.statuses ?? []) {
        const { data: msg } = await db.from("whatsapp_mensagens").select("id,status").eq("wa_message_id", st.id).maybeSingle();
        if (!msg || (RANK[st.status] ?? 0) < (RANK[msg.status] ?? 0)) continue;
        await db.from("whatsapp_mensagens").update({ status: st.status }).eq("id", msg.id);
      }
      const contatos = value?.contacts ?? [];
      for (const m of value?.messages ?? []) {
        if (m?.isGroup) continue;
        const from = digits(m.from);
        const minha = m.fromMe === true || (!!meuNumero && from === meuNumero) || (!!inst.telefone && from === inst.telefone);
        const cliente = minha ? digits(m.to ?? m.recipient_id) : from;
        if (!cliente) continue;
        const { data: existe } = await db.from("whatsapp_mensagens").select("id").eq("wa_message_id", m.id).maybeSingle();
        if (existe) continue;
        const nome = minha ? null : contatos.find((c: any) => digits(c.wa_id) === from)?.profile?.name ?? null;
        const { tipo, conteudo } = textFromMessage(m);
        const when = m.timestamp ? new Date(Number(m.timestamp) * 1000).toISOString() : new Date().toISOString();
        const conv = await findOrCreateConversa(db, cliente, nome, conteudo, { responsavelPreferido: inst.user_id, instanciaId: inst.id });
        const { error } = await db.from("whatsapp_mensagens").insert({ conversa_id: conv.id, wa_message_id: m.id, direcao: minha ? "saida" : "entrada", tipo, conteudo, status: minha ? "sent" : null, created_at: when });
        if (error && String(error.code) !== "23505") throw error;
        const upd: any = { ultima_mensagem: conteudo, ultima_mensagem_em: when, instancia_id: inst.id };
        if (!minha) Object.assign(upd, { nome_contato: nome ?? conv.nome_contato, ultima_entrada_cliente_em: when, nao_lidas: (conv.nao_lidas ?? 0) + 1, resolvida_em: null });
        await db.from("whatsapp_conversas").update(upd).eq("id", conv.id);
      }
    }
  }
}

export const Route = createFileRoute("/api/public/uzapi/webhook/$token")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const token = String(params.token ?? "");
        if (!/^[a-f0-9]{48}$/.test(token)) return new Response("not found", { status: 404 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const db = supabaseAdmin as Db;
        const { data: inst } = await db.from("whatsapp_instancias").select("id,user_id,telefone").eq("webhook_token", token).maybeSingle();
        if (!inst) return new Response("not found", { status: 404 });
        const text = await request.text();
        if (text.length > 4 * 1024 * 1024) return new Response("too large", { status: 413 });
        let payload: any;
        try { payload = JSON.parse(text); } catch { return new Response("invalid json", { status: 400 }); }
        const field = payload?.entry?.[0]?.changes?.[0]?.field ?? "evento";
        const { data: ev } = await db.from("whatsapp_webhook_events").insert({ delivery_id: `uzapi:${crypto.randomUUID()}`, event: `uzapi.${field}`, payload }).select("id").single();
        try {
          await processar(db, inst, payload);
          if (ev) await db.from("whatsapp_webhook_events").update({ processed_at: new Date().toISOString(), attempts: 1 }).eq("id", ev.id);
        } catch (e: any) {
          if (ev) await db.from("whatsapp_webhook_events").update({ processing_error: String(e?.message ?? e).slice(0, 500), attempts: 1 }).eq("id", ev.id);
          return new Response("processing failed", { status: 500 });
        }
        return new Response("ok");
      },
    },
  },
});
