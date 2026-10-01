import { useEffect, useMemo, useState } from "react";
import { ConfiguracoesLayout } from "./components/ConfiguracoesLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Folder, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { listTeamMembers, type TeamUserRow } from "@/lib/list-team-members.functions";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";

interface Group { id: string; nome: string; cor: string; members: string[] }
const COLORS = ["red", "sky", "emerald", "amber", "violet"] as const;
const folderColor: Record<string, string> = { red: "text-red-500", sky: "text-sky-600", emerald: "text-emerald-600", amber: "text-amber-500", violet: "text-violet-600" };
const avatarColors = ["bg-emerald-100 text-emerald-700", "bg-violet-100 text-violet-700", "bg-amber-100 text-amber-700", "bg-sky-100 text-sky-700"];

export default function Grupos() {
  const { user } = useCurrentUser();
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<TeamUserRow[]>([]);
  const [busca, setBusca] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Group | null>(null);
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState<string>("emerald");
  const [members, setMembers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const isManager = !!user?.roles.some((role) => role === "admin" || role === "gestor");

  const load = async () => {
    const [{ data: groupRows, error }, { data: links }] = await Promise.all([
      supabase.from("team_groups").select("id,nome,cor").order("nome"),
      supabase.from("team_group_members").select("group_id,user_id"),
    ]);
    if (error) toast.error(error.message);
    setGroups((groupRows ?? []).map((group) => ({ ...group, members: (links ?? []).filter((link) => link.group_id === group.id).map((link) => link.user_id) })));
    try { const team = await listTeamMembers(); setUsers(team.users); } catch { setUsers([]); }
  };
  useEffect(() => { load(); }, []);
  const filtered = useMemo(() => groups.filter((group) => group.nome.toLowerCase().includes(busca.toLowerCase())), [groups, busca]);
  const abrir = (group?: Group) => { setEditing(group ?? null); setNome(group?.nome ?? ""); setCor(group?.cor ?? "emerald"); setMembers(group?.members ?? []); setOpen(true); };
  const save = async () => {
    if (!user || !nome.trim()) return;
    setSaving(true);
    let groupId = editing?.id;
    if (editing) {
      const { error } = await supabase.from("team_groups").update({ nome: nome.trim(), cor }).eq("id", editing.id);
      if (error) { toast.error(error.message); setSaving(false); return; }
    } else {
      const { data, error } = await supabase.from("team_groups").insert({ nome: nome.trim(), cor, created_by: user.id }).select("id").single();
      if (error || !data) { toast.error(error?.message ?? "Não foi possível criar o grupo"); setSaving(false); return; }
      groupId = data.id;
    }
    if (!groupId) { setSaving(false); return; }
    const { error: removeError } = await supabase.from("team_group_members").delete().eq("group_id", groupId);
    if (removeError) { toast.error(removeError.message); setSaving(false); return; }
    if (members.length) {
      const { error } = await supabase.from("team_group_members").insert(members.map((userId) => ({ group_id: groupId, user_id: userId })));
      if (error) { toast.error(error.message); setSaving(false); return; }
    }
    toast.success(editing ? "Grupo atualizado" : "Grupo criado"); setSaving(false); setOpen(false); await load();
  };
  const remove = async (group: Group) => {
    if (!confirm(`Excluir o grupo “${group.nome}”?`)) return;
    const { error } = await supabase.from("team_groups").delete().eq("id", group.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Grupo excluído"); await load();
  };

  return <ConfiguracoesLayout active="grupos">
    <div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-bold">Grupos</h2>{isManager && <Button size="sm" variant="outline" onClick={() => abrir()}><Plus className="h-4 w-4" /> Novo grupo</Button>}</div>
    <div className="relative mb-4"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar por nome" className="h-10 border-primary pl-9" /></div>
    <div className="mb-2 inline-flex h-8 items-center rounded-md border bg-card px-3 text-xs">Tudo</div>
    <div className="overflow-hidden rounded-md border bg-card">
      {filtered.map((group) => <div key={group.id} className="grid min-h-12 grid-cols-[minmax(0,1fr)_minmax(140px,1fr)_auto] items-center border-b px-3 last:border-b-0 hover:bg-muted/35">
        <div className="flex items-center gap-3"><Folder className={`h-4 w-4 fill-current ${folderColor[group.cor] ?? "text-muted-foreground"}`} /><span className="text-sm font-medium">{group.nome}</span></div>
        <div className="flex -space-x-1.5">{group.members.slice(0, 6).map((id, index) => { const member = users.find((item) => item.id === id); return <Avatar key={id} className="h-6 w-6 border-2 border-card"><AvatarFallback className={`text-[9px] font-bold ${avatarColors[index % avatarColors.length]}`}>{(member?.nome || member?.email || "?").charAt(0).toUpperCase()}</AvatarFallback></Avatar>; })}</div>
        {isManager && <div className="flex"><Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => abrir(group)} aria-label={`Editar ${group.nome}`}><Pencil className="h-3.5 w-3.5" /></Button><Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(group)} aria-label={`Excluir ${group.nome}`}><Trash2 className="h-3.5 w-3.5" /></Button></div>}
      </div>)}
      {!filtered.length && <p className="p-8 text-center text-sm text-muted-foreground">Nenhum grupo encontrado.</p>}
    </div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? "Editar grupo" : "Novo grupo"}</DialogTitle></DialogHeader><div className="space-y-4"><div><Label>Nome</Label><Input value={nome} onChange={(e) => setNome(e.target.value)} autoFocus /></div><div><Label>Cor</Label><div className="mt-2 flex gap-2">{COLORS.map((item) => <Button key={item} variant="ghost" size="icon" className={`h-8 w-8 rounded-full ${cor === item ? "ring-2 ring-ring ring-offset-2" : ""}`} onClick={() => setCor(item)}><span className={`h-5 w-5 rounded-full ${folderColor[item]?.replace("text-", "bg-")}`} /></Button>)}</div></div><div><Label>Membros</Label><div className="mt-2 max-h-60 space-y-1 overflow-y-auto rounded-md border p-2">{users.map((item) => <label key={item.id} className="flex cursor-pointer items-center gap-3 rounded px-2 py-2 hover:bg-muted"><Checkbox checked={members.includes(item.id)} onCheckedChange={(checked) => setMembers((current) => checked ? [...current, item.id] : current.filter((id) => id !== item.id))} /><span className="text-sm">{item.nome || item.email || "Sem nome"}</span><span className="ml-auto text-xs text-muted-foreground">{item.email}</span></label>)}</div></div></div><DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={save} disabled={saving || !nome.trim()}>{saving ? "Salvando…" : "Salvar"}</Button></DialogFooter></DialogContent></Dialog>
  </ConfiguracoesLayout>;
}