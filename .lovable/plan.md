
# Plano: Criar Páginas Específicas de Cada Tipo de Chapa

## Objetivo

Criar 6 novas páginas específicas para cada tipo de material, seguindo o padrão da página `/chapas/acrilico` já existente.

---

## Páginas a Criar

| # | Arquivo | Rota | Material |
|---|---------|------|----------|
| 1 | `src/pages/chapas/Poliestireno.tsx` | `/chapas/poliestireno` | Poliestireno (PS e PSAI) |
| 2 | `src/pages/chapas/Petg.tsx` | `/chapas/petg` | PETG |
| 3 | `src/pages/chapas/PolicarbonatoAlveolar.tsx` | `/chapas/policarbonato-alveolar` | Policarbonato Alveolar |
| 4 | `src/pages/chapas/PolicarbonatoCompacto.tsx` | `/chapas/policarbonato-compacto` | Policarbonato Compacto |
| 5 | `src/pages/chapas/PvcExpandido.tsx` | `/chapas/pvc-expandido` | PVC Expandido |
| 6 | `src/pages/chapas/Acm.tsx` | `/chapas/acm` | ACM (Alumínio Composto) |

---

## Estrutura de Cada Página

Todas seguirão o mesmo layout da página de Acrílico:

```text
┌────────────────────────────────────────────────────┐
│  BREADCRUMB: Home > Chapas > [Material]           │
├────────────────────────────────────────────────────┤
│  HERO (2 colunas)                                  │
│  ├─ Esquerda: H1 + descrição + CTA WhatsApp       │
│  └─ Direita: Imagem/Carrossel do material         │
├────────────────────────────────────────────────────┤
│  SEÇÃO: Características Técnicas                   │
│  ├─ Descrição detalhada                            │
│  ├─ Principais Aplicações (lista)                  │
│  └─ Características (lista)                        │
├────────────────────────────────────────────────────┤
│  SEÇÃO: Espessuras Disponíveis                     │
│  └─ Badges com espessuras específicas do material  │
├────────────────────────────────────────────────────┤
│  CTA FINAL                                         │
│  └─ Botões WhatsApp + E-mail                       │
└────────────────────────────────────────────────────┘
```

---

## Conteúdo por Material

### 1. Poliestireno (PS e PSAI)

| Campo | Valor |
|-------|-------|
| SEO Title | "Chapas de Poliestireno RJ - PS e PSAI" |
| H1 | "CHAPAS DE POLIESTIRENO" |
| Subtítulo | "PS Cristal e PSAI (Alto Impacto)" |
| Espessuras | 1mm, 2mm, 3mm, 4mm, 5mm |
| Imagem Hero | `heroPoliestireno` (já existe em assets) |

**Aplicações:**
- Molduras e porta-retratos
- Displays descartáveis
- Embalagens
- Luminárias simples
- Projetos de curta duração

**Características:**
- Custo-benefício excelente
- Fácil corte e dobra
- Leve e versátil
- Disponível em cristal e leitoso

---

### 2. PETG

| Campo | Valor |
|-------|-------|
| SEO Title | "Chapas PETG RJ - Alta Resistência" |
| H1 | "CHAPAS PETG" |
| Subtítulo | "Alta resistência ao impacto e transparência" |
| Espessuras | 0.5mm, 1mm, 2mm, 3mm, 4mm, 5mm, 6mm, 8mm |
| Imagem Hero | `heroPetg` (já existe em assets) |

**Aplicações:**
- Proteções de máquinas
- Viseiras e EPIs
- Displays para alimentos
- Mobiliário urbano
- Painéis de segurança

**Características:**
- Alta resistência ao impacto
- Atóxico (aprovado para contato com alimentos)
- Boa transparência
- Resistente a produtos químicos

---

### 3. Policarbonato Alveolar

| Campo | Valor |
|-------|-------|
| SEO Title | "Chapas Policarbonato Alveolar RJ - Coberturas" |
| H1 | "CHAPAS POLICARBONATO ALVEOLAR" |
| Subtítulo | "Ideal para coberturas e pergolados" |
| Espessuras | 4mm, 6mm, 10mm, 16mm, 20mm, 25mm |
| Imagem Hero | `heroPolicarbonatoAlveolar` (já existe em assets) |

**Aplicações:**
- Coberturas e pergolados
- Telhados translúcidos
- Estufas agrícolas
- Fechamentos laterais
- Divisórias internas

**Características:**
- Leveza excepcional
- Isolamento térmico e acústico
- Proteção UV integrada
- Fácil instalação

---

### 4. Policarbonato Compacto

| Campo | Valor |
|-------|-------|
| SEO Title | "Chapas Policarbonato Compacto RJ - Segurança" |
| H1 | "CHAPAS POLICARBONATO COMPACTO" |
| Subtítulo | "250x mais resistente que o vidro" |
| Espessuras | 1mm, 2mm, 3mm, 4mm, 5mm, 6mm, 8mm, 10mm |
| Imagem Hero | `heroPolicarbonatoCompacto` (já existe em assets) |

**Aplicações:**
- Blindagem arquitetônica
- Escudos de proteção
- Vitrines de segurança
- Proteções industriais
- Coberturas de alto impacto

**Características:**
- Extrema resistência ao impacto
- Transparência similar ao vidro
- Resistente a vandalismo
- Proteção UV integrada

---

### 5. PVC Expandido

| Campo | Valor |
|-------|-------|
| SEO Title | "Chapas PVC Expandido RJ - Comunicação Visual" |
| H1 | "CHAPAS DE PVC EXPANDIDO" |
| Subtítulo | "Leve e versátil para comunicação visual" |
| Espessuras | 1mm, 2mm, 3mm, 5mm, 8mm, 10mm, 15mm, 20mm |
| Imagem Hero | `heroPvcExpandido` (já existe em assets) |

**Aplicações:**
- Painéis de comunicação visual
- Displays e totens
- Revestimentos internos
- Projetos de cenografia
- Maquetes e protótipos

**Características:**
- Extremamente leve
- Fácil de trabalhar
- Boa impressão direta
- Resistente à umidade
- Não propaga chamas

---

### 6. ACM (Alumínio Composto)

| Campo | Valor |
|-------|-------|
| SEO Title | "Chapas ACM RJ - Fachadas e Letreiros" |
| H1 | "CHAPAS ACM" |
| Subtítulo | "Alumínio composto para fachadas e revestimentos" |
| Espessuras | 3mm, 4mm, 5mm, 6mm |
| Imagem Hero | `heroAcm` (já existe em assets) |

**Aplicações:**
- Fachadas de lojas e edifícios
- Letreiros e totens
- Revestimentos externos
- Painéis de sinalização
- Mobiliário urbano

**Características:**
- Alta durabilidade
- Resistente a intempéries
- Diversas cores disponíveis
- Fácil manutenção
- Excelente acabamento

---

## Alterações no App.tsx

Adicionar as novas rotas:

```tsx
// Lazy loaded chapas pages
const Acrilico = lazy(() => import("./pages/chapas/Acrilico"));
const Poliestireno = lazy(() => import("./pages/chapas/Poliestireno"));
const Petg = lazy(() => import("./pages/chapas/Petg"));
const PolicarbonatoAlveolar = lazy(() => import("./pages/chapas/PolicarbonatoAlveolar"));
const PolicarbonatoCompacto = lazy(() => import("./pages/chapas/PolicarbonatoCompacto"));
const PvcExpandido = lazy(() => import("./pages/chapas/PvcExpandido"));
const Acm = lazy(() => import("./pages/chapas/Acm"));

// Routes
<Route path="/chapas/acrilico" element={<Acrilico />} />
<Route path="/chapas/poliestireno" element={<Poliestireno />} />
<Route path="/chapas/petg" element={<Petg />} />
<Route path="/chapas/policarbonato-alveolar" element={<PolicarbonatoAlveolar />} />
<Route path="/chapas/policarbonato-compacto" element={<PolicarbonatoCompacto />} />
<Route path="/chapas/pvc-expandido" element={<PvcExpandido />} />
<Route path="/chapas/acm" element={<Acm />} />
```

---

## Sitemap - Adicionar URLs

```xml
<url>
  <loc>https://labacrilicos.com.br/chapas/poliestireno</loc>
  <lastmod>2025-02-05</lastmod>
  <priority>0.8</priority>
</url>
<url>
  <loc>https://labacrilicos.com.br/chapas/petg</loc>
  <lastmod>2025-02-05</lastmod>
  <priority>0.8</priority>
</url>
<url>
  <loc>https://labacrilicos.com.br/chapas/policarbonato-alveolar</loc>
  <lastmod>2025-02-05</lastmod>
  <priority>0.8</priority>
</url>
<url>
  <loc>https://labacrilicos.com.br/chapas/policarbonato-compacto</loc>
  <lastmod>2025-02-05</lastmod>
  <priority>0.8</priority>
</url>
<url>
  <loc>https://labacrilicos.com.br/chapas/pvc-expandido</loc>
  <lastmod>2025-02-05</lastmod>
  <priority>0.8</priority>
</url>
<url>
  <loc>https://labacrilicos.com.br/chapas/acm</loc>
  <lastmod>2025-02-05</lastmod>
  <priority>0.8</priority>
</url>
```

---

## Resumo de Arquivos

| Ação | Arquivo |
|------|---------|
| Criar | `src/pages/chapas/Poliestireno.tsx` |
| Criar | `src/pages/chapas/Petg.tsx` |
| Criar | `src/pages/chapas/PolicarbonatoAlveolar.tsx` |
| Criar | `src/pages/chapas/PolicarbonatoCompacto.tsx` |
| Criar | `src/pages/chapas/PvcExpandido.tsx` |
| Criar | `src/pages/chapas/Acm.tsx` |
| Modificar | `src/App.tsx` (adicionar lazy imports e rotas) |
| Modificar | `public/sitemap.xml` (adicionar 6 novas URLs) |

---

## Benefícios

1. **SEO**: Cada material terá sua própria página otimizada para buscas específicas
2. **UX**: Usuários encontram informações detalhadas sobre cada tipo de chapa
3. **Conversão**: CTA específico para cada material no WhatsApp
4. **Consistência**: Todas as páginas seguem o mesmo padrão visual
