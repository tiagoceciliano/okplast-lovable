import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "./AdminLayout";
import { ConversaChat, janelaAberta, type Conversa } from "./components/conversas/ConversaChat";
import { ContatoPanel } from "./components/conversas/ContatoPanel";
import { tagDef, useEtiquetas } from "./components/conversas/tags";
import { EtiquetasManager } from "./components/conversas/EtiquetasManager";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus, Tag, Search, Loader2, Inbox, UserRound, Bookmark, Archive, SlidersHorizontal, ArrowDownAZ, EyeOff, MoreHorizontal, Menu, Settings2, Clock } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { listTeamMembers } from "@/lib/list-team-members.functions";
import { whatsappTemplates, type WhatsAppTemplate } from "@/lib/whatsapp-templates.functions";

interface Atendente { id: string; nome: string; email: string | null }

type FiltroId = "abertos" | "meus" | "seguindo" | "arquivados" | "nao_atribuidos";

const FILTROS: { id: FiltroId; label: string }[] = [
  { id: "abertos", label: "Abertos" },
  { id: "meus", label: "Meus" },
  { id: "seguindo", label: "Seguindo" },
  { id: "arquivados", label: "Arquivados" },
];

function fmtData(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const hoje = new Date().toDateString() === d.toDateString();
  return d.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    ...(hoje ? { hour: "2-digit", minute: "2-digit" } : { day: "2-digit", month: "2-digit" }),
  });
}

const inicial = (c: Conversa) => (c.nome_contato || c.telefone).trim().charAt(0).toUpperCase();

export default function Conversas() {
  const { user } = useCurrentUser();
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [tagsPorConversa, setTagsPorConversa] = useState<Record<string, string[]>>({});
  const [selecionada, setSelecionada] = useState<Conversa | null>(null);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<FiltroId>("abertos");
  const [loading, setLoading] = useState(true);
  const [novaAberta, setNovaAberta] = useState(false);
  const [novoTelefone, setNovoTelefone] = useState("");
  const [novoNome, setNovoNome] = useState("");
  const [criando, setCriando] = useState(false);
  const etiquetas = useEtiquetas();
  const [gerenciarTags, setGerenciarTags] = useState(false);
  const [atendentes, setAtendentes] = useState<Atendente[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [templateNovo, setTemplateNovo] = useState("");
  const [transferindo, setTransferindo] = useState(false);

  const carregar = async () => {
    const { data, error } = await supabase
      .from("whatsapp_conversas")
      .select("*")
      .order("ultima_mensagem_em", { ascending: false, nullsFirst: false });
    if (error) toast.error(error.message);
    const lista = (data as Conversa[]) || [];
    setConversas(lista);
    setLoading(false);
    const alvo = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("conversa") : null;
    if (alvo) {
      const c = lista.find((item) => item.id === alvo);
      if (c) setSelecionada((atual) => atual ?? c);
    }

    const ids = lista.map((c) => c.negociacao_id).filter((v): v is string => !!v);
    if (ids.length) {
      const { data: negs } = await supabase.from("negociacoes").select("id,tags").in("id", ids);
      const porNeg = new Map((negs || []).map((n) => [n.id as string, (n.tags as string[]) || []]));
      const mapa: Record<string, string[]> = {};
      for (const c of lista) {
        if (c.negociacao_id) mapa[c.id] = porNeg.get(c.negociacao_id) || [];
      }
      setTagsPorConversa(mapa);
    }
  };

  const selecionarConversa = (conversa: Conversa) => {
    setSelecionada(conversa);
    setConversas((prev) => prev.map((item) => item.id === conversa.id ? { ...item, nao_lidas: 0 } : item));
  };

  useEffect(() => { carregar(); }, []);

  useEffect(() => {
    (async () => {
      const { data: equipe } = await supabase.rpc("list_equipe");
      setAtendentes((equipe ?? []).map((u) => ({ id: u.id, nome: u.nome, email: u.email ?? null })));
    })();
  }, []);

  useEffect(() => {
    const canal = supabase
      .channel("wa-conversas")
      .on("postgres_changes", { event: "*", schema: "public", table: "whatsapp_conversas" }, () => carregar())
      .subscribe();
    return () => { supabase.removeChannel(canal); };
  }, []);

  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return conversas.filter((c) => {
      const resolvida = !!c.resolvida_em;
      if (filtro === "arquivados") { if (!resolvida) return false; }
      else if (resolvida) return false;
      if (filtro === "meus" && c.responsavel_id !== user?.id) return false;
      if (filtro === "nao_atribuidos" && c.responsavel_id) return false;
      if (!q) return true;
      return (
        (c.nome_contato || "").toLowerCase().includes(q) ||
        c.telefone.includes(q.replace(/\D/g, ""))
      );
    });
  }, [conversas, busca, filtro, user?.id]);

  const criarConversa = async () => {
    const tel = novoTelefone.replace(/\D/g, "");
    if (tel.length < 12) { toast.error("Informe o número com DDI e DDD, ex: 5521999998888"); return; }
    setCriando(true);
    const { data, error } = await supabase.functions.invoke("whatsapp-send", {
      body: { telefone: tel, tipo: "text", criar_apenas: true, nome_contato: novoNome.trim() || undefined },
    });
    setCriando(false);
    if (error) {
      const detalhe = (error as any)?.context ? await (error as any).context.text().catch(() => "") : "";
      toast.error("Não foi possível criar a conversa. " + detalhe);
      return;
    }
    const conv = (data as any)?.conversa;
    if (conv && templateNovo) {
      const template = templates.find((item) => item.nome === templateNovo);
      if (template) {
        const { error: sendError } = await supabase.functions.invoke("whatsapp-send", { body: { conversa_id: conv.id, tipo: "template", template: { name: template.nome, language: template.idioma, parametros: [] } } });
        if (sendError) toast.error("Atendimento criado, mas a mensagem pronta não foi enviada.");
      }
    }
    await carregar();
    if (conv) setSelecionada(conv as Conversa);
    setNovaAberta(false); setNovoTelefone(""); setNovoNome("");
    setTemplateNovo("");
    toast.success(templateNovo ? "Atendimento criado e mensagem pronta enviada." : "Atendimento aberto.");
  };

  const aberta = janelaAberta(selecionada);
  const conversaExistente = useMemo(() => {
    const tel = novoTelefone.replace(/\D/g, "");
    return tel.length >= 8 ? conversas.find((item) => item.telefone.endsWith(tel.slice(-8))) ?? null : null;
  }, [novoTelefone, conversas]);
  const responsavel = selecionada ? atendentes.find((item) => item.id === selecionada.responsavel_id) : undefined;
  const nomeAtendente = (id: string | null) => atendentes.find((item) => item.id === id)?.nome || "Sem responsável";
  const iniciaisAtendente = (id: string | null) => {
    const nome = nomeAtendente(id);
    return id ? nome.split(/\s+/).slice(0, 2).map((parte) => parte.charAt(0)).join("").toUpperCase() : "—";
  };
  const transferir = async (responsavelId: string) => {
    if (!selecionada || transferindo) return;
    setTransferindo(true);
    const { error } = await supabase.from("whatsapp_conversas").update({ responsavel_id: responsavelId }).eq("id", selecionada.id);
    if (!error && selecionada.negociacao_id) await supabase.from("negociacoes").update({ responsavel_id: responsavelId }).eq("id", selecionada.negociacao_id);
    setTransferindo(false);
    if (error) { toast.error(error.message); return; }
    const atualizada = { ...selecionada, responsavel_id: responsavelId };
    setSelecionada(atualizada);
    setConversas((prev) => prev.map((item) => item.id === atualizada.id ? atualizada : item));
    toast.success("Atendimento transferido");
  };
  const abrirNova = async () => {
    setNovaAberta(true);
    if (!templates.length) {
      try { const result = await whatsappTemplates(); setTemplates(result.templates.filter((item) => item.status === "APPROVED")); } catch { /* mensagem exibida no seletor */ }
    }
  };

  return (
    <AdminLayout fullBleed>
      <div className="grid h-screen min-h-[560px] overflow-hidden bg-muted/40 xl:grid-cols-[170px_320px_minmax(390px,1fr)_270px] lg:grid-cols-[72px_300px_minmax(390px,1fr)_250px]">
        <aside className="hidden min-h-0 border-r bg-card px-2 py-4 lg:flex lg:flex-col">
          <div className="mb-4 flex items-center gap-2 px-2 xl:px-3">
            <MessageCircle className="h-5 w-5 text-primary" />
            <span className="hidden font-bold xl:inline">Chat</span>
          </div>
          <nav className="space-y-1">
            {FILTROS.map((f, index) => {
              const Icon = [Inbox, UserRound, Bookmark, Archive][index] || Inbox;
              return <Button key={f.id} variant={filtro === f.id ? "secondary" : "ghost"} className="h-9 w-full justify-start px-2 xl:px-3" onClick={() => setFiltro(f.id)} title={f.label}>
                <Icon className="shrink-0" /><span className="hidden xl:inline">{f.label}</span>
              </Button>;
            })}
          </nav>
          <div className="mt-7 hidden xl:block">
            <p className="mb-2 px-3 text-xs font-semibold text-muted-foreground">Filtros</p>
            <Button variant={filtro === "nao_atribuidos" ? "secondary" : "ghost"} className="h-9 w-full justify-start text-xs" onClick={() => setFiltro("nao_atribuidos")}>
              <span className="h-2 w-2 rounded-full bg-destructive" /> Sem responsável
            </Button>
          </div>
          <Button variant="ghost" className="mt-auto h-9 justify-start px-2 xl:px-3" onClick={() => setGerenciarTags(true)} title="Gerenciar etiquetas">
            <Settings2 /><span className="hidden xl:inline">Etiquetas</span>
          </Button>
        </aside>

        {/* Coluna 1 — lista de atendimentos */}
        <div className="flex min-h-0 flex-col border-r bg-card">
          <div className="flex h-14 items-center gap-2 border-b px-3">
            <Menu className="h-4 w-4 text-muted-foreground" />
            <h1 className="min-w-0 flex-1 truncate text-base font-bold">{FILTROS.find((item) => item.id === filtro)?.label || "Abertos"}</h1>
            <Popover>
              <PopoverTrigger asChild><Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Opções da lista"><MoreHorizontal /></Button></PopoverTrigger>
              <PopoverContent align="end" className="w-52 p-1">
                <Button variant="ghost" className="w-full justify-start"><SlidersHorizontal /> Filtrar por</Button>
                <Button variant="ghost" className="w-full justify-start"><ArrowDownAZ /> Ordenar por</Button>
                <Button variant="ghost" className="w-full justify-start"><EyeOff /> Esconder etiquetas</Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setGerenciarTags(true)}><Tag /> Gerenciar etiquetas</Button>
              </PopoverContent>
            </Popover>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={abrirNova} aria-label="Nova conversa"><Plus /></Button>
          </div>
          <div className="border-b p-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar nome ou número…"
                className="h-9 pl-8"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {loading && <div className="flex justify-center p-6"><Loader2 className="h-5 w-5 animate-spin" /></div>}
            {!loading && filtradas.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">Nenhuma conversa neste filtro.</p>
            )}
            {filtradas.map((c) => {
              const tags = tagsPorConversa[c.id] || [];
              return (
                <button
                  key={c.id}
                   onClick={() => selecionarConversa(c)}
                  className={`flex w-full gap-2.5 border-b px-3 py-2.5 text-left transition hover:bg-muted/50 ${
                    selecionada?.id === c.id ? "bg-secondary" : c.nao_lidas > 0 ? "bg-destructive/5" : ""
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {inicial(c)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold">{c.nome_contato || c.telefone}</span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">{fmtData(c.ultima_mensagem_em)}</span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="truncate text-[11px] text-muted-foreground">{c.ultima_mensagem || "—"}</span>
                      {c.nao_lidas > 0 && (
                          <span className="shrink-0 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-foreground">
                          {c.nao_lidas}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <TooltipProvider delayDuration={150}><Tooltip><TooltipTrigger asChild><span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1 text-[8px] font-bold text-muted-foreground">{iniciaisAtendente(c.responsavel_id)}</span></TooltipTrigger><TooltipContent>{nomeAtendente(c.responsavel_id)}</TooltipContent></Tooltip></TooltipProvider>
                      {tags.slice(0, 3).map((t) => { const d = tagDef(t, etiquetas); return <span key={t} className={`truncate rounded border px-1.5 py-px text-[9px] font-semibold ${d.className}`}>{d.label}</span>; })}
                    </div>
                    {tags.length > 0 && (
                      <span className="sr-only">{tags.length} etiquetas</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Coluna 2 — chat */}
         <div className="flex min-h-0 flex-col bg-card">
          {selecionada ? (
            <>
               <div className="grid h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b px-4">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {inicial(selecionada)}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-semibold leading-tight">
                      {selecionada.nome_contato || selecionada.telefone}
                    </div>
                     <div className="flex items-center gap-1 truncate text-[10px] text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-whatsapp" /> WhatsApp · {selecionada.telefone}</div>
                  </div>
                </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`hidden items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold sm:flex ${aberta ? "bg-accent/10 text-accent" : "bg-gold/15 text-gold-foreground"}`}><Clock className="h-3 w-3" />{aberta ? "Janela aberta" : "Janela fechada"}</span>
                    <Select value={selecionada.responsavel_id ?? "sem"} onValueChange={transferir} disabled={transferindo || atendentes.length === 0}>
                      <SelectTrigger className="h-8 w-[148px] text-xs"><SelectValue placeholder="Responsável" /></SelectTrigger>
                      <SelectContent>{!selecionada.responsavel_id && <SelectItem value="sem" disabled>Sem responsável</SelectItem>}{atendentes.map((item) => <SelectItem key={item.id} value={item.id}>{item.nome}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
              </div>
               <div className="min-h-0 flex-1">
                <ConversaChat
                  conversa={selecionada}
                   tags={tagsPorConversa[selecionada.id] || []}
                   etiquetas={etiquetas}
                   onTagsChange={(tags) => setTagsPorConversa((prev) => ({ ...prev, [selecionada.id]: tags }))}
                  onMarcarLida={() => {
                    setConversas((prev) => prev.map((c) => (c.id === selecionada.id ? { ...c, nao_lidas: 0 } : c)));
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
              Selecione um atendimento à esquerda.
            </div>
          )}
        </div>

        {/* Coluna 3 — contato e negócio */}
         <div className="hidden min-h-0 border-l bg-card lg:block">
          {selecionada ? (
            <ContatoPanel
              key={selecionada.id}
              conversa={selecionada}
               onNegociacaoVinculada={(negociacaoId) => {
                 const atualizada = { ...selecionada, negociacao_id: negociacaoId };
                 setSelecionada(atualizada);
                 setConversas((prev) => prev.map((c) => c.id === atualizada.id ? atualizada : c));
               }}
              onNomeAtualizado={(nome) => {
                setSelecionada({ ...selecionada, nome_contato: nome });
                setConversas((prev) =>
                  prev.map((c) => (c.id === selecionada.id ? { ...c, nome_contato: nome } : c)),
                );
              }}
            />
          ) : (
            <p className="p-4 text-xs text-muted-foreground">Dados do contato aparecem aqui.</p>
          )}
       </div>
      </div>

      <EtiquetasManager open={gerenciarTags} onOpenChange={setGerenciarTags} />
      {/* Nova conversa */}
      <Dialog open={novaAberta} onOpenChange={setNovaAberta}>
         <DialogContent className="max-w-lg">
           <DialogHeader><DialogTitle>Enviar mensagem</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Número com DDI e DDD</Label>
              <Input
                value={novoTelefone}
                onChange={(e) => setNovoTelefone(e.target.value)}
                placeholder="5521999998888"
              />
            </div>
            {conversaExistente ? <div className={`rounded-md border p-3 text-sm ${janelaAberta(conversaExistente) ? "bg-accent/10" : "bg-gold/10"}`}><p className="font-semibold">Este número já possui atendimento.</p><p className="mt-1 text-xs text-muted-foreground">{janelaAberta(conversaExistente) ? "A janela está aberta: você pode escrever qualquer mensagem." : "A janela está fechada: só mensagens prontas podem ser enviadas."}</p><Button className="mt-3 w-full" onClick={() => { selecionarConversa(conversaExistente); setNovaAberta(false); }}>Abrir atendimento existente</Button></div> : <>
              <div><Label className="text-xs">Mensagem inicial</Label><Select value={templateNovo} onValueChange={setTemplateNovo}><SelectTrigger><SelectValue placeholder="Escolher mensagem pronta aprovada" /></SelectTrigger><SelectContent>{templates.filter((item) => item.variaveis === 0).map((item) => <SelectItem key={item.nome} value={item.nome}>{item.nome}</SelectItem>)}{templates.filter((item) => item.variaveis === 0).length === 0 && <div className="p-2 text-xs text-muted-foreground">Nenhuma mensagem pronta sem variáveis disponível.</div>}</SelectContent></Select>{templateNovo && <p className="mt-2 whitespace-pre-wrap rounded-md bg-muted p-2 text-xs text-muted-foreground">{templates.find((item) => item.nome === templateNovo)?.texto}</p>}</div>
            <div>
              <Label className="text-xs">Nome do contato (opcional)</Label>
              <Input value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Nome do cliente" />
            </div>
            <p className="text-xs text-muted-foreground">
              O primeiro contato com um número novo precisa ser uma <strong>mensagem pronta</strong> aprovada pela Meta.
            </p>
             <Button onClick={criarConversa} disabled={criando || !templateNovo} className="w-full">
              {criando ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
                Criar e enviar mensagem pronta
            </Button>
             </>}
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
