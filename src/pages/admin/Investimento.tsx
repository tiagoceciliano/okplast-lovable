import { useState, useEffect, useMemo, useCallback } from "react";
import { AdminLayout } from "./AdminLayout";
import { DashboardPeriodFilter, computeRangeFromPreset, type DashboardPeriodState } from "./components/DashboardPeriodFilter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getGoogleAdsStats } from "@/lib/google-ads.functions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, MousePointerClick, Eye, Users } from "lucide-react";

interface DailyRow { date: string; cost: number; clicks: number; impressions: number; conversions: number }
interface CampaignRow {
  id: string; name: string; status: string; cost: number; clicks: number;
  impressions: number; conversions: number; labels: string[]; leads: number;
}
interface StatsResponse {
  daily: DailyRow[];
  campaigns: CampaignRow[];
  totals: { cost: number; clicks: number; impressions: number; conversions: number; leads: number; costPerLead: number | null };
}

const ymd = (d: Date) => format(d, "yyyy-MM-dd");
const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Investimento() {
  const [filter, setFilter] = useState<DashboardPeriodState>(() => ({
    preset: "this_month",
    range: computeRangeFromPreset("this_month"),
    compareEnabled: false,
    compareRange: null,
  }));
  const [data, setData] = useState<StatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [labelFilter, setLabelFilter] = useState<string>("all");

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getGoogleAdsStats({ data: { startDate: ymd(filter.range.from), endDate: ymd(filter.range.to) } });
      setData(res as StatsResponse);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar investimento");
    } finally {
      setIsLoading(false);
    }
  }, [filter.range.from, filter.range.to]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const allLabels = useMemo(() => {
    const set = new Set<string>();
    data?.campaigns.forEach(c => c.labels.forEach(l => set.add(l)));
    return [...set].sort();
  }, [data]);

  const filteredCampaigns = useMemo(() => {
    const rows = data?.campaigns ?? [];
    const filtered = labelFilter === "all" ? rows : labelFilter === "none"
      ? rows.filter(c => c.labels.length === 0)
      : rows.filter(c => c.labels.includes(labelFilter));
    return [...filtered].sort((a, b) => b.cost - a.cost);
  }, [data, labelFilter]);

  const filteredTotals = useMemo(() => {
    const cost = filteredCampaigns.reduce((s, c) => s + c.cost, 0);
    const leads = filteredCampaigns.reduce((s, c) => s + c.leads, 0);
    const clicks = filteredCampaigns.reduce((s, c) => s + c.clicks, 0);
    const impressions = filteredCampaigns.reduce((s, c) => s + c.impressions, 0);
    return { cost, leads, clicks, impressions, costPerLead: leads > 0 ? cost / leads : null };
  }, [filteredCampaigns]);

  const chartData = useMemo(() => (data?.daily ?? []).map(d => ({
    ...d,
    label: format(new Date(d.date + "T12:00:00"), "dd/MM", { locale: ptBR }),
  })), [data]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Investimento Google Ads</h1>
            <p className="text-muted-foreground">Conta OKPLAST + LAB — gasto, campanhas e custo por lead</p>
          </div>
          <DashboardPeriodFilter value={filter} onChange={setFilter} />
        </div>

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6 text-destructive">{error}</CardContent>
          </Card>
        )}

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Investimento", value: brl(filteredTotals.cost), icon: DollarSign },
            { title: "Leads", value: String(filteredTotals.leads), icon: Users },
            { title: "Custo por lead", value: filteredTotals.costPerLead != null ? brl(filteredTotals.costPerLead) : "—", icon: MousePointerClick },
            { title: "Cliques", value: filteredTotals.clicks.toLocaleString("pt-BR"), icon: Eye },
          ].map(k => (
            <Card key={k.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{k.title}</CardTitle>
                <k.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{k.value}</div>}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gasto diário */}
        <Card>
          <CardHeader>
            <CardTitle>Gasto diário</CardTitle>
            <CardDescription>Investimento por dia no período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-64 w-full" /> : chartData.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Sem gasto no período</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="label" fontSize={12} />
                  <YAxis fontSize={12} tickFormatter={(v: number) => `R$${v}`} />
                  <Tooltip
                    formatter={(value: number) => [brl(value), "Investimento"]}
                    labelFormatter={(label: string) => `Dia ${label}`}
                  />
                  <Bar dataKey="cost" fill="#1a3a5c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Por campanha */}
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Investimento por campanha</CardTitle>
              <CardDescription>Gasto, leads do sistema e custo por lead por campanha</CardDescription>
            </div>
            <Select value={labelFilter} onValueChange={setLabelFilter}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filtrar por rótulo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os rótulos</SelectItem>
                <SelectItem value="none">Sem rótulo</SelectItem>
                {allLabels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-40 w-full" /> : filteredCampaigns.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma campanha encontrada</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campanha</TableHead>
                    <TableHead>Rótulos</TableHead>
                    <TableHead className="text-right">Investimento</TableHead>
                    <TableHead className="text-right">Cliques</TableHead>
                    <TableHead className="text-right">Leads</TableHead>
                    <TableHead className="text-right">Custo/lead</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {c.name}
                          {c.status !== "ENABLED" && <Badge variant="secondary" className="text-xs">pausada</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {c.labels.length === 0 ? <span className="text-muted-foreground text-xs">—</span>
                            : c.labels.map(l => <Badge key={l} variant="outline" className="text-xs">{l}</Badge>)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{brl(c.cost)}</TableCell>
                      <TableCell className="text-right">{c.clicks.toLocaleString("pt-BR")}</TableCell>
                      <TableCell className="text-right">{c.leads}</TableCell>
                      <TableCell className="text-right">{c.leads > 0 ? brl(c.cost / c.leads) : "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell />
                    <TableCell className="text-right font-bold">{brl(filteredTotals.cost)}</TableCell>
                    <TableCell className="text-right font-bold">{filteredTotals.clicks.toLocaleString("pt-BR")}</TableCell>
                    <TableCell className="text-right font-bold">{filteredTotals.leads}</TableCell>
                    <TableCell className="text-right font-bold">{filteredTotals.costPerLead != null ? brl(filteredTotals.costPerLead) : "—"}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
