# Okplast

CONTEXTO
Estou migrando um site existente do WordPress (antiga marca “Acrilzano”) para um novo projeto com a marca “Lab Acrílicos”, recriando a estrutura de páginas de forma idêntica no Lovable.
Use como fonte de verdade os documentos em Custom knowledge:
1) “SITEMAP HIERÁRQUICO E ESTRUTURA DE NAVEGAÇÃO - LAB ACRÍLICOS” (arquitetura/URLs)
2) “DOSSIÊ DE CONTEÚDO INTEGRAL (COPY) - LAB ACRÍLICOS” (textos e seções por página)
3) “Guia Técnico Avançado: Lab Acrílicos” (webhooks, UTMs, geolocalização, WhatsApp e validações)

DADOS DA NOVA MARCA (substituições)
- Nome: Lab Acrílicos
- Domínio final: https://labacrilicos.com.br 
- Logo: (vou subir o arquivo na conversa ou no projeto)
- Endereço(s): Rua Cordovil 259 – Cordovil – Rio de Janeiro – RJ
- Telefone: (21) 3372-3797
- WhatsApp: 21 92367-0633
- E-mail: vendas@labacrilicos.com.br

TAREFA
1) Criar um website institucional + catálogo de produtos no Lovable, replicando a estrutura de navegação e as URLs (slugs) exatamente como no sitemap.
2) Preencher cada página com o copy integral correspondente do dossiê, mantendo tom e estrutura.
3) Implementar os comportamentos técnicos do guia: formulário de orçamento, envio para webhooks Kinbox com UTMs+geo+timestamp, e botão flutuante do WhatsApp com máscara e mensagem personalizada.
4) Garantir responsividade e bom SEO (titles/metadata básicos por página).

DIRETRIZES (EXECUÇÃO)
A) ROTAS / PÁGINAS / MENUS
- Crie todas as páginas listadas no sitemap e mantenha as URLs relativas exatamente iguais (incluindo /home/... e as páginas de produtos).
- Replique o menu de navegação com a mesma hierarquia (Home, Institucional e Políticas, Produtos e suas categorias).

B) CONTEÚDO (COPY)
- Para cada página, use o texto do dossiê como a única fonte de verdade.
- Substitua sistematicamente “Acrilzano” por “Lab Acrílicos”.
- Troque somente o que é da marca (nome, logo, URLs, endereço, telefone, WhatsApp, e-mail), sem reescrever o conteúdo desnecessariamente.
- A Home deve conter as seções citadas no dossiê (motivos, satisfação, produtos sob medida, chapas e pedaços etc.) com CTAs claros para Orçamento e Produtos.

C) CATÁLOGO DE PRODUTOS (SEM E-COMMERCE)
- As páginas de produto devem ser páginas de conteúdo (SEO), com: título, descrição, benefícios/diferenciais, variações quando aplicável e CTA “Solicitar orçamento”.
- Crie páginas “hub/categoria” e páginas de detalhe conforme o sitemap.

D) FORMULÁRIO DE ORÇAMENTO + WEBHOOKS (KINBOX)
- Recrie a página /home/orcamento/ com formulário e validação.
Campos mínimos (conforme dossiê): Nome*, Email*, Telefone*, Produto de Interesse (opções do dossiê), Mensagem.
- Implementar captura e envio no payload:
  * UTMs: utm_source, utm_medium, utm_campaign, utm_term, utm_content
  * Geolocalização: cidade, estado, país via ipapi.co
  * Timestamp com fuso São Paulo
  * Dados do lead: nome, e-mail, telefone, mensagem, produto_de_interesse
- Implementar 2 destinos de webhook Kinbox conforme guia técnico:
  * “Webhook Chapas”: (usar a URL do guia técnico; se estiver mascarada/incompleta, deixe variável WEBHOOK_CHAPAS para eu preencher)
  * “Webhook Geral”: (usar a URL do guia técnico; se estiver mascarada/incompleta, deixe variável WEBHOOK_GERAL para eu preencher)
- Regra de roteamento:
  * Se o contexto/categoria/termo de busca for “Chapas e Pedaços de Placas” ou se produto_de_interesse indicar “Chapas”, use WEBHOOK_CHAPAS.
  * Caso contrário, use WEBHOOK_GERAL.
- Implementação:
  * Crie uma Edge Function para processar o envio do lead (validação, enriquecimento com UTMs/geo/timestamp e POST no webhook correto).
  * Opcional mas recomendado: salvar o lead em uma tabela “leads” no banco (para auditoria e troubleshooting), com colunas para todos os campos + utms + geo + created_at.

E) BOTÃO FLUTUANTE DO WHATSAPP (LÓGICA)
- Recrie o botão flutuante em todas as páginas.
- Ele deve:
  * aplicar máscara de telefone (XX) XXXXX-XXXX no input quando houver
  * capitalizar a primeira letra do nome
  * gerar mensagem personalizada com dados do formulário (nome, telefone, email, produto/assunto, mensagem)
  * abrir a URL do WhatsApp com texto codificado (encodeURIComponent)
  * usar o número de destino atualizado da Lab Acrílicos (deixar como variável WHATSAPP_PHONE para eu preencher)
- O CTA da Home e das páginas de produto deve facilitar contato pelo WhatsApp e levar também para /home/orcamento/.

F) QUALIDADE / RESPONSIVIDADE / TESTE
- Layout responsivo (mobile-first) e visual profissional.
- Não usar bibliotecas externas desnecessárias; manter stack padrão do Lovable.
- Após implementar, rode browser testing para verificar:
  1) Navegação do menu e rotas principais
  2) Página /home/orcamento/ (validação e envio)
  3) Botão flutuante do WhatsApp (abre link correto)
- Corrija qualquer erro encontrado nos testes.

RESTRIÇÕES
- Não inventar novas páginas fora do sitemap.
- Não alterar slugs/URLs do sitemap.
- Não reescrever o copy: usar o dossiê literalmente (apenas substituições de marca/contato).
- Se alguma informação estiver faltando (logo, números, webhooks mascarados), usar placeholders claros (LOGO_URL, WHATSAPP_PHONE, WEBHOOK_CHAPAS, WEBHOOK_GERAL, ENDERECOS, EMAIL) para eu preencher depois.

ESTUDE TODOS OS ANEXOS DETALHADAMENTE, MINUCIOSAMENTE LINHA POR LINHA.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://okplast.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bbec6f29-5b53-4452-83f6-3d94da979fd6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
