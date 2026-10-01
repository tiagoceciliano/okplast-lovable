// Middleware de função: anexa o token de sessão do Supabase (lado do cliente)
// ao header Authorization de cada chamada de server function, replicando o
// comportamento automático do supabase.functions.invoke().
import { createMiddleware } from "@tanstack/react-start";

export const attachSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    let token: string | undefined;
    if (typeof window !== "undefined") {
      try {
        // Import dinâmico: evita avaliar o cliente Supabase no runtime do servidor.
        const { supabase } = await import("@/integrations/supabase/client");
        const {
          data: { session },
        } = await supabase.auth.getSession();
        token = session?.access_token;
      } catch {
        // segue sem token — o servidor rejeita com "Não autenticado"
      }
    }
    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
);
