
-- 1. Count leads by produto_interesse within a date range
CREATE OR REPLACE FUNCTION get_leads_count_by_period(p_start timestamptz, p_end timestamptz)
RETURNS TABLE(produtos bigint, chapas bigint, total bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    COUNT(*) FILTER (WHERE produto_interesse = 'Produto Personalizado') as produtos,
    COUNT(*) FILTER (WHERE produto_interesse = 'Chapa Inteira ou Cortada') as chapas,
    COUNT(*) as total
  FROM public.leads
  WHERE created_at >= p_start AND created_at <= p_end;
$$;

-- 2. Count unique visitors by category (chapas vs produtos) within a date range
CREATE OR REPLACE FUNCTION get_visits_count_by_period(p_start timestamptz, p_end timestamptz)
RETURNS TABLE(produtos_visits bigint, chapas_visits bigint, produtos_leads bigint, chapas_leads bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    (SELECT COUNT(DISTINCT visitor_id) FROM public.page_visits WHERE created_at >= p_start AND created_at <= p_end AND (utm_campaign IS NULL OR utm_campaign NOT LIKE '%chapas%')) as produtos_visits,
    (SELECT COUNT(DISTINCT visitor_id) FROM public.page_visits WHERE created_at >= p_start AND created_at <= p_end AND utm_campaign LIKE '%chapas%') as chapas_visits,
    (SELECT COUNT(*) FROM public.leads WHERE created_at >= p_start AND created_at <= p_end AND (utm_campaign IS NULL OR utm_campaign NOT LIKE '%chapas%')) as produtos_leads,
    (SELECT COUNT(*) FROM public.leads WHERE created_at >= p_start AND created_at <= p_end AND utm_campaign LIKE '%chapas%') as chapas_leads;
$$;

-- 3. Get general metrics for a date range
CREATE OR REPLACE FUNCTION get_general_metrics(p_start timestamptz, p_end timestamptz)
RETURNS TABLE(total_visits bigint, total_leads bigint, unique_visitors bigint, unique_sessions bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    (SELECT COUNT(*) FROM public.page_visits WHERE created_at >= p_start AND created_at <= p_end) as total_visits,
    (SELECT COUNT(*) FROM public.leads WHERE created_at >= p_start AND created_at <= p_end) as total_leads,
    (SELECT COUNT(DISTINCT visitor_id) FROM public.page_visits WHERE created_at >= p_start AND created_at <= p_end) as unique_visitors,
    (SELECT COUNT(DISTINCT session_id) FROM public.page_visits WHERE created_at >= p_start AND created_at <= p_end) as unique_sessions;
$$;

-- 4. Get top pages by visit count
CREATE OR REPLACE FUNCTION get_top_pages(p_start timestamptz, p_end timestamptz, p_limit int DEFAULT 5)
RETURNS TABLE(page_path text, visit_count bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT page_path, COUNT(*) as visit_count
  FROM public.page_visits
  WHERE created_at >= p_start AND created_at <= p_end
  GROUP BY page_path
  ORDER BY visit_count DESC
  LIMIT p_limit;
$$;

-- 5. Get traffic sources based on leads
CREATE OR REPLACE FUNCTION get_traffic_sources(p_start timestamptz, p_end timestamptz)
RETURNS TABLE(source text, lead_count bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT COALESCE(utm_source, 'Direto') as source, COUNT(*) as lead_count
  FROM public.leads
  WHERE created_at >= p_start AND created_at <= p_end
  GROUP BY COALESCE(utm_source, 'Direto')
  ORDER BY lead_count DESC;
$$;

-- 6. Get leads by product
CREATE OR REPLACE FUNCTION get_leads_by_product(p_start timestamptz, p_end timestamptz)
RETURNS TABLE(product text, lead_count bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT produto_interesse as product, COUNT(*) as lead_count
  FROM public.leads
  WHERE created_at >= p_start AND created_at <= p_end
  GROUP BY produto_interesse
  ORDER BY lead_count DESC;
$$;

-- 7. Get leads by location
CREATE OR REPLACE FUNCTION get_leads_by_location(p_start timestamptz, p_end timestamptz, p_limit int DEFAULT 5)
RETURNS TABLE(location text, lead_count bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    CASE 
      WHEN cidade IS NOT NULL AND estado IS NOT NULL THEN cidade || ', ' || estado
      WHEN estado IS NOT NULL THEN estado
      ELSE 'Desconhecido'
    END as location,
    COUNT(*) as lead_count
  FROM public.leads
  WHERE created_at >= p_start AND created_at <= p_end
  GROUP BY location
  ORDER BY lead_count DESC
  LIMIT p_limit;
$$;

-- 8. Get campaign stats (only campaigns with leads)
CREATE OR REPLACE FUNCTION get_campaign_stats(p_start timestamptz, p_end timestamptz)
RETURNS TABLE(campaign text, visits bigint, leads bigint, conversion_rate numeric)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  WITH campaign_leads AS (
    SELECT COALESCE(utm_campaign, '(Direto)') as campaign, COUNT(*) as lead_count
    FROM public.leads
    WHERE created_at >= p_start AND created_at <= p_end
    GROUP BY COALESCE(utm_campaign, '(Direto)')
  ),
  campaign_visitors AS (
    SELECT COALESCE(utm_campaign, '(Direto)') as campaign, COUNT(DISTINCT visitor_id) as unique_visitors
    FROM public.page_visits
    WHERE created_at >= p_start AND created_at <= p_end
    AND COALESCE(utm_campaign, '(Direto)') IN (SELECT campaign FROM campaign_leads)
    GROUP BY COALESCE(utm_campaign, '(Direto)')
  )
  SELECT 
    cl.campaign,
    COALESCE(cv.unique_visitors, 0) as visits,
    cl.lead_count as leads,
    CASE WHEN COALESCE(cv.unique_visitors, 0) > 0 
      THEN ROUND((cl.lead_count::numeric / cv.unique_visitors) * 100, 2)
      ELSE 0
    END as conversion_rate
  FROM campaign_leads cl
  LEFT JOIN campaign_visitors cv ON cl.campaign = cv.campaign
  ORDER BY cl.lead_count DESC;
$$;

-- 9. Get term stats (only terms with leads)
CREATE OR REPLACE FUNCTION get_term_stats(p_start timestamptz, p_end timestamptz)
RETURNS TABLE(term text, campaign text, visits bigint, leads bigint, conversion_rate numeric)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  WITH term_leads AS (
    SELECT 
      COALESCE(utm_term, '(Sem termo)') as term,
      COALESCE(utm_campaign, '(Direto)') as campaign,
      COUNT(*) as lead_count
    FROM public.leads
    WHERE created_at >= p_start AND created_at <= p_end
    GROUP BY COALESCE(utm_term, '(Sem termo)'), COALESCE(utm_campaign, '(Direto)')
  ),
  term_visitors AS (
    SELECT 
      COALESCE(utm_term, '(Sem termo)') as term,
      COALESCE(utm_campaign, '(Direto)') as campaign,
      COUNT(DISTINCT visitor_id) as unique_visitors
    FROM public.page_visits
    WHERE created_at >= p_start AND created_at <= p_end
    GROUP BY COALESCE(utm_term, '(Sem termo)'), COALESCE(utm_campaign, '(Direto)')
  )
  SELECT 
    tl.term,
    tl.campaign,
    COALESCE(tv.unique_visitors, 0) as visits,
    tl.lead_count as leads,
    CASE WHEN COALESCE(tv.unique_visitors, 0) > 0 
      THEN ROUND((tl.lead_count::numeric / tv.unique_visitors) * 100, 2)
      ELSE 0
    END as conversion_rate
  FROM term_leads tl
  LEFT JOIN term_visitors tv ON tl.term = tv.term AND tl.campaign = tv.campaign
  ORDER BY tl.lead_count DESC;
$$;

-- 10. Get daily visits for chart (last N days)
CREATE OR REPLACE FUNCTION get_daily_visits(p_start timestamptz, p_end timestamptz)
RETURNS TABLE(visit_date date, visit_count bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    (created_at AT TIME ZONE 'America/Sao_Paulo')::date as visit_date,
    COUNT(*) as visit_count
  FROM public.page_visits
  WHERE created_at >= p_start AND created_at <= p_end
  GROUP BY visit_date
  ORDER BY visit_date;
$$;
