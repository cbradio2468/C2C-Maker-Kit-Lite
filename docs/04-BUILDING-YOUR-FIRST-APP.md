# Building Your First App

## 🎯 Let's Build Something Real

In this tutorial, we'll build a complete Resource Finder application step by step. You'll learn how to:

- Set up a Next.js project with TypeScript
- Connect to Supabase for database and authentication
- Build secure, accessible user interfaces
- Implement CRUD operations
- Add search functionality
- Deploy your application

**Time Required**: 2-3 hours  
**Prerequisites**: Completed [Getting Started](./01-GETTING-STARTED.md)

## 🏗️ Project Structure Overview

```
example-app/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Landing page
│   ├── resource-finder/         # Resource finder pages
│   │   ├── page.tsx            # Resource listing
│   │   ├── [id]/page.tsx       # Resource detail
│   │   ├── new/page.tsx        # Create resource
│   │   └── components/         # Reusable components
│   └── api/                     # API routes
├── lib/                         # Utilities and configurations
│   ├── supabase/               # Supabase client setup
│   ├── types.ts                # TypeScript definitions
│   └── utils.ts                # Helper functions
└── database/                   # Database schema and migrations
    ├── schema.sql              # Complete database schema
    └── seed.sql                # Sample data
```

## Step 1: Set Up the Next.js Project

### Create the App Directory Structure

```bash
mkdir -p example-app/app/resource-finder/components
mkdir -p example-app/lib/supabase
mkdir -p example-app/database
```

### Create the Root Layout

**File**: `example-app/app/layout.tsx`

```tsx
/**
 * ROOT LAYOUT - Next.js App Router
 * 
 * This is the root layout that wraps all pages.
 * It includes:
 * - Global styles and fonts
 * - Navigation header
 * - Authentication state
 * - Error boundaries
 * 
 * LEARNING GOALS:
 * - Understand Next.js App Router structure
 * - Learn how to share components across pages
 * - See authentication state management
 * - Understand accessibility best practices
 */

import './globals.css'
import { Inter } from 'next/font/google'
import { Navigation } from './components/Navigation'
import { AuthProvider } from './components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Resource Finder - C2C Community Starter',
  description: 'Find local resources to help your community',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
```

### Create Global Styles

**File**: `example-app/app/globals.css`

```css
/**
 * GLOBAL STYLES - Tailwind CSS Base
 * 
 * This file imports Tailwind CSS and adds custom styles.
 * 
 * LEARNING GOALS:
 * - Understand Tailwind CSS setup
 * - Learn about CSS custom properties
 * - See accessibility-focused styling
 * - Understand responsive design patterns
 */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom CSS Variables for consistent theming */
:root {
  --color-primary: #0ea5e9;
  --color-primary-dark: #0284c7;
  --color-secondary: #64748b;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}

/* Base styles for better accessibility */
@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }
  
  /* Focus styles for keyboard navigation */
  *:focus-visible {
    @apply outline-none ring-2 ring-primary-500 ring-offset-2;
  }
  
  /* Better text rendering */
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

/* Component styles */
@layer components {
  .btn-primary {
    @apply bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors;
  }
  
  .btn-secondary {
    @apply bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
  }
  
  .input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500;
  }
  
  .label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }
}

/* Utility classes */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

## Step 2: Set Up Supabase Integration

### Create Supabase Client

**File**: `example-app/lib/supabase/client.ts`

```typescript
/**
 * SUPABASE CLIENT - Browser Client
 * 
 * This file sets up the Supabase client for use in CLIENT COMPONENTS.
 * 
 * LEARNING GOALS:
 * - Understand client-side vs server-side Supabase clients
 * - Learn when to use each type
 * - See proper environment variable usage
 * - Understand authentication flow
 * 
 * SECURITY NOTES:
 * - This client uses the ANON key (safe to expose to browsers)
 * - RLS policies protect your data even with this public key
 * - Never put your SERVICE_ROLE key in client-side code!
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '../types'

/**
 * Creates a Supabase client for use in Client Components
 * 
 * WHY: In Next.js App Router, we need different clients for:
 * - Client Components (this file) - uses browser cookies
 * - Server Components (server.ts) - uses server cookies
 * - Route Handlers (middleware.ts) - uses middleware cookies
 * 
 * WHEN TO USE THIS:
 * - In 'use client' components
 * - When you need real-time subscriptions
 * - When handling user interactions (forms, buttons, etc.)
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * EXAMPLE USAGE IN A CLIENT COMPONENT:
 * 
 * 'use client'
 * 
 * import { createClient } from '@/lib/supabase/client'
 * import { useEffect, useState } from 'react'
 * 
 * export function ResourceList() {
 *   const [resources, setResources] = useState([])
 *   const supabase = createClient()
 * 
 *   useEffect(() => {
 *     async function fetchResources() {
 *       const { data } = await supabase
 *         .from('resources')
 *         .select('*')
 *         .limit(10)
 *       
 *       setResources(data || [])
 *     }
 * 
 *     fetchResources()
 *   }, [])
 * 
 *   return (
 *     <div>
 *       {resources.map(resource => (
 *         <div key={resource.id}>{resource.name}</div>
 *       ))}
 *     </div>
 *   )
 * }
 */

/**
 * SECURITY CHECKLIST FOR STUDENTS:
 * 
 * ✅ DO:
 * - Use this client in 'use client' components
 * - Rely on RLS policies to protect data
 * - Handle authentication state properly
 * - Show loading states while fetching
 * 
 * ❌ DON'T:
 * - Expose SERVICE_ROLE key (use anon key only)
 * - Trust client-side validation alone (validate on server too)
 * - Store sensitive data in localStorage
 * - Assume the user is who they claim to be (verify with RLS)
 */
```

### Create Supabase Server Client

**File**: `example-app/lib/supabase/server.ts`

```typescript
/**
 * SUPABASE SERVER CLIENT - Server Components
 * 
 * This file sets up the Supabase client for use in SERVER COMPONENTS.
 * 
 * LEARNING GOALS:
 * - Understand server-side Supabase usage
 * - Learn when server components are better than client components
 * - See proper cookie handling
 * - Understand security benefits
 * 
 * SECURITY NOTES:
 * - Server components are MORE SECURE than client components
 * - Data never leaves the server until you send it to client
 * - Perfect for sensitive operations
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '../types'

/**
 * Creates a Supabase client for use in Server Components and Route Handlers
 * 
 * WHY USE SERVER COMPONENTS:
 * - Better security (code never sent to browser)
 * - Faster initial page loads (no client-side JS needed)
 * - Direct database access (no API layer needed)
 * - SEO-friendly (content rendered on server)
 * 
 * WHEN TO USE THIS:
 * - Fetching data for initial page load
 * - Operations that require SERVICE_ROLE access
 * - When you need to hide business logic
 * - For better performance on slow devices
 */
export async function createClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookies in Server Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookies in Server Components
          }
        },
      },
    }
  )
}

/**
 * EXAMPLE USAGE IN A SERVER COMPONENT:
 * 
 * import { createClient } from '@/lib/supabase/server'
 * 
 * export default async function ResourcesPage() {
 *   const supabase = await createClient()
 *   
 *   // This query happens on the server - never exposed to client
 *   const { data: resources } = await supabase
 *     .from('resources')
 *     .select('*')
 *     .limit(10)
 *   
 *   // Data is rendered on server, sent as HTML to client
 *   return (
 *     <div>
 *       {resources?.map(resource => (
 *         <div key={resource.id}>{resource.name}</div>
 *       ))}
 *     </div>
 *   )
 * }
 * 
 * // This is a SERVER COMPONENT (no 'use client')
 * // Benefits:
 * // - Faster initial load
 * // - Better SEO
 * // - More secure
 * // - Less JavaScript sent to browser
 */

/**
 * WHEN TO USE SERVER VS CLIENT:
 * 
 * Use SERVER COMPONENT (this file) when:
 * ✅ Fetching data for initial page render
 * ✅ Need to hide business logic
 * ✅ Want better performance on slow devices
 * ✅ Need SEO (search engines see content)
 * 
 * Use CLIENT COMPONENT (client.ts) when:
 * ✅ Need user interactivity (forms, buttons)
 * ✅ Need real-time subscriptions
 * ✅ Using React hooks (useState, useEffect)
 * ✅ Need browser APIs (localStorage, etc.)
 * 
 * PRO TIP: Start with Server Components, only add 'use client'
 * when you actually need it!
 */

/**
 * SECURITY BEST PRACTICES:
 * 
 * ✅ DO:
 * - Use Server Components for sensitive operations
 * - Keep business logic on server when possible
 * - Validate data on server even if validated on client
 * - Use RLS policies as your last line of defense
 * 
 * ❌ DON'T:
 * - Trust client-side validation alone
 * - Expose sensitive business logic in Client Components
 * - Bypass RLS policies (even on server)
 * - Store secrets in environment variables accessible to client
 */
```

### Create TypeScript Types

**File**: `example-app/lib/types.ts`

```typescript
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
```

## Step 3: Create Authentication Components

### Auth Provider Component

**File**: `example-app/app/components/AuthProvider.tsx`

```tsx
/**
 * AUTH PROVIDER - Authentication Context
 * 
 * This component provides authentication state to the entire app.
 * It manages user login/logout and provides user data to child components.
 * 
 * LEARNING GOALS:
 * - Understand React Context for state management
 * - Learn how to handle authentication state
 * - See proper error handling patterns
 * - Understand loading states
 * 
 * SECURITY NOTES:
 * - Never store sensitive data in React state
 * - Always validate authentication on the server
 * - Handle authentication errors gracefully
 */

'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    loading,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### Navigation Component

**File**: `example-app/app/components/Navigation.tsx`

```tsx
/**
 * NAVIGATION COMPONENT - App Header
 * 
 * This component provides the main navigation for the app.
 * It shows different options based on authentication state.
 * 
 * LEARNING GOALS:
 * - Understand conditional rendering
 * - Learn accessibility best practices for navigation
 * - See how to handle authentication state in UI
 * - Understand responsive design patterns
 * 
 * ACCESSIBILITY NOTES:
 * - Uses semantic HTML (nav, ul, li)
 * - Includes proper ARIA labels
 * - Keyboard navigation friendly
 * - Screen reader accessible
 */

'use client'

import Link from 'next/link'
import { useAuth } from './AuthProvider'

export function Navigation() {
  const { user, loading, signOut } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-xl font-bold text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
            aria-label="Resource Finder - Go to homepage"
          >
            Resource Finder
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/resource-finder" 
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Find Resources
            </Link>

            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" aria-label="Loading user information" />
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/resource-finder/new" 
                  className="btn-primary"
                >
                  Add Resource
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700" aria-label={`Logged in as ${user.email}`}>
                    {user.email}
                  </span>
                  <button
                    onClick={signOut}
                    className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                    aria-label="Sign out"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  href="/auth/signin" 
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
```

## Step 4: Create the Landing Page

**File**: `example-app/app/page.tsx`

```tsx
/**
 * LANDING PAGE - Homepage
 * 
 * This is the main landing page that introduces the Resource Finder app.
 * It explains what the app does and encourages users to get started.
 * 
 * LEARNING GOALS:
 * - Understand Next.js page structure
 * - Learn about Server Components vs Client Components
 * - See how to create engaging landing pages
 * - Understand accessibility in page design
 * 
 * DESIGN NOTES:
 * - Uses semantic HTML structure
 * - Includes clear call-to-action buttons
 * - Mobile-responsive design
 * - Accessible to screen readers
 */

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Get some stats to show on the landing page
  const { count: resourceCount } = await supabase
    .from('resources')
    .select('*', { count: 'exact', head: true })
    .eq('deleted_at', null)

  const { count: categoryCount } = await supabase
    .from('resource_categories')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Find Resources That Help Your Community
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover local food banks, shelters, healthcare services, and more. 
          Built by the community, for the community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/resource-finder" 
            className="btn-primary text-lg px-8 py-3"
            aria-label="Start finding resources in your community"
          >
            Find Resources
          </Link>
          <Link 
            href="/resource-finder/new" 
            className="btn-secondary text-lg px-8 py-3"
            aria-label="Add a new resource to help others"
          >
            Add a Resource
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="card">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {resourceCount || 0}
            </div>
            <div className="text-gray-600">Resources Available</div>
          </div>
          <div className="card">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {categoryCount || 0}
            </div>
            <div className="text-gray-600">Categories</div>
          </div>
          <div className="card">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              Free
            </div>
            <div className="text-gray-600">Always Free to Use</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 border-t border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Search</h3>
            <p className="text-gray-600">
              Find resources by category, location, or keyword. 
              Filter by what you need most.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Locate</h3>
            <p className="text-gray-600">
              Get contact information, hours, and directions. 
              See what documents you need to bring.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect</h3>
            <p className="text-gray-600">
              Reach out directly to get help. 
              Leave feedback to help others.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 border-t border-gray-200 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Help Your Community?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of people who are making a difference in their communities.
        </p>
        <Link 
          href="/resource-finder" 
          className="btn-primary text-lg px-8 py-3"
          aria-label="Start using Resource Finder now"
        >
          Get Started Today
        </Link>
      </section>
    </div>
  )
}
```

This completes the first part of building the Resource Finder app. The foundation is now set up with:

✅ Next.js project structure  
✅ Supabase integration  
✅ Authentication system  
✅ Landing page  
✅ Navigation component  

In the next steps, we'll build the resource listing page, detail pages, and forms. The app is already functional and you can run it with `pnpm dev`!

---

**Next Steps**: Continue building the resource finder pages and components. The foundation is solid and ready for the main functionality.

Next: [Security Basics →](./05-SECURITY-BASICS.md)
