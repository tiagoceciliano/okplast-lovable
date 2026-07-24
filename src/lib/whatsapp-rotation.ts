// Rateio ponderado entre múltiplos números de WhatsApp da OK Plast.
//
// A lista de números vem do banco (`public.whatsapp_numbers`) e é gerenciada
// pelo painel /admin/whatsapp. Cada número tem um `peso` (0-100). O sorteio
// respeita os pesos dos números *ativos*.
//
// A escolha é "sticky" por visitante via localStorage — o mesmo número aparece
// nos botões wa.me e é enviado ao webhook Kinbox, garantindo que o cliente
// sempre fale com o mesmo vendedor.

import { supabase } from "@/integrations/supabase/client";

export interface WhatsAppNumber {
  raw: string;
  formatted: string;
}

// Fallback estático caso o banco esteja inacessível.
export const WHATSAPP_NUMBERS: readonly WhatsAppNumber[] = [
  { raw: "5521923672701", formatted: "(21) 92367-2701" },
] as const;

const STORAGE_KEY = "okp-wa-raw";
const CACHE_KEY = "okp-wa-cache";
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CachedItem {
  raw: string;
  formatted: string;
  peso: number;
}

interface CachedList {
  ts: number;
  numbers: CachedItem[];
}

function readCache(): CachedList | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed: CachedList = JSON.parse(raw);
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(numbers: CachedItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ ts: Date.now(), numbers } satisfies CachedList),
    );
  } catch {
    // ignora
  }
}

function readStoredRaw(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredRaw(raw: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // ignora
  }
}

function pickWeighted(numbers: CachedItem[]): WhatsAppNumber {
  const total = numbers.reduce((s, n) => s + Math.max(0, n.peso), 0);
  if (total <= 0) {
    const n = numbers[0];
    return { raw: n.raw, formatted: n.formatted };
  }
  let r = Math.random() * total;
  for (const n of numbers) {
    r -= Math.max(0, n.peso);
    if (r <= 0) return { raw: n.raw, formatted: n.formatted };
  }
  const last = numbers[numbers.length - 1];
  return { raw: last.raw, formatted: last.formatted };
}

async function fetchActiveNumbers(): Promise<CachedItem[]> {
  const cached = readCache();
  if (cached && cached.numbers.length > 0) return cached.numbers;

  const { data, error } = await supabase
    .from("whatsapp_numbers")
    .select("numero_raw, numero_formatado, peso")
    .eq("ativo", true);

  if (error || !data || data.length === 0) {
    return WHATSAPP_NUMBERS.map((n) => ({ raw: n.raw, formatted: n.formatted, peso: 50 }));
  }

  const numbers: CachedItem[] = data.map((row) => ({
    raw: row.numero_raw,
    formatted: row.numero_formatado,
    peso: row.peso ?? 0,
  }));
  writeCache(numbers);
  return numbers;
}

/** Sorteio async — busca banco se cache expirado. */
export async function getRotatedWhatsApp(): Promise<WhatsAppNumber> {
  const numbers = await fetchActiveNumbers();
  const storedRaw = readStoredRaw();
  if (storedRaw) {
    const match = numbers.find((n) => n.raw === storedRaw);
    if (match) return { raw: match.raw, formatted: match.formatted };
  }
  const picked = pickWeighted(numbers);
  writeStoredRaw(picked.raw);
  return picked;
}

/** Sorteio síncrono — usa cache ou fallback, sem hit no banco. */
export function getRotatedWhatsAppSync(): WhatsAppNumber {
  const cached = readCache();
  const list: CachedItem[] =
    cached && cached.numbers.length > 0
      ? cached.numbers
      : WHATSAPP_NUMBERS.map((n) => ({ raw: n.raw, formatted: n.formatted, peso: 50 }));

  const storedRaw = readStoredRaw();
  if (storedRaw) {
    const match = list.find((n) => n.raw === storedRaw);
    if (match) return { raw: match.raw, formatted: match.formatted };
  }
  const picked = pickWeighted(list);
  writeStoredRaw(picked.raw);
  return picked;
}