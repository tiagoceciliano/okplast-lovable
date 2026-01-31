

# Plano: Refazer Secao 6 Motivos - Grid Estatico com Icones

## Resumo

Transformar o carrossel atual em um grid estatico de 2 linhas x 3 colunas, usando apenas icones e texto (sem imagens de fundo), com a copy exata da imagem de referencia.

---

## Layout Visual

```text
LINHA 1:
+-------------------+  +-------------------+  +-------------------+
|      [icone]      |  |      [icone]      |  |      [icone]      |
|                   |  |                   |  |                   |
| 1o Atendimento    |  |  2o Frete Seguro  |  | 3o Produtos Sob   |
|  Agil e Eficaz    |  |                   |  |     Medida        |
|                   |  |                   |  |                   |
| Os orcamentos...  |  | Os orcamentos...  |  | Os orcamentos...  |
+-------------------+  +-------------------+  +-------------------+

LINHA 2:
+-------------------+  +-------------------+  +-------------------+
|      [icone]      |  |      [icone]      |  |      [icone]      |
|                   |  |                   |  |                   |
| 4o Emissao de     |  | 5o Faturamento    |  | 6o Empresa Solida |
|      NF-e         |  | e Linha de Credito|  |   e Confiavel     |
|                   |  |                   |  |                   |
| Os orcamentos...  |  | Os orcamentos...  |  | Os orcamentos...  |
+-------------------+  +-------------------+  +-------------------+
```

---

## Copy Exata dos 6 Blocos

| # | Titulo | Descricao |
|---|--------|-----------|
| 1 | 1o Atendimento Agil e Eficaz | Os orcamentos e cotacoes empresariais sao respondidos em ate 24 horas uteis em papel timbrado atraves de um Sistema Informatizado, e-mail ou atendimento nas lojas. |
| 2 | 2o Frete Seguro | Os orcamentos e cotacoes empresariais sao respondidos em ate 24 horas uteis em papel timbrado atraves de um Sistema Informatizado, e-mail ou atendimento nas lojas. |
| 3 | 3o Produtos Sob Medida | Os orcamentos e cotacoes empresariais sao respondidos em ate 24 horas uteis em papel timbrado atraves de um Sistema Informatizado, e-mail ou atendimento nas lojas. |
| 4 | 4o Emissao de NF-e | Os orcamentos e cotacoes empresariais sao respondidos em ate 24 horas uteis em papel timbrado atraves de um Sistema Informatizado, e-mail ou atendimento nas lojas. |
| 5 | 5o Faturamento e Linha de Credito | Os orcamentos e cotacoes empresariais sao respondidos em ate 24 horas uteis em papel timbrado atraves de um Sistema Informatizado, e-mail ou atendimento nas lojas. |
| 6 | 6o Empresa Solida e Confiavel | Os orcamentos e cotacoes empresariais sao respondidos em ate 24 horas uteis em papel timbrado atraves de um Sistema Informatizado, e-mail ou atendimento nas lojas. |

---

## Icones Lucide Correspondentes

| Bloco | Icone Lucide |
|-------|--------------|
| 1 - Atendimento | Headphones (atendente com headset) |
| 2 - Frete Seguro | Truck (caminhao) |
| 3 - Produtos Sob Medida | ClipboardEdit ou Pencil (prancheta com lapis) |
| 4 - Emissao NF-e | Receipt (documento com cifrao) |
| 5 - Faturamento | BadgeDollarSign ou CreditCard (documento com check e moeda) |
| 6 - Empresa Solida | Building2 (predio com pessoas) |

---

## Estilo Visual

| Elemento | Estilo |
|----------|--------|
| Card | Fundo branco, borda roxa arredondada (border-2 border-purple-400 rounded-xl) |
| Icone | Cor roxa (text-purple-600), tamanho grande, centralizado no topo |
| Titulo | Texto roxo (text-purple-700), negrito, centralizado |
| Descricao | Texto cinza escuro (text-gray-600), centralizado, tamanho menor |

---

## Alteracoes Necessarias

### Arquivo: `src/components/home/MotivosCarousel.tsx`

Renomear para `MotivosGrid.tsx` ou manter o mesmo nome e substituir completamente:

1. Remover imports do Embla Carousel
2. Remover logica de navegacao (scrollPrev, scrollNext)
3. Substituir por grid estatico CSS: `grid grid-cols-1 md:grid-cols-3 gap-6`
4. Atualizar array `motivos` com copy exata
5. Remover bgImage de cada item
6. Aplicar novo estilo visual nos cards

### Arquivo: `src/pages/Index.tsx`

Atualizar o titulo da secao para:
- "6 Motivos para Escolher a Lab Acrilicos"

---

## Secao Tecnica

### Novo Componente MotivosGrid

```typescript
import { Headphones, Truck, ClipboardEdit, Receipt, BadgeDollarSign, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const motivos = [
  { 
    icon: Headphones, 
    titulo: "1º Atendimento Ágil e Eficaz", 
    desc: "Os orçamentos e cotações empresariais são respondidos em até 24 horas úteis em papel timbrado através de um Sistema Informatizado, e-mail ou atendimento nas lojas."
  },
  { 
    icon: Truck, 
    titulo: "2º Frete Seguro", 
    desc: "Os orçamentos e cotações empresariais são respondidos em até 24 horas úteis em papel timbrado através de um Sistema Informatizado, e-mail ou atendimento nas lojas."
  },
  { 
    icon: ClipboardEdit, 
    titulo: "3º Produtos Sob Medida", 
    desc: "Os orçamentos e cotações empresariais são respondidos em até 24 horas úteis em papel timbrado através de um Sistema Informatizado, e-mail ou atendimento nas lojas."
  },
  { 
    icon: Receipt, 
    titulo: "4º Emissão de NF-e", 
    desc: "Os orçamentos e cotações empresariais são respondidos em até 24 horas úteis em papel timbrado através de um Sistema Informatizado, e-mail ou atendimento nas lojas."
  },
  { 
    icon: BadgeDollarSign, 
    titulo: "5º Faturamento e Linha de Crédito", 
    desc: "Os orçamentos e cotações empresariais são respondidos em até 24 horas úteis em papel timbrado através de um Sistema Informatizado, e-mail ou atendimento nas lojas."
  },
  { 
    icon: Building2, 
    titulo: "6º Empresa Sólida e Confiável", 
    desc: "Os orçamentos e cotações empresariais são respondidos em até 24 horas úteis em papel timbrado através de um Sistema Informatizado, e-mail ou atendimento nas lojas."
  },
];

export function MotivosCarousel({ className }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
      {motivos.map((motivo, index) => (
        <div 
          key={index} 
          className="bg-white border-2 border-purple-400 rounded-xl p-6 text-center"
        >
          <div className="flex justify-center mb-4">
            <motivo.icon className="h-12 w-12 text-purple-600" />
          </div>
          <h3 className="font-bold text-purple-700 text-lg mb-3">
            {motivo.titulo}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {motivo.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
```

---

## Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/home/MotivosCarousel.tsx` | Substituir carousel por grid estatico com novo estilo |
| `src/pages/Index.tsx` | Ajustar titulo da secao |

