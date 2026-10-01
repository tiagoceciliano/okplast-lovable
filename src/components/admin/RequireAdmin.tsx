import { useEffect, useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface RequireAuthProps {
  children: React.ReactNode;
  roles?: AppRole[];
}

/**
 * Gate para rotas do admin. Se `roles` não for passado, aceita qualquer
 * usuário logado com pelo menos um papel (admin/gestor/vendedor).
 */
export function RequireAuth({ children, roles }: RequireAuthProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const allowed: AppRole[] = roles ?? ["admin", "gestor", "vendedor"];

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login", { replace: true });
        return;
      }
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      const has = (userRoles ?? []).some((r) => allowed.includes(r.role as AppRole));
      if (!has) {
        await supabase.auth.signOut();
        navigate("/admin/login", { replace: true });
        return;
      }
      setAuthorized(true);
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/admin/login", { replace: true });
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, [navigate, roles]);

  if (loading && !authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  if (!authorized) return null;
  return <>{children}</>;
}

// Alias para compat retroativa.
export const RequireAdmin = ({ children }: { children: React.ReactNode }) => (
  <RequireAuth roles={["admin"]}>{children}</RequireAuth>
);
