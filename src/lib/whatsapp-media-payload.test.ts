import { describe, expect, it } from "vitest";
import { whatsappMediaPayload } from "./whatsapp-media-payload";

describe("WhatsApp voice payload", () => {
  it("sends a recorded OGG as a native voice note", () => {
    const { payload } = whatsappMediaPayload({ mime: "audio/ogg", nome: "voz.ogg", voz: true }, "https://example.com/voice.ogg", "5511999999999");
    expect(payload.type).toBe("audio");
    expect(payload.audio).toEqual({ link: "https://example.com/voice.ogg", voice: true });
    expect(JSON.parse(JSON.stringify(payload)).audio.voice).toBe(true);
  });
  it("keeps uploaded audio files as ordinary audio", () => {
    expect(whatsappMediaPayload({ mime: "audio/mpeg", nome: "musica.mp3" }, "https://example.com/audio", "5511999999999").payload.audio).toEqual({ link: "https://example.com/audio" });
  });
  it("rejects incorrectly formatted voice notes", () => {
    expect(() => whatsappMediaPayload({ mime: "audio/mpeg", nome: "voz.mp3", voz: true }, "https://example.com/audio", "5511999999999")).toThrow("OGG/Opus");
  });
  it("preserves document names and captions", () => {
    expect(whatsappMediaPayload({ mime: "application/pdf", nome: "pedido.pdf", legenda: " Pedido " }, "https://example.com/document", "5511999999999").payload.document).toEqual({ link: "https://example.com/document", filename: "pedido.pdf", caption: "Pedido" });
  });
});