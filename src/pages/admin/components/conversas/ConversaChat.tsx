import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { whatsappTemplates } from "@/lib/whatsapp-templates.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Send, Clock, LayoutTemplate, Loader2, Check, CheckCheck, AlertCircle, MoreHorizontal, Search, Bell, Tag, Smile, Paperclip, MessageSquareText } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { TagDef } from "./tags";

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
    timeZone: "America/Sao_Paulo",
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
  tags?: string[];
  etiquetas?: TagDef[];
  onTagsChange?: (tags: string[]) => void;
}

export function ConversaChat({ conversa, onMarcarLida, tags = [], etiquetas = [], onTagsChange }: Props) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateSel, setTemplateSel] = useState("");
  const [params, setParams] = useState<string[]>([]);
  const [busca, setBusca] = useState("");
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
  const mensagensVisiveis = busca.trim() ? mensagens.filter((m) => (m.conteudo || "").toLowerCase().includes(busca.toLowerCase())) : mensagens;

  const marcarNaoLida = async () => {
    const { error } = await supabase.from("whatsapp_conversas").update({ nao_lidas: 1 }).eq("id", conversa.id);
    if (error) toast.error(error.message); else toast.success("Conversa marcada como não lida");
  };

  const alternarTag = async (tagId: string) => {
    if (!conversa.negociacao_id) { toast.error("Vincule uma negociação para aplicar etiquetas"); return; }
    const proximas = tags.includes(tagId) ? tags.filter((id) => id !== tagId) : [...tags, tagId];
    const { error } = await supabase.from("negociacoes").update({ tags: proximas }).eq("id", conversa.negociacao_id);
    if (error) toast.error(error.message); else onTagsChange?.(proximas);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-11 shrink-0 items-center justify-end gap-1 border-b px-3">
        <Button variant="ghost" size="sm" className="h-8"><Check className="h-4 w-4" /> Resolver</Button>
        <Popover>
          <PopoverTrigger asChild><Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Mais ações"><MoreHorizontal /></Button></PopoverTrigger>
          <PopoverContent align="end" className="w-60 p-1">
            <Button variant="ghost" className="w-full justify-start" onClick={marcarNaoLida}><Bell /> Marcar como não lida</Button>
            <div className="relative p-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input value={busca} onChange={(e) => setBusca(e.target.value)} className="h-9 pl-8" placeholder="Pesquisar mensagem" /></div>
          </PopoverContent>
        </Popover>
      </div>
      {/* Mensagens */}
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto bg-secondary/30 p-4">
        {mensagens.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-6">
            Nenhuma mensagem ainda. Respostas do cliente chegam no aplicativo WhatsApp do celular.
          </p>
        )}
        {mensagensVisiveis.map((m) => (
          <div key={m.id} className={`flex ${m.direcao === "saida" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[78%] px-3 py-1.5 text-sm shadow-sm ${
               m.direcao === "saida"
                 ? "rounded-lg rounded-br-sm bg-secondary text-foreground"
                : "rounded-2xl rounded-bl-sm border bg-background"
            }`}>
              <div className="whitespace-pre-wrap break-words">{m.conteudo}</div>
              <div className={`mt-0.5 flex items-center justify-end gap-1 text-[10px] ${
                 "text-muted-foreground"
              }`}>
                {fmtHora(m.created_at)}
                {m.direcao === "saida" && m.status && (
                  <span className="inline-flex items-center">
                    {m.status === "failed" ? (
                      <AlertCircle className="h-3 w-3" />
                    ) : m.status === "read" ? (
                      <CheckCheck className="h-3 w-3 text-sky-200" />
                    ) : m.status === "delivered" ? (
                      <CheckCheck className="h-3 w-3" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Aviso de janela */}
      {!aberta && (
        <div className="flex shrink-0 items-start gap-2 border-y bg-gold/10 px-3 py-2 text-xs text-gold-foreground">
          <Clock className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            Janela de 24h fechada: só é possível enviar <strong>mensagens prontas</strong> aprovadas pela Meta.
            Quando o cliente responder, o texto livre é liberado por 24h.
          </span>
        </div>
      )}

      {/* Composer */}
      {aberta ? (
        <div className="m-3 shrink-0 rounded-lg border bg-background p-2 shadow-sm">
          <Textarea value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Digite sua mensagem…" rows={2} className="min-h-14 resize-none border-0 p-1 shadow-none focus-visible:ring-0" onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); } }} />
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" className="h-8 w-8" disabled aria-label="Anexar arquivo"><Paperclip /></Button>
            <Button size="icon" variant="ghost" className="h-8 w-8" disabled aria-label="Emoji"><Smile /></Button>
            <Button size="icon" variant="ghost" className="h-8 w-8" disabled aria-label="Nota interna"><MessageSquareText /></Button>
            <span className="ml-1 text-[10px] text-muted-foreground">Enter para enviar · Shift + Enter para nova linha</span>
            <Button size="icon" onClick={enviar} disabled={!texto.trim() || enviando} className="ml-auto h-8 w-8" aria-label="Enviar mensagem">{enviando ? <Loader2 className="animate-spin" /> : <Send />}</Button>
          </div>
        </div>
      ) : (
         <div className="m-3 shrink-0 space-y-2 rounded-md border p-2">
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
      <div className="flex min-h-9 shrink-0 items-center gap-1 overflow-x-auto border-t px-3 py-1.5">
        {tags.map((id) => {
          const item = etiquetas.find((e) => e.id === id);
          return item ? <button key={id} onClick={() => alternarTag(id)} className={`shrink-0 rounded border px-1.5 py-0.5 text-[9px] font-semibold ${item.className}`}>{item.label} ×</button> : null;
        })}
        <Popover>
          <PopoverTrigger asChild><Button variant="ghost" size="sm" className="h-7 px-2 text-xs"><Tag /> Adicionar</Button></PopoverTrigger>
          <PopoverContent align="start" className="max-h-72 w-64 overflow-y-auto p-2">
            {etiquetas.map((item) => <Button key={item.id} variant="ghost" className="h-8 w-full justify-start" onClick={() => alternarTag(item.id)}><span className={`rounded border px-1.5 py-0.5 text-[9px] ${item.className}`}>{item.label}</span>{tags.includes(item.id) && <Check className="ml-auto" />}</Button>)}
          </PopoverContent>
        </Popover>
      </div>
        </div>
      )}
    </div>
  );
}
