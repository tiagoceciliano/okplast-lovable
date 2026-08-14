import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Sem visita registrada por mais tempo que isso => algo está errado
const VISIT_STALE_MINUTES = 120;
// Não repetir alerta antes disso
const ALERT_COOLDOWN_MINUTES = 360;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const { data: lastVisit } = await supabase
      .from("page_visits")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: lastLead } = await supabase
      .from("leads")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const now = Date.now();
    const minutesSince = (iso?: string | null) =>
      iso ? Math.round((now - new Date(iso).getTime()) / 60000) : null;

    const visitAge = minutesSince(lastVisit?.created_at);
    const leadAge = minutesSince(lastLead?.created_at);

    const unhealthy = visitAge === null || visitAge > VISIT_STALE_MINUTES;
    let alertSent = false;

    if (unhealthy) {
      // Cooldown para não floodar
      const { data: recent } = await supabase
        .from("health_alerts")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const lastAlertAge = minutesSince(recent?.created_at);
      if (lastAlertAge === null || lastAlertAge > ALERT_COOLDOWN_MINUTES) {
        const webhookUrl =
          Deno.env.get("WEBHOOK_KINBOX_CHAPA_WHATSAPP") ||
          "https://webhook.kinbox.com.br/v3/inbound/mwVIr-FpU";

        const mensagem =
          `⚠️ ALERTA OK PLAST: nenhuma visita registrada no site há ` +
          `${visitAge === null ? "muito tempo" : `${visitAge} minutos`}. ` +
          `Último lead: ${leadAge === null ? "nenhum" : `${leadAge} min atrás`}. ` +
          `Verifique o site/backend.`;

        try {
          await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: "Monitor OK Plast",
              email: "monitor@okplast.com.br",
              phone: "",
              product: "ALERTA DE SISTEMA",
              message: mensagem,
            }),
          });
          alertSent = true;
        } catch (e) {
          console.error("Falha ao enviar alerta:", e);
        }

        await supabase.from("health_alerts").insert({
          tipo: "sem_visitas",
          detalhe: mensagem,
          notificado: alertSent,
        });
      }
    }

    return new Response(
      JSON.stringify({
        healthy: !unhealthy,
        last_visit_at: lastVisit?.created_at ?? null,
        last_visit_minutes: visitAge,
        last_lead_at: lastLead?.created_at ?? null,
        last_lead_minutes: leadAge,
        alert_sent: alertSent,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Erro no health-monitor:", error);
    return new Response(
      JSON.stringify({ healthy: false, error: "Erro ao verificar saúde do sistema" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});