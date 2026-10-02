import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Lock, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type AppRole = "admin" | "gestor" | "vendedor";
const ROLE_LABEL: Record<AppRole, string> = { admin: "Admin", gestor: "Gestor", vendedor: "Vendedor" };
const RESOURCES: { id: string; label: string; scopable: boolean }[] = [
  { id: "dashboard", label: "Dashboard", scopable: false },
  { id: "radar", label: "Radar", scopable: false },
  { id: "leads", label: "Leads", scopable: true },
  { id: "negociacoes", label: "Negociações", scopable: true },
  { id: "conversas", label: "Conversas WhatsApp", scopable: true },
  { id: "tarefas", label: "Tarefas", scopable: true },
  { id: "comentarios", label: "Comentários", scopable: true },
  { id: "vendedores", label: "Membros/WhatsApp", scopable: false },
  { id: "produtos", label: "Produtos", scopable: false },
  { id: "meta", label: "Meta", scopable: false },
  { id: "permissoes", label: "Permissões", scopable: false },
];

interface Perm { resource: string; can_view: boolean; can_edit: boolean; can_delete: boolean; scope: string }
interface Perfil { id: string; nome: string; base_role: AppRole }
/** "role:admin" para padrão, ou id do perfil personalizado */
type Sel = string;

export function PermissionsMatrix() {
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [sel, setSel] = useState<Sel>("role:admin");
  const [rows, setRows] = useState<Perm[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState<{ open: boolean; editing?: Perfil | undefined }>({ open: false });

  const isRole = sel.startsWith("role:");
  const loadPerfis = async () => {
    const { data } = await supabase.from("perfis").select("id,nome,base_role").order("nome");
    setPerfis((data || []) as Perfil[]);
  };
  const loadRows = async () => {
    setLoading(true);
    const q = isRole
      ? supabase.from("role_permissions").select("*").eq("role", sel.slice(5) as AppRole)
      : supabase.from("perfil_permissoes").select("*").eq("perfil_id", sel);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    setRows((data || []) as Perm[]);
    setLoading(false);
  };
  useEffect(() => { loadPerfis(); }, []);
  useEffect(() => { loadRows(); }, [sel]);

  const update = async (res: string, patch: Partial<Perm>) => {
    const existing = rows.find((r) => r.resource === res);
    const next: Perm = { resource: res, can_view: false, can_edit: false, can_delete: false, scope: "own", ...existing, ...patch };
    setRows((p) => existing ? p.map((r) => r.resource === res ? next : r) : [...p, next]);
    const { error } = isRole
      ? await supabase.from("role_permissions").update(patch).eq("role", sel.slice(5) as AppRole).eq("resource", res)
      : await supabase.from("perfil_permissoes").upsert({ perfil_id: sel, ...next });
    if (error) { toast.error(error.message); loadRows(); }
  };

  const removePerfil = async (p: Perfil) => {
    if (!confirm(`Excluir o perfil "${p.nome}"? Quem usa ele volta para o padrão ${ROLE_LABEL[p.base_role]}.`)) return;
    const { error } = await supabase.from("perfis").delete().eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Perfil excluído");
    setSel("role:admin"); loadPerfis();
  };

  const current = perfis.find((p) => p.id === sel);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {(["admin", "gestor", "vendedor"] as AppRole[]).map((r) => (
          <Button key={r} size="sm" variant={sel === `role:${r}` ? "default" : "outline"} onClick={() => setSel(`role:${r}`)}>
            <Lock className="mr-1 h-3 w-3" />{ROLE_LABEL[r]}
          </Button>
        ))}
        {perfis.map((p) => (
          <Button key={p.id} size="sm" variant={sel === p.id ? "default" : "outline"} onClick={() => setSel(p.id)}>{p.nome}</Button>
        ))}
        <Button size="sm" variant="ghost" onClick={() => setDialog({ open: true })}><Plus className="mr-1 h-4 w-4" />Novo perfil</Button>
      </div>

      {current && (
        <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm">
          <span>Perfil <b>{current.nome}</b> — segurança de dados baseada em <b>{ROLE_LABEL[current.base_role]}</b></span>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" className="h-8 w-8" title="Editar perfil" onClick={() => setDialog({ open: true, editing: current })}><Pencil className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" title="Excluir perfil" onClick={() => removePerfil(current)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
      )}

      {loading ? <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div> : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b text-xs text-muted-foreground">
              <th className="text-left p-2">Área</th><th className="p-2">Ver</th><th className="p-2">Editar</th><th className="p-2">Excluir</th><th className="p-2">Escopo</th>
            </tr>
          </thead>
          <tbody>
            {RESOURCES.map((res) => {
              const row = rows.find((r) => r.resource === res.id);
              if (!row && isRole) return <tr key={res.id} className="border-b"><td className="p-2 font-medium">{res.label}</td><td colSpan={4} className="p-2 text-center text-muted-foreground">—</td></tr>;
              const r = row ?? { resource: res.id, can_view: false, can_edit: false, can_delete: false, scope: "own" };
              return (
                <tr key={res.id} className="border-b hover:bg-muted/30">
                  <td className="p-2 font-medium">{res.label}</td>
                  <td className="p-2 text-center"><Checkbox checked={r.can_view} onCheckedChange={(v) => update(res.id, { can_view: !!v })} /></td>
                  <td className="p-2 text-center"><Checkbox checked={r.can_edit} onCheckedChange={(v) => update(res.id, { can_edit: !!v })} /></td>
                  <td className="p-2 text-center"><Checkbox checked={r.can_delete} onCheckedChange={(v) => update(res.id, { can_delete: !!v })} /></td>
                  <td className="p-2 text-center">
                    {res.scopable ? (
                      <Select value={r.scope} onValueChange={(v) => update(res.id, { scope: v })}>
                        <SelectTrigger className="h-7 text-xs w-28 mx-auto"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="all">Tudo</SelectItem><SelectItem value="own">Só o meu</SelectItem></SelectContent>
                      </Select>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <p className="text-xs text-muted-foreground">
        Os 3 perfis padrão não podem ser excluídos. Perfis novos definem o que a pessoa vê e faz nas telas; a proteção dos dados segue o perfil-base escolhido.
      </p>

      <PerfilDialog
        open={dialog.open}
        editing={dialog.editing}
        onClose={() => setDialog({ open: false })}
        onSaved={(id) => { setDialog({ open: false }); loadPerfis(); setSel(id); }}
      />
    </div>
  );
}

function PerfilDialog({ open, editing, onClose, onSaved }: { open: boolean; editing?: Perfil | undefined; onClose: () => void; onSaved: (id: string) => void }) {
  const [nome, setNome] = useState("");
  const [base, setBase] = useState<AppRole>("vendedor");
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (open) { setNome(editing?.nome ?? ""); setBase(editing?.base_role ?? "vendedor"); } }, [open, editing?.id]);

  const save = async () => {
    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase.from("perfis").update({ nome: nome.trim(), base_role: base }).eq("id", editing.id);
        if (error) throw error;
        onSaved(editing.id);
      } else {
        const { data, error } = await supabase.from("perfis").insert({ nome: nome.trim(), base_role: base }).select("id").single();
        if (error) throw error;
        // copia as permissões do perfil-base como ponto de partida
        const { data: baseRows } = await supabase.from("role_permissions").select("resource,can_view,can_edit,can_delete,scope").eq("role", base);
        if (baseRows?.length) await supabase.from("perfil_permissoes").insert(baseRows.map((r) => ({ ...r, perfil_id: data.id })));
        toast.success("Perfil criado");
        onSaved(data.id);
      }
    } catch (e) { toast.error((e as Error).message); }
    finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editing ? "Editar perfil" : "Novo perfil"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Nome</Label><Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Expedição, Financeiro" autoFocus /></div>
          <div>
            <Label>Baseado em</Label>
            <Select value={base} onValueChange={(v) => setBase(v as AppRole)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="vendedor">Vendedor (vê só o que é dele)</SelectItem>
                <SelectItem value="gestor">Gestor (vê tudo da equipe)</SelectItem>
                <SelectItem value="admin">Admin (acesso total)</SelectItem>
              </SelectContent>
            </Select>
            {!editing && <p className="mt-1 text-xs text-muted-foreground">As permissões começam iguais às do perfil-base e você ajusta depois.</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={save} disabled={saving || !nome.trim()}>{saving ? "Salvando…" : "Salvar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
