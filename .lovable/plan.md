
# Plano: Modal de WhatsApp como Canal Principal + Reestruturação de CTAs

## Objetivo
Transformar o WhatsApp no canal principal de contato, com botões verdes e chamativos que abrem um modal de formulário (similar ao print da Acrilzano). O formulário coleta dados do visitante e redireciona para o WhatsApp com mensagem formatada. Orçamento via email fica discreto e secundário.

---

## 1. Criar Componente WhatsAppModal

**Arquivo:** `src/components/layout/WhatsAppModal.tsx`

**Funcionalidades:**
- Modal usando Dialog do Radix UI (já instalado)
- Campos: Nome, E-mail, Telefone (com máscara), Produto de Interesse (select), Mensagem
- Validação com Zod (reutilizar lógica existente)
- Opções de produto simplificadas:
  - "Chapa Inteira ou Cortada"
  - "Produto Personalizado"
- Botão verde "Clique aqui para falar pelo WhatsApp"
- Ao submeter: abre WhatsApp com dados formatados + dispara webhook via edge function

---

## 2. Atualizar Constantes

**Arquivo:** `src/lib/constants.ts`

**Mudanças:**
- Adicionar lista simplificada de produtos para o modal:
```
PRODUTOS_WHATSAPP = [
  "Chapa Inteira ou Cortada",
  "Produto Personalizado"
]
```

---

## 3. Reestruturar Header

**Arquivo:** `src/components/layout/Header.tsx`

**Mudanças:**
- Botão WhatsApp: verde, destacado, abre o WhatsAppModal
- Botão Email: discreto (outline ou texto), menor, vai para /home/orcamento
- Inverter ordem visual: WhatsApp primeiro e maior, Email secundário

---

## 4. Atualizar Página Inicial (Home)

**Arquivo:** `src/pages/Index.tsx`

**Mudanças:**
- Hero: substituir botões atuais por:
  - Botão WhatsApp verde (principal) - abre modal
  - Link discreto "Orçamento via e-mail" abaixo
- Seção CTA Final: mesmo padrão - WhatsApp verde + email discreto
- Todos os botões de WhatsApp abrem o modal ao invés de link direto

---

## 5. Atualizar Botão Flutuante

**Arquivo:** `src/components/layout/WhatsAppButton.tsx`

**Mudanças:**
- Ao clicar, abre o WhatsAppModal ao invés de link direto
- Manter animação pulse-glow verde

---

## 6. Atualizar Layout Principal

**Arquivo:** `src/components/layout/Layout.tsx`

**Mudanças:**
- Adicionar estado global para controlar abertura do modal
- Passar contexto para componentes filhos

---

## 7. Aplicar nas Páginas de Produto

**Arquivos:** 
- `src/pages/products/AcrilicoSobMedida.tsx`
- `src/pages/products/ChapasDeAcrilico.tsx`

**Mudanças:**
- CTAs de WhatsApp abrem o modal
- Pré-selecionar produto de interesse baseado na página

---

## Fluxo do Usuário

```text
+-------------------+     +------------------+     +-------------------+
| Clica em botão    | --> | Modal abre com   | --> | Valida campos e   |
| WhatsApp verde    |     | formulário       |     | abre WhatsApp     |
+-------------------+     +------------------+     +-------------------+
                                                          |
                                                          v
                                              +------------------------+
                                              | Dispara webhook para   |
                                              | salvar lead (async)    |
                                              +------------------------+
```

---

## Detalhes Técnicos

### Estrutura do Modal
- Usa `Dialog` do shadcn/ui (já disponível)
- Estado controlado via useState ou Context
- Validação com react-hook-form + zod
- Reutiliza funções existentes: `formatPhone`, `capitalizeName`, `generateWhatsAppMessage`

### Formato da Mensagem WhatsApp
```
Olá, gostaria de atendimento para um orçamento para os dados abaixo:

Nome: [Nome Capitalizado]
E-mail: [email]
Telefone: [(XX) XXXXX-XXXX]
Produto: [Selecionado]
Mensagem: [Texto]
```

### Webhook
- Reutiliza edge function `process-lead` existente
- Disparo assíncrono (não bloqueia redirecionamento ao WhatsApp)

### Estilos CSS
- Botões WhatsApp usam classe `.btn-whatsapp` já definida
- Verde oficial WhatsApp: `hsl(142 70% 45%)`
- Botão de email usa `variant="ghost"` ou `variant="link"` para ser discreto

---

## Arquivos a Criar
1. `src/components/layout/WhatsAppModal.tsx`

## Arquivos a Modificar
1. `src/lib/constants.ts` - adicionar produtos simplificados
2. `src/components/layout/Header.tsx` - integrar modal
3. `src/components/layout/Layout.tsx` - contexto do modal
4. `src/components/layout/WhatsAppButton.tsx` - abrir modal
5. `src/components/layout/index.ts` - exportar modal
6. `src/pages/Index.tsx` - CTAs com modal
7. `src/pages/products/AcrilicoSobMedida.tsx` - CTAs com modal
8. `src/pages/products/ChapasDeAcrilico.tsx` - CTAs com modal
