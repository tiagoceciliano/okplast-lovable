INSERT INTO public.role_permissions (role, resource, can_view, can_edit, can_delete, scope) VALUES
  ('admin', 'conversas', true, true, true, 'all'),
  ('gestor', 'conversas', true, true, false, 'all'),
  ('vendedor', 'conversas', true, true, false, 'own')
ON CONFLICT (role, resource) DO NOTHING;