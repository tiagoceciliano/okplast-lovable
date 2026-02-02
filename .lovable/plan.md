
# Plano: Adicionar E-mail Obrigatório com Botão Sempre Visível

## ✅ CONCLUÍDO

### Alterações Realizadas

| Arquivo | Alterações |
|---------|------------|
| `src/components/layout/WhatsAppModal.tsx` | + campo email obrigatório, + import getStoredUTM, layout compacto (h-8, space-y-2, min-h-[50px]) |
| `src/components/layout/WhatsAppChatWidget.tsx` | + campo email obrigatório, + import getStoredUTM, layout compacto |
| `supabase/functions/process-lead/index.ts` | Simplificado getWebhookType para "Chapa Inteira ou Cortada" → chapas, resto → geral |

### Dados Salvos no Banco

| Campo | Origem | Obrigatório |
|-------|--------|-------------|
| `nome` | Formulário | Sim |
| `email` | Formulário | Sim |
| `telefone` | Formulário | Sim |
| `produto_interesse` | Formulário | Sim |
| `mensagem` | Formulário | Sim |
| `utm_source` | URL (via getStoredUTM) | Não |
| `utm_medium` | URL (via getStoredUTM) | Não |
| `utm_campaign` | URL (via getStoredUTM) | Não |
| `utm_term` | URL (via getStoredUTM) | Não |
| `utm_content` | URL (via getStoredUTM) | Não |

### Classificação de Webhook

- "Chapa Inteira ou Cortada" → `WEBHOOK_CHAPAS`
- Outros produtos → `WEBHOOK_GERAL`
