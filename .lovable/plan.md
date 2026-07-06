## Problema

Na tela de edição do Lucas (e outros membros) os campos **E-mail** e **Nova senha** estão desabilitados porque o membro está com **"Sem usuário de login"** vinculado. Hoje o dialog só permite editar credenciais quando já existe um usuário Auth vinculado — o que trava você quando o vendedor ainda não tem login criado (caso do Lucas, Amanda, etc.).

## Solução

Permitir **criar um novo login direto do dialog "Editar membro"** quando não há usuário vinculado, além de continuar suportando vincular a um usuário já existente.

### Comportamento novo do dropdown "Usuário de login vinculado"

Três opções:
1. **"Criar novo login"** (padrão quando o membro não tem `user_id`) → habilita E-mail + Senha, exige ambos, cria o usuário Auth e vincula.
2. **"Sem usuário de login"** → mantém desvinculado (só login por WhatsApp/número, sem acesso ao admin).
3. **Lista dos usuários Auth existentes** → vincula a um já criado; permite trocar e-mail/senha desse usuário.

### Fluxo ao salvar

- Se "Criar novo login": chama `create-team-member` (edge function já existente) com `nome`, `email`, `password`, `role`, mas **sem criar novo whatsapp_numbers** — precisa ajustar a função para aceitar um `link_whatsapp_id` opcional; quando presente, cria o auth user + role e faz `UPDATE whatsapp_numbers SET user_id=<novo> WHERE id=<link_whatsapp_id>` em vez de inserir uma nova linha.
- Se usuário existente: fluxo atual (update whatsapp_numbers.user_id, user_roles, e chama `update-team-member` para email/senha se mudou).
- Se "Sem usuário": limpa `user_id` da linha.

### Mudanças de código

**`supabase/functions/create-team-member/index.ts`**
- Aceitar campo opcional `link_whatsapp_id: string`.
- Quando presente: pular o `insert` em `whatsapp_numbers` e fazer `update` na linha existente ligando o novo `user_id`; ignorar `numero_raw`/`peso`/etc. do body (a linha já existe).

**`src/pages/admin/Vendedores.tsx` — `EditMemberDialog`**
- Adicionar opção `"new"` no `Select` de usuário vinculado, e torná-la o valor padrão quando `member.user_id` for null.
- Habilitar campos E-mail e Senha quando `userId === "new"` (obrigatórios) ou quando um usuário existente estiver selecionado (opcionais).
- Ajustar `submit`:
  - `userId === "new"`: valida email+senha, chama `create-team-member` com `link_whatsapp_id: member.id` e os outros campos do formulário.
  - `userId === "none"`: apenas UPDATE em `whatsapp_numbers` limpando `user_id`.
  - `userId === "<uuid>"`: fluxo atual.
- Atualizar o texto de ajuda ("Selecione um usuário…") para refletir as 3 opções.

### O que NÃO muda

- Botão "Adicionar membro" continua igual (cria membro+login de uma vez).
- Botão da chave (KeyRound) continua igual (só aparece para membros já com user_id).
- Tabelas, RLS, permissões, edge function `update-team-member` — nenhuma alteração.

## Resultado

Você abre "Editar" no Lucas → dropdown já vem em **"Criar novo login"** → preenche e-mail + senha → Salvar → login do Lucas fica criado e vinculado, sem precisar do fluxo "Adicionar membro".