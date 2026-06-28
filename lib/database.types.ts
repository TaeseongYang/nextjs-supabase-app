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
      announcements: {
        Row: {
          content: string
          created_at: string | null
          event_id: string
          id: string
          is_pinned: boolean
        }
        Insert: {
          content: string
          created_at?: string | null
          event_id: string
          id?: string
          is_pinned?: boolean
        }
        Update: {
          content?: string
          created_at?: string | null
          event_id?: string
          id?: string
          is_pinned?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "announcements_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      carpool_requests: {
        Row: {
          carpool_id: string
          id: string
          participant_id: string
          status: Database["public"]["Enums"]["carpool_request_status"]
        }
        Insert: {
          carpool_id: string
          id?: string
          participant_id: string
          status?: Database["public"]["Enums"]["carpool_request_status"]
        }
        Update: {
          carpool_id?: string
          id?: string
          participant_id?: string
          status?: Database["public"]["Enums"]["carpool_request_status"]
        }
        Relationships: [
          {
            foreignKeyName: "carpool_requests_carpool_id_fkey"
            columns: ["carpool_id"]
            isOneToOne: false
            referencedRelation: "carpools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carpool_requests_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      carpools: {
        Row: {
          departure_location: string
          departure_time: string
          driver_participant_id: string
          event_id: string
          id: string
          max_passengers: number
        }
        Insert: {
          departure_location: string
          departure_time: string
          driver_participant_id: string
          event_id: string
          id?: string
          max_passengers: number
        }
        Update: {
          departure_location?: string
          departure_time?: string
          driver_participant_id?: string
          event_id?: string
          id?: string
          max_passengers?: number
        }
        Relationships: [
          {
            foreignKeyName: "carpools_driver_participant_id_fkey"
            columns: ["driver_participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carpools_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          event_date: string
          id: string
          invite_token: string
          location: string
          max_participants: number | null
          organizer_id: string
          status: Database["public"]["Enums"]["event_status"]
          title: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          event_date: string
          id?: string
          invite_token: string
          location: string
          max_participants?: number | null
          organizer_id: string
          status?: Database["public"]["Enums"]["event_status"]
          title: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          event_date?: string
          id?: string
          invite_token?: string
          location?: string
          max_participants?: number | null
          organizer_id?: string
          status?: Database["public"]["Enums"]["event_status"]
          title?: string
        }
        Relationships: []
      }
      participants: {
        Row: {
          event_id: string
          id: string
          joined_at: string | null
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["participant_status"]
        }
        Insert: {
          event_id: string
          id?: string
          joined_at?: string | null
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["participant_status"]
        }
        Update: {
          event_id?: string
          id?: string
          joined_at?: string | null
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["participant_status"]
        }
        Relationships: [
          {
            foreignKeyName: "participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_admin: boolean
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_admin?: boolean
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      settlement_details: {
        Row: {
          amount: number
          id: string
          is_paid: boolean
          paid_at: string | null
          participant_id: string
          settlement_item_id: string
        }
        Insert: {
          amount: number
          id?: string
          is_paid?: boolean
          paid_at?: string | null
          participant_id: string
          settlement_item_id: string
        }
        Update: {
          amount?: number
          id?: string
          is_paid?: boolean
          paid_at?: string | null
          participant_id?: string
          settlement_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "settlement_details_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "settlement_details_settlement_item_id_fkey"
            columns: ["settlement_item_id"]
            isOneToOne: false
            referencedRelation: "settlement_items"
            referencedColumns: ["id"]
          },
        ]
      }
      settlement_items: {
        Row: {
          event_id: string
          id: string
          split_type: Database["public"]["Enums"]["split_type"]
          title: string
          total_amount: number
        }
        Insert: {
          event_id: string
          id?: string
          split_type: Database["public"]["Enums"]["split_type"]
          title: string
          total_amount: number
        }
        Update: {
          event_id?: string
          id?: string
          split_type?: Database["public"]["Enums"]["split_type"]
          title?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "settlement_items_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      carpool_request_status: "pending" | "confirmed" | "rejected"
      event_status: "recruiting" | "confirmed" | "completed" | "cancelled"
      participant_status: "attending" | "absent" | "pending" | "waitlisted"
      split_type: "equal" | "custom"
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
      carpool_request_status: ["pending", "confirmed", "rejected"],
      event_status: ["recruiting", "confirmed", "completed", "cancelled"],
      participant_status: ["attending", "absent", "pending", "waitlisted"],
      split_type: ["equal", "custom"],
    },
  },
} as const
