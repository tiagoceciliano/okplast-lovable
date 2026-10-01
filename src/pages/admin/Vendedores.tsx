import { useEffect, useState } from "react";
import { useSearchParams } from "@/lib/router-compat";
import { ConfiguracoesLayout } from "./components/ConfiguracoesLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, Loader2, KeyRound, Pencil, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { PermissionsMatrix } from "./components/PermissionsMatrix";
import { listTeamMembers } from "@/lib/list-team-members.functions";
import { createTeamMember } from "@/lib/create-team-member.functions";
import { updateTeamMember } from "@/lib/update-team-member.functions";

type Role = "admin" | "gestor" | "vendedor";

interface Member {
  id?: string; // whatsapp_numbers.id
  user_id: string | null;
  email: string | null;
  role: Role;
  nome_vendedor: string;
  numero_formatado: string;
  numero_raw: string;
  peso: number;
  ativo: boolean;
  recebe_lead: boolean;
  _dirty?: boolean;
}

interface TeamUser {
  id: string;
  email: string | null;
  nome: string | null;
}

function formatDisplay(digits: string): string {
  const d = digits.replace(/\D/g, "").replace(/^55/, "");
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
}
const toRaw = (f: string) => { const d = f.replace(/\D/g, ""); return d.startsWith("55") ? d : `55${d}`; };

export default function Vendedores() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "equipe";
  const setTab = (v: string) => {
    const next = new URLSearchParams(searchParams);
    if (v === "equipe") next.delete("tab"); else next.set("tab", v);
    setSearchParams(next, { replace: true });
  };
  const [rows, setRows] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editCred, setEditCred] = useState<Member | null>(null);
  const [editFull, setEditFull] = useState<Member | null>(null);
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>([]);
  const [busca, setBusca] = useState("");

  const load = async () => {
    setLoading(true);
    // whatsapp_numbers com user vinculado
    const { data: wa } = await supabase
      .from("whatsapp_numbers")
      .select("*")
      .order("created_at");

    // pega roles para cada user_id conhecido
    const userIds = (wa || []).map((w) => w.user_id).filter(Boolean) as string[];
    let rolesMap: Record<string, Role> = {};
    if (userIds.length > 0) {
      const { data: rs } = await supabase.from("user_roles").select("user_id,role").in("user_id", userIds);
      (rs || []).forEach((r: { user_id: string; role: string }) => {
        // prioridade admin > gestor > vendedor
        const cur = rolesMap[r.user_id];
        const prio = (x: string) => (x === "admin" ? 3 : x === "gestor" ? 2 : 1);
        if (!cur || prio(r.role) > prio(cur)) rolesMap[r.user_id] = r.role as Role;
      });
    }

    // busca emails via edge function (admin API)
    let emailsMap: Record<string, string> = {};
    let usersList: TeamUser[] = [];
    try {
      const em = await listTeamMembers();
      emailsMap = em.emails ?? {};
      usersList = (em.users ?? []) as TeamUser[];
    } catch { /* silencioso */ }
    setTeamUsers(usersList);

    const members: Member[] = (wa || []).map((w) => ({
      id: w.id,
      user_id: w.user_id,
      email: w.user_id ? emailsMap[w.user_id] ?? null : null,
      role: (w.user_id ? rolesMap[w.user_id] : "vendedor") || "vendedor",
      nome_vendedor: w.nome_vendedor,
      numero_formatado: w.numero_formatado,
      numero_raw: w.numero_raw,
      peso: w.peso,
      ativo: w.ativo,
      recebe_lead: (w as any).recebe_lead ?? true,
    }));
    setRows(members);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const updateRow = (id: string, patch: Partial<Member>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch, _dirty: true } : r)));
  };

  const removeRow = async (row: Member) => {
    if (!confirm(`Remover ${row.nome_vendedor}?`)) return;
    if (row.id) {
      const { error } = await supabase.from("whatsapp_numbers").delete().eq("id", row.id);
      if (error) { toast.error(error.message); return; }
    }
    toast.success("Removido");
    setRows((p) => p.filter((r) => r.id !== row.id));
  };

  const activeReceivers = rows.filter((r) => r.ativo && r.recebe_lead);
  const totalPeso = activeReceivers.reduce((s, r) => s + (r.peso || 0), 0);

  const filteredRows = rows.filter((row) => `${row.nome_vendedor} ${row.email ?? ""}`.toLowerCase().includes(busca.trim().toLowerCase()));
  const roleLabel = (role: Role) => role === "admin" ? "PROPRIETÁRIO" : role === "gestor" ? "GERENTE" : "VENDEDOR";

  return (
    <ConfiguracoesLayout active={tab === "permissoes" ? "permissoes" : "membros"}>
      <div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="sr-only"><TabsTrigger value="equipe">Equipe</TabsTrigger><TabsTrigger value="permissoes">Permissões</TabsTrigger><TabsTrigger value="rateio">Rateio</TabsTrigger></TabsList>

          <TabsContent value="equipe" className="space-y-4">
            <div className="mb-3 flex items-center justify-between"><h1 className="text-xl font-bold">Membros</h1><Button size="sm" variant="outline" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Convidar membro</Button></div>
            <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar por nome ou e-mail" className="h-10 border-primary pl-9" /></div>
            <div className="flex items-center justify-between"><div className="inline-flex h-8 items-center rounded-md border bg-card px-3 text-xs">Tudo</div><p className="text-xs text-muted-foreground">Rateio ativo: <strong className={totalPeso === 100 ? "text-emerald-600" : "text-destructive"}>{totalPeso}%</strong></p></div>
            <div className="overflow-hidden rounded-md border bg-card">
                {loading ? <div className="flex justify-center py-8"><Loader2 className="animate-spin"/></div> :
                 filteredRows.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">Nenhum membro encontrado.</p> :
                 filteredRows.map((row, index) => (
                   <div key={row.id} className="grid min-h-12 grid-cols-[minmax(0,1.2fr)_minmax(120px,.8fr)_90px_auto] items-center gap-3 border-b px-3 last:border-b-0 hover:bg-muted/35">
                     <div className="flex min-w-0 items-center gap-3"><Avatar className="h-7 w-7"><AvatarFallback className={index % 2 ? "bg-amber-100 text-amber-700 text-[10px]" : "bg-violet-100 text-violet-700 text-[10px]"}>{row.nome_vendedor.charAt(0).toUpperCase()}</AvatarFallback></Avatar><div className="min-w-0"><p className="truncate text-sm font-medium">{row.nome_vendedor}</p><p className="truncate text-[10px] text-muted-foreground">{row.email || "Sem e-mail de login"}</p></div></div>
                     <span className="w-fit rounded bg-muted px-2 py-0.5 text-[10px] font-medium">{roleLabel(row.role)}</span>
                     <span className={row.ativo ? "text-xs font-semibold text-emerald-600" : "text-xs text-muted-foreground"}>{row.ativo ? "Online" : "Inativo"}</span>
                     <div className="flex"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditCred(row)} disabled={!row.user_id} title="Editar e-mail e senha"><KeyRound className="h-3.5 w-3.5"/></Button><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditFull(row)} title="Editar membro"><Pencil className="h-3.5 w-3.5"/></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeRow(row)} title="Remover"><Trash2 className="h-3.5 w-3.5"/></Button></div>
                   </div>
                 ))}
            </div>
          </TabsContent>

          <TabsContent value="permissoes">
            <Card>
              <CardHeader>
                <CardTitle>Permissões por papel</CardTitle>
                <CardDescription>Defina o que cada papel pode ver, editar e excluir. "Só o meu" restringe às negociações onde o usuário é responsável.</CardDescription>
              </CardHeader>
              <CardContent><PermissionsMatrix /></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rateio">
            <Card>
              <CardHeader>
                <CardTitle>Como funciona o rateio</CardTitle>
                <CardDescription>
                  O sorteio é <strong>sticky por visitante</strong>: na primeira interação o cliente é atribuído a um vendedor
                  (respeitando a % de rateio) e a partir daí sempre fala com o mesmo. Para testar diferentes números use aba anônima.<br/><br/>
                  A soma dos pesos <strong>ativos que recebem lead</strong> deve totalizar <strong>100%</strong>.<br/>
                  Gestores podem ter número cadastrado apenas para referência (chave "Recebe" desligada) — eles não entram no rateio.
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddMemberDialog open={addOpen} onOpenChange={setAddOpen} onCreated={load} />
      <EditCredentialsDialog member={editCred} onClose={() => setEditCred(null)} onSaved={load} />
      <EditMemberDialog member={editFull} users={teamUsers} onClose={() => setEditFull(null)} onSaved={load} />
    </ConfiguracoesLayout>
  );
}

function EditMemberDialog({ member, users, onClose, onSaved }: { member: Member | null; users: TeamUser[]; onClose: () => void; onSaved: () => void }) {
  const [nome, setNome] = useState("");
  const [userId, setUserId] = useState<string>("none");
  const [numero, setNumero] = useState("");
  const [role, setRole] = useState<Role>("vendedor");
  const [peso, setPeso] = useState(0);
  const [ativo, setAtivo] = useState(true);
  const [recebe, setRecebe] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!member) return;
    setNome(member.nome_vendedor);
    setUserId(member.user_id ?? "new");
    setNumero(member.numero_formatado);
    setRole(member.role);
    setPeso(member.peso);
    setAtivo(member.ativo);
    setRecebe(member.recebe_lead);
    setEmail(member.email ?? "");
    setSenha("");
  }, [member?.id]);

  const submit = async () => {
    if (!member?.id) return;
    if (senha && senha.length < 6) { toast.error("Senha precisa ter no mínimo 6 caracteres"); return; }
    setSaving(true);
    try {
      // Caso 1: criar novo login
      if (userId === "new") {
        if (!email || !senha) {
          setSaving(false);
          { toast.error("Informe e-mail e senha para criar o login"); return; }
        }
        const raw = numero ? toRaw(numero) : member.numero_raw;
        // Atualiza whatsapp_numbers primeiro (dados do form) — sem tocar user_id
        const { error: upErr } = await supabase.from("whatsapp_numbers").update({
          nome_vendedor: nome,
          numero_raw: raw,
          numero_formatado: formatDisplay(raw),
          peso: role === "gestor" ? 0 : peso,
          ativo,
          recebe_lead: role === "gestor" ? false : recebe,
        }).eq("id", member.id);
        if (upErr) throw upErr;
        await createTeamMember({
          data: { nome, email, password: senha, role, link_whatsapp_id: member.id ?? null },
        });
        toast.success("Login criado e vinculado");
        try { window.localStorage.removeItem("okp-wa-cache"); } catch {}
        onClose();
        onSaved();
        return;
      }

      const nextUserId = userId === "none" ? null : userId;
      const selectedUser = users.find((u) => u.id === nextUserId);
      const raw = numero ? toRaw(numero) : member.numero_raw;
      const { error } = await supabase.from("whatsapp_numbers").update({
        user_id: nextUserId,
        nome_vendedor: nome,
        numero_raw: raw,
        numero_formatado: formatDisplay(raw),
        peso: role === "gestor" ? 0 : peso,
        ativo,
        recebe_lead: role === "gestor" ? false : recebe,
      }).eq("id", member.id);
      if (error) throw error;

      if (nextUserId) {
        await supabase.from("user_roles").delete().eq("user_id", nextUserId);
        await supabase.from("user_roles").insert({ user_id: nextUserId, role });
        const credChanges: { user_id: string; email?: string; password?: string } = { user_id: nextUserId };
        if (email && email !== (selectedUser?.email ?? member.email)) credChanges.email = email;
        if (senha) credChanges.password = senha;
        if (credChanges.email || credChanges.password) {
          await updateTeamMember({ data: credChanges });
        }
      }

      toast.success("Salvo");
      try { window.localStorage.removeItem("okp-wa-cache"); } catch {}
      onClose();
      onSaved();
    } catch (e) { toast.error((e as Error).message); }
    finally { setSaving(false); }
  };

  return (
    <Dialog open={!!member} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Editar membro — {member?.nome_vendedor}</DialogTitle></DialogHeader>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          <div><Label>Nome</Label><Input value={nome} onChange={(e) => setNome(e.target.value)} /></div>
          <div>
            <Label>Usuário de login vinculado</Label>
            <Select value={userId} onValueChange={(v) => {
              setUserId(v);
              if (v === "new") { setEmail(""); setSenha(""); return; }
              if (v === "none") { setEmail(""); setSenha(""); return; }
              const selected = users.find((u) => u.id === v);
              if (selected?.email) setEmail(selected.email);
            }}>
              <SelectTrigger><SelectValue placeholder="Selecione o login" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Criar novo login</SelectItem>
                <SelectItem value="none">Sem usuário de login</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.nome ? `${u.nome} — ` : ""}{u.email ?? u.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div><Label>WhatsApp</Label><Input value={numero} onChange={(e) => setNumero(formatDisplay(e.target.value))} maxLength={15} /></div>
          <div>
            <Label>Papel</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="gestor">Gestor</SelectItem>
                <SelectItem value="vendedor">Vendedor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {role !== "gestor" && (
            <div><Label>Peso do rateio (%)</Label><Input type="number" min={0} max={100} value={peso} onChange={(e) => setPeso(Math.max(0, Math.min(100, Number(e.target.value) || 0)))} /></div>
          )}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm"><Switch checked={ativo} onCheckedChange={setAtivo}/> Ativo</label>
            {role !== "gestor" && (
              <label className="flex items-center gap-2 text-sm"><Switch checked={recebe} onCheckedChange={setRecebe}/> Recebe lead</label>
            )}
          </div>
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-2">Credenciais de login (somente admin)</p>
            <div className="space-y-3">
              <div><Label>E-mail</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={userId === "none"} /></div>
              <div>
                <Label>{userId === "new" ? "Senha" : "Nova senha"}</Label>
                <Input type="text" value={senha} onChange={(e) => setSenha(e.target.value)}
                  placeholder={userId === "new" ? "Mínimo 6 caracteres" : "Deixe em branco para manter"}
                  disabled={userId === "none"} />
              </div>
              {userId === "none" && <p className="text-xs text-muted-foreground">Este membro ficará sem acesso ao admin. Escolha "Criar novo login" ou um usuário existente para dar acesso.</p>}
              {userId === "new" && <p className="text-xs text-muted-foreground">Um novo usuário será criado com este e-mail e senha, e vinculado a este membro.</p>}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin"/> : "Salvar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditCredentialsDialog({ member, onClose, onSaved }: { member: Member | null; onClose: () => void; onSaved: () => void }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEmail(member?.email ?? "");
    setSenha("");
  }, [member?.user_id]);

  const submit = async () => {
    if (!member?.user_id) return;
    if (!email && !senha) { toast.error("Informe email ou nova senha"); return; }
    if (senha && senha.length < 6) { toast.error("Senha precisa ter no mínimo 6 caracteres"); return; }
    setSaving(true);
    try {
      const body: { user_id: string; email?: string; password?: string } = { user_id: member.user_id };
      if (email && email !== member.email) body.email = email;
      if (senha) body.password = senha;
      await updateTeamMember({ data: body });
      toast.success("Credenciais atualizadas");
      onClose();
      onSaved();
    } catch (e) { toast.error((e as Error).message); }
    finally { setSaving(false); }
  };

  return (
    <Dialog open={!!member} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Editar credenciais — {member?.nome_vendedor}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>E-mail de login</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div>
            <Label>Nova senha</Label>
            <Input type="text" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Deixe em branco para manter" />
            <p className="text-xs text-muted-foreground mt-1">Mínimo 6 caracteres. Somente admin pode alterar.</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin"/> : "Salvar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddMemberDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (o: boolean) => void; onCreated: () => void }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState<Role>("vendedor");
  const [numero, setNumero] = useState("");
  const [peso, setPeso] = useState(0);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!nome || !email || !senha) { toast.error("Preencha nome, email e senha"); return; }
    setSaving(true);
    try {
      const raw = numero ? toRaw(numero) : null;
      await createTeamMember({
        data: {
          nome, email, password: senha, role,
          numero_raw: raw,
          numero_formatado: raw ? formatDisplay(raw) : null,
          peso: role === "gestor" ? 0 : peso,
          recebe_lead: role !== "gestor",
          ativo: true,
        },
      });
      toast.success("Membro criado");
      onOpenChange(false);
      setNome(""); setEmail(""); setSenha(""); setNumero(""); setPeso(0); setRole("vendedor");
      onCreated();
    } catch (e) { toast.error((e as Error).message); }
    finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Adicionar membro</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Nome</Label><Input value={nome} onChange={(e) => setNome(e.target.value)} /></div>
          <div><Label>E-mail</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><Label>Senha inicial</Label><Input type="text" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Mínimo 6 caracteres" /></div>
          <div>
            <Label>Papel</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="gestor">Gestor</SelectItem>
                <SelectItem value="vendedor">Vendedor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>WhatsApp (opcional)</Label><Input value={numero} onChange={(e) => setNumero(formatDisplay(e.target.value))} placeholder="(21) 99999-9999" maxLength={15} /></div>
          {role !== "gestor" && (
            <div><Label>Peso do rateio (%)</Label><Input type="number" min={0} max={100} value={peso} onChange={(e) => setPeso(Number(e.target.value) || 0)} /></div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin"/> : "Criar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}