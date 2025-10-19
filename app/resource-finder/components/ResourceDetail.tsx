/**
 * RESOURCE DETAIL COMPONENT
 * 
 * This component displays detailed information about a single resource.
 * It includes all resource information, contact details, and action buttons.
 * 
 * LEARNING GOALS:
 * - Understand detail page patterns
 * - Learn how to display complex data
 * - See action button implementations
 * - Understand accessibility for detail views
 * 
 * ACCESSIBILITY NOTES:
 * - Uses semantic HTML structure
 * - Includes proper headings hierarchy
 * - Action buttons have clear labels
 * - Contact information is properly formatted
 */

import Link from 'next/link'
import { type Resource, type ResourceCategory } from '@/lib/types'
import { formatPhone, formatAddress, formatDate } from '@/lib/utils'

interface ResourceDetailProps {
  resource: Resource
  category?: ResourceCategory
}

export function ResourceDetail({ resource, category }: ResourceDetailProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {category && (
              <span 
                className="text-4xl" 
                role="img" 
                aria-label={`${category.name} category`}
              >
                {category.icon}
              </span>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {resource.name}
              </h1>
              {category && (
                <p className="text-lg text-gray-600">
                  {category.name}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {resource.is_verified && (
              <span 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                aria-label="Verified resource"
              >
                ✓ Verified
              </span>
            )}
            <span className="text-sm text-gray-500">
              Added {formatDate(resource.created_at)}
            </span>
          </div>
        </div>

        <p className="text-lg text-gray-700 leading-relaxed">
          {resource.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            
            <div className="space-y-4">
              {resource.phone && (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 text-xl" aria-hidden="true">📞</span>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <a 
                      href={`tel:${resource.phone}`}
                      className="text-lg font-medium text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                    >
                      {formatPhone(resource.phone)}
                    </a>
                  </div>
                </div>
              )}
              
              {resource.email && (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 text-xl" aria-hidden="true">✉️</span>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <a 
                      href={`mailto:${resource.email}`}
                      className="text-lg font-medium text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                    >
                      {resource.email}
                    </a>
                  </div>
                </div>
              )}
              
              {resource.website && (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 text-xl" aria-hidden="true">🌐</span>
                  <div>
                    <p className="text-sm text-gray-600">Website</p>
                    <a 
                      href={resource.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-medium text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          {(resource.address || resource.city) && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-gray-400 text-xl mt-1" aria-hidden="true">📍</span>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {formatAddress(resource.address, resource.city, resource.state, resource.zip_code)}
                    </p>
                  </div>
                </div>
                
                {/* Map placeholder - in a real app, you'd integrate with Google Maps or similar */}
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                  <p className="text-gray-500">Map would be displayed here</p>
                </div>
              </div>
            </div>
          )}

          {/* Hours and Availability */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Hours & Availability</h2>
            
            <div className="space-y-4">
              {resource.hours_of_operation && (
                <div className="flex items-start space-x-3">
                  <span className="text-gray-400 text-xl mt-1" aria-hidden="true">🕒</span>
                  <div>
                    <p className="text-sm text-gray-600">Hours of Operation</p>
                    <p className="text-lg font-medium text-gray-900">
                      {resource.hours_of_operation}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <span className="text-gray-400 text-xl" aria-hidden="true">👥</span>
                <div>
                  <p className="text-sm text-gray-600">Current Status</p>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                      resource.capacity_status === 'available' && 'bg-green-100 text-green-800',
                      resource.capacity_status === 'limited' && 'bg-yellow-100 text-yellow-800',
                      resource.capacity_status === 'full' && 'bg-red-100 text-red-800'
                    }`}>
                      {resource.capacity_status === 'available' && 'Available'}
                      {resource.capacity_status === 'limited' && 'Limited Capacity'}
                      {resource.capacity_status === 'full' && 'Currently Full'}
                    </span>
                    <span className={`text-sm ${
                      resource.is_currently_accepting ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {resource.is_currently_accepting ? 'Accepting new clients' : 'Not accepting new clients'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility and Requirements */}
          {(resource.eligibility_criteria || resource.documents_required) && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Eligibility & Requirements</h2>
              
              <div className="space-y-4">
                {resource.eligibility_criteria && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Eligibility Criteria</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {resource.eligibility_criteria}
                    </p>
                  </div>
                )}
                
                {resource.documents_required && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Documents Required</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {resource.documents_required}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Languages */}
          {resource.languages_spoken && resource.languages_spoken.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Languages Spoken</h2>
              
              <div className="flex flex-wrap gap-2">
                {resource.languages_spoken.map((language, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full btn-primary">
                Save for Later
              </button>
              
              <button className="w-full btn-secondary">
                Share Resource
              </button>
              
              <button className="w-full btn-secondary">
                Report Issue
              </button>
              
              <Link 
                href="/resource-finder/new"
                className="w-full btn-secondary text-center block"
              >
                Add Similar Resource
              </Link>
            </div>
          </div>

          {/* Resource Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Information</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Added:</span>
                <span className="text-gray-900">{formatDate(resource.created_at)}</span>
              </div>
              
              {resource.updated_at !== resource.created_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Last updated:</span>
                  <span className="text-gray-900">{formatDate(resource.updated_at)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${
                  resource.is_verified ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {resource.is_verified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          </div>

          {/* Related Resources */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Resources</h3>
            
            <p className="text-sm text-gray-600">
              More resources in the {category?.name || 'same'} category coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * USAGE EXAMPLES:
 * 
 * // Basic usage
 * <ResourceDetail 
 *   resource={resource} 
 *   category={category} 
 * />
 * 
 * // In a page component
 * export default async function ResourcePage({ params }: { params: { id: string } }) {
 *   const resource = await getResource(params.id)
 *   const category = resource ? await getCategory(resource.category_id) : null
 *   
 *   if (!resource) {
 *     return <NotFound />
 *   }
 *   
 *   return (
 *     <ResourceDetail 
 *       resource={resource} 
 *       category={category} 
 *     />
 *   )
 * }
 */
