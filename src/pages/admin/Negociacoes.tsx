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

export default function Negociacoes() {
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
    const [neg, wa, tar] = await Promise.all([
      supabase.from("negociacoes").select("*").order("posicao"),
      supabase.from("whatsapp_numbers").select("user_id,nome_vendedor,numero_raw,numero_formatado"),
      supabase.from("negociacao_tarefas").select("negociacao_id,concluida,data_vencimento"),
    ]);
    if (neg.error) { toast.error(neg.error.message); return; }
    setItems((neg.data as Negociacao[]) || []);
    const waRows = (wa.data || []) as { user_id: string | null; nome_vendedor: string; numero_raw: string; numero_formatado: string }[];
    const vs = waRows
      .filter((v) => v.user_id)
      .map((v) => ({ user_id: v.user_id!, nome: v.nome_vendedor }));
    setVendedores(vs);
    const nmap: Record<string, { user_id: string | null; nome: string; formatado: string }> = {};
    waRows.forEach((v) => { nmap[v.numero_raw] = { user_id: v.user_id, nome: v.nome_vendedor, formatado: v.numero_formatado }; });
    setNumeroMap(nmap);

    const cT: Record<string, number> = {};
    const vV: Record<string, boolean> = {};
    (tar.data || []).forEach((t: { negociacao_id: string; concluida: boolean; data_vencimento: string | null }) => {
      if (!t.concluida) cT[t.negociacao_id] = (cT[t.negociacao_id] || 0) + 1;
      if (!t.concluida && t.data_vencimento && new Date(t.data_vencimento) < new Date()) {
        vV[t.negociacao_id] = true;
      }
    });
    setCountsT(cT); setVenc(vV);

    const { data: coms } = await supabase.from("negociacao_comentarios").select("negociacao_id");
    const cC: Record<string, number> = {};
    (coms || []).forEach((c: { negociacao_id: string }) => { cC[c.negociacao_id] = (cC[c.negociacao_id] || 0) + 1; });
    setCountsC(cC);

    const { data: convs } = await supabase.from("whatsapp_conversas").select("telefone,negociacao_id,nao_lidas");
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
    if (busca) {
      const q = busca.toLowerCase();
      return [n.nome_cliente, n.telefone, n.email, n.produto].some((x) => (x || "").toLowerCase().includes(q));
    }
    return true;
  }), [items, busca, filtroResp]);

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
    <AdminLayout>
      <div className="space-y-4 h-full flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">Negociações</h1>
            <p className="text-sm text-muted-foreground">Pipeline de vendas</p>
          </div>
          {podeCriar && (
            <Button onClick={() => setNovaOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Nova negociação
            </Button>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <Input placeholder="Buscar…" value={busca} onChange={(e) => setBusca(e.target.value)} className="max-w-xs" />
          <Select value={filtroResp} onValueChange={setFiltroResp}>
            <SelectTrigger className="w-52"><SelectValue placeholder="Responsável" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os responsáveis</SelectItem>
              <SelectItem value="none">Sem responsável</SelectItem>
              {vendedores.map((v) => <SelectItem key={v.user_id} value={v.user_id}>{v.nome}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-3 pb-4 min-h-[500px]">
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
                  onAdd={() => setNovaOpen(true)}
                  canAdd={podeCriar}
                />
              ))}
            </div>
          </div>
          <DragOverlay>
            {dragging && <KanbanCard negociacao={dragging} vendedores={vendedores} onClick={() => {}} />}
          </DragOverlay>
        </DndContext>
      </div>

      <NegociacaoModal
        negociacao={ativo}
        vendedores={vendedores}
        numeroMap={numeroMap}
        onClose={() => setAtivo(null)}
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
    </AdminLayout>
  );
}