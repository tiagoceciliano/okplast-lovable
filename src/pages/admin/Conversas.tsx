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
import { MessageCircle, Plus, Tag, Search, Loader2, Clock, CircleDot } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type FiltroId = "meus" | "nao_atribuidos" | "aguardando" | "todos";

const FILTROS: { id: FiltroId; label: string }[] = [
  { id: "meus", label: "Meus" },
  { id: "nao_atribuidos", label: "Não atribuídos" },
  { id: "aguardando", label: "Aguardando" },
  { id: "todos", label: "Todos" },
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
  const [filtro, setFiltro] = useState<FiltroId>("todos");
  const [loading, setLoading] = useState(true);
  const [novaAberta, setNovaAberta] = useState(false);
  const [novoTelefone, setNovoTelefone] = useState("");
  const [novoNome, setNovoNome] = useState("");
  const [criando, setCriando] = useState(false);
  const etiquetas = useEtiquetas();
  const [gerenciarTags, setGerenciarTags] = useState(false);

  const carregar = async () => {
    const { data, error } = await supabase
      .from("whatsapp_conversas")
      .select("*")
      .order("ultima_mensagem_em", { ascending: false, nullsFirst: false });
    if (error) toast.error(error.message);
    const lista = (data as Conversa[]) || [];
    setConversas(lista);
    setLoading(false);

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

  useEffect(() => { carregar(); }, []);

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
      if (filtro === "meus" && c.responsavel_id !== user?.id) return false;
      if (filtro === "nao_atribuidos" && c.responsavel_id) return false;
      if (filtro === "aguardando" && c.nao_lidas === 0) return false;
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
    await carregar();
    const conv = (data as any)?.conversa;
    if (conv) setSelecionada(conv as Conversa);
    setNovaAberta(false); setNovoTelefone(""); setNovoNome("");
    toast.success("Conversa criada. Envie uma mensagem pronta para iniciar o contato.");
  };

  const aberta = janelaAberta(selecionada);

  return (
    <AdminLayout>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <MessageCircle className="h-6 w-6" /> Atendimento WhatsApp
        </h1>
        <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setGerenciarTags(true)}>
          <Tag className="mr-1 h-4 w-4" /> Etiquetas
        </Button>
        <Button size="sm" onClick={() => setNovaAberta(true)}>
          <Plus className="mr-1 h-4 w-4" /> Nova conversa
        </Button>
        </div>
      </div>

      <div className="grid h-[calc(100vh-160px)] min-h-[460px] gap-0 overflow-hidden rounded-lg border bg-card lg:grid-cols-[300px_1fr_300px]">
        {/* Coluna 1 — lista de atendimentos */}
        <div className="flex min-h-0 flex-col border-r">
          <div className="space-y-2 border-b p-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar nome ou número…"
                className="h-9 pl-8"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto">
              {FILTROS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFiltro(f.id)}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                    filtro === f.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {f.label}
                </button>
              ))}
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
                  onClick={() => setSelecionada(c)}
                  className={`flex w-full gap-2.5 border-b px-3 py-3 text-left transition hover:bg-muted/50 ${
                    selecionada?.id === c.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {inicial(c)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">{c.nome_contato || c.telefone}</span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">{fmtData(c.ultima_mensagem_em)}</span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-muted-foreground">{c.ultima_mensagem || "—"}</span>
                      {c.nao_lidas > 0 && (
                        <span className="shrink-0 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          {c.nao_lidas}
                        </span>
                      )}
                    </div>
                    {tags.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {tags.slice(0, 3).map((t) => {
                          const d = tagDef(t, etiquetas);
                          return (
                            <span key={t} className={`rounded-full border px-1.5 py-px text-[9px] font-semibold ${d.className}`}>
                              {d.label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Coluna 2 — chat */}
        <div className="flex min-h-0 flex-col">
          {selecionada ? (
            <>
              <div className="flex items-center justify-between gap-3 border-b px-4 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {inicial(selecionada)}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-semibold leading-tight">
                      {selecionada.nome_contato || selecionada.telefone}
                    </div>
                    <div className="text-xs text-muted-foreground">{selecionada.telefone}</div>
                  </div>
                </div>
                <span
                  className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    aberta
                      ? "bg-emerald-500/15 text-emerald-600"
                      : "bg-amber-500/15 text-amber-600"
                  }`}
                >
                  {aberta ? <CircleDot className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  {aberta ? "Janela aberta" : "Janela 24h fechada"}
                </span>
              </div>
              <div className="min-h-0 flex-1 p-3">
                <ConversaChat
                  conversa={selecionada}
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
        <div className="hidden min-h-0 border-l lg:block">
          {selecionada ? (
            <ContatoPanel
              key={selecionada.id}
              conversa={selecionada}
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
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Nova conversa</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Número com DDI e DDD</Label>
              <Input
                value={novoTelefone}
                onChange={(e) => setNovoTelefone(e.target.value)}
                placeholder="5521999998888"
              />
            </div>
            <div>
              <Label className="text-xs">Nome do contato (opcional)</Label>
              <Input value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Nome do cliente" />
            </div>
            <p className="text-xs text-muted-foreground">
              O primeiro contato com um número novo precisa ser uma <strong>mensagem pronta</strong> aprovada pela Meta.
            </p>
            <Button onClick={criarConversa} disabled={criando} className="w-full">
              {criando ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
              Criar conversa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
