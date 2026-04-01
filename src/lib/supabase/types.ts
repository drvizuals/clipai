export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          cover_url: string | null
          status: 'active' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'],
          'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }

      clips: {
        Row: {
          id: string
          project_id: string | null
          user_id: string
          title: string
          description: string | null
          raw_file_url: string | null
          thumbnail_url: string | null
          duration_secs: number | null
          file_size_bytes: number | null
          mime_type: string | null
          transcript: string | null
          status: 'uploading' | 'processing' | 'ready' | 'failed'
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['clips']['Row'],
          'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['clips']['Insert']>
      }

      platform_connections: {
        Row: {
          id: string
          user_id: string
          platform: 'youtube' | 'tiktok' | 'instagram' | 'linkedin' | 'twitter' | 'threads' | 'snapchat'
          platform_user_id: string | null
          platform_username: string | null
          platform_avatar_url: string | null
          access_token: string | null
          refresh_token: string | null
          token_expires_at: string | null
          scopes: string[] | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['platform_connections']['Row'],
          'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['platform_connections']['Insert']>
      }

      distributions: {
        Row: {
          id: string
          clip_id: string
          user_id: string
          platform: 'youtube' | 'tiktok' | 'instagram' | 'linkedin' | 'twitter' | 'threads' | 'snapchat'
          platform_post_id: string | null
          platform_post_url: string | null
          status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed'
          title: string | null
          description: string | null
          hashtags: string[] | null
          formatted_file_url: string | null
          thumbnail_url: string | null
          aspect_ratio: string | null
          scheduled_at: string | null
          published_at: string | null
          error_message: string | null
          ai_suggestions: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['distributions']['Row'],
          'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['distributions']['Insert']>
      }

      clip_analytics: {
        Row: {
          id: string
          distribution_id: string
          user_id: string
          platform: string
          views: number
          likes: number
          comments: number
          shares: number
          saves: number
          watch_time_secs: number
          avg_watch_pct: number | null
          click_through_rate: number | null
          impressions: number
          reach: number
          raw_payload: Json
          recorded_at: string
        }
        Insert: Omit<Database['public']['Tables']['clip_analytics']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['clip_analytics']['Insert']>
      }

      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: 'free' | 'creator' | 'pro' | 'business'
          status: 'active' | 'trialing' | 'past_due' | 'cancelled' | 'unpaid' | 'paused'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          current_period_start: string | null
          current_period_end: string | null
          trial_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'],
          'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>
      }

      brand_kits: {
        Row: {
          id: string
          user_id: string
          name: string
          is_default: boolean
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          font_family: string | null
          watermark_url: string | null
          watermark_opacity: number | null
          watermark_position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | null
          intro_clip_url: string | null
          outro_clip_url: string | null
          caption_style: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['brand_kits']['Row'],
          'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['brand_kits']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Convenience row types
export type Project            = Database['public']['Tables']['projects']['Row']
export type Clip               = Database['public']['Tables']['clips']['Row']
export type PlatformConnection = Database['public']['Tables']['platform_connections']['Row']
export type Distribution       = Database['public']['Tables']['distributions']['Row']
export type ClipAnalytics      = Database['public']['Tables']['clip_analytics']['Row']
export type Subscription       = Database['public']['Tables']['subscriptions']['Row']
export type BrandKit           = Database['public']['Tables']['brand_kits']['Row']

export type Platform = PlatformConnection['platform']
