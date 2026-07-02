
## Objetivo
Atacar exatamente os itens que o PageSpeed elencou para subir de **65 → 85+** no mobile, focando em CLS (0.289), LCP (4,1s) e JS não usado (287KB).

## Correções

### 1. Eliminar o CLS 0.289 da hero (maior ganho)
Causa: fonte Montserrat carrega depois do primeiro paint e o texto da hero "salta" quando ela troca.
- Adicionar no `<head>` do `index.html`:
  - `<link rel="preload" as="font" type="font/woff2" href="https://fonts.gstatic.com/s/montserrat/v31/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2" crossorigin>` (peso 500)
  - Mesmo `preload` para o woff2 do peso 700 já detectado.
- Trocar `display=swap` por `display=optional` no `<link>` do Google Fonts (elimina reflow: se a fonte não vier em ~100ms usa fallback sem trocar depois).
- Definir `font-family` fallback com métrica próxima no CSS global (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`) para minimizar diferença visual.

### 2. Corrigir gtag carregando 2×
O relatório mostra `/gtag/js?id=AW-18068965569` listado duas vezes (288KB, ~160KB economizáveis).
- Auditar `index.html` e componentes React (`useEffect` que injeta script) — remover a duplicata. Manter apenas o carregamento diferido (`requestIdleCallback`) já presente no `index.html`.

### 3. Reduzir peso das imagens acima da dobra
- **Logo**: gerar versão em 320×96 (2× para retina) em vez de 560×270. Substituir arquivo em `src/assets/` e atualizar `Header.tsx`. Economia: ~9,5KB.
- **Card policarbonato-alveolar**: reduzir para 630×630 (2× do display 315×315) ou adicionar `srcset` com variantes menores. Economia: ~10KB.

### 4. Reduzir LCP (render delay 320ms)
- Adicionar `<link rel="preload" as="image" href="/lovable-uploads/e3c63f33-...webp" fetchpriority="high">` para o logo (que é elemento LCP candidato junto com o texto da hero).
- Confirmar que o texto da hero (`<p>` LCP) não depende de nenhum estado async — renderizar direto sem `Suspense`.

### 5. Reduzir JS não usado (127KB no bundle)
- Fazer code-split das rotas administrativas (`/admin/*`) via `React.lazy` — elas não deveriam entrar no bundle da home.
- Verificar se `Toaster` (`toaster-E8i22Fyf.js`, 6KB) pode ser lazy também.

### 6. Cache lifetime
- Hospedagem Lovable já serve `/assets/*` com hash e cache longo, mas `/lovable-uploads/*.webp` está sem TTL. Como não temos controle direto sobre headers do host, mover a logo para `src/assets/` (entra no pipeline do Vite com hash + cache-control longo automático).

## Fora de escopo
- Migrar analytics (gtag continua como único tracking, conforme regra do projeto).
- Alterar layout/design da hero.

## Métricas alvo esperadas após o deploy
- CLS: 0.289 → < 0.05
- LCP: 4,1s → ~2,5s
- Score Performance mobile: 65 → 85+
