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
