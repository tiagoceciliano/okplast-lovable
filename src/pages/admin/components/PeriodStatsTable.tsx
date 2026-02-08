import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryMetrics {
  visits: number;
  leads: number;
  conversionRate: string;
}

interface PeriodMetrics {
  produtos: CategoryMetrics;
  chapas: CategoryMetrics;
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
      <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
      <TableCell className="text-center"><Skeleton className="h-4 w-10 mx-auto" /></TableCell>
      <TableCell className="text-center"><Skeleton className="h-4 w-14 mx-auto" /></TableCell>
    </TableRow>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas por Período</CardTitle>
        <CardDescription>
          Desempenho separado entre Produtos Sob Medida e Chapas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2} className="align-bottom border-r">Período</TableHead>
              <TableHead colSpan={3} className="text-center border-r bg-muted/30">PRODUTOS</TableHead>
              <TableHead colSpan={3} className="text-center bg-muted/30">CHAPAS</TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="text-center text-xs">Visitas</TableHead>
              <TableHead className="text-center text-xs">Leads</TableHead>
              <TableHead className="text-center text-xs border-r">Tx Conversão</TableHead>
              <TableHead className="text-center text-xs">Visitas</TableHead>
              <TableHead className="text-center text-xs">Leads</TableHead>
              <TableHead className="text-center text-xs">Tx Conversão</TableHead>
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
              periodOrder.map((periodKey) => {
                const data = periodStats[periodKey];
                return (
                  <TableRow key={periodKey}>
                    <TableCell className="font-medium border-r">{periodLabels[periodKey]}</TableCell>
                    <TableCell className="text-center">{formatNumber(data.produtos.visits)}</TableCell>
                    <TableCell className="text-center">{formatNumber(data.produtos.leads)}</TableCell>
                    <TableCell className="text-center border-r">{data.produtos.conversionRate}%</TableCell>
                    <TableCell className="text-center">{formatNumber(data.chapas.visits)}</TableCell>
                    <TableCell className="text-center">{formatNumber(data.chapas.leads)}</TableCell>
                    <TableCell className="text-center">{data.chapas.conversionRate}%</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
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
