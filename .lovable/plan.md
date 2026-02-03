
# Plano: Corrigir Captura de UTMs no Modal de Email

## Problema Identificado

O `EmailQuoteModal.tsx` usa uma logica antiga para buscar UTMs:

```typescript
// CODIGO ATUAL (INCORRETO) - Linha 83-89
const utmData = {
  utm_source: localStorage.getItem("utm_source") || null,
  utm_medium: localStorage.getItem("utm_medium") || null,
  utm_campaign: localStorage.getItem("utm_campaign") || null,
  utm_term: localStorage.getItem("utm_term") || null,
  utm_content: localStorage.getItem("utm_content") || null,
};
```

Porem, o hook `useUTM.ts` salva os UTMs em uma **unica chave** `lab_acrilicos_utm`:

```typescript
// useUTM.ts salva assim:
localStorage.setItem("lab_acrilicos_utm", JSON.stringify(utms));
```

**Resultado**: O modal busca em chaves inexistentes, recebendo `null` para tudo.

---

## Solucao

Importar e usar a funcao `getStoredUTM()` do hook, que ja existe e funciona corretamente.

### Alteracao no Codigo

**Arquivo:** `src/components/layout/EmailQuoteModal.tsx`

**1. Adicionar import (linha 2)**

```typescript
import { getStoredUTM } from "@/hooks/useUTM";
```

**2. Substituir coleta de UTMs (linhas 82-89)**

De:
```typescript
// Coleta dados UTM
const utmData = {
  utm_source: localStorage.getItem("utm_source") || null,
  utm_medium: localStorage.getItem("utm_medium") || null,
  utm_campaign: localStorage.getItem("utm_campaign") || null,
  utm_term: localStorage.getItem("utm_term") || null,
  utm_content: localStorage.getItem("utm_content") || null,
};
```

Para:
```typescript
// Coleta dados UTM usando a funcao centralizada
const utmData = getStoredUTM();
```

---

## Por Que Isso Resolve

| Antes | Depois |
|-------|--------|
| Busca em 5 chaves individuais que nao existem | Busca na chave correta `lab_acrilicos_utm` |
| Retorna `null` para todos UTMs | Retorna os UTMs salvos corretamente |

---

## Resumo das Alteracoes

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/layout/EmailQuoteModal.tsx` | Importar `getStoredUTM` e usar no lugar da logica manual |

---

## Secao Tecnica

### Fluxo Atual (Quebrado)

```text
Usuario acessa URL com UTMs
    |
    v
useUTM.ts salva em "lab_acrilicos_utm"
    |
    v
Modal busca em "utm_source", "utm_medium"... (nao existe)
    |
    v
UTMs = null
```

### Fluxo Corrigido

```text
Usuario acessa URL com UTMs
    |
    v
useUTM.ts salva em "lab_acrilicos_utm"
    |
    v
Modal usa getStoredUTM() que le "lab_acrilicos_utm"
    |
    v
UTMs capturados corretamente
```
