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
  produto_interesse?: string;
  tipo_material?: string;
  mensagem?: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  current_url?: string | null;
  destino_whatsapp?: string | null;
  destino_whatsapp_formatado?: string | null;
}

interface GeoData {
  city?: string;
  region?: string;
  country_name?: string;
  ip?: string;
}

// Obtém data e hora separados no fuso de São Paulo
function getSaoPauloDateTime(): { date: string; time: string } {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { timeZone: "America/Sao_Paulo" };

  const date = now.toLocaleDateString("pt-BR", options);
  const time = now.toLocaleTimeString("pt-BR", {
    ...options,
    hour12: false,
  });

  return { date, time };
}

// Remove formatação do telefone (apenas números), sem adicionar DDI
function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, "").replace(/^55/, "");
}


serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: LeadPayload = await req.json();

    if (!payload.nome || !payload.email || !payload.telefone) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: nome, email, telefone" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Captura IP do cliente
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    // Consulta geolocalização
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

    // Webhook único para WhatsApp chapas
    const webhookUrl = Deno.env.get("WEBHOOK_KINBOX_CHAPA_WHATSAPP");

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
        produto_interesse: payload.produto_interesse || "Chapa Inteira",
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
        webhook_tipo: "whatsapp",
        webhook_enviado: false,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Erro ao salvar lead:", dbError);
      throw new Error("Erro ao salvar lead no banco de dados");
    }

    // === Cria negociação automática ligada ao vendedor do rateio ===
    try {
      let responsavelId: string | null = null;
      const destino = payload.destino_whatsapp || null;
      if (destino) {
        const { data: wa } = await supabase
          .from("whatsapp_numbers")
          .select("user_id")
          .eq("numero_raw", destino)
          .maybeSingle();
        responsavelId = wa?.user_id ?? null;
      }

      // Próxima posição na coluna 'entrada'
      const { data: last } = await supabase
        .from("negociacoes")
        .select("posicao")
        .eq("etapa", "entrada")
        .order("posicao", { ascending: false })
        .limit(1)
        .maybeSingle();
      const nextPos = (last?.posicao ?? 0) + 1;

      await supabase.from("negociacoes").insert({
        lead_id: leadData.id,
        nome_cliente: payload.nome,
        telefone: payload.telefone,
        email: payload.email,
        etapa: "entrada",
        responsavel_id: responsavelId,
        produto: payload.produto_interesse || "Chapa Inteira",
        material: payload.tipo_material || null,
        mensagem: payload.mensagem || null,
        utm_source: payload.utm_source || null,
        utm_medium: payload.utm_medium || null,
        utm_campaign: payload.utm_campaign || null,
        utm_term: payload.utm_term || null,
        utm_content: payload.utm_content || null,
        posicao: nextPos,
      });
    } catch (negErr) {
      console.error("Erro ao criar negociação:", negErr);
      // não bloqueia o webhook
    }

    // Prepara payload para webhook
    const { date, time } = getSaoPauloDateTime();

    const webhookPayload = {
      name: payload.nome,
      email: payload.email,
      phone: cleanPhone(payload.telefone),
      product: payload.produto_interesse || "Chapa Inteira",
      tipo_material: payload.tipo_material || payload.produto_interesse || "-",
      message: payload.mensagem || "-",
      city: geoData.city || "-",
      state: geoData.region || "-",
      country: geoData.country_name || "Brazil",
      utm_source: payload.utm_source || "-",
      utm_medium: payload.utm_medium || "-",
      utm_campaign: payload.utm_campaign || "-",
      utm_term: payload.utm_term || "-",
      utm_content: payload.utm_content || "-",
      submitted_at: date,
      submitted_time: time,
      current_url: payload.current_url || "-",
      // Rateio 50/50 — número do atendente destino escolhido no client.
      destination_phone: payload.destino_whatsapp || "-",
      destination_phone_formatted: payload.destino_whatsapp_formatado || "-",
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
      console.warn("WEBHOOK_KINBOX_CHAPA_WHATSAPP não configurado");
    }

    return new Response(
      JSON.stringify({
        success: true,
        lead_id: leadData.id,
        webhook_enviado: webhookEnviado,
        message: "Lead processado com sucesso",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Erro no processamento:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno ao processar lead" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

