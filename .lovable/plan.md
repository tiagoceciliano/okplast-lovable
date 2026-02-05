

# Plano: Atualizar Páginas de Produtos e Adicionar Links

## Objetivo

1. **Adicionar as 3 fotos faltantes** para os produtos sem imagem
2. **Refatorar o componente `ProductPage.tsx`** para seguir o mesmo visual das páginas de chapas
3. **Atualizar os links** nas categorias da página `/acrilico-sob-medida` para levar às páginas específicas de cada produto

---

## Parte 1: Upload das Imagens Faltantes

### Imagens Enviadas pelo Usuário

| Arquivo Enviado | Produto | Destino no Storage |
|-----------------|---------|-------------------|
| `placa-customizada.jpg` | Placa Customizada | `sobmedida/placa-customizada.jpg` |
| `placa-sinalizacao.webp` | Placa de Sinalização | `sobmedida/placa-sinalizacao.webp` |
| `expositor-oculos-otica-2.webp` | Expositores para Óculos | `sobmedida/expositor-oculos.webp` |

### Atualizar `src/lib/images.ts`

Adicionar novas entradas em `SOBMEDIDA_IMAGES`:

```typescript
export const SOBMEDIDA_IMAGES = {
  // ... existentes ...
  placaCustomizada: img("sobmedida/placa-customizada.jpg"),
  placaSinalizacao: img("sobmedida/placa-sinalizacao.webp"),
  expositoresOculos: img("sobmedida/expositor-oculos.webp"),
} as const;
```

---

## Parte 2: Refatorar o Componente `ProductPage.tsx`

### Layout Atual (Problema)

```text
┌──────────────────────────────────────────────────────┐
│  HERO AZUL com gradient                              │
│  └─ Breadcrumb + H1 (só texto)                       │
├──────────────────────────────────────────────────────┤
│  CONTEÚDO 3 COLUNAS                                  │
│  ├─ 2 colunas: Imagem + Benefícios + Variações       │
│  └─ 1 coluna: Sidebar sticky com CTAs                │
└──────────────────────────────────────────────────────┘
```

### Layout Desejado (Igual às Chapas)

```text
┌──────────────────────────────────────────────────────┐
│  BREADCRUMB: Home > Sob Medida > [Produto]           │
├──────────────────────────────────────────────────────┤
│  HERO CINZA (2 colunas)                              │
│  ├─ Esquerda: H1 + descrição + WhatsApp + email      │
│  └─ Direita: Imagem do produto                       │
├──────────────────────────────────────────────────────┤
│  SEÇÃO: Benefícios e Diferenciais                    │
│  └─ Lista com checkmarks                             │
├──────────────────────────────────────────────────────┤
│  SEÇÃO: Variações Disponíveis (opcional)             │
│  └─ Badges em grid                                   │
├──────────────────────────────────────────────────────┤
│  CTA FINAL (fundo cinza)                             │
│  ├─ Botão verde WhatsApp grande                      │
│  └─ Link "Prefere orçamento via e-mail?"             │
└──────────────────────────────────────────────────────┘
```

### Mudanças no `ProductPage.tsx`

| Elemento | Antes | Depois |
|----------|-------|--------|
| Hero | `gradient-primary` (azul escuro) | `bg-muted` (cinza claro) |
| Breadcrumb | Dentro do hero azul | Em barra separada acima do hero |
| Layout | 3 colunas com sidebar | Seções verticais full-width |
| Imagem | Dentro do conteúdo | No hero, lado direito |
| CTA Sidebar | Card sticky lateral | Seção final centralizada |
| Texto | Branco sobre azul | Preto sobre cinza |

---

## Parte 3: Atualizar Links na Página Sob Medida

### Arquivo: `src/pages/products/AcrilicoSobMedida.tsx`

### Mapeamento de Links

#### Categoria: CAIXAS, POTES, CÚPULAS, REDOMAS

| Produto | Link Atual | Link Novo |
|---------|-----------|-----------|
| Caixas Sob Medida | `/acrilico-sob-medida` | `/caixas-sob-medida` |
| Cúpulas e Redomas | `/acrilico-sob-medida` | `/cupulas-redomas` |
| Potes para Doces | `/acrilico-sob-medida` | `/potes-doces` |
| Potes para Grãos | `/acrilico-sob-medida` | `/potes-graos` |

#### Categoria: MEDALHAS E TROFÉUS PERSONALIZADOS

| Produto | Link Atual | Link Novo |
|---------|-----------|-----------|
| Medalhas Sob Medida | `/acrilico-sob-medida` | `/medalhas-personalizadas` |
| Troféus Personalizados | `/acrilico-sob-medida` | `/trofeus-personalizados` |
| Medalhas Personalizadas | `/acrilico-sob-medida` | `/medalhas-personalizadas` |
| Troféus Sob Medida | `/acrilico-sob-medida` | `/trofeus-personalizados` |

#### Categoria: DISPLAY, URNAS E QUADROS

| Produto | Link Atual | Link Novo |
|---------|-----------|-----------|
| Display de Parede e Mesa | `/acrilico-sob-medida` | `/display-acrilico` |
| Urnas Transparentes | `/acrilico-sob-medida` | `/urna-acrilico` |
| Caixas de Sugestões | `/acrilico-sob-medida` | `/caixa-sugestao` |
| Quadro de Avisos | `/acrilico-sob-medida` | `/display-acrilico` |

#### Categoria: EXPOSITORES E CONFEITARIA

| Produto | Link Atual | Link Novo |
|---------|-----------|-----------|
| Expositores para Bijuterias | `/acrilico-sob-medida` | `/expositores-bijuterias` |
| Expositores para Calçados | `/acrilico-sob-medida` | `/expositores-calcados` |
| Expositor de Óculos Ótica | `/acrilico-sob-medida` | `/expositores-oculos` |
| Bolo Fake | `/acrilico-sob-medida` | `/cupulas-redomas` |

---

## Parte 4: Adicionar Imagens aos Produtos Faltantes

### Páginas a Atualizar

| Arquivo | Adicionar `imageUrl` |
|---------|---------------------|
| `PlacaCustomizada.tsx` | `SOBMEDIDA_IMAGES.placaCustomizada` |
| `PlacaSinalizacao.tsx` | `SOBMEDIDA_IMAGES.placaSinalizacao` |
| `ExpositoresOculos.tsx` | `SOBMEDIDA_IMAGES.expositoresOculos` |

---

## Resumo de Arquivos

| Ação | Arquivo |
|------|---------|
| Copiar | `user-uploads://placa-customizada.jpg` → `src/assets/sobmedida/` |
| Copiar | `user-uploads://placa-sinalizacao.webp` → `src/assets/sobmedida/` |
| Copiar | `user-uploads://expositor-oculos-otica-2.webp` → `src/assets/sobmedida/` |
| Modificar | `src/lib/images.ts` (adicionar 3 novas entradas) |
| Modificar | `src/components/products/ProductPage.tsx` (refatorar layout) |
| Modificar | `src/pages/products/AcrilicoSobMedida.tsx` (atualizar hrefs) |
| Modificar | `src/pages/products/PlacaCustomizada.tsx` (adicionar imageUrl) |
| Modificar | `src/pages/products/PlacaSinalizacao.tsx` (adicionar imageUrl) |
| Modificar | `src/pages/products/ExpositoresOculos.tsx` (adicionar imageUrl) |

---

## Resultado Final

1. **Todas as páginas de produtos** terão o mesmo visual padronizado das páginas de chapas
2. **As 3 imagens faltantes** serão adicionadas e exibidas nos respectivos produtos
3. **Os links dos produtos** na página sob medida levarão diretamente às páginas específicas (melhor para SEO e UX)
4. **Layout consistente** em todo o site para indexação

