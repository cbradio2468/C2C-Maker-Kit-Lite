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

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
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
