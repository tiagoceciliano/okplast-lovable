## Objetivo
Página interna `/admin/negociacoes` (Kanban) substituindo o Kinbox. Simples. Lead que entra pelo site cria automaticamente uma **negociação em ENTRADA** já com o vendedor do rateio como responsável.

## Regras importantes de posse
- **Vendedor é dono da NEGOCIAÇÃO, não do LEAD.** Se o mesmo cliente voltar meses depois, o rateio de WhatsApp roda normal e uma nova negociação nasce com quem recebeu — sem vínculo com o vendedor anterior.
- Nada de guardar `responsavel_id` na tabela `leads`.

## Etapas do pipeline
ENTRADA → EM CONTATO → ORÇAMENTO ENVIADO → NEGOCIAÇÃO → VENDA REALIZADA → PERDIDO

## Papéis
Enum `app_role` passa a ter: `admin`, `gestor`, `vendedor`.
- **admin**: tudo.
- **gestor**: tudo em negociações/leads, pode ter número de WhatsApp cadastrado (só de referência, peso=0, não entra no rateio).
- **vendedor**: por padrão só visualiza; edita apenas negociações onde é responsável; nunca exclui.

## Página unificada "Vendedores & WhatsApp" (`/admin/vendedores`)
Substitui a atual `/admin/whatsapp`. Uma única tela com abas:

**Aba 1 — Equipe**
Lista todos os usuários (admin, gestor, vendedor). Cada linha:
- Nome, email, papel (dropdown admin/gestor/vendedor)
- WhatsApp (opcional; gestor pode ter só de referência)
- Peso do rateio (%) — para vendedor obrigatório; gestor fica travado em 0
- Switch "Recebe lead" (para gestor sempre desligado)
- Switch "Ativo"
- Botão remover
Botão "Adicionar membro" → cria usuário no Supabase Auth (edge function `create-team-member` com service role), envia senha inicial, vincula role e (se aplicável) linha em `whatsapp_numbers` com o `user_id`.
Regras: soma dos pesos ativos (só quem "Recebe lead") = 100%. Igual à página atual.

**Aba 2 — Permissões**
Matriz por papel (não por usuário — mais simples e coerente com pedido de pré-configurar o vendedor):
```
                    | Ver | Editar | Excluir
Leads               |     |        |
Negociações         |     |        |
Tarefas             |     |        |
Comentários         |     |        |
WhatsApp/Vendedores |     |        |
Dashboard           |     |        |
```
Para vendedor há dois modos por linha: "Tudo" ou "Só o meu" (aplicável a Leads e Negociações; Negociação usa `responsavel_id = auth.uid()`).
Padrões vendedor: Ver=Só o meu, Editar=Só o meu, Excluir=não. Padrões gestor: tudo liberado.
Salvo em nova tabela `role_permissions` (role, resource, can_view, can_edit, can_delete, scope: 'all'|'own').

**Aba 3 — Como funciona o rateio** (info card atual)

## Página `/admin/negociacoes` (Kanban)
- 6 colunas com título, contagem e "R$ total".
- Cards: nome + telefone, valor, avatar do responsável, tags/produto, contadores (tarefas, comentários), badge vermelho se tarefa vencida.
- Drag & drop entre colunas (`@dnd-kit/core`) atualiza `etapa` e `posicao`.
- Filtros no topo: por responsável, tag, busca.
- Botão "+" no rodapé de cada coluna cria negociação manual.
- Sidebar admin ganha item "Negociações".

## Modal de detalhe (estilo Kinbox)
- Header: nome + telefone, ✓ (mover p/ ganho) e ✗ (perdido), atribuir responsável (dropdown com quem "Recebe lead"), tags.
- Barra de etapas clicável.
- Esquerda: campo de comentário, botão "Tarefa", lista de tarefas com checkbox, histórico cronológico automático.
- Direita: Add valor, Add produto (texto livre), material, data/hora do lead, UTMs, msg do formulário, bloco Contato.

## Banco de dados (nova migração)

**Alterar enum** `app_role`: adicionar `gestor` e `vendedor`.

**Alterar `whatsapp_numbers`**:
- adicionar `user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL` (nullable — pode existir número sem usuário, mas o normal é vinculado)
- adicionar `recebe_lead boolean NOT NULL DEFAULT true` (gestor = false)

**Nova `role_permissions`**
Colunas: `role app_role`, `resource text`, `can_view boolean`, `can_edit boolean`, `can_delete boolean`, `scope text` ('all'|'own'). PK (role, resource). Seed com defaults acima.

**Nova `negociacoes`**
`id, lead_id (FK nullable), nome_cliente, telefone, email, etapa (enum), responsavel_id (FK auth.users), valor numeric, produto text, material, mensagem, utm_*, posicao int, tags text[], created_at, updated_at`. Trigger `updated_at`.

**Nova `negociacao_tarefas`**: `negociacao_id, titulo, data_vencimento, concluida, created_by`.

**Nova `negociacao_comentarios`**: `negociacao_id, autor_id, texto`.

**Nova `negociacao_historico`**: `negociacao_id, autor_id, tipo, descricao` (log automático via trigger em mudança de etapa/responsável).

**RLS** (usando `has_role` já existente):
- Admin e gestor: full access em tudo.
- Vendedor em `negociacoes`: SELECT/UPDATE apenas se `responsavel_id = auth.uid()`. Sem DELETE.
- Vendedor em `leads`: SELECT apenas se existir negociação sua ligada a esse lead. Sem edit/delete.
- `role_permissions`: SELECT authenticated (frontend usa pra esconder botões); INSERT/UPDATE/DELETE só admin.
- `whatsapp_numbers`: admin edita; leitura mantém como está (anon lê ativos com `recebe_lead=true`).

**GRANTs**: authenticated para leitura das tabelas relevantes; service_role total (necessário para `process-lead`).

## Fluxo automático de entrada (rateio → responsável)
Alterar `supabase/functions/process-lead/index.ts`:
1. Após inserir o lead, buscar em `whatsapp_numbers` o registro cujo `numero_raw = destino_whatsapp` recebido do client, pegar `user_id`.
2. Inserir `negociacoes` com etapa=`entrada`, `responsavel_id=user_id`, dados do lead + UTMs, `posicao = max+1 na coluna`.
3. Se `user_id` for null (número sem vínculo), grava negociação sem responsável — admin atribui depois.

## Login vendedor/gestor
- `/admin/login` continua igual.
- Renomear `RequireAdmin` → `RequireAuth` com prop `roles`. Rotas de config e dashboard exigem admin ou gestor; `/admin/negociacoes` aceita os três; `/admin/leads` fica admin+gestor+vendedor (com RLS filtrando).
- Após login: admin/gestor → `/admin`; vendedor → `/admin/negociacoes`.
- Frontend consulta `role_permissions` e esconde botões conforme scope/permissão. RLS continua sendo a barreira real.

## Arquivos afetados
- Migration (enum, alter whatsapp_numbers, novas tabelas, seed permissions, RLS, grants, triggers).
- `supabase/functions/process-lead/index.ts` — cria negociação automática.
- Nova edge function `create-team-member` (service role — cria user + role + linha em whatsapp_numbers).
- `src/App.tsx` — rota `/admin/negociacoes`, remover `/admin/whatsapp`, adicionar `/admin/vendedores`.
- `src/components/admin/RequireAdmin.tsx` → `RequireAuth` com `roles`.
- `src/pages/admin/components/AdminSidebar.tsx` — novo item "Negociações", renomear "WhatsApp" para "Vendedores & WhatsApp".
- Novos: `src/pages/admin/Negociacoes.tsx`, `src/pages/admin/Vendedores.tsx` (com 3 abas), `src/pages/admin/components/kanban/*` (Board, Column, Card, DetailModal, TarefasList, ComentariosList, PermissionsMatrix).
- Novo hook `src/hooks/usePermissions.ts` (retorna `{ can(resource, action, ownerId?) }`).
- `bun add @dnd-kit/core @dnd-kit/sortable`.

## Fora de escopo
- Notificações email/WhatsApp de tarefa (só lembrete visual).
- Catálogo de produtos com preço (valor e produto livres).
- Metas/Campanhas/Contatos do Kinbox.
- Importar histórico do Kinbox.
- Permissões por usuário individual (só por papel).
