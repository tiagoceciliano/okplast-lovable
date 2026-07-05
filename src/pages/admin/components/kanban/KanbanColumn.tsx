import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KanbanCard } from "./KanbanCard";
import { brl, type EtapaId, type Negociacao, type VendedorLite } from "./types";

interface Props {
  etapaId: EtapaId;
  label: string;
  negociacoes: Negociacao[];
  vendedores: VendedorLite[];
  countsTarefas: Record<string, number>;
  countsComentarios: Record<string, number>;
  vencidas: Record<string, boolean>;
  onCardClick: (n: Negociacao) => void;
  onAdd: () => void;
  canAdd: boolean;
}

export function KanbanColumn({
  etapaId, label, negociacoes, vendedores,
  countsTarefas, countsComentarios, vencidas, onCardClick, onAdd, canAdd,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: etapaId, data: { type: "column", etapa: etapaId } });
  const total = negociacoes.reduce((s, n) => s + (n.valor ?? 0), 0);

  return (
    <div className="flex flex-col w-72 shrink-0 bg-muted/40 rounded-lg">
      <div className="p-3 border-b sticky top-0 bg-muted/40 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{label}</h3>
          <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full">
            {negociacoes.length}
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{brl(total)}</div>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 p-2 space-y-2 min-h-[200px] transition-colors ${isOver ? "bg-primary/5" : ""}`}
      >
        <SortableContext items={negociacoes.map((n) => n.id)} strategy={verticalListSortingStrategy}>
          {negociacoes.map((n) => (
            <KanbanCard
              key={n.id}
              negociacao={n}
              vendedores={vendedores}
              tarefasCount={countsTarefas[n.id]}
              comentariosCount={countsComentarios[n.id]}
              hasVencida={vencidas[n.id]}
              onClick={() => onCardClick(n)}
            />
          ))}
        </SortableContext>
        {canAdd && (
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={onAdd}>
            <Plus className="h-4 w-4 mr-2" /> Adicionar
          </Button>
        )}
      </div>
    </div>
  );
}