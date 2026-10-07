DROP POLICY "com_all" ON public.negociacao_comentarios;
CREATE POLICY "com_select" ON public.negociacao_comentarios FOR SELECT TO authenticated
  USING (public.can_access_negociacao(negociacao_id, auth.uid()));
CREATE POLICY "com_insert" ON public.negociacao_comentarios FOR INSERT TO authenticated
  WITH CHECK (public.can_access_negociacao(negociacao_id, auth.uid()));
CREATE POLICY "com_update" ON public.negociacao_comentarios FOR UPDATE TO authenticated
  USING (autor_id = auth.uid()) WITH CHECK (autor_id = auth.uid());
CREATE POLICY "com_delete" ON public.negociacao_comentarios FOR DELETE TO authenticated
  USING (autor_id = auth.uid());