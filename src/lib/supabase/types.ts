export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          status: 'uploading' | 'transcribing' | 'analyzing' | 'ready' | 'error'
          original_video_url: string | null
          duration: number | null
          transcript: Json | null
          industry: 'founder' | 'agency' | 'real_estate' | 'hotel' | 'spa' | 'restaurant' | 'saas' | 'general'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      clips: {
        Row: {
          id: string
          project_id: string
          user_id: string
          title: string | null
          start_time: number
          end_time: number
          hook_score: number | null
          viral_score: number | null
          retention_score: number | null
          platform: string | null
          caption: string | null
          hook_line: string | null
          cta: string | null
          hashtags: string[] | null
          thumbnail_url: string | null
          status: 'draft' | 'rendering' | 'rendered' | 'scheduled' | 'published'
          rendered_url: string | null
          caption_style: 'karaoke' | 'bold_pop' | 'minimal'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['clips']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['clips']['Insert']>
      }
      distributions: {
        Row: {
          id: string
          clip_id: string
          user_id: string
          platform: string
          status: 'scheduled' | 'publishing' | 'published' | 'failed'
          scheduled_for: string | null
          published_at: string | null
          platform_post_id: string | null
          platform_url: string | null
          error_message: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['distributions']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['distributions']['Insert']>
      }
      platform_connections: {
        Row: {
          id: string
          user_id: string
          platform: string
          access_token: string | null
          refresh_token: string | null
          expires_at: string | null
          platform_user_id: string | null
          platform_username: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['platform_connections']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['platform_connections']['Insert']>
      }
      clip_analytics: {
        Row: {
          id: string
          clip_id: string
          distribution_id: string
          platform: string | null
          views: number
          likes: number
          comments: number
          shares: number
          saves: number
          watch_time: number
          synced_at: string
        }
        Insert: Omit<Database['public']['Tables']['clip_analytics']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['clip_analytics']['Insert']>
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          plan: 'free' | 'creator' | 'agency' | 'enterprise'
          clips_used: number
          clips_limit: number
          current_period_end: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>
      }
      brand_kits: {
        Row: {
          id: string
          user_id: string
          name: string | null
          logo_url: string | null
          primary_color: string
          secondary_color: string
          font_family: string
          caption_style: 'karaoke' | 'bold_pop' | 'minimal'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['brand_kits']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['brand_kits']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type Project            = Database['public']['Tables']['projects']['Row']
export type Clip               = Database['public']['Tables']['clips']['Row']
export type Distribution       = Database['public']['Tables']['distributions']['Row']
export type PlatformConnection = Database['public']['Tables']['platform_connections']['Row']
export type ClipAnalytics      = Database['public']['Tables']['clip_analytics']['Row']
export type Subscription       = Database['public']['Tables']['subscriptions']['Row']
export type BrandKit           = Database['public']['Tables']['brand_kits']['Row']
