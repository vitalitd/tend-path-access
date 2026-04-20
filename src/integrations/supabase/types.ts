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
      access_requests: {
        Row: {
          conditions_acknowledged: boolean
          created_at: string
          group_size: number
          id: string
          price_paid: number | null
          property_id: string
          requested_datetime: string
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
          user_id: string
          visitor_message: string | null
        }
        Insert: {
          conditions_acknowledged?: boolean
          created_at?: string
          group_size?: number
          id?: string
          price_paid?: number | null
          property_id: string
          requested_datetime: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          user_id: string
          visitor_message?: string | null
        }
        Update: {
          conditions_acknowledged?: boolean
          created_at?: string
          group_size?: number
          id?: string
          price_paid?: number | null
          property_id?: string
          requested_datetime?: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          user_id?: string
          visitor_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      access_rules: {
        Row: {
          created_at: string
          group_size_limit: number | null
          id: string
          property_id: string
          time_restrictions: string | null
          warnings: string | null
        }
        Insert: {
          created_at?: string
          group_size_limit?: number | null
          id?: string
          property_id: string
          time_restrictions?: string | null
          warnings?: string | null
        }
        Update: {
          created_at?: string
          group_size_limit?: number | null
          id?: string
          property_id?: string
          time_restrictions?: string | null
          warnings?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_rules_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          property_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          property_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          property_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          pricing_type: Database["public"]["Enums"]["pricing_type"]
          property_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          pricing_type?: Database["public"]["Enums"]["pricing_type"]
          property_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          pricing_type?: Database["public"]["Enums"]["pricing_type"]
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pricing_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          acreage: number | null
          allowed_activities: string[]
          conditions: string | null
          created_at: string
          description: string | null
          id: string
          is_available: boolean
          landowner_id: string
          latitude: number
          longitude: number
          name: string
          region: string | null
          steward_name: string | null
          updated_at: string
        }
        Insert: {
          acreage?: number | null
          allowed_activities?: string[]
          conditions?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_available?: boolean
          landowner_id: string
          latitude: number
          longitude: number
          name: string
          region?: string | null
          steward_name?: string | null
          updated_at?: string
        }
        Update: {
          acreage?: number | null
          allowed_activities?: string[]
          conditions?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_available?: boolean
          landowner_id?: string
          latitude?: number
          longitude?: number
          name?: string
          region?: string | null
          steward_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visits: {
        Row: {
          access_request_id: string
          check_in_time: string | null
          check_out_time: string | null
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          access_request_id: string
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          access_request_id?: string
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "visits_access_request_id_fkey"
            columns: ["access_request_id"]
            isOneToOne: true
            referencedRelation: "access_requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      profiles_public: {
        Row: {
          display_name: string | null
          user_id: string | null
        }
        Insert: {
          display_name?: string | null
          user_id?: string | null
        }
        Update: {
          display_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "visitor" | "landowner" | "admin"
      pricing_type: "per_visit" | "day_pass" | "subscription"
      request_status: "pending" | "approved" | "declined" | "cancelled"
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
      app_role: ["visitor", "landowner", "admin"],
      pricing_type: ["per_visit", "day_pass", "subscription"],
      request_status: ["pending", "approved", "declined", "cancelled"],
    },
  },
} as const
