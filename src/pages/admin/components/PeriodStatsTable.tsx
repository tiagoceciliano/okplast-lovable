import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

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

interface PeriodStatsTableProps {
  periodStats: PeriodStats | null;
  isLoading?: boolean;
}

const periodLabels: Record<keyof PeriodStats, string> = {
  today: "Hoje",
  yesterday: "Ontem",
  last7days: "Últimos 7 dias"
};

const periodOrder: (keyof PeriodStats)[] = ["today", "yesterday", "last7days"];

function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR');
}

export function PeriodStatsTable({ periodStats, isLoading }: PeriodStatsTableProps) {
  const renderSkeletonRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
      <TableCell className="text-center"><Skeleton className="h-4 w-10 mx-auto" /></TableCell>
      <TableCell className="text-center"><Skeleton className="h-4 w-14 mx-auto" /></TableCell>
    </TableRow>
  );

  // Adapt data: if periodStats has nested produtos/chapas, flatten to totals
  const getMetrics = (key: keyof PeriodStats): PeriodMetrics | null => {
    if (!periodStats) return null;
    const data = periodStats[key] as any;
    // Handle both old format (with produtos/chapas) and new flat format
    if (data && typeof data.visits === 'number') {
      return data as PeriodMetrics;
    }
    if (data && data.produtos && data.chapas) {
      const visits = data.produtos.visits + data.chapas.visits;
      const leads = data.produtos.leads + data.chapas.leads;
      const conversionRate = visits > 0 ? ((leads / visits) * 100).toFixed(2) : '0.00';
      return { visits, leads, conversionRate };
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas por Período</CardTitle>
        <CardDescription>
          Visitas, leads e taxa de conversão
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Período</TableHead>
              <TableHead className="text-center">Visitas</TableHead>
              <TableHead className="text-center">Leads</TableHead>
              <TableHead className="text-center">Tx Conversão</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <>
                {renderSkeletonRow()}
                {renderSkeletonRow()}
                {renderSkeletonRow()}
              </>
            ) : periodStats ? (
              <>
                {periodOrder.map((periodKey) => {
                  const metrics = getMetrics(periodKey);
                  if (!metrics) return null;
                  return (
                    <TableRow key={periodKey}>
                      <TableCell className="font-medium">{periodLabels[periodKey]}</TableCell>
                      <TableCell className="text-center">{formatNumber(metrics.visits)}</TableCell>
                      <TableCell className="text-center">{formatNumber(metrics.leads)}</TableCell>
                      <TableCell className="text-center">{metrics.conversionRate}%</TableCell>
                    </TableRow>
                  );
                })}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Nenhum dado disponível
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
