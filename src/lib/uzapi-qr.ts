/** Uzapi authentication events carry the image in value.qrcode[].code. */
export function extrairQr(obj: unknown, dentroQr = false, depth = 0): string | null {
  if (depth > 10 || obj == null) return null;
  if (typeof obj === "string") return dentroQr && obj.trim() ? obj : null;
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const qr = extrairQr(item, dentroQr, depth + 1);
      if (qr) return qr;
    }
    return null;
  }
  if (typeof obj !== "object") return null;
  for (const [key, value] of Object.entries(obj)) {
    const qrKey = /^(qr|qrcode|qr_code|qrCodeBase64|base64)$/i.test(key);
    const codeKey = dentroQr && /^(code|image|value|data)$/i.test(key);
    if (qrKey || codeKey) {
      const qr = extrairQr(value, true, depth + 1);
      if (qr) return qr;
    }
  }
  for (const value of Object.values(obj)) {
    const qr = extrairQr(value, dentroQr, depth + 1);
    if (qr) return qr;
  }
  return null;
}

export function telefoneInstancia(obj: unknown): string | null {
  if (!obj || typeof obj !== "object") return null;
  const row = obj as Record<string, unknown>;
  for (const key of ["display_phone_number", "phoneNumber", "phone_number", "wid"]) {
    const value = row[key];
    if (typeof value !== "string") continue;
    const digits = value.replace(/\D/g, "");
    if (digits.length >= 10 && digits.length <= 13) return digits;
  }
  return null;
}