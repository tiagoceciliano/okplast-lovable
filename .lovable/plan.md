
# Plano: Adicionar Categoria de Placas e Reorganizar Página Sob Medida

## Resumo

Vou adicionar a nova categoria "PLACAS SOB MEDIDA, PERSONALIZADAS E GRAVADAS" com 4 produtos (2 páginas existentes + 2 novas) e reorganizar a ordem das categorias conforme solicitado.

---

## Etapa 1: Upload das Imagens para o Storage

### Imagens a copiar:
| Arquivo enviado | Destino no Storage |
|-----------------|-------------------|
| placa-customizada-2.jpg | sobmedida/placa-customizada-2.jpg |
| placa-gravada.jpg | sobmedida/placa-gravada.jpg |
| placa-sinalizacao-2.webp | sobmedida/placa-sinalizacao-2.webp |
| placa-personalizada.jpg | sobmedida/placa-personalizada.jpg |

---

## Etapa 2: Atualizar Mapeamento de Imagens

### Arquivo: `src/lib/images.ts`

Adicionar novas referências no objeto `SOBMEDIDA_IMAGES`:

```text
placaGravada: img("sobmedida/placa-gravada.jpg"),
placaPersonalizada: img("sobmedida/placa-personalizada.jpg"),
```

---

## Etapa 3: Criar 2 Novas Páginas de Produto

### Arquivo 1: `src/pages/products/PlacaGravada.tsx`

Página para placas com gravação a laser, homenagens e premiações com estojo.

**Conteúdo:**
- Titulo: "Placa de Acrílico Gravada"
- Foco: Premiações, homenagens, reconhecimentos
- Variações: Com estojo, sem estojo, diferentes tamanhos
- SEO otimizado para "placa gravada acrílico RJ"

### Arquivo 2: `src/pages/products/PlacaPersonalizada.tsx`

Página para placas de identificação de ambientes e portas.

**Conteúdo:**
- Titulo: "Placa Personalizada de Acrílico"
- Foco: Identificação de salas, departamentos, portas
- Variações: Diferentes cores, tamanhos, fixações
- SEO otimizado para "placa personalizada acrílico RJ"

---

## Etapa 4: Registrar Novas Rotas

### Arquivo: `src/App.tsx`

Adicionar:
```text
// Lazy imports
const PlacaGravada = lazy(() => import("./pages/products/PlacaGravada"));
const PlacaPersonalizada = lazy(() => import("./pages/products/PlacaPersonalizada"));

// Routes
<Route path="/acrilico-sob-medida/placa-gravada" element={<PlacaGravada />} />
<Route path="/acrilico-sob-medida/placa-personalizada" element={<PlacaPersonalizada />} />
```

---

## Etapa 5: Reorganizar Categorias na Página Sob Medida

### Arquivo: `src/pages/products/AcrilicoSobMedida.tsx`

**Nova ordem das categorias:**

```text
1. PLACAS SOB MEDIDA, PERSONALIZADAS E GRAVADAS (NOVA)
   - Placa Customizada → /acrilico-sob-medida/placa-de-acrilico-customizada
   - Placa Personalizada → /acrilico-sob-medida/placa-personalizada
   - Placa de Sinalização → /acrilico-sob-medida/placa-de-acrilico-sinalizacao
   - Placa Gravada → /acrilico-sob-medida/placa-gravada

2. DISPLAY, URNAS E QUADROS
   - Display de Parede e Mesa
   - Urnas Transparente ou Coloridas
   - Caixas de Sugestões
   - Quadro de Avisos

3. MEDALHAS E TROFÉUS PERSONALIZADOS
   - Medalhas Sob Medida
   - Troféus Personalizados
   - Medalhas Personalizadas
   - Troféus Sob Medida

4. CAIXAS, POTES, CÚPULAS, REDOMAS
   - Caixas Sob Medida
   - Cúpulas e Redomas
   - Potes para Doces
   - Potes para Grãos

5. EXPOSITORES E CONFEITARIA
   - Expositores para Bijuterias
   - Expositores para Calçados
   - Expositor de Óculos Ótica
   - Bolo Fake
```

---

## Resumo das Alterações

| Tipo | Quantidade |
|------|------------|
| Copiar imagens para assets | 4 arquivos |
| Atualizar images.ts | 1 arquivo |
| Criar páginas de produto | 2 arquivos |
| Atualizar App.tsx (rotas) | 1 arquivo |
| Reorganizar AcrilicoSobMedida.tsx | 1 arquivo |
| **Total** | **9 alterações** |

---

## Estrutura Final da Categoria Placas

```text
PLACAS SOB MEDIDA, PERSONALIZADAS E GRAVADAS
├── Placa Customizada (imagem: advogados)
├── Placa Personalizada (imagem: administração)  ← NOVA
├── Placa de Sinalização (imagem: vestiário)
└── Placa Gravada (imagem: estojo)              ← NOVA
```

---

## Detalhes Técnicos das Novas Páginas

### PlacaGravada.tsx
```typescript
<ProductPage
  title="Placa de Acrílico Gravada"
  description="Placas de acrílico com gravação a laser para homenagens, premiações e reconhecimentos..."
  imageUrl={SOBMEDIDA_IMAGES.placaGravada}
  seoTitle="Placas de Acrílico Gravadas - Homenagens e Premiações"
  seoDescription="Placas gravadas a laser para homenagens e premiações. Com ou sem estojo. Fabricação no Rio de Janeiro."
  canonical="/acrilico-sob-medida/placa-gravada"
  benefits={[...]}
  variations={[...]}
/>
```

### PlacaPersonalizada.tsx
```typescript
<ProductPage
  title="Placa Personalizada de Acrílico"
  description="Placas de acrílico personalizadas para identificação de ambientes, departamentos e salas..."
  imageUrl={SOBMEDIDA_IMAGES.placaPersonalizada}
  seoTitle="Placas Personalizadas de Acrílico - Identificação"
  seoDescription="Placas personalizadas para identificação de ambientes. Fabricação sob medida no Rio de Janeiro."
  canonical="/acrilico-sob-medida/placa-personalizada"
  benefits={[...]}
  variations={[...]}
/>
```
