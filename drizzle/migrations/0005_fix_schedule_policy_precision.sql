DROP POLICY IF EXISTS wa_ag_ins ON public.whatsapp_agendamentos;
CREATE POLICY wa_ag_ins ON public.whatsapp_agendamentos FOR INSERT TO authenticated
WITH CHECK (
  autor_id = auth.uid() AND status = 'pendente' AND enviar_em > now() AND enviar_em < janela_limite
  AND EXISTS (
    SELECT 1 FROM public.whatsapp_conversas c
    WHERE c.id = whatsapp_agendamentos.conversa_id
      AND c.ultima_entrada_cliente_em IS NOT NULL
      AND abs(extract(epoch FROM (whatsapp_agendamentos.janela_limite - (c.ultima_entrada_cliente_em + interval '24 hours')))) < 2
      AND whatsapp_agendamentos.enviar_em < c.ultima_entrada_cliente_em + interval '24 hours'
      AND (public.is_admin_or_gestor(auth.uid()) OR c.responsavel_id = auth.uid())
  )
);