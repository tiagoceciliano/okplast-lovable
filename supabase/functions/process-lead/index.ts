import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface LeadPayload {
  nome: string;
  email: string;
  telefone: string;
  produto_interesse: string;
  mensagem?: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
}

interface GeoData {
  city?: string;
  region?: string;
  country_name?: string;
  ip?: string;
}

// Determina qual webhook usar baseado no produto
function getWebhookType(produto: string): "chapas" | "geral" {
  const produtosChapas = [
    "chapas",
    "pedaços",
    "placas",
    "chapa",
    "pedaço",
    "placa",
  ];
  
  const produtoLower = produto.toLowerCase();
  
  for (const termo of produtosChapas) {
    if (produtoLower.includes(termo)) {
      return "chapas";
    }
  }
  
  if (produto === "Chapas e Pedaços de Placas") {
    return "chapas";
  }
  
  return "geral";
}

// Obtém timestamp no fuso de São Paulo
function getSaoPauloTimestamp(): string {
  const now = new Date();
  return now.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: LeadPayload = await req.json();

    // Validação básica
    if (!payload.nome || !payload.email || !payload.telefone || !payload.produto_interesse) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: nome, email, telefone, produto_interesse" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Captura IP do cliente
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";

    // Consulta geolocalização via ipapi.co
    let geoData: GeoData = {};
    try {
      if (clientIp && clientIp !== "unknown") {
        const geoResponse = await fetch(`https://ipapi.co/${clientIp}/json/`);
        if (geoResponse.ok) {
          geoData = await geoResponse.json();
        }
      }
    } catch (geoError) {
      console.error("Erro ao consultar geolocalização:", geoError);
    }

    // Determina tipo de webhook
    const webhookType = getWebhookType(payload.produto_interesse);
    const webhookUrl = webhookType === "chapas" 
      ? Deno.env.get("WEBHOOK_CHAPAS") 
      : Deno.env.get("WEBHOOK_GERAL");

    // Cria cliente Supabase com service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Salva lead no banco de dados
    const { data: leadData, error: dbError } = await supabase
      .from("leads")
      .insert({
        nome: payload.nome,
        email: payload.email,
        telefone: payload.telefone,
        produto_interesse: payload.produto_interesse,
        mensagem: payload.mensagem || null,
        utm_source: payload.utm_source || null,
        utm_medium: payload.utm_medium || null,
        utm_campaign: payload.utm_campaign || null,
        utm_term: payload.utm_term || null,
        utm_content: payload.utm_content || null,
        cidade: geoData.city || null,
        estado: geoData.region || null,
        pais: geoData.country_name || null,
        ip_address: clientIp,
        webhook_tipo: webhookType,
        webhook_enviado: false,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Erro ao salvar lead:", dbError);
      throw new Error("Erro ao salvar lead no banco de dados");
    }

    // Prepara payload para webhook Kinbox
    const webhookPayload = {
      lead_id: leadData.id,
      nome: payload.nome,
      email: payload.email,
      telefone: payload.telefone,
      produto_interesse: payload.produto_interesse,
      mensagem: payload.mensagem || "",
      utm_source: payload.utm_source || "",
      utm_medium: payload.utm_medium || "",
      utm_campaign: payload.utm_campaign || "",
      utm_term: payload.utm_term || "",
      utm_content: payload.utm_content || "",
      cidade: geoData.city || "",
      estado: geoData.region || "",
      pais: geoData.country_name || "",
      ip: clientIp,
      timestamp_sao_paulo: getSaoPauloTimestamp(),
      created_at: leadData.created_at,
    };

    // Envia para webhook se configurado
    let webhookEnviado = false;
    if (webhookUrl) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(webhookPayload),
        });

        if (webhookResponse.ok) {
          webhookEnviado = true;
          // Atualiza status do webhook no banco
          await supabase
            .from("leads")
            .update({ webhook_enviado: true })
            .eq("id", leadData.id);
        } else {
          console.error("Webhook retornou erro:", await webhookResponse.text());
        }
      } catch (webhookError) {
        console.error("Erro ao enviar webhook:", webhookError);
      }
    } else {
      console.warn(`Webhook ${webhookType} não configurado`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        lead_id: leadData.id,
        webhook_enviado: webhookEnviado,
        message: "Lead processado com sucesso" 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Erro no processamento:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno ao processar lead" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
