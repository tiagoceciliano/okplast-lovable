import { useMemo, useState } from "react";
import { ConfiguracoesLayout } from "./components/ConfiguracoesLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Pencil, Trash2, Users, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CORES, CORES_SWATCH, recarregarEtiquetas, useEtiquetas, type TagDef } from "./components/conversas/tags";
import { toast } from "sonner";

export default function Tags() {
  const tags = useEtiquetas();
  const { user } = useCurrentUser();
  const [busca, setBusca] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TagDef | null>(null);
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState("sky");
  const [escopo, setEscopo] = useState<"todos" | "pessoal">("todos");
  const [saving, setSaving] = useState(false);
  const [aplica, setAplica] = useState<("conversa" | "negociacao")[]>(["conversa", "negociacao"]);
  const [filtro, setFiltro] = useState("tudo");
  const isManager = !!user?.roles.some((role) => role === "admin" || role === "gestor");
  const filtradas = useMemo(() => tags.filter((tag) => tag.label.toLowerCase().includes(busca.trim().toLowerCase()) && (filtro === "tudo" || tag.aplica_em.includes(filtro as "conversa"))), [tags, busca, filtro]);

  const abrir = (tag?: TagDef) => {
    setEditing(tag ?? null); setNome(tag?.label ?? ""); setCor(tag?.cor ?? "sky"); setEscopo(tag?.escopo ?? "todos"); setAplica(tag?.aplica_em ?? ["conversa", "negociacao"]); setOpen(true);
  };
  const salvar = async () => {
    if (!user || !nome.trim()) return;
    if (!aplica.length) { toast.error("Escolha onde a tag pode ser usada"); return; }
    setSaving(true);
    const payload = { nome: nome.trim(), cor, escopo, aplica_em: aplica };
    const { error } = editing
      ? await supabase.from("etiquetas").update(payload).eq("id", editing.id)
      : await supabase.from("etiquetas").insert({ ...payload, owner_id: user.id });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editing ? "Tag atualizada" : "Tag criada"); setOpen(false); await recarregarEtiquetas();
  };
  const excluir = async (tag: TagDef) => {
    if (!confirm(`Excluir a tag “${tag.label}”?`)) return;
    const { error } = await supabase.from("etiquetas").delete().eq("id", tag.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Tag excluída"); await recarregarEtiquetas();
  };

  return <ConfiguracoesLayout active="tags">
    <div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-bold">Tags</h2><Button size="sm" variant="outline" onClick={() => abrir()}><Plus className="h-4 w-4" /> Nova tag</Button></div>
    <div className="relative mb-4"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar por nome" className="h-10 border-primary pl-9" /></div>
    <Select value={filtro} onValueChange={setFiltro}><SelectTrigger className="mb-2 h-8 w-40 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="tudo">Tudo</SelectItem><SelectItem value="conversa">Conversa</SelectItem><SelectItem value="negociacao">Negociação</SelectItem></SelectContent></Select>
    <div className="overflow-hidden rounded-md border bg-card">
      {filtradas.map((tag) => { const allowed = isManager || tag.owner_id === user?.id; return <div key={tag.id} className="flex min-h-11 items-center border-b px-3 last:border-b-0 hover:bg-muted/35">
        <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${tag.className}`}>{tag.label}</span>
        <span className="ml-4 flex gap-1">{tag.aplica_em.map((a) => <span key={a} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{a === "conversa" ? "Conversa" : "Negociação"}</span>)}</span>
        <span className="ml-auto mr-5 flex items-center gap-1.5 text-xs text-muted-foreground">{tag.escopo === "todos" ? <><Users className="h-3.5 w-3.5" /> OK Plast</> : <><Lock className="h-3.5 w-3.5" /> Pessoal</>}</span>
        {allowed && <div className="flex gap-1"><Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => abrir(tag)} aria-label={`Editar ${tag.label}`}><Pencil className="h-3.5 w-3.5" /></Button><Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => excluir(tag)} aria-label={`Excluir ${tag.label}`}><Trash2 className="h-3.5 w-3.5" /></Button></div>}
      </div>; })}
      {!filtradas.length && <p className="p-8 text-center text-sm text-muted-foreground">Nenhuma tag encontrada.</p>}
    </div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? "Editar tag" : "Nova tag"}</DialogTitle></DialogHeader><div className="space-y-4"><div><Label>Nome</Label><Input value={nome} onChange={(e) => setNome(e.target.value)} autoFocus /></div><div><Label>Cor</Label><div className="mt-2 flex flex-wrap gap-3">{Object.keys(CORES).map((item) => <Button key={item} type="button" variant="ghost" size="icon" className={`h-8 w-8 rounded-full ${cor === item ? "ring-2 ring-ring ring-offset-2" : ""}`} onClick={() => setCor(item)} aria-label={`Cor ${item}`}><span className={`h-5 w-5 rounded-full ${CORES_SWATCH[item]}`} /></Button>)}</div></div><div><Label>Visibilidade</Label><Select value={escopo} onValueChange={(value) => setEscopo(value as "todos" | "pessoal")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todos">Todos da empresa</SelectItem><SelectItem value="pessoal">Somente eu</SelectItem></SelectContent></Select></div><div><Label>Usar em</Label><div className="mt-2 flex gap-4">{(["conversa", "negociacao"] as const).map((a) => <label key={a} className="flex items-center gap-2 text-sm"><Checkbox checked={aplica.includes(a)} onCheckedChange={(v) => setAplica((prev) => v ? [...prev, a] : prev.filter((x) => x !== a))} />{a === "conversa" ? "Conversa" : "Negociação"}</label>)}</div></div></div><DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={salvar} disabled={saving || !nome.trim()}>{saving ? "Salvando…" : "Salvar"}</Button></DialogFooter></DialogContent></Dialog>
  </ConfiguracoesLayout>;
}