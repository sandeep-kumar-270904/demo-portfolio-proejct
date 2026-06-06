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
      blog_posts: {
        Row: {
          created_at: string
          excerpt: string | null
          external_url: string | null
          id: string
          is_published: boolean
          published_date: string | null
          read_time: string | null
          sort_order: number
          tags: string[]
          title: string
        }
        Insert: {
          created_at?: string
          excerpt?: string | null
          external_url?: string | null
          id?: string
          is_published?: boolean
          published_date?: string | null
          read_time?: string | null
          sort_order?: number
          tags?: string[]
          title: string
        }
        Update: {
          created_at?: string
          excerpt?: string | null
          external_url?: string | null
          id?: string
          is_published?: boolean
          published_date?: string | null
          read_time?: string | null
          sort_order?: number
          tags?: string[]
          title?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          archived_at: string | null
          body: string | null
          budget_range: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          read_at: string | null
          subject: string | null
        }
        Insert: {
          archived_at?: string | null
          body?: string | null
          budget_range?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          read_at?: string | null
          subject?: string | null
        }
        Update: {
          archived_at?: string | null
          body?: string | null
          budget_range?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          read_at?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      experience: {
        Row: {
          bullets: string[]
          company: string
          created_at: string
          id: string
          period: string | null
          role: string
          sort_order: number
          type: string | null
        }
        Insert: {
          bullets?: string[]
          company: string
          created_at?: string
          id?: string
          period?: string | null
          role: string
          sort_order?: number
          type?: string | null
        }
        Update: {
          bullets?: string[]
          company?: string
          created_at?: string
          id?: string
          period?: string | null
          role?: string
          sort_order?: number
          type?: string | null
        }
        Relationships: []
      }
      personal_info: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string | null
          body: string
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          reading_minutes: number
          slug: string
          status: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          reading_minutes?: number
          slug: string
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          reading_minutes?: number
          slug?: string
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          challenges: string | null
          created_at: string
          description: string | null
          docs_url: string | null
          duration: string | null
          featured: boolean
          gallery: string[]
          github_url: string | null
          id: string
          image_url: string | null
          key_features: string[]
          lessons: string | null
          live_url: string | null
          long_description: string | null
          my_role: string | null
          problem: string | null
          readme_url: string | null
          results: string | null
          solution: string | null
          sort_order: number
          stats: Json
          tags: string[]
          team_size: string | null
          tech_stack: string[]
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category?: string | null
          challenges?: string | null
          created_at?: string
          description?: string | null
          docs_url?: string | null
          duration?: string | null
          featured?: boolean
          gallery?: string[]
          github_url?: string | null
          id?: string
          image_url?: string | null
          key_features?: string[]
          lessons?: string | null
          live_url?: string | null
          long_description?: string | null
          my_role?: string | null
          problem?: string | null
          readme_url?: string | null
          results?: string | null
          solution?: string | null
          sort_order?: number
          stats?: Json
          tags?: string[]
          team_size?: string | null
          tech_stack?: string[]
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: string | null
          challenges?: string | null
          created_at?: string
          description?: string | null
          docs_url?: string | null
          duration?: string | null
          featured?: boolean
          gallery?: string[]
          github_url?: string | null
          id?: string
          image_url?: string | null
          key_features?: string[]
          lessons?: string | null
          live_url?: string | null
          long_description?: string | null
          my_role?: string | null
          problem?: string | null
          readme_url?: string | null
          results?: string | null
          solution?: string | null
          sort_order?: number
          stats?: Json
          tags?: string[]
          team_size?: string | null
          tech_stack?: string[]
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      site_visits: {
        Row: {
          created_at: string
          id: string
          path: string
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          path?: string
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          path?: string
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          icon: string | null
          id: string
          level: number | null
          name: string
          sort_order: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          level?: number | null
          name: string
          sort_order?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          level?: number | null
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          id: string
          linkedin_url: string | null
          name: string
          quote: string
          role: string | null
          sort_order: number
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          id?: string
          linkedin_url?: string | null
          name: string
          quote: string
          role?: string | null
          sort_order?: number
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          id?: string
          linkedin_url?: string | null
          name?: string
          quote?: string
          role?: string | null
          sort_order?: number
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
          role?: Database["public"]["Enums"]["app_role"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_visit_count: { Args: never; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
