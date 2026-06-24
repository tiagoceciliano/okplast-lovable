## Plano: Adicionar campo "Tipo de Material" no formulário WhatsApp

### 1. `src/components/layout/WhatsAppModal.tsx`
- Adicionar campo `tipo_material` (Select shadcn) entre WhatsApp e Mensagem.
- Opções: Policarbonato Alveolar, Policarbonato Compacto, Acrílico, Poliestireno (PS), PVC Expandido, ACM, PETG, Outros.
- Estilizar o `SelectTrigger` para combinar com `whatsapp-input` (h-8, text-sm, fundo branco).
- Schema zod: `tipo_material: z.string().min(1, "Selecione o tipo de material")`.
- Incluir "Tipo de Material: X" na mensagem do WhatsApp.
- Enviar `tipo_material` no `supabase.functions.invoke("process-lead", ...)` e usá-lo também como `produto_interesse`.

### 2. Webhook
- Não toco em nada do webhook (nem secret, nem URL). A edge function `process-lead` continua usando `WEBHOOK_KINBOX_CHAPA_WHATSAPP` exatamente como está.
- Apenas adiciono `tipo_material` ao `LeadPayload` e ao `webhookPayload` no `supabase/functions/process-lead/index.ts` para que o novo campo seja propagado.

### Arquivos
- `src/components/layout/WhatsAppModal.tsx` (UI + envio)
- `supabase/functions/process-lead/index.ts` (incluir campo no payload do webhook)
