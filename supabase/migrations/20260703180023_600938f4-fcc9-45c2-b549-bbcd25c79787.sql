
CREATE TABLE public.whatsapp_numbers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_vendedor TEXT NOT NULL,
  numero_raw TEXT NOT NULL UNIQUE,
  numero_formatado TEXT NOT NULL,
  peso INTEGER NOT NULL DEFAULT 50 CHECK (peso >= 0 AND peso <= 100),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.whatsapp_numbers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.whatsapp_numbers TO authenticated;
GRANT ALL ON public.whatsapp_numbers TO service_role;

ALTER TABLE public.whatsapp_numbers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active whatsapp numbers"
  ON public.whatsapp_numbers FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert whatsapp numbers"
  ON public.whatsapp_numbers FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update whatsapp numbers"
  ON public.whatsapp_numbers FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete whatsapp numbers"
  ON public.whatsapp_numbers FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_whatsapp_numbers_updated_at
  BEFORE UPDATE ON public.whatsapp_numbers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.whatsapp_numbers (nome_vendedor, numero_raw, numero_formatado, peso, ativo) VALUES
  ('Vendedor 1', '5521935058539', '(21) 93505-8539', 50, true),
  ('Vendedor 2', '5521936181457', '(21) 93618-1457', 50, true);
