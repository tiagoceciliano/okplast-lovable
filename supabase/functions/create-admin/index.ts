import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Create admin user
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: "admin@okplast.com.br",
      password: "N4la@pitbull",
      email_confirm: true,
    });

    if (createError) {
      // User might already exist
      if (createError.message.includes("already")) {
        // Get existing user
        const { data: listData } = await supabase.auth.admin.listUsers();
        const existingUser = listData?.users?.find(u => u.email === "admin@okplast.com.br");
        
        if (existingUser) {
          // Ensure role exists
          const { error: roleError } = await supabase
            .from("user_roles")
            .upsert({ user_id: existingUser.id, role: "admin" }, { onConflict: "user_id,role" });

          return new Response(
            JSON.stringify({ success: true, message: "Admin user already exists, role ensured", roleError }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
      throw createError;
    }

    // Assign admin role
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({ user_id: userData.user.id, role: "admin" });

    return new Response(
      JSON.stringify({ success: true, message: "Admin user created", userId: userData.user.id, roleError }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
