import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Package, Layers, Calendar as CalendarIcon, CalendarDays, CalendarRange, CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface LeadsByPeriodItem {
  produtos: number;
  chapas: number;
  total: number;
}

interface LeadsKPICardsProps {
  leadsByPeriod: {
    today: LeadsByPeriodItem;
    yesterday: LeadsByPeriodItem;
    last7days: LeadsByPeriodItem;
    custom: LeadsByPeriodItem;
  } | null;
  isLoading: boolean;
  customDateRange: DateRange | undefined;
  onCustomDateChange: (range: DateRange | undefined) => void;
}

interface KPICardProps {
  title: string;
  icon: React.ElementType;
  data: LeadsByPeriodItem | null;
  isLoading: boolean;
}

function KPICard({ title, icon: Icon, data, isLoading }: KPICardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16 mt-2" />
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Package className="h-3.5 w-3.5" />
                Produtos
              </span>
              <span className="font-medium">{data?.produtos ?? 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Layers className="h-3.5 w-3.5" />
                Chapas
              </span>
              <span className="font-medium">{data?.chapas ?? 0}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total</span>
                <span className="text-2xl font-bold">{data?.total ?? 0}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface CustomKPICardProps {
  data: LeadsByPeriodItem | null;
  isLoading: boolean;
  dateRange: DateRange | undefined;
  onDateChange: (range: DateRange | undefined) => void;
}

function CustomKPICard({ data, isLoading, dateRange, onDateChange }: CustomKPICardProps) {
  const getDateLabel = () => {
    if (!dateRange?.from) return "Todo período";
    if (!dateRange.to) return format(dateRange.from, "dd/MM/yyyy", { locale: ptBR });
    return `${format(dateRange.from, "dd/MM", { locale: ptBR })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {getDateLabel()}
        </CardTitle>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={onDateChange}
              numberOfMonths={2}
              locale={ptBR}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16 mt-2" />
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Package className="h-3.5 w-3.5" />
                Produtos
              </span>
              <span className="font-medium">{data?.produtos ?? 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Layers className="h-3.5 w-3.5" />
                Chapas
              </span>
              <span className="font-medium">{data?.chapas ?? 0}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total</span>
                <span className="text-2xl font-bold">{data?.total ?? 0}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function LeadsKPICards({ leadsByPeriod, isLoading, customDateRange, onCustomDateChange }: LeadsKPICardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Leads Hoje"
        icon={CalendarIcon}
        data={leadsByPeriod?.today ?? null}
        isLoading={isLoading}
      />
      <KPICard
        title="Leads Ontem"
        icon={CalendarDays}
        data={leadsByPeriod?.yesterday ?? null}
        isLoading={isLoading}
      />
      <KPICard
        title="Últimos 7 Dias"
        icon={CalendarRange}
        data={leadsByPeriod?.last7days ?? null}
        isLoading={isLoading}
      />
      <CustomKPICard
        data={leadsByPeriod?.custom ?? null}
        isLoading={isLoading}
        dateRange={customDateRange}
        onDateChange={onCustomDateChange}
      />
    </div>
  );
}
