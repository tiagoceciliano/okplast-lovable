import { supabase } from "@/integrations/supabase/client";

/**
 * Captação de leads resiliente a queda do backend.
 *
 * 1. Tenta a edge function `process-lead` (grava no banco + envia ao Kinbox).
 * 2. Se falhar, envia direto ao webhook do Kinbox (backup) para o vendedor
 *    receber o lead com as UTMs mesmo com o backend fora do ar.
 * 3. Guarda o lead numa fila no localStorage e reenvia quando o backend voltar.
 */

const QUEUE_KEY = "okplast_lead_queue";
const MAX_QUEUE = 50;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

// Webhook público de inbound do Kinbox (mesmo usado pela edge function)
const KINBOX_BACKUP_WEBHOOK = "https://webhook.kinbox.com.br/v3/inbound/mwVIr-FpU";

export interface LeadPayload {
  nome: string;
  email: string;
  telefone: string;
  produto_interesse?: string;
  tipo_material?: string;
  mensagem?: string;
  current_url?: string;
  destino_whatsapp?: string;
  destino_whatsapp_formatado?: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
}

interface QueuedLead {
  id: string;
  queued_at: number;
  payload: LeadPayload;
}

function readQueue(): QueuedLead[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QueuedLead[];
    if (!Array.isArray(parsed)) return [];
    const now = Date.now();
    return parsed.filter((item) => item && now - item.queued_at < MAX_AGE_MS);
  } catch {
    return [];
  }
}

function writeQueue(items: QueuedLead[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(items.slice(-MAX_QUEUE)));
  } catch {
    // storage cheio / bloqueado — ignora
  }
}

function enqueue(payload: LeadPayload) {
  const items = readQueue();
  items.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    queued_at: Date.now(),
    payload,
  });
  writeQueue(items);
}

function toSaoPauloDateTime() {
  const now = new Date();
  const opts: Intl.DateTimeFormatOptions = { timeZone: "America/Sao_Paulo" };
  return {
    date: now.toLocaleDateString("pt-BR", opts),
    time: now.toLocaleTimeString("pt-BR", { ...opts, hour12: false }),
  };
}

/** Envia o lead direto ao Kinbox (backup, sem passar pelo backend). */
async function sendBackupWebhook(payload: LeadPayload) {
  const { date, time } = toSaoPauloDateTime();
  const body = {
    name: payload.nome,
    email: payload.email,
    phone: (payload.telefone || "").replace(/\D/g, "").replace(/^55/, ""),
    product: payload.produto_interesse || "Chapa Inteira",
    tipo_material: payload.tipo_material || "-",
    message: payload.mensagem || "-",
    city: "",
    state: "",
    country: "Brazil",
    utm_source: payload.utm_source || "-",
    utm_medium: payload.utm_medium || "-",
    utm_campaign: payload.utm_campaign || "-",
    utm_term: payload.utm_term || "-",
    utm_content: payload.utm_content || "-",
    submitted_at: date,
    submitted_time: time,
    current_url: payload.current_url || "-",
    origem: "backup_navegador",
  };

  try {
    // `no-cors` garante o envio mesmo sem headers de CORS na resposta.
    await fetch(KINBOX_BACKUP_WEBHOOK, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch (error) {
    console.error("[LeadCapture] Falha no webhook de backup:", error);
  }
}

async function invokeProcessLead(payload: LeadPayload) {
  const { error } = await supabase.functions.invoke("process-lead", { body: payload });
  if (error) throw error;
}

/**
 * Ponto único de envio de lead. Nunca lança — o usuário sempre segue
 * para o WhatsApp, e o lead nunca é perdido.
 */
export async function submitLead(payload: LeadPayload): Promise<void> {
  try {
    await invokeProcessLead(payload);
  } catch (error) {
    console.error("[LeadCapture] process-lead falhou, ativando backup:", error);
    enqueue(payload);
    await sendBackupWebhook(payload);
  }
}

/** Reenvia leads que ficaram na fila durante uma queda do backend. */
export async function flushLeadQueue(): Promise<void> {
  const items = readQueue();
  if (items.length === 0) return;

  const remaining: QueuedLead[] = [];
  for (const item of items) {
    try {
      await invokeProcessLead(item.payload);
    } catch {
      remaining.push(item);
    }
  }
  writeQueue(remaining);
  if (remaining.length > 0) {
    console.warn(`[LeadCapture] ${remaining.length} lead(s) ainda pendentes de reenvio.`);
  }
}

export function getQueuedLeadCount(): number {
  return readQueue().length;
}