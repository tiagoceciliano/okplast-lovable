## Diagnóstico técnico — Speed Index 9.6 s

Speed Index mede a velocidade com que pixels da dobra "pintam". Hoje a home tem 3 gargalos que atrasam a pintura progressiva:

1. **Fontes Google bloqueando a primeira pintura útil**
   - `index.html` carrega `Montserrat` em **5 pesos** (400/500/600/700/800) via CSS hospedado no Google Fonts.
   - O CSS é injetado via truque `media="print" onload="this.media='all'"`, então o navegador só descobre os arquivos `.woff2` depois que o CSS chega → cadeia longa: HTML → fonts.googleapis.com (CSS) → fonts.gstatic.com (5 woff2).
   - Apenas o peso 700 está com `<link rel=preload>`, os outros 4 entram tarde e atrasam a "consolidação visual" que o Speed Index mede.

2. **8 imagens JPG do grid de chapas (~339 KB total) competindo pela rede**
   - Estão em `src/assets/chapas-hero/*.jpg` (até 92 KB cada). Mesmo com `loading="lazy"`, em desktop os primeiros 4 cards ficam dentro do viewport inicial e disputam banda com fontes/JS.
   - Sem variantes WebP/AVIF e sem `sizes`/`srcset` — o navegador baixa o JPG em resolução cheia (400×400) mesmo em telas pequenas.

3. **JS de terceiros e widgets sobem cedo demais**
   - `gtag.js` é carregado `async` no topo do `<head>`, antes mesmo dos preloads críticos.
   - `MotivosCarousel`, `TestimonialCard`, `FAQSection` e o bloco "Por que escolher" entram no bundle inicial da Home (eager) — empurram TBT/SI mesmo estando abaixo da dobra.

Também: `<meta http-equiv="Cache-Control" no-cache>` no HTML não impacta SI diretamente, mas impede que a CDN sirva o HTML cacheado e piora visitas repetidas (TTFB).

---

## Mudanças propostas

### 1. `index.html` — encurtar a cadeia crítica de fontes
- Reduzir Montserrat para **2 pesos**: 500 (corpo) e 700 (títulos). 400/600/800 não são realmente usados na dobra.
- Trocar o CSS do Google Fonts por `<link rel=stylesheet>` direto (com `&display=swap`) — o navegador já trata `swap` corretamente; o truque `media=print` cria 1 round-trip extra que atrasa a pintura.
- Manter o `preload` do woff2 do peso 700 (LCP do H1) e adicionar o do peso 500.
- Mover `gtag.js` para o final do `<body>` (continua `async`, mas não compete com os preloads).
- Remover as 3 metatags `Cache-Control/Pragma/Expires` — `Cache-Control` deve vir do servidor; o `<meta>` só funciona em alguns navegadores e atrapalha a CDN.

### 2. Imagens do grid de chapas — converter para WebP e dimensionar
- Converter os 8 arquivos `src/assets/chapas-hero/*.jpg` para WebP via `vite-imagetools` (já recomendado pela infra Lovable) ou pré-compactando com `sharp/squoosh` e commitando `.webp` ao lado dos `.jpg`. Alvo: < 20 KB por imagem em 400×400.
- Em `src/pages/Index.tsx`, importar a versão `.webp` e renderizar:
  - Primeiros 4 cards (acima da dobra em desktop): `loading="eager"` + `fetchpriority="low"` (não competem com o LCP de texto mas pintam cedo).
  - Cards 5–8: continuam `loading="lazy"`.
  - Adicionar `sizes="(min-width: 768px) 25vw, 50vw"` para o navegador escolher o melhor tamanho.

### 3. `src/App.tsx` — dividir a Home em chunks por dobra
- Manter `Index` eager (acelera LCP), mas dentro de `src/pages/Index.tsx` envolver as seções abaixo da dobra em `React.lazy` + `Suspense`:
  - `MotivosCarousel`, bloco de Depoimentos (`TestimonialCard`), `FAQSection` e o bloco "Por que escolher".
- Reduz o JS executado nos primeiros segundos → SI cai porque o thread principal libera mais cedo para pintar.

### 4. `src/components/home/HeroSection.tsx` — pintura instantânea
- Remover o `py-12 md:py-16 lg:py-20` exagerado (deixa muito espaço em branco que conta como "não pintado" no SI). Reduzir para `py-8 md:py-12`.
- Garantir que `text-foreground` e `text-accent` venham de tokens já presentes no CSS crítico (sem dependência de JS para aparecer).

### 5. (Opcional, alto ganho) Self-host Montserrat
- Baixar `Montserrat-500.woff2` e `Montserrat-700.woff2` para `public/fonts/` e declarar `@font-face` em `src/index.css` com `font-display: swap`.
- Elimina a dependência de `fonts.googleapis.com` (1 host a menos no caminho crítico). Deixar como passo opcional caso queira simplicidade primeiro.

---

## Arquivos a tocar

- `index.html`
- `src/pages/Index.tsx`
- `src/components/home/HeroSection.tsx`
- (gerados) `src/assets/chapas-hero/*.webp`
- (opcional) `src/index.css` + `public/fonts/*.woff2`

---

## Validação após o deploy

1. Hard reload + aba anônima em `https://okplast.com.br/?nocache=1`.
2. Rodar `https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fokplast.com.br` (mobile e desktop).
   - **Meta**: Speed Index ≤ 3,4 s; idealmente abaixo de 2,5 s no desktop.
3. No Chrome DevTools → aba **Performance** com throttling "Slow 4G + 4× CPU":
   - Verificar que o filmstrip mostra texto + grid de chapas pintados antes de 2,5 s.
   - Confirmar na aba **Network** que `Montserrat` traz só 2 arquivos woff2 e que os JPGs do grid sumiram (substituídos por WebP).
4. Conferir no Search Console → "Core Web Vitals" em ~28 dias se a página sai do balde "Precisa de melhorias".

Sem regressão esperada em LCP/CLS — as mudanças reforçam a dobra principal.