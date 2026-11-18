import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireCaller } from "@/lib/supabase-server";

const gestor = () => requireCaller(getRequestHeader("Authorization"), ["admin", "gestor"]);

export const criarConexao = createServerFn({ method: "POST" })
  .inputValidator((i) => z.object({ nome: z.string().trim().min(2).max(60), userId: z.string().uuid().nullable() }).parse(i))
  .handler(async ({ data }) => {
    const { admin } = await gestor();
    const { uzFetch, acharPhoneId, acharQr, WEBHOOK_BASE } = await import("@/lib/uzapi.server");
    const { data: row, error } = await admin.from("whatsapp_instancias").insert({ nome: data.nome, user_id: data.userId, status: "pendente" }).select("id,webhook_token").single();
    if (error || !row) throw new Error(error?.message || "Falha ao criar");
    try {
      const nomeInst = `okplast-${data.nome.toLowerCase().normalize("NFD").replace(/[^\w]+/g, "-")}-${row.id.slice(0, 6)}`;
      const r = await uzFetch("/instance/add", { method: "POST", body: {
        name: nomeInst, authenticationMethod: "QRCode", autoRejectCall: false,
        webhook: `${WEBHOOK_BASE}/api/public/uzapi/webhook/${row.webhook_token}`,
        webhookEvents: { authentication: true, connection: true, group_messages: false, message_status: true, message_echoes: true, group_events: false, history: false },
      } });
      console.log("Uzapi instance/add:", JSON.stringify(r).slice(0, 1500));
      const pid = acharPhoneId(r);
      const qr = acharQr(r);
      await admin.from("whatsapp_instancias").update({ phone_number_id: pid, status: "aguardando_qr", qr_code: qr, qr_atualizado_em: qr ? new Date().toISOString() : null, ultimo_erro: pid ? null : "A Uzapi não retornou o código do número" }).eq("id", row.id);
    } catch (e) {
      await admin.from("whatsapp_instancias").update({ status: "erro", ultimo_erro: e instanceof Error ? e.message : String(e) }).eq("id", row.id);
      throw e;
    }
    return { id: row.id };
  });

export const atualizarConexao = createServerFn({ method: "POST" })
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const { admin } = await requireCaller(getRequestHeader("Authorization"), ["admin", "gestor", "vendedor"]);
    const { uzFetch, acharQr, acharStatus, acharChave } = await import("@/lib/uzapi.server");
    const { data: inst } = await admin.from("whatsapp_instancias").select("*").eq("id", data.id).maybeSingle();
    if (!inst?.phone_number_id) return { status: inst?.status ?? "erro" };
    try {
      const r = await uzFetch(`/${inst.phone_number_id}/instance`);
      console.log("Uzapi instance:", JSON.stringify(r).slice(0, 1500));
      const status = acharStatus(r) ?? inst.status;
      const qr = status === "conectado" ? null : acharQr(r) ?? inst.qr_code;
      const tel = acharChave(r, (k) => /display_phone_number|phoneNumber|wid|number/i.test(k));
      const upd: any = { status, qr_code: qr, ultimo_erro: null };
      if (qr && qr !== inst.qr_code) upd.qr_atualizado_em = new Date().toISOString();
      if (tel && /\d{10,}/.test(tel)) upd.telefone = tel.replace(/\D/g, "");
      await admin.from("whatsapp_instancias").update(upd).eq("id", inst.id);
      return { status };
    } catch (e) {
      await admin.from("whatsapp_instancias").update({ ultimo_erro: e instanceof Error ? e.message : String(e) }).eq("id", inst.id);
      return { status: inst.status };
    }
  });

export const acaoConexao = createServerFn({ method: "POST" })
  .inputValidator((i) => z.object({ id: z.string().uuid(), acao: z.enum(["desconectar", "reiniciar", "excluir", "responsavel"]), userId: z.string().uuid().nullable().optional() }).parse(i))
  .handler(async ({ data }) => {
    const { admin } = await gestor();
    const { uzFetch } = await import("@/lib/uzapi.server");
    const { data: inst } = await admin.from("whatsapp_instancias").select("id,phone_number_id").eq("id", data.id).maybeSingle();
    if (!inst) throw new Error("Conexão não encontrada");
    const pid = inst.phone_number_id;
    if (data.acao === "responsavel") {
      await admin.from("whatsapp_instancias").update({ user_id: data.userId ?? null }).eq("id", inst.id);
    } else if (data.acao === "desconectar") {
      if (pid) await uzFetch(`/${pid}/instance/logout`, { method: "POST" });
      await admin.from("whatsapp_instancias").update({ status: "desconectado", qr_code: null }).eq("id", inst.id);
    } else if (data.acao === "reiniciar") {
      if (pid) await uzFetch(`/${pid}/instance/restart`, { method: "POST" });
      await admin.from("whatsapp_instancias").update({ status: "aguardando_qr" }).eq("id", inst.id);
    } else {
      if (pid) await uzFetch(`/${pid}/instance/delete`, { method: "DELETE" }).catch((e) => console.error(e));
      await admin.from("whatsapp_instancias").delete().eq("id", inst.id);
    }
    return { ok: true };
  });
