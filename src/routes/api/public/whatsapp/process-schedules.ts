import { createFileRoute } from "@tanstack/react-router";

type Schedule = {
  id: string;
  conversa_id: string;
  autor_id: string;
  texto: string;
  janela_limite: string;
  tentativas: number;
  tipo?: string;
  template?: { name: string; language?: string; parametros?: string[] } | null;
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/whatsapp";

export const Route = createFileRoute("/api/public/whatsapp/process-schedules")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = request.headers.get("apikey");
        const validKeys = [process.env["SUPABASE_ANON_KEY"], process.env["SUPABASE_PUBLISHABLE_KEY"]].filter(Boolean);
        if (!apiKey || !validKeys.includes(apiKey)) {
          return Response.json({ error: "Não autorizado" }, { status: 401 });
        }
        const lovableKey = process.env["LOVABLE_API_KEY"];
        const whatsappKey = process.env["WHATSAPP_API_KEY"];
        if (!lovableKey || !whatsappKey) return Response.json({ error: "WhatsApp não configurado" }, { status: 500 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.rpc("claim_due_whatsapp_agendamentos", { _limit: 10 });
        if (error) return Response.json({ error: error.message }, { status: 500 });

        let processed = 0;
        for (const row of (data || []) as Schedule[]) {
          const { data: conversa } = await supabaseAdmin.from("whatsapp_conversas").select("telefone,ultima_entrada_cliente_em").eq("id", row.conversa_id).maybeSingle();
          const limite = conversa?.ultima_entrada_cliente_em
            ? new Date(conversa.ultima_entrada_cliente_em).getTime() + 24 * 60 * 60 * 1000
            : 0;
          const ehTemplate = row.tipo === "template" && !!row.template?.name;
          if (!conversa || (!ehTemplate && Date.now() >= limite)) {
            await supabaseAdmin.from("whatsapp_agendamentos").update({ status: "falhou", erro: "A janela de 24 horas foi encerrada antes do envio." }).eq("id", row.id);
            continue;
          }

          try {
            const response = await fetch(`${GATEWAY_URL}/messages`, {
              method: "POST",
              headers: { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": whatsappKey, "Content-Type": "application/json" },
              body: JSON.stringify(ehTemplate
                ? { messaging_product: "whatsapp", to: conversa.telefone, type: "template", template: { name: row.template!.name, language: { code: row.template!.language || "pt_BR" }, ...((row.template!.parametros ?? []).length ? { components: [{ type: "body", parameters: row.template!.parametros!.map((t) => ({ type: "text", text: t })) }] } : {}) } }
                : { messaging_product: "whatsapp", to: conversa.telefone, type: "text", text: { body: row.texto } }),
            });
            const responseText = await response.text();
            if (!response.ok) throw new Error(`WhatsApp [${response.status}]: ${responseText}`);
            let waMessageId: string | null = null;
            try { waMessageId = JSON.parse(responseText)?.messages?.[0]?.id ?? null; } catch { waMessageId = null; }
            const { data: message, error: messageError } = await supabaseAdmin.from("whatsapp_mensagens").insert({
              conversa_id: row.conversa_id, wa_message_id: waMessageId, direcao: "saida", tipo: ehTemplate ? "template" : "text", conteudo: row.texto, status: "enviado", autor_id: row.autor_id,
            }).select("id").single();
            if (messageError) throw messageError;
            const now = new Date().toISOString();
            await supabaseAdmin.from("whatsapp_conversas").update({ ultima_mensagem: row.texto, ultima_mensagem_em: now }).eq("id", row.conversa_id);
            await supabaseAdmin.from("whatsapp_agendamentos").update({ status: "enviado", enviado_em: now, mensagem_id: message.id, erro: null }).eq("id", row.id);
            processed += 1;
          } catch (cause) {
            const message = cause instanceof Error ? cause.message.slice(0, 500) : "Falha no envio";
            const retry = row.tentativas < 3;
            await supabaseAdmin.from("whatsapp_agendamentos").update({
              status: retry ? "pendente" : "falhou",
              erro: message,
              proxima_tentativa_em: retry ? new Date(Date.now() + 5 * 60 * 1000).toISOString() : null,
            }).eq("id", row.id);
          }
        }
        return Response.json({ success: true, claimed: data?.length ?? 0, processed });
      },
    },
  },
});