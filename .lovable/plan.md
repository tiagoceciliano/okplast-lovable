## Diagnóstico

A estrutura atual da Edge Function `process-lead` já envia exatamente os mesmos campos do print (name, email, phone, product, tipo_material, message, location{}, utm_*, submitted_at, submitted_time, current_url).

O motivo de só `name`, `email` e `phone` terem dado match no Kinbox é provavelmente um dos dois:

1. **`location` é um objeto aninhado** — muitos sistemas de inbound (incluindo Kinbox) só mapeiam campos de **primeiro nível** (string/number). Objetos aninhados ficam invisíveis no mapeamento.
2. Campos como `submitted_at` e `submitted_time` chegando vazios/sem valor consistente nos envios reais (quando o lead vem sem UTM, vários campos viram string vazia `""` — alguns sistemas ignoram strings vazias no auto-mapping da primeira amostra).

## Mudança proposta

Achatar `location` em três campos planos e garantir que todos os campos cheguem sempre preenchidos (com `"-"` ou `"N/A"` quando vazios, para o Kinbox detectar o campo na primeira amostra de payload).

**Novo payload enviado ao webhook:**

```json
{
  "name": "...",
  "email": "...",
  "phone": "5521...",
  "product": "...",
  "tipo_material": "...",
  "message": "...",
  "city": "Rio de Janeiro",
  "state": "RJ",
  "country": "Brazil",
  "utm_source": "...",
  "utm_medium": "...",
  "utm_campaign": "...",
  "utm_term": "...",
  "utm_content": "...",
  "submitted_at": "25/06/2026",
  "submitted_time": "14:00:00",
  "current_url": "https://okplast.com.br/"
}
```

Mesmos nomes do print, sem objeto aninhado.

## Implementação

Arquivo único: `supabase/functions/process-lead/index.ts`

- Trocar o bloco `location: { city, state, country }` por três chaves planas: `city`, `state`, `country`.
- Substituir `""` por `"-"` como fallback nos campos opcionais (utm_*, message, current_url, city, state) para garantir presença na primeira amostra de payload do Kinbox.
- Não mexer em mais nada (validação, banco, geolocalização e `cleanPhone` permanecem).

## Passo seguinte (lado Kinbox)

Depois do deploy, vou enviar um payload de teste via `curl` para o webhook. Você precisa **reabrir o mapeamento de campos no Kinbox** e remapear, pois ele só "aprende" campos novos quando recebe um payload com a nova estrutura.
