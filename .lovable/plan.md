

# Plano de Implementação: Site Lab Acrílicos

## Visão Geral
Criação de site institucional + catálogo de produtos para a **Lab Acrílicos**, migrando a estrutura do antigo site Acrilzano para o Lovable, mantendo URLs idênticas e todo o copy do dossiê.

---

## FASE 1: Estrutura Base e Layout

### 1.1 Design System
- Paleta de cores profissional/corporativa baseada no logo (azul escuro #1A3A5C / azul claro #00AFEF)
- Tipografia clean e profissional
- Componentes reutilizáveis para cards de produtos, CTAs e seções

### 1.2 Layout Global
- **Header**: Logo Lab Acrílicos + Menu de navegação responsivo com hierarquia completa
- **Footer**: Contato completo (endereço, telefone, WhatsApp, e-mail), horário de funcionamento, links para políticas
- **Botão flutuante WhatsApp**: Presente em todas as páginas

### 1.3 Menu de Navegação (conforme sitemap)
- Home
- Institucional: Sobre Nós, Orçamento, Política de Revenda, Política de Venda, Termo de Uso
- Produtos: Acrílico Sob Medida (hub), Chapas de Acrílico (hub), categorias e subcategorias

---

## FASE 2: Páginas Institucionais

### 2.1 Home (/)
- Hero com headline: "FÁBRICA e LOJA DE CHAPAS DE ACRÍLICO e PERSONALIZADOS"
- Seções do dossiê:
  - 6 Motivos para Escolher a Lab Acrílicos
  - Satisfação Garantida (depoimentos)
  - Produtos Sob Medida (cards com CTAs)
  - Chapas e Pedaços de Placas (tipos de material)
  - Grande Empresa, Grandes Clientes
- CTAs para Orçamento e WhatsApp

### 2.2 Sobre Nós (/home/sobre-nos/)
- Texto institucional "Quem Somos" do dossiê
- Destaque para 30 anos de mercado e tecnologia de ponta

### 2.3 Orçamento (/home/orcamento/)
- Formulário completo com validação (Zod)
- CTA paralelo para WhatsApp

### 2.4 Páginas de Políticas
- Política de Revenda (/home/politica-de-revenda/)
- Política de Venda (/home/politica-de-venda/)
- Termo de Uso (/home/termo-de-uso/)

---

## FASE 3: Catálogo de Produtos (18 páginas)

### 3.1 Páginas Hub (Categoria Principal)
- **Acrílico Sob Medida** (/acrilico-sob-medida/): Lista categorias de produtos personalizados
- **Chapas de Acrílico** (/chapas-de-acrilico/): Tipos de chapas disponíveis

### 3.2 Páginas de Detalhe de Produto
Cada página contém: título SEO, descrição do dossiê, benefícios, variações (quando aplicável), imagem genérica de acrílico, CTA "Solicitar Orçamento"

**Produtos de Acrílico:**
- Caixas Sob Medida
- Cúpulas e Redomas
- Potes para Doces e Guloseimas
- Potes para Grãos e Cereais a Granel
- Urna de Acrílico
- Caixa de Sugestão

**Medalhas e Troféus:**
- Medalhas Personalizadas
- Troféus Personalizados

**Chapas e Placas:**
- Placa de Acrílico Customizada
- Placa de Acrílico Sinalização

**Expositores:**
- Expositores para Bijuterias
- Expositores para Calçados
- Expositores para Óculos

**Display e Porta-Folder:**
- Display de Acrílico
- Porta Folder (de mesa e de parede)

---

## FASE 4: Backend (Lovable Cloud)

### 4.1 Banco de Dados
- Tabela `leads` com campos:
  - id, nome, email, telefone, produto_interesse, mensagem
  - utm_source, utm_medium, utm_campaign, utm_term, utm_content
  - cidade, estado, pais (geolocalização)
  - created_at (timestamp fuso São Paulo)

### 4.2 Edge Function: Processamento de Lead
- Recebe dados do formulário
- Captura UTMs da URL
- Consulta geolocalização via ipapi.co
- Salva no banco de dados
- Roteia para webhook correto:
  - `WEBHOOK_CHAPAS` se produto = "Chapas" 
  - `WEBHOOK_GERAL` para demais produtos
- Variáveis de ambiente para URLs dos webhooks (você preencherá)

---

## FASE 5: Funcionalidades JavaScript

### 5.1 Captura de UTMs
- Hook que lê parâmetros UTM da URL na chegada
- Armazena em localStorage/contexto global

### 5.2 Botão Flutuante WhatsApp
- Máscara de telefone (XX) XXXXX-XXXX
- Capitalização automática do nome
- Geração de mensagem personalizada com dados
- Abre WhatsApp com URL encoded
- Variável `WHATSAPP_PHONE` para você configurar (21 92367-0633)

### 5.3 Validação de Formulário
- Validação client-side com Zod
- Campos obrigatórios: Nome, Email, Telefone
- Feedback visual de erros

---

## FASE 6: SEO e Responsividade

### 6.1 SEO Básico
- Title tags únicos por página
- Meta descriptions baseadas no copy do dossiê
- URLs amigáveis (conforme sitemap)
- Estrutura semântica (h1, h2, h3)

### 6.2 Design Responsivo
- Layout mobile-first
- Menu hamburger em dispositivos móveis
- Imagens otimizadas
- Touch-friendly para botões e CTAs

---

## Placeholders para Você Preencher

| Variável | Valor Atual | Onde Usar |
|----------|-------------|-----------|
| `WHATSAPP_PHONE` | 5521923670633 | Botão flutuante |
| `WEBHOOK_CHAPAS` | https://webhook.kinbox.com.br/v3/inbound/Oul9_dGko | Edge Function |
| `WEBHOOK_GERAL` | https://webhook.kinbox.com.br/v3/inbound/gttU_LX0F | Edge Function |

---

## Entregáveis Finais

1. **24 páginas** com copy integral do dossiê
2. **Backend** configurado com tabela de leads e edge function
3. **Formulário de orçamento** funcional com webhooks
4. **WhatsApp flutuante** em todas as páginas
5. **Site responsivo** pronto para publicação

