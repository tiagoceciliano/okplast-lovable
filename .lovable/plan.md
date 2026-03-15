

# Fix: Dashboard não puxa todos os dados do banco

## Problema
O banco tem 1237 leads e 10258 visitas, mas o dashboard mostra números menores. Mesmo com `.limit(50000)`, o PostgREST pode estar ignorando limites acima do padrão configurado (1000).

## Solução: Migrar para agregação SQL via RPC

Em vez de buscar todas as linhas e contar no JavaScript (sujeito ao limite do PostgREST), criar **funções SQL no banco** que fazem a contagem diretamente — sem limite de linhas.

### 1. Criar funções SQL no banco (migration)

**Função `get_leads_count_by_period`**: Conta leads agrupados por `produto_interesse` dentro de um intervalo de datas.

```sql
CREATE FUNCTION get_leads_count_by_period(p_start timestamptz, p_end timestamptz)
RETURNS TABLE(produtos bigint, chapas bigint, total bigint)
AS $$
  SELECT 
    COUNT(*) FILTER (WHERE produto_interesse = 'Produto Personalizado') as produtos,
    COUNT(*) FILTER (WHERE produto_interesse = 'Chapa Inteira ou Cortada') as chapas,
    COUNT(*) as total
  FROM leads
  WHERE created_at >= p_start AND created_at <= p_end;
$$
```

**Função `get_visits_count_by_period`**: Conta visitantes únicos por categoria (chapas vs produtos) baseado em `utm_campaign`.

**Função `get_top_pages`**: Retorna top páginas por contagem.

**Função `get_campaign_stats`**: Retorna visits/leads/conversão por campanha.

### 2. Atualizar Edge Function (`get-dashboard-stats/index.ts`)

Substituir os dois `SELECT *` gigantes por chamadas `supabase.rpc(...)`:

```typescript
// Antes (sujeito a limite de 1000):
const { data: visits } = await supabase.from('page_visits').select('*').limit(50000)

// Depois (sem limite, agregação no banco):
const { data: todayLeads } = await supabase.rpc('get_leads_count_by_period', {
  p_start: todayStart.toISOString(),
  p_end: todayEnd.toISOString()
})
```

### 3. Arquivos a modificar

| Arquivo | Alteração |
|---------|-----------|
| Migration SQL | Criar 4-5 funções RPC de agregação |
| `supabase/functions/get-dashboard-stats/index.ts` | Trocar SELECT * por chamadas RPC |

### Benefícios
- Dados 100% precisos (sem truncamento)
- Muito mais rápido (banco agrega em vez de transferir 10k+ linhas)
- Escala para qualquer volume de dados

