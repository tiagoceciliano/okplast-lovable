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
  countsTarefas: Record<string, { pend: number; total: number }>;
  countsComentarios: Record<string, number>;
  vencidas: Record<string, boolean>;
  chats?: Record<string, number>;
  agendamentos?: Record<string, number>;
  onCardClick: (n: Negociacao) => void;
  onChatClick: (n: Negociacao) => void;
  onAdd: () => void;
  canAdd: boolean;
}

export function KanbanColumn({
  etapaId, label, negociacoes, vendedores,
  countsTarefas, countsComentarios, vencidas, chats = {}, onCardClick, onChatClick, onAdd, canAdd,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: etapaId, data: { type: "column", etapa: etapaId } });
  const total = negociacoes.reduce((s, n) => s + (n.valor ?? 0), 0);

  return (
    <div className="flex w-[258px] shrink-0 flex-col rounded-md bg-muted/50">
      <div className="sticky top-0 rounded-t-md border-b bg-muted/90 p-2.5 backdrop-blur">
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
              chatNaoLidas={chats[n.id]}
              onClick={() => onCardClick(n)}
              onChatClick={() => onChatClick(n)}
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
