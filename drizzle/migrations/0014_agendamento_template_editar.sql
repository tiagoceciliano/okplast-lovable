ALTER TABLE public.whatsapp_agendamentos
  ADD COLUMN IF NOT EXISTS tipo text NOT NULL DEFAULT 'texto' CHECK (tipo IN ('texto','template')),
  ADD COLUMN IF NOT EXISTS template jsonb;

DROP POLICY IF EXISTS wa_ag_ins ON public.whatsapp_agendamentos;
CREATE POLICY wa_ag_ins ON public.whatsapp_agendamentos FOR INSERT TO authenticated
WITH CHECK (
  autor_id = auth.uid() AND status = 'pendente' AND enviar_em > now()
  AND (tipo = 'texto' OR template IS NOT NULL)
  AND EXISTS (SELECT 1 FROM public.whatsapp_conversas c WHERE c.id = conversa_id
    AND (public.is_admin_or_gestor(auth.uid()) OR c.responsavel_id = auth.uid()))
);

CREATE OR REPLACE FUNCTION public.update_whatsapp_agendamento(_id uuid, _texto text, _enviar_em timestamptz, _template jsonb)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE changed integer;
BEGIN
  IF _enviar_em <= now() THEN RAISE EXCEPTION 'Escolha um horário futuro.'; END IF;
  UPDATE public.whatsapp_agendamentos a
  SET texto = _texto, enviar_em = _enviar_em,
      template = CASE WHEN a.tipo = 'template' THEN COALESCE(_template, a.template) ELSE NULL END,
      erro = NULL, tentativas = 0, proxima_tentativa_em = NULL, status = 'pendente', updated_at = now()
  WHERE a.id = _id AND a.status IN ('pendente','falhou')
    AND EXISTS (SELECT 1 FROM public.whatsapp_conversas c WHERE c.id = a.conversa_id
      AND (public.is_admin_or_gestor(auth.uid()) OR c.responsavel_id = auth.uid()));
  GET DIAGNOSTICS changed = ROW_COUNT;
  RETURN changed > 0;
END; $$;
REVOKE ALL ON FUNCTION public.update_whatsapp_agendamento(uuid,text,timestamptz,jsonb) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.update_whatsapp_agendamento(uuid,text,timestamptz,jsonb) TO authenticated;