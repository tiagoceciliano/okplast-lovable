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
import { KanbanColumn } from "./components/kanban/KanbanColumn";
import { KanbanCard } from "./components/kanban/KanbanCard";
import { NegociacaoModal } from "./components/kanban/NegociacaoModal";
import { ETAPAS, type EtapaId, type Negociacao, type VendedorLite } from "./components/kanban/types";
import { usePermissions } from "@/hooks/usePermissions";

export default function Negociacoes() {
  const { can, loading: permLoading } = usePermissions();
  const [items, setItems] = useState<Negociacao[]>([]);
  const [vendedores, setVendedores] = useState<VendedorLite[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroResp, setFiltroResp] = useState<string>("all");
  const [ativo, setAtivo] = useState<Negociacao | null>(null);
  const [dragging, setDragging] = useState<Negociacao | null>(null);
  const [countsT, setCountsT] = useState<Record<string, number>>({});
  const [countsC, setCountsC] = useState<Record<string, number>>({});
  const [venc, setVenc] = useState<Record<string, boolean>>({});

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const load = async () => {
    const [neg, wa, tar] = await Promise.all([
      supabase.from("negociacoes").select("*").order("posicao"),
      supabase.from("whatsapp_numbers").select("user_id,nome_vendedor").not("user_id", "is", null),
      supabase.from("negociacao_tarefas").select("negociacao_id,concluida,data_vencimento"),
    ]);
    if (neg.error) { toast.error(neg.error.message); return; }
    setItems((neg.data as Negociacao[]) || []);
    const vs = ((wa.data || []) as { user_id: string; nome_vendedor: string }[])
      .map((v) => ({ user_id: v.user_id!, nome: v.nome_vendedor }));
    setVendedores(vs);

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
      entrada: [], em_contato: [], orcamento: [], negociacao: [], ganho: [], perdido: [],
    };
    filtered.forEach((n) => map[n.etapa]?.push(n));
    return map;
  }, [filtered]);

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

    // otimista
    setItems((prev) => prev.map((i) => (i.id === activeItem.id ? { ...i, etapa: newEtapa } : i)));
    const { error } = await supabase.from("negociacoes").update({ etapa: newEtapa }).eq("id", activeItem.id);
    if (error) {
      toast.error(error.message);
      load();
    }
  };

  const criarManual = async (etapa: EtapaId) => {
    const nome = prompt("Nome do cliente:");
    if (!nome) return;
    const { data, error } = await supabase.from("negociacoes").insert({
      nome_cliente: nome, etapa, posicao: 999999,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    setItems((p) => [...p, data as Negociacao]);
    setAtivo(data as Negociacao);
  };

  const podeCriar = can("negociacoes", "edit");

  if (permLoading) return <AdminLayout><div className="p-8">Carregando…</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-4 h-full flex flex-col">
        <div>
          <h1 className="text-2xl font-bold">Negociações</h1>
          <p className="text-sm text-muted-foreground">Pipeline de vendas</p>
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
                  onCardClick={(n) => setAtivo(n)}
                  onAdd={() => criarManual(e.id as EtapaId)}
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
        onClose={() => setAtivo(null)}
        onChanged={load}
      />
    </AdminLayout>
  );
}