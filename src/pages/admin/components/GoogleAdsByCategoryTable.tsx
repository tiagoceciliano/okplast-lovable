import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Row { category: string; count: number; }

interface Props {
  current: Row[];
  previous: Row[] | null;
  compareEnabled: boolean;
  isLoading: boolean;
}

function DeltaCell({ current, previous }: { current: number; previous: number }) {
  const diff = current - previous;
  const pct = previous === 0 ? (current === 0 ? 0 : 100) : (diff / previous) * 100;
  const Icon = diff > 0 ? ArrowUp : diff < 0 ? ArrowDown : Minus;
  return (
    <div className={cn(
      "flex items-center justify-end gap-1 text-sm",
      diff > 0 && "text-emerald-600",
      diff < 0 && "text-red-600",
      diff === 0 && "text-muted-foreground"
    )}>
      <Icon className="h-3 w-3" />
      <span>{diff > 0 ? "+" : ""}{diff} ({pct > 0 ? "+" : ""}{pct.toFixed(1)}%)</span>
    </div>
  );
}

export function GoogleAdsByCategoryTable({ current, previous, compareEnabled, isLoading }: Props) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-6 w-64" /></CardHeader>
        <CardContent><Skeleton className="h-32 w-full" /></CardContent>
      </Card>
    );
  }

  const previousMap = new Map((previous || []).map(r => [r.category, r.count]));
  const categories = new Set<string>(current.map(r => r.category));
  if (compareEnabled && previous) previous.forEach(r => categories.add(r.category));
  const currentMap = new Map(current.map(r => [r.category, r.count]));

  const rows = Array.from(categories).map(cat => ({
    category: cat,
    count: currentMap.get(cat) || 0,
    previous: previousMap.get(cat) || 0,
  })).sort((a, b) => b.count - a.count);

  const total = rows.reduce((s, r) => s + r.count, 0);
  const totalPrev = rows.reduce((s, r) => s + r.previous, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads Google Ads por categoria</CardTitle>
        <CardDescription>Distribuição por produto de interesse (utm_source = googleads)</CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Nenhum lead Google Ads no período</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Leads</TableHead>
                {compareEnabled && <TableHead className="text-right">Período anterior</TableHead>}
                {compareEnabled && <TableHead className="text-right">Variação</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(r => (
                <TableRow key={r.category}>
                  <TableCell className="font-medium">{r.category}</TableCell>
                  <TableCell className="text-right">{r.count}</TableCell>
                  {compareEnabled && <TableCell className="text-right">{r.previous}</TableCell>}
                  {compareEnabled && (
                    <TableCell className="text-right">
                      <DeltaCell current={r.count} previous={r.previous} />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-muted/50 font-bold">
                <TableCell>TOTAL</TableCell>
                <TableCell className="text-right">{total}</TableCell>
                {compareEnabled && <TableCell className="text-right">{totalPrev}</TableCell>}
                {compareEnabled && (
                  <TableCell className="text-right">
                    <DeltaCell current={total} previous={totalPrev} />
                  </TableCell>
                )}
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}