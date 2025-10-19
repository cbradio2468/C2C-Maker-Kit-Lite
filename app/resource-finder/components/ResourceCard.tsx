/**
 * RESOURCE CARD COMPONENT
 * 
 * This component displays a single resource in a card format.
 * It's used in lists and search results throughout the app.
 * 
 * LEARNING GOALS:
 * - Understand component composition
 * - Learn accessibility best practices
 * - See responsive design patterns
 * - Understand data display patterns
 * 
 * ACCESSIBILITY NOTES:
 * - Uses semantic HTML structure
 * - Includes proper ARIA labels
 * - Keyboard navigation friendly
 * - Screen reader accessible
 */

import Link from 'next/link'
import { type Resource, type ResourceCategory } from '@/lib/types'
import { formatPhone, formatAddress, cn } from '@/lib/utils'

interface ResourceCardProps {
  resource: Resource
  category?: ResourceCategory
  showActions?: boolean
  className?: string
}

export function ResourceCard({ 
  resource, 
  category, 
  showActions = true,
  className 
}: ResourceCardProps) {
  return (
    <article 
      className={cn(
        'card hover:shadow-md transition-shadow duration-200',
        className
      )}
      role="article"
      aria-labelledby={`resource-${resource.id}-title`}
    >
      {/* Header with category and verification status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {category && (
            <span 
              className="text-2xl" 
              role="img" 
              aria-label={`${category.name} category`}
            >
              {category.icon}
            </span>
          )}
          <span className="text-sm text-gray-600 font-medium">
            {category?.name || 'Uncategorized'}
          </span>
        </div>
        
        {resource.is_verified && (
          <span 
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
            aria-label="Verified resource"
          >
            ✓ Verified
          </span>
        )}
      </div>

      {/* Resource name and description */}
      <div className="mb-4">
        <h3 
          id={`resource-${resource.id}-title`}
          className="text-lg font-semibold text-gray-900 mb-2"
        >
          {resource.name}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {resource.description}
        </p>
      </div>

      {/* Contact information */}
      <div className="space-y-2 mb-4">
        {resource.phone && (
          <div className="flex items-center space-x-2">
            <span className="text-gray-400" aria-hidden="true">📞</span>
            <a 
              href={`tel:${resource.phone}`}
              className="text-sm text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
              aria-label={`Call ${resource.name} at ${formatPhone(resource.phone)}`}
            >
              {formatPhone(resource.phone)}
            </a>
          </div>
        )}
        
        {resource.email && (
          <div className="flex items-center space-x-2">
            <span className="text-gray-400" aria-hidden="true">✉️</span>
            <a 
              href={`mailto:${resource.email}`}
              className="text-sm text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
              aria-label={`Email ${resource.name}`}
            >
              {resource.email}
            </a>
          </div>
        )}
        
        {resource.website && (
          <div className="flex items-center space-x-2">
            <span className="text-gray-400" aria-hidden="true">🌐</span>
            <a 
              href={resource.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
              aria-label={`Visit ${resource.name} website`}
            >
              Visit Website
            </a>
          </div>
        )}
      </div>

      {/* Location */}
      {(resource.address || resource.city) && (
        <div className="mb-4">
          <div className="flex items-start space-x-2">
            <span className="text-gray-400 mt-0.5" aria-hidden="true">📍</span>
            <div className="text-sm text-gray-600">
              {formatAddress(resource.address, resource.city, resource.state, resource.zip_code)}
            </div>
          </div>
        </div>
      )}

      {/* Hours and status */}
      <div className="space-y-2 mb-4">
        {resource.hours_of_operation && (
          <div className="flex items-start space-x-2">
            <span className="text-gray-400 mt-0.5" aria-hidden="true">🕒</span>
            <div className="text-sm text-gray-600">
              {resource.hours_of_operation}
            </div>
          </div>
        )}
        
        {resource.capacity_status && (
          <div className="flex items-center space-x-2">
            <span className="text-gray-400" aria-hidden="true">👥</span>
            <span className={cn(
              'text-sm font-medium',
              resource.capacity_status === 'available' && 'text-green-600',
              resource.capacity_status === 'limited' && 'text-yellow-600',
              resource.capacity_status === 'full' && 'text-red-600'
            )}>
              {resource.capacity_status === 'available' && 'Available'}
              {resource.capacity_status === 'limited' && 'Limited Capacity'}
              {resource.capacity_status === 'full' && 'Currently Full'}
            </span>
          </div>
        )}
      </div>

      {/* Eligibility criteria */}
      {resource.eligibility_criteria && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-1">Eligibility</h4>
          <p className="text-sm text-gray-600">
            {resource.eligibility_criteria}
          </p>
        </div>
      )}

      {/* Languages spoken */}
      {resource.languages_spoken && resource.languages_spoken.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-1">Languages</h4>
          <div className="flex flex-wrap gap-1">
            {resource.languages_spoken.map((language, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {language}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Link 
            href={`/resource-finder/${resource.id}`}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
            aria-label={`View details for ${resource.name}`}
          >
            View Details
          </Link>
          
          <div className="flex items-center space-x-4">
            <button
              className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
              aria-label={`Save ${resource.name} for later`}
            >
              Save
            </button>
            <button
              className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
              aria-label={`Report issue with ${resource.name}`}
            >
              Report Issue
            </button>
          </div>
        </div>
      )}
    </article>
  )
}

/**
 * USAGE EXAMPLES:
 * 
 * // Basic usage
 * <ResourceCard resource={resource} category={category} />
 * 
 * // Without actions (for search results)
 * <ResourceCard resource={resource} showActions={false} />
 * 
 * // With custom styling
 * <ResourceCard 
 *   resource={resource} 
 *   className="border-l-4 border-l-primary-500" 
 * />
 * 
 * // In a list
 * {resources.map(resource => (
 *   <ResourceCard 
 *     key={resource.id} 
 *     resource={resource} 
 *     category={categories.find(c => c.id === resource.category_id)} 
 *   />
 * ))}
 */
