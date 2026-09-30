import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Lista os templates (mensagens prontas) aprovados na conta WhatsApp Business.

const GATEWAY_URL = "https://connector-gateway.lovable.dev/whatsapp";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Não autenticado" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: authErr } = await userClient.auth.getUser();
  if (authErr || !user) return json({ error: "Sessão inválida" }, 401);

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const WHATSAPP_API_KEY = Deno.env.get("WHATSAPP_API_KEY");
  if (!LOVABLE_API_KEY || !WHATSAPP_API_KEY) return json({ error: "Conexão WhatsApp não configurada" }, 500);

  const resp = await fetch(`${GATEWAY_URL}/message_templates?fields=name,status,language,category,components&limit=100`, {
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": WHATSAPP_API_KEY,
    },
  });
  const respText = await resp.text();
  if (!resp.ok) {
    console.error(`Templates failed [${resp.status}]: ${respText}`);
    return json({ error: "Falha ao listar templates", status: resp.status, details: respText }, resp.status);
  }

  let templates: any[] = [];
  try {
    const parsed = JSON.parse(respText);
    templates = (parsed.data ?? []).map((t: any) => {
      const bodyComp = (t.components ?? []).find((c: any) => c.type === "BODY");
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
  } catch { /* ignora */ }

  return json({ templates });
});
