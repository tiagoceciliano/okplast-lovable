
# Tabelas de Performance UTM com Totais

## Objetivo

Criar duas tabelas completas de performance no Dashboard:

1. **Tabela por UTM Campaign** - Linha inteira, com visitas, leads, taxa de conversao e linha de TOTAL
2. **Tabela por UTM Term** - Igual, com filtro por campanha e linha de TOTAL

Ambas incluirao dados sem UTM (trafego direto) para garantir que os totais fechem corretamente.

---

## Arquivos a Modificar

### 1. Edge Function: `supabase/functions/get-dashboard-stats/index.ts`

Adicionar dois novos campos no retorno:

**campaignStats** - Estatisticas por campanha:
```typescript
{
  campaign: string;      // Nome da campanha ou "(Direto)"
  visits: number;        // Visitantes unicos
  leads: number;         // Total de leads
  conversionRate: string; // Taxa em %
}[]
```

**termStats** - Estatisticas por termo:
```typescript
{
  term: string;          // Termo ou "(Sem termo)"
  campaign: string;      // Campanha associada
  visits: number;
  leads: number;
  conversionRate: string;
}[]
```

**Logica de calculo**:
- Agrupar visitas por `utm_campaign`, contando visitantes unicos (Set de visitor_id)
- Agrupar leads por `utm_campaign`
- Valores null/undefined serao rotulados como "(Direto)" ou "(Sem termo)"
- Calcular taxa: `(leads / visitantes_unicos) * 100`
- Ordenar por visitas decrescente

---

### 2. Novo Componente: `src/pages/admin/components/UTMPerformanceTable.tsx`

Componente reutilizavel com:

**Props**:
```typescript
interface UTMPerformanceTableProps {
  title: string;
  description: string;
  columnLabel: string; // "Campanha" ou "Termo"
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
```

**Layout**:
```
+----------------------------------------------------------+
| Performance por Campanha                                  |
| Visitas, leads e conversao por utm_campaign              |
+----------------------------------------------------------+
| Campanha        | Visitas | Leads | Taxa de Conversao    |
|-----------------|---------|-------|----------------------|
| black-friday    |    245  |   12  | 4.89%               |
| lancamento      |    180  |    8  | 4.44%               |
| (Direto)        |    120  |    5  | 4.16%               |
|-----------------|---------|-------|----------------------|
| **TOTAL**       |**545**  |**25** | **4.58%**           |
+----------------------------------------------------------+
```

**Caracteristicas**:
- Card ocupando largura total (`w-full`)
- Linha de TOTAL no rodape com estilo destacado (bold, background)
- Filtro opcional no header (Select)
- Skeleton loading
- Mensagem quando sem dados

---

### 3. Dashboard: `src/pages/admin/Dashboard.tsx`

**Atualizar interface DashboardStats**:
```typescript
interface DashboardStats {
  // ... campos existentes
  campaignStats: Array<{
    campaign: string;
    visits: number;
    leads: number;
    conversionRate: string;
  }>;
  termStats: Array<{
    term: string;
    campaign: string;
    visits: number;
    leads: number;
    conversionRate: string;
  }>;
}
```

**Adicionar estado para filtro de campanha**:
```typescript
const [campaignFilter, setCampaignFilter] = useState<string>("all");
```

**Calcular dados filtrados e totais**:
```typescript
// Filtrar termos por campanha selecionada
const filteredTermStats = useMemo(() => {
  if (campaignFilter === "all") return stats?.termStats || [];
  return (stats?.termStats || []).filter(t => t.campaign === campaignFilter);
}, [stats?.termStats, campaignFilter]);

// Calcular totais de campanha
const campaignTotals = useMemo(() => {
  const data = stats?.campaignStats || [];
  return {
    visits: data.reduce((sum, c) => sum + c.visits, 0),
    leads: data.reduce((sum, c) => sum + c.leads, 0),
    conversionRate: /* calcular */
  };
}, [stats?.campaignStats]);
```

**Adicionar tabelas apos PagesList**:
```tsx
{/* Tabela Campaign - Linha Inteira */}
<UTMPerformanceTable
  title="Performance por Campanha"
  description="Visitas, leads e conversao por utm_campaign"
  columnLabel="Campanha"
  data={campaignData}
  totals={campaignTotals}
  isLoading={isLoading}
/>

{/* Tabela Term - Linha Inteira com Filtro */}
<UTMPerformanceTable
  title="Performance por Termo"
  description="Visitas, leads e conversao por utm_term"
  columnLabel="Termo"
  data={termData}
  totals={termTotals}
  isLoading={isLoading}
  showFilter
  filterLabel="Filtrar por Campanha"
  filterOptions={uniqueCampaigns}
  filterValue={campaignFilter}
  onFilterChange={setCampaignFilter}
/>
```

---

## Detalhes da Edge Function

Codigo adicional para calcular metricas por UTM:

```typescript
// Campaign Stats - visitantes unicos por campanha
const campaignVisitors: Record<string, Set<string>> = {}
const campaignLeadCounts: Record<string, number> = {}

visits?.forEach(v => {
  const campaign = v.utm_campaign || '(Direto)'
  if (!campaignVisitors[campaign]) {
    campaignVisitors[campaign] = new Set()
  }
  campaignVisitors[campaign].add(v.visitor_id)
})

leads?.forEach(l => {
  const campaign = l.utm_campaign || '(Direto)'
  campaignLeadCounts[campaign] = (campaignLeadCounts[campaign] || 0) + 1
})

const campaignStats = Object.keys(campaignVisitors)
  .map(campaign => {
    const uniqueVisits = campaignVisitors[campaign].size
    const leadCount = campaignLeadCounts[campaign] || 0
    const rate = uniqueVisits > 0 
      ? ((leadCount / uniqueVisits) * 100).toFixed(2) 
      : '0.00'
    return {
      campaign,
      visits: uniqueVisits,
      leads: leadCount,
      conversionRate: rate
    }
  })
  .sort((a, b) => b.visits - a.visits)

// Term Stats - similar, mantendo referencia a campaign
const termVisitors: Record<string, { visitors: Set<string>; campaign: string }> = {}
const termLeadCounts: Record<string, { count: number; campaign: string }> = {}

visits?.forEach(v => {
  const term = v.utm_term || '(Sem termo)'
  const campaign = v.utm_campaign || '(Direto)'
  const key = `${term}|${campaign}`
  
  if (!termVisitors[key]) {
    termVisitors[key] = { visitors: new Set(), campaign }
  }
  termVisitors[key].visitors.add(v.visitor_id)
})

leads?.forEach(l => {
  const term = l.utm_term || '(Sem termo)'
  const campaign = l.utm_campaign || '(Direto)'
  const key = `${term}|${campaign}`
  
  if (!termLeadCounts[key]) {
    termLeadCounts[key] = { count: 0, campaign }
  }
  termLeadCounts[key].count++
})

const termStats = Object.entries(termVisitors)
  .map(([key, { visitors, campaign }]) => {
    const [term] = key.split('|')
    const uniqueVisits = visitors.size
    const leadCount = termLeadCounts[key]?.count || 0
    const rate = uniqueVisits > 0 
      ? ((leadCount / uniqueVisits) * 100).toFixed(2) 
      : '0.00'
    return {
      term,
      campaign,
      visits: uniqueVisits,
      leads: leadCount,
      conversionRate: rate
    }
  })
  .sort((a, b) => b.visits - a.visits)
```

---

## Garantia de Totais Corretos

Para que os totais fechem:

1. **Todos os registros sao contabilizados** - valores null/undefined de UTM recebem labels explicitos ("(Direto)", "(Sem termo)")
2. **Linha de TOTAL** - soma de todas as linhas da tabela
3. **Taxa de conversao do TOTAL** - recalculada com base na soma (nao media das taxas)

```typescript
// Calculo correto da taxa total
const totalVisits = data.reduce((sum, row) => sum + row.visits, 0);
const totalLeads = data.reduce((sum, row) => sum + row.leads, 0);
const totalRate = totalVisits > 0 
  ? ((totalLeads / totalVisits) * 100).toFixed(2) 
  : '0.00';
```

---

## Resultado Visual Final

```
+------------------------------------------------------------------+
| Performance por Campanha                                          |
| Visitas, leads e conversao por utm_campaign                      |
+------------------------------------------------------------------+
| Campanha             | Visitas  | Leads  | Taxa de Conversao     |
|----------------------|----------|--------|----------------------|
| black-friday-2024    |      245 |     12 | 4.89%                |
| lancamento-produto   |      180 |      8 | 4.44%                |
| remarketing-jan      |      120 |      5 | 4.16%                |
| (Direto)             |       98 |      3 | 3.06%                |
|----------------------|----------|--------|----------------------|
| **TOTAL**            |  **643** | **28** | **4.35%**            |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| Performance por Termo                                             |
| Visitas, leads e conversao por utm_term                          |
| Campanha: [ Todas as Campanhas          v ]                      |
+------------------------------------------------------------------+
| Termo                | Visitas  | Leads  | Taxa de Conversao     |
|----------------------|----------|--------|----------------------|
| acrilico-sob-medida  |       85 |      4 | 4.70%                |
| display-acrilico     |       62 |      3 | 4.83%                |
| urna-votacao         |       45 |      2 | 4.44%                |
| (Sem termo)          |      451 |     19 | 4.21%                |
|----------------------|----------|--------|----------------------|
| **TOTAL**            |  **643** | **28** | **4.35%**            |
+------------------------------------------------------------------+
```
