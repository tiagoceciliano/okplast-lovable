import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radar as RadarIcon, TrendingDown, TrendingUp, Loader2, Users } from "lucide-react";

interface Vendedor { user_id: string; nome: string; }
interface Realizado { user_id: string; total: number; qtd: number; }
interface MetaVend { user_id: string; valor: number; }

const brl = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);

function firstDayOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}
function labelMes(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}
function shiftMonth(iso: string, n: number) {
  const [y, m] = iso.split("-").map(Number);
  const d = new Date(y, (m - 1) + n, 1);
  return d.toISOString().slice(0, 10);
}

/** Semicircular gauge — matches the "velocímetro" reference. */
function Gauge({ pct, meta, realizado }: { pct: number; meta: number; realizado: number }) {
  // Clamp visual to 125% so the cyan overflow stripe fits
  const visual = Math.min(125, Math.max(0, pct));
  // Map 0..125 → 180..0 degrees (left to right)
  const angle = 180 - (visual / 125) * 180;
  const rad = (angle * Math.PI) / 180;
  const cx = 200, cy = 200, r = 150;
  const nx = cx + r * 0.92 * Math.cos(rad);
  const ny = cy - r * 0.92 * Math.sin(rad);

  // Arc path builder for a segment between two percentages (0..125)
  const arcPath = (from: number, to: number) => {
    const a1 = (180 - (from / 125) * 180) * Math.PI / 180;
    const a2 = (180 - (to / 125) * 180) * Math.PI / 180;
    const x1 = cx + r * Math.cos(a1), y1 = cy - r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2), y2 = cy - r * Math.sin(a2);
    const large = to - from > 62.5 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  return (
    <div className="relative w-full max-w-[520px] mx-auto">
      <svg viewBox="0 0 400 240" className="w-full">
        {/* segmentos coloridos */}
        <path d={arcPath(0, 50)}    stroke="#ef4444" strokeWidth="34" fill="none" strokeLinecap="butt" />
        <path d={arcPath(50, 75)}   stroke="#f59e0b" strokeWidth="34" fill="none" strokeLinecap="butt" />
        <path d={arcPath(75, 100)}  stroke="#22c55e" strokeWidth="34" fill="none" strokeLinecap="butt" />
        <path d={arcPath(100, 125)} stroke="#06b6d4" strokeWidth="34" fill="none" strokeLinecap="butt" />

        {/* marcadores */}
        {[0, 25, 50, 75, 100].map((p) => {
          const a = (180 - (p / 125) * 180) * Math.PI / 180;
          const x = cx + (r + 20) * Math.cos(a);
          const y = cy - (r + 20) * Math.sin(a);
          return <text key={p} x={x} y={y} textAnchor="middle" className="fill-muted-foreground" fontSize="11">{p}%</text>;
        })}

        {/* ponteiro */}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="hsl(var(--foreground))" strokeWidth="4" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="8" fill="hsl(var(--foreground))" />

        {/* badge da porcentagem */}
        <g>
          <rect x={cx - 34} y={30} rx="6" ry="6" width="68" height="26" fill="#f59e0b" />
          <text x={cx} y={48} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
            {pct.toFixed(1)}%
          </text>
        </g>
      </svg>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Realizado</div>
          <div className="text-2xl font-bold text-emerald-500">{brl(realizado)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Falta</div>
          <div className="text-2xl font-bold text-orange-500">{brl(Math.max(0, meta - realizado))}</div>
        </div>
      </div>

      <div className="text-center mt-3">
        {realizado >= meta ? (
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-sm">
            <TrendingUp className="h-4 w-4" /> {brl(realizado - meta)} acima da meta
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm">
            <TrendingDown className="h-4 w-4" /> {brl(meta - realizado)} atrás da meta
          </div>
        )}
        <div className="text-sm text-muted-foreground mt-2">Meta: <strong>{brl(meta)}</strong></div>
      </div>
    </div>
  );
}

export default function RadarPage() {
  const [mes, setMes] = useState(firstDayOfMonth());
  const [loading, setLoading] = useState(true);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [realizado, setRealizado] = useState<Record<string, Realizado>>({});
  const [metaTotal, setMetaTotal] = useState(0);
  const [metasVend, setMetasVend] = useState<Record<string, number>>({});

  const load = async () => {
    setLoading(true);
    const [wa, mt, rz] = await Promise.all([
      supabase.from("whatsapp_numbers").select("user_id,nome_vendedor").not("user_id", "is", null),
      supabase.from("metas").select("*").eq("mes", mes).maybeSingle(),
      supabase.rpc("get_realizado_mensal", { p_mes: mes }),
    ]);
    const vs: Vendedor[] = (wa.data || []).map((w: any) => ({ user_id: w.user_id, nome: w.nome_vendedor }));
    setVendedores(vs);
    setMetaTotal(mt.data ? Number((mt.data as any).valor_total) : 0);

    const map: Record<string, number> = {};
    if (mt.data) {
      const { data: mvs } = await supabase.from("metas_vendedores").select("*").eq("meta_id", (mt.data as any).id);
      (mvs || []).forEach((m: any) => { map[m.user_id] = Number(m.valor); });
    }
    setMetasVend(map);

    const rzMap: Record<string, Realizado> = {};
    (rz.data || []).forEach((r: Realizado) => { if (r.user_id) rzMap[r.user_id] = r; });
    setRealizado(rzMap);
    setLoading(false);
  };
  useEffect(() => { load(); }, [mes]);

  const totalRealizado = useMemo(
    () => Object.values(realizado).reduce((s, r) => s + Number(r.total || 0), 0),
    [realizado],
  );
  const pctGeral = metaTotal > 0 ? (totalRealizado / metaTotal) * 100 : 0;
  const totalVendas = useMemo(
    () => Object.values(realizado).reduce((s, r) => s + Number(r.qtd || 0), 0),
    [realizado],
  );
  const ticketMedio = totalVendas > 0 ? totalRealizado / totalVendas : 0;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3 flex-wrap">
          <RadarIcon className="h-6 w-6 text-primary" />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold">Radar</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhamento em tempo real da meta comercial do mês.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setMes(shiftMonth(mes, -1))}>← Mês anterior</Button>
            <div className="text-sm font-medium capitalize">{labelMes(mes)}</div>
            <Button variant="outline" size="sm" onClick={() => setMes(shiftMonth(mes, 1))}>Próximo →</Button>
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary"/></div>
        ) : (
          <>
            {/* Velocímetro geral */}
            <Card>
              <CardContent className="pt-6">
                <Gauge pct={pctGeral} meta={metaTotal} realizado={totalRealizado} />
              </CardContent>
            </Card>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card><CardContent className="pt-4">
                <div className="text-xs text-muted-foreground">Receita realizada</div>
                <div className="text-xl font-bold text-emerald-500">{brl(totalRealizado)}</div>
              </CardContent></Card>
              <Card><CardContent className="pt-4">
                <div className="text-xs text-muted-foreground">Meta do mês</div>
                <div className="text-xl font-bold">{brl(metaTotal)}</div>
              </CardContent></Card>
              <Card><CardContent className="pt-4">
                <div className="text-xs text-muted-foreground">Vendas ganhas</div>
                <div className="text-xl font-bold text-primary">{totalVendas}</div>
              </CardContent></Card>
              <Card><CardContent className="pt-4">
                <div className="text-xs text-muted-foreground">Ticket médio</div>
                <div className="text-xl font-bold">{brl(ticketMedio)}</div>
              </CardContent></Card>
            </div>

            {/* Equipe comercial */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-4 w-4 text-primary"/>
                  <h2 className="font-semibold">Equipe Comercial</h2>
                </div>
                {vendedores.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum vendedor cadastrado.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {vendedores.map((v) => {
                      const rz = realizado[v.user_id];
                      const realizadoV = Number(rz?.total || 0);
                      const metaV = Number(metasVend[v.user_id] || 0);
                      const pct = metaV > 0 ? Math.min(100, (realizadoV / metaV) * 100) : 0;
                      const pctReceita = totalRealizado > 0 ? (realizadoV / totalRealizado) * 100 : 0;
                      return (
                        <div key={v.user_id} className="p-4 border rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="font-medium truncate">{v.nome}</div>
                            <div className="text-xs text-muted-foreground">{pctReceita.toFixed(1)}% da receita</div>
                          </div>
                          <div className="text-2xl font-bold text-emerald-500">{brl(realizadoV)}</div>
                          <div className="text-xs text-muted-foreground">
                            {rz?.qtd || 0} venda(s) · Meta {brl(metaV)}
                          </div>
                          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-primary" style={{ width: `${pct}%` }}/>
                          </div>
                          <div className="text-[11px] text-muted-foreground text-right">
                            {pct.toFixed(1)}% da meta individual
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}