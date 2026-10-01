CREATE OR REPLACE FUNCTION public.list_equipe()
RETURNS TABLE(id uuid, nome text, email text, roles text[])
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT u.id,
    COALESCE(NULLIF(u.raw_user_meta_data->>'nome',''), (SELECT w.nome_vendedor FROM public.whatsapp_numbers w WHERE w.user_id = u.id LIMIT 1), split_part(u.email,'@',1))::text,
    u.email::text,
    COALESCE((SELECT array_agg(r.role::text) FROM public.user_roles r WHERE r.user_id = u.id), ARRAY[]::text[])
  FROM auth.users u
  WHERE auth.uid() IS NOT NULL
  ORDER BY 2;
$$;
REVOKE ALL ON FUNCTION public.list_equipe() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.list_equipe() TO authenticated;

CREATE OR REPLACE FUNCTION public.list_negociacoes_conversa(_conversa_id uuid)
RETURNS SETOF public.negociacoes
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT n.* FROM public.negociacoes n
  JOIN public.whatsapp_conversas c ON c.id = _conversa_id
  WHERE (public.is_admin_or_gestor(auth.uid()) OR c.responsavel_id = auth.uid())
    AND (n.id = c.negociacao_id
      OR (length(regexp_replace(coalesce(n.telefone,''),'\D','','g')) >= 8
          AND right(regexp_replace(n.telefone,'\D','','g'),8) = right(regexp_replace(c.telefone,'\D','','g'),8)))
  ORDER BY (n.status = 'aberto') DESC, n.created_at DESC;
$$;
REVOKE ALL ON FUNCTION public.list_negociacoes_conversa(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.list_negociacoes_conversa(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.validate_negociacao_responsavel()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.responsavel_id IS NOT NULL
     AND (TG_OP = 'INSERT' OR NEW.responsavel_id IS DISTINCT FROM OLD.responsavel_id)
     AND NOT public.has_role(NEW.responsavel_id, 'vendedor') THEN
    IF auth.uid() IS NULL THEN
      NEW.responsavel_id := NULL;
    ELSE
      RAISE EXCEPTION 'O responsável da negociação precisa ser um vendedor';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_validate_negociacao_responsavel ON public.negociacoes;
CREATE TRIGGER trg_validate_negociacao_responsavel BEFORE INSERT OR UPDATE ON public.negociacoes
FOR EACH ROW EXECUTE FUNCTION public.validate_negociacao_responsavel();