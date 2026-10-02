CREATE TABLE public.perfis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  base_role public.app_role NOT NULL DEFAULT 'vendedor',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.perfis TO authenticated;
GRANT ALL ON public.perfis TO service_role;
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "perfis read" ON public.perfis FOR SELECT TO authenticated USING (true);
CREATE POLICY "perfis admin" ON public.perfis FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.perfil_permissoes (
  perfil_id uuid NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
  resource text NOT NULL,
  can_view boolean NOT NULL DEFAULT false,
  can_edit boolean NOT NULL DEFAULT false,
  can_delete boolean NOT NULL DEFAULT false,
  scope text NOT NULL DEFAULT 'own',
  PRIMARY KEY (perfil_id, resource)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.perfil_permissoes TO authenticated;
GRANT ALL ON public.perfil_permissoes TO service_role;
ALTER TABLE public.perfil_permissoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "perfil_perm read" ON public.perfil_permissoes FOR SELECT TO authenticated USING (true);
CREATE POLICY "perfil_perm admin" ON public.perfil_permissoes FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.user_perfis (
  user_id uuid PRIMARY KEY,
  perfil_id uuid NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_perfis TO authenticated;
GRANT ALL ON public.user_perfis TO service_role;
ALTER TABLE public.user_perfis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_perfis read" ON public.user_perfis FOR SELECT TO authenticated USING (true);
CREATE POLICY "user_perfis admin" ON public.user_perfis FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));