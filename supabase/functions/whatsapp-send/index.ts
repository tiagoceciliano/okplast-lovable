import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Envia mensagem WhatsApp (texto livre dentro da janela de 24h, ou template)
// via Lovable Connector Gateway. Chamado pelo admin autenticado.

const GATEWAY_URL = "https://connector-gateway.lovable.dev/whatsapp";

interface Body {
  conversa_id?: string;
  telefone?: string; // dígitos com DDI, ex: 5521999998888 (para nova conversa)
  tipo: "text" | "template";
  texto?: string;
  template?: { name: string; language: string; parametros?: string[] };
  criar_apenas?: boolean; // cria/retorna a conversa sem enviar mensagem
  nome_contato?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Não autenticado" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  // Valida o usuário pelo JWT
  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
  const { data: { user }, error: authErr } = await userClient.auth.getUser();
  if (authErr || !user) return json({ error: "Sessão inválida" }, 401);

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", user.id);
  const isStaff = (roles ?? []).some((r: any) => ["admin", "gestor", "vendedor"].includes(r.role));
  if (!isStaff) return json({ error: "Sem permissão" }, 403);

  let body: Body;
  try { body = await req.json(); } catch { return json({ error: "Body inválido" }, 400); }

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const WHATSAPP_API_KEY = Deno.env.get("WHATSAPP_API_KEY");
  if (!LOVABLE_API_KEY || !WHATSAPP_API_KEY) return json({ error: "Conexão WhatsApp não configurada" }, 500);

  // Resolve a conversa
  let conversa: any = null;
  if (body.conversa_id) {
    const { data } = await admin.from("whatsapp_conversas").select("*").eq("id", body.conversa_id).maybeSingle();
    conversa = data;
  } else if (body.telefone) {
    const tel = body.telefone.replace(/\D/g, "");
    const { data } = await admin.from("whatsapp_conversas").select("*").eq("telefone", tel).maybeSingle();
    conversa = data;
    if (!conversa) {
      const { data: novo, error: cErr } = await admin.from("whatsapp_conversas")
        .insert({ telefone: tel, responsavel_id: user.id }).select("*").single();
      if (cErr) return json({ error: "Falha ao criar conversa: " + cErr.message }, 500);
      conversa = novo;
    }
  }
  if (!conversa) return json({ error: "Informe conversa_id ou telefone" }, 400);

  if (body.criar_apenas) {
    if (body.nome_contato?.trim() && !conversa.nome_contato) {
      await admin.from("whatsapp_conversas").update({ nome_contato: body.nome_contato.trim() }).eq("id", conversa.id);
      conversa.nome_contato = body.nome_contato.trim();
    }
    return json({ success: true, conversa });
  }

  // Permissão: admin/gestor ou responsável pela conversa
  const isAdminGestor = (roles ?? []).some((r: any) => ["admin", "gestor"].includes(r.role));
  if (!isAdminGestor && conversa.responsavel_id && conversa.responsavel_id !== user.id) {
    return json({ error: "Esta conversa pertence a outro vendedor" }, 403);
  }

  // Janela de 24h: fora dela, só template
  const janelaAberta = conversa.ultima_entrada_cliente_em
    && (Date.now() - new Date(conversa.ultima_entrada_cliente_em).getTime()) < 24 * 60 * 60 * 1000;
  if (body.tipo === "text" && !janelaAberta) {
    return json({ error: "Janela de 24h fechada: o cliente precisa responder primeiro, ou envie uma mensagem pronta (template).", janela_fechada: true }, 422);
  }

  // Monta payload da Meta
  let waBody: any;
  if (body.tipo === "template") {
    if (!body.template?.name) return json({ error: "Template não informado" }, 400);
    const params = (body.template.parametros ?? []).map((t) => ({ type: "text", text: t }));
    waBody = {
      messaging_product: "whatsapp",
      to: conversa.telefone,
      type: "template",
      template: {
        name: body.template.name,
        language: { code: body.template.language || "pt_BR" },
        ...(params.length ? { components: [{ type: "body", parameters: params }] } : {}),
      },
    };
  } else {
    const texto = (body.texto ?? "").trim();
    if (!texto || texto.length > 4096) return json({ error: "Texto vazio ou longo demais" }, 400);
    waBody = { messaging_product: "whatsapp", to: conversa.telefone, type: "text", text: { body: texto } };
  }

  const resp = await fetch(`${GATEWAY_URL}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": WHATSAPP_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(waBody),
  });
  const respText = await resp.text();
  if (!resp.ok) {
    console.error(`WhatsApp send failed [${resp.status}]: ${respText}`);
    return json({ error: "Falha no envio", status: resp.status, details: respText }, resp.status);
  }

  let waId: string | null = null;
  try { waId = JSON.parse(respText)?.messages?.[0]?.id ?? null; } catch { /* ignora */ }

  const conteudo = body.tipo === "template"
    ? `[Mensagem pronta] ${body.template!.name}${body.template!.parametros?.length ? " — " + body.template!.parametros.join(" | ") : ""}`
    : body.texto!.trim();

  const { data: msg, error: mErr } = await admin.from("whatsapp_mensagens").insert({
    conversa_id: conversa.id,
    wa_message_id: waId,
    direcao: "saida",
    tipo: body.tipo === "template" ? "template" : "text",
    conteudo,
    status: "enviado",
    autor_id: user.id,
  }).select("*").single();
  if (mErr) return json({ error: "Enviado, mas falhou ao gravar: " + mErr.message }, 500);

  await admin.from("whatsapp_conversas").update({
    ultima_mensagem: conteudo,
    ultima_mensagem_em: new Date().toISOString(),
    responsavel_id: conversa.responsavel_id ?? user.id,
  }).eq("id", conversa.id);

  return json({ success: true, mensagem: msg, conversa_id: conversa.id });
});
