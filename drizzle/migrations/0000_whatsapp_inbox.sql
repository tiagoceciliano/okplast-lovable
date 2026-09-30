CREATE TABLE public.whatsapp_conversas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telefone text NOT NULL UNIQUE,
  nome_contato text,
  negociacao_id uuid REFERENCES public.negociacoes(id) ON DELETE SET NULL,
  responsavel_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ultima_mensagem text,
  ultima_mensagem_em timestamptz,
  ultima_entrada_cliente_em timestamptz,
  nao_lidas integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.whatsapp_conversas TO authenticated;
GRANT ALL ON public.whatsapp_conversas TO service_role;
ALTER TABLE public.whatsapp_conversas ENABLE ROW LEVEL SECURITY;
CREATE POLICY wa_conv_sel ON public.whatsapp_conversas FOR SELECT TO authenticated
  USING (public.is_admin_or_gestor(auth.uid()) OR responsavel_id = auth.uid());
CREATE POLICY wa_conv_upd ON public.whatsapp_conversas FOR UPDATE TO authenticated
  USING (public.is_admin_or_gestor(auth.uid()) OR responsavel_id = auth.uid())
  WITH CHECK (public.is_admin_or_gestor(auth.uid()) OR responsavel_id = auth.uid());
CREATE TRIGGER wa_conv_updated_at BEFORE UPDATE ON public.whatsapp_conversas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.whatsapp_mensagens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversa_id uuid NOT NULL REFERENCES public.whatsapp_conversas(id) ON DELETE CASCADE,
  wa_message_id text UNIQUE,
  direcao text NOT NULL CHECK (direcao IN ('entrada','saida')),
  tipo text NOT NULL DEFAULT 'text',
  conteudo text,
  status text,
  erro text,
  autor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX whatsapp_mensagens_conv_idx ON public.whatsapp_mensagens(conversa_id, created_at);
GRANT SELECT ON public.whatsapp_mensagens TO authenticated;
GRANT ALL ON public.whatsapp_mensagens TO service_role;
ALTER TABLE public.whatsapp_mensagens ENABLE ROW LEVEL SECURITY;
CREATE POLICY wa_msg_sel ON public.whatsapp_mensagens FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.whatsapp_conversas c WHERE c.id = conversa_id
    AND (public.is_admin_or_gestor(auth.uid()) OR c.responsavel_id = auth.uid())));

ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_conversas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_mensagens;