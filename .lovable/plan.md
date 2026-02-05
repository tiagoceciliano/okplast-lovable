

# Plano: Otimizacao de Performance e SEO

## Objetivo

Reduzir o tempo de carregamento para menos de 1 segundo e otimizar a pagina para SEO, melhorando o ranqueamento no Google.

---

## Diagnostico Atual

| Problema | Impacto |
|----------|---------|
| Meta tags genericas no `index.html` | SEO prejudicado - Google indexa "Lovable App" |
| Fonte externa Google Fonts bloqueante | +200-400ms de carregamento |
| Todas as imagens carregam simultaneamente | Bundle inicial pesado |
| Falta de sitemap.xml | Google nao indexa todas as paginas |
| Falta de dados estruturados (Schema.org) | Rich snippets nao aparecem |
| Falta de preconnect para CDNs | Latencia adicional |
| Componentes nao sao lazy-loaded | JavaScript inicial muito grande |

---

## Solucao em 4 Etapas

### ETAPA 1: SEO - Meta Tags e Dados Estruturados

**Arquivo: `index.html`**

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- SEO Principal -->
    <title>Lab Acrilicos | Fabrica de Acrilico e Chapas no Rio de Janeiro</title>
    <meta name="description" content="Fabrica de produtos em acrilico sob medida e distribuidora de chapas. Trofeus, medalhas, displays, urnas e mais. Atendimento em 24h. Rio de Janeiro." />
    <meta name="keywords" content="acrilico, chapas de acrilico, fabrica de acrilico, trofeus personalizados, medalhas, displays, Rio de Janeiro" />
    <meta name="author" content="Lab Acrilicos" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://labacrilicos.com.br/" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="Lab Acrilicos | Fabrica de Acrilico no RJ" />
    <meta property="og:description" content="Fabrica de produtos em acrilico sob medida. Trofeus, medalhas, displays e chapas. Orcamento em 24h." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://labacrilicos.com.br/" />
    <meta property="og:image" content="https://labacrilicos.com.br/og-image.jpg" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="Lab Acrilicos" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Lab Acrilicos | Fabrica de Acrilico no RJ" />
    <meta name="twitter:description" content="Fabrica de produtos em acrilico sob medida. Orcamento em 24h." />
    <meta name="twitter:image" content="https://labacrilicos.com.br/og-image.jpg" />
    
    <!-- Performance: Preconnects -->
    <link rel="preconnect" href="https://dikfllrqtcdexvnlczsz.supabase.co" />
    <link rel="dns-prefetch" href="https://dikfllrqtcdexvnlczsz.supabase.co" />
    
    <!-- Dados Estruturados - LocalBusiness -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Lab Acrilicos",
      "description": "Fabrica de produtos em acrilico sob medida e distribuidora de chapas",
      "url": "https://labacrilicos.com.br",
      "telephone": "+55-21-3372-3797",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Rua Cordovil 259",
        "addressLocality": "Rio de Janeiro",
        "addressRegion": "RJ",
        "addressCountry": "BR"
      },
      "openingHours": "Mo-Fr 09:00-17:00",
      "priceRange": "$$"
    }
    </script>
  </head>
```

---

### ETAPA 2: Performance - Fonte Local + Preloads

**Arquivo: `src/index.css`**

Remover import do Google Fonts e usar fonte do sistema:

```css
/* REMOVER esta linha: */
/* @import url('https://fonts.googleapis.com/css2?family=Open+Sans...'); */

/* SUBSTITUIR por: */
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
```

**Economia estimada: 200-400ms**

---

### ETAPA 3: Lazy Loading de Componentes

**Arquivo: `src/App.tsx`**

Usar React.lazy para carregar paginas sob demanda:

```typescript
import { lazy, Suspense } from "react";

// Lazy load das paginas
const Index = lazy(() => import("./pages/Index"));
const AcrilicoSobMedida = lazy(() => import("./pages/products/AcrilicoSobMedida"));
const ChapasDeAcrilico = lazy(() => import("./pages/products/ChapasDeAcrilico"));
// ... demais paginas

// Componente de loading
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
  </div>
);

// Usar Suspense nas rotas
<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/" element={<Index />} />
    ...
  </Routes>
</Suspense>
```

**Economia estimada: 30-50% do bundle inicial**

---

### ETAPA 4: SEO - Sitemap e Robots

**Novo arquivo: `public/sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://labacrilicos.com.br/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://labacrilicos.com.br/acrilico-sob-medida</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://labacrilicos.com.br/chapas-de-acrilico</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

**Atualizar: `public/robots.txt`**

```text
User-agent: *
Allow: /

Sitemap: https://labacrilicos.com.br/sitemap.xml
```

---

## Resumo das Alteracoes

| Arquivo | Alteracao |
|---------|-----------|
| `index.html` | Meta tags SEO, Open Graph, Schema.org, preconnects |
| `src/index.css` | Remover Google Fonts, usar fonte do sistema |
| `src/App.tsx` | Lazy loading de todas as paginas |
| `public/sitemap.xml` | Novo arquivo com mapa do site |
| `public/robots.txt` | Adicionar referencia ao sitemap |

---

## Impacto Esperado

| Metrica | Antes | Depois |
|---------|-------|--------|
| First Contentful Paint | ~2-3s | < 1s |
| Largest Contentful Paint | ~3-4s | < 1.5s |
| Bundle JS inicial | ~400KB | ~200KB |
| SEO Score (Lighthouse) | ~50 | ~90+ |

---

## Secao Tecnica

### Por que remover Google Fonts?

O Google Fonts adiciona:
1. DNS lookup para fonts.googleapis.com
2. Requisicao CSS para a stylesheet
3. Download das fontes WOFF2

Isso bloqueia a renderizacao por 200-400ms. Fontes do sistema sao instantaneas.

### Por que React.lazy?

O Vite ja faz code-splitting automatico, mas sem lazy loading, todas as paginas sao carregadas no bundle inicial. Com lazy, cada pagina so e carregada quando acessada.

### Schema.org LocalBusiness

Permite que o Google exiba informacoes ricas como:
- Endereco com link para Maps
- Telefone clicavel
- Horario de funcionamento
- Avaliacao (se configurada)

