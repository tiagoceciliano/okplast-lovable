import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

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
  const produtosChapas = ["chapas", "pedaços", "placas", "chapa", "pedaço", "placa"];
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

// Gera HTML do email
function generateEmailHtml(data: {
  nome: string;
  email: string;
  telefone: string;
  produto: string;
  mensagem: string;
  cidade?: string;
  estado?: string;
  timestamp: string;
  leadId: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Novo Orçamento - Lab Acrílicos</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #0066CC; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">📬 NOVO ORÇAMENTO</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Lab Acrílicos - Solicitação via Site</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              
              <!-- Cliente Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="border-bottom: 2px solid #0066CC; padding-bottom: 8px; margin-bottom: 16px;">
                    <h2 style="margin: 0; color: #333; font-size: 16px; text-transform: uppercase;">Dados do Cliente</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                          <strong style="color: #666;">Nome:</strong>
                          <span style="color: #333; margin-left: 8px;">${data.nome}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                          <strong style="color: #666;">E-mail:</strong>
                          <a href="mailto:${data.email}" style="color: #0066CC; margin-left: 8px; text-decoration: none;">${data.email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                          <strong style="color: #666;">Telefone:</strong>
                          <a href="tel:${data.telefone.replace(/\D/g, '')}" style="color: #0066CC; margin-left: 8px; text-decoration: none;">${data.telefone}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Produto -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="border-bottom: 2px solid #0066CC; padding-bottom: 8px;">
                    <h2 style="margin: 0; color: #333; font-size: 16px; text-transform: uppercase;">Produto de Interesse</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 16px;">
                    <div style="background-color: #f8f9fa; padding: 16px; border-radius: 6px; border-left: 4px solid #0066CC;">
                      <strong style="color: #333; font-size: 16px;">${data.produto}</strong>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Mensagem -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="border-bottom: 2px solid #0066CC; padding-bottom: 8px;">
                    <h2 style="margin: 0; color: #333; font-size: 16px; text-transform: uppercase;">Mensagem</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 16px;">
                    <div style="background-color: #f8f9fa; padding: 16px; border-radius: 6px; white-space: pre-wrap; line-height: 1.6; color: #333;">
${data.mensagem || "Nenhuma mensagem adicional."}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Reply Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${data.email}?subject=Re: Orçamento Lab Acrílicos - ${data.produto}" 
                       style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">
                      📧 Responder Cliente
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 16px 32px; border-top: 1px solid #eee;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color: #666; font-size: 12px;">
                    ${data.cidade && data.estado ? `📍 Origem: ${data.cidade}, ${data.estado}` : "📍 Origem não identificada"}
                  </td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 12px; padding-top: 4px;">
                    📅 ${data.timestamp}
                  </td>
                </tr>
                <tr>
                  <td style="color: #999; font-size: 11px; padding-top: 8px;">
                    Lead ID: #${data.leadId.slice(0, 8)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
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

    const timestamp = getSaoPauloTimestamp();

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
      timestamp_sao_paulo: timestamp,
      created_at: leadData.created_at,
      canal: "email", // Indica que veio do formulário de email
    };

    // Envia para webhook Kinbox
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

    // Envia email via Resend
    let emailEnviado = false;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        
        const emailHtml = generateEmailHtml({
          nome: payload.nome,
          email: payload.email,
          telefone: payload.telefone,
          produto: payload.produto_interesse,
          mensagem: payload.mensagem || "",
          cidade: geoData.city,
          estado: geoData.region,
          timestamp: timestamp,
          leadId: leadData.id,
        });

        const emailResponse = await resend.emails.send({
          from: "Lab Acrílicos <noreply@labacrilicos.com.br>",
          to: ["comercial@labacrilicos.com.br"],
          reply_to: payload.email,
          subject: `Novo Orçamento - ${payload.produto_interesse} - ${payload.nome}`,
          html: emailHtml,
        });

        console.log("Email enviado com sucesso:", emailResponse);
        emailEnviado = true;
      } catch (emailError) {
        console.error("Erro ao enviar email via Resend:", emailError);
        // Não falha a requisição se o email falhar - lead já está salvo
      }
    } else {
      console.warn("RESEND_API_KEY não configurada - email não enviado");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        lead_id: leadData.id,
        webhook_enviado: webhookEnviado,
        email_enviado: emailEnviado,
        message: "Orçamento enviado com sucesso" 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Erro no processamento:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno ao processar orçamento" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
