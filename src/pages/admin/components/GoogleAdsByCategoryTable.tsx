import { Fragment } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface Row {
  category: string;
  visits: number;
  leads: number;
  conversionRate: number;
  children?: { category: string; leads: number }[];
}

interface Props {
  current: Row[];
  isLoading: boolean;
}

export function GoogleAdsByCategoryTable({ current, isLoading }: Props) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-6 w-64" /></CardHeader>
        <CardContent><Skeleton className="h-32 w-full" /></CardContent>
      </Card>
    );
  }

  const rows = [...current].sort((a, b) => b.leads - a.leads || b.visits - a.visits);
  const totalVisits = rows.reduce((s, r) => s + r.visits, 0);
  const totalLeads = rows.reduce((s, r) => s + r.leads, 0);
  const totalConv = totalVisits > 0 ? (totalLeads / totalVisits) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Google Ads por categoria</CardTitle>
        <CardDescription>Visitas, leads e conversão por categoria (utm_source = googleads)</CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Sem tráfego Google Ads no período</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Visitas</TableHead>
                <TableHead className="text-right">Leads</TableHead>
                <TableHead className="text-right">Conversão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(r => (
                <Fragment key={r.category}>
                  <TableRow>
                    <TableCell className="font-medium">{r.category}</TableCell>
                    <TableCell className="text-right">{r.visits}</TableCell>
                    <TableCell className="text-right">{r.leads}</TableCell>
                    <TableCell className="text-right">{r.conversionRate.toFixed(2)}%</TableCell>
                  </TableRow>
                  {r.children?.map(c => (
                    <TableRow key={`${r.category}-${c.category}`} className="bg-muted/20">
                      <TableCell className="pl-8 text-muted-foreground text-sm">└ {c.category}</TableCell>
                      <TableCell
                        className="text-right text-muted-foreground"
                        title="Visitas não podem ser separadas: página compartilhada"
                      >
                        —
                      </TableCell>
                      <TableCell className="text-right">{c.leads}</TableCell>
                      <TableCell
                        className="text-right text-muted-foreground"
                        title="Conversão não pode ser separada: página compartilhada"
                      >
                        —
                      </TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-muted/50 font-bold">
                <TableCell>TOTAL</TableCell>
                <TableCell className="text-right">{totalVisits}</TableCell>
                <TableCell className="text-right">{totalLeads}</TableCell>
                <TableCell className="text-right">{totalConv.toFixed(2)}%</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}