export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      etiquetas: {
        Row: {
          aplica_em: string[]
          cor: string
          created_at: string
          escopo: string
          id: string
          nome: string
          owner_id: string | null
        }
        Insert: {
          aplica_em?: string[]
          cor?: string
          created_at?: string
          escopo?: string
          id?: string
          nome: string
          owner_id?: string | null
        }
        Update: {
          aplica_em?: string[]
          cor?: string
          created_at?: string
          escopo?: string
          id?: string
          nome?: string
          owner_id?: string | null
        }
        Relationships: []
      }
      health_alerts: {
        Row: {
          created_at: string
          detalhe: string | null
          id: string
          notificado: boolean
          tipo: string
        }
        Insert: {
          created_at?: string
          detalhe?: string | null
          id?: string
          notificado?: boolean
          tipo: string
        }
        Update: {
          created_at?: string
          detalhe?: string | null
          id?: string
          notificado?: boolean
          tipo?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          cidade: string | null
          created_at: string
          destino_whatsapp: string | null
          email: string
          estado: string | null
          id: string
          ip_address: string | null
          mensagem: string | null
          nome: string
          pais: string | null
          produto_interesse: string
          telefone: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          webhook_enviado: boolean | null
          webhook_tipo: string | null
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          destino_whatsapp?: string | null
          email: string
          estado?: string | null
          id?: string
          ip_address?: string | null
          mensagem?: string | null
          nome: string
          pais?: string | null
          produto_interesse: string
          telefone: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          webhook_enviado?: boolean | null
          webhook_tipo?: string | null
        }
        Update: {
          cidade?: string | null
          created_at?: string
          destino_whatsapp?: string | null
          email?: string
          estado?: string | null
          id?: string
          ip_address?: string | null
          mensagem?: string | null
          nome?: string
          pais?: string | null
          produto_interesse?: string
          telefone?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          webhook_enviado?: boolean | null
          webhook_tipo?: string | null
        }
        Relationships: []
      }
      metas: {
        Row: {
          created_at: string
          id: string
          mes: string
          observacao: string | null
          updated_at: string
          valor_total: number
        }
        Insert: {
          created_at?: string
          id?: string
          mes: string
          observacao?: string | null
          updated_at?: string
          valor_total?: number
        }
        Update: {
          created_at?: string
          id?: string
          mes?: string
          observacao?: string | null
          updated_at?: string
          valor_total?: number
        }
        Relationships: []
      }
      metas_vendedores: {
        Row: {
          created_at: string
          id: string
          meta_id: string
          updated_at: string
          user_id: string
          valor: number
        }
        Insert: {
          created_at?: string
          id?: string
          meta_id: string
          updated_at?: string
          user_id: string
          valor?: number
        }
        Update: {
          created_at?: string
          id?: string
          meta_id?: string
          updated_at?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "metas_vendedores_meta_id_fkey"
            columns: ["meta_id"]
            isOneToOne: false
            referencedRelation: "metas"
            referencedColumns: ["id"]
          },
        ]
      }
      negociacao_comentarios: {
        Row: {
          autor_id: string | null
          created_at: string
          id: string
          negociacao_id: string
          texto: string
        }
        Insert: {
          autor_id?: string | null
          created_at?: string
          id?: string
          negociacao_id: string
          texto: string
        }
        Update: {
          autor_id?: string | null
          created_at?: string
          id?: string
          negociacao_id?: string
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "negociacao_comentarios_negociacao_id_fkey"
            columns: ["negociacao_id"]
            isOneToOne: false
            referencedRelation: "negociacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      negociacao_historico: {
        Row: {
          autor_id: string | null
          created_at: string
          descricao: string | null
          id: string
          negociacao_id: string
          tipo: string
        }
        Insert: {
          autor_id?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          negociacao_id: string
          tipo: string
        }
        Update: {
          autor_id?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          negociacao_id?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "negociacao_historico_negociacao_id_fkey"
            columns: ["negociacao_id"]
            isOneToOne: false
            referencedRelation: "negociacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      negociacao_tarefas: {
        Row: {
          concluida: boolean
          created_at: string
          created_by: string | null
          data_vencimento: string | null
          id: string
          negociacao_id: string
          titulo: string
          updated_at: string
        }
        Insert: {
          concluida?: boolean
          created_at?: string
          created_by?: string | null
          data_vencimento?: string | null
          id?: string
          negociacao_id: string
          titulo: string
          updated_at?: string
        }
        Update: {
          concluida?: boolean
          created_at?: string
          created_by?: string | null
          data_vencimento?: string | null
          id?: string
          negociacao_id?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "negociacao_tarefas_negociacao_id_fkey"
            columns: ["negociacao_id"]
            isOneToOne: false
            referencedRelation: "negociacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      negociacoes: {
        Row: {
          created_at: string
          destino_whatsapp: string | null
          email: string | null
          etapa: Database["public"]["Enums"]["negociacao_etapa"]
          id: string
          lead_id: string | null
          link_pv_bling: string | null
          material: string | null
          mensagem: string | null
          nome_cliente: string
          nome_produto: string | null
          posicao: number
          produto: string | null
          responsavel_id: string | null
          status: string
          tags: string[]
          telefone: string | null
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          valor: number | null
        }
        Insert: {
          created_at?: string
          destino_whatsapp?: string | null
          email?: string | null
          etapa?: Database["public"]["Enums"]["negociacao_etapa"]
          id?: string
          lead_id?: string | null
          link_pv_bling?: string | null
          material?: string | null
          mensagem?: string | null
          nome_cliente: string
          nome_produto?: string | null
          posicao?: number
          produto?: string | null
          responsavel_id?: string | null
          status?: string
          tags?: string[]
          telefone?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          valor?: number | null
        }
        Update: {
          created_at?: string
          destino_whatsapp?: string | null
          email?: string | null
          etapa?: Database["public"]["Enums"]["negociacao_etapa"]
          id?: string
          lead_id?: string | null
          link_pv_bling?: string | null
          material?: string | null
          mensagem?: string | null
          nome_cliente?: string
          nome_produto?: string | null
          posicao?: number
          produto?: string | null
          responsavel_id?: string | null
          status?: string
          tags?: string[]
          telefone?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "negociacoes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      page_visits: {
        Row: {
          cidade: string | null
          created_at: string
          estado: string | null
          id: string
          ip_address: string | null
          page_path: string
          page_url: string
          pais: string | null
          referrer: string | null
          session_id: string
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          visitor_id: string
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          estado?: string | null
          id?: string
          ip_address?: string | null
          page_path: string
          page_url: string
          pais?: string | null
          referrer?: string | null
          session_id: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id: string
        }
        Update: {
          cidade?: string | null
          created_at?: string
          estado?: string | null
          id?: string
          ip_address?: string | null
          page_path?: string
          page_url?: string
          pais?: string | null
          referrer?: string | null
          session_id?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      perfil_permissoes: {
        Row: {
          can_delete: boolean
          can_edit: boolean
          can_view: boolean
          perfil_id: string
          resource: string
          scope: string
        }
        Insert: {
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          perfil_id: string
          resource: string
          scope?: string
        }
        Update: {
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          perfil_id?: string
          resource?: string
          scope?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfil_permissoes_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis: {
        Row: {
          base_role: Database["public"]["Enums"]["app_role"]
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          base_role?: Database["public"]["Enums"]["app_role"]
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          base_role?: Database["public"]["Enums"]["app_role"]
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      produtos: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          material: string | null
          nome: string
          preco: number
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          material?: string | null
          nome: string
          preco?: number
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          material?: string | null
          nome?: string
          preco?: number
          updated_at?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          can_delete: boolean
          can_edit: boolean
          can_view: boolean
          resource: string
          role: Database["public"]["Enums"]["app_role"]
          scope: string
          updated_at: string
        }
        Insert: {
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          resource: string
          role: Database["public"]["Enums"]["app_role"]
          scope?: string
          updated_at?: string
        }
        Update: {
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          resource?: string
          role?: Database["public"]["Enums"]["app_role"]
          scope?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_group_members: {
        Row: {
          created_at: string
          group_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "team_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      team_groups: {
        Row: {
          cor: string
          created_at: string
          created_by: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          cor?: string
          created_at?: string
          created_by: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          cor?: string
          created_at?: string
          created_by?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_perfis: {
        Row: {
          perfil_id: string
          user_id: string
        }
        Insert: {
          perfil_id: string
          user_id: string
        }
        Update: {
          perfil_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_perfis_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_agendamentos: {
        Row: {
          autor_id: string
          conversa_id: string
          created_at: string
          enviado_em: string | null
          enviar_em: string
          erro: string | null
          id: string
          janela_limite: string
          mensagem_id: string | null
          proxima_tentativa_em: string | null
          status: string
          template: Json | null
          tentativas: number
          texto: string
          tipo: string
          updated_at: string
        }
        Insert: {
          autor_id: string
          conversa_id: string
          created_at?: string
          enviado_em?: string | null
          enviar_em: string
          erro?: string | null
          id?: string
          janela_limite: string
          mensagem_id?: string | null
          proxima_tentativa_em?: string | null
          status?: string
          template?: Json | null
          tentativas?: number
          texto: string
          tipo?: string
          updated_at?: string
        }
        Update: {
          autor_id?: string
          conversa_id?: string
          created_at?: string
          enviado_em?: string | null
          enviar_em?: string
          erro?: string | null
          id?: string
          janela_limite?: string
          mensagem_id?: string | null
          proxima_tentativa_em?: string | null
          status?: string
          template?: Json | null
          tentativas?: number
          texto?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_agendamentos_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_agendamentos_mensagem_id_fkey"
            columns: ["mensagem_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_mensagens"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_conversas: {
        Row: {
          created_at: string
          id: string
          nao_lidas: number
          negociacao_id: string | null
          nome_contato: string | null
          resolvida_em: string | null
          responsavel_id: string | null
          tags: string[]
          telefone: string
          ultima_entrada_cliente_em: string | null
          ultima_mensagem: string | null
          ultima_mensagem_em: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nao_lidas?: number
          negociacao_id?: string | null
          nome_contato?: string | null
          resolvida_em?: string | null
          responsavel_id?: string | null
          tags?: string[]
          telefone: string
          ultima_entrada_cliente_em?: string | null
          ultima_mensagem?: string | null
          ultima_mensagem_em?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nao_lidas?: number
          negociacao_id?: string | null
          nome_contato?: string | null
          resolvida_em?: string | null
          responsavel_id?: string | null
          tags?: string[]
          telefone?: string
          ultima_entrada_cliente_em?: string | null
          ultima_mensagem?: string | null
          ultima_mensagem_em?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_conversas_negociacao_id_fkey"
            columns: ["negociacao_id"]
            isOneToOne: false
            referencedRelation: "negociacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_mensagens: {
        Row: {
          autor_id: string | null
          conteudo: string | null
          conversa_id: string
          created_at: string
          direcao: string
          erro: string | null
          id: string
          status: string | null
          tipo: string
          wa_message_id: string | null
        }
        Insert: {
          autor_id?: string | null
          conteudo?: string | null
          conversa_id: string
          created_at?: string
          direcao: string
          erro?: string | null
          id?: string
          status?: string | null
          tipo?: string
          wa_message_id?: string | null
        }
        Update: {
          autor_id?: string | null
          conteudo?: string | null
          conversa_id?: string
          created_at?: string
          direcao?: string
          erro?: string | null
          id?: string
          status?: string | null
          tipo?: string
          wa_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_mensagens_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversas"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_numbers: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          nome_vendedor: string
          numero_formatado: string
          numero_raw: string
          peso: number
          recebe_lead: boolean
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome_vendedor: string
          numero_formatado: string
          numero_raw: string
          peso?: number
          recebe_lead?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome_vendedor?: string
          numero_formatado?: string
          numero_raw?: string
          peso?: number
          recebe_lead?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      whatsapp_template_eventos: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          template_id: string | null
          tipo: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          template_id?: string | null
          tipo: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          template_id?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_template_eventos_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_templates: {
        Row: {
          categoria: string
          categoria_anterior: string | null
          componentes: Json
          created_at: string
          id: string
          idioma: string
          meta_id: string | null
          motivo: string | null
          nome: string
          qualidade: string | null
          status: string
          sub_tipo: string
          updated_at: string
        }
        Insert: {
          categoria: string
          categoria_anterior?: string | null
          componentes?: Json
          created_at?: string
          id?: string
          idioma?: string
          meta_id?: string | null
          motivo?: string | null
          nome: string
          qualidade?: string | null
          status?: string
          sub_tipo?: string
          updated_at?: string
        }
        Update: {
          categoria?: string
          categoria_anterior?: string | null
          componentes?: Json
          created_at?: string
          id?: string
          idioma?: string
          meta_id?: string | null
          motivo?: string | null
          nome?: string
          qualidade?: string | null
          status?: string
          sub_tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      whatsapp_webhook_events: {
        Row: {
          attempts: number
          delivery_id: string
          event: string
          id: string
          payload: Json
          processed_at: string | null
          processing_error: string | null
          received_at: string
        }
        Insert: {
          attempts?: number
          delivery_id: string
          event: string
          id?: string
          payload: Json
          processed_at?: string | null
          processing_error?: string | null
          received_at?: string
        }
        Update: {
          attempts?: number
          delivery_id?: string
          event?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          processing_error?: string | null
          received_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_negociacao: {
        Args: { _neg_id: string; _user_id: string }
        Returns: boolean
      }
      cancel_whatsapp_agendamento: { Args: { _id: string }; Returns: boolean }
      claim_due_whatsapp_agendamentos: {
        Args: { _limit?: number }
        Returns: {
          autor_id: string
          conversa_id: string
          created_at: string
          enviado_em: string | null
          enviar_em: string
          erro: string | null
          id: string
          janela_limite: string
          mensagem_id: string | null
          proxima_tentativa_em: string | null
          status: string
          template: Json | null
          tentativas: number
          texto: string
          tipo: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "whatsapp_agendamentos"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_campaign_stats: {
        Args: { p_end: string; p_start: string }
        Returns: {
          campaign: string
          conversion_rate: number
          leads: number
          visits: number
        }[]
      }
      get_daily_visits: {
        Args: { p_end: string; p_start: string }
        Returns: {
          visit_count: number
          visit_date: string
        }[]
      }
      get_general_metrics: {
        Args: { p_end: string; p_start: string }
        Returns: {
          total_leads: number
          total_visits: number
          unique_sessions: number
          unique_visitors: number
        }[]
      }
      get_leads_by_location: {
        Args: { p_end: string; p_limit?: number; p_start: string }
        Returns: {
          lead_count: number
          location: string
        }[]
      }
      get_leads_by_product: {
        Args: { p_end: string; p_start: string }
        Returns: {
          lead_count: number
          product: string
        }[]
      }
      get_leads_count_by_period: {
        Args: { p_end: string; p_start: string }
        Returns: {
          chapas: number
          produtos: number
          total: number
        }[]
      }
      get_realizado_mensal: {
        Args: { p_mes: string }
        Returns: {
          qtd: number
          total: number
          user_id: string
        }[]
      }
      get_term_stats: {
        Args: { p_end: string; p_start: string }
        Returns: {
          campaign: string
          conversion_rate: number
          leads: number
          term: string
          visits: number
        }[]
      }
      get_top_pages: {
        Args: { p_end: string; p_limit?: number; p_start: string }
        Returns: {
          page_path: string
          visit_count: number
        }[]
      }
      get_traffic_sources: {
        Args: { p_end: string; p_start: string }
        Returns: {
          lead_count: number
          source: string
        }[]
      }
      get_visits_count_by_period: {
        Args: { p_end: string; p_start: string }
        Returns: {
          chapas_leads: number
          chapas_visits: number
          produtos_leads: number
          produtos_visits: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_gestor: { Args: { _user_id: string }; Returns: boolean }
      list_equipe: {
        Args: never
        Returns: {
          email: string
          id: string
          nome: string
          roles: string[]
        }[]
      }
      list_negociacoes_conversa: {
        Args: { _conversa_id: string }
        Returns: {
          created_at: string
          destino_whatsapp: string | null
          email: string | null
          etapa: Database["public"]["Enums"]["negociacao_etapa"]
          id: string
          lead_id: string | null
          link_pv_bling: string | null
          material: string | null
          mensagem: string | null
          nome_cliente: string
          nome_produto: string | null
          posicao: number
          produto: string | null
          responsavel_id: string | null
          status: string
          tags: string[]
          telefone: string | null
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          valor: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "negociacoes"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      update_whatsapp_agendamento: {
        Args: {
          _enviar_em: string
          _id: string
          _template: Json
          _texto: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "gestor" | "vendedor"
      negociacao_etapa:
        | "entrada"
        | "em_contato"
        | "orcamento"
        | "negociacao"
        | "venda_realizada"
        | "perdido"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "gestor", "vendedor"],
      negociacao_etapa: [
        "entrada",
        "em_contato",
        "orcamento",
        "negociacao",
        "venda_realizada",
        "perdido",
      ],
    },
  },
} as const
