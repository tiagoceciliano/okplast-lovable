
# Plano: Melhorar Página de Termo de Uso

## Resumo
Atualizar a página de Termo de Uso para seguir o mesmo padrão visual e de qualidade de conteúdo da Política de Privacidade, incluindo listas organizadas, seções mais detalhadas e melhor formatação.

---

## Melhorias a serem feitas

### 1. Subtítulo do Hero
**De:** "Termos e condições de uso do site"
**Para:** "Regras e condições para utilização dos nossos serviços"

### 2. Seções com Listas Organizadas
Converter parágrafos em listas com bullets onde apropriado, especialmente nas seções:
- **Uso do Site** - listar proibições específicas
- **Propriedade Intelectual** - listar tipos de conteúdo protegido
- **Limitação de Responsabilidade** - listar isenções específicas

### 3. Adicionar Novas Seções
Incluir seções adicionais para completude jurídica:
- **Cadastro e Conta do Usuário** (se aplicável)
- **Condições de Compra** (referência à política de venda)
- **Rescisão** (condições de encerramento)

### 4. Melhorar Caixa de Contato
- Adicionar título "Dúvidas sobre os Termos"
- Incluir WhatsApp junto com e-mail e telefone
- Atualizar data: "Última atualização: Fevereiro de 2026"

---

## Comparativo Visual

```text
ANTES                              DEPOIS
├── Hero simples                   ├── Hero descritivo
├── Parágrafos de texto            ├── Listas organizadas (ul/li)
├── 8 seções básicas               ├── 10+ seções detalhadas
└── Caixa contato simples          └── Caixa contato completa
```

---

## Arquivo a ser modificado

| Arquivo | Ação |
|---------|------|
| `src/pages/TermoUso.tsx` | Atualizar estrutura e conteúdo |

---

## Estrutura Final da Página

```text
TermoUso.tsx (atualizado)
├── Hero Section
│   ├── Título: "Termo de Uso"
│   └── Subtítulo: "Regras e condições para utilização..."
└── Conteúdo (prose prose-lg)
    ├── 1. Aceitação dos Termos (com lista)
    ├── 2. Uso do Site (com lista de proibições)
    ├── 3. Propriedade Intelectual (com lista)
    ├── 4. Informações do Usuário
    ├── 5. Condições de Compra
    ├── 6. Limitação de Responsabilidade (com lista)
    ├── 7. Links Externos
    ├── 8. Rescisão
    ├── 9. Modificações
    ├── 10. Lei Aplicável
    └── Caixa de Contato (completa com WhatsApp)
```
