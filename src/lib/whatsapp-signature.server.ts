import type { SupabaseClient } from "@supabase/supabase-js";

export async function nomeResponsavel(admin: SupabaseClient, responsavelId: string | null, autorId: string) {
  const id = responsavelId || autorId;
  const { data, error } = await admin.auth.admin.getUserById(id);
  if (error || !data.user) throw new Error("Não foi possível identificar o responsável pelo atendimento.");
  const nome = data.user.user_metadata?.['nome'];
  if (typeof nome === "string" && nome.trim()) return nome;
  const { data: numero } = await admin.from("whatsapp_numbers").select("nome_vendedor").eq("user_id", id).limit(1).maybeSingle();
  return numero?.nome_vendedor || data.user.email?.split("@")[0] || "Atendimento";
}