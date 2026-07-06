ALTER TABLE public.negociacoes ADD COLUMN IF NOT EXISTS destino_whatsapp text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS destino_whatsapp text;