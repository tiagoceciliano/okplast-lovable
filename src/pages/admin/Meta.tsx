import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Vendedor { user_id: string; nome: string; }
interface MetaMes { id: string; mes: string; valor_total: number; }
interface MetaVend { id?: string; meta_id?: string; user_id: string; valor: number; }
interface Realizado { user_id: string; total: number; qtd: number; }

const brl = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);

function firstDayOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}
function labelMes(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}
function shiftMonth(iso: string, n: number) {
  const [y = 0, m = 1] = iso.split("-").map(Number);
  const d = new Date(y, (m - 1) + n, 1);
  return d.toISOString().slice(0, 10);
}

export default function MetaPage() {
  const [mes, setMes] = useState<string>(firstDayOfMonth());
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [metaMes, setMetaMes] = useState<MetaMes | null>(null);
  const [valorTotal, setValorTotal] = useState<string>("");
  const [porVendedor, setPorVendedor] = useState<Record<string, string>>({});
  const [realizado, setRealizado] = useState<Record<string, Realizado>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [wa, mt, rz] = await Promise.all([
      supabase.from("whatsapp_numbers").select("user_id,nome_vendedor").not("user_id", "is", null),
      supabase.from("metas").select("*").eq("mes", mes).maybeSingle(),
      supabase.rpc("get_realizado_mensal", { p_mes: mes }),
    ]);
    const vs: Vendedor[] = (wa.data || []).map((w: any) => ({ user_id: w.user_id, nome: w.nome_vendedor }));
    setVendedores(vs);
    setMetaMes((mt.data as MetaMes) || null);
    setValorTotal(mt.data ? String((mt.data as MetaMes).valor_total) : "");

    const map: Record<string, string> = {};
    if (mt.data) {
      const { data: mvs } = await supabase.from("metas_vendedores").select("*").eq("meta_id", (mt.data as MetaMes).id);
      (mvs || []).forEach((m: any) => { map[m.user_id] = String(m.valor); });
    }
    vs.forEach((v) => { if (!(v.user_id in map)) map[v.user_id] = "0"; });
    setPorVendedor(map);

    const rzMap: Record<string, Realizado> = {};
    (rz.data || []).forEach((r: Realizado) => { if (r.user_id) rzMap[r.user_id] = r; });
    setRealizado(rzMap);
    setLoading(false);
  };
  useEffect(() => { load(); }, [mes]);

  const somaPorVend = useMemo(
    () => Object.values(porVendedor).reduce((s, v) => s + (Number(v) || 0), 0),
    [porVendedor],
  );
  const total = Number(valorTotal) || 0;
  const totalRealizado = useMemo(
    () => Object.values(realizado).reduce((s, r) => s + Number(r.total || 0), 0),
    [realizado],
  );
  const pctGeral = total > 0 ? Math.min(100, (totalRealizado / total) * 100) : 0;
  const falta = Math.max(0, total - totalRealizado);

  const salvar = async () => {
    if (total <= 0) { toast.error("Informe a meta total do mês"); return; }
    if (Math.abs(somaPorVend - total) > 0.01) {
      { toast.error(`Soma das metas individuais (${brl(somaPorVend)}) deve bater com a meta total (${brl(total)})`); return; }
    }
    setSaving(true);
    let metaId = metaMes?.id;
    if (!metaId) {
      const { data, error } = await supabase.from("metas").insert({ mes, valor_total: total }).select().single();
      if (error) { setSaving(false); return toast.error(error.message); }
      metaId = (data as MetaMes).id;
    } else {
      const { error } = await supabase.from("metas").update({ valor_total: total }).eq("id", metaId);
      if (error) { setSaving(false); return toast.error(error.message); }
    }
    // upsert cada vendedor
    for (const v of vendedores) {
      const val = Number(porVendedor[v.user_id] || 0);
      const { error } = await supabase.from("metas_vendedores")
        .upsert({ meta_id: metaId, user_id: v.user_id, valor: val }, { onConflict: "meta_id,user_id" });
      if (error) { setSaving(false); return toast.error(error.message); }
    }
    setSaving(false);
    toast.success("Meta salva");
    load();
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Target className="h-6 w-6 text-primary" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Meta</h1>
            <p className="text-sm text-muted-foreground">Meta mensal da equipe e acompanhamento em tempo real.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setMes(shiftMonth(mes, -1))}>← Mês anterior</Button>
            <div className="text-sm font-medium capitalize">{labelMes(mes)}</div>
            <Button variant="outline" size="sm" onClick={() => setMes(shiftMonth(mes, 1))}>Próximo →</Button>
          </div>
        </div>

        {/* Velocímetro simples */}
        <Card>
          <CardHeader>
            <CardTitle>Realizado × Meta</CardTitle>
            <CardDescription>
              Realizado é a soma do valor das negociações com status Ganho no mês selecionado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="text-xs text-muted-foreground">Meta do mês</div>
                <div className="text-2xl font-bold">{brl(total)}</div>
              </div>
              <div className="p-4 rounded-lg border bg-emerald-500/10 border-emerald-500/30">
                <div className="text-xs text-muted-foreground">Realizado</div>
                <div className="text-2xl font-bold text-emerald-600">{brl(totalRealizado)}</div>
              </div>
              <div className="p-4 rounded-lg border bg-destructive/10 border-destructive/30">
                <div className="text-xs text-muted-foreground">Falta</div>
                <div className="text-2xl font-bold text-destructive">{brl(falta)}</div>
              </div>
            </div>
            <div className="w-full h-4 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-primary transition-all"
                style={{ width: `${pctGeral}%` }} />
            </div>
            <div className="text-xs text-muted-foreground mt-1 text-right">{pctGeral.toFixed(1)}% da meta</div>
          </CardContent>
        </Card>

        {/* Configuração */}
        <Card>
          <CardHeader>
            <CardTitle>Configurar meta do mês</CardTitle>
            <CardDescription>
              Defina a meta geral e distribua manualmente entre os vendedores. A soma tem que bater com a meta geral.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-xs">
              <Label>Meta total do mês (R$)</Label>
              <Input type="number" step="0.01" value={valorTotal} onChange={(e) => setValorTotal(e.target.value)} />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Metas individuais</div>
              {loading ? <div className="flex justify-center py-6"><Loader2 className="animate-spin"/></div> :
               vendedores.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum vendedor cadastrado.</p> :
               vendedores.map((v) => {
                const rz = realizado[v.user_id];
                const metaV = Number(porVendedor[v.user_id] || 0);
                const realizadoV = Number(rz?.total || 0);
                const pct = metaV > 0 ? Math.min(100, (realizadoV / metaV) * 100) : 0;
                return (
                  <div key={v.user_id} className="p-3 border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr,180px,1fr] gap-3 items-center">
                      <div>
                        <div className="font-medium">{v.nome}</div>
                        <div className="text-xs text-muted-foreground">
                          {rz?.qtd || 0} venda(s) · {brl(realizadoV)}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Meta individual (R$)</Label>
                        <Input type="number" step="0.01" value={porVendedor[v.user_id] ?? "0"}
                          onChange={(e) => setPorVendedor((p) => ({ ...p, [v.user_id]: e.target.value }))} />
                      </div>
                      <div>
                        <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-1">
                          {pct.toFixed(1)}% · falta {brl(Math.max(0, metaV - realizadoV))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex items-center justify-between pt-2 border-t text-sm">
                <div>
                  Soma das metas individuais:{" "}
                  <strong className={Math.abs(somaPorVend - total) < 0.01 && total > 0 ? "text-emerald-600" : "text-destructive"}>
                    {brl(somaPorVend)}
                  </strong>{" "}
                  / meta total {brl(total)}
                </div>
                <Button onClick={salvar} disabled={saving || loading}>
                  {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin"/>Salvando…</> : <><Save className="h-4 w-4 mr-2"/>Salvar meta</>}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}