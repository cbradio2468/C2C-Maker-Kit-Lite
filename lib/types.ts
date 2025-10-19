/**
 * TYPESCRIPT TYPES - Database Schema Types
 * 
 * This file contains TypeScript types that match our database schema.
 * These types ensure type safety throughout the application.
 * 
 * LEARNING GOALS:
 * - Understand TypeScript type definitions
 * - Learn how to type database schemas
 * - See the relationship between SQL and TypeScript
 * - Understand type safety benefits
 * 
 * HOW TO GENERATE THESE TYPES:
 * 1. Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID
 * 2. Copy the generated types here
 * 3. Update as your schema changes
 */

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          preferred_language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          preferred_language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          preferred_language?: string
          created_at?: string
          updated_at?: string
        }
      }
      resource_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          display_order?: number
          created_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          name: string
          description: string
          category_id: string | null
          phone: string | null
          email: string | null
          website: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          latitude: number | null
          longitude: number | null
          eligibility_criteria: string | null
          documents_required: string | null
          languages_spoken: string[] | null
          hours_of_operation: string | null
          is_currently_accepting: boolean
          capacity_status: string | null
          name_es: string | null
          description_es: string | null
          created_by: string | null
          verified_by: string | null
          is_verified: boolean
          verification_date: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          category_id?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          latitude?: number | null
          longitude?: number | null
          eligibility_criteria?: string | null
          documents_required?: string | null
          languages_spoken?: string[] | null
          hours_of_operation?: string | null
          is_currently_accepting?: boolean
          capacity_status?: string | null
          name_es?: string | null
          description_es?: string | null
          created_by?: string | null
          verified_by?: string | null
          is_verified?: boolean
          verification_date?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category_id?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          latitude?: number | null
          longitude?: number | null
          eligibility_criteria?: string | null
          documents_required?: string | null
          languages_spoken?: string[] | null
          hours_of_operation?: string | null
          is_currently_accepting?: boolean
          capacity_status?: string | null
          name_es?: string | null
          description_es?: string | null
          created_by?: string | null
          verified_by?: string | null
          is_verified?: boolean
          verification_date?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      resource_views: {
        Row: {
          id: string
          resource_id: string
          user_id: string | null
          viewed_at: string
          user_agent: string | null
          ip_address: string | null
        }
        Insert: {
          id?: string
          resource_id: string
          user_id?: string | null
          viewed_at?: string
          user_agent?: string | null
          ip_address?: string | null
        }
        Update: {
          id?: string
          resource_id?: string
          user_id?: string | null
          viewed_at?: string
          user_agent?: string | null
          ip_address?: string | null
        }
      }
      resource_feedback: {
        Row: {
          id: string
          resource_id: string
          user_id: string | null
          was_helpful: boolean | null
          feedback_text: string | null
          issue_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          resource_id: string
          user_id?: string | null
          was_helpful?: boolean | null
          feedback_text?: string | null
          issue_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          resource_id?: string
          user_id?: string | null
          was_helpful?: boolean | null
          feedback_text?: string | null
          issue_type?: string | null
          created_at?: string
        }
      }
      saved_resources: {
        Row: {
          id: string
          user_id: string
          resource_id: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resource_id: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resource_id?: string
          notes?: string | null
          created_at?: string
        }
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
  }
}

// Convenience types for common operations
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Resource = Database['public']['Tables']['resources']['Row']
export type ResourceCategory = Database['public']['Tables']['resource_categories']['Row']
export type ResourceView = Database['public']['Tables']['resource_views']['Row']
export type ResourceFeedback = Database['public']['Tables']['resource_feedback']['Row']
export type SavedResource = Database['public']['Tables']['saved_resources']['Row']

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ResourceInsert = Database['public']['Tables']['resources']['Insert']
export type ResourceCategoryInsert = Database['public']['Tables']['resource_categories']['Insert']

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type ResourceUpdate = Database['public']['Tables']['resources']['Update']
export type ResourceCategoryUpdate = Database['public']['Tables']['resource_categories']['Update']

/**
 * EXAMPLE USAGE:
 * 
 * // Type-safe database queries
 * const { data: resources } = await supabase
 *   .from('resources')
 *   .select('*')
 *   .returns<Resource[]>()
 * 
 * // Type-safe form data
 * const handleSubmit = (data: ResourceInsert) => {
 *   // TypeScript will catch any missing required fields
 *   supabase.from('resources').insert(data)
 * }
 * 
 * // Type-safe component props
 * interface ResourceCardProps {
 *   resource: Resource
 *   onEdit: (resource: ResourceUpdate) => void
 * }
 */
