
# Dashboard Administrativo com Menu de Páginas

## Objetivo

Criar uma página de dashboard administrativo (`/admin`) com:
1. Métricas de conversão e performance do site
2. Sidebar com menu hierárquico de todas as páginas

---

## Estrutura de Arquivos

### Novos Arquivos a Criar

```text
src/pages/admin/
├── Dashboard.tsx          # Página principal do dashboard
├── AdminLayout.tsx        # Layout com sidebar
└── components/
    ├── AdminSidebar.tsx   # Sidebar com menu de páginas
    ├── StatsCards.tsx     # Cards de métricas
    ├── ConversionChart.tsx # Gráfico de conversão
    └── PagesList.tsx      # Lista de páginas do site
```

---

## Métricas do Dashboard

### Cards Principais

| Métrica | Descrição |
|---------|-----------|
| Total de Visitas | Contagem de page_visits |
| Total de Leads | Contagem de leads |
| Taxa de Conversão | (leads / visitantes únicos) x 100 |
| Sessões Únicas | Contagem de session_id distintos |

### Métricas Secundárias

- **Top 5 Páginas Mais Visitadas** - Ranking por page_path
- **Origem do Tráfego** - Distribuição por utm_source
- **Leads por Produto** - Agrupamento por produto_interesse
- **Leads por Cidade/Estado** - Distribuição geográfica

---

## Menu de Páginas (Sidebar)

### Hierarquia

```text
Dashboard
├── Home (/)
├── Acrílico Sob Medida (/acrilico-sob-medida)
│   ├── Caixas Sob Medida
│   ├── Cúpulas e Redomas
│   ├── Potes para Doces
│   ├── Potes para Grãos
│   ├── Urna de Acrílico
│   ├── Caixa de Sugestão
│   ├── Medalhas Personalizadas
│   ├── Troféus Personalizados
│   ├── Placa Customizada
│   ├── Placa Sinalização
│   ├── Expositores Bijuterias
│   ├── Expositores Calçados
│   ├── Expositores Óculos
│   ├── Display de Acrílico
│   ├── Porta Folder
│   ├── Quadro de Avisos
│   ├── Confeitaria
│   ├── Placa Gravada
│   └── Placa Personalizada
├── Chapas (/chapas)
│   ├── Acrílico
│   ├── Poliestireno
│   ├── PETG
│   ├── Policarbonato Alveolar
│   ├── Policarbonato Compacto
│   ├── PVC Expandido
│   └── ACM
└── Institucional (/home)
    ├── Sobre Nós
    ├── Política de Venda
    ├── Termo de Uso
    └── Política de Privacidade
```

---

## Implementação Técnica

### 1. RLS Policies

Será necessário criar políticas de SELECT para as tabelas `leads` e `page_visits` para que o dashboard possa consultar os dados. Como não há autenticação no sistema, usaremos uma rota protegida por URL obscuro (ex: `/admin-xyz123`).

### 2. Edge Function para Métricas

Criar uma edge function `get-dashboard-stats` que:
- Consulta as tabelas usando service role
- Retorna os dados agregados
- Não expõe dados sensíveis diretamente

### 3. Componentes

- **AdminLayout**: Layout com sidebar usando os componentes Shadcn já existentes
- **Dashboard**: Página com grid de cards e gráficos usando Recharts (já instalado)
- **AdminSidebar**: Menu colapsável com grupos hierárquicos

### 4. Rota

Adicionar rota `/admin` no App.tsx (fora do Layout principal para não mostrar header/footer do site)

---

## Dados Atuais no Banco

- **99 visitas** registradas
- **1 lead** capturado
- Taxa de conversão atual: ~1%

---

## Resultado Esperado

Dashboard limpo e funcional com:
- Visão geral das métricas de conversão
- Navegação rápida para todas as páginas do site
- Filtros por período (7 dias, 30 dias, todos)
- Design consistente com Shadcn/Tailwind
