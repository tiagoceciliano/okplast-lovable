
# Plano de correção de Performance — okplast.com.br

## Diagnóstico (por que o score continua 48 mesmo após as rodadas anteriores)

Ao reler o código encontrei 4 problemas concretos que ainda seguram LCP/FCP/CLS/TBT:

1. **Logo do header é o LCP real e está gigante.** Em `Header.tsx` o `<img>` da logo usa `h-16 md:h-24 lg:h-32` (128 px de altura no desktop, 64 px no mobile) com `fetchPriority="high"` + `<link rel="preload">` no `index.html`. Como a HeroSection é só texto, essa logo enorme vira o elemento LCP — arquivo desnecessariamente pesado no caminho crítico.

2. **Google Fonts continua bloqueando renderização.** O `<link rel="stylesheet" href="fonts.googleapis.com/...">` no `<head>` é render-blocking. Isso segura FCP (3.2 s) e LCP (4.1 s). O preconnect ajuda, mas não elimina o bloqueio.

3. **gtag.js roda cedo demais.** O script do Google Ads está no `<body>` sem `defer` real (fica atrás de `main.tsx` mas ainda executa durante a hidratação, roubando main-thread → contribui para TBT 430 ms e "Reduce unused JS 690 ms").

4. **Providers pesados carregados eager na home.** `Toaster`, `Sonner` e `TooltipProvider` (Radix) entram no bundle inicial mesmo sem uso na dobra. Sonner sozinho puxa animações e estilos que não são necessários até o primeiro toast.

5. **CLS 0.289** — a métrica piorou de novo. Causas atuais: (a) `min-h-[320px]` da HeroSection é menor que a altura real com Montserrat carregado (o texto ainda "salta" quando a fonte troca), (b) o logo do header muda de tamanho em breakpoints diferentes sem `aspect-ratio` estável, (c) o carrossel de motivos não reserva altura mínima.

---

## Mudanças de código

### 1. `index.html` — desbloquear fontes e adiar gtag
- Trocar o `<link rel="stylesheet">` do Google Fonts pelo padrão **preload + `media="print" onload="this.media='all'"`** (com `<noscript>` fallback). Fonts continuam chegando cedo, mas param de bloquear o render.
- **Remover** o `<link rel="preload" as="image" href="/lovable-uploads/e3c63f33-...webp">` — está reservando banda para uma logo que vai encolher.
- Mover o bloco `gtag` para um `<script>` que só executa após `window.addEventListener("load", ...)` **ou** no primeiro `requestIdleCallback`. Mantém tracking, mas sai do caminho crítico.

### 2. `src/components/layout/Header.tsx` — encolher e estabilizar a logo
- Reduzir para `h-10 md:h-12` (40/48 px) — tamanho de header real, praticamente o padrão de sites profissionais. A logo deixa de ser LCP.
- Adicionar `width={160} height={48}` reais e `style={{ aspectRatio: "160/48" }}` para eliminar shift.
- Remover `fetchPriority="high"`; deixar `loading="eager"` sem prioridade.

### 3. `src/App.tsx` — lazy nos providers de UI
- Converter `Toaster` e `Sonner` para `lazy()` + `<Suspense fallback={null}>`. Eles só aparecem após ações do usuário; nada visível se demoram 100 ms.
- Manter `TooltipProvider` (é um provider de contexto, tem que envolver a árvore), mas confirmar que `@radix-ui/react-tooltip` não vai para o vendor inicial — se necessário, adicionar entrada `"radix-vendor"` no `manualChunks` do `vite.config.ts`.

### 4. `src/components/home/HeroSection.tsx` — travar altura contra CLS
- Substituir `min-h-[320px] md:min-h-[360px]` por altura **fixa** que já cabe o texto com Montserrat carregado. Medido pelo conteúdo atual: `min-h-[420px] md:min-h-[440px]`.
- Adicionar `contain: "layout"` (via `style`) no `<section>` para isolar reflows.

### 5. `src/components/home/MotivosCarousel.tsx` (só ler e ajustar se necessário)
- Garantir `min-h` no wrapper para não empurrar conteúdo quando os slides trocam. É pequena edição, pontual.

### 6. `vite.config.ts` — chunk extra para Radix
- Adicionar `"radix-vendor": [/^@radix-ui\//]` no `manualChunks` (via função) para isolar ~30 kB do bundle inicial.

---

## Como validar depois

1. **Lighthouse mobile em aba anônima** (`pagespeed.web.dev`) — meta: Performance ≥ 85, LCP ≤ 2.5 s, FCP ≤ 1.8 s, CLS ≤ 0.10, TBT ≤ 200 ms.
2. **DevTools → Performance** com throttling "Slow 4G + 4x CPU": confirmar que o LCP element passou a ser o H1 do hero (elemento leve) e não mais a logo.
3. **DevTools → Coverage**: confirmar que `sonner-*.js`, `radix-vendor-*.js` e `gtag/js` só carregam depois do `load`.
4. **WebPageTest filmstrip**: verificar que o primeiro paint acontece antes de 1.5 s e nenhum layout shift ocorre entre 1.5 s e 5 s.
5. **VibeSpeed** — rodar novamente após publicar e comparar Score/Web Vitals.

Todas as alterações são superficiais (5 arquivos), sem mexer em lógica de negócio nem rotas.
