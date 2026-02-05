 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers":
     "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
 };
 
 interface VisitPayload {
   visitor_id: string;
   session_id: string;
   page_url: string;
   page_path: string;
   referrer: string | null;
   utm_source: string | null;
   utm_medium: string | null;
   utm_campaign: string | null;
   utm_term: string | null;
   utm_content: string | null;
   user_agent: string | null;
 }
 
 interface GeoData {
   city?: string;
   region?: string;
   country_name?: string;
   ip?: string;
 }
 
 serve(async (req) => {
   // Handle CORS preflight
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const payload: VisitPayload = await req.json();
 
     // Validação básica
     if (!payload.visitor_id || !payload.session_id || !payload.page_url) {
       return new Response(
         JSON.stringify({ error: "Campos obrigatórios: visitor_id, session_id, page_url" }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     // Captura IP do cliente
     const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] || 
                      req.headers.get("cf-connecting-ip") || 
                      "unknown";
 
     // Consulta geolocalização via ipapi.co (mesmo serviço usado em process-lead)
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
 
     // Cria cliente Supabase com service role
     const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
     const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
     const supabase = createClient(supabaseUrl, supabaseServiceKey);
 
     // Salva visita no banco de dados
     const { error: dbError } = await supabase
       .from("page_visits")
       .insert({
         visitor_id: payload.visitor_id,
         session_id: payload.session_id,
         page_url: payload.page_url,
         page_path: payload.page_path,
         referrer: payload.referrer || null,
         utm_source: payload.utm_source || null,
         utm_medium: payload.utm_medium || null,
         utm_campaign: payload.utm_campaign || null,
         utm_term: payload.utm_term || null,
         utm_content: payload.utm_content || null,
         user_agent: payload.user_agent || null,
         ip_address: clientIp,
         cidade: geoData.city || null,
         estado: geoData.region || null,
         pais: geoData.country_name || null,
       });
 
     if (dbError) {
       console.error("Erro ao salvar visita:", dbError);
       throw new Error("Erro ao salvar visita no banco de dados");
     }
 
     return new Response(
       JSON.stringify({ success: true }),
       { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
 
   } catch (error) {
     console.error("Erro no processamento:", error);
     return new Response(
       JSON.stringify({ error: "Erro interno ao processar visita" }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });