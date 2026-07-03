import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Loader2, MessageCircle } from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WhatsAppNumberRow {
  id: string;
  nome_vendedor: string;
  numero_raw: string;
  numero_formatado: string;
  peso: number;
  ativo: boolean;
  _dirty?: boolean;
  _new?: boolean;
}

// Formata (21) 93505-8539 a partir de dígitos
function formatDisplay(digits: string): string {
  const d = digits.replace(/\D/g, "").replace(/^55/, "");
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
}

function toRaw(formatted: string): string {
  const d = formatted.replace(/\D/g, "");
  return d.startsWith("55") ? d : `55${d}`;
}

export default function WhatsAppConfig() {
  const [rows, setRows] = useState<WhatsAppNumberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("whatsapp_numbers")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      toast.error("Erro ao carregar números: " + error.message);
    } else {
      setRows((data ?? []) as WhatsAppNumberRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateRow = (id: string, patch: Partial<WhatsAppNumberRow>) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch, _dirty: true } : r)),
    );
  };

  const addRow = () => {
    const tempId = `new-${Date.now()}`;
    setRows((prev) => [
      ...prev,
      {
        id: tempId,
        nome_vendedor: "",
        numero_raw: "",
        numero_formatado: "",
        peso: 0,
        ativo: true,
        _new: true,
        _dirty: true,
      },
    ]);
  };

  const removeRow = async (row: WhatsAppNumberRow) => {
    if (!confirm(`Remover ${row.nome_vendedor || "este número"}?`)) return;
    if (row._new) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      return;
    }
    const { error } = await supabase.from("whatsapp_numbers").delete().eq("id", row.id);
    if (error) {
      toast.error("Erro ao remover: " + error.message);
      return;
    }
    toast.success("Número removido");
    setRows((prev) => prev.filter((r) => r.id !== row.id));
  };

  const activeRows = rows.filter((r) => r.ativo);
  const totalPeso = activeRows.reduce((s, r) => s + (r.peso || 0), 0);

  const saveAll = async () => {
    // Validações
    for (const r of rows) {
      if (!r.nome_vendedor.trim()) {
        toast.error("Preencha o nome de todos os vendedores");
        return;
      }
      const digits = r.numero_formatado.replace(/\D/g, "");
      if (digits.length < 10) {
        toast.error(`Número inválido para ${r.nome_vendedor}`);
        return;
      }
    }
    if (activeRows.length > 0 && totalPeso !== 100) {
      toast.error(`A soma dos pesos ativos deve ser 100% (atual: ${totalPeso}%)`);
      return;
    }

    setSaving(true);
    try {
      for (const r of rows) {
        if (!r._dirty) continue;
        const raw = toRaw(r.numero_formatado);
        const formatted = formatDisplay(raw);
        const payload = {
          nome_vendedor: r.nome_vendedor.trim(),
          numero_raw: raw,
          numero_formatado: formatted,
          peso: r.peso,
          ativo: r.ativo,
        };
        if (r._new) {
          const { error } = await supabase.from("whatsapp_numbers").insert(payload);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("whatsapp_numbers")
            .update(payload)
            .eq("id", r.id);
          if (error) throw error;
        }
      }
      toast.success("Configuração salva");
      // Limpa cache local para forçar refetch nos visitantes
      try {
        window.localStorage.removeItem("okp-wa-cache");
      } catch {}
      await load();
    } catch (e) {
      toast.error("Erro ao salvar: " + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">WhatsApp — Rateio de Vendedores</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie os números que recebem os leads e a porcentagem de rateio de cada um.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Como funciona o rateio</CardTitle>
            <CardDescription>
              O sorteio é <strong>sticky por visitante</strong>: na primeira interação o cliente é
              atribuído a um vendedor (respeitando a % de rateio) e a partir daí sempre fala com o
              mesmo — tanto no botão do WhatsApp quanto no formulário. Para testar diferentes números,
              use uma <strong>aba anônima</strong> ou limpe o localStorage.
              <br />
              A soma dos pesos dos números <strong>ativos</strong> deve totalizar <strong>100%</strong>.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Números configurados</CardTitle>
              <CardDescription>
                Total de peso ativo:{" "}
                <strong className={totalPeso === 100 ? "text-emerald-600" : "text-destructive"}>
                  {totalPeso}%
                </strong>
              </CardDescription>
            </div>
            <Button onClick={addRow} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar número
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : rows.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Nenhum número cadastrado. Clique em "Adicionar número".
              </p>
            ) : (
              rows.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-1 md:grid-cols-[1fr,1fr,120px,auto,auto] gap-3 items-end p-4 border rounded-lg bg-card"
                >
                  <div>
                    <Label className="text-xs">Nome do vendedor</Label>
                    <Input
                      value={row.nome_vendedor}
                      onChange={(e) => updateRow(row.id, { nome_vendedor: e.target.value })}
                      placeholder="Ex.: João"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">WhatsApp</Label>
                    <Input
                      value={row.numero_formatado}
                      onChange={(e) =>
                        updateRow(row.id, {
                          numero_formatado: formatDisplay(e.target.value),
                        })
                      }
                      placeholder="(21) 99999-9999"
                      maxLength={15}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Peso (%)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={row.peso}
                      onChange={(e) =>
                        updateRow(row.id, { peso: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })
                      }
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Label className="text-xs">Ativo</Label>
                    <Switch
                      checked={row.ativo}
                      onCheckedChange={(v) => updateRow(row.id, { ativo: v })}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(row)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={saveAll} disabled={saving || loading}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar alterações
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}