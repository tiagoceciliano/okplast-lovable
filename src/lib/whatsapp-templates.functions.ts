import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { requireCaller } from "@/lib/supabase-server";

// Lista os templates (mensagens prontas) aprovados na conta WhatsApp Business.

const GATEWAY_URL = "https://connector-gateway.lovable.dev/whatsapp";

export interface WhatsAppTemplate {
  nome: string;
  status: string;
  idioma: string;
  categoria: string;
  texto: string;
  variaveis: number;
}

export const whatsappTemplates = createServerFn({ method: "POST" }).handler(async () => {
  await requireCaller(getRequestHeader("Authorization"));

  const LOVABLE_API_KEY = process.env['LOVABLE_API_KEY'];
  const WHATSAPP_API_KEY = process.env['WHATSAPP_API_KEY'];
  if (!LOVABLE_API_KEY || !WHATSAPP_API_KEY) {
    throw new Error("Conexão WhatsApp não configurada");
  }

  const resp = await fetch(
    `${GATEWAY_URL}/message_templates?fields=name,status,language,category,components&limit=100`,
    {
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": WHATSAPP_API_KEY,
      },
    },
  );
  const respText = await resp.text();
  if (!resp.ok) {
    console.error(`Templates failed [${resp.status}]: ${respText}`);
    throw new Error("Falha ao listar templates");
  }

  let templates: WhatsAppTemplate[] = [];
  try {
    const parsed = JSON.parse(respText) as {
      data?: Array<{
        name: string;
        status: string;
        language: string;
        category: string;
        components?: Array<{ type: string; text?: string }>;
      }>;
    };
    templates = (parsed.data ?? []).map((t) => {
      const bodyComp = (t.components ?? []).find((c) => c.type === "BODY");
      const variaveis = (bodyComp?.text?.match(/\{\{\d+\}\}/g) ?? []).length;
      return {
        nome: t.name,
        status: t.status,
        idioma: t.language,
        categoria: t.category,
        texto: bodyComp?.text ?? "",
        variaveis,
      };
    });
  } catch {
    /* ignora */
  }

  return { templates };
});
