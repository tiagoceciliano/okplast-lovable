
# Plano de Otimização de Performance - GTmetrix

## Diagnóstico

O GTmetrix identificou os seguintes problemas principais:

| Metrica | Valor Atual | Meta Ideal |
|---------|-------------|------------|
| First Contentful Paint (FCP) | 2.5s | < 1.8s |
| Speed Index | 3.9s | < 3.4s |
| Largest Contentful Paint (LCP) | 4.1s | < 2.5s |
| Performance Grade | C (61%) | B+ (80%+) |

Os pontos positivos (TBT 0ms, CLS 0.01) indicam que o problema está no **carregamento inicial de recursos**, não na interatividade ou estabilidade visual.

---

## Estratégia de Otimização em 4 Frentes

### 1. Otimizar Carregamento de Imagens Críticas (LCP/FCP)

**Problema:** As imagens do grid de produtos (12 itens) e chapas (8 itens) carregam todas simultaneamente, competindo por banda.

**Soluções:**

- Adicionar `preload` para as primeiras 4 imagens do grid de produtos no `index.html`
- Usar `fetchPriority="high"` nas imagens acima da dobra (above the fold)
- Implementar `loading="lazy"` corretamente apenas para imagens abaixo da dobra
- Adicionar dimensões explícitas (`width`/`height`) em todas as imagens para evitar recálculos de layout

### 2. Otimizar Carregamento do Logo (Header)

**Problema:** O logo do header é importado como módulo ES6, o que atrasa a renderização inicial.

**Solucoes:**
- Mover o logo para `/public` e referenciar diretamente
- Adicionar `preload` no `index.html` para o logo
- Usar `fetchPriority="high"` no elemento `<img>` do logo

### 3. Eliminar Recursos Não-Críticos do Bundle Inicial

**Problema:** Componentes do Footer (GoogleMapEmbed) e modais (WhatsApp/Email) estão no bundle principal.

**Soluções:**
- Aplicar lazy loading nos modais (WhatsAppModal, EmailQuoteModal)
- O GoogleMapEmbed já usa IntersectionObserver (OK)
- Remover o áudio de notificação do carregamento inicial (defer para depois de DOMContentLoaded)

### 4. Otimizar Preconnects e DNS-Prefetch

**Problema:** Apenas o Supabase tem preconnect configurado.

**Solucoes:**
- Revisar se há outras origens que precisam de preconnect
- Adicionar `preload` para recursos críticos do primeiro viewport

---

## Detalhes Técnicos de Implementação

### Arquivo: `index.html`

Adicionar preloads para recursos críticos:

```text
<!-- Preload logo do header -->
<link rel="preload" as="image" href="/logo-horizontal.png" fetchpriority="high" />

<!-- Preload das 4 primeiras imagens de produtos (LCP candidates) -->
<link rel="preload" as="image" href="https://dikfllrqtcdexvnlczsz.supabase.co/storage/v1/object/public/site-images/produtos/cupula-preta.jpg" />
<link rel="preload" as="image" href="https://dikfllrqtcdexvnlczsz.supabase.co/storage/v1/object/public/site-images/produtos/trofeus.jpg" />
```

### Arquivo: `src/pages/Index.tsx`

Modificar o grid de produtos para usar `fetchPriority` e lazy loading seletivo:

```text
- Imagens 0-3 (primeira linha): fetchPriority="high", loading="eager"
- Imagens 4-7 (segunda linha): loading="lazy"
- Imagens 8-11 (terceira linha): loading="lazy"
```

### Arquivo: `src/components/layout/Header.tsx`

- Mover logo para `/public` e adicionar `fetchPriority="high"`
- Usar referência direta ao invés de import de módulo

### Arquivo: `src/components/layout/WhatsAppFloatingButton.tsx`

- Postergar carregamento do áudio de notificação
- Usar lazy import para o componente `WhatsAppChatWidget`

---

## Arquivos a Modificar

1. `index.html` - Adicionar preloads de recursos críticos
2. `src/pages/Index.tsx` - Otimizar loading/priority das imagens
3. `src/components/layout/Header.tsx` - Otimizar carregamento do logo
4. `src/components/layout/WhatsAppFloatingButton.tsx` - Postergar recursos não-críticos
5. `public/` - Copiar logo para pasta pública

---

## Impacto Esperado

| Metrica | Antes | Esperado |
|---------|-------|----------|
| FCP | 2.5s | ~1.5s |
| LCP | 4.1s | ~2.5s |
| Speed Index | 3.9s | ~2.5s |
| Grade | C (61%) | B (75-85%) |

A otimização foca em **priorizar os recursos críticos** (logo, primeiras imagens) e **postergar recursos não-críticos** (modais, áudio, imagens abaixo da dobra).
