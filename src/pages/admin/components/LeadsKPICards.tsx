import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, CalendarDays, CalendarRange, CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface LeadsByPeriodItem {
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
  total: number;
  isLoading: boolean;
}

function KPICard({ title, icon: Icon, total, isLoading }: KPICardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold">{total}</div>
        )}
      </CardContent>
    </Card>
  );
}

interface CustomKPICardProps {
  total: number;
  isLoading: boolean;
  dateRange: DateRange | undefined;
  onDateChange: (range: DateRange | undefined) => void;
}

function CustomKPICard({ total, isLoading, dateRange, onDateChange }: CustomKPICardProps) {
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
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold">{total}</div>
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
        total={leadsByPeriod?.today?.total ?? 0}
        isLoading={isLoading}
      />
      <KPICard
        title="Leads Ontem"
        icon={CalendarDays}
        total={leadsByPeriod?.yesterday?.total ?? 0}
        isLoading={isLoading}
      />
      <KPICard
        title="Últimos 7 Dias"
        icon={CalendarRange}
        total={leadsByPeriod?.last7days?.total ?? 0}
        isLoading={isLoading}
      />
      <CustomKPICard
        total={leadsByPeriod?.custom?.total ?? 0}
        isLoading={isLoading}
        dateRange={customDateRange}
        onDateChange={onCustomDateChange}
      />
    </div>
  );
}
