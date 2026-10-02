import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "./useCurrentUser";

export type Resource =
  | "leads" | "negociacoes" | "tarefas" | "comentarios"
  | "vendedores" | "dashboard";

export type Action = "view" | "edit" | "delete";

interface PermissionRow {
  resource: string;
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
  scope: string; // 'all' | 'own'
}

const cache: Record<string, PermissionRow[]> = {};

/** Perfil personalizado (se houver) substitui as permissões do papel padrão. */
async function loadFor(userId: string, roles: string[]): Promise<PermissionRow[]> {
  const { data: up } = await supabase.from("user_perfis").select("perfil_id").eq("user_id", userId).maybeSingle();
  if (up?.perfil_id) {
    const { data } = await supabase.from("perfil_permissoes").select("*").eq("perfil_id", up.perfil_id);
    return (data || []) as PermissionRow[];
  }
  const { data } = await supabase.from("role_permissions").select("*").in("role", roles as never[]);
  return (data || []) as PermissionRow[];
}

export function usePermissions() {
  const { user, loading: userLoading } = useCurrentUser();
  const key = user?.id ?? "";
  const [perms, setPerms] = useState<PermissionRow[] | null>(cache[key] ?? null);
  const [loading, setLoading] = useState(!cache[key]);

  useEffect(() => {
    if (!user) return;
    if (cache[user.id]) { setPerms(cache[user.id] ?? null); setLoading(false); return; }
    loadFor(user.id, user.roles).then((rows) => { cache[user.id] = rows; setPerms(rows); setLoading(false); });
  }, [user?.id]);

  const can = (resource: Resource, action: Action, ownerId?: string | null): boolean => {
    if (!user || !perms) return false;
    const rows = perms.filter((p) => p.resource === resource);
    return rows.some((row) => {
      const flag = action === "view" ? row.can_view : action === "edit" ? row.can_edit : row.can_delete;
      if (!flag) return false;
      if (row.scope === "own" && ownerId !== undefined) return ownerId === user.id;
      return true;
    });
  };

  const scope = (resource: Resource): "all" | "own" | "none" => {
    if (!user || !perms) return "none";
    const rows = perms.filter((p) => p.resource === resource && p.can_view);
    if (rows.length === 0) return "none";
    return rows.some((r) => r.scope === "all") ? "all" : "own";
  };

  const refresh = async () => {
    if (!user) return;
    const rows = await loadFor(user.id, user.roles);
    cache[user.id] = rows; setPerms(rows);
  };

  return { can, scope, perms, loading: loading || userLoading, user, refresh };
}
