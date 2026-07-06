import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ETAPAS, type EtapaId, type Negociacao, type VendedorLite } from "./types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  vendedores: VendedorLite[];
  onCreated: (n: Negociacao) => void;
}

interface Produto { id: string; nome: string; material: string | null; }

export function NovaNegociacaoDialog({ open, onOpenChange, vendedores, onCreated }: Props) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [material, setMaterial] = useState("");
  const [produto, setProduto] = useState("");
  const [responsavel, setResponsavel] = useState<string>("");
  const [etapa, setEtapa] = useState<EtapaId>("entrada");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setNome(""); setTelefone(""); setMaterial(""); setProduto(""); setResponsavel(""); setEtapa("entrada");
    supabase.from("produtos").select("id,nome,material").eq("ativo", true).order("nome")
      .then(({ data }) => setProdutos((data as Produto[]) || []));
  }, [open]);

  const materiais = Array.from(new Set(produtos.map((p) => p.material).filter(Boolean) as string[]));
  const produtosDoMaterial = material ? produtos.filter((p) => p.material === material) : produtos;

  const submit = async () => {
    if (!nome.trim() || !telefone.trim() || !material.trim() || !produto.trim() || !responsavel || !etapa) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    // Etapas de venda_realizada exigem fluxo próprio; bloqueamos aqui
    if (etapa === "venda_realizada") {
      toast.error("Para lançar uma venda realizada, crie em outra etapa e mova o card.");
      return;
    }
    setSaving(true);
    const { data, error } = await supabase.from("negociacoes").insert({
      nome_cliente: nome.trim(),
      telefone: telefone.trim(),
      material: material.trim(),
      produto: produto.trim(),
      responsavel_id: responsavel,
      etapa,
      posicao: 999999,
    }).select().single();
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Negociação criada");
    onCreated(data as Negociacao);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Nova negociação</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Nome do cliente *</Label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div>
            <Label>Telefone *</Label>
            <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(21) 99999-9999" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Material *</Label>
              <Select value={material} onValueChange={(v) => { setMaterial(v); setProduto(""); }}>
                <SelectTrigger><SelectValue placeholder="Selecione…" /></SelectTrigger>
                <SelectContent>
                  {materiais.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Produto *</Label>
              <Select value={produto} onValueChange={setProduto} disabled={!material}>
                <SelectTrigger><SelectValue placeholder="Selecione…" /></SelectTrigger>
                <SelectContent>
                  {produtosDoMaterial.map((p) => <SelectItem key={p.id} value={p.nome}>{p.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Responsável *</Label>
            <Select value={responsavel} onValueChange={setResponsavel}>
              <SelectTrigger><SelectValue placeholder="Selecione…" /></SelectTrigger>
              <SelectContent>
                {vendedores.map((v) => <SelectItem key={v.user_id} value={v.user_id}>{v.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Etapa *</Label>
            <Select value={etapa} onValueChange={(v) => setEtapa(v as EtapaId)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ETAPAS.filter((e) => e.id !== "venda_realizada").map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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