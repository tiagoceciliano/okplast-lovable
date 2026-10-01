import { useEffect, useMemo, useState } from "react";
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  type DragEndEvent, type DragStartEvent,
} from "@dnd-kit/core";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, CalendarDays, Filter, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { KanbanColumn } from "./components/kanban/KanbanColumn";
import { KanbanCard } from "./components/kanban/KanbanCard";
import { NegociacaoModal } from "./components/kanban/NegociacaoModal";
import { NovaNegociacaoDialog } from "./components/kanban/NovaNegociacaoDialog";
import { GanhoDialog } from "./components/kanban/GanhoDialog";
import { NegociacaoChatSheet } from "./components/kanban/NegociacaoChatSheet";
import { ETAPAS, type EtapaId, type Negociacao, type VendedorLite } from "./components/kanban/types";
import { usePermissions } from "@/hooks/usePermissions";
import { useSearchParams } from "@/lib/router-compat";

export default function Negociacoes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { can, loading: permLoading } = usePermissions();
  const [items, setItems] = useState<Negociacao[]>([]);
  const [vendedores, setVendedores] = useState<VendedorLite[]>([]);
  const [numeroMap, setNumeroMap] = useState<Record<string, { user_id: string | null; nome: string; formatado: string }>>({});
  const [busca, setBusca] = useState("");
  const [filtroResp, setFiltroResp] = useState<string>("all");
  const [ativo, setAtivo] = useState<Negociacao | null>(null);
  const [dragging, setDragging] = useState<Negociacao | null>(null);
  const [countsT, setCountsT] = useState<Record<string, number>>({});
  const [countsC, setCountsC] = useState<Record<string, number>>({});
  const [chats, setChats] = useState<Record<string, number>>({});
  const [chatAtivo, setChatAtivo] = useState<Negociacao | null>(null);
  const [venc, setVenc] = useState<Record<string, boolean>>({});
  const [novaOpen, setNovaOpen] = useState(false);
  const [ganhoPending, setGanhoPending] = useState<Negociacao | null>(null);
  const [filtroProduto, setFiltroProduto] = useState("all");
  const [filtroTag, setFiltroTag] = useState("all");
  const [filtroStatus, setFiltroStatus] = useState("all");
  const [filtroEtapa, setFiltroEtapa] = useState("all");
  const [filtroInicio, setFiltroInicio] = useState("");
  const [filtroFim, setFiltroFim] = useState("");
  const [ordenacao, setOrdenacao] = useState("recentes");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const load = async () => {
    const [neg, wa, tar, agd] = await Promise.all([
      supabase.from("negociacoes").select("*").order("posicao"),
      supabase.from("whatsapp_numbers").select("user_id,nome_vendedor,numero_raw,numero_formatado"),
      supabase.from("negociacao_tarefas").select("negociacao_id,concluida,data_vencimento"),
      supabase.from("whatsapp_agendamentos").select("conversa_id").eq("status", "pendente"),
    ]);
    if (neg.error) { toast.error(neg.error.message); return; }
    const negociacoes = (neg.data as Negociacao[]) || [];
    setItems(negociacoes);
    const negociacaoId = searchParams.get("negociacao");
    if (negociacaoId) {
      const encontrada = negociacoes.find((item) => item.id === negociacaoId);
      if (encontrada) setAtivo(encontrada);
    }
    const waRows = (wa.data || []) as { user_id: string | null; nome_vendedor: string; numero_raw: string; numero_formatado: string }[];
    const { data: equipe } = await supabase.rpc("list_equipe");
    const vs = (equipe ?? [])
      .filter((u) => u.roles?.includes("vendedor"))
      .map((u) => ({ user_id: u.id, nome: u.nome }));
    setVendedores(vs);
    const nmap: Record<string, { user_id: string | null; nome: string; formatado: string }> = {};
    waRows.forEach((v) => { nmap[v.numero_raw] = { user_id: v.user_id, nome: v.nome_vendedor, formatado: v.numero_formatado }; });
    setNumeroMap(nmap);

    const cT: Record<string, { pend: number; total: number }> = {};
    const vV: Record<string, boolean> = {};
    (tar.data || []).forEach((t: { negociacao_id: string; concluida: boolean; data_vencimento: string | null }) => {
      const e = (cT[t.negociacao_id] ||= { pend: 0, total: 0 });
      e.total++;
      if (!t.concluida) e.pend++;
      if (!t.concluida && t.data_vencimento && new Date(t.data_vencimento) < new Date()) {
        vV[t.negociacao_id] = true;
      }
    });
    setCountsT(cT); setVenc(vV);

    const { data: coms } = await supabase.from("negociacao_comentarios").select("negociacao_id");
    const cC: Record<string, number> = {};
    (coms || []).forEach((c: { negociacao_id: string }) => { cC[c.negociacao_id] = (cC[c.negociacao_id] || 0) + 1; });
    setCountsC(cC);

    const { data: convs } = await supabase.from("whatsapp_conversas").select("id,telefone,negociacao_id,nao_lidas");
    const norm = (t: string | null) => { const d = (t || "").replace(/\D/g, ""); return d.startsWith("55") ? d.slice(2) : d; };
    const porTel = new Map<string, number>();
    const porNeg = new Map<string, number>();
    (convs || []).forEach((c) => {
      porTel.set(norm(c.telefone), c.nao_lidas);
      if (c.negociacao_id) porNeg.set(c.negociacao_id, c.nao_lidas);
    });
    const ch: Record<string, number> = {};
    ((neg.data as Negociacao[]) || []).forEach((n) => {
      const v = porNeg.get(n.id) ?? (n.telefone ? porTel.get(norm(n.telefone)) : undefined);
      if (v !== undefined) ch[n.id] = v;
    });
    setChats(ch);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => items.filter((n) => {
    if (filtroResp !== "all" && n.responsavel_id !== (filtroResp === "none" ? null : filtroResp)) return false;
    if (filtroProduto !== "all" && (n.produto || n.material || "") !== filtroProduto) return false;
    if (filtroTag !== "all" && !n.tags.includes(filtroTag)) return false;
    if (filtroStatus !== "all" && n.status !== filtroStatus) return false;
    if (filtroEtapa !== "all" && n.etapa !== filtroEtapa) return false;
    if (filtroInicio && new Date(n.created_at) < new Date(`${filtroInicio}T00:00:00`)) return false;
    if (filtroFim && new Date(n.created_at) > new Date(`${filtroFim}T23:59:59`)) return false;
    if (busca) {
      const q = busca.toLowerCase();
      return [n.nome_cliente, n.telefone, n.email, n.produto].some((x) => (x || "").toLowerCase().includes(q));
    }
    return true;
  }), [items, busca, filtroResp, filtroProduto, filtroTag, filtroStatus, filtroEtapa, filtroInicio, filtroFim]);

  const produtosFiltro = useMemo(() => Array.from(new Set(items.map((n) => n.produto || n.material).filter((v): v is string => Boolean(v)))).sort(), [items]);
  const tagsFiltro = useMemo(() => Array.from(new Set(items.flatMap((n) => n.tags))).sort(), [items]);
  const filtrosAtivos = [filtroResp, filtroProduto, filtroTag, filtroStatus, filtroEtapa].filter((value) => value !== "all").length + (filtroInicio ? 1 : 0) + (filtroFim ? 1 : 0);

  const limparFiltros = () => {
    setFiltroResp("all"); setFiltroProduto("all"); setFiltroTag("all"); setFiltroStatus("all"); setFiltroEtapa("all"); setFiltroInicio(""); setFiltroFim("");
  };

  const byEtapa = useMemo(() => {
    const map: Record<EtapaId, Negociacao[]> = {
      entrada: [], em_contato: [], orcamento: [], negociacao: [], venda_realizada: [], perdido: [],
    };
    filtered.forEach((n) => { if (map[n.etapa]) map[n.etapa].push(n); });
    Object.values(map).forEach((lista) => lista.sort((a, b) => {
      if (ordenacao === "antigos") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (ordenacao === "maior_valor") return (b.valor ?? 0) - (a.valor ?? 0);
      if (ordenacao === "menor_valor") return (a.valor ?? 0) - (b.valor ?? 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }));
    return map;
  }, [filtered, ordenacao]);

  const onDragStart = (e: DragStartEvent) => {
    const item = items.find((i) => i.id === e.active.id);
    setDragging(item || null);
  };

  const onDragEnd = async (e: DragEndEvent) => {
    setDragging(null);
    const { active, over } = e;
    if (!over) return;
    const activeItem = items.find((i) => i.id === active.id);
    if (!activeItem) return;

    const overData = over.data.current as { type?: string; etapa?: EtapaId } | undefined;
    const overItem = items.find((i) => i.id === over.id);
    const newEtapa: EtapaId = (overData?.etapa || overItem?.etapa || activeItem.etapa) as EtapaId;

    if (newEtapa === activeItem.etapa && over.id === active.id) return;

    // Se vai para "venda_realizada" precisa dos campos obrigatórios
    if (newEtapa === "venda_realizada" && activeItem.etapa !== "venda_realizada") {
      setGanhoPending(activeItem);
      return;
    }

    // otimista
    setItems((prev) => prev.map((i) => (i.id === activeItem.id ? { ...i, etapa: newEtapa } : i)));
    const { error } = await supabase.from("negociacoes").update({ etapa: newEtapa }).eq("id", activeItem.id);
    if (error) {
      toast.error(error.message);
      load();
    }
  };

  const podeCriar = can("negociacoes", "edit");

  if (permLoading) return <AdminLayout><div className="p-8">Carregando…</div></AdminLayout>;

  return (
    <AdminLayout fullBleed>
      <div className="flex h-screen min-h-[580px] flex-col overflow-hidden bg-card">
        <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b px-5 py-3">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold">Venda</h1>
            <p className="text-xs text-muted-foreground">Funil comercial</p>
          </div>
          {podeCriar && (
            <Button onClick={() => setNovaOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Nova negociação
            </Button>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 border-b px-5 py-2">
          <div className="relative w-60"><Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Pesquisar" value={busca} onChange={(e) => setBusca(e.target.value)} className="h-9 pl-8" /></div>
          <Popover>
            <PopoverTrigger asChild><Button variant="ghost" size="sm"><Filter /> Filtrar {filtrosAtivos > 0 && <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{filtrosAtivos}</span>}</Button></PopoverTrigger>
            <PopoverContent align="start" className="w-80 space-y-3 p-3">
              <p className="text-sm font-semibold">Filtros</p>
              <Select value={filtroResp} onValueChange={setFiltroResp}><SelectTrigger><SelectValue placeholder="Responsável" /></SelectTrigger><SelectContent><SelectItem value="all">Todos os responsáveis</SelectItem><SelectItem value="none">Sem responsável</SelectItem>{vendedores.map((v) => <SelectItem key={v.user_id} value={v.user_id}>{v.nome}</SelectItem>)}</SelectContent></Select>
              <Select value={filtroProduto} onValueChange={setFiltroProduto}><SelectTrigger><SelectValue placeholder="Produto" /></SelectTrigger><SelectContent><SelectItem value="all">Todos os produtos</SelectItem>{produtosFiltro.map((produto) => <SelectItem key={produto} value={produto}>{produto}</SelectItem>)}</SelectContent></Select>
              <Select value={filtroTag} onValueChange={setFiltroTag}><SelectTrigger><SelectValue placeholder="Etiqueta" /></SelectTrigger><SelectContent><SelectItem value="all">Todas as etiquetas</SelectItem>{tagsFiltro.map((tag) => <SelectItem key={tag} value={tag}>{tag}</SelectItem>)}</SelectContent></Select>
              <div className="grid grid-cols-2 gap-2"><Select value={filtroEtapa} onValueChange={setFiltroEtapa}><SelectTrigger><SelectValue placeholder="Etapa" /></SelectTrigger><SelectContent><SelectItem value="all">Todas as etapas</SelectItem>{ETAPAS.map((etapa) => <SelectItem key={etapa.id} value={etapa.id}>{etapa.label}</SelectItem>)}</SelectContent></Select><Select value={filtroStatus} onValueChange={setFiltroStatus}><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">Todos os status</SelectItem><SelectItem value="aberto">Aberto</SelectItem><SelectItem value="ganho">Ganho</SelectItem><SelectItem value="perdido">Perdido</SelectItem></SelectContent></Select></div>
              <div className="grid grid-cols-2 gap-2"><div><span className="mb-1 flex items-center gap-1 text-[10px] text-muted-foreground"><CalendarDays className="h-3 w-3" /> De</span><Input type="date" value={filtroInicio} onChange={(e) => setFiltroInicio(e.target.value)} /></div><div><span className="mb-1 flex items-center gap-1 text-[10px] text-muted-foreground"><CalendarDays className="h-3 w-3" /> Até</span><Input type="date" value={filtroFim} onChange={(e) => setFiltroFim(e.target.value)} /></div></div>
              <Button variant="ghost" size="sm" className="w-full" onClick={limparFiltros}><X /> Limpar filtros</Button>
            </PopoverContent>
          </Popover>
          <Select value={ordenacao} onValueChange={setOrdenacao}><SelectTrigger className="ml-auto h-9 w-44"><ArrowDownAZ className="h-4 w-4" /><SelectValue /></SelectTrigger><SelectContent><SelectItem value="recentes">Mais recentes</SelectItem><SelectItem value="antigos">Mais antigos</SelectItem><SelectItem value="maior_valor">Maior valor</SelectItem><SelectItem value="menor_valor">Menor valor</SelectItem></SelectContent></Select>
        </div>

        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="flex-1 overflow-auto bg-muted/20 p-3">
            <div className="flex min-h-full gap-2 pb-2">
              {ETAPAS.map((e) => (
                <KanbanColumn
                  key={e.id}
                  etapaId={e.id as EtapaId}
                  label={e.label}
                  negociacoes={byEtapa[e.id as EtapaId] || []}
                  vendedores={vendedores}
                  countsTarefas={countsT}
                  countsComentarios={countsC}
                  vencidas={venc}
                  chats={chats}
                  onCardClick={(n) => setAtivo(n)}
                   onChatClick={(n) => setChatAtivo(n)}
                  onAdd={() => setNovaOpen(true)}
                  canAdd={podeCriar}
                />
              ))}
            </div>
          </div>
          <DragOverlay>
            {dragging && <KanbanCard negociacao={dragging} vendedores={vendedores} onClick={() => {}} onChatClick={() => {}} />}
          </DragOverlay>
        </DndContext>
      </div>

      <NegociacaoModal
        negociacao={ativo}
        vendedores={vendedores}
        numeroMap={numeroMap}
        onClose={() => {
          setAtivo(null);
          if (searchParams.has("negociacao")) {
            const next = new URLSearchParams(searchParams);
            next.delete("negociacao");
            setSearchParams(next, { replace: true });
          }
        }}
        onChanged={load}
        onRequestGanho={(n) => setGanhoPending(n)}
      />

      <NovaNegociacaoDialog
        open={novaOpen}
        onOpenChange={setNovaOpen}
        vendedores={vendedores}
        onCreated={(n) => { load(); setAtivo(n); }}
      />

      <GanhoDialog
        negociacao={ganhoPending}
        onClose={() => setGanhoPending(null)}
        onDone={() => { setGanhoPending(null); load(); }}
      />
      <NegociacaoChatSheet negociacao={chatAtivo} onClose={() => setChatAtivo(null)} onChanged={load} />
    </AdminLayout>
  );
}
