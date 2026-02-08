import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "./AdminLayout";
import { StatsCards } from "./components/StatsCards";
import { ConversionChart } from "./components/ConversionChart";
import { PagesList } from "./components/PagesList";
import { UTMPerformanceTable } from "./components/UTMPerformanceTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DashboardStats {
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
  termStats: Array<{
    term: string;
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
  const [campaignFilter, setCampaignFilter] = useState<string>("all");

  // Campaign data for table
  const campaignData = useMemo(() => {
    return (stats?.campaignStats || []).map(c => ({
      name: c.campaign,
      visits: c.visits,
      leads: c.leads,
      conversionRate: c.conversionRate
    }));
  }, [stats?.campaignStats]);

  // Unique campaigns for filter
  const uniqueCampaigns = useMemo(() => {
    return (stats?.campaignStats || []).map(c => c.campaign);
  }, [stats?.campaignStats]);

  // Filtered term data
  const termData = useMemo(() => {
    const terms = stats?.termStats || [];
    const filtered = campaignFilter === "all" 
      ? terms 
      : terms.filter(t => t.campaign === campaignFilter);
    
    return filtered.map(t => ({
      name: t.term,
      visits: t.visits,
      leads: t.leads,
      conversionRate: t.conversionRate
    }));
  }, [stats?.termStats, campaignFilter]);

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.functions.invoke('get-dashboard-stats', {
          body: {},
          headers: {},
        });

        // Add query param to URL manually since invoke doesn't support it directly
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-dashboard-stats?period=${period}`,
          {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

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
    }

    fetchStats();
  }, [period]);

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
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="all">Todo o período</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}

        <StatsCards
          totalVisits={stats?.totalVisits || 0}
          totalLeads={stats?.totalLeads || 0}
          conversionRate={stats?.conversionRate || "0.00"}
          uniqueSessions={stats?.uniqueSessions || 0}
          isLoading={isLoading}
        />

        <ConversionChart 
          data={stats?.chartData || []} 
          isLoading={isLoading} 
        />

        <PagesList
          topPages={stats?.topPages || []}
          trafficSources={stats?.trafficSources || []}
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
        />

        {/* Tabela Performance por Termo */}
        <UTMPerformanceTable
          title="Performance por Termo"
          description="Visitas, leads e conversão por utm_term"
          columnLabel="Termo"
          data={termData}
          isLoading={isLoading}
          showFilter
          filterLabel="Filtrar por Campanha"
          filterOptions={uniqueCampaigns}
          filterValue={campaignFilter}
          onFilterChange={setCampaignFilter}
        />
      </div>
    </AdminLayout>
  );
}
