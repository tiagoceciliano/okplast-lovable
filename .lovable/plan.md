

## Análise SEO Atual e Plano de Otimização

### Diagnóstico: Problemas Encontrados

**1. Inconsistências entre domínios**
- O `sitemap.xml` e `robots.txt` apontam para `labacrilicos.com.br` (domínio antigo), mas o site roda em `okplast.com.br`. O Google está indexando o sitemap errado.
- O `index.html` tem dados estruturados com endereço "Rua Cordovil 259", mas o código usa "Rua Guatemala, 593". Informações conflitantes prejudicam SEO local.

**2. Falta de conteúdo textual rico em palavras-chave**
- A Home tem pouco texto corrido. O Google prioriza conteúdo semântico extenso.
- As páginas de chapas individuais (ex: `/chapas/acrilico`) têm bom conteúdo, mas faltam termos geográficos como "Rio de Janeiro", "RJ", "zona norte" no corpo do texto.
- O H1 da Home ("DISTRIBUIDORA DE CHAPAS PLÁSTICAS") não contém "RJ" nem "Rio de Janeiro".

**3. Header sem navegação real**
- O Header só tem logo + botão WhatsApp. Não há menu de navegação com links internos. O Google usa links internos para descobrir e rankear páginas. Os `NAV_ITEMS` definidos em `constants.ts` não estão sendo renderizados no Header.

**4. Falta de tags alt otimizadas**
- Os alts das imagens são genéricos ("Chapa de Acrílico Transparente"). Deveriam incluir localização ("Chapa de Acrílico Transparente no RJ - OK Plast").

**5. SEO Head duplicado/conflitante**
- O `index.html` define title, description e OG tags estaticamente, e o `SEOHead` via React Helmet sobrescreve parcialmente. Isso pode causar tags duplicadas.

**6. Faltam páginas otimizadas para long-tail keywords**
- Não existe conteúdo para termos como "chapa de acrílico preço RJ", "policarbonato alveolar Rio de Janeiro", "onde comprar acrílico RJ".

**7. Sem internal linking estratégico**
- As páginas de chapas não linkam entre si (ex: "Veja também Policarbonato Compacto").
- Não há seção de FAQ renderizada visualmente (só schema invisível).

---

### Plano de Implementação

**Tarefa 1: Corrigir sitemap.xml e robots.txt**
- Atualizar domínio de `labacrilicos.com.br` para `okplast.com.br` em ambos os arquivos.
- Adicionar as rotas corretas atuais.

**Tarefa 2: Corrigir dados estruturados no index.html**
- Remover o bloco de LocalBusiness duplicado do `index.html` (já existe no React via SEOHead).
- Remover as meta tags estáticas de OG/Twitter do `index.html` que conflitam com o Helmet.

**Tarefa 3: Adicionar navegação real no Header**
- Renderizar os `NAV_ITEMS` com dropdown para "Chapas" e "Institucional". Isso cria links internos crawláveis pelo Google.

**Tarefa 4: Otimizar H1s e meta tags com palavras-chave geográficas**
- Home H1: "Distribuidora de Chapas Plásticas no Rio de Janeiro"
- `/chapas` title: "Chapas de Acrílico, Policarbonato, PETG no RJ | OK Plast"
- `/chapas/acrilico` title: "Chapa de Acrílico no Rio de Janeiro - Cristal, Colorido, Fumê | OK Plast"
- Aplicar padrão similar para cada página de chapa individual.

**Tarefa 5: Enriquecer conteúdo textual com keywords + localização**
- Adicionar parágrafos com texto natural em cada página mencionando "Rio de Janeiro", "RJ", "distribuidora", "melhor preço", "corte sob medida".
- Adicionar seção de FAQ visível (não só schema) na Home e na página `/chapas`.

**Tarefa 6: Cross-linking entre páginas de chapas**
- Adicionar seção "Veja também" no rodapé de cada página de chapa individual, linkando para as outras 6 chapas.

**Tarefa 7: Otimizar alt texts das imagens**
- Incluir keyword + localização nos alts: "Chapa de acrílico transparente RJ - OK Plast distribuidora".

### Detalhes Técnicos

- **Arquivos modificados**: `public/sitemap.xml`, `public/robots.txt`, `index.html`, `src/components/layout/Header.tsx`, `src/components/home/HeroSection.tsx`, `src/pages/Index.tsx`, `src/pages/products/ChapasDeAcrilico.tsx`, `src/pages/chapas/Acrilico.tsx` (e todas as outras 6 páginas de chapas), `src/components/SEOHead.tsx`.
- **Novo componente**: `RelatedProducts` — grid de links para outras chapas, reutilizado em todas as páginas `/chapas/*`.
- **Novo componente**: `FAQSection` — renderiza FAQ visível + schema, reutilizado na Home e `/chapas`.

