type MediaInput = { mime: string; nome: string; legenda?: string | undefined; voz?: boolean | undefined };

/** Voice notes must be explicitly identified, not merely uploaded as OGG audio. */
export function whatsappMediaPayload(data: MediaInput, link: string, to: string) {
  const tipo = data.mime.startsWith("image/") ? "image" : data.mime.startsWith("video/") ? "video" : data.mime.startsWith("audio/") ? "audio" : "document";
  if (data.voz && (tipo !== "audio" || data.mime.split(";")[0]?.trim() !== "audio/ogg")) {
    throw new Error("Mensagens de voz precisam ser gravadas em OGG/Opus.");
  }
  const media: Record<string, string | boolean> = { link };
  if (tipo === "audio" && data.voz) media['voice'] = true;
  if (tipo === "document") media['filename'] = data.nome;
  if (data.legenda?.trim() && ["image", "video", "document"].includes(tipo)) media['caption'] = data.legenda.trim();
  return { tipo, payload: { messaging_product: "whatsapp", to, type: tipo, [tipo]: media } };
}