
-- 1) Renomear etapa 'ganho' -> 'venda_realizada'
ALTER TYPE public.negociacao_etapa RENAME VALUE 'ganho' TO 'venda_realizada';

-- 2) Novas colunas em negociacoes
ALTER TABLE public.negociacoes
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'aberto',
  ADD COLUMN IF NOT EXISTS link_pv_bling text,
  ADD COLUMN IF NOT EXISTS nome_produto text;

ALTER TABLE public.negociacoes
  DROP CONSTRAINT IF EXISTS negociacoes_status_check;
ALTER TABLE public.negociacoes
  ADD CONSTRAINT negociacoes_status_check CHECK (status IN ('aberto','ganho','perdido'));

-- Preencher status atual conforme etapa
UPDATE public.negociacoes SET status = 'ganho' WHERE etapa = 'venda_realizada';
UPDATE public.negociacoes SET status = 'perdido' WHERE etapa = 'perdido';
UPDATE public.negociacoes SET status = 'aberto' WHERE etapa NOT IN ('venda_realizada','perdido');

-- Trigger para manter status coerente com etapa
CREATE OR REPLACE FUNCTION public.sync_negociacao_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.etapa = 'venda_realizada'::public.negociacao_etapa THEN
    NEW.status := 'ganho';
  ELSIF NEW.etapa = 'perdido'::public.negociacao_etapa THEN
    NEW.status := 'perdido';
  ELSE
    NEW.status := 'aberto';
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS negociacoes_sync_status ON public.negociacoes;
CREATE TRIGGER negociacoes_sync_status
  BEFORE INSERT OR UPDATE OF etapa ON public.negociacoes
  FOR EACH ROW EXECUTE FUNCTION public.sync_negociacao_status();

-- 3) Tabela de produtos
CREATE TABLE IF NOT EXISTS public.produtos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  preco numeric(12,2) NOT NULL DEFAULT 0,
  material text,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.produtos TO authenticated;
GRANT ALL ON public.produtos TO service_role;

ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "produtos_sel" ON public.produtos;
CREATE POLICY "produtos_sel" ON public.produtos FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "produtos_mod" ON public.produtos;
CREATE POLICY "produtos_mod" ON public.produtos FOR ALL TO authenticated
  USING (public.is_admin_or_gestor(auth.uid()))
  WITH CHECK (public.is_admin_or_gestor(auth.uid()));

DROP TRIGGER IF EXISTS produtos_updated_at ON public.produtos;
CREATE TRIGGER produtos_updated_at BEFORE UPDATE ON public.produtos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) Metas mensais
CREATE TABLE IF NOT EXISTS public.metas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mes date NOT NULL UNIQUE, -- primeiro dia do mês
  valor_total numeric(12,2) NOT NULL DEFAULT 0,
  observacao text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.metas TO authenticated;
GRANT ALL ON public.metas TO service_role;

ALTER TABLE public.metas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "metas_sel" ON public.metas;
CREATE POLICY "metas_sel" ON public.metas FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "metas_mod" ON public.metas;
CREATE POLICY "metas_mod" ON public.metas FOR ALL TO authenticated
  USING (public.is_admin_or_gestor(auth.uid()))
  WITH CHECK (public.is_admin_or_gestor(auth.uid()));

DROP TRIGGER IF EXISTS metas_updated_at ON public.metas;
CREATE TRIGGER metas_updated_at BEFORE UPDATE ON public.metas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Metas por vendedor
CREATE TABLE IF NOT EXISTS public.metas_vendedores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meta_id uuid NOT NULL REFERENCES public.metas(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  valor numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (meta_id, user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.metas_vendedores TO authenticated;
GRANT ALL ON public.metas_vendedores TO service_role;

ALTER TABLE public.metas_vendedores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "metas_v_sel" ON public.metas_vendedores;
CREATE POLICY "metas_v_sel" ON public.metas_vendedores FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "metas_v_mod" ON public.metas_vendedores;
CREATE POLICY "metas_v_mod" ON public.metas_vendedores FOR ALL TO authenticated
  USING (public.is_admin_or_gestor(auth.uid()))
  WITH CHECK (public.is_admin_or_gestor(auth.uid()));

DROP TRIGGER IF EXISTS metas_v_updated_at ON public.metas_vendedores;
CREATE TRIGGER metas_v_updated_at BEFORE UPDATE ON public.metas_vendedores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6) RPC: realizado mensal por vendedor (soma de valor das negociações com status ganho no mês)
CREATE OR REPLACE FUNCTION public.get_realizado_mensal(p_mes date)
RETURNS TABLE(user_id uuid, total numeric, qtd bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    n.responsavel_id AS user_id,
    COALESCE(SUM(n.valor),0)::numeric AS total,
    COUNT(*)::bigint AS qtd
  FROM public.negociacoes n
  WHERE n.status = 'ganho'
    AND (n.updated_at AT TIME ZONE 'America/Sao_Paulo')::date
        >= date_trunc('month', p_mes)::date
    AND (n.updated_at AT TIME ZONE 'America/Sao_Paulo')::date
        <  (date_trunc('month', p_mes) + interval '1 month')::date
  GROUP BY n.responsavel_id;
$$;
