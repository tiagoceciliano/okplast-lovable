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