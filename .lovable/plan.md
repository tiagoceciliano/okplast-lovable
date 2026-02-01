
# Plano: Criar Página de Política de Privacidade (LGPD)

## Resumo
Criar uma nova página de Política de Privacidade com texto completo sobre proteção de dados conforme a Lei Geral de Proteção de Dados (LGPD) e adicionar o link no rodapé de todas as páginas.

---

## O que será feito

### 1. Nova Página de Política de Privacidade
Criar a página `src/pages/PoliticaPrivacidade.tsx` seguindo o mesmo padrão visual das outras páginas de política (Revenda, Venda, Termo de Uso).

**Conteúdo da página incluirá:**
- Hero com título e descrição
- Seções sobre:
  - Dados coletados (nome, e-mail, telefone, WhatsApp)
  - Finalidade do tratamento de dados
  - Base legal para tratamento (LGPD Art. 7º)
  - Compartilhamento de dados
  - Armazenamento e segurança
  - Direitos do titular (acesso, correção, exclusão, portabilidade)
  - Cookies e tecnologias de rastreamento
  - Alterações na política
  - Contato do encarregado de dados (DPO)
  - Caixa de contato com informações da empresa

### 2. Atualização do Roteamento
Adicionar a rota `/home/politica-de-privacidade` no arquivo `App.tsx`.

### 3. Atualização do Rodapé
Adicionar o link "Política de Privacidade" na seção de políticas do Footer, junto com os outros links existentes (Política de Revenda, Política de Venda, Termo de Uso).

---

## Arquivos a serem modificados/criados

| Arquivo | Ação |
|---------|------|
| `src/pages/PoliticaPrivacidade.tsx` | Criar novo |
| `src/App.tsx` | Adicionar import e rota |
| `src/components/layout/Footer.tsx` | Adicionar link |

---

## Detalhes Técnicos

### Estrutura da nova página
```text
PoliticaPrivacidade.tsx
├── Hero Section (gradient-primary)
│   ├── Título: "Política de Privacidade"
│   └── Subtítulo: "Como protegemos seus dados pessoais"
└── Conteúdo (prose prose-lg)
    ├── Introdução
    ├── Dados Coletados
    ├── Finalidade do Tratamento
    ├── Base Legal (LGPD)
    ├── Compartilhamento
    ├── Armazenamento e Segurança
    ├── Direitos do Titular
    ├── Cookies
    ├── Alterações
    └── Contato (card com info da empresa)
```

### Nova rota
- **Caminho:** `/home/politica-de-privacidade`
- **Componente:** `PoliticaPrivacidade`

### Link no rodapé
Será adicionado abaixo do "Termo de Uso" na seção de Horários/Políticas.
