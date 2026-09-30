# Roadmap

## Em andamento
- [ ] WhatsApp oficial direto na Meta (número novo de teste)
  - [x] Tabelas whatsapp_conversas / whatsapp_mensagens (migration aplicada)
  - [x] Edge function whatsapp-webhook (verificação GET + recebimento POST com assinatura, distribuição por peso, criação de negociação)
  - [ ] Bloqueio: conta de desenvolvedor da Meta suspensa — sem ela não há App Secret, token e webhook
  - [ ] Após desbloqueio: usuário salva 5 segredos (formulário add_secret) e configura webhook na Meta
  - [ ] Caixa de conversas no admin (/admin/conversas)
  - [ ] Envio de mensagens (edge function whatsapp-send) + janela 24h
  - [ ] Conversa dentro do card da negociação
  - [ ] Mensagens prontas (templates Meta)
