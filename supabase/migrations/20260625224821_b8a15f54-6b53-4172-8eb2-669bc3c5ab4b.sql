
-- 1) Leads: restringir INSERT (remover policy aberta ao 'public')
DROP POLICY IF EXISTS "Allow insert via service role" ON public.leads;
-- service_role bypassa RLS; edge function process-lead já usa service role.
-- Não criamos policy permissiva. Nenhum anon/authenticated pode inserir direto.

-- 2) Storage site-images: remover INSERT aberto ao 'public'
DROP POLICY IF EXISTS "Upload via service role" ON storage.objects;
-- Uploads continuam funcionando via edge function com service role (bypassa RLS).

-- 3) Storage site-images: remover SELECT policy (bucket público serve via CDN; policy permite listagem)
DROP POLICY IF EXISTS "Imagens publicas para leitura" ON storage.objects;
-- Arquivos continuam acessíveis pela URL pública do bucket; listagem via API fica bloqueada.

-- 4) SECURITY DEFINER functions: revogar EXECUTE de anon/authenticated/public
REVOKE EXECUTE ON FUNCTION public.get_leads_count_by_period(timestamptz, timestamptz) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_daily_visits(timestamptz, timestamptz) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_leads_by_product(timestamptz, timestamptz) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_top_pages(timestamptz, timestamptz, integer) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_general_metrics(timestamptz, timestamptz) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_leads_by_location(timestamptz, timestamptz, integer) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_visits_count_by_period(timestamptz, timestamptz) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_campaign_stats(timestamptz, timestamptz) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_term_stats(timestamptz, timestamptz) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_traffic_sources(timestamptz, timestamptz) FROM anon, authenticated, PUBLIC;

-- Garantir que service_role mantém acesso
GRANT EXECUTE ON FUNCTION public.get_leads_count_by_period(timestamptz, timestamptz) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_daily_visits(timestamptz, timestamptz) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_leads_by_product(timestamptz, timestamptz) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_top_pages(timestamptz, timestamptz, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_general_metrics(timestamptz, timestamptz) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_leads_by_location(timestamptz, timestamptz, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_visits_count_by_period(timestamptz, timestamptz) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_campaign_stats(timestamptz, timestamptz) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_term_stats(timestamptz, timestamptz) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_traffic_sources(timestamptz, timestamptz) TO service_role;

-- has_role é usado em policies RLS no contexto do usuário autenticado: manter acesso
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;
