import { Users, FileText, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  totalVisits: number;
  totalLeads: number;
  conversionRate: string;
  uniqueSessions: number;
  isLoading?: boolean;
}

export function StatsCards({ totalVisits, totalLeads, conversionRate, uniqueSessions, isLoading }: StatsCardsProps) {
  const stats = [
    {
      title: "Total de Visitas",
      value: totalVisits.toLocaleString('pt-BR'),
      icon: Users,
      description: "Visualizações de página",
    },
    {
      title: "Total de Leads",
      value: totalLeads.toLocaleString('pt-BR'),
      icon: FileText,
      description: "Contatos capturados",
    },
    {
      title: "Taxa de Conversão",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      description: "Leads / Visitantes únicos",
    },
    {
      title: "Sessões Únicas",
      value: uniqueSessions.toLocaleString('pt-BR'),
      icon: Activity,
      description: "Sessões de navegação",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
