

## Plano de Performance — Meta: Tempo Total < 2s (Produção)

### Diagnóstico Real (dados do profiler)

| Métrica | Atual | Meta |
|---------|-------|------|
| FCP | 5.4s | < 1.5s |
| Full Load | 6.4s | < 2s |
| Scripts | 109 arquivos (dev) | ~5 chunks (prod) |
| Imagens na home | 8 eager + 5 lazy | 0 eager above-fold (hero é texto puro) |

### Causas Raiz Identificadas

1. **Google Fonts via `@import` no CSS** (`src/index.css` linha 1) — **RENDER-BLOCKING**. O CSS inteiro espera o download da fonte antes de pintar qualquer coisa. Este é o maior vilão.

2. **8 imagens de chapas carregando eager** na Home — as primeiras 4 imagens do grid têm `loading="eager"` e `decoding="sync"`, competindo com o CSS e JS pelo bandwidth.

3. **console.log em produção** (`useUTM.ts`) — 5 `console.log` executando em cada page load, incluindo no carregamento do módulo (antes do React).

4. **Notification audio pré-carregado** — `WhatsAppFloatingButton` agenda download de MP3 em 5 segundos.

5. **Falta preconnect para Google Fonts** no `index.html`.

6. **Home hero é texto puro** — não tem imagem, mas o LCP espera a fonte Montserrat carregar.

---

### Ações (ordenadas por impacto)

**1. Mover Google Fonts do CSS para o HTML com preconnect + preload** (MAIOR IMPACTO)
- Remover `@import url(...)` da linha 1 de `src/index.css`
- Adicionar no `index.html`:
  - `<link rel="preconnect" href="https://fonts.googleapis.com">`
  - `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
  - `<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap">`
  - `<link rel="stylesheet" href="..." media="print" onload="this.media='all'">`
- Adicionar fallback font-display no CSS: `font-family: 'Montserrat', system-ui, sans-serif` (já existe)
- **Resultado esperado**: FCP cai ~2-3 segundos

**2. Tornar todas as imagens do grid lazy** 
- Em `src/pages/Index.tsx`, mudar as primeiras 4 imagens de `loading="eager"` para `loading="lazy"` e `decoding="async"`
- O hero da Home é texto puro — não precisa de nenhuma imagem eager

**3. Remover console.logs de produção**
- Em `src/hooks/useUTM.ts`, remover ou envolver em `if (import.meta.env.DEV)` os 5 `console.log`

**4. Adiar áudio de notificação**
- Em `WhatsAppFloatingButton.tsx`, não pré-carregar o Audio object — criar apenas no momento do play

**5. Preconnect para Supabase já existe — OK**

**6. Adicionar font-display: swap inline como fallback**
- Garantir que mesmo se a fonte demorar, o texto aparece com system font primeiro

---

### Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| `index.html` | Adicionar preconnect + preload Google Fonts |
| `src/index.css` | Remover `@import url(...)` da linha 1 |
| `src/pages/Index.tsx` | Imagens do grid → todas `loading="lazy"` |
| `src/hooks/useUTM.ts` | Remover/condicionar console.logs |
| `src/components/layout/WhatsAppFloatingButton.tsx` | Adiar criação do Audio |

### Impacto Esperado

Com a remoção do `@import` render-blocking do Google Fonts (a mudança #1), o FCP deve cair de ~5.4s para ~2s no ambiente de dev. Em produção (build otimizado com bundling), o tempo total deve ficar abaixo de 2s, pois os 109 scripts viram ~5 chunks otimizados.

