import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TagDef {
  id: string;
  label: string;
  className: string;
  cor: string;
  escopo: "todos" | "pessoal";
  owner_id: string | null;
  aplica_em: ("conversa" | "negociacao")[];
}

export const CORES: Record<string, string> = {
  red: "bg-red-500/15 text-red-600 border-red-500/40",
  amber: "bg-amber-500/15 text-amber-600 border-amber-500/40",
  emerald: "bg-emerald-500/15 text-emerald-600 border-emerald-500/40",
  sky: "bg-sky-500/15 text-sky-600 border-sky-500/40",
  violet: "bg-violet-500/15 text-violet-600 border-violet-500/40",
  rose: "bg-rose-600/15 text-rose-700 border-rose-600/40",
  orange: "bg-orange-500/15 text-orange-600 border-orange-500/40",
  slate: "bg-slate-500/15 text-slate-600 border-slate-500/40",
};
export const CORES_SWATCH: Record<string, string> = {
  red: "bg-red-500", amber: "bg-amber-500", emerald: "bg-emerald-500", sky: "bg-sky-500",
  violet: "bg-violet-500", rose: "bg-rose-600", orange: "bg-orange-500", slate: "bg-slate-500",
};

let cache: TagDef[] = [];
let carregado = false;
let inflight: Promise<void> | null = null;
const listeners = new Set<(t: TagDef[]) => void>();

export function recarregarEtiquetas() {
  if (inflight) return inflight;
  inflight = carregarEtiquetas().finally(() => { inflight = null; });
  return inflight;
}

async function carregarEtiquetas() {
  const { data } = await supabase.from("etiquetas").select("*").order("created_at");
  cache = (data || []).map((e) => ({
    id: e.id,
    label: e.nome,
    cor: e.cor,
    className: CORES[e.cor] ?? CORES["slate"]!,
    escopo: e.escopo as TagDef["escopo"],
    owner_id: e.owner_id,
    aplica_em: (e.aplica_em ?? ["conversa", "negociacao"]) as TagDef["aplica_em"],
  }));
  carregado = true;
  listeners.forEach((l) => l(cache));
}

export function useEtiquetas() {
  const [tags, setTags] = useState<TagDef[]>(cache);
  useEffect(() => {
    listeners.add(setTags);
    if (!carregado) recarregarEtiquetas();
    return () => { listeners.delete(setTags); };
  }, []);
  return tags;
}

export const tagDef = (id: string, lista: TagDef[] = cache): TagDef =>
  lista.find((t) => t.id === id) ?? {
    id,
    label: id.toUpperCase(),
    className: "bg-muted text-muted-foreground border-border",
    cor: "slate",
    escopo: "todos",
    owner_id: null,
    aplica_em: ["conversa", "negociacao"],
  };

export const tagsDe = (lista: TagDef[], tipo: "conversa" | "negociacao") => lista.filter((t) => t.aplica_em.includes(tipo));
