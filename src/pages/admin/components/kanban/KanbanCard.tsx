import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarClock, Clock, MessageCircle, MessageCirclePlus, MessageSquare, Phone, User } from "lucide-react";
import { tagDef, useEtiquetas } from "../conversas/tags";
import { brl, type Negociacao, type VendedorLite } from "./types";

interface Props {
  negociacao: Negociacao;
  vendedores: VendedorLite[];
  tarefasCount?: number | undefined;
  comentariosCount?: number | undefined;
  hasVencida?: boolean | undefined;
  chatNaoLidas?: number | undefined;
  onClick: () => void;
}

export function KanbanCard({ negociacao, vendedores, tarefasCount, comentariosCount, hasVencida, chatNaoLidas, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: negociacao.id,
    data: { type: "card", etapa: negociacao.etapa },
  });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const etiquetas = useEtiquetas();
  const temChat = chatNaoLidas !== undefined;
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
        <div className="flex items-center gap-1.5 shrink-0">
        {temChat ? (
          <span className="relative text-emerald-600" title="Chat WhatsApp vinculado">
            <MessageCircle className="h-4 w-4" />
            {chatNaoLidas! > 0 && (
              <span className="absolute -right-1.5 -top-1.5 min-w-[14px] rounded-full bg-emerald-500 px-1 text-center text-[9px] font-bold leading-[14px] text-white">
                {chatNaoLidas}
              </span>
            )}
          </span>
        ) : (
          <span className="text-muted-foreground/60" title="Sem chat — abra o card para vincular">
            <MessageCirclePlus className="h-4 w-4" />
          </span>
        )}
        {hasVencida && (
          <span className="w-2 h-2 rounded-full bg-destructive shrink-0" title="Tarefa vencida" />
        )}
        </div>
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
          {negociacao.tags.map((t) => {
            const d = tagDef(t, etiquetas);
            return <span key={t} className={`text-[9px] font-semibold px-1.5 py-px rounded-full border ${d.className}`}>{d.label}</span>;
          })}
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