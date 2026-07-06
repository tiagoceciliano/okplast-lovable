import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Payload {
  email: string;
  password: string;
  nome: string;
  role: "admin" | "gestor" | "vendedor";
  numero_raw?: string | null;   // ex: 5521999999999
  numero_formatado?: string | null;
  peso?: number;                // 0 para gestor
  recebe_lead?: boolean;
  ativo?: boolean;
  link_whatsapp_id?: string | null; // se presente, vincula ao whatsapp_numbers existente
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verifica quem chama — precisa ser admin
    const authHeader = req.headers.get("Authorization") || "";
    const jwt = authHeader.replace("Bearer ", "");
    if (!jwt) {
      return new Response(JSON.stringify({ error: "Não autenticado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const caller = createClient(url, anonKey, { global: { headers: { Authorization: `Bearer ${jwt}` } } });
    const { data: { user: callerUser } } = await caller.auth.getUser();
    if (!callerUser) {
      return new Response(JSON.stringify({ error: "Não autenticado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const admin = createClient(url, serviceKey);
    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", callerUser.id);
    if (!roles?.some((r: { role: string }) => r.role === "admin")) {
      return new Response(JSON.stringify({ error: "Apenas admin pode criar membros" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const payload: Payload = await req.json();
    if (!payload.email || !payload.password || !payload.nome || !payload.role) {
      return new Response(JSON.stringify({ error: "email, password, nome e role obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Cria user no Auth
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: payload.email,
      password: payload.password,
      email_confirm: true,
      user_metadata: { nome: payload.nome },
    });
    if (createErr || !created.user) {
      return new Response(JSON.stringify({ error: createErr?.message || "Erro ao criar usuário" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const newUserId = created.user.id;

    // Vincula role
    const { error: roleErr } = await admin.from("user_roles").insert({
      user_id: newUserId, role: payload.role,
    });
    if (roleErr) {
      return new Response(JSON.stringify({ error: "Usuário criado mas erro no papel: " + roleErr.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Se veio link_whatsapp_id, apenas vincula o novo user ao registro existente
    if (payload.link_whatsapp_id) {
      const { error: linkErr } = await admin
        .from("whatsapp_numbers")
        .update({ user_id: newUserId, nome_vendedor: payload.nome })
        .eq("id", payload.link_whatsapp_id);
      if (linkErr) {
        return new Response(JSON.stringify({ error: "Usuário criado mas erro ao vincular: " + linkErr.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    } else if (payload.numero_raw && payload.numero_formatado) {
      // Cria whatsapp_number se veio número
      await admin.from("whatsapp_numbers").insert({
        user_id: newUserId,
        nome_vendedor: payload.nome,
        numero_raw: payload.numero_raw,
        numero_formatado: payload.numero_formatado,
        peso: payload.peso ?? 0,
        ativo: payload.ativo ?? true,
        recebe_lead: payload.recebe_lead ?? (payload.role !== "gestor"),
      });
    }

    return new Response(JSON.stringify({ success: true, user_id: newUserId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});