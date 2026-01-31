-- Criar bucket público para imagens do site
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true);

-- Permitir leitura pública
CREATE POLICY "Imagens publicas para leitura"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');

-- Permitir upload via service role (edge function)
CREATE POLICY "Upload via service role"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'site-images');