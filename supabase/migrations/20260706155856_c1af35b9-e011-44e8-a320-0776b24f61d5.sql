
CREATE OR REPLACE FUNCTION public.get_realizado_mensal(p_mes date)
RETURNS TABLE(user_id uuid, total numeric, qtd bigint)
LANGUAGE sql
STABLE SECURITY INVOKER
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
