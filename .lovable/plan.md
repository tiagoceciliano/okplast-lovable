
# Plano: Corrigir Mapeamento de Imagens nos Componentes

## Problema Identificado

As imagens foram baixadas e hospedadas corretamente no storage, mas o **mapeamento nos componentes** está errado. Algumas imagens estao apontando para as constantes erradas.

---

## Erros Encontrados

### 1. Index.tsx - Linha 21
**Produto:** "Urna de Acrilico"  
**Atual:** `PRODUTOS_IMAGES.display` (ERRADO)  
**Correto:** `PRODUTOS_IMAGES.urna`

### 2. AcrilicoSobMedida.tsx - Linha 44
**Produto:** "Caixa de Sugestao"  
**Atual:** `SOBMEDIDA_IMAGES.urna` (ERRADO)  
**Correto:** `SOBMEDIDA_IMAGES.caixaSugestao`

### 3. AcrilicoSobMedida.tsx - Linha 51
**Produto:** "Expositores para Calcados"  
**Atual:** `SOBMEDIDA_IMAGES.expositoresCalcados` que aponta para `expositor-de-acrilico-doces` (ERRADO)  
**Correto:** Precisa de uma imagem especifica de expositores de calcados

---

## Problemas no Mapeamento Original (images.ts)

Analisando o arquivo `src/lib/images.ts`, encontrei que algumas URLs originais do Acrilzano foram mapeadas incorretamente:

| Produto | Imagem Atual | Problema |
|---------|--------------|----------|
| expositoresCalcados | expositor-de-acrilico-doces-300x300-min.jpg | Deveria ser imagem de calcados, nao de doces |
| urna (sobmedida) | sugestoes-400x267-300x225-min.jpg | Esta e foto de caixa de sugestao, nao urna |

---

## Correcoes Necessarias

### Arquivo: `src/pages/Index.tsx`

| Linha | Produto | Alterar de | Para |
|-------|---------|-----------|------|
| 21 | Urna de Acrilico | `PRODUTOS_IMAGES.display` | `PRODUTOS_IMAGES.urna` |

### Arquivo: `src/pages/products/AcrilicoSobMedida.tsx`

| Linha | Produto | Alterar de | Para |
|-------|---------|-----------|------|
| 44 | Caixa de Sugestao | `SOBMEDIDA_IMAGES.urna` | `SOBMEDIDA_IMAGES.caixaSugestao` |

### Arquivo: `src/lib/images.ts`

Re-mapear URLs originais para produtos corretos:

| Constante | URL Original Correta |
|-----------|---------------------|
| `sobmedida/urna.jpg` | urna-de-acrilico-300x300-min.jpg |
| `sobmedida/caixa-sugestao.jpg` | sugestoes-400x267-300x225-min.jpg ou caixa-sugestao-300x300-min.jpg |
| `sobmedida/expositores-calcados.jpg` | Procurar imagem correta de expositores de calcados |

---

## Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/pages/Index.tsx` | Corrigir referencia de urna (linha 21) |
| `src/pages/products/AcrilicoSobMedida.tsx` | Corrigir referencia de Caixa de Sugestao (linha 44) |
| `src/lib/images.ts` | Atualizar mapeamento de URLs se necessario |

---

## Resumo das Correcoes

1. **Urna** no Index.tsx: trocar `display` por `urna`
2. **Caixa de Sugestao** no AcrilicoSobMedida.tsx: trocar `urna` por `caixaSugestao`
3. Verificar se as imagens no storage estao corretas ou se precisam ser re-migradas com URLs corretas

---

## Secao Tecnica

As alteracoes sao simples substituicoes de constantes:

```typescript
// Index.tsx - Linha 21
// DE:
{ nome: "Urna de Acrilico", href: "...", imageUrl: PRODUTOS_IMAGES.display }
// PARA:
{ nome: "Urna de Acrilico", href: "...", imageUrl: PRODUTOS_IMAGES.urna }

// AcrilicoSobMedida.tsx - Linha 44
// DE:
{ nome: "Caixa de Sugestao", href: "...", imageUrl: SOBMEDIDA_IMAGES.urna }
// PARA:
{ nome: "Caixa de Sugestao", href: "...", imageUrl: SOBMEDIDA_IMAGES.caixaSugestao }
```
