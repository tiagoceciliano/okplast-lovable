// Cliente da Uzapi/UnoTalk (números conectados por QR Code). Só roda no servidor.
import { CONEXOES_UNOTALK } from "./uzapi-conexoes";
import { extrairQr } from "./uzapi-qr";
const BASE = "https://api.uzapi.com.br/v1";
export const WEBHOOK_BASE = "https://okplast.com.br";

export async function uzFetch(path: string, init: { method?: string; body?: unknown } = {}) {
  const phoneNumberId = path.split("/")[1];
  const conexao = CONEXOES_UNOTALK.find((c) => c.phoneNumberId === phoneNumberId);
  const token = process.env[conexao?.secretName ?? "UZAPI_TOKEN"];
  if (!token) throw new Error("Token da Uzapi não configurado");
  const res = await fetch(`${BASE}${path}`, {
    method: init.method ?? "GET",
    headers: { Authorization: `Bearer ${token.trim().replace(/^Bearer\s+/i, "")}`, "Content-Type": "application/json" },
    body: init.body === undefined ? null : JSON.stringify(init.body),
  });
  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { json = { raw: text }; }
  if (!res.ok) {
    const m = json?.message;
    const msg = typeof m === "string" ? m : Array.isArray(m?.message) ? m.message.join(", ") : m?.message || text.slice(0, 200);
    throw new Error(`Uzapi [${res.status}]: ${msg}`);
  }
  return json;
}

/** Procura recursivamente um valor por nome de chave. */
export function acharChave(obj: any, teste: (k: string) => boolean, depth = 0): string | null {
  if (!obj || typeof obj !== "object" || depth > 6) return null;
  for (const [k, v] of Object.entries(obj)) {
    if (teste(k) && (typeof v === "string" || typeof v === "number") && String(v).length) return String(v);
  }
  for (const v of Object.values(obj)) {
    const r = acharChave(v, teste, depth + 1);
    if (r) return r;
  }
  return null;
}

export const acharQr = extrairQr;
export const acharPhoneId = (o: any) => acharChave(o, (k) => k === "phone_number_id" || k === "phoneNumberId" || k === "instanceId" || k === "id");

export function acharStatus(o: any): string | null {
  if (o?.deploymentStatus === "paused") return "pausado";
  if (o?.isAuthenticated === true) return "conectado";
  if (o?.deploymentStatus === "pending_auth") return "aguardando_qr";
  if (o?.isAuthenticated === false) return "desconectado";
  const s = acharChave(o, (k) => /^(status|state|connection|connectionStatus)$/i.test(k));
  if (!s) return null;
  const v = s.toLowerCase();
  if (/^(connected|open|online|conectado|authenticated)$/.test(v)) return "conectado";
  if (/qr|pairing|scan|connecting|starting|initializing/.test(v)) return "aguardando_qr";
  if (/disconn|desconn|close|logout|offline/.test(v)) return "desconectado";
  return null;
}

export async function enviarUzapi(phoneNumberId: string, payload: Record<string, unknown>) {
  const { messaging_product: _ignored, ...body } = payload as any;
  const r = await uzFetch(`/${phoneNumberId}/messages`, { method: "POST", body });
  return (r?.messageId as string | undefined) ?? null;
}
