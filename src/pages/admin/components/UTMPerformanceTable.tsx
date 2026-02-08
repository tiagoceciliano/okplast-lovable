import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SortField = "name" | "visits" | "leads" | "conversionRate";
type SortDirection = "asc" | "desc";

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
  const [sortField, setSortField] = useState<SortField>("visits");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "visits":
          comparison = a.visits - b.visits;
          break;
        case "leads":
          comparison = a.leads - b.leads;
          break;
        case "conversionRate":
          comparison = parseFloat(a.conversionRate) - parseFloat(b.conversionRate);
          break;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [data, sortField, sortDirection]);

  // Calculate totals
  const totalVisits = data.reduce((sum, row) => sum + row.visits, 0);
  const totalLeads = data.reduce((sum, row) => sum + row.leads, 0);
  const totalConversionRate = totalVisits > 0 
    ? ((totalLeads / totalVisits) * 100).toFixed(2) 
    : '0.00';

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortDirection === "asc" 
      ? <ArrowUp className="h-4 w-4 ml-1" /> 
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const SortableHeader = ({ field, children, className }: { field: SortField; children: React.ReactNode; className?: string }) => (
    <TableHead 
      className={cn("cursor-pointer select-none hover:bg-muted/50 transition-colors", className)}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center justify-end">
        {field === "name" ? (
          <>
            {children}
            <SortIcon field={field} />
          </>
        ) : (
          <>
            {children}
            <SortIcon field={field} />
          </>
        )}
      </div>
    </TableHead>
  );

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
                <SortableHeader field="name" className="w-[40%] [&>div]:justify-start">
                  {columnLabel}
                </SortableHeader>
                <SortableHeader field="visits">Visitas</SortableHeader>
                <SortableHeader field="leads">Leads</SortableHeader>
                <SortableHeader field="conversionRate">Taxa de Conversão</SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row, index) => (
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
