

# Plano: Ajustar JSON do Webhook para Kinbox

## Objetivo

Modificar a estrutura do JSON enviado para o webhook do Kinbox para corresponder exatamente ao formato esperado.

---

## Estrutura Atual vs Esperada

| Campo Atual | Campo Kinbox |
|-------------|--------------|
| `nome` | `Dados do Contato` |
| `email` | `No Label email` |
| `telefone` | `No Label telefone` |
| `produto_interesse` | `Qual Produto de Interesse?` |
| `mensagem` | `Descreva seu Orçamento:` |
| `timestamp_sao_paulo` | `submission_date` + `submission_time` (separados) |
| `cidade` | `city` |
| `estado` | `state` |
| `pais` | `country` |
| - | `geolocation` (novo) |
| - | `Page URL` (novo) |
| - | `form_id` (novo) |
| - | `form_name` (novo) |
| `canal` | `canal` (manter) |

---

## Alteracoes no Arquivo

### Arquivo: `supabase/functions/send-quote-email/index.ts`

### 1. Adicionar funcao para separar data e hora

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

### 2. Adicionar campo page_url ao payload de entrada

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
  page_url?: string | null;  // NOVO
}
```

### 3. Capturar geolocalizacao completa (latitude/longitude)

```typescript
interface GeoData {
  city?: string;
  region?: string;
  country_name?: string;
  ip?: string;
  latitude?: number;   // NOVO
  longitude?: number;  // NOVO
}
```

### 4. Novo formato do webhookPayload

```typescript
const { date, time } = getSaoPauloDateTime();

const webhookPayload = {
  // Dados do contato
  "Dados do Contato": payload.nome,
  "No Label email": payload.email,
  "No Label telefone": payload.telefone,
  
  // Produto e mensagem
  "Qual Produto de Interesse?": payload.produto_interesse,
  "Descreva seu Orçamento:": payload.mensagem || "",
  
  // UTMs
  "utm_campaign": payload.utm_campaign || "",
  "utm_source": payload.utm_source || "",
  "utm_medium": payload.utm_medium || "",
  "utm_term": payload.utm_term || "",
  "utm_content": payload.utm_content || "",
  
  // Geolocalizacao
  "geolocation": geoData.latitude && geoData.longitude 
    ? `${geoData.latitude},${geoData.longitude}` 
    : "",
  "city": geoData.city || "Não disponível",
  "state": geoData.region || "Não disponível",
  "country": geoData.country_name || "Não disponível",
  
  // Data e hora separados (fuso Sao Paulo)
  "submission_date": date,  // "03/02/2026"
  "submission_time": time,  // "15:30:45"
  
  // Metadados do formulario
  "Page URL": payload.page_url || "",
  "form_id": "email_quote_form",
  "form_name": "Formulário de Orçamento por Email",
  
  // Canal
  "canal": "email",
  
  // ID interno (opcional manter)
  "lead_id": leadData.id,
};
```

---

## Atualizacao no Frontend

O formulario precisa enviar o `page_url` para que chegue no webhook:

```typescript
// Em EmbeddedQuoteForm.tsx ou similar
page_url: window.location.href,
```

---

## Resultado Final - JSON Enviado

```json
{
  "Dados do Contato": "Tiago Ceciliano",
  "No Label email": "ceciliano.tiago@gmail.com",
  "No Label telefone": "(21) 98939-8711",
  "Qual Produto de Interesse?": "Chapa Inteira ou Cortada",
  "Descreva seu Orçamento:": "Preciso de 5 chapas de acrílico 2mm",
  "utm_campaign": "",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_term": "",
  "utm_content": "",
  "geolocation": "-22.9068,-43.1729",
  "city": "Rio de Janeiro",
  "state": "Rio de Janeiro",
  "country": "Brazil",
  "submission_date": "03/02/2026",
  "submission_time": "15:30:45",
  "Page URL": "https://pagelabacrilicos.lovable.app/chapas-de-acrilico",
  "form_id": "email_quote_form",
  "form_name": "Formulário de Orçamento por Email",
  "canal": "email",
  "lead_id": "abc123-uuid"
}
```

---

## Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `supabase/functions/send-quote-email/index.ts` | Ajustar estrutura do webhookPayload e adicionar funcao de data/hora |
| `src/components/forms/EmbeddedQuoteForm.tsx` | Adicionar envio do page_url |

---

## Apos Implementacao

Sera necessario fazer um teste de envio pelo formulario para verificar se o Kinbox esta recebendo corretamente a nova estrutura.

