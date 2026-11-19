import { describe, expect, it } from "vitest";
import { extrairQr, telefoneInstancia } from "./uzapi-qr";

describe("QR Code enviado pelo UnoTalk", () => {
  it("lê qrcode[].code no evento real de autenticação", () => {
    expect(extrairQr({ entry: [{ changes: [{ field: "authentication", value: { qrcode: [{ code: "iVBORw0KGgoAAA" }] } }] }] })).toBe("iVBORw0KGgoAAA");
  });
  it("preserva formatos diretos e ignora códigos não relacionados ao QR", () => {
    expect(extrairQr({ code: "401", qrcode: [{ code: "" }, { code: "imagem-qr" }] })).toBe("imagem-qr");
    expect(extrairQr({ code: "401" })).toBeNull();
    expect(extrairQr({ qr_code: "data:image/png;base64,imagem" })).toBe("data:image/png;base64,imagem");
  });
  it("não usa Phone Number ID como telefone", () => {
    expect(telefoneInstancia({ phoneNumberId: "465703233845639", phoneNumber: null })).toBeNull();
    expect(telefoneInstancia({ phoneNumberId: "465703233845639", phoneNumber: "5521935058539" })).toBe("5521935058539");
  });
});