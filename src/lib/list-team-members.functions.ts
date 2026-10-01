import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { requireCaller } from "@/lib/supabase-server";

export type TeamUserRow = { id: string; email: string | null; nome: string | null };

export const listTeamMembers = createServerFn({ method: "POST" }).handler(async () => {
  const { admin } = await requireCaller(getRequestHeader("Authorization"), [
    "admin",
    "gestor",
  ]);

  // Lista todos os usuários (paginado até 1000)
  const emails: Record<string, string> = {};
  const users: TeamUserRow[] = [];
  let page = 1;
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    for (const u of data.users) {
      if (u.email) emails[u.id] = u.email;
      users.push({
        id: u.id,
        email: u.email ?? null,
        nome: (u.user_metadata?.['nome'] as string | undefined) ?? null,
      });
    }
    if (data.users.length < 200) break;
    page++;
    if (page > 20) break;
  }
  return { emails, users };
});
