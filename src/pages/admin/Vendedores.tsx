import { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, Save, Loader2, Users, KeyRound, Pencil } from "lucide-react";
import { toast } from "sonner";
import { PermissionsMatrix } from "./components/PermissionsMatrix";

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
  const [rows, setRows] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editCred, setEditCred] = useState<Member | null>(null);
  const [editFull, setEditFull] = useState<Member | null>(null);
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>([]);

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
      const { data: em } = await supabase.functions.invoke("list-team-members");
      emailsMap = (em as { emails?: Record<string, string> })?.emails ?? {};
      usersList = (em as { users?: TeamUser[] })?.users ?? [];
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
      if (error) return toast.error(error.message);
    }
    toast.success("Removido");
    setRows((p) => p.filter((r) => r.id !== row.id));
  };

  const activeReceivers = rows.filter((r) => r.ativo && r.recebe_lead);
  const totalPeso = activeReceivers.reduce((s, r) => s + (r.peso || 0), 0);

  const saveAll = async () => {
    if (activeReceivers.length > 0 && totalPeso !== 100) {
      toast.error(`Soma dos pesos dos que recebem lead deve ser 100% (atual: ${totalPeso}%)`);
      return;
    }
    setSaving(true);
    try {
      for (const r of rows) {
        if (!r._dirty || !r.id) continue;
        const raw = toRaw(r.numero_formatado);
        const { error } = await supabase.from("whatsapp_numbers").update({
          nome_vendedor: r.nome_vendedor,
          numero_raw: raw,
          numero_formatado: formatDisplay(raw),
          peso: r.peso,
          ativo: r.ativo,
          recebe_lead: r.recebe_lead,
        }).eq("id", r.id);
        if (error) throw error;

        // Atualiza role se mudou
        if (r.user_id) {
          await supabase.from("user_roles").delete().eq("user_id", r.user_id);
          await supabase.from("user_roles").insert({ user_id: r.user_id, role: r.role });
        }
      }
      toast.success("Salvo");
      try { window.localStorage.removeItem("okp-wa-cache"); } catch {}
      load();
    } catch (e) { toast.error((e as Error).message); }
    finally { setSaving(false); }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Vendedores & WhatsApp</h1>
            <p className="text-sm text-muted-foreground">Gerencie a equipe, o rateio de WhatsApp e as permissões.</p>
          </div>
        </div>

        <Tabs defaultValue="equipe">
          <TabsList>
            <TabsTrigger value="equipe">Equipe</TabsTrigger>
            <TabsTrigger value="permissoes">Permissões</TabsTrigger>
            <TabsTrigger value="rateio">Como funciona o rateio</TabsTrigger>
          </TabsList>

          <TabsContent value="equipe" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Membros da equipe</CardTitle>
                  <CardDescription>
                    Total de peso dos ativos que recebem lead:{" "}
                    <strong className={totalPeso === 100 ? "text-emerald-600" : "text-destructive"}>{totalPeso}%</strong>
                  </CardDescription>
                </div>
                <Button size="sm" onClick={() => setAddOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Adicionar membro
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? <div className="flex justify-center py-8"><Loader2 className="animate-spin"/></div> :
                 rows.length === 0 ? <p className="text-center text-muted-foreground py-6">Nenhum membro. Adicione um vendedor ou gestor.</p> :
                 rows.map((row) => (
                  <div key={row.id} className="p-3 border rounded-lg bg-card space-y-2">
                   <div className="grid grid-cols-1 md:grid-cols-[1fr,1fr,140px,100px,auto,auto,auto,auto] gap-2 items-end">
                    <div>
                      <Label className="text-xs">Nome</Label>
                      <Input value={row.nome_vendedor} onChange={(e) => updateRow(row.id!, { nome_vendedor: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs">WhatsApp</Label>
                      <Input value={row.numero_formatado} onChange={(e) => updateRow(row.id!, { numero_formatado: formatDisplay(e.target.value) })} maxLength={15} />
                    </div>
                    <div>
                      <Label className="text-xs">Papel</Label>
                      <Select value={row.role} onValueChange={(v) => updateRow(row.id!, { role: v as Role, recebe_lead: v !== "gestor", peso: v === "gestor" ? 0 : row.peso })}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="gestor">Gestor</SelectItem>
                          <SelectItem value="vendedor">Vendedor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Peso (%)</Label>
                      <Input type="number" min={0} max={100} value={row.peso} disabled={!row.recebe_lead}
                        onChange={(e) => updateRow(row.id!, { peso: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })} />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Label className="text-xs">Recebe</Label>
                      <Switch checked={row.recebe_lead} onCheckedChange={(v) => updateRow(row.id!, { recebe_lead: v, peso: v ? row.peso : 0 })} />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Label className="text-xs">Ativo</Label>
                      <Switch checked={row.ativo} onCheckedChange={(v) => updateRow(row.id!, { ativo: v })} />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setEditCred(row)} disabled={!row.user_id} title="Editar email/senha">
                      <KeyRound className="h-4 w-4"/>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setEditFull(row)} title="Editar tudo">
                      <Pencil className="h-4 w-4"/>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeRow(row)} className="text-destructive">
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  </div>
                   <div className="text-xs text-muted-foreground pl-1">
                     {row.user_id ? (row.email ? <>Login: <strong className="text-foreground">{row.email}</strong></> : "Sem email vinculado") : "Sem usuário de login"}
                   </div>
                  </div>
                 ))}
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={saveAll} disabled={saving || loading}>
                    {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin"/>Salvando…</> : <><Save className="h-4 w-4 mr-2"/>Salvar alterações</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
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
    </AdminLayout>
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
    if (senha && senha.length < 6) return toast.error("Senha precisa ter no mínimo 6 caracteres");
    setSaving(true);
    try {
      // Caso 1: criar novo login
      if (userId === "new") {
        if (!email || !senha) {
          setSaving(false);
          return toast.error("Informe e-mail e senha para criar o login");
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
        const { data, error: fnErr } = await supabase.functions.invoke("create-team-member", {
          body: { nome, email, password: senha, role, link_whatsapp_id: member.id },
        });
        if (fnErr) throw fnErr;
        if ((data as any)?.error) throw new Error((data as any).error);
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
          const { data, error: fnErr } = await supabase.functions.invoke("update-team-member", { body: credChanges });
          if (fnErr) throw fnErr;
          if ((data as any)?.error) throw new Error((data as any).error);
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
    if (!email && !senha) return toast.error("Informe email ou nova senha");
    if (senha && senha.length < 6) return toast.error("Senha precisa ter no mínimo 6 caracteres");
    setSaving(true);
    try {
      const body: { user_id: string; email?: string; password?: string } = { user_id: member.user_id };
      if (email && email !== member.email) body.email = email;
      if (senha) body.password = senha;
      const { data, error } = await supabase.functions.invoke("update-team-member", { body });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
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
    if (!nome || !email || !senha) return toast.error("Preencha nome, email e senha");
    setSaving(true);
    try {
      const raw = numero ? toRaw(numero) : null;
      const { data, error } = await supabase.functions.invoke("create-team-member", {
        body: {
          nome, email, password: senha, role,
          numero_raw: raw,
          numero_formatado: raw ? formatDisplay(raw) : null,
          peso: role === "gestor" ? 0 : peso,
          recebe_lead: role !== "gestor",
          ativo: true,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
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