
# Plano: Otimização SEO Completa para Todas as Páginas de Produtos

## Resumo da Situação Atual

Após análise completa, identifiquei que:
- **17 páginas de produtos sob medida** estão com SEO parcial (têm seoTitle e seoDescription, mas faltam canonical URLs)
- O componente ProductPage gera Schema Product + Breadcrumb automaticamente
- Páginas institucionais estão bem configuradas

---

## Etapa 1: Adicionar Canonical URL ao Componente ProductPage

### Arquivo: `src/components/products/ProductPage.tsx`

**Alteração:** Adicionar prop `canonical` opcional para permitir URLs canônicas em todas as páginas de produto.

```text
interface ProductPageProps {
  ...
  canonical?: string;  // NOVA PROP
}

<SEOHead
  title={...}
  description={...}
  canonical={canonical}  // PASSAR PARA SEOHead
  schema={schemas}
/>
```

---

## Etapa 2: Atualizar Todas as Páginas de Produtos com Canonical

### Arquivos a Modificar (17 páginas):

| Arquivo | Canonical URL |
|---------|---------------|
| QuadroAvisos.tsx | /acrilico-sob-medida/quadro-de-avisos |
| Confeitaria.tsx | /acrilico-sob-medida/confeitaria |
| CaixaSugestao.tsx | /acrilico-sob-medida/caixa-de-sugestao |
| CaixasSobMedida.tsx | /acrilico-sob-medida/caixas-sob-medida |
| CupulasRedomas.tsx | /acrilico-sob-medida/cupulas-e-redomas |
| DisplayAcrilico.tsx | /acrilico-sob-medida/display-de-acrilico |
| ExpositoresBijuterias.tsx | /acrilico-sob-medida/expositores-para-bijuterias |
| ExpositoresCalcados.tsx | /acrilico-sob-medida/expositores-para-calcados |
| ExpositoresOculos.tsx | /acrilico-sob-medida/expositores-para-oculos |
| MedalhasPersonalizadas.tsx | /acrilico-sob-medida/medalhas-personalizadas |
| PlacaCustomizada.tsx | /acrilico-sob-medida/placa-customizada |
| PlacaSinalizacao.tsx | /acrilico-sob-medida/placa-de-sinalizacao |
| PortaFolder.tsx | /acrilico-sob-medida/porta-folder |
| PotesDoces.tsx | /acrilico-sob-medida/potes-para-doces-e-guloseimas |
| PotesGraos.tsx | /acrilico-sob-medida/potes-para-graos-e-cereais-a-granel |
| TrofeusPersonalizados.tsx | /acrilico-sob-medida/trofeus-personalizados |
| UrnaAcrilico.tsx | /acrilico-sob-medida/urna-de-acrilico |

---

## Etapa 3: Adicionar LocalBusiness Schema na Home

### Arquivo: `src/pages/Index.tsx`

Adicionar Schema LocalBusiness para melhorar visibilidade em buscas locais:

```text
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Lab Acrílicos",
  "description": "Fábrica de produtos em acrílico sob medida e distribuidora de chapas",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Cordovil 259",
    "addressLocality": "Rio de Janeiro",
    "addressRegion": "RJ",
    "addressCountry": "BR"
  },
  "telephone": "(21) 3372-3797",
  "url": "https://labacrilicos.com.br"
}
```

---

## Etapa 4: Melhorar Descrições SEO para ChatGPT/IA

As meta descriptions atuais são boas, mas podem ser otimizadas para IA:
- Adicionar "fabricação própria" ou "fábrica"
- Incluir "entrega para todo Brasil" quando relevante
- Manter formato: Produto | Diferencial | Localização | CTA

---

## Resumo das Alterações

| Tipo | Quantidade |
|------|------------|
| Modificar ProductPage.tsx | 1 arquivo |
| Adicionar canonical em produtos | 17 arquivos |
| Adicionar LocalBusiness na Home | 1 arquivo |
| **Total** | **19 arquivos** |

---

## Benefícios Esperados

1. **Google:** Canonical URLs evitam conteúdo duplicado e consolidam autoridade
2. **ChatGPT/IA:** Schemas estruturados facilitam extração de informações
3. **Buscas Locais:** LocalBusiness Schema melhora resultados "acrílico RJ"
4. **Rich Snippets:** Product Schema pode gerar cards visuais nos resultados

---

## Detalhes Técnicos

### Estrutura do Schema combinado (exemplo):

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "BreadcrumbList", ... },
    { "@type": "Product", "name": "...", "description": "..." }
  ]
}
```

### Props atualizadas do ProductPage:

```typescript
interface ProductPageProps {
  title: string;
  description: string;
  benefits: string[];
  variations?: string[];
  imageUrl?: string;
  children?: ReactNode;
  seoTitle?: string;
  seoDescription?: string;
  canonical?: string;  // NOVO
}
```
