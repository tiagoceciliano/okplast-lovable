import { describe, expect, it } from "vitest";
import { assinarMensagem } from "./whatsapp-signature";

describe("assinatura WhatsApp", () => {
  it("identifica o responsável em negrito e separa a mensagem", () => expect(assinarMensagem("admin", "Mensagem aqui")).toBe("*admin*\n\nMensagem aqui"));
  it("não duplica a assinatura", () => expect(assinarMensagem("Amanda", "*Amanda*\n\nOlá")).toBe("*Amanda*\n\nOlá"));
  it("limpa formatação do nome", () => expect(assinarMensagem("*Alan*\n Silva", "Oi")).toBe("*Alan Silva*\n\nOi"));
  it("valida o limite com a assinatura", () => expect(() => assinarMensagem("admin", "a".repeat(4096))).toThrow("limite"));
});