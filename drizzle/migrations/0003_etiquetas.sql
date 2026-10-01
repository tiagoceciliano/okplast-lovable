CREATE TABLE public.etiquetas (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  nome text NOT NULL,
  cor text NOT NULL DEFAULT 'slate',
  escopo text NOT NULL DEFAULT 'todos' CHECK (escopo IN ('todos','pessoal')),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.etiquetas TO authenticated;
GRANT ALL ON public.etiquetas TO service_role;
ALTER TABLE public.etiquetas ENABLE ROW LEVEL SECURITY;
CREATE POLICY etq_sel ON public.etiquetas FOR SELECT TO authenticated
  USING (escopo = 'todos' OR owner_id = auth.uid());
CREATE POLICY etq_ins ON public.etiquetas FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY etq_upd ON public.etiquetas FOR UPDATE TO authenticated
  USING (owner_id = auth.uid() OR public.is_admin_or_gestor(auth.uid()))
  WITH CHECK (owner_id = auth.uid() OR public.is_admin_or_gestor(auth.uid()));
CREATE POLICY etq_del ON public.etiquetas FOR DELETE TO authenticated
  USING (owner_id = auth.uid() OR public.is_admin_or_gestor(auth.uid()));