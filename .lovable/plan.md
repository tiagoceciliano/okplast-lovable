Objetivo: restaurar o envio de leads para o webhook antigo da Kinbox, usando a URL e o formato JSON exibidos no print.

Observação do usuário: os números de telefone/destino não precisam ser alterados; ele fará isso nas configurações. Portanto, esta alteração se limita ao payload e ao endpoint do webhook.

Alterações previstas:

1. **Atualizar secret do webhook**
   - Secret: `WEBHOOK_KINBOX_CHAPA_WHATSAPP`
   - Novo valor: `https://webhook.kinbox.com.br/v3/inbound/mwVIr-FpU`

2. **Restaurar payload da edge function `process-lead`**
   - Remover o objeto `location` aninhado.
   - Voltar os campos `city`, `state` e `country` para o nível raiz do JSON.
   - Readicionar o campo `tipo_material` no payload.
   - Remover os campos `destination_phone` e `destination_phone_formatted` que não constam no JSON antigo.
   - Manter os demais campos já existentes: `name`, `email`, `phone`, `product`, `message`, UTM, `submitted_at`, `submitted_time`, `current_url`.

3. **Testar envio**
   - Enviar um lead de teste pela função `process-lead`.
   - Confirmar retorno `webhook_enviado: true`.

Arquivos envolvidos:
- `supabase/functions/process-lead/index.ts`
- Secret `WEBHOOK_KINBOX_CHAPA_WHATSAPP` (atualização via ferramenta de secrets)