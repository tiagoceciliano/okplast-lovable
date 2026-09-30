import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarClock, Clock, MessageSquare, Phone, User } from "lucide-react";
import { brl, type Negociacao, type VendedorLite } from "./types";

interface Props {
  negociacao: Negociacao;
  vendedores: VendedorLite[];
  tarefasCount?: number;
  comentariosCount?: number;
  hasVencida?: boolean;
  onClick: () => void;
}

export function KanbanCard({ negociacao, vendedores, tarefasCount, comentariosCount, hasVencida, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: negociacao.id,
    data: { type: "card", etapa: negociacao.etapa },
  });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const responsavel = vendedores.find((v) => v.user_id === negociacao.responsavel_id);
  const dataRef = negociacao.created_at;
  const dataFmt = dataRef
    ? new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(dataRef))
    : "";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-card border rounded-lg p-3 shadow-xs hover:shadow-md cursor-pointer space-y-2"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-sm leading-tight truncate">{negociacao.nome_cliente}</h4>
        {hasVencida && (
          <span className="w-2 h-2 rounded-full bg-destructive shrink-0 mt-1" title="Tarefa vencida" />
        )}
      </div>
      {negociacao.telefone && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Phone className="h-3 w-3" /> {negociacao.telefone}
        </div>
      )}
      {negociacao.produto && (
        <div className="text-xs text-muted-foreground truncate">{negociacao.produto}</div>
      )}
      {dataFmt && (
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" /> {dataFmt}
        </div>
      )}
      {negociacao.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {negociacao.tags.map((t) => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{t}</span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between pt-1 border-t">
        <span className="text-sm font-semibold text-primary">{brl(negociacao.valor)}</span>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          {tarefasCount ? <span className="flex items-center gap-0.5"><CalendarClock className="h-3 w-3"/>{tarefasCount}</span> : null}
          {comentariosCount ? <span className="flex items-center gap-0.5"><MessageSquare className="h-3 w-3"/>{comentariosCount}</span> : null}
          <span className="flex items-center gap-0.5" title={responsavel?.nome || "Sem responsável"}>
            <User className="h-3 w-3" />{responsavel?.nome?.split(" ")[0] || "—"}
          </span>
        </div>
      </div>
    </div>
  );
}