

# Plano: Corrigir Categorização por UTM Campaign

## Mudança de Lógica

**Antes (incorreto)**: Categorização baseada em `page_path`
- Chapas = páginas começando com `/chapas`
- Produtos = demais páginas

**Depois (correto)**: Categorização baseada em `utm_campaign`
- **Chapas** = utm_campaign **contém** "chapas" (ex: `chapas-policarbonato-rj`, `chapas-acm-rj`)
- **Produtos** = todo o resto (inclui `sobmedida-rj`, `institucional`, `imersao-dez25`, `pmax`, e visitas sem UTM)

## Campanhas Atuais no Banco

| Campanha | Categoria | Visitas | Leads |
|----------|-----------|---------|-------|
| sobmedida-rj | Produtos | 132 | 16 |
| institucional | Produtos | 7 | 2 |
| imersao-dez25 | Produtos | 15 | 0 |
| pmax | Produtos | 1 | 0 |
| (sem utm) | Produtos | 141 | 3 |
| chapas-policarbonato-rj | Chapas | 194 | 8 |
| chapas-ps-rj | Chapas | 74 | 0 |
| chapas-acm-rj | Chapas | 45 | 1 |
| chapas-acrilico-rj | Chapas | 42 | 3 |
| chapas-petg-rj | Chapas | 13 | 1 |
| chapas-pvc-rj | Chapas | 5 | 0 |

## Detalhes Técnicos

### Arquivo a Modificar
`supabase/functions/get-dashboard-stats/index.ts`

### Nova Lógica de Categorização

```typescript
// ANTES (baseado em page_path)
function isChapasPage(pagePath: string): boolean {
  return pagePath.startsWith('/chapas')
}

// DEPOIS (baseado em utm_campaign)
function isChapasVisit(utmCampaign: string | null): boolean {
  return utmCampaign?.includes('chapas') ?? false
}

function isChapasLead(utmCampaign: string | null): boolean {
  return utmCampaign?.includes('chapas') ?? false
}
```

### Alterações na Função calculateCategoryMetrics

1. Mudar filtro de visitas de `page_path` para `utm_campaign`
2. Mudar filtro de leads de `produto_interesse` para `utm_campaign`
3. Remover exclusões de páginas `/admin` (agora irrelevante)

```typescript
// Separar visitas por utm_campaign
const chapasVisits = periodVisits.filter(v => 
  v.utm_campaign?.includes('chapas')
)
const produtosVisits = periodVisits.filter(v => 
  !v.utm_campaign?.includes('chapas')
)

// Separar leads por utm_campaign
const chapasLeads = periodLeads.filter(l => 
  l.utm_campaign?.includes('chapas')
)
const produtosLeads = periodLeads.filter(l => 
  !l.utm_campaign?.includes('chapas')
)
```

### Impacto em Outras Partes do Código

A mesma lógica de categorização pode ser usada em:
- `campaignStats` - já agrupa por campanha
- `termStats` - já agrupa por termo

Apenas a tabela `periodStats` precisa da mudança.

