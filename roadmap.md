# Roadmap

## Status das negociações
- [x] Confirmar ganho/perdido, permitir reabrir e oferecer ações no painel da conversa
- [x] Verificar perda e reabertura autenticadas no atendimento e no funil; ganho abre o registro de venda obrigatório

## WhatsApp oficial (via conector Lovable — número de teste 21 92368-6452)
- [x] Assinar textos, textos agendados e legendas com o nome do responsável em negrito
- [x] Corrigir gravações para voz nativa com `audio.voice: true` e testar o conteúdo enviado
- [ ] Confirmar voz nativa recebida no celular — depende de novo envio pelo usuário
- [x] Tabelas whatsapp_conversas / whatsapp_mensagens
- [x] Permissões "conversas" (admin/gestor/vendedor)
- [x] Edge functions whatsapp-send e whatsapp-templates (deployadas)
- [x] Página /admin/conversas (lista + chat + nova conversa + mensagens prontas)
- [x] Chat da conversa dentro do card da negociação
- [x] Menu lateral + matriz de permissões
- [x] Receptor de mensagens (/api/public/whatsapp/webhook) — falta publicar e apontar o conector para este projeto
- [ ] Teste com o usuário: enviar mensagem pronta para o próprio celular
- [x] Tela de criação de modelos (Configurações > Modelos de mensagem) com prévia e atualização de aprovação
- [ ] Cabeçalho com mídia nos modelos — depende de upload de amostra pela conexão
- [ ] Assinar avisos de modelos (status/categoria/qualidade) na conexão WhatsApp — usuário

## Atendimento no padrão Kinbox
- [x] Diferenciar anexos de texto com ícone azul, nome e indicação recebido/enviado; verificado na conversa Tiago
- [x] Reproduzir a disposição completa dos prints: navegação do chat, lista, cabeçalho, mensagens, ações e detalhes
- [x] Ajustar etiquetas aplicadas, seletor e gerenciamento para suportar muitas etiquetas
- [x] Manter e integrar negociação, tarefas e notas no painel lateral
- [x] Implementar atribuição e transferência de responsável no atendimento
- [x] Tornar anexo, emoji e nota interna funcionais
- [x] Exibir notas internas no topo do atendimento, com autor e exclusão só pelo criador
- [x] Mostrar só as 3 notas mais recentes, com "Ver todas" para abrir as demais

- [x] Agrupar ganhas e perdidas do painel lateral em seções recolhíveis com contador e cor; abertas sempre todas
- [x] Validar o fluxo completo em uma conta autenticada e em larguras desktop menores



## Funil e negociação no padrão Kinbox
- [x] Reproduzir o quadro compacto com busca, filtros, ordenação e totais por etapa
- [x] Abrir o chat lateral pelo balão do card sem sair do funil
- [x] Permitir associar conversa existente ou criar uma nova em cards sem conversa
- [x] Recriar o detalhe da negociação com etapas, dados, comentários, tarefas e histórico
- [x] Adicionar contador regressivo da janela de 24 horas no chat
- [x] Agendar mensagens futuras com envio bloqueado após o fechamento da janela
- [x] Validar o fluxo autenticado de funil, vínculo, chat, tarefas, comentários e agendamento

## Configurações no padrão Kinbox
- [x] Criar área compartilhada de Configurações
- [x] Implementar Membros, Tags e Grupos
- [x] Validar CRUD e apresentação autenticada
