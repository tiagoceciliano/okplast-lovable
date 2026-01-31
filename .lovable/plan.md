

# Plano de Implementacao: Adicionar Imagens Reais do WordPress

## Visao Geral

Vou substituir TODAS as imagens placeholder do Unsplash pelas imagens reais extraidas dos arquivos XML do WordPress que voce enviou. Analisei cada arquivo em detalhes e mapeei exatamente quais imagens vao em cada secao do site.

---

## 1. MAPEAMENTO COMPLETO DE IMAGENS POR SECAO

### Base URL para todas as imagens:
```
https://acrilzano.com.br/wp-content/uploads/
```

---

### 1.1 Hero Slider (HeroSlider.tsx)

Substituir as 3 imagens genericas do Unsplash:

| Slot | Imagem Atual | Nova Imagem (URL Acrilzano) | Descricao |
|------|--------------|----------------------------|-----------|
| 1 | Unsplash generic | `https://storage.builderall.com/franquias/2/6891583/editor-html/9121285.png` | Cubo de acrilico 3D transparente |
| 2 | Unsplash generic | `2022/08/chapa-1-min.jpg` | Chapas de acrilico empilhadas |
| 3 | Unsplash generic | `2022/08/chapa-min.jpg` | Chapas coloridas variadas |

---

### 1.2 Secao "Conheca nossa empresa" (Index.tsx)

Substituir placeholder por imagem real da equipe:

| Elemento | Imagem |
|----------|--------|
| Foto da Equipe | `2022/08/Equipe-Acrilzano-acrilico-1-min.jpg` |

(Nota: Esta imagem e da equipe Acrilzano. Voce pode substituir por foto propria da Lab Acrilicos depois)

---

### 1.3 Produtos Sob Medida (Index.tsx - produtosSobMedida)

Adicionar campo `imageUrl` a cada produto:

| Produto | URL da Imagem |
|---------|---------------|
| Caixas Sob Medida | `2022/08/caixa-acrilico-doces-3-300x225-300x225-min.jpg` |
| Cupulas e Redomas | `2022/08/expositor-de-acrilico-cone-300x300-min.jpg` |
| Potes para Doces | `2022/08/suporte-para-bolo-de-andar-300x300-min.jpg` |
| Potes para Graos | `2022/08/caixa-acrilico-granel-300x225-300x225-min.jpg` |
| Urna de Acrilico | `2022/08/urna-de-acrilico-300x300-min.jpg` (se disponivel) ou placeholder |
| Display de Acrilico | `2022/08/expositor-de-acrilico-doces-300x300-min.jpg` |
| Trofeus | `2022/08/trofeu-acrilico-acrilzano-300x298-min.jpg` |
| Medalhas | `2022/08/medalhas-acrilicas-300x300-min.jpg` |

---

### 1.4 Tipos de Chapas (Index.tsx - tiposChapas)

Adicionar imagens para cada tipo de chapa:

| Tipo | URL da Imagem |
|------|---------------|
| Acrilico Cristal | `2022/08/CHAPA-PRINCIPAL-300x300-min.jpg` |
| Acrilico Colorido | `2022/08/chapa-acrilico-colorido-300x223-300x223-1.jpg` |
| Acrilico Leitoso | `2022/08/chapa-2-min.jpg` |
| Acrilico Espelhado | `2022/08/chapa-acrilico-espelhada-300x225-min.jpg` |
| Policarbonato | `2022/08/chapa-3-min.jpg` |
| PETG | `2022/08/4444444444444444444444444-min.jpg` |
| PVC Expandido | `2022/08/111111111111111111111111-min.jpg` |
| Pedacos e Retalhos | `2022/08/22222222222222222222222222-min.jpg` |

---

### 1.5 Carrossel "6 Motivos" (MotivosCarousel.tsx)

Adicionar imagens de fundo aos cards:

| Motivo | URL da Imagem |
|--------|---------------|
| Emissao de NF-e | `2022/08/1.2-min.jpg` |
| Faturamento e Linha de Credito | `2022/08/2.2-min.jpg` |
| Empresa Solida e Confiavel | `2022/08/3.2-min.jpg` |
| Pronta Entrega | `2022/08/4.2-min.jpg` |
| Entrega em Todo Brasil | `2022/08/5.2-min.jpg` |
| Atendimento Rapido | `2022/08/6.2-min.jpg` |

---

### 1.6 Depoimentos / Satisfacao Garantida (Index.tsx)

Usar avatares de depoimentos:

| Cliente | URL do Avatar |
|---------|---------------|
| Cliente 1 | `2022/06/1-min.png` |
| Cliente 2 | `2022/06/2-min.png` |
| Cliente 3 | `2022/06/3-min.png` |
| Cliente 4 | `2022/06/4-min.png` |

---

### 1.7 Pagina Chapas de Acrilico (ChapasDeAcrilico.tsx)

Imagens para cada tipo de chapa na lista:

| Tipo de Chapa | URL da Imagem |
|---------------|---------------|
| Acrilico CAST 100% Virgem | `2022/08/chapa-1-min.jpg` |
| Poliestireno (PS e PSAI) | `2022/08/chapa-2-min.jpg` |
| PETG | `2022/08/chapa-3-min.jpg` |
| Policarbonato Alveolar | `2022/08/chapa-min.jpg` |
| Policarbonato Compacto | `2022/08/111111111111111111111111-min.jpg` |
| PVC Expandido | `2022/08/22222222222222222222222222-min.jpg` |
| ACM | `2022/08/3333333333333333333333333-min.jpg` |

---

### 1.8 Pagina Acrilico Sob Medida (AcrilicoSobMedida.tsx)

Imagens para categorias de produtos:

**CAIXAS, POTES, CUPULAS, REDOMAS:**
| Produto | URL da Imagem |
|---------|---------------|
| Caixas Sob Medida | `2022/08/Caixas-acrilico-300x251-300x251-min.jpg` |
| Cupulas e Redomas | `2022/08/cupula-acrilico-400x300-300x225-min.jpg` |
| Potes para Doces | `2022/08/caixa-acrilico-doces-2-300x200-300x200-min.jpg` |
| Potes para Graos | `2022/08/pote-acrilico-granel-225x300-225x300-min.jpg` |

**MEDALHAS E TROFEUS:**
| Produto | URL da Imagem |
|---------|---------------|
| Medalhas Personalizadas | `2022/08/medalhas-acrilica-300x300-min.jpg` |
| Trofeus Personalizados | `2022/08/trofeu-acrilico-fenda-300x300-min.jpg` |

**PLACAS:**
| Produto | URL da Imagem |
|---------|---------------|
| Placa Customizada | placeholder (usar gradiente) |
| Placa Sinalizacao | placeholder (usar gradiente) |

**DISPLAY, URNAS:**
| Produto | URL da Imagem |
|---------|---------------|
| Display de Acrilico | `2022/08/expositor-de-acrilicos-300x180-300x180-min.jpg` |
| Urna de Acrilico | `2022/08/sugestoes-400x267-300x225-min.jpg` |
| Caixa de Sugestao | `2022/08/caixa-sugestao-300x300-min.jpg` |

**EXPOSITORES:**
| Produto | URL da Imagem |
|---------|---------------|
| Expositores para Bijuterias | `2022/08/expositor-acrilico-brinco-1-300x297-min.jpg` |
| Expositores para Calcados | `2022/08/expositor-de-acrilico-doces-300x300-min.jpg` |
| Expositores para Oculos | placeholder |
| Porta Folder | `2022/08/porta-folder-acrilicdo-parede-400x240-300x225-min.jpg` |

---

## 2. ARQUIVOS A MODIFICAR

### Design System / Componentes

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/home/HeroSlider.tsx` | Substituir 3 URLs do Unsplash por imagens reais do Acrilzano |
| `src/components/home/MotivosCarousel.tsx` | Adicionar imagens de fundo aos 6 cards |
| `src/components/home/ProductCategoryGrid.tsx` | Garantir que renderiza imageUrl corretamente |

### Paginas

| Arquivo | Alteracao |
|---------|-----------|
| `src/pages/Index.tsx` | Adicionar imageUrl aos arrays produtosSobMedida e tiposChapas, atualizar secao empresa com foto real, adicionar avatarUrl aos depoimentos |
| `src/pages/products/ChapasDeAcrilico.tsx` | Adicionar imagens a cada tipo de chapa |
| `src/pages/products/AcrilicoSobMedida.tsx` | Adicionar imageUrl a cada produto nas categorias |

---

## 3. EXEMPLO DE CODIGO

### HeroSlider.tsx (antes e depois)

**Antes:**
```typescript
const heroImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=500&fit=crop",
    alt: "Cubo de acrilico transparente",
  },
  // ...
];
```

**Depois:**
```typescript
const heroImages = [
  {
    id: 1,
    src: "https://storage.builderall.com/franquias/2/6891583/editor-html/9121285.png",
    alt: "Cubo de acrilico transparente 3D",
  },
  {
    id: 2,
    src: "https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-1-min.jpg",
    alt: "Chapas de acrilico empilhadas",
  },
  {
    id: 3,
    src: "https://acrilzano.com.br/wp-content/uploads/2022/08/chapa-min.jpg",
    alt: "Chapas de acrilico coloridas",
  },
];
```

### Index.tsx - Produtos com Imagem

**Antes:**
```typescript
const produtosSobMedida = [
  { nome: "Caixas Sob Medida", href: "/acrilico-sob-medida/caixas-sob-medida" },
  // ...
];
```

**Depois:**
```typescript
const produtosSobMedida = [
  { 
    nome: "Caixas Sob Medida", 
    href: "/acrilico-sob-medida/caixas-sob-medida",
    imageUrl: "https://acrilzano.com.br/wp-content/uploads/2022/08/caixa-acrilico-doces-3-300x225-300x225-min.jpg"
  },
  // ...
];
```

---

## 4. PERFORMANCE

Para manter o site rapido e limpo:

- Todas as imagens terao `loading="lazy"`
- Preferir versoes 300x300 ou 300x225 (mais leves)
- Manter srcset para responsividade quando possivel
- Usar fallback para imagens que falharem

---

## 5. RESUMO DE ENTREGAVEIS

| Secao | Quantidade de Imagens |
|-------|----------------------|
| Hero Slider | 3 imagens |
| Secao Empresa | 1 imagem (equipe) |
| Produtos Sob Medida | 8 imagens |
| Tipos de Chapas | 8 imagens |
| 6 Motivos (Carrossel) | 6 imagens de fundo |
| Depoimentos | 4 avatares |
| Pagina Chapas | 7 imagens |
| Pagina Sob Medida | 15+ imagens |

**Total: ~52 imagens reais** substituindo os placeholders atuais.

---

## 6. OBSERVACAO IMPORTANTE

As imagens estao hospedadas no servidor `acrilzano.com.br`. Quando voce tiver fotos proprias da Lab Acrilicos, basta substituir as URLs por imagens hospedadas em seu proprio servidor ou fazer upload delas diretamente no Lovable.

