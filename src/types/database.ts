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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      chapter: {
        Row: {
          chapter_number: number | null
          content: string | null
          date_created: string | null
          id_chapter: number
          id_manuscript: number | null
          id_user: string | null
          last_edit: string | null
          name_chapter: string
          status: string | null
          summary: string | null
          word_count: number | null
        }
        Insert: {
          chapter_number?: number | null
          content?: string | null
          date_created?: string | null
          id_chapter?: number
          id_manuscript?: number | null
          id_user?: string | null
          last_edit?: string | null
          name_chapter: string
          status?: string | null
          summary?: string | null
          word_count?: number | null
        }
        Update: {
          chapter_number?: number | null
          content?: string | null
          date_created?: string | null
          id_chapter?: number
          id_manuscript?: number | null
          id_user?: string | null
          last_edit?: string | null
          name_chapter?: string
          status?: string | null
          summary?: string | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chapter_id_manuscript_fkey"
            columns: ["id_manuscript"]
            isOneToOne: false
            referencedRelation: "manuscript"
            referencedColumns: ["id_manuscript"]
          },
        ]
      }
      chapter_has_character: {
        Row: {
          id_chapter: number
          id_character: number
        }
        Insert: {
          id_chapter: number
          id_character: number
        }
        Update: {
          id_chapter?: number
          id_character?: number
        }
        Relationships: [
          {
            foreignKeyName: "chapter_has_character_id_chapter_fkey"
            columns: ["id_chapter"]
            isOneToOne: false
            referencedRelation: "chapter"
            referencedColumns: ["id_chapter"]
          },
          {
            foreignKeyName: "chapter_has_character_id_character_fkey"
            columns: ["id_character"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id_character"]
          },
        ]
      }
      characters: {
        Row: {
          age: number | null
          biography: string | null
          birth: string | null
          build: string | null
          date_created: string | null
          external_motivation: string | null
          eye_color: string | null
          eye_shape: string | null
          fears_phobias: string | null
          flaw: string | null
          hair_color: string | null
          hair_style: string | null
          height: string | null
          id_character: number
          id_manuscript: number | null
          internal_motivation: string | null
          motto: string | null
          name: string
          negative_traits: string | null
          occupation: string | null
          personality_type: string | null
          picture: string | null
          positive_traits: string | null
          quirks_mannerisms: string | null
          relationship_status: string | null
          role: string | null
          scars: string | null
          weight: string | null
        }
        Insert: {
          age?: number | null
          biography?: string | null
          birth?: string | null
          build?: string | null
          date_created?: string | null
          external_motivation?: string | null
          eye_color?: string | null
          eye_shape?: string | null
          fears_phobias?: string | null
          flaw?: string | null
          hair_color?: string | null
          hair_style?: string | null
          height?: string | null
          id_character?: number
          id_manuscript?: number | null
          internal_motivation?: string | null
          motto?: string | null
          name: string
          negative_traits?: string | null
          occupation?: string | null
          personality_type?: string | null
          picture?: string | null
          positive_traits?: string | null
          quirks_mannerisms?: string | null
          relationship_status?: string | null
          role?: string | null
          scars?: string | null
          weight?: string | null
        }
        Update: {
          age?: number | null
          biography?: string | null
          birth?: string | null
          build?: string | null
          date_created?: string | null
          external_motivation?: string | null
          eye_color?: string | null
          eye_shape?: string | null
          fears_phobias?: string | null
          flaw?: string | null
          hair_color?: string | null
          hair_style?: string | null
          height?: string | null
          id_character?: number
          id_manuscript?: number | null
          internal_motivation?: string | null
          motto?: string | null
          name?: string
          negative_traits?: string | null
          occupation?: string | null
          personality_type?: string | null
          picture?: string | null
          positive_traits?: string | null
          quirks_mannerisms?: string | null
          relationship_status?: string | null
          role?: string | null
          scars?: string | null
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "characters_id_manuscript_fkey"
            columns: ["id_manuscript"]
            isOneToOne: false
            referencedRelation: "manuscript"
            referencedColumns: ["id_manuscript"]
          },
        ]
      }
      genre: {
        Row: {
          category: string
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      manuscript: {
        Row: {
          date_created: string | null
          date_updated: string | null
          genre: string | null
          id_manuscript: number
          id_user: string | null
          picture: string | null
          status: string | null
          summary: string | null
          target_audience: string | null
          title: string
          word_count: number | null
        }
        Insert: {
          date_created?: string | null
          date_updated?: string | null
          genre?: string | null
          id_manuscript?: number
          id_user?: string | null
          picture?: string | null
          status?: string | null
          summary?: string | null
          target_audience?: string | null
          title: string
          word_count?: number | null
        }
        Update: {
          date_created?: string | null
          date_updated?: string | null
          genre?: string | null
          id_manuscript?: number
          id_user?: string | null
          picture?: string | null
          status?: string | null
          summary?: string | null
          target_audience?: string | null
          title?: string
          word_count?: number | null
        }
        Relationships: []
      }
      note: {
        Row: {
          category: string | null
          content: string | null
          date_created: string | null
          id_manuscript: number | null
          id_note: number
          id_user: string | null
          priority: string | null
          title: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          date_created?: string | null
          id_manuscript?: number | null
          id_note?: number
          id_user?: string | null
          priority?: string | null
          title: string
        }
        Update: {
          category?: string | null
          content?: string | null
          date_created?: string | null
          id_manuscript?: number | null
          id_note?: number
          id_user?: string | null
          priority?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_id_manuscript_fkey"
            columns: ["id_manuscript"]
            isOneToOne: false
            referencedRelation: "manuscript"
            referencedColumns: ["id_manuscript"]
          },
        ]
      }
      stats: {
        Row: {
          date_created: string | null
          date_updated: string | null
          id_stats: number
          id_user: string
          last_writing_date: string | null
          total_chapters: number | null
          total_characters: number | null
          total_words: number | null
          writing_streak: number | null
        }
        Insert: {
          date_created?: string | null
          date_updated?: string | null
          id_stats?: number
          id_user: string
          last_writing_date?: string | null
          total_chapters?: number | null
          total_characters?: number | null
          total_words?: number | null
          writing_streak?: number | null
        }
        Update: {
          date_created?: string | null
          date_updated?: string | null
          id_stats?: number
          id_user?: string
          last_writing_date?: string | null
          total_chapters?: number | null
          total_characters?: number | null
          total_words?: number | null
          writing_streak?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
