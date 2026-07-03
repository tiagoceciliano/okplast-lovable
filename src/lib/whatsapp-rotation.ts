// Rateio 50/50 entre dois números de WhatsApp da OK Plast.
// A escolha é "sticky" por visitante via localStorage — assim o número
// mostrado nos botões (wa.me) é o mesmo enviado ao webhook Kinbox,
// garantindo que o cliente sempre fale com o mesmo atendente.

export interface WhatsAppNumber {
  /** Número puro para wa.me / api.whatsapp.com (com DDI 55). */
  raw: string;
  /** Formato exibido ao usuário. */
  formatted: string;
}

export const WHATSAPP_NUMBERS: readonly WhatsAppNumber[] = [
  { raw: "5521935058539", formatted: "(21) 93505-8539" },
  { raw: "5521936181457", formatted: "(21) 93618-1457" },
] as const;

const STORAGE_KEY = "okp-wa-idx";

function readStoredIndex(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const idx = Number(raw);
    if (Number.isInteger(idx) && idx >= 0 && idx < WHATSAPP_NUMBERS.length) return idx;
    return null;
  } catch {
    return null;
  }
}

function writeStoredIndex(idx: number) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(idx));
  } catch {
    // Ignora (localStorage indisponível / bloqueado).
  }
}

/**
 * Retorna o número atribuído ao visitante atual. Se ainda não há um sorteado,
 * sorteia 50/50 e persiste no localStorage.
 *
 * Fallback SSR / storage bloqueado: retorna o primeiro da lista sem persistir.
 */
export function getRotatedWhatsApp(): WhatsAppNumber {
  const stored = readStoredIndex();
  if (stored !== null) return WHATSAPP_NUMBERS[stored];

  const idx = Math.random() < 0.5 ? 0 : 1;
  writeStoredIndex(idx);
  return WHATSAPP_NUMBERS[idx];
}