## Plano para corrigir o webhook da Kinbox

1. **Atualizar o endereço do webhook no backend**
   - Trocar o valor do secret `WEBHOOK_KINBOX_CHAPA_WHATSAPP` para:
   - `https://webhook.kinbox.com.br/v3/inbound/mwVIr-FpU`

2. **Confirmar que o código está usando o secret correto**
   - A função `process-lead` já busca o webhook pelo secret `WEBHOOK_KINBOX_CHAPA_WHATSAPP`.
   - Não precisa alterar a URL no frontend.

3. **Testar o envio real pela função**
   - Enviar um payload de teste pela função `process-lead`.
   - Confirmar se a resposta retorna `webhook_enviado: true`.
   - Isso valida que o formulário do site vai disparar para o webhook novo.

4. **Depois você testa no site**
   - Preenche o formulário normalmente.
   - O envio deve cair no webhook novo da Kinbox, não no antigo `JqLvB0d7t`.

## Detalhe técnico

O webhook não deve ficar fixo no código. Ele fica salvo como secret do backend em `WEBHOOK_KINBOX_CHAPA_WHATSAPP`, e a função `process-lead` lê esse valor na hora de enviar o lead.