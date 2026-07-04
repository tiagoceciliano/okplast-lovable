## Diagnóstico do relatório atual (mobile, Perf 72)

- **LCP 3,9s** — o elemento LCP é o `<p>` da hero, com **5.770 ms de "Element render delay"**. Como é uma SPA, o `<div id="root">` fica vazio até o React montar; nada visível pinta até baixar HTML + CSS + JS (`index-*.js` 103 KiB + `client-*.js` 54 KiB).
- **Speed Index 9,5s** — mesma causa: o primeiro paint só acontece quando a árvore React aparece.
- **Render-blocking (350 ms)**: `index-*.css` (180 ms) + Google Fonts (750 ms).
- **JS não usado (167 KiB)**: `gtag.js` 145 KiB (85 KiB unused) + `index-*.js` (38 KiB unused) + `client-*.js` (43 KiB unused, React vendor).
- **Cadeia crítica**: `whatsapp_numbers` e `track-visit` ao Supabase entram no caminho crítico da LCP (disparados no mount do `Layout`/`Header`).
- **Não composto**: animação `pulse-glow` no botão WhatsApp usa `box-shadow` (roda no main thread).

## Correções (em ordem de impacto)

### 1. Pintar a hero antes do React (maior ganho — deve levar LCP de 3,9s para ~1,5s)
Injetar o HTML estático da hero (título, subtítulo, parágrafo LCP, CTA) direto dentro do `<div id="root">` no `index.html`, com o CSS crítico inline no `<head>` (tokens de cor da hero, tipografia, layout do container e do botão). Assim o texto LCP pinta no primeiro parse de HTML, sem esperar JS. Quando o React montar via `createRoot`, ele substitui o conteúdo pela versão real (mesmo visual → sem "flash").

O CSS crítico inline (~1,5 KiB) traz: reset mínimo, `.container-custom`, tipografia da hero, cores primary/accent/muted-foreground, botão `.btn-whatsapp`, e a variável de fonte fallback (`Montserrat Fallback` já configurada) para não haver reflow quando a Montserrat carregar.

### 2. Eliminar o CSS render-blocking (economia 180 ms)
Além do CSS crítico inline (#1), adicionar `media="print" onload="this.media='all'"` no `<link>` do `index-*.css` — o browser baixa sem bloquear render. Fallback `<noscript>` para SEO.

Como o Vite emite o `<link>` do CSS automaticamente, aplicar via plugin simples no `vite.config.ts` (transformIndexHtml) que reescreve o link do CSS gerado.

### 3. Remover o gtag manual do `index.html` (economia ~145 KiB no caminho crítico)
O relatório mostra apenas 1 gtag agora — o injetado pelo `~flock.js` da plataforma Lovable. Manter só ele. Remover todo o bloco `<script>...gtag...</script>` do `index.html`.

### 4. Adiar Supabase (whatsapp_numbers + track-visit) para fora do caminho crítico da LCP
- `usePageVisit` (chama `track-visit`): trocar disparo imediato por `requestIdleCallback` com `timeout: 3000` (ou `setTimeout(..., 2500)` como fallback). Não muda nada de UX, tira 2 requests da cadeia crítica.
- `useWhatsAppNumber`: o número inicial já vem do `localStorage` (sync). Adiar a revalidação em rede via `requestIdleCallback`. O botão WhatsApp já aparece com o número certo desde o primeiro paint.

### 5. Adiar Google Fonts para depois da LCP
Trocar o loader atual (que dispara no `load`) por `requestIdleCallback` com `timeout: 4000`. Como o CSS crítico já usa `Montserrat Fallback` (métricas casadas com Arial), o swap não causa CLS nem "flash" perceptível. Também remove `preconnect fonts.googleapis.com` para não gastar handshake antes da LCP.

### 6. Animação composta no botão WhatsApp (elimina o aviso "non-composited")
Substituir a animação `pulse-glow` (que anima `box-shadow`) por uma variação com `::after` pseudo-elemento animando `transform: scale()` + `opacity` — mesmo efeito visual (halo pulsante verde), 100% GPU-composta.

### 7. Code-split extra da home (economia ~38 KiB no `index-*.js`)
No `Index.tsx`, mover para `lazy`:
- `BlueBanner`, `DecorativeDivider` (não estão na dobra).
- Seções "CTA Final" e "Por que escolher" (abaixo da dobra) em um único chunk `HomeBelowFold`.
Manter na dobra apenas: `HeroSection`, grid de 8 chapas, título e botão WhatsApp.

## Arquivos afetados
- `index.html` — CSS crítico inline, HTML estático da hero em `#root`, remoção do gtag, loader de fontes com `requestIdleCallback`.
- `vite.config.ts` — plugin `transformIndexHtml` para transformar o `<link rel="stylesheet">` em non-blocking.
- `src/hooks/usePageVisit.ts` — envolver o `track-visit` em `requestIdleCallback`.
- `src/hooks/useWhatsAppNumber.ts` — revalidação diferida.
- `src/index.css` — nova animação `pulse-glow` composta (transform/opacity via `::after`).
- `src/components/layout/WhatsAppFloatingButton.tsx` — ajuste no elemento (adicionar wrapper para o `::after` se necessário).
- `src/pages/Index.tsx` — `lazy()` extra para `BlueBanner`, `DecorativeDivider` e um `HomeBelowFold` (extraído para novo arquivo).
- `src/components/home/HomeBelowFold.tsx` — novo (contém CTA final + "Por que escolher").

## Alvo pós-deploy
- **LCP: 3,9s → ~1,5s** (paint imediato da hero)
- **Speed Index: 9,5s → ~4s**
- **Performance mobile: 72 → 90+**

## Fora de escopo
- Layout/design da home (visual idêntico ao atual).
- Trocar tracking (segue `AW-18068965569` via `~flock.js`).
- Tocar em admin/backend.
