## Problema

Na home (`src/pages/Index.tsx`), o componente `MountOnVisible` renderiza `<div ref={ref}>{children}</div>`. Quando ele é colocado **dentro** de um grid CSS envolvendo múltiplos filhos, esse `div` extra vira uma única célula do grid — os 4 cards de depoimento (e itens do HomeBelowFold) empilham verticalmente na primeira coluna em vez de se espalharem em 4 colunas.

Isso está visível na captura: a coluna 1 fica alta com todos os depoimentos empilhados, e o restante do grid fica vazio, empurrando o FAQ para o lado.

Também aparece um warning React (`fetchPriority` prop) no `<img>` da logo do Header — atributo em camelCase em vez de lowercase.

## Correções

### 1. `src/pages/Index.tsx` — mover MountOnVisible para fora do grid
- **Depoimentos**: envolver a `<section>` inteira (ou o próprio `<div class="grid ...">`) com um único `MountOnVisible`, e renderizar os 4 `TestimonialCard` como filhos diretos do grid.
- **HomeBelowFold**: já está envolvido corretamente por fora, verificar se o layout interno depende de largura do container (checar `src/components/home/HomeBelowFold.tsx` para garantir que não há problema similar; se houver, aplicar o mesmo padrão).

### 2. `src/components/layout/Header.tsx` — corrigir `fetchPriority`
Trocar `fetchPriority="high"` por `fetchpriority="high"` (lowercase) no `<img>` da logo, ou remover se não crítico para LCP.

## Fora de escopo
Não mexer em lógica de negócio, dados ou estilos além do necessário para restaurar o grid e limpar o warning.