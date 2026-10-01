# Plano: deixar o sistema mais rápido (telas, salvar, mensagens)

## Diagnóstico (o que encontrei)

- **Banco de dados está saudável.** As tabelas são pequenas (≈1.200 negociações, poucas conversas). As consultas mais lentas são gravações de visitas do site e criação de negociação (média 20–60 ms). O servidor não é o gargalo.
- **O problema principal está no código das telas:**
  1. **Nada fica guardado em memória.** Cada vez que você abre Funil, Conversas ou uma negociação, tudo é baixado de novo do zero. Trocar de tela e voltar = carregar tudo de novo.
  2. **Depois de salvar, a tela recarrega tudo.** Mover um card, ganhar/perder, criar negociação: o funil inteiro (negociações + tarefas + comentários + conversas + agendamentos) é buscado de novo antes de mostrar o resultado.
  3. **Conversas recarrega a lista inteira a cada evento.** Qualquer mensagem nova ou alteração em qualquer conversa refaz a busca completa da fila.
  4. **Etiquetas e equipe são buscadas repetidamente** (a tabela de etiquetas foi lida mais de 13 mil vezes) — cada componente pede de novo.
  5. **Enviar mensagem espera o servidor** para só depois aparecer no chat.
  6. **Funil busca dados de todas as negociações de uma vez**, inclusive ganhas/perdidas antigas, sem paginação.
- **Visitas do site** gravam uma linha por página aberta (5.700+ gravações), ocupando o banco junto com o CRM.

## O que vou fazer (em ordem de impacto)

1. **Memória compartilhada de dados** — Funil, Conversas, Etiquetas, Equipe e Permissões ficam guardados; ao voltar para a tela, aparece na hora e atualiza em segundo plano.
2. **Salvar instantâneo** — mover card, mudar etapa, etiqueta, responsável, tarefa, comentário: a tela muda na hora; se o servidor recusar, desfaz e avisa.
3. **Mensagem aparece na hora** — ao enviar, o balão surge imediatamente com relógio "enviando", e vira tique quando o servidor confirma (ou mostra "falhou, tentar de novo").
4. **Atualização em tempo real cirúrgica** — em Conversas e no chat, só a conversa/mensagem que mudou é atualizada, sem recarregar tudo.
5. **Funil mais leve** — carregar só negociações em aberto + ganhas/perdidas recentes (ex.: últimos 30 dias), com opção "ver mais antigas"; contagens de tarefas/comentários/agendamentos calculadas no banco numa única consulta.
6. **Abrir telas mais cedo** — pré-carregar dados ao passar o mouse nos links do menu e no card (a negociação abre já carregada).
7. **Índices no banco** para as buscas mais usadas (telefone da conversa, mensagens por conversa, tarefas/comentários por negociação, agendamentos pendentes).
8. **Medição antes/depois** — cronometrar abrir Funil, abrir Conversa, salvar e enviar mensagem, e te mostrar os tempos.

## O que NÃO muda
Layout, regras de permissão (vendedor vê só o dele), janela de 24h e agendamentos continuam iguais.

## Detalhes técnicos
- Adotar TanStack Query (`QueryClient` já disponível no router) com `staleTime` por recurso; hooks `useNegociacoes`, `useConversas`, `useEtiquetas`, `useEquipe`; `usePermissions` migrado para query.
- Mutations com `onMutate` otimista + rollback; `setQueryData` em vez de `load()`.
- Realtime: aplicar `payload.new` no cache por id em `Conversas.tsx`/`ConversaChat.tsx`; filtro por `conversa_id`.
- RPC `get_funil_resumo()` (SECURITY INVOKER, respeita RLS) retornando contagens por negociação; filtro de status/data no select do funil; colunas explícitas no lugar de `*`.
- Migração com índices em `whatsapp_conversas(telefone)`, `whatsapp_mensagens(conversa_id, created_at)`, `negociacao_tarefas(negociacao_id)`, `negociacao_comentarios(negociacao_id)`, `whatsapp_agendamentos(conversa_id) where status='pendente'`.
- `router.preload` / `prefetchQuery` em hover nos links e cards.
- Medição via Playwright autenticado antes e depois.
