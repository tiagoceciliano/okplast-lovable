# Funil e negociação no padrão Kinbox

## Objetivo
Reproduzir a experiência mostrada nos prints usando os dados e permissões já existentes no CRM: funil compacto, detalhe completo da negociação e conversa aberta ao lado, sem perder o contexto do quadro.

## O que será feito

### 1. Quadro do funil
- Usar a área inteira da tela, com colunas compactas, rolagem horizontal e cabeçalhos com quantidade e valor total.
- Exibir nos cards cliente, valor, responsável, etiquetas, tarefas, comentários e conversa vinculada.
- Fazer o balão do card abrir o chat em um painel lateral; o restante do card abre o detalhe da negociação.
- Adicionar busca, filtros reais por responsável, produto, etiqueta, etapa, status e período, além das ordenações mostradas nos prints.
- Incluir corretamente a etapa “Orçamento enviado”, que já existe nos dados.

### 2. Detalhe da negociação
- Substituir o modal estreito por uma tela ampla: cabeçalho, trilha de etapas, comentário rápido, tarefas e histórico à esquerda, dados do negócio e contato à direita.
- Manter edição de valor, produto, responsável, etiquetas, telefone, e-mail, UTMs e link do Bling.
- Preservar as ações de ganho, perda e exclusão conforme as permissões atuais.

### 3. Conversa vinculada
- Quando houver conversa, oferecer “Ir para conversa” e abrir o chat lateral diretamente pelo card.
- Quando não houver, oferecer “Associar conversa” com busca entre conversas livres ou criar uma nova para o telefone cadastrado.
- Atualizar imediatamente o balão e a contagem de não lidas após o vínculo.

### 4. Janela de 24 horas e agendamento
- Mostrar um relógio regressivo atualizado no chat, indicando exatamente quanto tempo resta para mensagens livres.
- Adicionar um seletor de data e hora para agendar mensagens futuras.
- Aceitar o agendamento somente quando o horário escolhido estiver antes do fechamento da janela de 24 horas.
- Registrar estado do envio: agendada, enviando, enviada, cancelada ou falhou.
- Processar os envios vencidos em pequenos lotes, sem duplicidade, e mostrar erros de envio ao usuário.

## Detalhes técnicos
- Manter etiquetas na negociação, como fonte compartilhada entre funil e conversa.
- Criar uma fila protegida de mensagens agendadas com regras de acesso por responsável, gestor e administrador.
- Usar o envio oficial já conectado e validar novamente a janela imediatamente antes do envio.
- Reaproveitar tarefas, comentários, histórico e conversas existentes; nenhuma informação atual será removida.
- Não criar ações visuais sem funcionamento real.

## Verificação
- Conferir em conta autenticada: filtros e ordenação, movimentação entre etapas, abertura do detalhe, tarefas, comentários e histórico.
- Testar card com conversa, card sem conversa, associação existente e criação de nova conversa.
- Agendar, cancelar e acompanhar uma mensagem; confirmar o bloqueio quando o horário ultrapassar a janela.
- Comparar visualmente o quadro, o detalhe e o chat lateral com os prints em desktop.