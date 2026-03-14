
## Plano de Atualização do Webhook

### Situação Atual

**Edge Function (`process-lead/index.ts`)**:
- Linha 84: Busca o secret `WEBHOOK_WHATSAPP_CHAPA` (que não existe mais)
- Linha 167: Log de warning menciona `WEBHOOK_WHATSAPP_CHAPA`

**Constants (`constants.ts`)**:
- Linhas 16-18: Define `WEBHOOKS.chapas = "WEBHOOK_CHAPAS"` (não utilizado no código)

**Secrets Configurados**:
- ✅ `WEBHOOK_KINBOX_CHAPA_WHATSAPP` (o correto, que será usado)
- ❌ `RESEND_API_KEY` (não utilizado)

### Mudanças Necessárias

**1. Atualizar Edge Function `process-lead/index.ts`**
- Linha 84: Trocar `WEBHOOK_WHATSAPP_CHAPA` → `WEBHOOK_KINBOX_CHAPA_WHATSAPP`
- Linha 167: Atualizar mensagem de warning para refletir o nome correto

**2. Limpar `constants.ts`**
- Remover o objeto `WEBHOOKS` (linhas 15-18), pois não é mais usado

**3. Manutenção de Secrets**
- Informar ao usuário que pode remover o `RESEND_API_KEY` manualmente se não for mais necessário (via Cloud → Secrets)

### Resultado Esperado

Após as mudanças:
- O modal WhatsApp enviará leads para o webhook `WEBHOOK_KINBOX_CHAPA_WHATSAPP`
- Código limpo, sem referências a webhooks antigos
- Logs e mensagens de erro apontando para o secret correto
