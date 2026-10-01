import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { requireCaller } from "@/lib/supabase-server";

export interface UpdateTeamMemberPayload {
  user_id: string;
  email?: string;
  password?: string;
}

export const updateTeamMember = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input as UpdateTeamMemberPayload)
  .handler(async ({ data: payload }) => {
    const { admin } = await requireCaller(getRequestHeader("Authorization"), ["admin"]);

    if (!payload.user_id) throw new Error("user_id obrigatório");

    const updates: { email?: string; password?: string; email_confirm?: boolean } = {};
    if (payload.email) {
      updates.email = payload.email;
      updates.email_confirm = true;
    }
    if (payload.password) updates.password = payload.password;
    if (Object.keys(updates).length === 0) {
      throw new Error("Nada para atualizar");
    }

    const { error } = await admin.auth.admin.updateUserById(payload.user_id, updates);
    if (error) throw new Error(error.message);

    return { success: true };
  });
