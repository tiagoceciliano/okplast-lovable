-- Tabela de leads para armazenar solicitações de orçamento
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  produto_interesse TEXT NOT NULL,
  mensagem TEXT,
  
  -- UTM Parameters
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  
  -- Geolocalização
  cidade TEXT,
  estado TEXT,
  pais TEXT,
  ip_address TEXT,
  
  -- Webhook status
  webhook_enviado BOOLEAN DEFAULT FALSE,
  webhook_tipo TEXT,
  
  -- Timestamp (já vem com fuso de São Paulo via edge function)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Política: Apenas inserção via edge function (service role)
-- Não permitir leitura pública, apenas via dashboard/admin
CREATE POLICY "Allow insert via service role" ON public.leads
  FOR INSERT
  WITH CHECK (true);

-- Criar índice para consultas por data
CREATE INDEX idx_leads_created_at ON public.leads (created_at DESC);

-- Criar índice para consultas por produto
CREATE INDEX idx_leads_produto ON public.leads (produto_interesse);