/**
 * SUPABASE MIDDLEWARE - Authentication Middleware
 * 
 * This middleware handles authentication for protected routes.
 * It runs on every request and ensures users are properly authenticated.
 * 
 * LEARNING GOALS:
 * - Understand Next.js middleware
 * - Learn how to protect routes
 * - See authentication flow in action
 * - Understand security patterns
 * 
 * SECURITY NOTES:
 * - Middleware runs before your pages load
 * - Perfect for authentication checks
 * - Can redirect users to login pages
 * - Runs on the Edge Runtime for performance
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware function that runs on every request
 * 
 * WHY USE MIDDLEWARE:
 * - Runs before pages load (faster than page-level checks)
 * - Can redirect users before they see protected content
 * - Centralized authentication logic
 * - Better user experience (no flash of protected content)
 * 
 * PROTECTED ROUTES:
 * - /resource-finder/new (create resource)
 * - /profile (user profile)
 * - /admin (admin functions)
 * 
 * PUBLIC ROUTES:
 * - / (homepage)
 * - /resource-finder (list resources)
 * - /resource-finder/[id] (view resource)
 * - /auth/* (authentication pages)
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define protected routes
  const protectedRoutes = [
    '/resource-finder/new',
    '/profile',
    '/admin',
  ]

  // Define auth routes (redirect if already logged in)
  const authRoutes = [
    '/auth/signin',
    '/auth/signup',
  ]

  const { pathname } = request.nextUrl

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/auth/signin', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect authenticated users from auth routes
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

/**
 * CONFIGURATION
 * 
 * This tells Next.js which paths to run the middleware on.
 * Use this to optimize performance by only running middleware
 * on routes that need it.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

/**
 * EXAMPLE USAGE:
 * 
 * When a user tries to access /resource-finder/new:
 * 1. Middleware runs first
 * 2. Checks if user is authenticated
 * 3. If not authenticated: redirects to /auth/signin?redirectTo=/resource-finder/new
 * 4. If authenticated: allows access to the page
 * 
 * When a user tries to access /auth/signin while logged in:
 * 1. Middleware runs first
 * 2. Checks if user is authenticated
 * 3. If authenticated: redirects to homepage
 * 4. If not authenticated: allows access to signin page
 */

/**
 * SECURITY BENEFITS:
 * 
 * ✅ Prevents unauthorized access to protected routes
 * ✅ Centralized authentication logic
 * ✅ No flash of protected content
 * ✅ Automatic redirects for better UX
 * ✅ Runs on Edge Runtime for performance
 * 
 * ⚠️ IMPORTANT NOTES:
 * - Middleware runs on every request (keep it fast)
 * - Limited to Edge Runtime APIs
 * - Can't access Node.js APIs
 * - Keep logic simple and focused
 */
