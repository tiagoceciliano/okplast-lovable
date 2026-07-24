# Melhorias no Dashboard Admin

Foco em três blocos: **filtro global de período com comparação**, **KPIs de leads (total + Google Ads)** e **detalhamento por categoria dos leads Google Ads**. O filtro do topo controla **toda** a página — todos os cards, tabelas e gráficos abaixo respondem a ele.

## 1. Filtro global de período (topo do Dashboard)

Novo componente `DashboardPeriodFilter` no topo, cujo estado alimenta **todas** as seções da página (KPIs, gráfico de visitas, top páginas, performance por campanha e nova tabela Google Ads por categoria). Nenhum bloco terá seu próprio seletor de período.

- **Presets rápidos**:
  - Hoje
  - Ontem
  - Esta semana (segunda a domingo)
  - Semana passada (segunda a domingo)
  - Este mês
  - Mês passado
  - Personalizado (calendário range)
- **Toggle "Comparar períodos"**: mostra um segundo intervalo (Comparar com…). Ao ligar, sugere automaticamente o período anterior equivalente:
  - Hoje → Ontem
  - Ontem → Anteontem
  - Esta semana → Semana passada
  - Semana passada → 2 semanas atrás
  - Este mês → Mês passado
  - Mês passado → 2 meses atrás
  - Personalizado → janela imediatamente anterior de mesmo tamanho (editável)
- Semana com `weekStartsOn: 1` (segunda) e timezone America/Sao_Paulo.
- Remover o seletor de período que hoje vive dentro de `UTMPerformanceTable` — vira controlado.

## 2. KPI Cards

Quatro cards, cada um com **valor do período + variação vs. período de comparação** (Δ absoluto e %, seta colorida). Sem "Comparar", só o valor.

1. **Leads no período** — total de `leads` no intervalo do filtro.
2. **Leads Google Ads no período** — `utm_source = 'googleads'`.
3. **Leads Hoje** — âncora fixa hoje vs. ontem (não depende do filtro).
4. **Leads Google Ads Hoje** — âncora fixa hoje vs. ontem, `utm_source = 'googleads'`.

## 3. Google Ads — Leads por categoria

Nova tabela **"Leads Google Ads por categoria"** logo abaixo dos KPIs, respeitando o filtro global.

- Colunas: Categoria (`produto_interesse`) · Leads no período · Leads no período de comparação · Δ / %.
- Sem comparação: só Categoria e Leads.
- Ordenação por leads desc. Linha total no rodapé.

## 4. Layout final

```text
[Título]
[Filtro global: presets + calendário + toggle Comparar + intervalo de comparação]
[KPI 1: Leads período] [KPI 2: GAds período] [KPI 3: Hoje] [KPI 4: GAds Hoje]
[Tabela: Leads Google Ads por categoria]
[Gráfico Visitas — usa o mesmo período]
[Top páginas — usa o mesmo período]
[Performance por Campanha — usa o mesmo período, sem seletor próprio]
```

`PeriodStatsTable` (visitas por categoria em Hoje/Ontem/7d) é removida — os novos KPIs cobrem esse acompanhamento e ela tem período próprio que conflita com o filtro global.

## Detalhes técnicos

- **Edge function `get-dashboard-stats`**: passa a aceitar `startDate`, `endDate`, `compareStartDate`, `compareEndDate` e retorna, para **ambos** os intervalos:
  - total de leads, leads Google Ads, visitas diárias (chart), top páginas, campaign stats, leads Google Ads por categoria.
  - Cards "Hoje" e "GAds Hoje" continuam calculados com intervalos fixos (hoje/ontem) no server.
- **Novas RPCs no banco** (SECURITY DEFINER, `search_path=''`, padrão das existentes):
  - `get_google_ads_leads_count(p_start, p_end)` → total.
  - `get_google_ads_leads_by_category(p_start, p_end)` → agrupado por `produto_interesse`.
  - Filtro fixo: `utm_source = 'googleads'`.
- **Front**:
  - `DashboardPeriodFilter` novo em `src/pages/admin/components/`.
  - `DashboardKPIs` substitui `LeadsKPICards`, aceita `{ current, previous, compareEnabled }` e renderiza delta.
  - `GoogleAdsByCategoryTable` novo.
  - `Dashboard.tsx` centraliza o estado `{ range, compareRange, compareEnabled }` e repassa para todos os blocos.
  - `UTMPerformanceTable` deixa de ter `periodValue`/`onPeriodChange`.
  - Cálculo dos intervalos usa `date-fns` com `startOfWeek/endOfWeek({ weekStartsOn: 1 })`, `startOfMonth/endOfMonth`, ajustando para SP como já feito no server.
