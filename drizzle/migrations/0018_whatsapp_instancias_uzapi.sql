CREATE TABLE public.whatsapp_instancias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  user_id uuid,
  phone_number_id text UNIQUE,
  telefone text,
  status text NOT NULL DEFAULT 'pendente',
  qr_code text,
  qr_atualizado_em timestamptz,
  webhook_token text NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),
  ultimo_erro text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.whatsapp_instancias TO authenticated;
GRANT ALL ON public.whatsapp_instancias TO service_role;
ALTER TABLE public.whatsapp_instancias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inst_select_equipe" ON public.whatsapp_instancias FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'gestor') OR public.has_role(auth.uid(),'vendedor'));
REVOKE SELECT (webhook_token) ON public.whatsapp_instancias FROM authenticated;
CREATE TRIGGER trg_inst_updated BEFORE UPDATE ON public.whatsapp_instancias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.whatsapp_conversas ADD COLUMN instancia_id uuid REFERENCES public.whatsapp_instancias(id) ON DELETE SET NULL;