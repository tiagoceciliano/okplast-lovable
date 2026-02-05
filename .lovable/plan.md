
# Página de Leads no Admin

## Objetivo

Criar uma nova página `/admin/leads` com tabela de leads e modal de detalhes, além de adicionar o item "Leads" no sidebar.

---

## Estrutura de Arquivos

### Novos Arquivos

```text
src/pages/admin/
├── Leads.tsx                    # Página de listagem de leads
└── components/
    └── LeadDetailsModal.tsx     # Modal com detalhes completos do lead
```

### Arquivos a Modificar

- `src/pages/admin/components/AdminSidebar.tsx` - Adicionar menu "Leads"
- `src/App.tsx` - Adicionar rota `/admin/leads`
- `supabase/functions/get-dashboard-stats/index.ts` - Adicionar endpoint para buscar leads com detalhes

---

## Tabela de Leads

### Colunas na Ordem Solicitada

| Coluna | Campo |
|--------|-------|
| Data | created_at (formato DD/MM/YYYY) |
| Hora | created_at (formato HH:MM) |
| Nome | nome |
| Campaign | utm_campaign |
| Source | utm_source |
| Medium | utm_medium |
| Content | utm_content |
| Term | utm_term |
| Ações | Ícone de olho para ver detalhes |

---

## Modal de Detalhes (Olhinho)

### Informações Completas

- **Dados pessoais**: Nome, E-mail, Telefone
- **Produto de interesse**
- **Mensagem** (se houver)
- **UTM completo**: source, medium, campaign, content, term
- **Localização**: Cidade, Estado, País
- **IP Address**
- **Data/Hora do cadastro**
- **Histórico de cadastros**: Quantidade de vezes que esse e-mail/telefone já se cadastrou

---

## Edge Function

### Nova função: `get-leads`

Endpoint que retorna:
- Lista de leads com todos os campos
- Para cada lead, contagem de cadastros anteriores com mesmo e-mail ou telefone

---

## Sidebar

Adicionar item "Leads" com ícone `Users` logo abaixo de "Dashboard":

```text
Menu
├── Dashboard
├── Leads        ← NOVO
```

---

## Implementação Técnica

1. **Edge Function `get-leads`**: Busca todos os leads ordenados por data decrescente, calcula duplicatas
2. **Página Leads.tsx**: Tabela usando componentes Table do Shadcn, com filtro por período
3. **LeadDetailsModal.tsx**: Dialog com todas as informações + contagem de cadastros anteriores
4. **Fuso horário**: Todas as datas/horas formatadas para São Paulo (America/Sao_Paulo)
