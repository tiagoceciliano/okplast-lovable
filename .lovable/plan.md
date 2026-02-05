

# Plano: Corrigir Layout da Página de Chapas

## Problema Identificado

Após análise do código e comparação com os prints:

1. **O código atual está correto** - O grid `lg:grid-cols-2` funciona em telas maiores que 1024px
2. **A viewport do preview do Lovable pode estar menor que 1024px**, causando o layout de 1 coluna
3. **Mas há uma questão real**: você quer garantir que o layout alternado (imagem esquerda/direita) funcione corretamente

## Layout Esperado (conforme seu print de referência)

```
Card 1 (Acrílico):
┌──────────────────────────────────────────────────────┐
│  [IMAGEM]           │    CHAPAS de Acrílico        │
│                     │    Descrição do produto...    │
│                     │    ▼ Principais Aplicações    │
│                     │    ▼ Características          │
└──────────────────────────────────────────────────────┘

Card 2 (Poliestireno) - Layout invertido:
┌──────────────────────────────────────────────────────┐
│  CHAPAS Poliestireno│    [IMAGEM]                   │
│  Descrição...       │                               │
│  ▼ Aplicações       │                               │
│  ▼ Características  │                               │
└──────────────────────────────────────────────────────┘
```

## Análise do Código Atual

O código em `ChapasDeAcrilico.tsx` (linhas 292-360) usa:

```tsx
className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start ${
  chapa.imagePosition === "right" ? "" : "lg:flex-row-reverse"
}`}
```

O problema: `lg:flex-row-reverse` **não tem efeito em um grid** - só funciona com `flex`.

A lógica de `lg:order-1` e `lg:order-2` está correta, então o layout alternado deveria funcionar.

## Correção Necessária

Remover a classe `lg:flex-row-reverse` que não faz nada e verificar se as classes `lg:order` estão sendo aplicadas corretamente:

### Código Atual (linha 295-297)
```tsx
className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start ${
  chapa.imagePosition === "right" ? "" : "lg:flex-row-reverse"
}`}
```

### Código Corrigido
```tsx
className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start"
```

(Removemos a classe condicional inútil - a alternância é controlada pelas classes `lg:order-1` e `lg:order-2` nos filhos)

## Verificação Visual

Para garantir que você veja o layout corretamente:
1. **Expanda o preview** - clique no ícone de expandir ou use uma aba separada
2. **Viewport mínima**: 1024px para ver o layout em 2 colunas

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/pages/products/ChapasDeAcrilico.tsx` | Remover classe `lg:flex-row-reverse` inútil |

## Código Final do Card

```tsx
{tiposChapas.map((chapa) => (
  <div 
    key={chapa.id}
    className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start"
  >
    {/* Image */}
    <div className={chapa.imagePosition === "right" ? "lg:order-2" : "lg:order-1"}>
      <Link to={`/chapas/${chapa.slug}`} className="block">
        <div className="aspect-video bg-muted rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer">
          <img 
            src={chapa.imageUrl} 
            alt={chapa.nome}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </Link>
    </div>

    {/* Content */}
    <div className={chapa.imagePosition === "right" ? "lg:order-1" : "lg:order-2"}>
      <Link to={`/chapas/${chapa.slug}`}>
        <h3 className="font-bold text-xl md:text-2xl text-primary mb-4 hover:underline cursor-pointer">
          {chapa.nome}
        </h3>
      </Link>
      {/* ... resto do conteúdo ... */}
    </div>
  </div>
))}
```

## Alternância de Posição

A lógica de alternância baseada em `imagePosition`:

| Material | imagePosition | Imagem | Conteúdo |
|----------|---------------|--------|----------|
| Acrílico | "left" | order-1 (esquerda) | order-2 (direita) |
| Poliestireno | "right" | order-2 (direita) | order-1 (esquerda) |
| PETG | "left" | order-1 (esquerda) | order-2 (direita) |
| Policarbonato Alveolar | "right" | order-2 (direita) | order-1 (esquerda) |
| ... | ... | ... | ... |

## Resumo

A correção é simples: remover a classe CSS inútil `lg:flex-row-reverse` para limpar o código. O layout alternado já funciona com as classes `lg:order-*` nos elementos filhos.

Se o problema persistir na sua visualização, é porque o viewport está menor que 1024px (breakpoint `lg` do Tailwind).

