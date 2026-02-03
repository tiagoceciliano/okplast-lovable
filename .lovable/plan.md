

# Plano: Adicionar Debug na Edge Function + Verificar Payload do Modal

## Diagnostico Atual

**Situação:**
- Webhook de teste manual → UTMs chegam ✅
- Modal de WhatsApp → UTMs chegam ✅  
- Modal de Email → UTMs **NÃO** chegam ❌

**Conclusão:** O problema está no **frontend**, especificamente no momento em que o `EmailQuoteModal` envia os dados.

---

## Hipótese

O código do `EmailQuoteModal` usa spread operator (`...utmData`) que deveria funcionar, mas pode haver um problema de:
1. `getStoredUTM()` retornando objeto vazio ao invés de objeto com valores
2. O spread não está funcionando como esperado no contexto específico

---

## Solução: Adicionar Logs de Debug

### Arquivo 1: `src/components/layout/EmailQuoteModal.tsx`

Adicionar console.log antes de enviar para ver exatamente o que está sendo enviado:

```typescript
const onSubmit = async (data: EmailFormData) => {
  setIsSubmitting(true);

  try {
    const nomeFormatado = capitalizeName(data.nome);
    const telefoneFormatado = data.telefone;

    // DEBUG: Log UTMs no momento do envio
    const utmData = getStoredUTM();
    console.log("[EmailModal] UTMs recuperados:", utmData);
    console.log("[EmailModal] localStorage raw:", localStorage.getItem("lab_acrilicos_utm"));

    const payload = {
      nome: nomeFormatado,
      email: data.email,
      telefone: telefoneFormatado,
      produto_interesse: data.produto,
      mensagem: data.mensagem,
      ...utmData,
    };
    console.log("[EmailModal] Payload completo:", payload);

    // Envia para edge function
    const { data: response, error } = await supabase.functions.invoke("send-quote-email", {
      body: payload,
    });
    // ... resto do código
```

### Arquivo 2: `supabase/functions/send-quote-email/index.ts`

Adicionar log no início para ver o que chega na edge function:

```typescript
// Logo após receber o payload
const payload: LeadPayload = await req.json();
console.log("[send-quote-email] Payload recebido:", JSON.stringify(payload));
```

---

## Por Que Isso Resolve

Com esses logs, conseguiremos identificar exatamente onde os UTMs estão sendo perdidos:

| Cenário | Log EmailModal | Log Edge Function | Problema |
|---------|----------------|-------------------|----------|
| UTMs no localStorage mas não enviados | UTMs aparecem | UTMs null | Spread operator |
| localStorage vazio | UTMs null | UTMs null | Captura inicial |
| UTMs enviados mas não salvos | UTMs aparecem | UTMs aparecem | Edge function |

---

## Resumo das Alterações

| Arquivo | Alteração |
|---------|-----------|
| `src/components/layout/EmailQuoteModal.tsx` | Adicionar 3 console.log para debug |
| `supabase/functions/send-quote-email/index.ts` | Adicionar 1 console.log para debug |

---

## Próximo Passo

Após implementar:
1. Acessar `labacrilicos.com.br/?utm_source=teste&utm_campaign=debug`
2. Abrir o console do navegador (F12)
3. Abrir o modal de email e enviar
4. Verificar os logs `[EmailModal]` no console
5. Me enviar os logs para análise

