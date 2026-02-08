import { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "./AdminLayout";
import { UTMPerformanceTable } from "./components/UTMPerformanceTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TermStat {
  term: string;
  campaign: string;
  visits: number;
  leads: number;
  conversionRate: string;
}

interface CampaignStat {
  campaign: string;
  visits: number;
  leads: number;
  conversionRate: string;
}

export default function UTMTerms() {
  const [period, setPeriod] = useState("all");
  const [termStats, setTermStats] = useState<TermStat[]>([]);
  const [campaignStats, setCampaignStats] = useState<CampaignStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaignFilter, setCampaignFilter] = useState<string>("all");

  // Unique campaigns for filter
  const uniqueCampaigns = useMemo(() => {
    return campaignStats.map(c => c.campaign);
  }, [campaignStats]);

  // Filtered term data
  const termData = useMemo(() => {
    const filtered = campaignFilter === "all" 
      ? termStats 
      : termStats.filter(t => t.campaign === campaignFilter);
    
    return filtered.map(t => ({
      name: t.term,
      visits: t.visits,
      leads: t.leads,
      conversionRate: t.conversionRate
    }));
  }, [termStats, campaignFilter]);

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      setError(null);
      
      try {
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
        setTermStats(statsData.termStats || []);
        setCampaignStats(statsData.campaignStats || []);
      } catch (err) {
        console.error('Error fetching UTM stats:', err);
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
            <h1 className="text-3xl font-bold tracking-tight">Performance por Termo</h1>
            <p className="text-muted-foreground">
              Análise de conversão por utm_term
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
