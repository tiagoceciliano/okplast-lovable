
-- 1. Ajusta whatsapp_numbers
ALTER TABLE public.whatsapp_numbers
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS recebe_lead boolean NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS whatsapp_numbers_user_id_idx ON public.whatsapp_numbers(user_id);

-- 2. helper: admin ou gestor?
CREATE OR REPLACE FUNCTION public.is_admin_or_gestor(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin'::public.app_role,'gestor'::public.app_role)
  )
$$;

-- 3. enum etapa
DO $$ BEGIN
  CREATE TYPE public.negociacao_etapa AS ENUM
    ('entrada','em_contato','orcamento','negociacao','ganho','perdido');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 4. role_permissions
CREATE TABLE IF NOT EXISTS public.role_permissions (
  role public.app_role NOT NULL,
  resource text NOT NULL,
  can_view boolean NOT NULL DEFAULT false,
  can_edit boolean NOT NULL DEFAULT false,
  can_delete boolean NOT NULL DEFAULT false,
  scope text NOT NULL DEFAULT 'all',
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (role, resource)
);
GRANT SELECT ON public.role_permissions TO authenticated;
GRANT ALL ON public.role_permissions TO service_role;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "perm_select" ON public.role_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "perm_ins" ON public.role_permissions FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'::public.app_role));
CREATE POLICY "perm_upd" ON public.role_permissions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(),'admin'::public.app_role));
CREATE POLICY "perm_del" ON public.role_permissions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'::public.app_role));

INSERT INTO public.role_permissions (role, resource, can_view, can_edit, can_delete, scope) VALUES
  ('admin','leads',true,true,true,'all'),
  ('admin','negociacoes',true,true,true,'all'),
  ('admin','tarefas',true,true,true,'all'),
  ('admin','comentarios',true,true,true,'all'),
  ('admin','vendedores',true,true,true,'all'),
  ('admin','dashboard',true,true,true,'all'),
  ('gestor','leads',true,true,true,'all'),
  ('gestor','negociacoes',true,true,true,'all'),
  ('gestor','tarefas',true,true,true,'all'),
  ('gestor','comentarios',true,true,true,'all'),
  ('gestor','vendedores',true,true,false,'all'),
  ('gestor','dashboard',true,false,false,'all'),
  ('vendedor','leads',true,false,false,'own'),
  ('vendedor','negociacoes',true,true,false,'own'),
  ('vendedor','tarefas',true,true,false,'own'),
  ('vendedor','comentarios',true,true,false,'own'),
  ('vendedor','vendedores',false,false,false,'all'),
  ('vendedor','dashboard',false,false,false,'all')
ON CONFLICT (role, resource) DO NOTHING;

-- 5. negociacoes
CREATE TABLE IF NOT EXISTS public.negociacoes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  nome_cliente text NOT NULL,
  telefone text,
  email text,
  etapa public.negociacao_etapa NOT NULL DEFAULT 'entrada',
  responsavel_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  valor numeric(12,2),
  produto text,
  material text,
  mensagem text,
  utm_source text, utm_medium text, utm_campaign text, utm_term text, utm_content text,
  posicao integer NOT NULL DEFAULT 0,
  tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS negociacoes_etapa_pos_idx ON public.negociacoes(etapa, posicao);
CREATE INDEX IF NOT EXISTS negociacoes_responsavel_idx ON public.negociacoes(responsavel_id);
CREATE INDEX IF NOT EXISTS negociacoes_lead_idx ON public.negociacoes(lead_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.negociacoes TO authenticated;
GRANT ALL ON public.negociacoes TO service_role;
ALTER TABLE public.negociacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "neg_sel" ON public.negociacoes FOR SELECT TO authenticated
  USING (public.is_admin_or_gestor(auth.uid()) OR responsavel_id = auth.uid());
CREATE POLICY "neg_ins" ON public.negociacoes FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_or_gestor(auth.uid()));
CREATE POLICY "neg_upd" ON public.negociacoes FOR UPDATE TO authenticated
  USING (public.is_admin_or_gestor(auth.uid()) OR responsavel_id = auth.uid())
  WITH CHECK (public.is_admin_or_gestor(auth.uid()) OR responsavel_id = auth.uid());
CREATE POLICY "neg_del" ON public.negociacoes FOR DELETE TO authenticated
  USING (public.is_admin_or_gestor(auth.uid()));
CREATE TRIGGER negociacoes_updated_at BEFORE UPDATE ON public.negociacoes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. helper acesso
CREATE OR REPLACE FUNCTION public.can_access_negociacao(_neg_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.negociacoes n
    WHERE n.id = _neg_id
      AND (public.is_admin_or_gestor(_user_id) OR n.responsavel_id = _user_id)
  )
$$;

-- 7. tarefas
CREATE TABLE IF NOT EXISTS public.negociacao_tarefas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  negociacao_id uuid NOT NULL REFERENCES public.negociacoes(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  data_vencimento timestamptz,
  concluida boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS neg_tarefas_neg_idx ON public.negociacao_tarefas(negociacao_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.negociacao_tarefas TO authenticated;
GRANT ALL ON public.negociacao_tarefas TO service_role;
ALTER TABLE public.negociacao_tarefas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tar_all" ON public.negociacao_tarefas FOR ALL TO authenticated
  USING (public.can_access_negociacao(negociacao_id, auth.uid()))
  WITH CHECK (public.can_access_negociacao(negociacao_id, auth.uid()));
CREATE TRIGGER neg_tarefas_updated_at BEFORE UPDATE ON public.negociacao_tarefas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. comentarios
CREATE TABLE IF NOT EXISTS public.negociacao_comentarios (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  negociacao_id uuid NOT NULL REFERENCES public.negociacoes(id) ON DELETE CASCADE,
  autor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  texto text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS neg_coment_neg_idx ON public.negociacao_comentarios(negociacao_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.negociacao_comentarios TO authenticated;
GRANT ALL ON public.negociacao_comentarios TO service_role;
ALTER TABLE public.negociacao_comentarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "com_all" ON public.negociacao_comentarios FOR ALL TO authenticated
  USING (public.can_access_negociacao(negociacao_id, auth.uid()))
  WITH CHECK (public.can_access_negociacao(negociacao_id, auth.uid()));

-- 9. historico
CREATE TABLE IF NOT EXISTS public.negociacao_historico (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  negociacao_id uuid NOT NULL REFERENCES public.negociacoes(id) ON DELETE CASCADE,
  autor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  tipo text NOT NULL,
  descricao text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS neg_hist_neg_idx ON public.negociacao_historico(negociacao_id);
GRANT SELECT, INSERT ON public.negociacao_historico TO authenticated;
GRANT ALL ON public.negociacao_historico TO service_role;
ALTER TABLE public.negociacao_historico ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hist_sel" ON public.negociacao_historico FOR SELECT TO authenticated
  USING (public.can_access_negociacao(negociacao_id, auth.uid()));
CREATE POLICY "hist_ins" ON public.negociacao_historico FOR INSERT TO authenticated
  WITH CHECK (public.can_access_negociacao(negociacao_id, auth.uid()));

-- 10. trigger de historico
CREATE OR REPLACE FUNCTION public.log_negociacao_changes()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.negociacao_historico(negociacao_id, autor_id, tipo, descricao)
    VALUES (NEW.id, NEW.responsavel_id, 'criada', 'Negociação criada em ' || NEW.etapa::text);
    RETURN NEW;
  END IF;
  IF NEW.etapa IS DISTINCT FROM OLD.etapa THEN
    INSERT INTO public.negociacao_historico(negociacao_id, autor_id, tipo, descricao)
    VALUES (NEW.id, auth.uid(), 'etapa', OLD.etapa::text || ' → ' || NEW.etapa::text);
  END IF;
  IF NEW.responsavel_id IS DISTINCT FROM OLD.responsavel_id THEN
    INSERT INTO public.negociacao_historico(negociacao_id, autor_id, tipo, descricao)
    VALUES (NEW.id, auth.uid(), 'responsavel', 'Responsável alterado');
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS negociacoes_log ON public.negociacoes;
CREATE TRIGGER negociacoes_log AFTER INSERT OR UPDATE ON public.negociacoes
  FOR EACH ROW EXECUTE FUNCTION public.log_negociacao_changes();

-- 11. leads: vendedor vê leads das suas negociacoes
DROP POLICY IF EXISTS "Vendedor pode ver leads das suas negociacoes" ON public.leads;
CREATE POLICY "Vendedor pode ver leads das suas negociacoes"
  ON public.leads FOR SELECT TO authenticated
  USING (
    public.is_admin_or_gestor(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.negociacoes n
      WHERE n.lead_id = leads.id AND n.responsavel_id = auth.uid()
    )
  );
