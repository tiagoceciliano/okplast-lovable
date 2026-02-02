
# Plano: Configurar 4 Webhooks Separados por Canal e Produto

## Resumo

Vou atualizar a configuração para usar 4 webhooks diferentes, separados por canal (Email/WhatsApp) e tipo de produto (Chapa/Peça).

---

## Novos Secrets Necessários

| Secret | URL | Descrição |
|--------|-----|-----------|
| `WEBHOOK_EMAIL_CHAPA` | `https://webhook.kinbox.com.br/v3/inbound/D-M9K8zxx` | Email + Chapa |
| `WEBHOOK_EMAIL_PECA` | `https://webhook.kinbox.com.br/v3/inbound/H6rfH5o-0` | Email + Peça |
| `WEBHOOK_WHATSAPP_CHAPA` | `https://webhook.kinbox.com.br/v3/inbound/JqLvB0d7t` | WhatsApp + Chapa |
| `WEBHOOK_WHATSAPP_PECA` | `https://webhook.kinbox.com.br/v3/inbound/nsCtk2Lqo` | WhatsApp + Peça |

---

## Alterações por Arquivo

### 1. send-quote-email/index.ts (Formulário de E-mail)

**Atualizar lógica de seleção de webhook:**
```typescript
// Seleciona webhook baseado no produto
const webhookUrl = webhookType === "chapas" 
  ? Deno.env.get("WEBHOOK_EMAIL_CHAPA") 
  : Deno.env.get("WEBHOOK_EMAIL_PECA");
```

**Simplificar getWebhookType:**
```typescript
function getWebhookType(produto: string): "chapas" | "peca" {
  if (produto === "Chapa Inteira ou Cortada") {
    return "chapas";
  }
  return "peca";
}
```

**Corrigir endereço de envio do Resend:**
```typescript
from: "Lab Acrílicos <noreply@email.labacrilicos.com.br>",
```

### 2. process-lead/index.ts (Modal WhatsApp)

**Atualizar lógica de seleção de webhook:**
```typescript
// Seleciona webhook baseado no produto
const webhookUrl = webhookType === "chapas" 
  ? Deno.env.get("WEBHOOK_WHATSAPP_CHAPA") 
  : Deno.env.get("WEBHOOK_WHATSAPP_PECA");
```

---

## Fluxo de Roteamento

```text
┌─────────────────────────────────────────────────────────────────┐
│                    FORMULÁRIO DE E-MAIL                         │
│                  (send-quote-email)                              │
├─────────────────────────────────────────────────────────────────┤
│  Produto: "Chapa Inteira ou Cortada"                            │
│     → WEBHOOK_EMAIL_CHAPA (D-M9K8zxx)                           │
│                                                                  │
│  Produto: Outros (Produto Personalizado, etc)                   │
│     → WEBHOOK_EMAIL_PECA (H6rfH5o-0)                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     MODAL WHATSAPP                               │
│                    (process-lead)                                │
├─────────────────────────────────────────────────────────────────┤
│  Produto: "Chapa Inteira ou Cortada"                            │
│     → WEBHOOK_WHATSAPP_CHAPA (JqLvB0d7t)                        │
│                                                                  │
│  Produto: Outros (Produto Personalizado, etc)                   │
│     → WEBHOOK_WHATSAPP_PECA (nsCtk2Lqo)                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Arquivos a Modificar

| Arquivo | Alterações |
|---------|------------|
| `supabase/functions/send-quote-email/index.ts` | Usar `WEBHOOK_EMAIL_CHAPA` e `WEBHOOK_EMAIL_PECA`, corrigir domínio Resend |
| `supabase/functions/process-lead/index.ts` | Usar `WEBHOOK_WHATSAPP_CHAPA` e `WEBHOOK_WHATSAPP_PECA` |

---

## Secrets a Adicionar

Após aprovar o plano, você precisará adicionar os 4 novos secrets:

1. **WEBHOOK_EMAIL_CHAPA**: `https://webhook.kinbox.com.br/v3/inbound/D-M9K8zxx`
2. **WEBHOOK_EMAIL_PECA**: `https://webhook.kinbox.com.br/v3/inbound/H6rfH5o-0`
3. **WEBHOOK_WHATSAPP_CHAPA**: `https://webhook.kinbox.com.br/v3/inbound/JqLvB0d7t`
4. **WEBHOOK_WHATSAPP_PECA**: `https://webhook.kinbox.com.br/v3/inbound/nsCtk2Lqo`

Os secrets antigos (`WEBHOOK_CHAPAS` e `WEBHOOK_GERAL`) podem ser removidos depois.

---

## Resultado Esperado

Após a implementação:
1. Leads de E-mail vão para webhooks específicos de Email
2. Leads de WhatsApp vão para webhooks específicos de WhatsApp
3. Chapas e Peças são roteados corretamente em cada canal
4. E-mails serão enviados corretamente via Resend (domínio corrigido)
