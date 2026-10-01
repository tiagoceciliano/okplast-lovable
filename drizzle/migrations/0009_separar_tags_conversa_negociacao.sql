ALTER TABLE public.etiquetas ADD COLUMN IF NOT EXISTS aplica_em text[] NOT NULL DEFAULT ARRAY['conversa','negociacao']::text[];
ALTER TABLE public.whatsapp_conversas ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}'::text[];
UPDATE public.whatsapp_conversas c SET tags = n.tags FROM public.negociacoes n WHERE n.id = c.negociacao_id AND coalesce(array_length(n.tags,1),0) > 0;