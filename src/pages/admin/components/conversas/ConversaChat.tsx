import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { whatsappTemplates } from "@/lib/whatsapp-templates.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Send, Clock, LayoutTemplate, Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface Conversa {
  id: string;
  telefone: string;
  nome_contato: string | null;
  negociacao_id: string | null;
  responsavel_id: string | null;
  ultima_mensagem: string | null;
  ultima_mensagem_em: string | null;
  ultima_entrada_cliente_em: string | null;
  nao_lidas: number;
}

interface Mensagem {
  id: string;
  direcao: "entrada" | "saida";
  tipo: string;
  conteudo: string | null;
  status: string | null;
  created_at: string;
}

interface Template {
  nome: string;
  status: string;
  idioma: string;
  categoria: string;
  texto: string;
  variaveis: number;
}

function fmtHora(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao Paulo",
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
  });
}

export function janelaAberta(conversa: Conversa | null): boolean {
  if (!conversa?.ultima_entrada_cliente_em) return false;
  return Date.now() - new Date(conversa.ultima_entrada_cliente_em).getTime() < 24 * 60 * 60 * 1000;
}

interface Props {
  conversa: Conversa;
  onMarcarLida?: () => void;
}

export function ConversaChat({ conversa, onMarcarLida }: Props) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateSel, setTemplateSel] = useState("");
  const [params, setParams] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const aberta = janelaAberta(conversa);

  // Carrega mensagens + marca como lida
  useEffect(() => {
    let ativo = true;
    (async () => {
      const { data } = await supabase
        .from("whatsapp_mensagens")
        .select("id,direcao,tipo,conteudo,status,created_at")
        .eq("conversa_id", conversa.id)
        .order("created_at", { ascending: true })
        .limit(200);
      if (ativo) setMensagens((data as Mensagem[]) || []);
      if (conversa.nao_lidas > 0) {
        await supabase.from("whatsapp_conversas").update({ nao_lidas: 0 }).eq("id", conversa.id);
        onMarcarLida?.();
      }
    })();
    return () => { ativo = false; };
  }, [conversa.id]);

  // Realtime: novas mensagens desta conversa
  useEffect(() => {
    const canal = supabase
      .channel(`wa-msg-${conversa.id}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "whatsapp_mensagens",
        filter: `conversa_id=eq.${conversa.id}`,
      }, (payload) => {
        setMensagens((prev) => [...prev, payload.new as Mensagem]);
      })
      .subscribe();
    return () => { supabase.removeChannel(canal); };
  }, [conversa.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens.length]);

  // Templates só são necessários quando a janela está fechada
  useEffect(() => {
    if (aberta) return;
    (async () => {
      try {
        const data = await whatsappTemplates();
        setTemplates((data.templates || []).filter((t: Template) => t.status === "APPROVED"));
      } catch { /* silencioso */ }
    })();
  }, [aberta]);

  const enviar = async () => {
    if (!texto.trim() || enviando) return;
    setEnviando(true);
    const { error } = await supabase.functions.invoke("whatsapp-send", {
      body: { conversa_id: conversa.id, tipo: "text", texto: texto.trim() },
    });
    setEnviando(false);
    if (error) {
      const detalhe = (error as any)?.context ? await (error as any).context.text().catch(() => "") : "";
      toast.error("Falha ao enviar: " + (detalhe || error.message));
      return;
    }
    setTexto("");
  };

  const enviarTemplate = async () => {
    const t = templates.find((x) => x.nome === templateSel);
    if (!t || enviando) return;
    setEnviando(true);
    const { error } = await supabase.functions.invoke("whatsapp-send", {
      body: {
        conversa_id: conversa.id,
        tipo: "template",
        template: { name: t.nome, language: t.idioma, parametros: params.slice(0, t.variaveis) },
      },
    });
    setEnviando(false);
    if (error) {
      const detalhe = (error as any)?.context ? await (error as any).context.text().catch(() => "") : "";
      toast.error("Falha ao enviar: " + (detalhe || error.message));
      return;
    }
    setTemplateSel(""); setParams([]);
    toast.success("Mensagem pronta enviada");
  };

  const tSel = templates.find((x) => x.nome === templateSel);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-muted/20 rounded-md">
        {mensagens.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-6">
            Nenhuma mensagem ainda. Respostas do cliente chegam no aplicativo WhatsApp do celular.
          </p>
        )}
        {mensagens.map((m) => (
          <div key={m.id} className={`flex ${m.direcao === "saida" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-lg px-3 py-1.5 text-sm shadow-xs ${
              m.direcao === "saida" ? "bg-primary text-primary-foreground" : "bg-background border"
            }`}>
              <div className="whitespace-pre-wrap break-words">{m.conteudo}</div>
              <div className={`text-[10px] mt-0.5 ${m.direcao === "saida" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {fmtHora(m.created_at)}{m.status ? ` · ${m.status}` : ""}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Aviso de janela */}
      {!aberta && (
        <div className="mt-2 flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
          <Clock className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            Janela de 24h fechada: só é possível enviar <strong>mensagens prontas</strong> aprovadas pela Meta.
            Quando o cliente responder, o texto livre é liberado por 24h.
          </span>
        </div>
      )}

      {/* Composer */}
      {aberta ? (
        <div className="mt-2 flex gap-2">
          <Textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Digite a mensagem…"
            rows={2}
            className="resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); }
            }}
          />
          <Button onClick={enviar} disabled={!texto.trim() || enviando} className="self-end">
            {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      ) : (
        <div className="mt-2 space-y-2 rounded-md border p-2">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
            <Select value={templateSel} onValueChange={(v) => { setTemplateSel(v); setParams([]); }}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Escolher mensagem pronta…" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.nome} value={t.nome}>{t.nome}</SelectItem>
                ))}
                {templates.length === 0 && (
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    Nenhuma mensagem pronta aprovada ainda.
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
          {tSel && (
            <>
              <p className="text-xs text-muted-foreground whitespace-pre-wrap">{tSel.texto}</p>
              {Array.from({ length: tSel.variaveis }).map((_, i) => (
                <Input
                  key={i}
                  className="h-8 text-sm"
                  placeholder={`Variável {{${i + 1}}}`}
                  value={params[i] ?? ""}
                  onChange={(e) => {
                    const next = [...params];
                    next[i] = e.target.value;
                    setParams(next);
                  }}
                />
              ))}
              <Button
                size="sm"
                onClick={enviarTemplate}
                disabled={enviando || params.slice(0, tSel.variaveis).some((p) => !p?.trim())}
              >
                {enviando ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
                Enviar mensagem pronta
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
