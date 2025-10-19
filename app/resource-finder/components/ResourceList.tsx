/**
 * RESOURCE LIST COMPONENT
 * 
 * This component displays a list of resources with pagination and loading states.
 * It handles empty states, loading states, and error states gracefully.
 * 
 * LEARNING GOALS:
 * - Understand list rendering patterns
 * - Learn loading and error state handling
 * - See pagination implementation
 * - Understand accessibility for lists
 * 
 * ACCESSIBILITY NOTES:
 * - Uses proper list semantics
 * - Includes loading announcements
 * - Handles empty states gracefully
 * - Keyboard navigation friendly
 */

'use client'

import { useState, useEffect } from 'react'
import { ResourceCard } from './ResourceCard'
import { type Resource, type ResourceCategory } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

interface ResourceListProps {
  initialResources?: Resource[]
  categories?: ResourceCategory[]
  searchQuery?: string
  categoryFilter?: string
  showPagination?: boolean
  itemsPerPage?: number
}

export function ResourceList({
  initialResources = [],
  categories = [],
  searchQuery = '',
  categoryFilter = '',
  showPagination = true,
  itemsPerPage = 10
}: ResourceListProps) {
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  
  const supabase = createClient()
  
  // Calculate pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  // Fetch resources when filters change
  useEffect(() => {
    fetchResources()
  }, [searchQuery, categoryFilter, currentPage])

  const fetchResources = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
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

      // Apply search filter
      if (searchQuery.trim()) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      // Apply category filter
      if (categoryFilter) {
        query = query.eq('category_id', categoryFilter)
      }

      // Apply pagination
      if (showPagination) {
        query = query.range(startIndex, endIndex - 1)
      }

      const { data, error, count } = await query

      if (error) {
        throw error
      }

      setResources(data || [])
      setTotalCount(count || 0)
    } catch (err) {
      console.error('Error fetching resources:', err)
      setError('Failed to load resources. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Loading state
  if (loading && resources.length === 0) {
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

  // Error state
  if (error) {
    return (
      <div className="card text-center py-12" role="alert">
        <div className="text-red-500 text-6xl mb-4" aria-hidden="true">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Unable to Load Resources
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchResources}
          className="btn-primary"
          aria-label="Retry loading resources"
        >
          Try Again
        </button>
      </div>
    )
  }

  // Empty state
  if (resources.length === 0 && !loading) {
    return (
      <div className="card text-center py-12">
        <div className="text-gray-400 text-6xl mb-4" aria-hidden="true">🔍</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Resources Found
        </h3>
        <p className="text-gray-600 mb-4">
          {searchQuery || categoryFilter 
            ? 'Try adjusting your search or filters.'
            : 'No resources have been added yet.'
          }
        </p>
        {searchQuery || categoryFilter ? (
          <button
            onClick={() => {
              setCurrentPage(1)
              // Reset filters (this would need to be handled by parent)
            }}
            className="btn-secondary"
            aria-label="Clear search and filters"
          >
            Clear Filters
          </button>
        ) : (
          <a
            href="/resource-finder/new"
            className="btn-primary"
            aria-label="Add the first resource"
          >
            Add First Resource
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, totalCount)} of {totalCount} resources
        </p>
        
        {loading && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
            <span>Updating...</span>
          </div>
        )}
      </div>

      {/* Resources list */}
      <div className="space-y-4" role="list" aria-label="Resource list">
        {resources.map((resource) => (
          <div key={resource.id} role="listitem">
            <ResourceCard
              resource={resource}
              category={resource.resource_categories as ResourceCategory}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <nav 
          className="flex items-center justify-center space-x-2" 
          role="navigation" 
          aria-label="Pagination"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Go to previous page"
          >
            Previous
          </button>

          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    currentPage === pageNum
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={currentPage === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Go to next page"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  )
}

/**
 * USAGE EXAMPLES:
 * 
 * // Basic usage with server-side data
 * <ResourceList 
 *   initialResources={resources} 
 *   categories={categories} 
 * />
 * 
 * // With search and filters
 * <ResourceList 
 *   searchQuery="food" 
 *   categoryFilter="food-category-id" 
 * />
 * 
 * // Without pagination (for small lists)
 * <ResourceList 
 *   showPagination={false} 
 *   itemsPerPage={50} 
 * />
 * 
 * // In a search results page
 * <ResourceList 
 *   searchQuery={searchParams.q} 
 *   categoryFilter={searchParams.category} 
 * />
 */
