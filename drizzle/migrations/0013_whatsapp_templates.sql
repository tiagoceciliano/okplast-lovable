CREATE TABLE public.whatsapp_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meta_id text UNIQUE,
  nome text NOT NULL,
  idioma text NOT NULL DEFAULT 'pt_BR',
  categoria text NOT NULL,
  categoria_anterior text,
  sub_tipo text NOT NULL DEFAULT 'padrao',
  status text NOT NULL DEFAULT 'PENDING',
  motivo text,
  qualidade text,
  componentes jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (nome, idioma)
);
GRANT SELECT ON public.whatsapp_templates TO authenticated;
GRANT ALL ON public.whatsapp_templates TO service_role;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read templates" ON public.whatsapp_templates FOR SELECT TO authenticated USING (true);
CREATE TRIGGER whatsapp_templates_updated_at BEFORE UPDATE ON public.whatsapp_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.whatsapp_template_eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES public.whatsapp_templates(id) ON DELETE CASCADE,
  tipo text NOT NULL,
  descricao text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.whatsapp_template_eventos TO authenticated;
GRANT ALL ON public.whatsapp_template_eventos TO service_role;
ALTER TABLE public.whatsapp_template_eventos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read template eventos" ON public.whatsapp_template_eventos FOR SELECT TO authenticated USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_templates;