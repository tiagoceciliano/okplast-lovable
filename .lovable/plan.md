

# Plano: Reestruturar Página Hub de Chapas + Criar Página Acrílico

## Objetivo

1. Atualizar a página hub `/chapas` com novo H1 e sem bloco de cores
2. Criar página única `/chapas/acrilico` que unifica cristal + colorido com o bloco de cores
3. Adicionar hyperlinks nas fotos e títulos dos cards

---

## PARTE 1: Alterações na Página Hub `/chapas`

### Arquivo: `src/pages/products/ChapasDeAcrilico.tsx`

| Elemento | Atual | Novo |
|----------|-------|------|
| H1 | "CHAPAS DE ACRÍLICO" | "CHAPAS DE ACRÍLICO POLICARBONATOS E OUTROS PLÁSTICOS" |
| Title SEO | "Chapas de Acrílico RJ - Preço de Fábrica" | "Chapas no RJ - Acrílico, Policarbonato, PS, PETG, ACM" |
| Canonical | `/chapas-de-acrilico` | `/chapas` |
| Subtítulo | "A melhor fábrica de acrílico..." | "Distribuidora de chapas plásticas com o melhor preço do RJ" |
| Descrição | Fala só de acrílico | Lista todos os materiais disponíveis |
| Seção de cores | Presente | **REMOVER** (vai para `/chapas/acrilico`) |

### Novo Texto do Hero

```
H1: CHAPAS DE ACRÍLICO POLICARBONATOS E OUTROS PLÁSTICOS

Subtítulo: Distribuidora de chapas plásticas com o melhor preço do Rio de Janeiro

Descrição: Trabalhamos com Acrílico (cristal, colorido, leitoso, espelhado), 
Policarbonato (alveolar e compacto), PETG, Poliestireno (PS), PVC Expandido e ACM. 
Corte sob medida para projetos de todos os portes.
```

### Adicionar Hyperlinks nos Cards

Cada card terá imagem e título clicáveis:

| Card Atual | Slug para Link |
|------------|----------------|
| Acrílico CAST (100% Virgem) | `/chapas/acrilico` |
| Poliestireno (PS e PSAI) | `/chapas/poliestireno` |
| PETG | `/chapas/petg` |
| Policarbonato Alveolar | `/chapas/policarbonato-alveolar` |
| Policarbonato Compacto | `/chapas/policarbonato-compacto` |
| PVC Expandido | `/chapas/pvc-expandido` |
| ACM | `/chapas/acm` |

### Código dos Cards com Links

```tsx
{tiposChapas.map((chapa) => (
  <div key={chapa.id}>
    {/* Image com Link */}
    <Link to={`/chapas/${chapa.slug}`}>
      <div className="aspect-video bg-muted rounded-lg overflow-hidden 
                      hover:opacity-90 transition-opacity cursor-pointer">
        <img src={chapa.imageUrl} alt={chapa.nome} />
      </div>
    </Link>

    {/* Título com Link */}
    <Link to={`/chapas/${chapa.slug}`}>
      <h3 className="font-bold text-xl md:text-2xl text-primary 
                     hover:underline cursor-pointer">
        {chapa.nome}
      </h3>
    </Link>
    
    {/* Restante igual */}
  </div>
))}
```

### Atualizar Array `tiposChapas`

Adicionar campo `slug` e mudar nome do primeiro item:

```tsx
const tiposChapas = [
  {
    id: "acrilico",
    slug: "acrilico",  // NOVO
    nome: "CHAPAS de Acrílico",  // Mudou de "CAST (100% Virgem)"
    desc: "...",
    // ...
  },
  {
    id: "ps",
    slug: "poliestireno",  // NOVO
    nome: "CHAPAS Poliestireno (PS e PSAI)",
    // ...
  },
  // ... demais com slug
];
```

---

## PARTE 2: Nova Página `/chapas/acrilico`

### Arquivo: `src/pages/chapas/Acrilico.tsx`

Esta página unifica cristal + colorido e inclui o bloco de cores.

### Estrutura da Página

```
┌────────────────────────────────────────────────────┐
│  HERO: "CHAPAS DE ACRÍLICO" + Carrossel           │
│  Subtítulo: Cristal, colorido, leitoso, espelhado │
├────────────────────────────────────────────────────┤
│  SEÇÃO DE CORES (12 quadrados coloridos)          │
│  H2: "Chapas de acrílico cristal e diversas cores"│
├────────────────────────────────────────────────────┤
│  ACRÍLICO CRISTAL                                  │
│  • O que é                                         │
│  • Aplicações                                      │
│  • Características                                 │
├────────────────────────────────────────────────────┤
│  ACRÍLICO COLORIDO                                │
│  • Variedades: fumê, espelhado, fluorescente      │
│  • Aplicações específicas                          │
├────────────────────────────────────────────────────┤
│  ESPESSURAS DISPONÍVEIS                            │
│  1mm a 50mm                                        │
├────────────────────────────────────────────────────┤
│  CTA FINAL: WhatsApp + Email                       │
└────────────────────────────────────────────────────┘
```

### SEO da Página

| Campo | Valor |
|-------|-------|
| Title | "Chapas de Acrílico RJ - Cristal, Colorido, Espelhado, Fumê" |
| Description | "Chapas de acrílico 100% virgem. Cristal transparente, colorido, leitoso, espelhado e fumê. Corte sob medida. Melhor preço do Rio de Janeiro." |
| Canonical | `/chapas/acrilico` |
| H1 | "CHAPAS DE ACRÍLICO" |

### Cores Disponíveis (Grid)

O grid de 12 cores será movido para esta página:
- Cristal, Branco, Preto, Vermelho, Azul, Verde
- Amarelo, Laranja, Fumê, Espelhado, Leitoso, Fluorescente

---

## PARTE 3: Arquivos a Criar/Modificar

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `src/pages/products/ChapasDeAcrilico.tsx` | Modificar | Novo H1, remover cores, adicionar links |
| `src/pages/chapas/Acrilico.tsx` | **Criar** | Página única de acrílico com cores |
| `src/App.tsx` | Modificar | Adicionar rota `/chapas/acrilico` |
| `public/sitemap.xml` | Modificar | Adicionar nova URL |

---

## PARTE 4: Rotas no App.tsx

```tsx
// Página Hub
<Route path="/chapas" element={<Chapas />} />

// Redirect da URL antiga
<Route path="/chapas-de-acrilico" element={<Navigate to="/chapas" replace />} />

// Página específica de Acrílico
<Route path="/chapas/acrilico" element={<Acrilico />} />

// Futuras páginas (preparadas para implementação posterior)
<Route path="/chapas/poliestireno" element={<Poliestireno />} />
<Route path="/chapas/petg" element={<Petg />} />
// etc...
```

---

## PARTE 5: Sitemap Atualizado

Adicionar ao `public/sitemap.xml`:

```xml
<url>
  <loc>https://labacrilicos.com.br/chapas</loc>
  <lastmod>2025-02-05</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>
<url>
  <loc>https://labacrilicos.com.br/chapas/acrilico</loc>
  <lastmod>2025-02-05</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## Resumo Visual

```
ANTES:
/chapas-de-acrilico
├── Hero "CHAPAS DE ACRÍLICO"
├── Bloco de cores (12 cores)
├── Cards SEM links
└── (tudo junto)

DEPOIS:
/chapas (hub geral)
├── Hero "CHAPAS DE ACRÍLICO POLICARBONATOS E OUTROS PLÁSTICOS"
├── SEM bloco de cores
├── Cards COM links (imagem + título clicáveis)
└── Banner com todos os materiais

/chapas/acrilico (página específica)
├── Hero "CHAPAS DE ACRÍLICO"
├── Bloco de cores (12 cores) ← movido para cá
├── Seção Cristal (características, aplicações)
├── Seção Colorido (variedades, aplicações)
├── Espessuras disponíveis
└── CTA WhatsApp
```

---

## Benefícios

1. **SEO**: Página hub ranqueia para "chapas RJ" e página específica para "acrílico cristal/colorido"
2. **UX**: Usuário navega facilmente entre tipos de materiais
3. **Conversão**: Cada página tem CTA específico para o material
4. **Manutenção**: Estrutura modular facilita adicionar novos materiais

