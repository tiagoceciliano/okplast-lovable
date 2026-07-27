## Objetivo
Inserir um aviso discreto, fixo e visível em todas as páginas do site com a mensagem:
> "Não trabalhamos com placas customizadas, somente com chapas vendidas inteiras (podendo cortá-las para facilitar o transporte)."

## Onde vai aparecer
No topo da página, acima do header, em todas as rotas do site (não na área administrativa). O header continuará fixo/sticky, deslizando junto com o banner.

## Como será visualmente
- **Uma única linha fina** (altura ~36-40 px), sem quebrar a hierarquia visual.
- **Cor sugerida**: tom âmbar/dourado (`gold` do design system) com texto escuro. É chamativo o suficiente para ser um alerta, mas não parece erro como o vermelho.
- Ícone de alerta pequeno (ex.: triângulo ou ponto de exclamação) à esquerda.
- Texto centralizado, fonte reduzida.
- Botão de fechar (X) à direita, opcional, para não incomodar usuários recorrentes. O estado de fechamento pode ser lembrado via `localStorage`.
- Em mobile, o texto pode reduzir levemente ou quebrar em duas linhas se necessário.

## Implementação
1. **Novo componente** `src/components/layout/AlertBanner.tsx`
   - Recebe a mensagem como prop ou constante.
   - Usa tokens semânticos do design system (`bg-gold`, `text-gold-foreground`, `bg-destructive` se preferir vermelho, etc.).
   - Gerencia estado de aberto/fechado com `localStorage`.
2. **Ajuste em `src/components/layout/Layout.tsx`**
   - Renderiza `<AlertBanner />` imediatamente antes do `<Header />`.
3. **Ajuste em `src/components/layout/Header.tsx`**
   - Como o header é `sticky top-0`, ele precisa passar a ser `sticky top-[36px]` (ou a altura do banner) para não ficar escondido atrás do banner.
   - Em mobile, se o banner quebrar em mais linhas, usar `top-[var(--banner-height)]` dinâmico.
4. **(Opcional) Novo token CSS**
   - Se o tom `gold` atual não for ideal, criar um token `--alert` e `--alert-foreground` em `src/index.css` e `tailwind.config.ts`.

## O que não será alterado
- Nenhuma lógica de negócio, backend, admin ou CRM.
- Nenhuma página de produto.
- Não se altera o rodapé (a sugestão é topo, que é mais visível sem poluir o conteúdo).

## Critério de aceitação
- O banner aparece em todas as páginas do site.
- O header continua sticky e desce junto com o banner ao rolar.
- Em mobile o layout não quebra.
- A mensagem está legível e discreta.

Se preferir outra cor (vermelho/alaranjado) ou posição (rodapé fixo), posso ajustar o plano antes de implementar.