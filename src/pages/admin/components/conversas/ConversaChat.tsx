import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getEquipe, memoGet, memoSet } from "@/lib/adminCache";
import { whatsappTemplates } from "@/lib/whatsapp-templates.functions";
import { sendWhatsAppMedia } from "@/lib/whatsapp-media.functions";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Send, Clock, LayoutTemplate, Loader2, Check, CheckCheck, AlertCircle, MoreHorizontal, Search, Bell, Tag, Smile, Paperclip, MessageSquareText, CalendarClock, X, FileUp } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { TagDef } from "./tags";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { AgendamentoDialog, type AgendamentoItem } from "./AgendamentoDialog";

export interface Conversa {
  id: string;
  telefone: string;
  nome_contato: string | null;
  negociacao_id: string | null;
  responsavel_id: string | null;
  tags?: string[];
  ultima_mensagem: string | null;
  ultima_mensagem_em: string | null;
  ultima_entrada_cliente_em: string | null;
  nao_lidas: number;
  resolvida_em?: string | null;
}

interface Mensagem {
  id: string;
  direcao: "entrada" | "saida";
  tipo: string;
  conteudo: string | null;
  status: string | null;
  created_at: string;
  autor_id?: string | null;
}

interface Template {
  nome: string;
  status: string;
  idioma: string;
  categoria: string;
  texto: string;
  variaveis: number;
}

interface Agendamento {
  id: string;
  texto: string;
  enviar_em: string;
  status: "pendente" | "processando" | "enviado" | "cancelado" | "falhou";
  erro: string | null;
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

function janelaLimite(conversa: Conversa): number {
  return conversa.ultima_entrada_cliente_em
    ? new Date(conversa.ultima_entrada_cliente_em).getTime() + 24 * 60 * 60 * 1000
    : 0;
}

function formatRemaining(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":");
}

interface Props {
  conversa: Conversa;
  onMarcarLida?: () => void;
  tags?: string[];
  etiquetas?: TagDef[];
  onTagsChange?: (tags: string[]) => void;
}

export function ConversaChat({ conversa, onMarcarLida, tags = [], etiquetas: todasEtiquetas = [], onTagsChange }: Props) {
  const etiquetas = todasEtiquetas.filter((t) => t.aplica_em.includes("conversa"));
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateSel, setTemplateSel] = useState("");
  const [params, setParams] = useState<string[]>([]);
  const [busca, setBusca] = useState("");
  const [agendamentos, setAgendamentos] = useState<AgendamentoItem[]>([]);
  const [agItem, setAgItem] = useState<AgendamentoItem | null>(null);
  const [listaAgOpen, setListaAgOpen] = useState(false);
  const [agendamentoOpen, setAgendamentoOpen] = useState(false);
  const [dataAgendada, setDataAgendada] = useState<Date>();
  const [horaAgendada, setHoraAgendada] = useState("");
  const [agendando, setAgendando] = useState(false);
  const [agora, setAgora] = useState(() => Date.now());
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [notaOpen, setNotaOpen] = useState(false);
  const [nota, setNota] = useState("");
  const [salvandoNota, setSalvandoNota] = useState(false);
  const [anexando, setAnexando] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const limite = janelaLimite(conversa);
  const aberta = limite > agora;
  const restante = Math.max(0, limite - agora);

  useEffect(() => {
    const timer = window.setInterval(() => setAgora(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const carregarAgendamentos = async () => {
    const { data } = await supabase.from("whatsapp_agendamentos").select("id,texto,enviar_em,status,erro,tipo,template").eq("conversa_id", conversa.id).in("status", ["pendente", "processando", "falhou"]).order("enviar_em");
    setAgendamentos((data as unknown as AgendamentoItem[]) || []);
  };

  useEffect(() => { carregarAgendamentos(); }, [conversa.id]);

  const [notas, setNotas] = useState<Array<{ id: string; texto: string; created_at: string }>>([]);
  const carregarNotas = async () => {
    if (!conversa.negociacao_id) { setNotas([]); return; }
    const { data } = await supabase.from("negociacao_comentarios").select("id,texto,created_at").eq("negociacao_id", conversa.negociacao_id).order("created_at", { ascending: false }).limit(20);
    setNotas((data as any) || []);
  };
  useEffect(() => { carregarNotas(); }, [conversa.negociacao_id]);

  // Carrega mensagens + marca como lida
  useEffect(() => {
    let ativo = true;
    const memo = memoGet<Mensagem[]>(`msgs:${conversa.id}`);
    setMensagens(memo ?? []);
    (async () => {
      const { data } = await supabase
        .from("whatsapp_mensagens")
        .select("id,direcao,tipo,conteudo,status,created_at,autor_id")
        .eq("conversa_id", conversa.id)
        .order("created_at", { ascending: true })
        .limit(5000);
      if (ativo) { const l = (data as Mensagem[]) || []; memoSet(`msgs:${conversa.id}`, l); setMensagens(l); }
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
        const nova = payload.new as Mensagem;
        setMensagens((prev) => {
          // Substitui o balão provisório ("enviando") pela mensagem confirmada
          const idx = prev.findIndex((m) => m.id.startsWith("tmp-") && m.direcao === nova.direcao && m.conteudo === nova.conteudo);
          const base = idx >= 0 ? prev.filter((_, i) => i !== idx) : prev;
          if (base.some((m) => m.id === nova.id)) return base;
          const lista = [...base, nova];
          memoSet(`msgs:${conversa.id}`, lista);
          return lista;
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(canal); };
  }, [conversa.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens.length]);

  // Templates só são necessários quando a janela está fechada
  useEffect(() => {
    (async () => {
      try {
        const data = await whatsappTemplates();
        setTemplates((data.templates || []).filter((t: Template) => t.status === "APPROVED"));
      } catch { /* silencioso */ }
    })();
  }, []);

  const enviar = async () => {
    const conteudo = texto.trim();
    if (!conteudo) return;
    // Mostra o balão na hora; o servidor confirma em segundo plano
    const tmpId = `tmp-${Date.now()}`;
    setMensagens((prev) => [...prev, { id: tmpId, direcao: "saida", tipo: "text", conteudo, status: "enviando", created_at: new Date().toISOString(), autor_id: null } as unknown as Mensagem]);
    setTexto("");
    const { error } = await supabase.functions.invoke("whatsapp-send", {
      body: { conversa_id: conversa.id, tipo: "text", texto: conteudo },
    });
    if (error) {
      setMensagens((prev) => prev.filter((m) => m.id !== tmpId));
      setTexto((t) => t || conteudo);
      const detalhe = (error as any)?.context ? await (error as any).context.text().catch(() => "") : "";
      toast.error("Falha ao enviar: " + (detalhe || error.message));
    }
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
  const [nomesEquipe, setNomesEquipe] = useState<Record<string, string>>({});
  useEffect(() => {
    getEquipe().then((data) => setNomesEquipe(Object.fromEntries((data).map((u) => [u.id, u.nome]))));
  }, []);
  const iniciais = (nome: string) => nome.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "?";
  const nomeCliente = conversa.nome_contato || conversa.telefone;
  const diaLabel = (iso: string) => {
    const tz = { timeZone: "America/Sao_Paulo" } as const;
    const d = new Date(iso).toLocaleDateString("pt-BR", tz);
    const hoje = new Date().toLocaleDateString("pt-BR", tz);
    const ontem = new Date(Date.now() - 864e5).toLocaleDateString("pt-BR", tz);
    return d === hoje ? "Hoje" : d === ontem ? "Ontem" : d;
  };
  const restanteCurto = (ms: number) => { const t = Math.max(0, Math.floor(ms / 1000)); return `${Math.floor(t / 3600)}h ${Math.floor((t % 3600) / 60)}m ${t % 60}s`; };
  const mensagensVisiveis = busca.trim() ? mensagens.filter((m) => (m.conteudo || "").toLowerCase().includes(busca.toLowerCase())) : mensagens;

  const [resolvida, setResolvida] = useState(!!conversa.resolvida_em);
  useEffect(() => { setResolvida(!!conversa.resolvida_em); }, [conversa.id, conversa.resolvida_em]);
  const alternarResolvida = async () => {
    const valor = resolvida ? null : new Date().toISOString();
    const { error } = await supabase.from("whatsapp_conversas").update({ resolvida_em: valor }).eq("id", conversa.id);
    if (error) { toast.error(error.message); return; }
    setResolvida(!!valor);
    toast.success(valor ? "Atendimento resolvido. Se o cliente escrever, ele reabre com todo o histórico." : "Atendimento reaberto");
  };

  const marcarNaoLida = async () => {
    const { error } = await supabase.from("whatsapp_conversas").update({ nao_lidas: 1 }).eq("id", conversa.id);
    if (error) toast.error(error.message); else toast.success("Conversa marcada como não lida");
  };

  const alternarTag = async (tagId: string) => {
    const proximas = tags.includes(tagId) ? tags.filter((id) => id !== tagId) : [...tags, tagId];
    const { error } = await supabase.from("whatsapp_conversas").update({ tags: proximas }).eq("id", conversa.id);
    if (error) toast.error(error.message); else onTagsChange?.(proximas);
  };

  const horarioAgendado = useMemo(() => {
    if (!dataAgendada || !horaAgendada) return null;
    const [hours, minutes] = horaAgendada.split(":").map(Number);
    const value = new Date(dataAgendada);
    value.setHours(hours || 0, minutes || 0, 0, 0);
    return value;
  }, [dataAgendada, horaAgendada]);

  const agendar = async () => {
    if (!texto.trim() || !horarioAgendado || agendando) return;
    if (horarioAgendado.getTime() <= Date.now()) { toast.error("Escolha um horário futuro."); return; }
    if (horarioAgendado.getTime() >= limite) { toast.error("O envio precisa acontecer antes do fim da janela de 24 horas."); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Sessão inválida."); return; }
    setAgendando(true);
    const { error } = await supabase.from("whatsapp_agendamentos").insert({
      conversa_id: conversa.id,
      autor_id: user.id,
      texto: texto.trim(),
      enviar_em: horarioAgendado.toISOString(),
      janela_limite: new Date(limite).toISOString(),
    });
    setAgendando(false);
    if (error) { toast.error(error.message); return; }
    setTexto(""); setDataAgendada(undefined); setHoraAgendada(""); setAgendamentoOpen(false);
    await carregarAgendamentos();
    toast.success("Mensagem agendada");
  };

  const cancelarAgendamento = async (id: string) => {
    const { error } = await supabase.rpc("cancel_whatsapp_agendamento", { _id: id });
    if (error) { toast.error(error.message); return; }
    await carregarAgendamentos();
    toast.success("Agendamento cancelado");
  };

  const anexar = async (file: File | undefined) => {
    if (!file || anexando) return;
    if (file.size > 16 * 1024 * 1024) { toast.error("O arquivo deve ter no máximo 16 MB."); return; }
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
      reader.onerror = () => reject(new Error("Falha ao ler o arquivo"));
      reader.readAsDataURL(file);
    });
    setAnexando(true);
    try {
      await sendWhatsAppMedia({ data: { conversaId: conversa.id, nome: file.name, mime: file.type || "application/octet-stream", base64, legenda: texto.trim() || undefined } });
      setTexto("");
      toast.success("Arquivo enviado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao enviar arquivo");
    } finally {
      setAnexando(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const salvarNota = async () => {
    if (!conversa.negociacao_id) { toast.error("Vincule uma negociação antes de criar uma nota."); return; }
    if (!nota.trim()) return;
    setSalvandoNota(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("negociacao_comentarios").insert({ negociacao_id: conversa.negociacao_id, texto: nota.trim(), autor_id: user?.id ?? null });
    setSalvandoNota(false);
    if (error) { toast.error(error.message); return; }
    setNota(""); setNotaOpen(false); toast.success("Nota interna salva");
    carregarNotas();
  };


  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="grid min-h-11 shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b px-3 py-1.5">
        <div className={`flex min-w-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold tabular-nums ${
          !aberta
            ? "bg-destructive/10 text-destructive"
            : restante <= 15 * 60 * 1000
              ? "bg-destructive text-destructive-foreground animate-pulse"
              : restante <= 2 * 60 * 60 * 1000
                ? "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
        }`}>
          <Clock className="h-4 w-4 shrink-0" />
          <span className="truncate" title={aberta ? `A janela fecha às ${new Date(limite).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}` : undefined}>
            {aberta ? `Janela encerra em ${formatRemaining(restante)}` : "Janela de 24h encerrada"}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8" onClick={alternarResolvida}><Check className="h-4 w-4" /> {resolvida ? "Reabrir" : "Resolver"}</Button>
        <Popover>
          <PopoverTrigger asChild><Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Mais ações"><MoreHorizontal /></Button></PopoverTrigger>
          <PopoverContent align="end" className="w-60 p-1">
            <Button variant="ghost" className="w-full justify-start" onClick={marcarNaoLida}><Bell /> Marcar como não lida</Button>
            <div className="relative p-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input value={busca} onChange={(e) => setBusca(e.target.value)} className="h-9 pl-8" placeholder="Pesquisar mensagem" /></div>
          </PopoverContent>
        </Popover>
        </div>
      </div>
      {/* Mensagens */}
      <div className="chat-wallpaper min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-8">
        {mensagens.length === 0 && (
          <p className="mx-auto w-fit rounded-lg bg-chat-in px-3 py-1.5 text-center text-xs text-muted-foreground shadow-sm">
            Nenhuma mensagem ainda. Inicie o atendimento com uma mensagem pronta.
          </p>
        )}
        {mensagensVisiveis.map((m, i) => {
          const saida = m.direcao === "saida";
          const autor = saida ? (m.autor_id && nomesEquipe[m.autor_id]) || "Equipe" : nomeCliente;
          const novoDia = i === 0 || diaLabel(mensagensVisiveis[i - 1]!.created_at) !== diaLabel(m.created_at);
          return (
          <div key={m.id}>
            {novoDia && <div className="my-4 text-center text-xs font-semibold text-muted-foreground">{diaLabel(m.created_at)}</div>}
            <div className={`flex items-end gap-2.5 ${saida ? "justify-end" : "justify-start"}`}>
              {!saida && <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-chat-avatar text-xs font-semibold text-chat-avatar-foreground">{iniciais(nomeCliente)}</div>}
              <div className={`flex max-w-[72%] flex-col ${saida ? "items-end" : "items-start"}`}>
                {saida && (
                  <span className="mb-0.5 flex items-center gap-0.5 text-[11px] font-semibold text-foreground/80">
                    {autor}
                    {m.status === "enviando" ? <Clock className="h-3 w-3 text-muted-foreground" /> : m.status === "failed" ? <AlertCircle className="h-3 w-3 text-destructive" /> : m.status === "read" ? <CheckCheck className="h-3.5 w-3.5 text-chat-tick" /> : m.status === "delivered" ? <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" /> : <Check className="h-3.5 w-3.5 text-muted-foreground" />}
                  </span>
                )}
                <div className={`flex items-end gap-2 rounded-2xl px-3.5 py-2 text-sm shadow-sm ${saida ? "bg-chat-out" : "bg-chat-in"}`}>
                  <span className="whitespace-pre-wrap break-words">{m.conteudo}</span>
                  <span className="shrink-0 translate-y-0.5 text-[10px] text-muted-foreground">{fmtHora(m.created_at)}</span>
                </div>
              </div>
              {saida && <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-chat-avatar text-xs font-semibold text-chat-avatar-foreground">{iniciais(autor)}</div>}
            </div>
          </div>
          );
        })}
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
        <div className="shrink-0 bg-chat-bg px-4 pb-2 pt-1 sm:px-8"><div className="rounded-2xl border bg-background/70 p-3 shadow-sm backdrop-blur">
          <Textarea value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Shift + Enter para nova linha." rows={2} className="min-h-14 resize-none border-0 bg-transparent p-1 shadow-none focus-visible:ring-0" onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); } }} />
          <div className="flex items-center gap-1">
            <span className={`mr-auto flex items-center gap-1.5 text-xs font-semibold tabular-nums ${restante <= 2 * 60 * 60 * 1000 ? "text-destructive" : "text-muted-foreground"}`}><Clock className="h-4 w-4" /> {restanteCurto(restante)}</span>
            <input ref={fileRef} type="file" className="hidden" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" onChange={(event) => anexar(event.target.files?.[0])} />
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => fileRef.current?.click()} disabled={anexando} aria-label="Anexar arquivo">{anexando ? <Loader2 className="animate-spin" /> : <Paperclip />}</Button>
            <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
              <PopoverTrigger asChild><Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Inserir emoji"><Smile /></Button></PopoverTrigger>
              <PopoverContent align="start" className="w-auto border-0 p-0">
                <EmojiPicker onEmojiClick={(e) => setTexto((value) => value + e.emoji)} emojiStyle={EmojiStyle.NATIVE} searchPlaceholder="Buscar emoji" previewConfig={{ showPreview: false }} width={340} height={400} lazyLoadEmojis />
              </PopoverContent>
            </Popover>
            <Popover open={notaOpen} onOpenChange={setNotaOpen}>
              <PopoverTrigger asChild><Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Criar nota interna"><MessageSquareText /></Button></PopoverTrigger>
              <PopoverContent align="start" className="w-80 p-3"><p className="mb-2 text-sm font-semibold">Nota interna</p><Textarea value={nota} onChange={(event) => setNota(event.target.value)} rows={3} placeholder="Visível somente para sua equipe" /><Button className="mt-2 w-full" size="sm" onClick={salvarNota} disabled={!nota.trim() || salvandoNota}>{salvandoNota ? <Loader2 className="animate-spin" /> : <MessageSquareText />} Salvar nota</Button></PopoverContent>
            </Popover>
            <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Agendar mensagem" onClick={() => { setAgItem(null); setAgendamentoOpen(true); }}><CalendarClock /></Button>
            <Button size="icon" onClick={enviar} disabled={!texto.trim() || enviando} className="ml-1 h-9 w-9 rounded-xl" aria-label="Enviar mensagem">{enviando ? <Loader2 className="animate-spin" /> : <Send />}</Button>
          </div>
        </div></div>
      ) : (
         <div className="m-3 shrink-0 space-y-2 rounded-md border bg-background p-3 shadow-sm">
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
      <div className="flex min-h-10 shrink-0 items-center gap-1 overflow-x-auto bg-chat-bg px-4 pb-2">
        {tags.map((id) => {
          const item = etiquetas.find((e) => e.id === id);
          return item ? <button key={id} onClick={() => alternarTag(id)} className={`shrink-0 rounded border px-1.5 py-0.5 text-[9px] font-semibold ${item.className}`}>{item.label} ×</button> : null;
        })}
        <Popover>
          <PopoverTrigger asChild><Button variant="ghost" size="sm" className="h-7 px-2 text-xs"><Tag /></Button></PopoverTrigger>
          <PopoverContent align="start" className="max-h-72 w-64 overflow-y-auto p-2">
            {etiquetas.length === 0 && <p className="p-2 text-xs text-muted-foreground">Nenhuma etiqueta disponível.</p>}
            {etiquetas.map((item) => <Button key={item.id} variant="ghost" className="h-8 w-full justify-start" onClick={() => alternarTag(item.id)}><span className={`rounded border px-1.5 py-0.5 text-[9px] ${item.className}`}>{item.label}</span>{tags.includes(item.id) && <Check className="ml-auto" />}</Button>)}
          </PopoverContent>
        </Popover>
      </div>

      {notas.length > 0 && (
        <div className="max-h-32 shrink-0 overflow-y-auto border-t border-gold/30 bg-gold/15 px-3 py-2">
          <div className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase text-muted-foreground"><MessageSquareText className="h-3 w-3" /> Notas internas (só a equipe vê)</div>
          <div className="space-y-1">
            {notas.map((n) => (
              <div key={n.id} className="rounded-md border border-gold/40 bg-gold/10 px-2 py-1 text-xs">

                <span className="whitespace-pre-wrap">{n.texto}</span>
                <span className="block text-[10px] text-muted-foreground">{fmtHora(n.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex shrink-0 items-center gap-2 border-t bg-background px-3 py-1.5">
        {agendamentos.length > 0 && (
          <Popover open={listaAgOpen} onOpenChange={setListaAgOpen}>
            <PopoverTrigger asChild>
              <button type="button" className="inline-flex items-center gap-1.5 rounded-full bg-info px-3 py-1 text-xs font-semibold text-info-foreground shadow-sm hover:opacity-90">
                <CalendarClock className="h-3.5 w-3.5" /> {agendamentos.length} {agendamentos.length === 1 ? "Mensagem Agendada" : "Mensagens Agendadas"}
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" side="top" className="w-80 p-2">
              <p className="px-1 pb-1 text-xs font-semibold text-muted-foreground">Mensagens agendadas</p>
              <div className="max-h-72 space-y-1 overflow-y-auto">
                {agendamentos.map((item) => (
                  <button key={item.id} type="button" onClick={() => { setAgItem(item); setListaAgOpen(false); setAgendamentoOpen(true); }} className="block w-full rounded-md border p-2 text-left text-xs hover:bg-muted">
                    <span className="flex items-center justify-between gap-2 font-medium text-info"><span>{fmtHora(item.enviar_em)}</span>{item.status === "falhou" && <span className="text-destructive">Falhou</span>}{item.tipo === "template" && <span className="text-muted-foreground">Template</span>}</span>
                    <span className="mt-0.5 line-clamp-2 block text-foreground">{item.texto}</span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
        {!aberta && <Button size="sm" variant="ghost" className="ml-auto h-7 text-xs" onClick={() => { setAgItem(null); setAgendamentoOpen(true); }}><CalendarClock /> Agendar mensagem</Button>}
      </div>
      <AgendamentoDialog open={agendamentoOpen} onOpenChange={setAgendamentoOpen} conversaId={conversa.id} janelaAberta={aberta} janelaLimite={limite} templates={templates} item={agItem} onSaved={carregarAgendamentos} />
    </div>
  );
}
