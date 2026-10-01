# Roadmap

## WhatsApp oficial (via conector Lovable — número de teste 21 92368-6452)
- [x] Tabelas whatsapp_conversas / whatsapp_mensagens
- [x] Permissões "conversas" (admin/gestor/vendedor)
- [x] Edge functions whatsapp-send e whatsapp-templates (deployadas)
- [x] Página /admin/conversas (lista + chat + nova conversa + mensagens prontas)
- [x] Chat da conversa dentro do card da negociação
- [x] Menu lateral + matriz de permissões
- [x] Receptor de mensagens (/api/public/whatsapp/webhook) — falta publicar e apontar o conector para este projeto
- [ ] Teste com o usuário: enviar mensagem pronta para o próprio celular
- [ ] Criar/aprovar templates na Meta (mensagens prontas) — aprovação pode levar até 48h

## Atendimento no padrão Kinbox
- [x] Reproduzir a disposição completa dos prints: navegação do chat, lista, cabeçalho, mensagens, ações e detalhes
- [x] Ajustar etiquetas aplicadas, seletor e gerenciamento para suportar muitas etiquetas
- [x] Manter e integrar negociação, tarefas e notas no painel lateral
- [x] Implementar atribuição e transferência de responsável no atendimento
- [x] Tornar anexo, emoji e nota interna funcionais
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
