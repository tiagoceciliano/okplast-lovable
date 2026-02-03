
# Plano: Ajustar JSON do Webhook WhatsApp para Kinbox

## Objetivo

Modificar a estrutura do JSON enviado pela Edge Function `process-lead` (formulario WhatsApp) para corresponder exatamente ao formato esperado pelo Kinbox.

---

## Estrutura Atual vs Esperada

| Campo Atual | Campo Kinbox |
|-------------|--------------|
| `nome` | `name` |
| `email` | `email` |
| `telefone` | `phone` (sem formatacao) |
| `produto_interesse` | `product` |
| `mensagem` | `message` |
| `cidade` | `location.city` (objeto aninhado) |
| `estado` | `location.state` (objeto aninhado) |
| `pais` | `location.country` (objeto aninhado) |
| `utm_source` | `utm_source` (manter) |
| `utm_medium` | `utm_medium` (manter) |
| `utm_campaign` | `utm_campaign` (manter) |
| `utm_term` | `utm_term` (manter) |
| `utm_content` | `utm_content` (manter) |
| `timestamp_sao_paulo` | `submitted_at` + `submitted_time` (separados) |
| - | `current_url` (novo) |

---

## Alteracoes Necessarias

### 1. Edge Function: `supabase/functions/process-lead/index.ts`

#### Adicionar campo `current_url` ao payload de entrada

```typescript
interface LeadPayload {
  nome: string;
  email: string;
  telefone: string;
  produto_interesse: string;
  mensagem?: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  current_url?: string | null;  // NOVO
}
```

#### Adicionar funcao para separar data e hora

```typescript
function getSaoPauloDateTime(): { date: string; time: string } {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { timeZone: "America/Sao_Paulo" };
  
  const date = now.toLocaleDateString("pt-BR", options); // "03/02/2026"
  const time = now.toLocaleTimeString("pt-BR", { 
    ...options, 
    hour12: false 
  }); // "15:30:45"
  
  return { date, time };
}
```

#### Funcao para limpar telefone (apenas numeros)

```typescript
function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}
```

#### Novo formato do webhookPayload

```typescript
const { date, time } = getSaoPauloDateTime();

const webhookPayload = {
  // Dados do contato
  name: payload.nome,
  email: payload.email,
  phone: cleanPhone(payload.telefone), // Remove formatacao
  product: payload.produto_interesse,
  message: payload.mensagem || "",
  
  // Localizacao como objeto aninhado
  location: {
    city: geoData.city || "",
    state: geoData.region || "",
    country: geoData.country_name || "Brazil",
  },
  
  // UTMs
  utm_source: payload.utm_source || "",
  utm_medium: payload.utm_medium || "",
  utm_campaign: payload.utm_campaign || "",
  utm_term: payload.utm_term || "",
  utm_content: payload.utm_content || "",
  
  // Data e hora separados (fuso Sao Paulo)
  submitted_at: date,   // "03/02/2026"
  submitted_time: time, // "15:30:45"
  
  // URL atual
  current_url: payload.current_url || "",
};
```

---

### 2. Frontend: `src/components/layout/WhatsAppModal.tsx`

Adicionar `current_url` ao body enviado para a Edge Function:

```typescript
supabase.functions.invoke("process-lead", {
  body: {
    nome: nomeFormatado,
    email: data.email,
    telefone: telefoneFormatado,
    produto_interesse: data.produto,
    mensagem: data.mensagem,
    current_url: window.location.href,  // NOVO
    ...utmData,
  },
}).catch(console.error);
```

---

## Resultado Final - JSON Enviado

```json
{
  "name": "Teste Tiago",
  "email": "ceciliano.tiago@gmail.com",
  "phone": "21989398711",
  "product": "Chapa Inteira ou Cortada",
  "message": "testes testes2",
  "location": {
    "city": "Sao Jose",
    "state": "Santa Catarina",
    "country": "Brazil"
  },
  "utm_source": "instagram",
  "utm_medium": "manychat",
  "utm_campaign": "sde-jan25",
  "utm_term": "org",
  "utm_content": "convite",
  "submitted_at": "13/01/2025",
  "submitted_time": "16:46:57",
  "current_url": "https://pagelabacrilicos.lovable.app/chapas-de-acrilico/?utm_source=instagram"
}
```

---

## Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `supabase/functions/process-lead/index.ts` | Ajustar estrutura do webhookPayload, adicionar funcao de data/hora e limpeza de telefone |
| `src/components/layout/WhatsAppModal.tsx` | Adicionar envio do `current_url` |

---

## Apos Implementacao

Sera necessario fazer um teste de envio pelo formulario WhatsApp para verificar se o Kinbox esta recebendo corretamente a nova estrutura.
