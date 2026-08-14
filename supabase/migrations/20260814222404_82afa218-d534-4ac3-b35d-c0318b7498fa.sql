CREATE TABLE IF NOT EXISTS public.health_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text NOT NULL,
  detalhe text,
  notificado boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.health_alerts TO authenticated;
GRANT ALL ON public.health_alerts TO service_role;

ALTER TABLE public.health_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "health_alerts_sel" ON public.health_alerts
  FOR SELECT TO authenticated
  USING (public.is_admin_or_gestor(auth.uid()));

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

SELECT cron.unschedule('okplast-health-monitor')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'okplast-health-monitor');

SELECT cron.schedule(
  'okplast-health-monitor',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://osfxdoxfiyyqcpahuwci.supabase.co/functions/v1/health-monitor',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);