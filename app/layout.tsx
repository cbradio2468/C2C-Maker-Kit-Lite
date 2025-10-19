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
