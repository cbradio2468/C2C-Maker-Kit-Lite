/**
 * RESOURCE FINDER PAGE - Main Resource Listing
 * 
 * This page displays the main resource listing with search and filtering.
 * It uses Server Components for initial data loading and Client Components
 * for interactive features.
 * 
 * LEARNING GOALS:
 * - Understand Server Component data fetching
 * - Learn how to combine Server and Client Components
 * - See search and filtering implementation
 * - Understand page-level state management
 * 
 * PERFORMANCE NOTES:
 * - Initial data loaded on server (faster)
 * - Search/filtering handled on client (interactive)
 * - Pagination reduces data transfer
 * - Images lazy-loaded for performance
 */

import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ResourceList } from './components/ResourceList'
import { SearchBar } from './components/SearchBar'
import { DemoModeNotice } from '@/app/components/DemoModeNotice'
import { type ResourceCategory } from '@/lib/types'

// Loading component for Suspense
function ResourceListSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading resources">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="card animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      ))}
      <p className="sr-only">Loading resources...</p>
    </div>
  )
}

export default async function ResourceFinderPage() {
  const supabase = await createClient()
  
  // Fetch initial data on the server
  const [
    { data: categories },
    { data: initialResources, count: totalCount }
  ] = await Promise.all([
    supabase
      .from('resource_categories')
      .select('*')
      .order('display_order'),
    
    supabase
      .from('resources')
      .select(`
        *,
        resource_categories (
          id,
          name,
          slug,
          icon
        )
      `)
      .eq('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(10)
  ])

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Find Community Resources
        </h1>
        <p className="text-lg text-gray-600">
          Discover local organizations and services that can help you and your community.
        </p>
      </div>

      {/* Demo Mode Notice */}
      <DemoModeNotice />

      {/* Search and Filters */}
      <div className="mb-8">
        <SearchBar 
          categories={categories || []} 
        />
      </div>

      {/* Resources List */}
      <Suspense fallback={<ResourceListSkeleton />}>
        <ResourceList 
          initialResources={initialResources || []}
          categories={categories || []}
          showPagination={true}
          itemsPerPage={10}
        />
      </Suspense>

      {/* Help Section */}
      <div className="mt-12 card bg-primary-50 border-primary-200">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">
          Need Help Finding Resources?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-primary-900 mb-2">
              Search Tips
            </h3>
            <ul className="text-sm text-primary-700 space-y-1">
              <li>• Try searching for specific services like "food bank" or "shelter"</li>
              <li>• Use location names to find resources in your area</li>
              <li>• Search by organization name if you know it</li>
              <li>• Combine search terms with category filters</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-primary-900 mb-2">
              Can't Find What You Need?
            </h3>
            <ul className="text-sm text-primary-700 space-y-1">
              <li>• Try different search terms</li>
              <li>• Check if the resource is in a different category</li>
              <li>• Contact local organizations directly</li>
              <li>• Add a resource if you know of one</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * METADATA
 * 
 * This helps with SEO and social media sharing
 */
export const metadata = {
  title: 'Find Resources - Resource Finder',
  description: 'Discover local community resources including food banks, shelters, healthcare services, and more.',
}
