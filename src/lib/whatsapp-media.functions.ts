import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireCaller } from "@/lib/supabase-server";

const inputSchema = z.object({
  conversaId: z.string().uuid(),
  nome: z.string().min(1).max(255),
  mime: z.string().min(1).max(120),
  base64: z.string().min(1),
  legenda: z.string().max(1024).optional(),
  voz: z.boolean().optional(),
});

const GATEWAY_URL = "https://connector-gateway.lovable.dev/whatsapp";

export const sendWhatsAppMedia = createServerFn({ method: "POST" })
  .inputValidator((input) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const { userId, admin } = await requireCaller(getRequestHeader("Authorization"), ["admin", "gestor", "vendedor"]);
    const { data: conversa, error: conversaError } = await admin
      .from("whatsapp_conversas")
      .select("id,telefone,responsavel_id,ultima_entrada_cliente_em")
      .eq("id", data.conversaId)
      .maybeSingle();
    if (conversaError || !conversa) throw new Error("Conversa não encontrada");

    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", userId);
    const isAdminGestor = (roles ?? []).some((row) => row.role === "admin" || row.role === "gestor");
    if (!isAdminGestor && conversa.responsavel_id && conversa.responsavel_id !== userId) {
      throw new Error("Esta conversa pertence a outro vendedor");
    }
    const lastInbound = conversa.ultima_entrada_cliente_em ? new Date(conversa.ultima_entrada_cliente_em).getTime() : 0;
    if (!lastInbound || Date.now() - lastInbound >= 24 * 60 * 60 * 1000) {
      throw new Error("A janela de 24 horas está fechada");
    }

    const lovableKey = process.env['LOVABLE_API_KEY'];
    const whatsappKey = process.env['WHATSAPP_API_KEY'];
    if (!lovableKey || !whatsappKey) throw new Error("Conexão WhatsApp não configurada");

    const bytes = Uint8Array.from(atob(data.base64), (char) => char.charCodeAt(0));
    const headers = { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": whatsappKey };
    // O gateway não aceita upload direto: guardamos o arquivo e enviamos um link temporário.
    const safeName = data.nome.replace(/[^\w.\-]+/g, "_");
    const path = `${conversa.id}/${Date.now()}-${safeName}`;
    const { error: upErr } = await admin.storage.from("whatsapp-anexos").upload(path, bytes, { contentType: data.mime, upsert: false });
    if (upErr) throw new Error("Não foi possível guardar o arquivo: " + upErr.message);
    const { data: signed, error: signErr } = await admin.storage.from("whatsapp-anexos").createSignedUrl(path, 60 * 60 * 24);
    if (signErr || !signed?.signedUrl) throw new Error("Não foi possível gerar o link do arquivo");

    const tipo = data.mime.startsWith("image/") ? "image" : data.mime.startsWith("video/") ? "video" : data.mime.startsWith("audio/") ? "audio" : "document";
    const media: Record<string, string> = { link: signed.signedUrl };
    if (tipo === "document") media['filename'] = data.nome;
    if (data.legenda?.trim() && (tipo === "image" || tipo === "video" || tipo === "document")) media['caption'] = data.legenda.trim();
    const sent = await fetch(`${GATEWAY_URL}/messages`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", to: conversa.telefone, type: tipo, [tipo]: media }),
    });
    const sentText = await sent.text();
    if (!sent.ok) {
      console.error(`WhatsApp media send failed [${sent.status}]: ${sentText}`);
      let motivo = "";
      try { motivo = (JSON.parse(sentText) as any)?.error?.message ?? ""; } catch { /* ignora */ }
      throw new Error(`O WhatsApp recusou o arquivo${motivo ? ": " + motivo : ""}`);
    }
    const waId = (JSON.parse(sentText) as { messages?: Array<{ id?: string }> }).messages?.[0]?.id ?? null;
    const conteudo = data.legenda?.trim() || `[${tipo === "image" ? "Imagem" : tipo === "video" ? "Vídeo" : tipo === "audio" ? (data.voz ? "Mensagem de voz" : "Áudio") : "Documento"}] ${data.nome}`;
    const { data: mensagem, error: mensagemError } = await admin.from("whatsapp_mensagens").insert({
      conversa_id: conversa.id,
      wa_message_id: waId,
      direcao: "saida",
      tipo,
      conteudo,
      status: "enviado",
      autor_id: userId,
      midia_path: tipo === "audio" ? path : null,
    }).select("id,direcao,tipo,conteudo,status,created_at,autor_id,midia_path").single();
    if (mensagemError) throw mensagemError;
    await admin.from("whatsapp_conversas").update({ ultima_mensagem: conteudo, ultima_mensagem_em: new Date().toISOString() }).eq("id", conversa.id);
    return { mensagem };
  });
export const getWhatsAppMediaUrl = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ mensagemId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { admin } = await requireCaller(getRequestHeader("Authorization"), ["admin", "gestor", "vendedor"]);
    const { data: msg } = await admin.from("whatsapp_mensagens").select("midia_path").eq("id", data.mensagemId).maybeSingle();
    if (!msg?.midia_path) throw new Error("Mídia não encontrada");
    const { data: signed, error } = await admin.storage.from("whatsapp-anexos").createSignedUrl(msg.midia_path, 60 * 60);
    if (error || !signed?.signedUrl) throw new Error("Não foi possível abrir o áudio");
    return { url: signed.signedUrl };
  });
