
# Plano: Adicionar E-mail Obrigatório com Botão Sempre Visível

## Resumo

Vou adicionar o campo de e-mail obrigatório nos modais do WhatsApp e otimizar o layout para garantir que o botão "Iniciar Conversa" fique sempre visível sem necessidade de scroll, mesmo com o campo adicional.

---

## Estratégia para Manter o Botão Visível

Para acomodar o campo de e-mail extra sem exigir scroll, farei os seguintes ajustes:

| Componente | Ajuste |
|------------|--------|
| Inputs | Reduzir altura de `h-9` para `h-8` |
| Textarea | Reduzir altura mínima de `60px` para `50px` |
| Espaçamento | Reduzir gap entre campos de `2.5` para `2` |
| Mensagem de boas-vindas | Simplificar para ocupar menos espaço |
| ScrollArea | Aumentar `max-h` para acomodar melhor o conteúdo |

---

## Alterações por Arquivo

### 1. WhatsAppModal.tsx (Modal Central)

**Adicionar campo de e-mail:**
- Novo campo entre Nome e WhatsApp
- Validação com Zod: `email: z.string().trim().email("E-mail inválido").max(255)`
- Placeholder: "Seu e-mail"

**Corrigir captura de UTMs:**
- Importar `getStoredUTM` de `@/hooks/useUTM`
- Substituir chamadas `localStorage.getItem()` por `getStoredUTM()`

**Incluir e-mail na mensagem do WhatsApp:**
```
E-mail: ${data.email}
```

**Otimizar layout:**
- Inputs com `h-8` (mais compactos)
- Textarea com `min-h-[50px]`
- Espaçamento `space-y-2`
- Remover animação de delay do formulário

### 2. WhatsAppChatWidget.tsx (Widget Flutuante)

**Mesmas alterações do Modal:**
- Adicionar campo de e-mail
- Corrigir UTMs com `getStoredUTM()`
- Incluir e-mail na mensagem
- Otimizar layout para caber sem scroll

### 3. process-lead/index.ts (Edge Function)

**Simplificar classificação de webhook:**
```typescript
function getWebhookType(produto: string): "chapas" | "geral" {
  if (produto === "Chapa Inteira ou Cortada") {
    return "chapas";
  }
  return "geral";
}
```

---

## Layout Otimizado

O formulário terá a seguinte estrutura compacta:

```text
┌─────────────────────────────────────┐
│  🟢 Lab Acrílicos - Online          │  ← Header
├─────────────────────────────────────┤
│  💬 Olá! 👋 Preencha os dados...    │  ← Mensagem curta
│                                     │
│  ┌───────────────────────────────┐  │
│  │ Seu nome                       │  │  ← h-8
│  ├───────────────────────────────┤  │
│  │ Seu e-mail                     │  │  ← h-8 (NOVO)
│  ├───────────────────────────────┤  │
│  │ Seu WhatsApp                   │  │  ← h-8
│  ├───────────────────────────────┤  │
│  │ Selecione o produto ▼         │  │  ← h-8
│  ├───────────────────────────────┤  │
│  │ Descreva seu projeto...       │  │  ← min-h-[50px]
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  [ 🚀 Iniciar Conversa ]            │  ← Sempre visível
└─────────────────────────────────────┘
```

---

## Dados Enviados ao Webhook

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

---

## Arquivos a Modificar

| Arquivo | Alterações |
|---------|------------|
| `src/components/layout/WhatsAppModal.tsx` | + campo email, + getStoredUTM, layout compacto |
| `src/components/layout/WhatsAppChatWidget.tsx` | + campo email, + getStoredUTM, layout compacto |
| `supabase/functions/process-lead/index.ts` | Simplificar getWebhookType |

---

## Resultado Esperado

1. Campo de e-mail obrigatório em ambos os modais
2. Botão "Iniciar Conversa" sempre visível sem scroll
3. UTMs capturadas corretamente da URL
4. Webhook disparado para Kinbox com todos os dados
5. Lead salvo no banco com todas as informações
