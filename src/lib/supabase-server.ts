// Helpers de servidor para as server functions migradas das edge functions.
// Constrói clientes Supabase por requisição (nunca singleton) — o header de
// autorização deve ser sempre o da requisição atual.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function getSupabaseUrl(): string {
  const url = process.env['SUPABASE_URL'] ?? process.env['VITE_SUPABASE_URL'];
  if (!url) throw new Error("SUPABASE_URL não configurada");
  return url;
}

export function getAnonKey(): string {
  const key =
    process.env['SUPABASE_ANON_KEY'] ?? process.env['VITE_SUPABASE_PUBLISHABLE_KEY'];
  if (!key) throw new Error("Chave pública do backend não configurada");
  return key;
}

export function getServiceKey(): string {
  const key = process.env['SUPABASE_SERVICE_ROLE_KEY'];
  if (!key) throw new Error("Chave de serviço do backend não configurada");
  return key;
}

export function createAdminClient(): SupabaseClient {
  return createClient(getSupabaseUrl(), getServiceKey());
}

export function createCallerClient(authHeader: string): SupabaseClient {
  return createClient(getSupabaseUrl(), getAnonKey(), {
    global: { headers: { Authorization: authHeader } },
  });
}

/**
 * Valida o JWT do chamador e (opcionalmente) exige um dos papéis informados.
 * Lança Error com a mesma mensagem que as edge functions retornavam.
 */
export async function requireCaller(
  authHeader: string | undefined,
  allowedRoles?: Array<"admin" | "gestor" | "vendedor">,
): Promise<{ userId: string; admin: SupabaseClient }> {
  if (!authHeader) throw new Error("Não autenticado");
  const caller = createCallerClient(authHeader);
  const {
    data: { user },
  } = await caller.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const admin = createAdminClient();
  if (allowedRoles && allowedRoles.length > 0) {
    const { data: roles } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    const ok = (roles ?? []).some((r: { role: string }) =>
      (allowedRoles as string[]).includes(r.role),
    );
    if (!ok) throw new Error("Sem permissão");
  }
  return { userId: user.id, admin };
}
