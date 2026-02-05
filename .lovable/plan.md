

# Relatório de Performance e SEO - Lab Acrílicos

## Resumo Executivo

Analisei a página completa e identifiquei **23 pontos de melhoria** divididos em 3 categorias: Performance (velocidade), SEO On-Page (encontrabilidade) e SEO Técnico (indexação).

---

## Diagnóstico Atual

### O Que Já Está Bom

| Item | Status |
|------|--------|
| Meta tags básicas (title, description) | OK |
| Schema.org LocalBusiness | OK |
| Sitemap.xml com todas as páginas | OK |
| robots.txt configurado | OK |
| Lazy loading de páginas (React.lazy) | OK |
| Lazy loading de imagens (`loading="lazy"`) | Parcial |
| Preconnect para Supabase | OK |
| Fonte do sistema (sem Google Fonts) | OK |
| Canonical URL definida | OK |

---

## PROBLEMAS IDENTIFICADOS

### PERFORMANCE (Velocidade)

| # | Problema | Impacto | Prioridade |
|---|----------|---------|------------|
| 1 | **20+ imagens carregando simultaneamente** na home | Imagens de 700ms-2.6s cada = LCP lento | CRÍTICO |
| 2 | **Imagens sem dimensões definidas (width/height)** | Causa Layout Shift (CLS alto) | ALTO |
| 3 | **Imagens do hero não otimizadas** | Primeira imagem visível demora | ALTO |
| 4 | **Nenhum preload para imagem LCP** | Atrasa o Largest Contentful Paint | ALTO |
| 5 | **Google Maps iframe no footer** | Bloqueia recursos externos | MÉDIO |
| 6 | **Som de notificação carregado (notification.mp3)** | Recurso desnecessário no carregamento | BAIXO |

### SEO ON-PAGE (Conteúdo)

| # | Problema | Impacto | Prioridade |
|---|----------|---------|------------|
| 7 | **H1 muito longo e genérico** | Google trunca e perde relevância | ALTO |
| 8 | **Falta de H2/H3 com palavras-chave estratégicas** | Perde oportunidade de ranquear termos específicos | ALTO |
| 9 | **Imagens sem alt text descritivo** | Perde tráfego do Google Imagens | MÉDIO |
| 10 | **Links internos sem texto âncora otimizado** | Não passa relevância para páginas internas | MÉDIO |
| 11 | **Falta de conteúdo textual extenso** | Google prefere páginas com 500+ palavras | MÉDIO |
| 12 | **Páginas de produto sem meta tags próprias** | Todas compartilham a mesma description | CRÍTICO |
| 13 | **Falta FAQ Schema** | Perde rich snippets de perguntas | MÉDIO |
| 14 | **Falta Product Schema nas páginas de produto** | Não aparece como produto no Google Shopping | ALTO |

### SEO TÉCNICO

| # | Problema | Impacto | Prioridade |
|---|----------|---------|------------|
| 15 | **og-image.jpg não existe** | Compartilhamento feio em redes sociais | ALTO |
| 16 | **Falta manifest.json (PWA)** | Não instala como app, perde pontos | BAIXO |
| 17 | **Falta Apple Touch Icon** | Ícone feio ao salvar no iPhone | BAIXO |
| 18 | **Sitemap sem lastmod** | Google não sabe quando atualizar | MÉDIO |
| 19 | **Falta hreflang** (se tiver versão internacional) | N/A para site local | N/A |
| 20 | **Botões sem aria-label adequados** | Acessibilidade prejudicada | MÉDIO |
| 21 | **Falta BreadcrumbSchema** nas páginas de produto | Perde navegação estruturada no Google | MÉDIO |
| 22 | **Title da página não muda por rota** | Todas as páginas têm o mesmo title | CRÍTICO |
| 23 | **Description não muda por rota** | Conteúdo duplicado para o Google | CRÍTICO |

---

## PLANO DE AÇÃO PRIORIZADO

### FASE 1: Correções Críticas (Impacto Imediato)

#### 1.1 Meta Tags Dinâmicas por Página

Criar um componente `SEOHead` que atualiza title e description para cada rota:

**Solução**: Usar `react-helmet-async` ou document.title + meta tags dinâmicas

| Página | Title Sugerido | Description |
|--------|---------------|-------------|
| Home | Lab Acrílicos - Fábrica de Acrílico no RJ | Fábrica de produtos em acrílico sob medida. Troféus, medalhas, displays, urnas. Orçamento em 24h. Rio de Janeiro. |
| Chapas | Chapas de Acrílico RJ - Preço de Fábrica | Chapas de acrílico cristal, colorido, PS, PETG, Policarbonato. Corte sob medida. Entrega para todo Brasil. |
| Troféus | Troféus Personalizados em Acrílico - Lab Acrílicos | Fabricação de troféus em acrílico sob medida. Personalização com laser. Orçamento grátis. |

#### 1.2 Otimização de Imagens LCP

**Problema atual**: 20 imagens carregam juntas, primeira leva 700ms+

**Solução**:
- Adicionar `fetchpriority="high"` na primeira imagem visível
- Preload da imagem hero no HTML
- Adicionar width/height explícitos em todas as imagens

```html
<!-- No index.html -->
<link rel="preload" as="image" href="URL_DA_PRIMEIRA_IMAGEM" />
```

```tsx
<!-- No componente -->
<img 
  src={url} 
  alt="Descrição" 
  width={400} 
  height={300}
  loading={index === 0 ? "eager" : "lazy"}
  fetchPriority={index === 0 ? "high" : "auto"}
/>
```

#### 1.3 Criar og-image.jpg

Criar imagem 1200x630px com:
- Logo Lab Acrílicos
- Texto "Fábrica de Acrílico no RJ"
- Produtos de destaque

### FASE 2: SEO de Conteúdo

#### 2.1 Reestruturar H1 e Headings

**Atual (ruim)**:
```
FÁBRICA DE PRODUTOS PERSONALIZADOS e DISTRIBUIDORA DE CHAPAS DE ACRÍLICO E SIMILARES.
```

**Proposto (otimizado)**:
```
Fábrica de Acrílico no Rio de Janeiro
```

Mover detalhes para H2:
```
H2: Produtos Personalizados em Acrílico Sob Medida
H2: Chapas de Acrílico, PS, PETG e Policarbonato
```

#### 2.2 Adicionar FAQ Schema

Adicionar seção de Perguntas Frequentes com Schema:
- "Qual o prazo de entrega?"
- "Vocês fazem corte sob medida?"
- "Como solicitar orçamento?"

#### 2.3 Adicionar Product Schema nas Páginas

```json
{
  "@type": "Product",
  "name": "Troféu de Acrílico Personalizado",
  "description": "Troféu em acrílico cristal com personalização a laser",
  "brand": "Lab Acrílicos",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "BRL",
    "availability": "https://schema.org/InStock"
  }
}
```

### FASE 3: Performance Avançada

#### 3.1 Lazy Load do Google Maps

Só carregar o iframe do mapa quando o footer entrar na viewport:

```tsx
const [mapVisible, setMapVisible] = useState(false);
// Usar IntersectionObserver para detectar quando footer aparece
```

#### 3.2 Otimização de Imagens no Supabase Storage

Usar transformações de imagem do Supabase:
```
?width=400&quality=80
```

#### 3.3 Adicionar BreadcrumbSchema

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://labacrilicos.com.br/"},
    {"@type": "ListItem", "position": 2, "name": "Acrílico Sob Medida", "item": "https://labacrilicos.com.br/acrilico-sob-medida"},
    {"@type": "ListItem", "position": 3, "name": "Troféus Personalizados"}
  ]
}
```

---

## RESUMO DAS ALTERAÇÕES NECESSÁRIAS

| Arquivo | Alteração |
|---------|-----------|
| `src/components/SEOHead.tsx` | Novo componente para meta tags dinâmicas |
| `index.html` | Preload de imagem hero, Apple Touch Icon |
| `src/pages/Index.tsx` | H1 otimizado, width/height nas imagens |
| `src/pages/products/*.tsx` | Meta tags e Schema específicos por produto |
| `public/og-image.jpg` | Nova imagem para redes sociais |
| `public/sitemap.xml` | Adicionar lastmod em todas as URLs |
| `src/components/ui/GoogleMapEmbed.tsx` | Lazy load do iframe |
| Todas as imagens | Adicionar width, height, alt descritivo |

---

## MÉTRICAS ESPERADAS APÓS IMPLEMENTAÇÃO

| Métrica | Atual (Estimado) | Depois |
|---------|------------------|--------|
| First Contentful Paint | ~1.5s | < 0.8s |
| Largest Contentful Paint | ~3.0s | < 1.5s |
| Cumulative Layout Shift | Alto | < 0.1 |
| SEO Score (Lighthouse) | ~70 | 95+ |
| Acessibilidade | ~80 | 95+ |

---

## SEÇÃO TÉCNICA

### Por Que Meta Tags Dinâmicas São Essenciais

O Google trata cada URL como uma página única. Se todas têm o mesmo title/description:
1. O Google considera "conteúdo duplicado"
2. Apenas uma página ranqueia por termo
3. CTR cai porque descrições não correspondem à busca

### Por Que width/height nas Imagens

Sem dimensões, o navegador não sabe quanto espaço reservar. Quando a imagem carrega, todo o layout "pula" (Layout Shift). Isso:
1. Piora a experiência do usuário
2. Diminui a nota de CLS no Core Web Vitals
3. Prejudica o ranking no Google

### Por Que Preload da Imagem LCP

O browser só descobre imagens quando parseia o CSS/JS. Preload no HTML avisa antecipadamente: "Baixe esta imagem já!". Pode reduzir LCP em 200-500ms.

### Palavras-chave Estratégicas para SEO

Baseado no nicho, termos com alto volume de busca:
- "chapas de acrílico" (principal)
- "fábrica de acrílico RJ"
- "troféu de acrílico personalizado"
- "display de acrílico"
- "urna de acrílico"
- "medalha personalizada"
- "acrílico sob medida"
- "policarbonato alveolar"

