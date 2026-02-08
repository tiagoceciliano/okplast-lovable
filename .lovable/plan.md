

# Plano: Adicionar KPI Cards de Leads por Período

## Objetivo
Criar cards de KPI no topo do dashboard mostrando leads por período (Hoje, Ontem, Últimos 7 dias), categorizados pelo campo `produto_interesse` do formulário.

## Dados de Categorização

| Valor do Campo | Categoria |
|----------------|-----------|
| `Chapa Inteira ou Cortada` | Chapas |
| `Produto Personalizado` | Produtos |

## Layout dos Cards

Serão 3 cards no topo, cada um mostrando:
- **Período** (Hoje / Ontem / Últimos 7 dias)
- **Produtos**: X leads
- **Chapas**: X leads
- **Total**: X leads

```text
+------------------------+  +------------------------+  +------------------------+
|       HOJE             |  |       ONTEM            |  |   ÚLTIMOS 7 DIAS       |
|                        |  |                        |  |                        |
|  Produtos: 3           |  |  Produtos: 2           |  |  Produtos: 12          |
|  Chapas: 2             |  |  Chapas: 1             |  |  Chapas: 8             |
|  ─────────             |  |  ─────────             |  |  ─────────             |
|  Total: 5              |  |  Total: 3              |  |  Total: 20             |
+------------------------+  +------------------------+  +------------------------+
```

## Detalhes Técnicos

### 1. Atualizar Edge Function (`get-dashboard-stats/index.ts`)

Adicionar novo objeto `leadsByPeriod` na resposta:

```typescript
interface LeadsByPeriodItem {
  produtos: number
  chapas: number
  total: number
}

interface LeadsByPeriod {
  today: LeadsByPeriodItem
  yesterday: LeadsByPeriodItem
  last7days: LeadsByPeriodItem
}
```

Nova função para calcular leads por período baseado em `produto_interesse`:

```typescript
function calculateLeadsByPeriod(
  leads: any[],
  startDate: Date,
  endDate: Date
): LeadsByPeriodItem {
  const startISO = startDate.toISOString()
  const endISO = endDate.toISOString()

  const periodLeads = leads.filter(l => 
    l.created_at >= startISO && l.created_at <= endISO
  )

  const chapas = periodLeads.filter(l => 
    l.produto_interesse === 'Chapa Inteira ou Cortada'
  ).length
  
  const produtos = periodLeads.filter(l => 
    l.produto_interesse === 'Produto Personalizado'
  ).length

  return {
    produtos,
    chapas,
    total: produtos + chapas
  }
}
```

### 2. Criar Novo Componente `LeadsKPICards.tsx`

Localização: `src/pages/admin/components/LeadsKPICards.tsx`

Props:
```typescript
interface LeadsKPICardsProps {
  leadsByPeriod: {
    today: { produtos: number; chapas: number; total: number }
    yesterday: { produtos: number; chapas: number; total: number }
    last7days: { produtos: number; chapas: number; total: number }
  } | null
  isLoading: boolean
}
```

### 3. Atualizar Dashboard.tsx

- Importar o novo componente `LeadsKPICards`
- Adicionar `leadsByPeriod` na interface `DashboardStats`
- Renderizar os cards no topo, antes da tabela de métricas

### Ordem dos Elementos no Dashboard

1. **LeadsKPICards** (novo) - Cards de leads por período
2. PeriodStatsTable - Tabela de métricas por período (utm_campaign)
3. ConversionChart - Gráfico de visitas
4. PagesList - Top páginas e leads por produto
5. UTMPerformanceTable - Performance por campanha

