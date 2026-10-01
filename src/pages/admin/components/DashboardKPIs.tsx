import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowUp, Minus, Calendar as CalendarIcon, CalendarDays, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeltaProps { current: number; previous: number | null; }
function Delta({ current, previous }: DeltaProps) {
  if (previous === null || previous === undefined) return null;
  const diff = current - previous;
  const pct = previous === 0 ? (current === 0 ? 0 : 100) : (diff / previous) * 100;
  const positive = diff > 0;
  const negative = diff < 0;
  const Icon = positive ? ArrowUp : negative ? ArrowDown : Minus;
  return (
    <div className={cn(
      "flex items-center gap-1 text-xs mt-1",
      positive && "text-emerald-600",
      negative && "text-red-600",
      !positive && !negative && "text-muted-foreground"
    )}>
      <Icon className="h-3 w-3" />
      <span>{diff > 0 ? "+" : ""}{diff} ({pct > 0 ? "+" : ""}{pct.toFixed(1)}%)</span>
      <span className="text-muted-foreground">vs {previous}</span>
    </div>
  );
}

interface KPIProps {
  title: string;
  icon: React.ElementType;
  value: number;
  previous?: number | null;
  isLoading: boolean;
  hint?: string | undefined;
}

function leadShare(part: number, total: number) {
  if (total <= 0) return undefined;
  return Math.min((part / total) * 100, 100).toFixed(1);
}

function KPI({ title, icon: Icon, value, previous, isLoading, hint }: KPIProps) {
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
          <>
            <div className="text-2xl font-bold">{value}</div>
            <Delta current={value} previous={previous ?? null} />
            {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface Props {
  isLoading: boolean;
  compareEnabled: boolean;
  periodLeads: number;
  previousPeriodLeads: number | null;
  periodGAdsLeads: number;
  previousPeriodGAdsLeads: number | null;
  todayLeads: number;
  yesterdayLeads: number;
  todayGAdsLeads: number;
  yesterdayGAdsLeads: number;
}

export function DashboardKPIs({
  isLoading, compareEnabled,
  periodLeads, previousPeriodLeads,
  periodGAdsLeads, previousPeriodGAdsLeads,
  todayLeads, yesterdayLeads,
  todayGAdsLeads, yesterdayGAdsLeads,
}: Props) {
  const periodGAdsShare = leadShare(periodGAdsLeads, periodLeads);
  const todayGAdsShare = leadShare(todayGAdsLeads, todayLeads);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPI
        title="Leads no período"
        icon={CalendarIcon}
        value={periodLeads}
        previous={compareEnabled ? previousPeriodLeads : null}
        isLoading={isLoading}
      />
      <KPI
        title="Leads Google Ads no período"
        icon={TrendingUp}
        value={periodGAdsLeads}
        previous={compareEnabled ? previousPeriodGAdsLeads : null}
        isLoading={isLoading}
        hint={periodGAdsShare ? `${periodGAdsShare}% do total (${periodLeads})` : undefined}
      />
      <KPI
        title="Leads Hoje"
        icon={CalendarDays}
        value={todayLeads}
        previous={yesterdayLeads}
        isLoading={isLoading}
        hint="vs. Ontem"
      />
      <KPI
        title="Leads Google Ads Hoje"
        icon={TrendingUp}
        value={todayGAdsLeads}
        previous={yesterdayGAdsLeads}
        isLoading={isLoading}
        hint={todayGAdsShare ? `${todayGAdsShare}% do total (${todayLeads}) · vs. Ontem` : "vs. Ontem"}
      />
    </div>
  );
}