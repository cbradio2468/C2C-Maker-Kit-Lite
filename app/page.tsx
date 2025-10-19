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
import { DemoModeNotice } from '@/app/components/DemoModeNotice'

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
      {/* Demo Mode Notice */}
      <DemoModeNotice />
      
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
