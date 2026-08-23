/**
 * NEXA V1 — Supabase Database TypeScript Definitions
 */

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
      restaurants: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          welcome_message: string | null
          banner_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          welcome_message?: string | null
          banner_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo_url?: string | null
          welcome_message?: string | null
          banner_text?: string | null
          created_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          whatsapp_number: string
          points: number
          status_badge: string
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          whatsapp_number: string
          points?: number
          status_badge?: string
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          whatsapp_number?: string
          points?: number
          status_badge?: string
          created_at?: string
        }
      }
      rewards: {
        Row: {
          id: string
          restaurant_id: string
          title: string
          description: string | null
          points_cost: number
          category: string
          icon: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          title: string
          description?: string | null
          points_cost: number
          category?: string
          icon?: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          title?: string
          description?: string | null
          points_cost?: number
          category?: string
          icon?: string
          is_active?: boolean
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          restaurant_id: string
          title: string
          message: string
          date: string
          expiration_date: string
          is_flash_offer: boolean
          icon: string
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          title: string
          message: string
          date: string
          expiration_date: string
          is_flash_offer?: boolean
          icon?: string
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          title?: string
          message?: string
          date?: string
          expiration_date?: string
          is_flash_offer?: boolean
          icon?: string
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          restaurant_id: string
          client_id: string
          type: 'scan' | 'claim'
          title: string
          points: number
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          client_id: string
          type: 'scan' | 'claim'
          title: string
          points: number
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          client_id?: string
          type?: 'scan' | 'claim'
          title?: string
          points?: number
          created_at?: string
        }
      }
    }
  }
}
