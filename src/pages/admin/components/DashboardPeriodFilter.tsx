import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subWeeks, subMonths, differenceInCalendarDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export type PresetKey = "today" | "yesterday" | "this_week" | "last_week" | "this_month" | "last_month" | "custom";

export interface DashboardPeriodState {
  preset: PresetKey;
  range: { from: Date; to: Date };
  compareEnabled: boolean;
  compareRange: { from: Date; to: Date } | null;
}

interface Props {
  value: DashboardPeriodState;
  onChange: (v: DashboardPeriodState) => void;
}

export function computeRangeFromPreset(preset: PresetKey, now = new Date()): { from: Date; to: Date } {
  switch (preset) {
    case "today": return { from: now, to: now };
    case "yesterday": { const d = subDays(now, 1); return { from: d, to: d }; }
    case "this_week": return { from: startOfWeek(now, { weekStartsOn: 1 }), to: endOfWeek(now, { weekStartsOn: 1 }) };
    case "last_week": { const lw = subWeeks(now, 1); return { from: startOfWeek(lw, { weekStartsOn: 1 }), to: endOfWeek(lw, { weekStartsOn: 1 }) }; }
    case "this_month": return { from: startOfMonth(now), to: endOfMonth(now) };
    case "last_month": { const lm = subMonths(now, 1); return { from: startOfMonth(lm), to: endOfMonth(lm) }; }
    default: return { from: now, to: now };
  }
}

export function computeCompareForPreset(preset: PresetKey, range: { from: Date; to: Date }): { from: Date; to: Date } {
  switch (preset) {
    case "today": { const d = subDays(range.from, 1); return { from: d, to: d }; }
    case "yesterday": { const d = subDays(range.from, 1); return { from: d, to: d }; }
    case "this_week":
    case "last_week": {
      const from = subWeeks(range.from, 1);
      const to = subWeeks(range.to, 1);
      return { from, to };
    }
    case "this_month":
    case "last_month": {
      const from = startOfMonth(subMonths(range.from, 1));
      const to = endOfMonth(subMonths(range.from, 1));
      return { from, to };
    }
    default: {
      const days = differenceInCalendarDays(range.to, range.from) + 1;
      const to = subDays(range.from, 1);
      const from = subDays(to, days - 1);
      return { from, to };
    }
  }
}

const PRESETS: { key: PresetKey; label: string }[] = [
  { key: "today", label: "Hoje" },
  { key: "yesterday", label: "Ontem" },
  { key: "this_week", label: "Esta semana" },
  { key: "last_week", label: "Semana passada" },
  { key: "this_month", label: "Este mês" },
  { key: "last_month", label: "Mês passado" },
];

function fmtRange(r: { from: Date; to: Date } | null | undefined) {
  if (!r) return "—";
  const sameDay = format(r.from, "yyyy-MM-dd") === format(r.to, "yyyy-MM-dd");
  if (sameDay) return format(r.from, "dd/MM/yyyy", { locale: ptBR });
  return `${format(r.from, "dd/MM", { locale: ptBR })} - ${format(r.to, "dd/MM/yyyy", { locale: ptBR })}`;
}

export function DashboardPeriodFilter({ value, onChange }: Props) {
  const dateRange: DateRange = useMemo(() => ({ from: value.range.from, to: value.range.to }), [value.range]);
  const compareRange: DateRange | undefined = useMemo(() =>
    value.compareRange ? { from: value.compareRange.from, to: value.compareRange.to } : undefined,
    [value.compareRange]
  );

  const setPreset = (preset: PresetKey) => {
    const range = computeRangeFromPreset(preset);
    const compareRange = value.compareEnabled ? computeCompareForPreset(preset, range) : null;
    onChange({ ...value, preset, range, compareRange });
  };

  const setCustomRange = (r: DateRange | undefined) => {
    if (!r?.from) return;
    const range = { from: r.from, to: r.to ?? r.from };
    const compareRange = value.compareEnabled ? computeCompareForPreset("custom", range) : null;
    onChange({ ...value, preset: "custom", range, compareRange });
  };

  const setCompareRange = (r: DateRange | undefined) => {
    if (!r?.from) return;
    onChange({ ...value, compareRange: { from: r.from, to: r.to ?? r.from } });
  };

  const toggleCompare = (enabled: boolean) => {
    const compareRange = enabled ? computeCompareForPreset(value.preset, value.range) : null;
    onChange({ ...value, compareEnabled: enabled, compareRange });
  };

  return (
    <Card>
      <CardContent className="pt-4 pb-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map(p => (
            <Button
              key={p.key}
              size="sm"
              variant={value.preset === p.key ? "default" : "outline"}
              onClick={() => setPreset(p.key)}
            >
              {p.label}
            </Button>
          ))}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant={value.preset === "custom" ? "default" : "outline"}
                className="gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                {value.preset === "custom" ? fmtRange(value.range) : "Personalizado"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setCustomRange}
                numberOfMonths={2}
                locale={ptBR}
                weekStartsOn={1}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1 border-t">
          <div className="flex items-center gap-2 pt-3">
            <Switch id="compare-toggle" checked={value.compareEnabled} onCheckedChange={toggleCompare} />
            <Label htmlFor="compare-toggle" className="text-sm">Comparar períodos</Label>
          </div>
          {value.compareEnabled && (
            <div className="flex items-center gap-2 pt-3">
              <span className="text-xs text-muted-foreground">Comparar com:</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {fmtRange(value.compareRange)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={compareRange}
                    onSelect={setCompareRange}
                    numberOfMonths={2}
                    locale={ptBR}
                    weekStartsOn={1}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}