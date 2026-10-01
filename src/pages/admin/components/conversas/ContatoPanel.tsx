import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Phone, Mail, User, Tag, StickyNote, Workflow, Settings2, ChevronDown, Plus, MessageCircle, CheckSquare, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { ETAPAS, brl, type Negociacao } from "../kanban/types";
import { useEtiquetas } from "./tags";
import { EtiquetasManager } from "./EtiquetasManager";
import type { Conversa } from "./ConversaChat";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useNavigate } from "@/lib/router-compat";

interface Nota {
  id: string;
  texto: string;
  autor_id: string | null;
  created_at: string;
}

interface Props {
  conversa: Conversa;
  onNomeAtualizado?: (nome: string) => void;
  onNegociacaoVinculada?: (negociacaoId: string) => void;
}

interface Tarefa { id: string; titulo: string; concluida: boolean; data_vencimento: string | null }

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
  });

export function ContatoPanel({ conversa, onNomeAtualizado, onNegociacaoVinculada }: Props) {
  const navigate = useNavigate();
  const [negs, setNegs] = useState<Negociacao[]>([]);
  const [selId, setSelId] = useState<string | null>(null);
  const neg = negs.find((n) => n.id === selId) ?? null;
  const setNeg = (n: Negociacao) => setNegs((prev) => prev.map((item) => (item.id === n.id ? n : item)));
  const [equipe, setEquipe] = useState<Record<string, string>>({});
  const [me, setMe] = useState<{ id: string; gestor: boolean } | null>(null);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [novaNota, setNovaNota] = useState("");
  const [nome, setNome] = useState(conversa.nome_contato ?? "");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const TAGS = useEtiquetas();
  const [gerenciar, setGerenciar] = useState(false);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [novaTarefa, setNovaTarefa] = useState("");
  const podeEditar = !!neg && !!me && (me.gestor || neg.responsavel_id === me.id);

  useEffect(() => {
    (async () => {
      const [{ data: lista }, { data: { session } }] = await Promise.all([
        supabase.rpc("list_equipe"),
        supabase.auth.getSession(),
      ]);
      setEquipe(Object.fromEntries((lista ?? []).map((u) => [u.id, u.nome])));
      const eu = (lista ?? []).find((u) => u.id === session?.user.id);
      if (session) setMe({ id: session.user.id, gestor: !!eu?.roles?.some((r) => r === "admin" || r === "gestor") });
    })();
  }, []);

  useEffect(() => {
    setNome(conversa.nome_contato ?? "");
    let ativo = true;
    (async () => {
      setCarregando(true);
      const { data } = await supabase.rpc("list_negociacoes_conversa", { _conversa_id: conversa.id });
      if (!ativo) return;
      const lista = (data as Negociacao[] | null) ?? [];
      setNegs(lista);
      const principal = lista.find((n) => n.status === "aberto") ?? lista.find((n) => n.id === conversa.negociacao_id) ?? lista[0] ?? null;
      setSelId(principal?.id ?? null);
      if (principal && conversa.negociacao_id !== principal.id && principal.status === "aberto") {
        const { error: vinculoError } = await supabase
          .from("whatsapp_conversas")
          .update({ negociacao_id: principal.id })
          .eq("id", conversa.id);
        if (!vinculoError && ativo) onNegociacaoVinculada?.(principal.id);
      }
      if (ativo) setCarregando(false);
    })();
    return () => { ativo = false; };
  }, [conversa.id, conversa.negociacao_id, conversa.telefone, conversa.nome_contato]);

  useEffect(() => {
    if (!selId) { setNotas([]); setTarefas([]); return; }
    let ativo = true;
    (async () => {
      const [{ data: cms }, { data: tasks }] = await Promise.all([
        supabase.from("negociacao_comentarios").select("id,texto,autor_id,created_at").eq("negociacao_id", selId).order("created_at", { ascending: false }),
        supabase.from("negociacao_tarefas").select("id,titulo,concluida,data_vencimento").eq("negociacao_id", selId).order("created_at"),
      ]);
      if (!ativo) return;
      setNotas((cms as Nota[]) || []);
      setTarefas((tasks as Tarefa[]) || []);
    })();
    return () => { ativo = false; };
  }, [selId]);

  const salvarNome = async () => {
    const valor = nome.trim();
    if (!valor || valor === conversa.nome_contato) return;
    const { error } = await supabase.from("whatsapp_conversas").update({ nome_contato: valor }).eq("id", conversa.id);
    if (error) { toast.error(error.message); return; }
    onNomeAtualizado?.(valor);
    toast.success("Nome atualizado");
  };

  const mudarEtapa = async (etapa: string) => {
    if (!neg) return;
    const { error } = await supabase
      .from("negociacoes")
      .update({ etapa: etapa as Negociacao["etapa"] })
      .eq("id", neg.id);
    if (error) { toast.error(error.message); return; }
    setNeg({ ...neg, etapa: etapa as Negociacao["etapa"] });
    toast.success("Etapa atualizada");
  };

  const alternarTag = async (tagId: string) => {
    if (!neg) return;
    const atuais = neg.tags || [];
    const proximas = atuais.includes(tagId) ? atuais.filter((t) => t !== tagId) : [...atuais, tagId];
    const anterior = atuais;
    setNeg({ ...neg, tags: proximas });
    const { error } = await supabase.from("negociacoes").update({ tags: proximas }).eq("id", neg.id);
    if (error) { setNeg({ ...neg, tags: anterior }); toast.error(error.message); }
  };

  const adicionarNota = async () => {
    if (!neg || !novaNota.trim()) return;
    setSalvando(true);
    const { data: { session } } = await supabase.auth.getSession();
    const { data, error } = await supabase
      .from("negociacao_comentarios")
      .insert({ negociacao_id: neg.id, texto: novaNota.trim(), autor_id: session?.user.id ?? null })
      .select("id,texto,autor_id,created_at")
      .single();
    setSalvando(false);
    if (error) { toast.error(error.message); return; }
    setNotas((prev) => [data as Nota, ...prev]);
    setNovaNota("");
  };

  const adicionarTarefa = async () => {
    if (!neg || !novaTarefa.trim()) return;
    const { data: { session } } = await supabase.auth.getSession();
    const { data, error } = await supabase.from("negociacao_tarefas").insert({ negociacao_id: neg.id, titulo: novaTarefa.trim(), created_by: session?.user.id ?? null }).select("id,titulo,concluida,data_vencimento").single();
    if (error) { toast.error(error.message); return; }
    setTarefas((prev) => [...prev, data as Tarefa]); setNovaTarefa("");
  };

  const alternarTarefa = async (tarefa: Tarefa) => {
    const concluida = !tarefa.concluida;
    const { error } = await supabase.from("negociacao_tarefas").update({ concluida }).eq("id", tarefa.id);
    if (error) toast.error(error.message); else setTarefas((prev) => prev.map((item) => item.id === tarefa.id ? { ...item, concluida } : item));
  };

  const Section = ({ title, icon: Icon, children, initial = true }: { title: string; icon: typeof User; children: React.ReactNode; initial?: boolean }) => (
    <Collapsible defaultOpen={initial} className="border-b">
      <CollapsibleTrigger className="flex h-11 w-full items-center gap-2 px-3 text-xs font-semibold hover:bg-muted/50">
        <Icon className="h-4 w-4 text-muted-foreground" /><span>{title}</span><ChevronDown className="ml-auto h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3">{children}</CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto">
      <EtiquetasManager open={gerenciar} onOpenChange={setGerenciar} />
      <div className="border-b p-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">{(conversa.nome_contato || conversa.telefone).charAt(0).toUpperCase()}</div>
        <h2 className="mt-2 truncate text-sm font-bold">{conversa.nome_contato || conversa.telefone}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{conversa.telefone}</p>
        <TooltipProvider delayDuration={150}><div className="mt-3 flex justify-center gap-2">
          <Tooltip><TooltipTrigger asChild><Button size="icon" variant="secondary" className="h-8 w-8" aria-label="Telefone"><Phone /></Button></TooltipTrigger><TooltipContent>{conversa.telefone}</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button size="icon" variant="secondary" className="h-8 w-8" aria-label="WhatsApp"><MessageCircle /></Button></TooltipTrigger><TooltipContent>WhatsApp: {conversa.telefone}</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button size="icon" variant="secondary" className="h-8 w-8" aria-label="E-mail" disabled={!neg?.email}><Mail /></Button></TooltipTrigger><TooltipContent>{neg?.email || "E-mail não informado"}</TooltipContent></Tooltip>
        </div></TooltipProvider>
      </div>
      <Section title="Contato" icon={User}>
        <Input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onBlur={salvarNome}
          placeholder="Nome do cliente"
          className="h-9"
        />
         <div className="mt-3 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-3.5 w-3.5" /> {conversa.telefone}
          </div>
          {neg?.email && (
            <div className="flex items-center gap-2 break-all text-muted-foreground">
              <Mail className="h-3.5 w-3.5 shrink-0" /> {neg.email}
            </div>
          )}
           {neg && <div><div className="mb-1.5 flex items-center text-muted-foreground"><Tag className="mr-2 h-3.5 w-3.5" /> Etiquetas</div><div className="flex flex-wrap gap-1">{(neg.tags || []).map((id) => { const item = TAGS.find((t) => t.id === id); return item ? <button key={id} onClick={() => alternarTag(id)} className={`rounded border px-1.5 py-0.5 text-[9px] font-semibold ${item.className}`}>{item.label} ×</button> : null; })}<Popover><PopoverTrigger asChild><Button variant="ghost" size="sm" className="h-6 px-1.5 text-[10px]"><Plus /> Adicionar</Button></PopoverTrigger><PopoverContent align="end" className="max-h-64 w-60 overflow-y-auto p-2">{TAGS.map((item) => <Button key={item.id} variant="ghost" className="h-8 w-full justify-start" onClick={() => alternarTag(item.id)}><span className={`rounded border px-1.5 py-0.5 text-[9px] ${item.className}`}>{item.label}</span>{(neg.tags || []).includes(item.id) && <span className="ml-auto">✓</span>}</Button>)}<Button variant="outline" className="mt-2 h-8 w-full" onClick={() => setGerenciar(true)}><Settings2 /> Gerenciar</Button></PopoverContent></Popover></div></div>}
         </div>
      </Section>

      {carregando && (
        <div className="flex justify-center p-6"><Loader2 className="h-5 w-5 animate-spin" /></div>
      )}

      {!carregando && !neg && (
        <p className="p-4 text-xs text-muted-foreground">
          Este contato ainda não tem negociação vinculada.
        </p>
      )}

      {!carregando && neg && (
        <>
          {/* Negociação */}
           <Section title="Negociação" icon={Workflow}>
             <HoverCard openDelay={250} closeDelay={100}>
              <HoverCardTrigger asChild>
               <button
                 type="button"
                 className="w-full rounded-md border p-2.5 text-left transition hover:border-primary/40 hover:bg-muted/40"
                 onClick={() => navigate(`/admin/negociacoes?negociacao=${neg.id}`)}
                 aria-label={`Abrir negociação de ${neg.nome_cliente} no funil`}
               >
             <div className="mb-2 flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-xs font-semibold">{neg.nome_cliente}</p><p className="text-[10px] uppercase text-primary">● {ETAPAS.find((e) => e.id === neg.etapa)?.label}</p></div><span className="shrink-0 text-xs font-bold">{brl(neg.valor)}</span></div>
               <p className="text-[10px] text-muted-foreground">Clique para abrir no funil</p>
               </button>
              </HoverCardTrigger>
              <HoverCardContent side="left" align="start" className="w-72 space-y-3 p-3">
                <div><p className="text-sm font-semibold">{neg.nome_cliente}</p><p className="text-xs text-muted-foreground">{ETAPAS.find((e) => e.id === neg.etapa)?.label} · {neg.status}</p></div>
                <div className="grid grid-cols-[84px_1fr] gap-x-2 gap-y-1.5 text-xs">
                  <span className="text-muted-foreground">Valor</span><span className="font-semibold">{brl(neg.valor)}</span>
                  <span className="text-muted-foreground">Produto</span><span className="truncate">{neg.nome_produto || neg.produto || neg.material || "Não informado"}</span>
                  <span className="text-muted-foreground">Telefone</span><span>{neg.telefone || conversa.telefone}</span>
                  <span className="text-muted-foreground">E-mail</span><span className="truncate">{neg.email || "Não informado"}</span>
                  {neg.utm_campaign && <><span className="text-muted-foreground">Campanha</span><span className="truncate">{neg.utm_campaign}</span></>}
                </div>
              </HoverCardContent>
             </HoverCard>
             <div className="mt-2 rounded-md border p-2.5">
            <Select value={neg.etapa} onValueChange={mudarEtapa}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ETAPAS.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
             <div className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor</span>
                <span className="font-medium">{brl(neg.valor)}</span>
              </div>
              {(neg.nome_produto || neg.produto) && (
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Produto</span>
                  <span className="truncate text-right">{neg.nome_produto || neg.produto}</span>
                </div>
              )}
              {neg.utm_campaign && (
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Campanha</span>
                  <span className="truncate text-right">{neg.utm_campaign}</span>
                </div>
              )}
              </div>
             </div>
           </Section>

           <Section title="Tarefas" icon={CheckSquare} initial={false}>
             <div className="space-y-2">{tarefas.map((t) => <label key={t.id} className="flex items-start gap-2 text-xs"><Checkbox checked={t.concluida} onCheckedChange={() => alternarTarefa(t)} /><span className={t.concluida ? "text-muted-foreground line-through" : ""}>{t.titulo}</span>{t.data_vencimento && <CalendarClock className="ml-auto h-3.5 w-3.5 text-muted-foreground" />}</label>)}<div className="flex gap-1"><Input value={novaTarefa} onChange={(e) => setNovaTarefa(e.target.value)} placeholder="Nova tarefa" className="h-8 text-xs" onKeyDown={(e) => { if (e.key === "Enter") adicionarTarefa(); }} /><Button size="icon" className="h-8 w-8" onClick={adicionarTarefa} disabled={!novaTarefa.trim()}><Plus /></Button></div></div>
           </Section>

          {/* Notas internas */}
           <Section title="Notas" icon={StickyNote}>
            <Textarea
              value={novaNota}
              onChange={(e) => setNovaNota(e.target.value)}
              rows={2}
              placeholder="Anotação visível só para a equipe…"
              className="resize-none text-sm"
            />
            <Button size="sm" className="mt-2 w-full" disabled={!novaNota.trim() || salvando} onClick={adicionarNota}>
              {salvando ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null} Salvar nota
            </Button>
            <div className="mt-3 space-y-2">
              {notas.map((n) => (
                <div key={n.id} className="rounded-md bg-gold/20 px-2.5 py-2 text-xs">
                  <p className="whitespace-pre-wrap break-words">{n.texto}</p>
                  <span className="mt-1 block text-[10px] text-muted-foreground">{fmt(n.created_at)}</span>
                </div>
              ))}
              {notas.length === 0 && <p className="text-xs text-muted-foreground">Nenhuma nota ainda.</p>}
            </div>
           </Section>
        </>
      )}
    </div>
  );
}
