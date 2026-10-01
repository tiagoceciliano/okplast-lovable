import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { createAdminClient, requireCaller } from "@/lib/supabase-server";

type LeadRow = Record<string, unknown> & {
  id: string;
  email: string | null;
  telefone: string | null;
};

export const getLeads = createServerFn({ method: "POST" }).handler(async () => {
  // A edge function original rodava com verify_jwt=true (sessão obrigatória);
  // preservamos a exigência de sessão autenticada.
  await requireCaller(getRequestHeader("Authorization"));
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50000);

  if (error) throw new Error(error.message);
  const leads = (data ?? []) as LeadRow[];

  // Calculate duplicates for each lead
  const leadsWithDuplicates = leads.map((lead) => {
    const duplicatesByEmail = leads.filter(
      (l) => l.email === lead.email && l.id !== lead.id,
    ).length;
    const duplicatesByPhone = leads.filter(
      (l) => l.telefone === lead.telefone && l.id !== lead.id,
    ).length;
    return {
      ...lead,
      duplicate_count: Math.max(duplicatesByEmail, duplicatesByPhone),
      total_registrations: Math.max(duplicatesByEmail, duplicatesByPhone) + 1,
    };
  });

  return { leads: leadsWithDuplicates };
});
