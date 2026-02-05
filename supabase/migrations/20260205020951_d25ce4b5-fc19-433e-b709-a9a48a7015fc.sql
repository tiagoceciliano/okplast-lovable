-- Tabela para rastrear visitas do site
CREATE TABLE public.page_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  page_path TEXT NOT NULL,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  user_agent TEXT,
  ip_address TEXT,
  cidade TEXT,
  estado TEXT,
  pais TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- Policy para permitir insert sem autenticação (visitantes anônimos)
CREATE POLICY "Allow anonymous insert"
ON public.page_visits
FOR INSERT
TO anon
WITH CHECK (true);

-- Criar índices para queries de análise
CREATE INDEX idx_page_visits_created_at ON public.page_visits(created_at DESC);
CREATE INDEX idx_page_visits_utm_campaign ON public.page_visits(utm_campaign);
CREATE INDEX idx_page_visits_visitor_id ON public.page_visits(visitor_id);
CREATE INDEX idx_page_visits_session_id ON public.page_visits(session_id);