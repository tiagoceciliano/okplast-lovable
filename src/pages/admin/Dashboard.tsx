import { useState, useEffect, useMemo, useCallback } from "react";
import { AdminLayout } from "./AdminLayout";
import { ConversionChart } from "./components/ConversionChart";
import { UTMPerformanceTable } from "./components/UTMPerformanceTable";
import { DashboardPeriodFilter, computeRangeFromPreset, type DashboardPeriodState } from "./components/DashboardPeriodFilter";
import { DashboardKPIs } from "./components/DashboardKPIs";
import { GoogleAdsByCategoryTable } from "./components/GoogleAdsByCategoryTable";
import { format } from "date-fns";

interface PeriodPayload {
  totalLeads: number;
  gadsLeads: number;
  gadsPerformance: { category: string; visits: number; leads: number; conversionRate: number }[];
  campaignStats: { campaign: string; visits: number; leads: number; conversionRate: string }[];
  chartData: { date: string; visits: number }[];
  leadsChartData: { date: string; visits: number }[];
}

interface DashboardResponse {
  current: PeriodPayload;
  previous: PeriodPayload | null;
  anchors: {
    today: { leads: number; gadsLeads: number };
    yesterday: { leads: number; gadsLeads: number };
  };
}

const ymd = (d: Date) => format(d, "yyyy-MM-dd");

export default function Dashboard() {
  const [filter, setFilter] = useState<DashboardPeriodState>(() => ({
    preset: "this_month",
    range: computeRangeFromPreset("this_month"),
    compareEnabled: false,
    compareRange: null,
  }));
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        startDate: ymd(filter.range.from),
        endDate: ymd(filter.range.to),
      });
      if (filter.compareEnabled && filter.compareRange) {
        params.set("compareStartDate", ymd(filter.compareRange.from));
        params.set("compareEndDate", ymd(filter.compareRange.to));
      }
      const url = `${import.meta.env["VITE_SUPABASE_URL"]}/functions/v1/get-dashboard-stats?${params}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"]}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Falha ao carregar estatísticas");
      setData(await res.json());
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const campaignData = useMemo(
    () => (data?.current.campaignStats || []).map(c => ({
      name: c.campaign, visits: c.visits, leads: c.leads, conversionRate: c.conversionRate,
    })),
    [data?.current.campaignStats]
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Métricas de conversão e performance do site</p>
        </div>

        <DashboardPeriodFilter value={filter} onChange={setFilter} />

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>
        )}

        <DashboardKPIs
          isLoading={isLoading}
          compareEnabled={filter.compareEnabled}
          periodLeads={data?.current.totalLeads ?? 0}
          previousPeriodLeads={data?.previous?.totalLeads ?? null}
          periodGAdsLeads={data?.current.gadsLeads ?? 0}
          previousPeriodGAdsLeads={data?.previous?.gadsLeads ?? null}
          todayLeads={data?.anchors.today.leads ?? 0}
          yesterdayLeads={data?.anchors.yesterday.leads ?? 0}
          todayGAdsLeads={data?.anchors.today.gadsLeads ?? 0}
          yesterdayGAdsLeads={data?.anchors.yesterday.gadsLeads ?? 0}
        />

        <GoogleAdsByCategoryTable
          current={data?.current.gadsPerformance ?? []}
          isLoading={isLoading}
        />

        <ConversionChart
          data={data?.current.chartData || []}
          isLoading={isLoading}
          title="Visitas no período"
          description="Visualizações de página por dia"
        />

        <ConversionChart
          data={data?.current.leadsChartData || []}
          isLoading={isLoading}
          title="Leads no período"
          description="Leads capturados por dia"
          valueLabel="Leads"
        />

        <UTMPerformanceTable
          title="Performance por Campanha"
          description="Visitas, leads e conversão por utm_campaign"
          columnLabel="Campanha"
          data={campaignData}
          isLoading={isLoading}
        />
      </div>
    </AdminLayout>
  );
}
