

# Plano: Corrigir Captura de UTMs no Formulario de Email

## Problema

O formulario de email (`EmbeddedQuoteForm.tsx`) busca UTMs no **sessionStorage**, mas o hook `useUTM.ts` salva no **localStorage**.

## Correcao Minima

Apenas trocar a fonte dos UTMs de `sessionStorage` para `getStoredUTM()` - sem alterar nenhuma estrutura do JSON.

### Arquivo: `src/components/forms/EmbeddedQuoteForm.tsx`

**1. Adicionar import (linha 1):**
```typescript
import { getStoredUTM } from "@/hooks/useUTM";
```

**2. Substituir linhas 54-59:**

De:
```typescript
// Get UTM params from sessionStorage
const utmSource = sessionStorage.getItem("utm_source");
const utmMedium = sessionStorage.getItem("utm_medium");
const utmCampaign = sessionStorage.getItem("utm_campaign");
const utmTerm = sessionStorage.getItem("utm_term");
const utmContent = sessionStorage.getItem("utm_content");
```

Para:
```typescript
// Get UTM params from localStorage (mesma logica do WhatsApp)
const utmData = getStoredUTM();
```

**3. Substituir linhas 71-75 no body:**

De:
```typescript
utm_source: utmSource,
utm_medium: utmMedium,
utm_campaign: utmCampaign,
utm_term: utmTerm,
utm_content: utmContent,
```

Para:
```typescript
utm_source: utmData.utm_source,
utm_medium: utmData.utm_medium,
utm_campaign: utmData.utm_campaign,
utm_term: utmData.utm_term,
utm_content: utmData.utm_content,
```

---

## Resultado

A estrutura do JSON permanece **exatamente igual** - apenas a fonte dos dados muda de sessionStorage para localStorage.

