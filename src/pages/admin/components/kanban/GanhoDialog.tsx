import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Negociacao } from "./types";

interface Props {
  negociacao: Negociacao | null;
  onClose: () => void;
  onDone: () => void;
}

interface Produto { id: string; nome: string; preco: number; material: string | null; }

export function GanhoDialog({ negociacao, onClose, onDone }: Props) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nomeProduto, setNomeProduto] = useState("");
  const [valor, setValor] = useState<string>("");
  const [linkBling, setLinkBling] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!negociacao) return;
    setNomeProduto(negociacao.nome_produto || negociacao.produto || "");
    setValor(negociacao.valor != null ? String(negociacao.valor) : "");
    setLinkBling(negociacao.link_pv_bling || "");
    supabase.from("produtos").select("id,nome,preco,material").eq("ativo", true).order("nome")
      .then(({ data }) => setProdutos((data as Produto[]) || []));
  }, [negociacao?.id]);

  if (!negociacao) return null;

  const submit = async () => {
    if (!nomeProduto.trim()) return toast.error("Selecione o produto vendido");
    const v = Number(valor);
    if (!v || v <= 0) return toast.error("Informe o valor do produto");
    if (!linkBling.trim()) return toast.error("Cole o Link do PV do Bling");
    try {
      new URL(linkBling.trim());
    } catch { return toast.error("Link do PV do Bling inválido"); }

    setSaving(true);
    const { error } = await supabase.from("negociacoes").update({
      etapa: "venda_realizada",
      nome_produto: nomeProduto.trim(),
      produto: nomeProduto.trim(),
      valor: v,
      link_pv_bling: linkBling.trim(),
    }).eq("id", negociacao.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Venda registrada");
    onDone();
  };

  return (
    <Dialog open={!!negociacao} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar venda — {negociacao.nome_cliente}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Produto vendido *</Label>
            <Select value={nomeProduto} onValueChange={(v) => {
              setNomeProduto(v);
              const p = produtos.find((x) => x.nome === v);
              if (p && !valor) setValor(String(p.preco));
            }}>
              <SelectTrigger><SelectValue placeholder="Selecione…" /></SelectTrigger>
              <SelectContent>
                {produtos.map((p) => <SelectItem key={p.id} value={p.nome}>{p.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Valor do produto (R$) *</Label>
            <Input type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} />
          </div>
          <div>
            <Label>Link PV do Bling *</Label>
            <Input value={linkBling} onChange={(e) => setLinkBling(e.target.value)} placeholder="https://www.bling.com.br/..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} disabled={saving}>{saving ? "Salvando…" : "Registrar venda"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}