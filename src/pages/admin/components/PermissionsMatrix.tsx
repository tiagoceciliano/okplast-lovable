import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type AppRole = "admin" | "gestor" | "vendedor";
const ROLES: AppRole[] = ["admin", "gestor", "vendedor"];
const RESOURCES: { id: string; label: string; scopable: boolean }[] = [
  { id: "leads", label: "Leads", scopable: true },
  { id: "negociacoes", label: "Negociações", scopable: true },
  { id: "tarefas", label: "Tarefas", scopable: true },
  { id: "comentarios", label: "Comentários", scopable: true },
  { id: "vendedores", label: "Vendedores/WhatsApp", scopable: false },
  { id: "dashboard", label: "Dashboard", scopable: false },
];

interface Row {
  role: AppRole;
  resource: string;
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
  scope: string;
}

export function PermissionsMatrix() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("role_permissions").select("*");
    if (error) toast.error(error.message);
    setRows(((data || []) as Row[]));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const get = (role: AppRole, res: string) =>
    rows.find((r) => r.role === role && r.resource === res);

  const update = async (role: AppRole, res: string, patch: Partial<Row>) => {
    const key = `${role}-${res}`;
    setSaving(key);
    setRows((p) => p.map((r) => (r.role === role && r.resource === res ? { ...r, ...patch } : r)));
    const { error } = await supabase.from("role_permissions").update(patch).eq("role", role).eq("resource", res);
    if (error) { toast.error(error.message); load(); }
    setSaving(null);
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Área</th>
            {ROLES.map((r) => (
              <th key={r} colSpan={4} className="p-2 border-l capitalize text-center">{r}</th>
            ))}
          </tr>
          <tr className="border-b text-xs text-muted-foreground">
            <th></th>
            {ROLES.map((r) => (
              <>
                <th key={`${r}-v`} className="p-1 border-l">Ver</th>
                <th key={`${r}-e`} className="p-1">Editar</th>
                <th key={`${r}-d`} className="p-1">Excluir</th>
                <th key={`${r}-s`} className="p-1">Escopo</th>
              </>
            ))}
          </tr>
        </thead>
        <tbody>
          {RESOURCES.map((res) => (
            <tr key={res.id} className="border-b hover:bg-muted/30">
              <td className="p-2 font-medium">{res.label}</td>
              {ROLES.map((role) => {
                const row = get(role, res.id);
                if (!row) return <td key={role} colSpan={4} className="p-2 text-center text-muted-foreground border-l">—</td>;
                return (
                  <>
                    <td key={`${role}-v`} className="p-2 text-center border-l">
                      <Checkbox checked={row.can_view} onCheckedChange={(v) => update(role, res.id, { can_view: !!v })} />
                    </td>
                    <td key={`${role}-e`} className="p-2 text-center">
                      <Checkbox checked={row.can_edit} onCheckedChange={(v) => update(role, res.id, { can_edit: !!v })} />
                    </td>
                    <td key={`${role}-d`} className="p-2 text-center">
                      <Checkbox checked={row.can_delete} onCheckedChange={(v) => update(role, res.id, { can_delete: !!v })} />
                    </td>
                    <td key={`${role}-s`} className="p-2 text-center">
                      {res.scopable ? (
                        <Select value={row.scope} onValueChange={(v) => update(role, res.id, { scope: v })}>
                          <SelectTrigger className="h-7 text-xs w-24 mx-auto"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tudo</SelectItem>
                            <SelectItem value="own">Só o meu</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                  </>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-muted-foreground mt-3">
        As permissões controlam o que aparece na interface. A segurança final é feita no banco: mesmo se um vendedor tentar acessar direto, o banco bloqueia.
      </p>
    </div>
  );
}