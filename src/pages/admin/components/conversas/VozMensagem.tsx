import { useEffect, useRef, useState } from "react";
import { Mic, Trash2, Send, Play, Pause, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getWhatsAppMediaUrl } from "@/lib/whatsapp-media.functions";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** Grava a voz em OGG/Opus (formato de mensagem de voz do WhatsApp). */
export function GravadorVoz({ onEnviar, disabled }: { onEnviar: (blob: Blob, segundos: number) => Promise<void>; disabled?: boolean }) {
  const [gravando, setGravando] = useState(false);
  const [seg, setSeg] = useState(0);
  const recRef = useRef<any>(null);
  const enviarRef = useRef(false);
  const inicioRef = useRef(0);

  useEffect(() => {
    if (!gravando) return;
    const t = setInterval(() => setSeg((Date.now() - inicioRef.current) / 1000), 250);
    return () => clearInterval(t);
  }, [gravando]);
  useEffect(() => () => { try { recRef.current?.stop(); } catch { /* */ } }, []);

  const iniciar = async () => {
    try {
      const { default: Recorder } = await import("opus-recorder");
      const rec = new Recorder({ encoderPath: "/opus/encoderWorker.min.js", numberOfChannels: 1, encoderSampleRate: 48000, encoderApplication: 2048 });
      rec.ondataavailable = async (data: Uint8Array) => {
        const segundos = (Date.now() - inicioRef.current) / 1000;
        if (!enviarRef.current) return;
        await onEnviar(new Blob([data], { type: "audio/ogg" }), segundos);
      };
      await rec.start();
      recRef.current = rec;
      enviarRef.current = false;
      inicioRef.current = Date.now();
      setSeg(0);
      setGravando(true);
    } catch {
      toast.error("Não foi possível acessar o microfone. Libere a permissão no navegador.");
    }
  };

  const parar = (enviar: boolean) => {
    if (enviar && (Date.now() - inicioRef.current) < 1000) { toast.error("Áudio muito curto"); enviar = false; }
    enviarRef.current = enviar;
    try { recRef.current?.stop(); } catch { /* */ }
    recRef.current = null;
    setGravando(false);
  };

  if (!gravando) {
    return <Button size="icon" variant="ghost" className="h-8 w-8" onClick={iniciar} disabled={disabled} aria-label="Gravar áudio"><Mic /></Button>;
  }
  return (
    <div className="ml-1 flex items-center gap-2 rounded-xl bg-destructive/10 px-2 py-1">
      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => parar(false)} aria-label="Descartar áudio"><Trash2 className="h-4 w-4" /></Button>
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-destructive" />
      <span className="w-10 text-sm font-semibold tabular-nums">{fmt(seg)}</span>
      <Button size="icon" className="h-8 w-8 rounded-xl" onClick={() => parar(true)} aria-label="Enviar áudio"><Send className="h-4 w-4" /></Button>
    </div>
  );
}

/** Balão de mensagem de voz no estilo WhatsApp. */
export function AudioBolha({ mensagemId, iniciais, hora }: { mensagemId: string; iniciais: string; hora: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [tocando, setTocando] = useState(false);
  const [atual, setAtual] = useState(0);
  const [dur, setDur] = useState(0);
  const barras = useRef(Array.from({ length: 36 }, (_, i) => 30 + Math.abs(Math.sin(i * 1.7 + mensagemId.charCodeAt(i % mensagemId.length))) * 70)).current;

  const alternar = async () => {
    if (!url) {
      setCarregando(true);
      try { const r = await getWhatsAppMediaUrl({ data: { mensagemId } }); setUrl(r.url); }
      catch (e) { toast.error(e instanceof Error ? e.message : "Falha ao abrir áudio"); }
      finally { setCarregando(false); }
      return;
    }
    const a = audioRef.current; if (!a) return;
    if (a.paused) void a.play(); else a.pause();
  };
  useEffect(() => { if (url) void audioRef.current?.play(); }, [url]);

  const progresso = dur ? atual / dur : 0;
  return (
    <div className="flex w-72 items-center gap-3 py-1">
      <div className="relative shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chat-avatar text-sm font-semibold text-chat-avatar-foreground">{iniciais}</div>
        <Mic className="absolute -bottom-1 -right-1 h-5 w-5 text-chat-tick" />
      </div>
      <button type="button" onClick={alternar} className="shrink-0 text-foreground" aria-label={tocando ? "Pausar" : "Ouvir"}>
        {carregando ? <Loader2 className="h-6 w-6 animate-spin" /> : tocando ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current" />}
      </button>
      <div className="min-w-0 flex-1">
        <div className="relative flex h-7 cursor-pointer items-center gap-[2px]" onClick={(e) => {
          const a = audioRef.current; if (!a || !dur) return;
          const r = e.currentTarget.getBoundingClientRect(); a.currentTime = ((e.clientX - r.left) / r.width) * dur;
        }}>
          {barras.map((h, i) => (
            <span key={i} className={`w-[3px] rounded-full ${i / barras.length < progresso ? "bg-foreground/60" : "bg-foreground/25"}`} style={{ height: `${h}%` }} />
          ))}
          <span className="absolute h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-info" style={{ left: `${progresso * 100}%` }} />
        </div>
        <div className="mt-0.5 flex justify-between text-[11px] text-muted-foreground"><span>{fmt(tocando || atual ? atual : dur)}</span><span>{hora}</span></div>
      </div>
      {url && (
        <audio ref={audioRef} src={url} preload="metadata" className="hidden"
          onLoadedMetadata={(e) => { const d = e.currentTarget.duration; if (Number.isFinite(d)) setDur(d); }}
          onTimeUpdate={(e) => setAtual(e.currentTarget.currentTime)}
          onPlay={() => setTocando(true)} onPause={() => setTocando(false)} onEnded={() => { setTocando(false); setAtual(0); }} />
      )}
    </div>
  );
}
