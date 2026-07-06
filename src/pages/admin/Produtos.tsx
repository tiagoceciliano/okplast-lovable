import { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Package, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";

interface Produto {
  id: string;
  nome: string;
  preco: number;
  material: string | null;
  ativo: boolean;
}

export default function Produtos() {
  const { can } = usePermissions();
  const [rows, setRows] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const podeEditar = can("vendedores", "edit");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("produtos").select("*").order("nome");
    if (error) toast.error(error.message);
    setRows((data as Produto[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const salvar = async (p: Produto) => {
    const { error } = await supabase.from("produtos").update({
      nome: p.nome, preco: p.preco, material: p.material, ativo: p.ativo,
    }).eq("id", p.id);
    if (error) toast.error(error.message);
    else toast.success("Salvo");
  };

  const remover = async (id: string) => {
    if (!confirm("Excluir este produto?")) return;
    const { error } = await supabase.from("produtos").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows((p) => p.filter((r) => r.id !== id));
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-primary" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Produtos</h1>
            <p className="text-sm text-muted-foreground">Catálogo interno usado nas negociações.</p>
          </div>
          {podeEditar && (
            <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" />Novo produto</Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cadastros</CardTitle>
            <CardDescription>Cadastre nome do produto, material e preço de referência.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? <div className="flex justify-center py-8"><Loader2 className="animate-spin"/></div> :
             rows.length === 0 ? <p className="text-center text-muted-foreground py-6">Nenhum produto cadastrado.</p> :
             rows.map((row) => (
              <div key={row.id} className="grid grid-cols-1 md:grid-cols-[2fr,1fr,140px,90px,auto] gap-2 items-end p-2 border rounded-lg">
                <div>
                  <Label className="text-xs">Nome</Label>
                  <Input value={row.nome} disabled={!podeEditar}
                    onChange={(e) => setRows((p) => p.map((r) => r.id === row.id ? { ...r, nome: e.target.value } : r))}
                    onBlur={() => salvar(row)} />
                </div>
                <div>
                  <Label className="text-xs">Material</Label>
                  <Input value={row.material ?? ""} disabled={!podeEditar}
                    onChange={(e) => setRows((p) => p.map((r) => r.id === row.id ? { ...r, material: e.target.value } : r))}
                    onBlur={() => salvar(row)} />
                </div>
                <div>
                  <Label className="text-xs">Preço (R$)</Label>
                  <Input type="number" step="0.01" value={row.preco} disabled={!podeEditar}
                    onChange={(e) => setRows((p) => p.map((r) => r.id === row.id ? { ...r, preco: Number(e.target.value) || 0 } : r))}
                    onBlur={() => salvar(row)} />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Label className="text-xs">Ativo</Label>
                  <Switch checked={row.ativo} disabled={!podeEditar}
                    onCheckedChange={(v) => { setRows((p) => p.map((r) => r.id === row.id ? { ...r, ativo: v } : r)); salvar({ ...row, ativo: v }); }} />
                </div>
                {podeEditar && (
                  <Button variant="ghost" size="icon" onClick={() => remover(row.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <NovoProdutoDialog open={open} onOpenChange={setOpen} onCreated={load} />
    </AdminLayout>
  );
}

function NovoProdutoDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (v: boolean) => void; onCreated: () => void }) {
  const [material, setMaterial] = useState("");
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [autoChapa, setAutoChapa] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) { setMaterial(""); setNome(""); setPreco(""); setAutoChapa(true); }
  }, [open]);

  useEffect(() => {
    if (autoChapa && material.trim()) setNome(`CHAPA INTEIRA ${material.trim()}`);
  }, [material, autoChapa]);

  const submit = async () => {
    if (!nome.trim()) return toast.error("Nome é obrigatório");
    const p = Number(preco);
    if (isNaN(p) || p < 0) return toast.error("Preço inválido");
    setSaving(true);
    const { error } = await supabase.from("produtos").insert({
      nome: nome.trim(),
      material: material.trim() || null,
      preco: p,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Produto criado");
    onOpenChange(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Novo produto</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Material</Label>
            <Input value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Ex: Acrílico" />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={autoChapa} onCheckedChange={setAutoChapa} />
            <span className="text-sm">Gerar nome como "CHAPA INTEIRA {"{material}"}"</span>
          </div>
          <div>
            <Label>Nome do produto *</Label>
            <Input value={nome} onChange={(e) => { setAutoChapa(false); setNome(e.target.value); }} />
          </div>
          <div>
            <Label>Preço (R$) *</Label>
            <Input type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit} disabled={saving}>{saving ? "Salvando…" : "Criar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}