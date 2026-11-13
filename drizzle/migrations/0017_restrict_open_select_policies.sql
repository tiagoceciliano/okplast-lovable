DROP POLICY IF EXISTS "perm_select" ON public.role_permissions;
CREATE POLICY "perm_select" ON public.role_permissions FOR SELECT TO authenticated
USING (public.is_admin_or_gestor(auth.uid()) OR public.has_role(auth.uid(), role));

DROP POLICY IF EXISTS "user_perfis read" ON public.user_perfis;
CREATE POLICY "user_perfis read" ON public.user_perfis FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_admin_or_gestor(auth.uid()));

DROP POLICY IF EXISTS "perfis read" ON public.perfis;
CREATE POLICY "perfis read" ON public.perfis FOR SELECT TO authenticated
USING (public.is_admin_or_gestor(auth.uid()) OR EXISTS (SELECT 1 FROM public.user_perfis up WHERE up.perfil_id = perfis.id AND up.user_id = auth.uid()));

DROP POLICY IF EXISTS "perfil_perm read" ON public.perfil_permissoes;
CREATE POLICY "perfil_perm read" ON public.perfil_permissoes FOR SELECT TO authenticated
USING (public.is_admin_or_gestor(auth.uid()) OR EXISTS (SELECT 1 FROM public.user_perfis up WHERE up.perfil_id = perfil_permissoes.perfil_id AND up.user_id = auth.uid()));

DROP POLICY IF EXISTS "metas_sel" ON public.metas;
CREATE POLICY "metas_sel" ON public.metas FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid()));

DROP POLICY IF EXISTS "metas_v_sel" ON public.metas_vendedores;
CREATE POLICY "metas_v_sel" ON public.metas_vendedores FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_admin_or_gestor(auth.uid()));

DROP POLICY IF EXISTS "auth read templates" ON public.whatsapp_templates;
CREATE POLICY "auth read templates" ON public.whatsapp_templates FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid()));

DROP POLICY IF EXISTS "auth read template eventos" ON public.whatsapp_template_eventos;
CREATE POLICY "auth read template eventos" ON public.whatsapp_template_eventos FOR SELECT TO authenticated
USING (public.is_admin_or_gestor(auth.uid()));