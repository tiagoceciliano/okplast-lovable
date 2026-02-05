

# Plano: Sistema de Rastreamento de Visitas para Calculo de Taxa de Conversao

## Objetivo

Criar uma tabela `page_visits` no banco de dados para registrar todas as visitas ao site, capturando UTMs e dados do visitante. Isso permitira cruzar com a tabela `leads` e calcular a taxa de conversao por campanha.

---

## Arquitetura da Solucao

```text
+------------------+       +-------------------+       +------------------+
|   Usuario        |       |   Frontend        |       |   Edge Function  |
|   Acessa Site    | ----> |   Hook useVisit   | ----> |   track-visit    |
|   com UTMs       |       |   (captura UTMs)  |       |   (salva no DB)  |
+------------------+       +-------------------+       +------------------+
                                                              |
                                                              v
                                                       +------------------+
                                                       |   Tabela         |
                                                       |   page_visits    |
                                                       +------------------+
                                                              |
                                                              v
                                                       +------------------+
                                                       |   Cruzamento     |
                                                       |   visits x leads |
                                                       +------------------+
```

---

## Etapa 1: Criar Tabela page_visits no Banco

Nova tabela para armazenar cada visita unica:

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | uuid | ID unico da visita |
| visitor_id | text | ID anonimo do visitante (localStorage) |
| session_id | text | ID da sessao atual |
| page_url | text | URL completa visitada |
| page_path | text | Apenas o path (ex: /acrilico-sob-medida) |
| referrer | text | URL de origem |
| utm_source | text | Parametro utm_source |
| utm_medium | text | Parametro utm_medium |
| utm_campaign | text | Parametro utm_campaign |
| utm_term | text | Parametro utm_term |
| utm_content | text | Parametro utm_content |
| user_agent | text | Navegador/dispositivo |
| ip_address | text | IP do visitante |
| cidade | text | Cidade (via geolocalizacao) |
| estado | text | Estado (via geolocalizacao) |
| pais | text | Pais (via geolocalizacao) |
| created_at | timestamp | Data/hora da visita |

**RLS Policy**: Permitir INSERT sem autenticacao (visitantes anonimos)

---

## Etapa 2: Criar Edge Function track-visit

Nova edge function para processar a visita no backend:

```typescript
// supabase/functions/track-visit/index.ts

- Recebe dados da visita via POST
- Captura IP do cliente
- Consulta geolocalizacao (ipapi.co)
- Salva na tabela page_visits
- Retorna sucesso (nao bloqueia a experiencia do usuario)
```

**Importante**: A funcao sera chamada de forma assincrona para nao afetar performance.

---

## Etapa 3: Criar Hook usePageVisit

Novo hook React para capturar e enviar visitas:

```typescript
// src/hooks/usePageVisit.ts

- Gera visitor_id unico (persistido no localStorage)
- Gera session_id por sessao (sessionStorage)
- Captura UTMs da URL
- Captura page URL, path, referrer
- Envia para edge function de forma nao-bloqueante
- Previne multiplos registros da mesma pagina na sessao
```

---

## Etapa 4: Integrar no App.tsx

Adicionar o hook no componente principal:

```typescript
// src/App.tsx

import { usePageVisit } from "@/hooks/usePageVisit";

// Dentro do App, chamar o hook para rastrear visitas
usePageVisit();
```

---

## Etapa 5: Como Calcular Taxa de Conversao

Com as duas tabelas, voce podera fazer queries como:

```sql
-- Visitas por campanha
SELECT utm_campaign, COUNT(*) as visitas
FROM page_visits
WHERE created_at >= '2024-01-01'
GROUP BY utm_campaign;

-- Leads por campanha
SELECT utm_campaign, COUNT(*) as leads
FROM leads
WHERE created_at >= '2024-01-01'
GROUP BY utm_campaign;

-- Taxa de conversao (visitas -> leads)
SELECT 
  v.utm_campaign,
  v.visitas,
  COALESCE(l.leads, 0) as leads,
  ROUND(COALESCE(l.leads, 0)::numeric / v.visitas * 100, 2) as taxa_conversao
FROM (
  SELECT utm_campaign, COUNT(*) as visitas
  FROM page_visits
  GROUP BY utm_campaign
) v
LEFT JOIN (
  SELECT utm_campaign, COUNT(*) as leads
  FROM leads
  GROUP BY utm_campaign
) l ON v.utm_campaign = l.utm_campaign;
```

---

## Resumo das Alteracoes

| Arquivo/Recurso | Tipo | Descricao |
|-----------------|------|-----------|
| Tabela `page_visits` | Database | Nova tabela para visitas |
| RLS Policy | Database | Permitir insert anonimo |
| `supabase/functions/track-visit/index.ts` | Edge Function | Processar e salvar visitas |
| `supabase/config.toml` | Config | Configurar verify_jwt = false |
| `src/hooks/usePageVisit.ts` | Hook | Capturar e enviar dados de visita |
| `src/App.tsx` | Component | Integrar hook de rastreamento |

---

## Dados que serao Capturados

Para cada visita:

- **Identificacao**: visitor_id (unico por navegador), session_id (por sessao)
- **Pagina**: URL completa, path, referrer
- **Campanha**: Todos os 5 parametros UTM
- **Dispositivo**: User agent
- **Localizacao**: IP, cidade, estado, pais

---

## Beneficios

1. **Taxa de conversao por campanha** - Saber quais anuncios trazem mais leads
2. **Funil completo** - Ver quantos visitam vs quantos convertem
3. **Comportamento** - Quais paginas sao mais visitadas
4. **ROI de marketing** - Comparar investimento vs resultados por fonte

---

## Secao Tecnica

### Visitor ID
Gerado uma vez e persistido no localStorage. Permite identificar visitantes recorrentes sem login.

### Session ID
Gerado por sessao (sessionStorage). Permite agrupar pageviews de uma mesma sessao.

### Prevencao de Duplicatas
O hook registra apenas uma vez por pagina por sessao, evitando multiplos registros ao navegar para a mesma pagina.

### Performance
A chamada ao backend e feita com `fetch` assincrono sem `await`, nao bloqueando a renderizacao da pagina.

