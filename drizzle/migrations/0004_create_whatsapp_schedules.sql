CREATE TABLE public.whatsapp_agendamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversa_id uuid NOT NULL REFERENCES public.whatsapp_conversas(id) ON DELETE CASCADE,
  autor_id uuid NOT NULL,
  texto text NOT NULL,
  enviar_em timestamptz NOT NULL,
  janela_limite timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pendente',
  tentativas integer NOT NULL DEFAULT 0,
  proxima_tentativa_em timestamptz,
  erro text,
  mensagem_id uuid REFERENCES public.whatsapp_mensagens(id) ON DELETE SET NULL,
  enviado_em timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT whatsapp_agendamentos_status_check CHECK (status IN ('pendente','processando','enviado','cancelado','falhou')),
  CONSTRAINT whatsapp_agendamentos_texto_check CHECK (char_length(texto) BETWEEN 1 AND 4096)
);
GRANT SELECT, INSERT ON public.whatsapp_agendamentos TO authenticated;
GRANT ALL ON public.whatsapp_agendamentos TO service_role;
ALTER TABLE public.whatsapp_agendamentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY wa_ag_sel ON public.whatsapp_agendamentos FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.whatsapp_conversas c
  WHERE c.id = conversa_id
    AND (public.is_admin_or_gestor(auth.uid()) OR c.responsavel_id = auth.uid())
));
CREATE POLICY wa_ag_ins ON public.whatsapp_agendamentos FOR INSERT TO authenticated
WITH CHECK (
  autor_id = auth.uid()
  AND status = 'pendente'
  AND enviar_em > now()
  AND enviar_em < janela_limite
  AND EXISTS (
    SELECT 1 FROM public.whatsapp_conversas c
    WHERE c.id = conversa_id
      AND c.ultima_entrada_cliente_em IS NOT NULL
      AND janela_limite = c.ultima_entrada_cliente_em + interval '24 hours'
      AND enviar_em < c.ultima_entrada_cliente_em + interval '24 hours'
      AND (public.is_admin_or_gestor(auth.uid()) OR c.responsavel_id = auth.uid())
  )
);
CREATE INDEX whatsapp_agendamentos_due_idx ON public.whatsapp_agendamentos (enviar_em)
WHERE status = 'pendente';
CREATE INDEX whatsapp_agendamentos_conversa_idx ON public.whatsapp_agendamentos (conversa_id, created_at DESC);
CREATE TRIGGER whatsapp_agendamentos_updated_at BEFORE UPDATE ON public.whatsapp_agendamentos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.cancel_whatsapp_agendamento(_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  changed integer;
BEGIN
  UPDATE public.whatsapp_agendamentos a
  SET status = 'cancelado', erro = NULL
  WHERE a.id = _id
    AND a.status = 'pendente'
    AND EXISTS (
      SELECT 1 FROM public.whatsapp_conversas c
      WHERE c.id = a.conversa_id
        AND (public.is_admin_or_gestor(auth.uid()) OR c.responsavel_id = auth.uid())
    );
  GET DIAGNOSTICS changed = ROW_COUNT;
  RETURN changed > 0;
END;
$$;
GRANT EXECUTE ON FUNCTION public.cancel_whatsapp_agendamento(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.claim_due_whatsapp_agendamentos(_limit integer DEFAULT 10)
RETURNS SETOF public.whatsapp_agendamentos
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.whatsapp_agendamentos a
  SET status = 'processando', tentativas = tentativas + 1
  WHERE a.id IN (
    SELECT q.id
    FROM public.whatsapp_agendamentos q
    WHERE q.status = 'pendente'
      AND q.enviar_em <= now()
      AND (q.proxima_tentativa_em IS NULL OR q.proxima_tentativa_em <= now())
    ORDER BY q.enviar_em
    FOR UPDATE SKIP LOCKED
    LIMIT LEAST(GREATEST(_limit, 1), 10)
  )
  RETURNING a.*;
$$;
REVOKE ALL ON FUNCTION public.claim_due_whatsapp_agendamentos(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_due_whatsapp_agendamentos(integer) TO service_role;