## Diagnóstico PageSpeed (mobile, score 87)

Métricas: FCP 2.6s · **LCP 2.6s** (delay de render de 3.66s) · TBT 0ms · **CLS 0.02** · **SI 6.4s**. TBT já está zerado, então o ganho vem de LCP + Speed Index + CLS.

Principais achados do relatório:
1. **Render-blocking (~530ms):** `/assets/index-*.css` (13.6KB) e Google Fonts CSS (750ms) ainda bloqueiam.
2. **LCP element render delay 3.66s:** o elemento LCP é o `<p>` da hero. A hero inline no `index.html` é substituída pela versão React na hidratação, o que reinicia a métrica.
3. **CLS 0.02:** vem do `WhatsAppFloatingButton` (montado tardio via `Suspense`, empurra layout).
4. **Unused JS 82KB:** `client-*.js` (53.8KB) e `index-*.js` (96.6KB).
5. **Unused CSS 11KB** no bundle Tailwind.
6. **Cache curto:** `/sounds/notification.mp3` sem cache, `~flock.js` só 25min.
7. **Legacy JS / Minify JS 2KB:** relativo ao `/__l5e/events.js`.

---

## O que posso corrigir

### 1. Eliminar render-block do CSS de verdade
O `vite.config.ts` já tem `nonBlockingCssPlugin` que troca `<link rel="stylesheet">` por `preload+onload`, mas o HTML servido ainda aparece bloqueando. Vou:
- Verificar/ajustar o plugin para que o transform rode no build final servido.
- Adicionar `media="print" onload="this.media='all'"` como fallback além do preload.

### 2. Remover render-block e latência do Google Fonts
Hoje o `index.html` tem `<noscript><link stylesheet ... fonts.googleapis.com></noscript>` e um loader tardio. Vou:
- Self-hostar o `Montserrat 500/700 woff2` em `/public/fonts/` com `@font-face { font-display: optional }` no CSS crítico inline.
- Remover totalmente as chamadas a `fonts.googleapis.com` e `fonts.gstatic.com` (elimina 2 requests third-party e 750ms de latência).

### 3. Zerar CLS do botão flutuante do WhatsApp
- Reservar o espaço fixo (`bottom-6 right-6`) via placeholder ou renderizar o container vazio imediatamente, hidratando o conteúdo depois.
- Alternativa: remover o `Suspense` lazy do `WhatsAppFloatingButton` (peso é minúsculo, ~2KB) e montar direto.

### 4. Estabilizar o elemento LCP (reduzir "render delay" de 3.6s)
- Fazer o `HeroSection` React renderizar exatamente o mesmo DOM da hero inline (mesmas classes, mesmo texto) para que a hidratação não re-crie o `<p>` LCP.
- Manter apenas um `<h1>` renderizado (evitar duplicidade entre static + React).

### 5. Reduzir JS não usado (~40KB)
- Lazy-load do `react-helmet-async` só em rotas que setam SEO custom (a home já tem tudo no `index.html`).
- Mover `WhatsAppModal`, `WhatsAppChatWidget` e `useUTM/usePageVisit` para carregar após `requestIdleCallback` / primeira interação (hoje `useUTM` e `usePageVisit` rodam no `Layout` no mount).
- Rodar `track-visit` (Supabase edge function) via `navigator.sendBeacon` diferido (hoje aparece na cadeia crítica de 6.8s).

### 6. Reduzir CSS não usado (~11KB)
- Ativar `content` mais restrito no Tailwind e habilitar `safelist` só do necessário.
- Remover utilitários não usados de componentes shadcn não importados.

### 7. Cache do `/sounds/notification.mp3`
- O arquivo é usado apenas no admin. Remover do bundle público (mover para import dinâmico dentro de `/admin`) para não aparecer no home.

---

## O que NÃO posso corrigir

Estes itens são da plataforma de hospedagem/tracking Lovable e não são editáveis pelo código do projeto:

- **`/__l5e/events.js`** (9.3KB, 2KB de minify possível) — script de tracking injetado pela plataforma.
- **`/~flock.js`** (Google Ads gtag, cache 25min) — injetado automaticamente; não posso alterar headers de cache.
- **`client-DVofI4QP.js` (53.8KB, ~43KB unused)** — runtime da plataforma. Não é do bundle da app.
- **Headers HTTP de cache** (`Cache-Control`, TTL de assets estáticos, mp3) — controlados pelo CDN da Lovable.
- **CrUX / dados reais de usuários** — depende de volume de tráfego real do site.
- **CPU throttling 1.2x + Slow 4G** do teste simulado — parâmetros do Lighthouse.

---

## Ganho esperado

Aplicando 1–4 (as maiores alavancas): FCP cai para ~1.4s, LCP para ~1.6s, SI para ~3.5s, CLS para 0.00. Isso deve levar o score para **92–96**. Itens 5–7 são reforço para manter margem.

## Ordem de execução

1. Self-host da Montserrat + remoção do Google Fonts.
2. Ajuste do `nonBlockingCssPlugin` + fallback `media=print`.
3. Igualar DOM da hero React ao inline (fim do render delay).
4. Reservar espaço do WhatsAppFloatingButton.
5. Diferir `useUTM`, `usePageVisit` e `track-visit`.
6. Mover `notification.mp3` para dentro do bundle admin.
7. Rebuild e reteste no PageSpeed.
