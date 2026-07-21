/**
 * Dispara o evento de conversão do Google Ads (Enhanced Conversions).
 * Envia e-mail e telefone do lead — o gtag.js normaliza e faz o hash SHA-256
 * automaticamente antes de enviar ao Google Ads.
 */
export interface ConversionUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Normaliza telefone brasileiro para o formato E.164 (+55DDDNNNNNNNNN).
 * Aceita entradas como "(21) 99999-9999" ou "21999999999".
 */
function normalizePhoneBR(raw?: string): string | undefined {
  if (!raw) return undefined;
  const digits = raw.replace(/\D/g, "");
  if (!digits) return undefined;
  if (digits.startsWith("55")) return `+${digits}`;
  return `+55${digits}`;
}

function normalizeEmail(raw?: string): string | undefined {
  if (!raw) return undefined;
  return raw.trim().toLowerCase();
}

export function reportConversion(userData?: ConversionUserData): void {
  if (typeof window === "undefined") return;

  const gtag = (window as any).gtag;

  // Enhanced Conversions: envia dados do lead para o gtag antes de disparar
  // a conversão. O gtag.js aplica normalização adicional + hash SHA-256.
  if (typeof gtag === "function" && userData) {
    try {
      const payload: Record<string, string> = {};
      const email = normalizeEmail(userData.email);
      const phone = normalizePhoneBR(userData.phone);
      if (email) payload.email = email;
      if (phone) payload.phone_number = phone;
      if (userData.firstName) payload["address.first_name"] = userData.firstName.trim();
      if (userData.lastName) payload["address.last_name"] = userData.lastName.trim();
      if (Object.keys(payload).length > 0) {
        gtag("set", "user_data", payload);
      }
    } catch (error) {
      console.error("Erro ao setar user_data para Enhanced Conversions:", error);
    }
  }

  const gtagReport = (window as any).gtag_report_conversion;
  if (typeof gtagReport === "function") {
    try {
      gtagReport();
    } catch (error) {
      console.error("Erro ao disparar conversão:", error);
    }
  }
}
