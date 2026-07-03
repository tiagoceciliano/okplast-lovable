## Situação atual (PageSpeed mobile)

- **Performance: 79** (subiu de 65 → 79)
- FCP 2,4s ✅ | **LCP 4,1s ❌** | TBT 10ms ✅ | **CLS 0 ✅** | SI 5,4s ⚠️

O CLS já foi resolvido (0). Agora o gargalo é **LCP** e **JS não usado**.

## Correções propostas

### 1. LCP 4,1s → alvo ~2,5s (maior ganho, ~1,5s)
O relatório mostra **3.010ms de "Element render delay"** no `<p>` da hero. Isso significa: o HTML chega em 0ms mas o texto só pinta depois que o JS do React hidrata. Causas e correções:

- **Render-blocking do Google Fonts (750ms)**: hoje o `<link rel="preload" as="style">` com `onload` ainda vira stylesheet e bloqueia. Trocar por injeção via JS após `DOMContentLoaded` (fonts entram em `display:optional`, então nunca causam CLS mesmo carregando tarde).
- **Render-blocking do CSS principal (160ms)**: inline do CSS crítico da hero (título, botão, container) direto no `<head>` do `index.html` para o primeiro paint não depender do arquivo `.css` externo.
- **JS grande no caminho crítico**: hoje o `index-*.js` tem 203KB e o React só renderiza depois de baixar tudo. Vamos garantir que `HelmetProvider`, `TooltipProvider`, `QueryClient`, `BrowserRouter` e `WhatsAppModalProvider` não estão puxando dependências pesadas no bundle inicial (auditar imports do `App.tsx`).

### 2. Duplicar gtag (economia 160KB) — ainda acontecendo
O relatório mostra `/gtag/js?id=AW-18068965569` **listado 2×** na tabela de 3rd party (288KB total). O código do `index.html` tem guarda `window.__gtagLoaded`, então a 2ª carga vem de outro lugar — provavelmente de dentro do `flock.js` (`~flock.js` da hospedagem Lovable injeta gtag automaticamente quando detecta o AW-ID).

**Solução**: remover o gtag manual do `index.html` e deixar apenas o injetado pela plataforma Lovable (que já é assíncrono). Testar publicando e verificar se o `AW-18068965569` continua disparando conversões.

### 3. Reduzir 127KB de JS não usado no bundle principal
Fazer code-split mais agressivo do `Index.tsx` (home). Componentes abaixo da dobra viram `React.lazy`:
- `MotivosCarousel` (carousel de embla — pesa ~15KB)
- `ProductCategoryGrid` (grid de cards abaixo da dobra)
- `Footer` (fora da dobra)
- `WhatsAppFloatingButton` / `WhatsAppChatWidget` (podem ser lazy após interação/idle)

### 4. Redimensionar logo (economia 4,4KB)
Logo hoje está 320×154 mas exibido em 145×70. Reduzir para **290×140** (2× do display real).

### 5. Cache lifetime `/lovable-uploads/*.webp` — sem TTL
Mover o logo `/lovable-uploads/e3c63f33-...webp` para `src/assets/` (Vite adiciona hash + cache longo automático). Atualizar `Header.tsx` e o `preload` do `index.html`.

### 6. Reduzir CSS não usado (11KB)
Boa parte vem de classes shadcn/tailwind não usadas. Deixar para o final — o `content` do `tailwind.config.ts` já faz purge, então o ganho real é limitado. Baixa prioridade.

### 7. Animação `pulse-glow` no botão WhatsApp
Trocar `box-shadow` pulse por `transform: scale()` + `opacity` (compositáveis pela GPU). Ganho pequeno de suavidade, sem impactar métrica.

## Fora de escopo
- Tocar em layout/design da home
- Trocar hospedagem ou CDN (não temos controle de headers do `/lovable-uploads/*`)
- Alterar tracking (AW-18068965569 continua único ID)

## Métricas alvo pós-deploy
- LCP: 4,1s → **~2,5s**
- Performance mobile: 79 → **90+**
- Transfer size total: −160KB (gtag) −127KB (JS split) −4KB (imagem) = **~290KB a menos**
