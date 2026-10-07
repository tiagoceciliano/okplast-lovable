import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ListTodo, MessageCircle, MessageCirclePlus, MessageSquare, CalendarClock } from "lucide-react";
import { tagDef, useEtiquetas } from "../conversas/tags";
import { brl, type Negociacao, type VendedorLite } from "./types";

interface Props {
  negociacao: Negociacao;
  vendedores: VendedorLite[];
  tarefasCount?: { pend: number; total: number } | undefined;
  comentariosCount?: number | undefined;
  hasVencida?: boolean | undefined;
  chatNaoLidas?: number | undefined;
  agendamentosCount?: number | undefined;
  onClick: () => void;
  onChatClick: () => void;
}

export function KanbanCard({ negociacao, vendedores, tarefasCount, comentariosCount, hasVencida, chatNaoLidas, agendamentosCount, onClick, onChatClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: negociacao.id,
    data: { type: "card", etapa: negociacao.etapa },
  });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const etiquetas = useEtiquetas();
  const temChat = chatNaoLidas !== undefined;
  const responsavel = vendedores.find((v) => v.user_id === negociacao.responsavel_id);
  const initial = (responsavel?.nome || negociacao.nome_cliente).charAt(0).toUpperCase();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`cursor-pointer space-y-1.5 rounded-md border p-2.5 shadow-xs transition hover:border-primary/40 hover:shadow-sm ${
        negociacao.etapa === "perdido" ? "border-destructive/30 bg-destructive/10"
        : negociacao.etapa === "venda_realizada" ? "border-accent/30 bg-accent/10"
        : "bg-card"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-sm leading-tight truncate">{negociacao.nome_cliente}</h4>
        <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => { event.stopPropagation(); onChatClick(); }}
          className={temChat ? "relative text-whatsapp" : "text-muted-foreground/60"}
          title={temChat ? "Ver conversa associada" : "Associar uma conversa"}
          aria-label={temChat ? "Ver conversa associada" : "Associar uma conversa"}
        >
          {temChat ? (
            <>
            <MessageCircle className="h-4 w-4" />
            {(chatNaoLidas ?? 0) > 0 && (
              <span className="absolute -right-1.5 -top-1.5 min-w-[14px] rounded-full bg-accent px-1 text-center text-[9px] font-bold leading-[14px] text-accent-foreground">
                {chatNaoLidas}
              </span>
            )}
            </>
          ) : (
            <MessageCirclePlus className="h-4 w-4" />
          )}
        </button>
        {hasVencida && (
          <span className="w-2 h-2 rounded-full bg-destructive shrink-0" title="Tarefa vencida" />
        )}
        </div>
      </div>
      <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground">
        <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-primary/10 text-[8px] font-bold text-primary">{initial}</span>
        <span className="truncate">{negociacao.produto || negociacao.nome_cliente}</span>
      </div>
      {negociacao.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {negociacao.tags.map((t) => {
            const d = tagDef(t, etiquetas);
            return <span key={t} className={`text-[9px] font-semibold px-1.5 py-px rounded-full border ${d.className}`}>{d.label}</span>;
          })}
        </div>
      )}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-semibold">{brl(negociacao.valor)}</span>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          {agendamentosCount ? (
            <span className="flex items-center gap-0.5 text-primary" title={`${agendamentosCount} mensagem(ns) agendada(s)`}>
              <CalendarClock className="h-3.5 w-3.5" />{agendamentosCount}
            </span>
          ) : null}
          {tarefasCount ? (
            <span className="flex items-center gap-0.5" title={`Tarefas: ${tarefasCount.pend} pendente(s) de ${tarefasCount.total}`}>
              <ListTodo className="h-3.5 w-3.5" />{tarefasCount.pend}/{tarefasCount.total}
            </span>
          ) : null}
          {comentariosCount ? (
            <span className="flex items-center gap-0.5" title={`${comentariosCount} comentário(s)`}>
              <MessageSquare className="h-3.5 w-3.5" />{comentariosCount}
            </span>
          ) : null}
          <span className="flex items-center gap-1" title={responsavel?.nome || "Sem responsável"}><span className="h-1.5 w-1.5 rounded-full bg-accent" />COMERCIAL</span>
        </div>
      </div>
    </div>
  );
}
