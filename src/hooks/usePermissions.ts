import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "./useCurrentUser";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export type Resource =
  | "leads" | "negociacoes" | "tarefas" | "comentarios"
  | "vendedores" | "dashboard";

export type Action = "view" | "edit" | "delete";

interface PermissionRow {
  role: AppRole;
  resource: string;
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
  scope: string; // 'all' | 'own'
}

let cache: PermissionRow[] | null = null;

export function usePermissions() {
  const { user, loading: userLoading } = useCurrentUser();
  const [perms, setPerms] = useState<PermissionRow[] | null>(cache);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) { setPerms(cache); setLoading(false); return; }
    supabase.from("role_permissions").select("*").then(({ data }) => {
      if (data) { cache = data as PermissionRow[]; setPerms(cache); }
      setLoading(false);
    });
  }, []);

  const can = (resource: Resource, action: Action, ownerId?: string | null): boolean => {
    if (!user || !perms) return false;
    // Pega a "melhor" permissão entre as roles do usuário
    const rows = perms.filter((p) => user.roles.includes(p.role) && p.resource === resource);
    if (rows.length === 0) return false;
    return rows.some((row) => {
      const flag = action === "view" ? row.can_view : action === "edit" ? row.can_edit : row.can_delete;
      if (!flag) return false;
      if (row.scope === "own" && ownerId !== undefined) {
        return ownerId === user.id;
      }
      return true;
    });
  };

  const scope = (resource: Resource): "all" | "own" | "none" => {
    if (!user || !perms) return "none";
    const rows = perms.filter((p) => user.roles.includes(p.role) && p.resource === resource && p.can_view);
    if (rows.length === 0) return "none";
    return rows.some((r) => r.scope === "all") ? "all" : "own";
  };

  const refresh = async () => {
    const { data } = await supabase.from("role_permissions").select("*");
    if (data) { cache = data as PermissionRow[]; setPerms(cache); }
  };

  return { can, scope, perms, loading: loading || userLoading, user, refresh };
}