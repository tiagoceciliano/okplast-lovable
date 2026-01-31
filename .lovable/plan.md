

# Plano: Corrigir Mapeamento Completo de Imagens - Seção PRODUTOS SOB MEDIDA

## Problema Identificado

Comparando a imagem de referência do Acrilzano com o código atual, as imagens estão mapeadas para produtos errados. A disposição na imagem mostra 8 produtos específicos em 2 linhas de 4 produtos cada.

---

## Mapeamento Correto (Baseado na Imagem de Referência)

### LINHA 1 - Da esquerda para direita:

| Posição | Produto no Acrilzano | URL Original | Mapeamento Atual | Produto Lab Acrílicos |
|---------|---------------------|--------------|------------------|----------------------|
| 1 | Expositor Doces (escada) | `3333333333333333333333333-min.jpg` | `chapas-pagina/acm.jpg` (ERRADO) | Potes para Doces |
| 2 | Cúpula Preta | `builderall/.../9852756.jpg` | Não migrada | Cúpulas e Redomas |
| 3 | Quadro de Avisos | `builderall/.../9852775.jpg` | Não migrada | Display de Acrílico |
| 4 | Porta Folder Dourado | `builderall/.../9860922.png` | Não migrada | Porta Folder |

### LINHA 2 - Da esquerda para direita:

| Posição | Produto no Acrilzano | URL Original | Mapeamento Atual | Produto Lab Acrílicos |
|---------|---------------------|--------------|------------------|----------------------|
| 5 | Potes Grãos (vários) | `111111111111111111111111-min.jpg` | `chapas/pvc-expandido.jpg` (ERRADO) | Potes para Grãos |
| 6 | Cúpula Transparente | `9852742-min.jpeg` | Não migrada | Urna de Acrílico |
| 7 | Púlpito Acrílico | `pulpito-oratoria-...min.jpg` | Não migrada | Caixas Sob Medida |
| 8 | Troféu Team Awards | `trofeu-acrilico-fenda-300x300-min.jpg` | `sobmedida/trofeus.jpg` (OK) | Troféus |

---

## Correções Necessárias

### 1. Migrar Novas Imagens do Builderall

Estas imagens não foram baixadas ainda:

| Key | URL Original |
|-----|-------------|
| `produtos/cupula-preta.jpg` | `https://storage.builderall.com//franquias/2/7085438/editor-html/9852756.jpg` |
| `produtos/quadro-avisos.jpg` | `https://storage.builderall.com//franquias/2/7085438/editor-html/9852775.jpg` |
| `produtos/porta-folder-dourado.png` | `https://storage.builderall.com//franquias/2/7085438/editor-html/9860922.png` |
| `produtos/cupula-transparente.jpg` | `https://acrilzano.com.br/wp-content/uploads/2022/12/9852742-min.jpeg` |
| `produtos/pulpito.jpg` | `https://acrilzano.com.br/wp-content/uploads/2022/08/pulpito-oratoria-acrilizo-acrilzano-luxo-300x240-300x240-min-e1728777263731.jpg` |

### 2. Atualizar `src/lib/images.ts`

Adicionar novas constantes e corrigir mapeamento:

```typescript
export const PRODUTOS_IMAGES = {
  // Linha 1
  potesDoces: img("produtos/expositor-doces-escada.jpg"),      // Era ACM
  cupulasRedomas: img("produtos/cupula-preta.jpg"),            // Nova
  display: img("produtos/quadro-avisos.jpg"),                   // Nova
  portaFolder: img("produtos/porta-folder-dourado.png"),        // Nova
  
  // Linha 2
  potesGraos: img("produtos/potes-graos-varios.jpg"),          // Era PVC
  urna: img("produtos/cupula-transparente.jpg"),                // Nova
  caixasSobMedida: img("produtos/pulpito.jpg"),                 // Nova
  trofeus: img("produtos/trofeus.jpg"),                         // OK
  medalhas: img("produtos/medalhas.jpg"),                       // Mantém
} as const;
```

### 3. Atualizar `src/pages/Index.tsx`

Reordenar o array `produtosSobMedida` para corresponder à ordem visual do Acrilzano:

```typescript
const produtosSobMedida = [
  // Linha 1
  { nome: "Potes para Doces", href: "...", imageUrl: PRODUTOS_IMAGES.potesDoces },
  { nome: "Cúpulas e Redomas", href: "...", imageUrl: PRODUTOS_IMAGES.cupulasRedomas },
  { nome: "Display de Acrílico", href: "...", imageUrl: PRODUTOS_IMAGES.display },
  { nome: "Porta Folder", href: "...", imageUrl: PRODUTOS_IMAGES.portaFolder },
  // Linha 2  
  { nome: "Potes para Grãos", href: "...", imageUrl: PRODUTOS_IMAGES.potesGraos },
  { nome: "Urna de Acrílico", href: "...", imageUrl: PRODUTOS_IMAGES.urna },
  { nome: "Caixas Sob Medida", href: "...", imageUrl: PRODUTOS_IMAGES.caixasSobMedida },
  { nome: "Troféus", href: "...", imageUrl: PRODUTOS_IMAGES.trofeus },
];
```

---

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/lib/images.ts` | Adicionar URLs das novas imagens + corrigir mapeamento |
| `src/pages/Index.tsx` | Reordenar produtos + associar imagens corretas |
| `supabase/functions/migrate-images/index.ts` | Executar para baixar as 5 imagens novas |

---

## Resumo da Execução

1. Chamar edge function `migrate-images` para baixar as 5 imagens faltantes
2. Atualizar `images.ts` com novas constantes
3. Atualizar `Index.tsx` com ordem correta + imagens corretas
4. Testar visualização

---

## Seção Técnica

### Novas URLs a migrar:

```typescript
[
  { key: "produtos/cupula-preta.jpg", url: "https://storage.builderall.com//franquias/2/7085438/editor-html/9852756.jpg" },
  { key: "produtos/quadro-avisos.jpg", url: "https://storage.builderall.com//franquias/2/7085438/editor-html/9852775.jpg" },
  { key: "produtos/porta-folder-dourado.png", url: "https://storage.builderall.com//franquias/2/7085438/editor-html/9860922.png" },
  { key: "produtos/cupula-transparente.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/12/9852742-min.jpeg" },
  { key: "produtos/pulpito.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/pulpito-oratoria-acrilizo-acrilzano-luxo-300x240-300x240-min-e1728777263731.jpg" },
  { key: "produtos/expositor-doces-escada.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/3333333333333333333333333-min.jpg" },
  { key: "produtos/potes-graos-varios.jpg", url: "https://acrilzano.com.br/wp-content/uploads/2022/08/111111111111111111111111-min.jpg" }
]
```

