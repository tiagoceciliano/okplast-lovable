CREATE OR REPLACE FUNCTION public.log_negociacao_changes()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE campos text[] := ARRAY[]::text[];
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.negociacao_historico(negociacao_id, autor_id, tipo, descricao)
    VALUES (NEW.id, auth.uid(), 'criada', 'Negociação criada em ' || NEW.etapa::text);
    RETURN NEW;
  END IF;
  IF NEW.etapa IS DISTINCT FROM OLD.etapa THEN
    INSERT INTO public.negociacao_historico(negociacao_id, autor_id, tipo, descricao)
    VALUES (NEW.id, auth.uid(), 'etapa', OLD.etapa::text || ' → ' || NEW.etapa::text);
  END IF;
  IF NEW.responsavel_id IS DISTINCT FROM OLD.responsavel_id THEN
    INSERT INTO public.negociacao_historico(negociacao_id, autor_id, tipo, descricao)
    VALUES (NEW.id, auth.uid(), 'responsavel', 'Responsável alterado');
  END IF;
  IF NEW.valor IS DISTINCT FROM OLD.valor THEN campos := campos || 'valor'; END IF;
  IF NEW.material IS DISTINCT FROM OLD.material THEN campos := campos || 'material'; END IF;
  IF NEW.produto IS DISTINCT FROM OLD.produto THEN campos := campos || 'produto'; END IF;
  IF NEW.tags IS DISTINCT FROM OLD.tags THEN campos := campos || 'etiquetas'; END IF;
  IF NEW.telefone IS DISTINCT FROM OLD.telefone OR NEW.email IS DISTINCT FROM OLD.email OR NEW.nome_cliente IS DISTINCT FROM OLD.nome_cliente THEN campos := campos || 'dados do cliente'; END IF;
  IF array_length(campos, 1) > 0 THEN
    INSERT INTO public.negociacao_historico(negociacao_id, autor_id, tipo, descricao)
    VALUES (NEW.id, auth.uid(), 'edicao', 'Alterou ' || array_to_string(campos, ', '));
  END IF;
  RETURN NEW;
END; $function$;