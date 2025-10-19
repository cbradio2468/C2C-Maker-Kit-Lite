/**
 * SEARCH BAR COMPONENT
 * 
 * This component provides search functionality with category filtering.
 * It includes debounced search, category selection, and clear filters.
 * 
 * LEARNING GOALS:
 * - Understand search input patterns
 * - Learn debouncing for performance
 * - See filter UI patterns
 * - Understand form state management
 * 
 * ACCESSIBILITY NOTES:
 * - Proper form labels and descriptions
 * - Keyboard navigation support
 * - Screen reader announcements
 * - Clear focus management
 */

'use client'

import { useState, useEffect } from 'react'
import { type ResourceCategory } from '@/lib/types'
import { debounce } from '@/lib/utils'

interface SearchBarProps {
  categories: ResourceCategory[]
  onSearch?: (query: string, categoryId: string) => void
  initialQuery?: string
  initialCategory?: string
  placeholder?: string
}

export function SearchBar({
  categories,
  onSearch,
  initialQuery = '',
  initialCategory = '',
  placeholder = 'Search resources...'
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [isSearching, setIsSearching] = useState(false)

  // Debounced search function
  const debouncedSearch = debounce((query: string, categoryId: string) => {
    if (onSearch) {
      onSearch(query, categoryId)
    }
    setIsSearching(false)
  }, 300)

  // Handle search input changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setIsSearching(true)
    debouncedSearch(query, selectedCategory)
  }

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setIsSearching(true)
    debouncedSearch(searchQuery, categoryId)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setIsSearching(true)
    debouncedSearch('', '')
  }

  // Check if any filters are active
  const hasActiveFilters = searchQuery.trim() || selectedCategory

  return (
    <div className="card">
      <div className="space-y-4">
        {/* Search input */}
        <div>
          <label htmlFor="search-input" className="label">
            Search Resources
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400" aria-hidden="true">
                {isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                ) : (
                  '🔍'
                )}
              </span>
            </div>
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={placeholder}
              className="input pl-10 pr-10"
              aria-describedby="search-help"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <p id="search-help" className="text-xs text-gray-500 mt-1">
            Search by name, description, or keywords
          </p>
        </div>

        {/* Category filter */}
        <div>
          <label htmlFor="category-filter" className="label">
            Filter by Category
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="input"
            aria-describedby="category-help"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
          <p id="category-help" className="text-xs text-gray-500 mt-1">
            Filter resources by category
          </p>
        </div>

        {/* Active filters and clear button */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  Search: "{searchQuery}"
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  Category: {categories.find(c => c.id === selectedCategory)?.name}
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Search tips */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Search Tips</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Try searching for specific services like "food bank" or "shelter"</li>
            <li>• Use location names to find resources in your area</li>
            <li>• Search by organization name if you know it</li>
            <li>• Combine search terms with category filters for better results</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

/**
 * USAGE EXAMPLES:
 * 
 * // Basic usage
 * <SearchBar 
 *   categories={categories} 
 *   onSearch={(query, categoryId) => {
 *     // Handle search
 *   }} 
 * />
 * 
 * // With initial values
 * <SearchBar 
 *   categories={categories} 
 *   onSearch={handleSearch}
 *   initialQuery="food bank"
 *   initialCategory="food-category-id"
 * />
 * 
 * // In a page component
 * function ResourcesPage() {
 *   const [searchQuery, setSearchQuery] = useState('')
 *   const [categoryFilter, setCategoryFilter] = useState('')
 *   
 *   const handleSearch = (query: string, categoryId: string) => {
 *     setSearchQuery(query)
 *     setCategoryFilter(categoryId)
 *   }
 *   
 *   return (
 *     <div>
 *       <SearchBar 
 *         categories={categories} 
 *         onSearch={handleSearch} 
 *       />
 *       <ResourceList 
 *         searchQuery={searchQuery} 
 *         categoryFilter={categoryFilter} 
 *       />
 *     </div>
 *   )
 * }
 */
