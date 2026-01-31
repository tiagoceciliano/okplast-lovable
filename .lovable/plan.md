

# Plano de Redesign: Lab Acrilicos - Estrutura Identica ao Acrilzano

## Visao Geral

Redesign completo replicando **exatamente** a estrutura e layout do site Acrilzano, porem mantendo a paleta de cores azul modernizada para a Lab Acrilicos.

---

## 1. NOVA PALETA DE CORES (AZUL MODERNO)

### Cores Atuais vs Novas

```text
+------------------------------------------+------------------------------------------+
|           CORES ATUAIS                   |           CORES NOVAS (MODERNAS)         |
+------------------------------------------+------------------------------------------+
| Primary: #1A3A5C (azul escuro apagado)   | Primary: #0F4C81 (azul petróleo vibrante)|
| Accent:  #00AFEF (azul claro ciano)      | Accent:  #00B4D8 (turquesa moderno)      |
+------------------------------------------+------------------------------------------+
```

### Nova Paleta Completa

| Variavel | Cor HSL | Hex | Uso |
|----------|---------|-----|-----|
| Primary | 207 80% 28% | `#0F4C81` | Header, banners, botoes |
| Accent | 190 100% 42% | `#00B4D8` | Destaques, hovers, icones |
| Secondary | 190 70% 92% | `#E0F7FA` | Fundo secundario |
| WhatsApp | 142 70% 45% | `#25D366` | Botao WhatsApp (verde padrao) |
| CTA Email | 207 60% 45% | `#4A7CB8` | Botao email/orcamento |
| Text Dark | 207 40% 15% | `#1C2D3E` | Textos principais |

---

## 2. NOVO HEADER (Identico ao Acrilzano)

### Layout Desktop

```text
+-------------------------------------------------------------------------------------+
|  [LOGO GRANDE branca]               [Orcamento via WhatsApp] [Orcamento Via e-mail] |
|  (altura ~60-70px)                        VERDE #25D366         AZUL #4A7CB8        |
+-------------------------------------------------------------------------------------+
               Fundo: Azul #0F4C81 (solido, sem gradiente)
```

### Especificacoes

- **Fundo**: Azul solido `#0F4C81`
- **Logo**: Aumentar de 40px para **60-70px** de altura
- **Botao WhatsApp**: Verde `#25D366`, border-radius 30px, icone WhatsApp, texto branco
- **Botao E-mail**: Azul claro `#4A7CB8`, border-radius 30px, icone calendario/email
- **Posicao**: Sticky top
- **Remover**: Menu dropdown atual (simplificar navegacao)

### Arquivos a Modificar

- `src/components/layout/Header.tsx` - Layout completamente novo

---

## 3. HOME PAGE (Estrutura Identica ao Acrilzano)

### 3.1 Hero Section (2 Colunas)

```text
+----------------------------------------+----------------------------------------+
|  FABRICA e LOJA DE CHAPAS DE           |     [Imagem Cubo de Acrilico 3D]       |
|  ACRILICO e PERSONALIZADOS.            |                                        |
|                                        |                                        |
|  Acrilico Transparente e Colorido,     |         • • • • (dots navegacao)       |
|  PS, Policarbonato, Petg, PVC          |                                        |
+----------------------------------------+----------------------------------------+
      Fundo: Branco | Titulo: Azul escuro
```

- Titulo grande (47px desktop, 30px mobile)
- Subtitulo em cor accent (turquesa)
- Imagem do cubo a direita com slider dots

### 3.2 Secao "Conheca um pouco da nossa empresa"

- Linha decorativa horizontal com estrela/icone central (cor turquesa)
- Foto da equipe Lab Acrilicos (placeholder por enquanto)
- Texto institucional do dossie
- Botao "Conheca a Nossa Historia" com borda azul

### 3.3 Banner Azul

```text
+-------------------------------------------------------------------------------------+
|  Lab Acrilicos e sua casa do acrilico com o melhor preco da regiao                  |
|  entre todas as lojas de acrilicos.                                                 |
+-------------------------------------------------------------------------------------+
       Fundo: Azul #0F4C81 | Texto: Branco
```

### 3.4 "6 Motivos para Escolher a Lab Acrilicos"

- Titulo centralizado (azul escuro)
- **Carrossel com setas laterais** (nao grid estatico)
- 3 cards visiveis desktop, 1 mobile
- Cards com imagem de fundo + texto sobreposto
- Conteudo do dossie:
  1. Emissao de NF-e
  2. Faturamento e Linha de Credito
  3. Empresa Solida e Confiavel
  4. Pronta Entrega
  5. Entrega em Todo Brasil
  6. Atendimento Rapido

### 3.5 "Satisfacao Garantida"

- Titulo + subtitulo "Veja as opinioes de nossos clientes"
- Linha decorativa com estrela turquesa
- Grid 4 colunas com cards de depoimentos
- 5 estrelas douradas em cada card
- Texto italico entre aspas
- Nome do cliente em destaque azul

### 3.6 "PRODUTOS SOB MEDIDA"

- Titulo caps centralizado (azul)
- Grid 4x2 de produtos com **imagens reais**
- Link para cada produto
- Botao "Ver mais produtos" com borda azul

### 3.7 "CHAPAS E PEDACOS DE PLACAS"

- Titulo caps centralizado
- Grid de tipos de chapas (8 itens) com imagens de cores
- Link "VER MAIS CHAPAS"

### 3.8 "Grande Empresa, Grandes Clientes"

- Fundo branco
- Titulo centralizado
- Grid de logos de clientes (placeholders cinza por enquanto)

### 3.9 Secao Final: Orcamento + Mapa

- Layout 2 colunas:
  - Esquerda: 3 cards de beneficios (Contato Rapido, Alta Qualidade, Melhor Preco)
  - Direita: Google Maps embed
- Dados de contato Lab Acrilicos abaixo

---

## 4. PAGINA CHAPAS DE ACRILICO (Identica ao Acrilzano)

### 4.1 Hero

```text
+----------------------------------------+----------------------------------------+
|  CHAPAS DE ACRILICO                    |   [Slider imagens chapas coloridas     |
|                                        |    empilhadas]                         |
|  A melhor fabrica de acrilico          |                                        |
|  com o melhor preco do Rio de Janeiro  |                                        |
+----------------------------------------+----------------------------------------+
      Fundo: Cinza claro #F5F5F5
```

### 4.2 Introducao

- Titulo: "Chapas de acrilico cristal e diversas cores..."
- Linha decorativa com estrela turquesa
- Grid de amostras de cores (quadradinhos coloridos)
- Imagem de chapas empilhadas

### 4.3 Banner Azul

"Chapas de Acrilico cristal e diversas cores, Poliestireno (PS e PSAI), PETG, Policarbonato, ACM e PVC."

### 4.4 Lista de Tipos de Chapas (Layout Alternado)

Cada tipo com layout alternado (esquerda-direita):

```text
+---------------------------+---------------------------+
|  [IMAGEM]                 |  TITULO                   |
|                           |  Descricao...             |
|                           |  + Principais aplicacoes  |
|                           |  + Caracteristicas        |
+---------------------------+---------------------------+

+---------------------------+---------------------------+
|  TITULO                   |  [IMAGEM]                 |
|  Descricao...             |                           |
|  + Principais aplicacoes  |                           |
|  + Caracteristicas        |                           |
+---------------------------+---------------------------+
```

**Tipos a incluir:**
1. CHAPAS Acrilico CAST (100% Virgem)
2. CHAPAS Poliestireno (PS e PSAI)
3. CHAPAS PETG
4. CHAPAS Policarbonato Alveolar
5. CHAPAS Policarbonato Compacto
6. CHAPAS de PVC Expandido
7. CHAPAS ACM

### 4.5 Accordions Expansiveis

- Titulo clicavel com "+"
- Conteudo expandivel com aplicacoes e caracteristicas
- Animacao suave slide-down

---

## 5. PAGINA ACRILICO SOB MEDIDA (Identica ao Acrilzano)

### 5.1 Hero Azul

```text
+-------------------------------------------------------------------------------------+
|  A MELHOR FABRICA DE ACRILICO PERSONALIZADO E SOB MEDIDA                            |
|  do RIO DE JANEIRO (RJ).                                                            |
|                                                                                     |
|  Produtos, Caixas e Placas de acrilico Transparente, Cristal e           [Cubo 3D]  |
|  Coloridos.                                                                         |
+-------------------------------------------------------------------------------------+
       Fundo: Azul #0F4C81 | Texto: Branco
```

### 5.2 Secao Empresa

- Linha decorativa estrela turquesa
- Foto equipe
- Texto institucional

### 5.3 Categorias de Produtos (Grid por Categoria)

Cada categoria com titulo e grid horizontal:

**1. CAIXAS, POTES, CUPULAS, REDOMAS**
- Caixas Sob Medida
- Cupulas e Redomas
- Potes para Doces
- Potes para Graos

**2. MEDALHAS E TROFEUS PERSONALIZADOS**
- Medalhas Personalizadas
- Trofeus Personalizados

**3. PLACAS SOB MEDIDA, PERSONALIZADAS E GRAVADAS**
- Placa Customizada
- Placa Sinalizacao

**4. DISPLAY, URNAS E QUADROS**
- Display de Acrilico
- Urna de Acrilico
- Caixa de Sugestao

**5. EXPOSITORES**
- Expositores para Bijuterias
- Expositores para Calcados
- Expositores para Oculos
- Porta Folder

### 5.4 "Grande Empresa, Grandes Clientes"

Grid de logos

### 5.5 "Satisfacao Garantida"

Depoimentos (reutilizar componente)

### 5.6 Formulario "Solicite seu Orcamento"

```text
+-------------------------------------------------------------------------------------+
|  SOLICITE SEU ORCAMENTO                                                             |
|                                                                                     |
|  [Nome]              [E-mail]            [Telefone]                                 |
|  [WhatsApp]          [Produto interesse v]                                          |
|  [Mensagem .............................................................]         |
|  [ ] Li e concordo com a politica de privacidade                                    |
|                           [ENVIAR MENSAGEM] (botao amarelo/dourado)                 |
+-------------------------------------------------------------------------------------+
       Fundo: Azul escuro #0A3D66
```

### 5.7 "Nossa Localizacao"

- Google Maps embed (iframe)
- Dados de contato ao lado

---

## 6. NOVO FOOTER (Identico ao Acrilzano)

### Layout 4 Colunas

```text
+--------------------+--------------------+--------------------+--------------------+
|  CONTATO           |  ATENDIMENTO       |  HORARIOS          |  [GOOGLE MAP]      |
+--------------------+--------------------+--------------------+--------------------+
|  Endereco          |  Telefone          |  Seg-Sex 8h-18h    |  [iframe embed]    |
|  Email             |  WhatsApp          |  Sabado 8h-12h     |                    |
|  [Icons redes]     |                    |                    |                    |
+--------------------+--------------------+--------------------+--------------------+
       Fundo: Azul #0F4C81 | Texto: Branco
```

---

## 7. NOVOS COMPONENTES A CRIAR

| Componente | Descricao |
|------------|-----------|
| `DecorativeDivider.tsx` | Linha horizontal + estrela/icone central turquesa |
| `ProductCarousel.tsx` | Carrossel com setas laterais (usando embla-carousel) |
| `TestimonialCard.tsx` | Card depoimento com 5 estrelas douradas |
| `PurpleBanner.tsx` > `BlueBanner.tsx` | Faixa azul com texto centralizado |
| `AccordionSection.tsx` | Accordions expansiveis para chapas |
| `ProductCategoryGrid.tsx` | Grid de produtos por categoria |
| `EmbeddedQuoteForm.tsx` | Formulario de orcamento embutido |
| `GoogleMapEmbed.tsx` | Iframe do Google Maps |
| `ClientLogos.tsx` | Grid de logos de clientes |
| `HeroSlider.tsx` | Slider do hero com dots |

---

## 8. ARQUIVOS A MODIFICAR

### Design System

| Arquivo | Alteracao |
|---------|-----------|
| `src/index.css` | Nova paleta de cores azul moderno |
| `tailwind.config.ts` | Atualizar cores, adicionar font Open Sans |

### Layout

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/layout/Header.tsx` | Redesign completo (logo grande + 2 CTAs) |
| `src/components/layout/Footer.tsx` | Novo layout 4 colunas com mapa |

### Paginas

| Arquivo | Alteracao |
|---------|-----------|
| `src/pages/Index.tsx` | Estrutura identica ao Acrilzano |
| `src/pages/products/ChapasDeAcrilico.tsx` | Layout alternado + accordions |
| `src/pages/products/AcrilicoSobMedida.tsx` | Categorias + formulario embutido |

---

## 9. IMAGENS (Estrategia)

### Abordagem para Site Limpo e Rapido

1. **Imagens temporarias**: URLs do site Acrilzano (ate voce fornecer fotos proprias)
2. **Lazy loading**: Todas as imagens com `loading="lazy"`
3. **Otimizacao**: srcset para diferentes tamanhos
4. **Placeholders**: Cinza com icone para logos de clientes

### Imagens Necessarias

| Imagem | Uso |
|--------|-----|
| Cubo acrilico 3D | Hero sections |
| Foto equipe | Secao empresa |
| Chapas coloridas empilhadas | Hero chapas |
| Produtos individuais | Grids de produtos |
| Depoimentos (avatares) | Cards depoimentos |
| Logos clientes | Grid "Grandes Clientes" |

---

## 10. PERFORMANCE

Para manter o site **limpo e rapido**:

- Fontes: Google Fonts com `display=swap`
- Imagens: Lazy loading nativo
- CSS: Minificado pelo Vite
- JS: Code splitting por rota (ja configurado)
- Animacoes: Apenas CSS transitions (sem bibliotecas pesadas)
- Carrossel: embla-carousel (ja instalado, leve)

---

## Resumo de Entregaveis

| Item | Status |
|------|--------|
| Nova paleta azul moderno | A fazer |
| Header com logo grande + 2 CTAs | A fazer |
| Home Page identica ao Acrilzano | A fazer |
| Pagina Chapas com accordions | A fazer |
| Pagina Sob Medida com categorias | A fazer |
| Footer com mapa embutido | A fazer |
| 10 componentes reutilizaveis | A fazer |
| Backend (leads, webhooks) | Ja pronto, manter |

