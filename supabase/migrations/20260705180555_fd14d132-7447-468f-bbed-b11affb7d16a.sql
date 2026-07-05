
REVOKE EXECUTE ON FUNCTION public.is_admin_or_gestor(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.can_access_negociacao(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.log_negociacao_changes() FROM PUBLIC, anon, authenticated;
