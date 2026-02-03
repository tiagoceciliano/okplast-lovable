

# Plano: Unificar Lógica de UTM - Copiar Exatamente do WhatsApp para Email

## Diagnóstico Final

Comparando linha por linha:

| Aspecto | WhatsAppModal | EmailQuoteModal |
|---------|--------------|-----------------|
| Import UTM | `import { getStoredUTM } from "@/hooks/useUTM";` | ✅ Igual |
| Chamada | `const utmData = getStoredUTM();` | ✅ Igual |
| Spread | `...utmData,` | ✅ Igual |
| Edge Function | `process-lead` | `send-quote-email` |

**O código é idêntico!** Se o WhatsApp funciona e o Email não, a diferença só pode estar:
1. No momento exato em que cada modal é aberto/submetido
2. Em algum comportamento específico do contexto de renderização

## Solução: Passar UTMs Explicitamente (Garantia Total)

Como o `EmbeddedQuoteForm` funciona e usa campos explícitos, vamos copiar essa abordagem para o `EmailQuoteModal`:

### Alteração

**Arquivo:** `src/components/layout/EmailQuoteModal.tsx`

**De:**
```typescript
const payload = {
  nome: nomeFormatado,
  email: data.email,
  telefone: telefoneFormatado,
  produto_interesse: data.produto,
  mensagem: data.mensagem,
  ...utmData,  // ← Pode estar causando problema
};
```

**Para:**
```typescript
const payload = {
  nome: nomeFormatado,
  email: data.email,
  telefone: telefoneFormatado,
  produto_interesse: data.produto,
  mensagem: data.mensagem,
  utm_source: utmData.utm_source,
  utm_medium: utmData.utm_medium,
  utm_campaign: utmData.utm_campaign,
  utm_term: utmData.utm_term,
  utm_content: utmData.utm_content,
};
```

## Por Que Isso Pode Funcionar

O spread operator (`...`) com objetos que contêm valores `null` pode ter comportamentos inesperados em certos contextos de serialização. Ao passar cada campo explicitamente:

1. Garante que cada propriedade existe no objeto final
2. Remove qualquer ambiguidade do spread
3. É a mesma abordagem do `EmbeddedQuoteForm` que funciona

## Alternativa B: Usar a Edge Function do WhatsApp

Se a Opção A não funcionar, podemos fazer o modal de email usar a mesma edge function `process-lead` (que sabemos que funciona), apenas adicionando um parâmetro para indicar que é lead de email:

```typescript
// Ao invés de chamar send-quote-email
supabase.functions.invoke("process-lead", {
  body: {
    ...payload,
    canal: "email", // Para diferenciar no backend
  },
});
```

## Resumo das Alterações

| Arquivo | Alteração |
|---------|-----------|
| `src/components/layout/EmailQuoteModal.tsx` | Trocar spread por campos UTM explícitos |

## Próximo Passo

Após implementar:
1. Acessar `labacrilicos.com.br/?utm_source=teste&utm_campaign=debug`
2. Enviar orçamento pelo modal de email
3. Verificar se os UTMs chegaram no banco

