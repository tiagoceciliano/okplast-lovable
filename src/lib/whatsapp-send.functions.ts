import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { createCallerClient, requireCaller } from "@/lib/supabase-server";
import { nomeResponsavel } from "@/lib/whatsapp-signature.server";
import { assinarMensagem } from "@/lib/whatsapp-signature";

const schema = z.object({
  conversa_id: z.string().uuid().optional(), telefone: z.string().optional(), tipo: z.enum(["text", "template"]),
  texto: z.string().optional(), criar_apenas: z.boolean().optional(), nome_contato: z.string().optional(),
  template: z.object({ name: z.string(), language: z.string(), parametros: z.array(z.string()).optional() }).optional(),
});

export const enviarWhatsApp = createServerFn({ method: "POST" }).inputValidator((input) => schema.parse(input)).handler(async ({ data }) => {
  const header = getRequestHeader("Authorization");
  const { admin, userId } = await requireCaller(header, ["admin", "gestor", "vendedor"]);
  if (!header) throw new Error("Não autenticado");
  const body = { ...data };
  // Conversas de números conectados por QR Code (Uzapi) saem pelo próprio número, sem janela de 24h.
  let instancia: { id: string; phone_number_id: string | null; status: string } | null = null;
  let telefoneConversa = "";
  if (body.conversa_id && !body.criar_apenas) {
    const { data: c } = await admin.from("whatsapp_conversas").select("telefone,instancia_id").eq("id", body.conversa_id).maybeSingle();
    if (c?.instancia_id) {
      const { data: i } = await admin.from("whatsapp_instancias").select("id,phone_number_id,status").eq("id", c.instancia_id).maybeSingle();
      instancia = i ?? null;
      telefoneConversa = c.telefone;
    }
  }
  if (!body.criar_apenas && body.tipo === "text") {
    let responsavelId: string | null = null;
    if (body.conversa_id) {
      const { data: conversa, error } = await admin.from("whatsapp_conversas").select("responsavel_id").eq("id", body.conversa_id).maybeSingle();
      if (error || !conversa) throw new Error("Conversa não encontrada");
      responsavelId = conversa.responsavel_id;
    } else if (body.telefone) {
      const { data: conversas } = await admin.from("whatsapp_conversas").select("responsavel_id").like("telefone", `%${body.telefone.replace(/\D/g, "").slice(-8)}`).order("created_at").limit(1);
      responsavelId = conversas?.[0]?.responsavel_id ?? null;
    }
    if (!body.texto?.trim()) throw new Error("Escreva uma mensagem antes de enviar.");
    body.texto = assinarMensagem(await nomeResponsavel(admin, responsavelId, userId), body.texto);
  }
  if (instancia) {
    if (instancia.status !== "conectado" || !instancia.phone_number_id) throw new Error("O número desta conversa está desconectado. Reconecte o QR Code em Configurações > Conexões WhatsApp.");
    if (body.tipo !== "text") throw new Error("Números conectados por QR Code não usam modelos da Meta. Escreva a mensagem normalmente.");
    const { enviarUzapi } = await import("@/lib/uzapi.server");
    const waId = await enviarUzapi(instancia.phone_number_id, { to: telefoneConversa.replace(/\D/g, ""), type: "text", text: { preview_url: false, body: body.texto } });
    const { data: mensagem, error: mErr } = await admin.from("whatsapp_mensagens").insert({ conversa_id: body.conversa_id, wa_message_id: waId, direcao: "saida", tipo: "text", conteudo: body.texto, status: "sent", autor_id: userId }).select("*").single();
    if (mErr) throw new Error(mErr.message);
    await admin.from("whatsapp_conversas").update({ ultima_mensagem: body.texto, ultima_mensagem_em: new Date().toISOString() }).eq("id", body.conversa_id!);
    return { data: { mensagem }, error: null };
  }
  const { data: result, error } = await createCallerClient(header).functions.invoke("whatsapp-send", { body });
  if (error) {
    let detalhe = error.message;
    if (error.context instanceof Response) {
      const resposta = await error.context.json().catch(() => null);
      detalhe = resposta?.error || detalhe;
    }
    return { data: null, error: { message: detalhe } };
  }
  return { data: result, error: null };
});

/** Preserve the existing result shape while signing on the authenticated server. */
export async function whatsappSend(options: { body: z.input<typeof schema> }) {
  try { return await enviarWhatsApp({ data: options.body }); }
  catch (error) { return { data: null, error: { message: error instanceof Error ? error.message : "Falha ao enviar mensagem" } }; }
}