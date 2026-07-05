import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export interface CurrentUser {
  id: string;
  email: string | null;
  roles: AppRole[];
  primaryRole: AppRole | null;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (mounted) { setUser(null); setLoading(false); }
        return;
      }
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      const roles = (rolesData ?? []).map((r) => r.role as AppRole);
      // ordem de prioridade
      const priority: AppRole[] = ["admin", "gestor", "vendedor", "user"];
      const primary = priority.find((p) => roles.includes(p)) ?? null;
      if (mounted) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? null,
          roles,
          primaryRole: primary,
        });
        setLoading(false);
      }
    };
    load();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => load());
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  return { user, loading };
}