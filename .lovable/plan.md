## Diagnóstico técnico (LCP 5.8s → meta ≤ 2.5s)

A página `/` é praticamente texto na dobra (H1 "DISTRIBUIDORA DE CHAPAS NO RIO DE JANEIRO" + logo no header). O candidato a LCP é **o H1** (desktop) ou **o logo do header** (mobile, onde o H1 fica abaixo). Três gargalos confirmados ao ler o código:

### 1. Preload do logo está apontando para o arquivo errado
- `index.html` faz `<link rel="preload" as="image" href="/logo-horizontal.png" fetchpriority="high">`
- O `Header.tsx` renderiza outro arquivo: `/lovable-uploads/e3c63f33-82e6-4475-9fc6-b070d0134450.png`
- Resultado: o navegador baixa **dois PNGs** (~60 KB cada) e o que realmente aparece na tela não tem prioridade. Preload é desperdiçado e dispara warning no Lighthouse.

### 2. Fonte crítica (Montserrat 700/800) chega tarde
- Hoje carregamos a folha de estilo do Google Fonts via truque `media="print" onload="this.media='all'"`, ou seja, **não-bloqueante** — bom para CLS, ruim para LCP de texto, porque o H1 pinta com fallback e depois "repinta" com Montserrat, e o Lighthouse mede o repaint final.
- Não há preload do `.woff2` do peso 700/800 efetivamente usado pelo H1.

### 3. Home está atrás de `React.lazy` + `Suspense`
- Em `src/App.tsx` a rota `/` usa `lazy(() => import("./pages/Index"))`. Isso adiciona 1 round-trip extra (HTML → main.js → Index chunk → render) antes do H1 aparecer. Em conexão 4G simulada isso sozinho custa ~600–900 ms de LCP.

### 4. Logo PNG de 60 KB e renderizado a 128 px de altura
- O arquivo original tem resolução muito maior do que precisa. Servir em WebP otimizado e dimensão correta tipicamente derruba para ~6–10 KB.

---

## Mudanças propostas

### A. `index.html`
1. Corrigir o `preload` para o caminho real do logo usado no header:
   ```html
   <link rel="preload" as="image" href="/lovable-uploads/e3c63f33-82e6-4475-9fc6-b070d0134450.webp" fetchpriority="high" />
   ```
2. **Preload do woff2 do Montserrat 700** (peso do H1) servido pela gstatic, com `crossorigin`:
   ```html
   <link rel="preload" as="font" type="font/woff2" crossorigin
         href="https://fonts.gstatic.com/s/montserrat/v29/JTUSjIg1_i6t8kCHKm45_dJE3gnD_g.woff2" />
   ```
   (URL exata será extraída do CSS atual; truque print→all permanece para os demais pesos.)
3. Remover o preload obsoleto `/logo-horizontal.png` (arquivo deixará de ser referenciado).

### B. Logo
1. Gerar versão WebP otimizada do logo (≈8–12 KB, ~560×256) e substituir o PNG em `/public/lovable-uploads/`.
2. Em `src/components/layout/Header.tsx`:
   - Trocar `src` para o `.webp`.
   - Manter `width`, `height`, `fetchPriority="high"`, adicionar `decoding="async"` e remover o filtro `brightness-0 invert` (gerar o WebP já em branco para o navegador não pagar custo de composite).

### C. `src/App.tsx`
- Importar `Index` **eager** (não-lazy) para que a home pinte na primeira passada:
  ```ts
  import Index from "./pages/Index";
  ```
  As demais rotas (`/chapas/*`, `/admin/*`, etc.) continuam `lazy`.

### D. (Opcional, baixo risco) `src/index.css`
- Garantir que o H1 declare `font-display: swap` indiretamente já está coberto pelo Google Fonts (`&display=swap`). Sem mudanças necessárias.

---

## Como validar o ganho

1. **Build local**: `bun run build` e checar que o chunk da Home agora vai para o bundle principal (some `Index-*.js` separado).
2. **PageSpeed Insights**: https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fokplast.com.br após publicar — meta LCP ≤ 2.5s em mobile.
3. **Chrome DevTools → Performance**:
   - Aba *Network*: confirmar **uma única** request do logo, com prioridade `Highest`.
   - Aba *Performance* → marcador "LCP": deve cair para < 2.5s em throttling "Slow 4G".
4. **Lighthouse**: a auditoria "Largest Contentful Paint element" deve apontar o H1 (ou o logo) com `Render delay` próximo de 0 e sem warning "preload key request".

## Critério de sucesso

- LCP mobile (PSI field/lab) ≤ 2.5 s.
- Sem warnings de "Preloaded resource not used" no Lighthouse.
- Bundle principal não cresce mais que ~20 KB gzip (custo de eager-load da Home).
