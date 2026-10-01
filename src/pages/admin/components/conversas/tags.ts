export interface TagDef {
  id: string;
  label: string;
  className: string;
}

/** Etiquetas de atendimento (padrão Kinbox) */
export const TAGS: TagDef[] = [
  { id: "quente", label: "QUENTE 🔥", className: "bg-red-500/15 text-red-600 border-red-500/40" },
  { id: "morno", label: "MORNO 🤔", className: "bg-amber-500/15 text-amber-600 border-amber-500/40" },
  { id: "frio", label: "FRIO 🥶", className: "bg-sky-500/15 text-sky-600 border-sky-500/40" },
  { id: "orcamento_enviado", label: "ORÇAMENTO ENVIADO", className: "bg-violet-500/15 text-violet-600 border-violet-500/40" },
  { id: "aguardando_cliente", label: "AGUARDANDO CLIENTE", className: "bg-slate-500/15 text-slate-600 border-slate-500/40" },
  { id: "bo", label: "B.O 🚨", className: "bg-rose-600/15 text-rose-700 border-rose-600/40" },
];

export const tagDef = (id: string): TagDef =>
  TAGS.find((t) => t.id === id) ?? {
    id,
    label: id.toUpperCase(),
    className: "bg-muted text-muted-foreground border-border",
  };
