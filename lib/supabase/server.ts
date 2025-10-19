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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Please check your .env.local file.')
    // Return a mock client for development with proper method chaining
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signIn: () => Promise.resolve({ data: { user: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              order: () => ({
                limit: () => Promise.resolve({ data: [], error: null, count: 0 }),
                range: () => Promise.resolve({ data: [], error: null, count: 0 })
              }),
              limit: () => Promise.resolve({ data: [], error: null, count: 0 }),
              range: () => Promise.resolve({ data: [], error: null, count: 0 })
            }),
            order: () => ({
              limit: () => Promise.resolve({ data: [], error: null, count: 0 }),
              range: () => Promise.resolve({ data: [], error: null, count: 0 })
            }),
            limit: () => Promise.resolve({ data: [], error: null, count: 0 }),
            range: () => Promise.resolve({ data: [], error: null, count: 0 })
          }),
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null, count: 0 }),
            range: () => Promise.resolve({ data: [], error: null, count: 0 })
          }),
          limit: () => Promise.resolve({ data: [], error: null, count: 0 }),
          range: () => Promise.resolve({ data: [], error: null, count: 0 })
        }),
        insert: () => ({
          select: () => Promise.resolve({ data: [], error: null })
        }),
        update: () => ({
          eq: () => ({
            select: () => Promise.resolve({ data: [], error: null })
          }),
          select: () => Promise.resolve({ data: [], error: null })
        }),
        delete: () => ({
          eq: () => Promise.resolve({ data: [], error: null })
        })
      })
    } as any
  }

  const cookieStore = cookies()

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
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
