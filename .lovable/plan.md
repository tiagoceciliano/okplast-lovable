
# Plano: Modal de Orçamento por Email + Envio para comercial@labacrilicos.com.br

## Visão Geral

Criar um modal de orçamento por email (similar ao modal do WhatsApp) que ao ser enviado:
1. Salva o lead no banco de dados
2. Envia para o webhook Kinbox
3. **Envia um email** para comercial@labacrilicos.com.br

---

## Pré-requisito: Configurar Resend

Para enviar emails, você precisa:

1. **Criar conta no Resend**: Acesse [resend.com](https://resend.com) e crie uma conta gratuita
2. **Verificar domínio**: Adicione e verifique o domínio `labacrilicos.com.br` em [resend.com/domains](https://resend.com/domains)
   - Você precisará adicionar alguns registros DNS (o Resend mostra exatamente quais)
3. **Criar API Key**: Gere uma chave em [resend.com/api-keys](https://resend.com/api-keys)
4. **Adicionar Secret**: Eu vou pedir para você adicionar a chave `RESEND_API_KEY` nos secrets do projeto

---

## Estrutura da Solução

```text
┌─────────────────────────────────────────────────────────────┐
│                     MODAL EMAIL                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Formulário: Nome, Email, Telefone, Produto, Mensagem   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                         │                                    │
│                    [Enviar]                                  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Edge Function: send-quote-email                 │
│                                                              │
│  1. Valida dados                                             │
│  2. Salva lead no banco (tabela leads)                       │
│  3. Envia para webhook Kinbox                                │
│  4. Envia email via Resend para comercial@labacrilicos.com.br│
└─────────────────────────────────────────────────────────────┘
```

---

## Arquivos a Criar/Modificar

### 1. Novo Componente: `src/components/layout/EmailQuoteModal.tsx`

Modal com visual profissional de formulário de email:
- Header com ícone de email
- Campos: Nome, Email, Telefone, Produto, Mensagem
- Botão "Enviar Orçamento"
- Feedback de sucesso/erro

### 2. Novo Context: `src/contexts/EmailQuoteModalContext.tsx`

Similar ao WhatsAppModalContext para gerenciar estado do modal globalmente

### 3. Nova Edge Function: `supabase/functions/send-quote-email/index.ts`

```text
Responsabilidades:
- Validar payload
- Capturar IP e geolocalização
- Salvar lead no banco
- Enviar para webhook Kinbox
- Enviar email via Resend

Email enviado:
- DE: noreply@labacrilicos.com.br (ou orçamentos@labacrilicos.com.br)
- PARA: comercial@labacrilicos.com.br
- REPLY-TO: email do cliente (para você responder direto)
- ASSUNTO: "Novo Orçamento - [Produto] - [Nome do Cliente]"
```

### 4. Modificar: `src/pages/Index.tsx`

Trocar o link `/home/orcamento` por um botão que abre o modal de email

### 5. Modificar: `src/App.tsx`

Adicionar o EmailQuoteModalProvider

### 6. Atualizar: `supabase/config.toml`

Adicionar configuração da nova edge function

---

## Formato do Email

```text
═══════════════════════════════════════════════════
  NOVO ORÇAMENTO - LAB ACRÍLICOS
═══════════════════════════════════════════════════

DADOS DO CLIENTE:
─────────────────
Nome: João Silva
Email: joao@exemplo.com
Telefone: (21) 99999-9999

PRODUTO DE INTERESSE:
─────────────────────
Display de Acrílico

MENSAGEM:
─────────
Preciso de um display personalizado para minha loja...

───────────────────────────────────────────────────
Origem: Rio de Janeiro, RJ
Data: 31/01/2026 às 14:30
Lead ID: #12345
───────────────────────────────────────────────────
```

---

## Fluxo do Usuário

1. Usuário clica em "Prefere orçamento via e-mail?"
2. Modal abre com formulário
3. Usuário preenche dados
4. Clica em "Enviar Orçamento"
5. Sistema:
   - Mostra loading
   - Salva no banco
   - Envia para Kinbox
   - Envia email para comercial@
6. Modal mostra mensagem de sucesso
7. Modal fecha automaticamente

---

## Detalhes Técnicos

### Secret Necessário

```
RESEND_API_KEY = "re_xxxxxxxxxx"
```

### Configuração TOML

```toml
[functions.send-quote-email]
verify_jwt = false
```

### Tratamento de Erros

- Se Resend falhar: Lead já está salvo no banco e no Kinbox
- Se Kinbox falhar: Email ainda é enviado
- Todos os erros são logados para debug

---

## Próximos Passos

1. **Você configura o Resend** (criar conta, verificar domínio, gerar API Key)
2. **Você me passa a API Key** e eu adiciono nos secrets
3. **Eu implemento** o modal, context e edge function
4. **Testamos** o fluxo completo
