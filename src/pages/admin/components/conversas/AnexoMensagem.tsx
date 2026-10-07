import { useState } from "react";
import { FileText, ImageIcon, Video, Paperclip, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsAppMediaUrl } from "@/lib/whatsapp-media.functions";
import { toast } from "sonner";

export function AnexoMensagem({ mensagemId, tipo, conteudo, disponivel, recebido, hora }: {
  mensagemId: string; tipo: string; conteudo: string | null; disponivel: boolean; recebido: boolean; hora: string;
}) {
  const [carregando, setCarregando] = useState(false);
  const Icone = tipo === "image" || tipo === "sticker" ? ImageIcon : tipo === "video" ? Video : tipo === "document" ? FileText : Paperclip;
  const categoria = tipo === "image" ? "Imagem" : tipo === "video" ? "Vídeo" : tipo === "audio" ? "Áudio" : tipo === "sticker" ? "Figurinha" : "Documento";
  const nome = conteudo?.replace(/^\[(Documento|Imagem|Vídeo|Áudio|Figurinha|Mensagem de voz)\]\s*/i, "").trim() || categoria;
  const abrir = async () => {
    setCarregando(true);
    try {
      const { url } = await getWhatsAppMediaUrl({ data: { mensagemId } });
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Não foi possível abrir o anexo"); }
    finally { setCarregando(false); }
  };
  return (
    <div className="w-80 max-w-full space-y-2">
      <div className="flex items-center gap-3 rounded-lg border border-info/25 bg-info/10 p-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-info/15 text-info"><Icone className="h-6 w-6" /></div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase text-info">{categoria} {recebido ? "recebido" : "enviado"}</p>
          <p className="break-words text-sm font-medium text-foreground">{nome}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        {disponivel ? <Button variant="ghost" size="sm" className="h-7 px-2 text-info" disabled={carregando} onClick={abrir} aria-label={`Abrir anexo: ${nome}`}>
          {carregando ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <ExternalLink className="mr-1 h-3.5 w-3.5" />} Abrir anexo
        </Button> : <span className="text-[10px] text-muted-foreground">Arquivo não disponível neste histórico</span>}
        <span className="shrink-0 text-[10px] text-muted-foreground">{hora}</span>
      </div>
    </div>
  );
}