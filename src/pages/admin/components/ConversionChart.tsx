import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartDataPoint {
  date: string;
  visits: number;
}

interface ConversionChartProps {
  data: ChartDataPoint[];
  isLoading?: boolean;
}

export function ConversionChart({ data, isLoading }: ConversionChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    dateFormatted: new Date(item.date).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    })
  }));

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Visitas nos Últimos 7 Dias</CardTitle>
        <CardDescription>Visualizações de página por dia</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isLoading ? (
          <div className="h-full w-full bg-muted animate-pulse rounded" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="dateFormatted" 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorVisits)"
                name="Visitas"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
