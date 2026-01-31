

# Plano de Implementação: Site Lab Acrílicos

## Visão Geral
Criação de site institucional + catálogo de produtos para a **Lab Acrílicos**, migrando a estrutura do antigo site Acrilzano para o Lovable, mantendo URLs idênticas e todo o copy do dossiê.

---

## ✅ FASE 1: Estrutura Base e Layout (CONCLUÍDA)

### 1.1 Design System ✅
- [x] Paleta de cores profissional/corporativa baseada no logo (azul escuro #1A3A5C / azul claro #00AFEF)
- [x] Tipografia clean e profissional (Inter + Poppins)
- [x] Componentes reutilizáveis para cards de produtos, CTAs e seções

### 1.2 Layout Global ✅
- [x] **Header**: Logo Lab Acrílicos + Menu de navegação responsivo com hierarquia completa
- [x] **Footer**: Contato completo (endereço, telefone, WhatsApp, e-mail), horário de funcionamento, links para políticas
- [x] **Botão flutuante WhatsApp**: Presente em todas as páginas

### 1.3 Menu de Navegação ✅
- [x] Home
- [x] Institucional: Sobre Nós, Orçamento, Política de Revenda, Política de Venda, Termo de Uso
- [x] Produtos: Acrílico Sob Medida (hub), Chapas de Acrílico (hub)

---

## ✅ FASE 2: Páginas Institucionais (CONCLUÍDA)

- [x] Home (/) - Hero, 6 Motivos, Produtos Sob Medida, Chapas, Depoimentos, CTAs
- [x] Sobre Nós (/home/sobre-nos/)
- [x] Orçamento (/home/orcamento/) - Formulário com validação Zod
- [x] Política de Revenda (/home/politica-de-revenda/)
- [x] Política de Venda (/home/politica-de-venda/)
- [x] Termo de Uso (/home/termo-de-uso/)

---

## ✅ FASE 3: Catálogo de Produtos (CONCLUÍDA)

### Páginas Hub ✅
- [x] Acrílico Sob Medida (/acrilico-sob-medida/)
- [x] Chapas de Acrílico (/chapas-de-acrilico/)

### Páginas de Detalhe de Produto ✅ (15 páginas)
- [x] Caixas Sob Medida
- [x] Cúpulas e Redomas
- [x] Potes para Doces e Guloseimas
- [x] Potes para Grãos e Cereais a Granel
- [x] Urna de Acrílico
- [x] Caixa de Sugestão
- [x] Medalhas Personalizadas
- [x] Troféus Personalizados
- [x] Placa de Acrílico Customizada
- [x] Placa de Acrílico Sinalização
- [x] Expositores para Bijuterias
- [x] Expositores para Calçados
- [x] Expositores para Óculos
- [x] Display de Acrílico
- [x] Porta Folder

---

## ✅ FASE 4: Backend (Lovable Cloud) (CONCLUÍDA)

### 4.1 Banco de Dados ✅
- [x] Tabela `leads` criada com todos os campos necessários

### 4.2 Edge Function: process-lead ✅
- [x] Recebe dados do formulário
- [x] Captura UTMs
- [x] Consulta geolocalização via ipapi.co
- [x] Salva no banco de dados
- [x] Roteia para webhook correto (WEBHOOK_CHAPAS ou WEBHOOK_GERAL)

### 4.3 Secrets Configurados ✅
- [x] WEBHOOK_CHAPAS
- [x] WEBHOOK_GERAL

---

## ✅ FASE 5: Funcionalidades JavaScript (CONCLUÍDA)

- [x] Hook useUTM para captura de parâmetros UTM
- [x] Botão flutuante WhatsApp com animação
- [x] Máscara de telefone (XX) XXXXX-XXXX
- [x] Capitalização automática do nome
- [x] Geração de mensagem personalizada
- [x] Validação de formulário com Zod

---

## ✅ FASE 6: SEO e Responsividade (CONCLUÍDA)

- [x] Title tags únicos por página
- [x] URLs amigáveis conforme sitemap
- [x] Estrutura semântica (h1, h2, h3)
- [x] Design responsivo mobile-first
- [x] Menu hamburger em dispositivos móveis

---

## Dados Configurados

| Variável | Valor | Status |
|----------|-------|--------|
| `WHATSAPP_PHONE` | 5521923670633 | ✅ Configurado |
| `WEBHOOK_CHAPAS` | (secret) | ✅ Configurado |
| `WEBHOOK_GERAL` | (secret) | ✅ Configurado |

---

## Entregáveis Finais ✅

1. ✅ **22 páginas** com copy e estrutura
2. ✅ **Backend** configurado com tabela de leads e edge function
3. ✅ **Formulário de orçamento** funcional com webhooks
4. ✅ **WhatsApp flutuante** em todas as páginas
5. ✅ **Site responsivo** pronto para publicação

