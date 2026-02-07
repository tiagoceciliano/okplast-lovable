
# Corrigir Links do Sidebar Admin para Domínio Público

## Problema

Os links das páginas no sidebar do painel admin estão usando caminhos relativos (ex: `/acrilico-sob-medida`), fazendo com que abram dentro do Lovable em vez de direcionar para o domínio público da empresa (`https://labacrilicos.com.br`).

---

## Solução

Modificar o componente `AdminSidebar.tsx` para concatenar o domínio público da empresa antes de cada caminho de página.

---

## Arquivo a Modificar

`src/pages/admin/components/AdminSidebar.tsx`

---

## Mudanças

### 1. Importar a constante COMPANY

Adicionar import do arquivo de constantes para usar o domínio configurado:

```typescript
import { COMPANY } from "@/lib/constants";
```

### 2. Atualizar o componente CollapsibleMenu

Modificar os links `<a href>` para usar URL completa:

- **Antes**: `href={hubPath}` e `href={page.path}`
- **Depois**: `href={COMPANY.domain + hubPath}` e `href={COMPANY.domain + page.path}`

### 3. Atualizar o link da Home

Modificar o link da Home no sidebar:

- **Antes**: `href="/"`
- **Depois**: `href={COMPANY.domain}`

---

## Resultado Esperado

Ao clicar em qualquer link de página no sidebar, o navegador abrirá uma nova aba direcionando para:

- `https://labacrilicos.com.br/` (Home)
- `https://labacrilicos.com.br/acrilico-sob-medida` (Hub Acrílico)
- `https://labacrilicos.com.br/chapas/acrilico` (Chapas Acrílico)
- etc.

---

## Benefícios

1. Links abrem no domínio público correto
2. Usa constante centralizada (fácil manutenção)
3. Mantém `target="_blank"` para abrir em nova aba
