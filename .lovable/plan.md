## Diagnóstico do relatório atual (mobile, Perf 89)

- **LCP 3,0s** — "Element render delay" ainda em 990 ms. O parágrafo LCP existe no HTML, mas só é considerado "pintado" depois do CSS externo aplicar (font-family, cor).
- **Render-blocking (330 ms)**: `index-*.css` (170 ms) + Google Fonts CSS (750 ms) ainda estão bloqueando.
- **Google Fonts ainda no caminho crítico** — mesmo com `requestIdleCallback`, o browser dispara em ~489 ms porque a página fica ociosa muito cedo (a hero estática já pintou).
- **JS não usado (83 KiB)** — `client-*.js` (React vendor, 43 KiB unused) + `index-*.js` (39 KiB unused).
- **CSS não usado (11 KiB)** no bundle Tailwind.
- **Cadeia crítica de 1.914 ms** puxada pelo `track-visit` (Supabase).

## Correções

### 1. CSS principal non-blocking (economia 170 ms na LCP)
Adicionar plugin `transformIndexHtml` no `vite.config.ts` que reescreve, **apenas no build de produção**, o `<link rel="stylesheet" href="/assets/index-*.css">` gerado pelo Vite para:
```html
<link rel="preload" as="style" href="/assets/index-*.css" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/assets/index-*.css"></noscript>
```
O CSS crítico inline no `<head>` (já implementado) continua garantindo a hero.

### 2. Adiar Google Fonts para depois da LCP real (economia 750 ms de render-blocking + tira da chain crítica)
Trocar o gatilho atual (`requestIdleCallback` após `load`) por um mais tardio — carregar só depois de qualquer um destes:
- `PerformanceObserver` disparar `largest-contentful-paint` (ou seja, LCP já foi medida), ou
- primeira interação do usuário (`pointerdown`, `keydown`, `scroll`, `touchstart`), ou
- fallback `setTimeout` de 6 s.

Como o CSS crítico já usa `Montserrat Fallback` com métricas casadas (sem CLS), o swap tardio não é perceptível.

### 3. Purge de CSS não usado (economia 11 KiB)
Já temos Tailwind purge ativo, mas 11 KiB são de classes shadcn/tailwind não usadas na home (`accordion-*`, `sonner`, etc. injetadas via `@tailwind components/utilities`). Ganho pequeno; deixar como bônus se sobrar tempo — sem tocar em componentes.

**Ação prática**: revisar `tailwind.config.ts` → remover animações e keyframes não usados (`accordion-*` fica se o FAQ usa; `float` provavelmente não é usado — auditar). Ganho estimado 2-3 KiB.

### 4. Reduzir 39 KiB não usados do `index-*.js`
Dois candidatos identificáveis:
- `SEOHead` importa `react-helmet-async` (~9 KiB gzip) — mover para dentro de `useEffect` via `import()` dinâmico não é viável (Helmet precisa render). Alternativa: substituir por manipulação direta do `document.title` + `document.querySelector('meta[name=description]')` em `useEffect`. Simples, mesmo resultado para SEO (Google renderiza JS).
- `WhatsAppModalProvider` importa `useState`/context — ok. Mas o `MainSite` importa `Layout` que importa `useUTM` + `usePageVisit` eager. Já ok.

**Ação**: substituir `react-helmet-async` por hook próprio `useDocumentHead` que escreve title/description/canonical/schema no `document` via `useEffect`. Remove a dependência do `HelmetProvider` do `App.tsx`.

### 5. Tirar `track-visit` da chain crítica de 1.914 ms
Ele já roda em `requestIdleCallback` (timeout 2000 ms) — mas o Lighthouse enxerga como crítico porque o timeout dispara antes da LCP quando a página fica ociosa rápido. Aumentar `timeout` para **5000 ms** e disparar só após o evento `load` + 1 s extra (via `setTimeout` aninhado). Como é analytics, atrasar 2-3 s é irrelevante.

## Arquivos afetados
- `vite.config.ts` — plugin para CSS non-blocking em produção.
- `index.html` — trocar loader de fontes por gatilho pós-LCP.
- `src/hooks/usePageVisit.ts` — atrasar mais o `track-visit`.
- `src/components/SEOHead.tsx` — reescrever como hook DOM direto (sem Helmet).
- `src/App.tsx` — remover `HelmetProvider`.
- `package.json` — remover dep `react-helmet-async`.
- `tailwind.config.ts` — remover keyframes/animações não usadas.

## Alvo
- **LCP: 3,0s → ~1,8s**
- **FCP: 2,9s → ~1,8s** (com CSS non-blocking)
- **Performance mobile: 89 → 95+**

## Fora de escopo
- Redesenhar a home ou alterar layout.
- Reduzir o React vendor (`client-*.js` 213 KiB) — exigiria trocar React por Preact, algo muito invasivo.
