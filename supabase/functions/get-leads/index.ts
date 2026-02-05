import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate duplicates for each lead
    const leadsWithDuplicates = leads?.map(lead => {
      const duplicatesByEmail = leads?.filter(l => 
        l.email === lead.email && l.id !== lead.id
      ).length || 0;

      const duplicatesByPhone = leads?.filter(l => 
        l.telefone === lead.telefone && l.id !== lead.id
      ).length || 0;

      return {
        ...lead,
        duplicate_count: Math.max(duplicatesByEmail, duplicatesByPhone),
        total_registrations: Math.max(duplicatesByEmail, duplicatesByPhone) + 1
      };
    }) || [];

    return new Response(
      JSON.stringify({ leads: leadsWithDuplicates }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
