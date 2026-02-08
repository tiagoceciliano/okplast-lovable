import { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "./AdminLayout";
import { UTMPerformanceTable } from "./components/UTMPerformanceTable";

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
          periodValue={period}
          onPeriodChange={setPeriod}
        />
      </div>
    </AdminLayout>
  );
}
