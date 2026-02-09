

# Plano: Adicionar KPI Card "Total" com Filtro de Data Personalizado

## Objetivo
Adicionar um quarto KPI card que mostra o total de leads de todo o período, com a opção de selecionar um intervalo de datas personalizado via date range picker.

## Layout Atualizado

```text
+------------------+  +------------------+  +------------------+  +------------------------+
|      HOJE        |  |      ONTEM       |  |   ÚLTIMOS 7 DIAS |  |   TOTAL PERÍODO        |
|                  |  |                  |  |                  |  |   [📅 Selecionar]      |
|  Produtos: 3     |  |  Produtos: 2     |  |  Produtos: 12    |  |                        |
|  Chapas: 2       |  |  Chapas: 1       |  |  Chapas: 8       |  |  Produtos: 21          |
|  ─────────       |  |  ─────────       |  |  ─────────       |  |  Chapas: 13            |
|  Total: 5        |  |  Total: 3        |  |  Total: 20       |  |  ─────────             |
+------------------+  +------------------+  +------------------+  |  Total: 34             |
                                                                  +------------------------+
```

## Comportamento

- **Padrão**: Mostra leads de todo o período (desde o primeiro registro)
- **Filtro**: Ao clicar no botão de calendário, abre um date range picker para selecionar intervalo personalizado
- **Feedback**: Exibe as datas selecionadas no header do card

## Detalhes Técnicos

### 1. Atualizar Edge Function (`get-dashboard-stats/index.ts`)

Adicionar suporte para filtro de data personalizado via query params:

```typescript
// Novos query params
const customStartDate = url.searchParams.get('customStartDate')
const customEndDate = url.searchParams.get('customEndDate')

// Adicionar no objeto leadsByPeriod
leadsByPeriod: {
  today: {...},
  yesterday: {...},
  last7days: {...},
  custom: calculateLeadsByPeriod(leads, customStart, customEnd)
}
```

### 2. Atualizar Interface no Dashboard.tsx

Adicionar estados para controle do filtro:
- `customDateRange: { from: Date | undefined, to: Date | undefined }`
- Adicionar `custom` ao tipo `LeadsByPeriod`

### 3. Atualizar Componente LeadsKPICards.tsx

Criar um novo card especial com:
- Botão de calendário no header
- Popover com Calendar em modo `range`
- Exibição das datas selecionadas
- Callback para quando as datas mudarem

Props adicionais:
```typescript
interface LeadsKPICardsProps {
  leadsByPeriod: {
    today: LeadsByPeriodItem;
    yesterday: LeadsByPeriodItem;
    last7days: LeadsByPeriodItem;
    custom: LeadsByPeriodItem;
  } | null;
  isLoading: boolean;
  customDateRange: { from: Date | undefined; to: Date | undefined };
  onCustomDateChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
}
```

### 4. Fluxo de Dados

1. Usuário abre o Dashboard -> API retorna `custom` com todos os leads (sem filtro de data)
2. Usuário seleciona datas -> `onCustomDateChange` é chamado
3. Dashboard atualiza estado e refaz requisição com `customStartDate` e `customEndDate`
4. Edge function calcula `custom` baseado nas datas fornecidas

### Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `supabase/functions/get-dashboard-stats/index.ts` | Adicionar query params e cálculo de `custom` |
| `src/pages/admin/components/LeadsKPICards.tsx` | Adicionar 4º card com date range picker |
| `src/pages/admin/Dashboard.tsx` | Adicionar estado de datas e passar para componente |

