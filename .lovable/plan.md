## Objetivo

Separar **Policarbonato Alveolar** e **Policarbonato Compacto** na tabela "Performance Google Ads por categoria" do Dashboard, mesmo que ambos compartilhem a mesma landing page (`/chapas/policarbonato`).

## Contexto

- No formulário WhatsApp o usuário escolhe explicitamente "Policarbonato Alveolar" ou "Policarbonato Compacto" — isso já é salvo em `leads.produto_interesse`.
- Visitas de página, porém, vêm de uma única URL `/chapas/policarbonato`, então **não dá para separar visitas** por sub-produto. Isso é uma limitação real de dados.

## Proposta de visualização

Manter a tabela atual (Categoria · Visitas · Leads · Conversão) e transformar a linha **Policarbonato** em uma linha "pai" expansível com duas sub-linhas:

```text
Categoria                    Visitas   Leads   Conversão
▸ Policarbonato                 120      18      15,00%
    └ Policarbonato Alveolar     —       12         —
    └ Policarbonato Compacto     —        6         —
ACM                              80       9      11,25%
Acrílico                         ...
```

- A linha pai continua mostrando o total de visitas e leads (soma dos dois sub-produtos) e a conversão agregada — assim o total da tabela não muda.
- Sub-linhas mostram **apenas leads** (visitas e conversão ficam como "—" com tooltip explicando que a página é compartilhada).
- Ordenação da tabela continua por leads desc no nível pai; sub-linhas ordenadas por leads desc.
- Expandido por padrão (é a única categoria com sub-níveis) — sem toggle, pra ficar direto.

Se preferir sem hierarquia, alternativa: listar "Policarbonato Alveolar" e "Policarbonato Compacto" como categorias separadas na tabela, cada uma com os leads corretos e visitas em branco/"—". Menos preciso pra taxa de conversão porque as visitas ficam órfãs.

## Alterações técnicas

**Edge function `get-dashboard-stats`** (`gadsPerformance`):
- Agrupamento de leads muda de "Policarbonato" único para manter `produto_interesse` original quando começa com "Policarbonato " (mantém "Alveolar"/"Compacto"). Demais categorias inalteradas.
- Retorno passa a incluir estrutura hierárquica:
  ```ts
  { category, visits, leads, conversionRate, children?: { category, leads }[] }
  ```
- Para "Policarbonato": `visits` = visitas do path `/chapas/policarbonato*`, `leads` = soma dos filhos, `children` = [{Alveolar, N}, {Compacto, M}].

**Front `GoogleAdsByCategoryTable.tsx`**:
- Renderizar sub-linhas indentadas quando `children` existir.
- Célula de visitas/conversão dos filhos exibe "—".
- Total no rodapé continua igual (soma das linhas-pai).

Nenhuma mudança em banco, tracking ou formulário.

## Pergunta rápida

Vai com a versão **hierárquica** (linha pai Policarbonato + 2 sub-linhas)? Se preferir a versão plana (Alveolar e Compacto como categorias irmãs, sem visitas), me diga que ajusto o plano.