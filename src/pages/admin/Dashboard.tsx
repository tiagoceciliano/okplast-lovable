import { useState, useEffect, useMemo, useCallback } from "react";
import { AdminLayout } from "./AdminLayout";
import { LeadsKPICards } from "./components/LeadsKPICards";
import { PeriodStatsTable } from "./components/PeriodStatsTable";
import { ConversionChart } from "./components/ConversionChart";
import { PagesList } from "./components/PagesList";
import { UTMPerformanceTable } from "./components/UTMPerformanceTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

interface PeriodMetrics {
  visits: number;
  leads: number;
  conversionRate: string;
}

interface PeriodStats {
  today: PeriodMetrics;
  yesterday: PeriodMetrics;
  last7days: PeriodMetrics;
}

interface LeadsByPeriodItem {
  produtos: number;
  chapas: number;
  total: number;
}

interface LeadsByPeriod {
  today: LeadsByPeriodItem;
  yesterday: LeadsByPeriodItem;
  last7days: LeadsByPeriodItem;
  custom: LeadsByPeriodItem;
}

interface DashboardStats {
  periodStats: PeriodStats;
  leadsByPeriod: LeadsByPeriod;
  totalVisits: number;
  totalLeads: number;
  uniqueVisitors: number;
  uniqueSessions: number;
  conversionRate: string;
  topPages: { path: string; count: number }[];
  trafficSources: { source: string; count: number }[];
  leadsByProduct: { product: string; count: number }[];
  leadsByLocation: { location: string; count: number }[];
  chartData: { date: string; visits: number }[];
  campaignStats: Array<{
    campaign: string;
    visits: number;
    leads: number;
    conversionRate: string;
  }>;
}

export default function Dashboard() {
  const [period, setPeriod] = useState("all");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined);

  // Campaign data for table
  const campaignData = useMemo(() => {
    return (stats?.campaignStats || []).map(c => ({
      name: c.campaign,
      visits: c.visits,
      leads: c.leads,
      conversionRate: c.conversionRate
    }));
  }, [stats?.campaignStats]);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-dashboard-stats?period=${period}`;
      
      if (customDateRange?.from) {
        url += `&customStartDate=${format(customDateRange.from, 'yyyy-MM-dd')}`;
      }
      if (customDateRange?.to) {
        url += `&customEndDate=${format(customDateRange.to, 'yyyy-MM-dd')}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          'Content-Type': 'application/json',
        },
      });

        if (!response.ok) {
          throw new Error('Falha ao carregar estatísticas');
        }

        const statsData = await response.json();
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, [period, customDateRange]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleCustomDateChange = useCallback((range: DateRange | undefined) => {
    setCustomDateRange(range);
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Métricas de conversão e performance do site
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}

        <LeadsKPICards
          leadsByPeriod={stats?.leadsByPeriod || null}
          isLoading={isLoading}
          customDateRange={customDateRange}
          onCustomDateChange={handleCustomDateChange}
        />

        <PeriodStatsTable
          periodStats={stats?.periodStats || null}
          isLoading={isLoading}
        />

        <ConversionChart 
          data={stats?.chartData || []} 
          isLoading={isLoading} 
        />

        <PagesList
          topPages={stats?.topPages || []}
          leadsByProduct={stats?.leadsByProduct || []}
          isLoading={isLoading}
        />

        {/* Tabela Performance por Campanha */}
        <UTMPerformanceTable
          title="Performance por Campanha"
          description="Visitas, leads e conversão por utm_campaign"
          columnLabel="Campanha"
          data={campaignData}
          isLoading={isLoading}
          periodValue={period}
          onPeriodChange={setPeriod}
        />
      </div>
    </AdminLayout>
  );
}
