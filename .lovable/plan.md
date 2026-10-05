# Criar e gerenciar modelos (templates) do WhatsApp dentro do sistema

Objetivo: criar, enviar para análise, acompanhar a aprovação e gerenciar os modelos sem abrir o Gerenciador do WhatsApp da Meta, com as mesmas telas e opções dos prints.

## Onde fica
Nova tela em **Configurações > Modelos de mensagem** (ao lado de Membros, Tags e Grupos). Acesso: admin e gestor.

## Layout (igual ao da Meta)
- Topo com as etapas: Configurar modelo > Editar modelo > Enviar para análise, marcando a etapa atual e as concluídas.
- Formulário no centro, em blocos brancos, como nos prints.
- **À direita, fixa, a "Prévia do modelo"**: a mensagem montada no visual do WhatsApp (fundo bege, balão branco, imagem/vídeo/documento no topo, cabeçalho em negrito, corpo com negrito/itálico aplicados, rodapé cinza, horário e botões embaixo do balão). Atualiza a cada letra digitada.
- Abaixo da prévia: "Este modelo é ideal para" e "Áreas que você pode personalizar".
- Barra inferior fixa com Descartar/Voltar à esquerda e Avançar/Enviar para análise à direita.

## 1. Lista de modelos
- Tabela com nome, categoria (Marketing, Utilidade, Autenticação), idioma, situação (Aprovado, Em análise, Rejeitado, Pausado, Desativado) e data da última mudança.
- Filtros por situação e categoria, busca por nome.
- Ações: **Criar modelo**, editar (quando a Meta permitir), duplicar e excluir.
- Motivo da rejeição aparece ao passar o mouse.
- Aviso quando a Meta muda a categoria (por exemplo, de Utilidade para Marketing), com a categoria antiga e a nova.

## 2. Criar modelo — passo 1 "Configurar modelo"
Igual aos prints: três abas (Marketing, Utilidade, Autenticação) e as opções de cada uma.
- Marketing: Padrão, Catálogo, Flows, Detalhes do pedido, Solicitação de permissão para ligação.
- Utilidade: Padrão, Flows, Status do pedido, Detalhes do pedido, Solicitação de permissão para ligação.
- Autenticação: Código de acesso de uso único.
- À direita: prévia de exemplo, "Este modelo é ideal para" e "Áreas que você pode personalizar".
- Na primeira versão, só a opção **Padrão** (e o código de uso único) fica liberada. As outras aparecem como "em breve", porque dependem de catálogo, flows ou pagamentos que a OK Plast ainda não usa.
- Rodapé com **Descartar** e **Avançar**.

## 3. Criar modelo — passo 2 "Editar modelo"
- **Nome e idioma**: nome com contador (0/512), convertido automaticamente para o formato aceito pela Meta (minúsculas e sublinhado). Idioma padrão Português (Brasil).
- **Tipo de variável**: Nome ou Número.
- **Amostra de mídia**: Nenhum, Imagem, Vídeo, Documento ou Localização. Com mídia, aparece o botão para subir um arquivo de exemplo.
- **Cabeçalho** (opcional, 0/60) com "Adicionar variável".
- **Corpo** (0/1024) com emoji, negrito, itálico, tachado, código e "Adicionar variável". Para cada variável, um campo de exemplo obrigatório (a Meta exige).
- **Rodapé** (opcional, 0/60).
- **Botões** (até 10; com mais de 3 vira lista): Personalizado (resposta rápida), Acessar o site, Ligar no WhatsApp, Ligar, Concluir flow, Pedir pagamento, Compartilhar contato. Os que dependem de recursos não usados ficam como "em breve".
- **Período de validade** (Utilidade e Autenticação): chave liga/desliga e tempo.
- **Prévia ao vivo** à direita, no visual do WhatsApp, atualizando a cada letra.
- Rodapé: **Voltar** e **Enviar para análise** (só habilita quando tudo está válido).

## 4. Passo 3 "Enviar para análise"
- Envia para a Meta e mostra o resultado: em análise, aprovado na hora ou erro, com a explicação em português.

## 5. Atualização automática da aprovação
- O sistema já recebe avisos da Meta para as mensagens. Vamos passar a receber também:
  - mudança de situação do modelo (aprovado, rejeitado, pausado, desativado);
  - mudança de categoria feita pela Meta (Utilidade para Marketing e vice-versa);
  - mudança de qualidade do modelo.
- A lista se atualiza sozinha e guarda um histórico de cada mudança.
- Botão **Sincronizar com a Meta** para buscar tudo de novo, caso algum aviso se perca.
- Você precisa marcar esses avisos uma vez na conexão do WhatsApp (eu explico o passo a passo na hora).

## 6. Uso no chat
- O botão "Enviar template" das Conversas passa a usar essa lista, mostrando só os aprovados, com campos para preencher as variáveis e a mídia do cabeçalho antes de enviar.

## Detalhes técnicos
- Nova tabela `whatsapp_templates` (cópia local: meta_id, nome, idioma, categoria, sub_tipo, status, motivo de rejeição, qualidade, componentes em JSON, timestamps) e `whatsapp_template_eventos` (histórico de status e categoria). GRANT + RLS: leitura para autenticados, escrita apenas pelo servidor.
- Server functions autenticadas (admin/gestor) via gateway do WhatsApp: listar/sincronizar (`GET /{waba_id}/message_templates`), criar (`POST /{waba_id}/message_templates`), editar (`POST /{template_id}`), excluir (`DELETE /{waba_id}/message_templates?name=`).
- Amostra de mídia do cabeçalho: upload resumível da Meta para obter o `header_handle`. Primeiro passo da implementação é confirmar se a conexão permite esse upload; se não permitir, os cabeçalhos com mídia ficam bloqueados com aviso, e o resto segue.
- Webhook existente (`/api/public/whatsapp/webhook`) passa a tratar `message_template_status_update`, `template_category_update` e `message_template_quality_update`, atualizando a tabela e registrando o evento.
- Validações locais antes de enviar: nome único por idioma, limites de caracteres, variáveis em sequência `{{1}}, {{2}}`, exemplos preenchidos, regras de botões por tipo.
- Envio de template no chat passa a ler da tabela local e montar `components` com parâmetros do cabeçalho, corpo e botões.
