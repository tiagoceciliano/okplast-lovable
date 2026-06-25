
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.page_visits;

CREATE POLICY "Anon can insert page visits with valid payload"
ON public.page_visits
FOR INSERT
TO anon, authenticated
WITH CHECK (
  visitor_id IS NOT NULL AND length(visitor_id) BETWEEN 1 AND 128
  AND session_id IS NOT NULL AND length(session_id) BETWEEN 1 AND 128
  AND page_url IS NOT NULL AND length(page_url) BETWEEN 1 AND 2048
  AND page_path IS NOT NULL AND length(page_path) BETWEEN 1 AND 1024
);
