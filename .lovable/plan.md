

# Plano: Corrigir Botao Responder Cliente

## Alteracao

Modificar a funcao `generateEmailHtml` no arquivo `supabase/functions/send-quote-email/index.ts`.

---

## O Que Muda

### Assunto do Email

**Antes:**
```text
Re: Orçamento Lab Acrílicos - Chapa Inteira ou Cortada
```

**Depois:**
```text
Re: Orçamento Tiago Ceciliano - Lab Acrílicos
```

### Corpo do Email (Novo)

O botao incluira automaticamente o contexto original:

```text


------- Mensagem Original -------
De: Tiago Ceciliano <ceciliano.tiago@gmail.com>
Telefone: (21) 98939-8711
Produto: Chapa Inteira ou Cortada

Mensagem:
teste email chapa site novo
-----------------------------------
```

---

## Codigo a Alterar

**Arquivo:** `supabase/functions/send-quote-email/index.ts`

**Linhas 148-157** - Bloco do botao Reply:

```typescript
// Criar o corpo da resposta com contexto
const replyBody = encodeURIComponent(`


------- Mensagem Original -------
De: ${data.nome} <${data.email}>
Telefone: ${data.telefone}
Produto: ${data.produto}

Mensagem:
${data.mensagem || "Nenhuma mensagem adicional."}
-----------------------------------`);

const replySubject = encodeURIComponent(`Re: Orçamento ${data.nome} - Lab Acrílicos`);
```

E o link:
```html
<a href="mailto:${data.email}?subject=${replySubject}&body=${replyBody}">
```

---

## Resultado

Quando a equipe comercial clicar em "Responder Cliente":

1. Abre o Gmail com destinatario preenchido
2. Assunto: "Re: Orcamento [Nome do Cliente] - Lab Acrilicos"
3. Corpo ja vem com todas as informacoes do orcamento original
4. Cliente consegue identificar do que se trata

