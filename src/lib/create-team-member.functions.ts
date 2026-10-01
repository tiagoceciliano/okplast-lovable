import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { requireCaller } from "@/lib/supabase-server";

export interface CreateTeamMemberPayload {
  email: string;
  password: string;
  nome: string;
  role: "admin" | "gestor" | "vendedor";
  numero_raw?: string | null;
  numero_formatado?: string | null;
  peso?: number;
  recebe_lead?: boolean;
  ativo?: boolean;
  link_whatsapp_id?: string | null;
}

export const createTeamMember = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input as CreateTeamMemberPayload)
  .handler(async ({ data: payload }) => {
    const { admin } = await requireCaller(getRequestHeader("Authorization"), ["admin"]);

    if (!payload.email || !payload.password || !payload.nome || !payload.role) {
      throw new Error("email, password, nome e role obrigatórios");
    }

    // Cria user no Auth
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: payload.email,
      password: payload.password,
      email_confirm: true,
      user_metadata: { nome: payload.nome },
    });
    if (createErr || !created.user) {
      throw new Error(createErr?.message || "Erro ao criar usuário");
    }
    const newUserId = created.user.id;

    // Vincula role
    const { error: roleErr } = await admin.from("user_roles").insert({
      user_id: newUserId,
      role: payload.role,
    });
    if (roleErr) {
      throw new Error("Usuário criado mas erro no papel: " + roleErr.message);
    }

    // Se veio link_whatsapp_id, apenas vincula o novo user ao registro existente
    if (payload.link_whatsapp_id) {
      const { error: linkErr } = await admin
        .from("whatsapp_numbers")
        .update({ user_id: newUserId, nome_vendedor: payload.nome })
        .eq("id", payload.link_whatsapp_id);
      if (linkErr) {
        throw new Error("Usuário criado mas erro ao vincular: " + linkErr.message);
      }
    } else if (payload.numero_raw && payload.numero_formatado) {
      // Cria whatsapp_number se veio número
      await admin.from("whatsapp_numbers").insert({
        user_id: newUserId,
        nome_vendedor: payload.nome,
        numero_raw: payload.numero_raw,
        numero_formatado: payload.numero_formatado,
        peso: payload.peso ?? 0,
        ativo: payload.ativo ?? true,
        recebe_lead: payload.recebe_lead ?? payload.role !== "gestor",
      });
    }

    return { success: true, user_id: newUserId };
  });
