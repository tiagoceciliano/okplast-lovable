
# Plano: Nova Tabela de KPIs por Período e Categoria

## Objetivo
Substituir os 4 cards de KPI atuais por uma tabela que mostra as métricas divididas por:
- **Linhas**: Hoje, Ontem, Últimos 7 dias
- **Colunas**: Duas seções - Produtos (Visitas, Leads, Tx Conversão) e Chapas (Visitas, Leads, Tx Conversão)

## Estrutura da Nova Tabela

```text
┌─────────────────┬─────────────────────────────────────┬─────────────────────────────────────┐
│                 │            PRODUTOS                 │            CHAPAS                   │
│    PERÍODO      ├───────────┬────────┬───────────────┼───────────┬────────┬───────────────┤
│                 │  Visitas  │ Leads  │ Tx Conversão  │  Visitas  │ Leads  │ Tx Conversão  │
├─────────────────┼───────────┼────────┼───────────────┼───────────┼────────┼───────────────┤
│ Hoje            │    45     │   3    │    6.67%      │    23     │   1    │    4.35%      │
├─────────────────┼───────────┼────────┼───────────────┼───────────┼────────┼───────────────┤
│ Ontem           │    52     │   4    │    7.69%      │    31     │   2    │    6.45%      │
├─────────────────┼───────────┼────────┼───────────────┼───────────┼────────┼───────────────┤
│ Últimos 7 dias  │   320     │  18    │    5.63%      │   180     │   8    │    4.44%      │
└─────────────────┴───────────┴────────┴───────────────┴───────────┴────────┴───────────────┘
```

## Lógica de Categorização

**Visitas de Chapas** - Páginas que começam com `/chapas`:
- `/chapas`, `/chapas/acrilico`, `/chapas/acm`, `/chapas/petg`, etc.

**Visitas de Produtos** - Demais páginas do site (exceto admin):
- `/`, `/acrilico-sob-medida`, `/acrilico-sob-medida/placa-personalizada`, etc.

**Leads de Chapas** - Campo `produto_interesse = 'Chapa Inteira ou Cortada'`

**Leads de Produtos** - Campo `produto_interesse = 'Produto Personalizado'`

## Detalhes Técnicos

### 1. Backend - Edge Function (get-dashboard-stats)
Adicionar nova estrutura de dados `periodStats` que retorna métricas para cada período:

```typescript
// Definir início e fim de cada período em São Paulo timezone
const todayStart = // início do dia atual
const yesterdayStart = // início de ontem
const yesterdayEnd = // fim de ontem
const last7DaysStart = // 7 dias atrás

// Calcular para cada período:
periodStats: {
  today: {
    produtos: { visits, leads, conversionRate },
    chapas: { visits, leads, conversionRate }
  },
  yesterday: {
    produtos: { visits, leads, conversionRate },
    chapas: { visits, leads, conversionRate }
  },
  last7days: {
    produtos: { visits, leads, conversionRate },
    chapas: { visits, leads, conversionRate }
  }
}
```

### 2. Frontend - Novo Componente
Criar `PeriodStatsTable.tsx` para substituir `StatsCards`:
- Tabela com cabeçalhos de 2 níveis (Produtos | Chapas)
- 3 linhas de dados (Hoje, Ontem, Últimos 7 dias)
- Formatação numérica brasileira
- Estado de loading com skeleton

### 3. Dashboard
- Remover importação e uso de `StatsCards`
- Remover seletor de período do header (métricas são fixas)
- Adicionar novo componente `PeriodStatsTable`

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `supabase/functions/get-dashboard-stats/index.ts` | Adicionar cálculo de `periodStats` com separação por categoria e período |
| `src/pages/admin/components/PeriodStatsTable.tsx` | **CRIAR** - Novo componente de tabela |
| `src/pages/admin/Dashboard.tsx` | Substituir `StatsCards` por `PeriodStatsTable`, remover seletor de período |
| `src/pages/admin/components/StatsCards.tsx` | Pode ser mantido ou removido após a migração |
