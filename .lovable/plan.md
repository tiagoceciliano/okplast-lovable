

# Plano: Alterar Remetente do Email

## Situação Atual

```typescript
from: "Lab Acrílicos <noreply@email.labacrilicos.com.br>"
```

## Alteração Proposta

Combinar as duas mudanças: nome do cliente + email comercial:

```typescript
from: `${payload.nome} via Lab Acrílicos <comercial@email.labacrilicos.com.br>`
```

### Resultado Visual no Kinbox

```
De: João Silva via Lab Acrílicos <comercial@email.labacrilicos.com.br>
Reply-To: joao.silva@gmail.com
```

---

## Alteração no Código

**Arquivo:** `supabase/functions/send-quote-email/index.ts`

**Linha 390** - De:
```typescript
from: "Lab Acrílicos <noreply@email.labacrilicos.com.br>",
```

**Para:**
```typescript
from: `${payload.nome} via Lab Acrílicos <comercial@email.labacrilicos.com.br>`,
```

---

## Nota sobre Domínio

O subdomínio `email.labacrilicos.com.br` já está verificado no Resend, então `comercial@email.labacrilicos.com.br` funcionará imediatamente.

Se preferir usar `comercial@labacrilicos.com.br` (sem o "email." no subdomínio), será necessário verificar o domínio raiz `labacrilicos.com.br` no painel do Resend em https://resend.com/domains.

