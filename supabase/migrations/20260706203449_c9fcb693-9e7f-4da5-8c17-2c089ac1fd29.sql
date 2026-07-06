
-- 1) Trigger: ao inserir/atualizar uma negociação, se não houver responsável mas
--    houver destino_whatsapp, buscar o dono do número na tabela whatsapp_numbers.
CREATE OR REPLACE FUNCTION public.auto_assign_responsavel()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.responsavel_id IS NULL AND NEW.destino_whatsapp IS NOT NULL THEN
    SELECT w.user_id INTO NEW.responsavel_id
    FROM public.whatsapp_numbers w
    WHERE w.numero_raw = NEW.destino_whatsapp
    LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_assign_responsavel ON public.negociacoes;
CREATE TRIGGER trg_auto_assign_responsavel
BEFORE INSERT OR UPDATE OF destino_whatsapp ON public.negociacoes
FOR EACH ROW EXECUTE FUNCTION public.auto_assign_responsavel();

-- 2) Backfill: negociações que já têm destino_whatsapp mas ficaram sem responsável
UPDATE public.negociacoes n
SET responsavel_id = w.user_id
FROM public.whatsapp_numbers w
WHERE n.responsavel_id IS NULL
  AND n.destino_whatsapp IS NOT NULL
  AND w.numero_raw = n.destino_whatsapp;

-- 3) Backfill via lead vinculado (caso o destino tenha ficado só no lead)
UPDATE public.negociacoes n
SET responsavel_id = w.user_id,
    destino_whatsapp = COALESCE(n.destino_whatsapp, l.destino_whatsapp)
FROM public.leads l
JOIN public.whatsapp_numbers w ON w.numero_raw = l.destino_whatsapp
WHERE n.responsavel_id IS NULL
  AND n.lead_id = l.id
  AND l.destino_whatsapp IS NOT NULL;
