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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
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
          material: string | null
          mensagem: string | null
          nome_cliente: string
          posicao: number
          produto: string | null
          responsavel_id: string | null
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
          material?: string | null
          mensagem?: string | null
          nome_cliente: string
          posicao?: number
          produto?: string | null
          responsavel_id?: string | null
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
          material?: string | null
          mensagem?: string | null
          nome_cliente?: string
          posicao?: number
          produto?: string | null
          responsavel_id?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_negociacao: {
        Args: { _neg_id: string; _user_id: string }
        Returns: boolean
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
    }
    Enums: {
      app_role: "admin" | "user" | "gestor" | "vendedor"
      negociacao_etapa:
        | "entrada"
        | "em_contato"
        | "orcamento"
        | "negociacao"
        | "ganho"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
        "ganho",
        "perdido",
      ],
    },
  },
} as const
