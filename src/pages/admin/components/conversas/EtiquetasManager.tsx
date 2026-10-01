import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Users, Lock, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CORES, CORES_SWATCH, recarregarEtiquetas, useEtiquetas, type TagDef } from "./tags";

interface Props { open: boolean; onOpenChange: (v: boolean) => void }

export function EtiquetasManager({ open, onOpenChange }: Props) {
  const tags = useEtiquetas();
  const { user } = useCurrentUser();
  const isAdminOrGestor = !!user?.roles.some((r) => r === "admin" || r === "gestor");
  const [editId, setEditId] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState("sky");
  const [escopo, setEscopo] = useState<"todos" | "pessoal">("pessoal");
  const [salvando, setSalvando] = useState(false);

  const limpar = () => { setEditId(null); setNome(""); setCor("sky"); setEscopo("pessoal"); };
  const editar = (t: TagDef) => { setEditId(t.id); setNome(t.label); setCor(t.cor); setEscopo(t.escopo); };
  const podeMexer = (t: TagDef) => t.owner_id === user?.id || !!isAdminOrGestor;

  const salvar = async () => {
    if (!nome.trim() || !user) return;
    setSalvando(true);
    const payload = { nome: nome.trim(), cor, escopo };
    const { error } = editId
      ? await supabase.from("etiquetas").update(payload).eq("id", editId)
      : await supabase.from("etiquetas").insert({ ...payload, owner_id: user.id });
    setSalvando(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editId ? "Etiqueta atualizada" : "Etiqueta criada");
    limpar();
    recarregarEtiquetas();
  };

  const excluir = async (t: TagDef) => {
    if (!confirm(`Excluir a etiqueta "${t.label}"?`)) return;
    const { error } = await supabase.from("etiquetas").delete().eq("id", t.id);
    if (error) { toast.error(error.message); return; }
    if (editId === t.id) limpar();
    recarregarEtiquetas();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) limpar(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Etiquetas</DialogTitle></DialogHeader>

        <div className="space-y-3 rounded-md border p-3">
          <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da etiqueta" />
          <div className="flex flex-wrap gap-2">
            {Object.keys(CORES).map((c) => (
              <button
                key={c}
                onClick={() => setCor(c)}
                className={`h-6 w-6 rounded-full ${CORES_SWATCH[c]} ${cor === c ? "ring-2 ring-offset-2 ring-foreground" : ""}`}
                aria-label={c}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" size="sm" variant={escopo === "pessoal" ? "default" : "outline"} onClick={() => setEscopo("pessoal")}>
              <Lock className="mr-1 h-3.5 w-3.5" /> Só para mim
            </Button>
            <Button type="button" size="sm" variant={escopo === "todos" ? "default" : "outline"} onClick={() => setEscopo("todos")}>
              <Users className="mr-1 h-3.5 w-3.5" /> Para todos
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {nome.trim() && (
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${CORES[cor]}`}>{nome.trim()}</span>
            )}
            <div className="ml-auto flex gap-2">
              {editId && <Button size="sm" variant="ghost" onClick={limpar}><X className="h-4 w-4" /></Button>}
              <Button size="sm" onClick={salvar} disabled={!nome.trim() || salvando}>
                <Check className="mr-1 h-4 w-4" /> {editId ? "Salvar" : "Criar"}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-h-72 space-y-1 overflow-y-auto">
          {tags.map((t) => (
            <div key={t.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50">
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${t.className}`}>{t.label}</span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                {t.escopo === "todos" ? <><Users className="h-3 w-3" /> Todos</> : <><Lock className="h-3 w-3" /> Só eu</>}
              </span>
              {podeMexer(t) && (
                <div className="ml-auto flex">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => editar(t)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => excluir(t)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
