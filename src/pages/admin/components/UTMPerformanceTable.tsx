import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface UTMPerformanceTableProps {
  title: string;
  description: string;
  columnLabel: string;
  data: Array<{
    name: string;
    visits: number;
    leads: number;
    conversionRate: string;
  }>;
  isLoading?: boolean;
  showFilter?: boolean;
  filterLabel?: string;
  filterOptions?: string[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
}

export function UTMPerformanceTable({
  title,
  description,
  columnLabel,
  data,
  isLoading = false,
  showFilter = false,
  filterLabel = "Filtrar",
  filterOptions = [],
  filterValue = "all",
  onFilterChange,
}: UTMPerformanceTableProps) {
  // Calculate totals
  const totalVisits = data.reduce((sum, row) => sum + row.visits, 0);
  const totalLeads = data.reduce((sum, row) => sum + row.leads, 0);
  const totalConversionRate = totalVisits > 0 
    ? ((totalLeads / totalVisits) * 100).toFixed(2) 
    : '0.00';

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {showFilter && filterOptions.length > 0 && (
            <Select value={filterValue} onValueChange={onFilterChange}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder={filterLabel} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Campanhas</SelectItem>
                {filterOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Sem dados para exibir
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">{columnLabel}</TableHead>
                <TableHead className="text-right">Visitas</TableHead>
                <TableHead className="text-right">Leads</TableHead>
                <TableHead className="text-right">Taxa de Conversão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-right">{row.visits.toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="text-right">{row.leads.toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="text-right">{row.conversionRate}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-muted/50 font-bold">
                <TableCell>TOTAL</TableCell>
                <TableCell className="text-right">{totalVisits.toLocaleString('pt-BR')}</TableCell>
                <TableCell className="text-right">{totalLeads.toLocaleString('pt-BR')}</TableCell>
                <TableCell className="text-right">{totalConversionRate}%</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
