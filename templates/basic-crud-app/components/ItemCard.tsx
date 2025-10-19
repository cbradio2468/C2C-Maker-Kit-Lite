/**
 * ITEM CARD COMPONENT
 * 
 * This component displays a single item in a card format.
 * It includes action buttons for edit and delete operations.
 * 
 * LEARNING GOALS:
 * - Understand component composition
 * - Learn accessibility best practices
 * - See action button patterns
 * - Understand data display patterns
 */

import Link from 'next/link'
import { type Item } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface ItemCardProps {
  item: Item
  onDelete: (id: string) => void
}

export function ItemCard({ item, onDelete }: ItemCardProps) {
  return (
    <article 
      className="card hover:shadow-md transition-shadow duration-200"
      role="article"
      aria-labelledby={`item-${item.id}-title`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 
            id={`item-${item.id}-title`}
            className="text-lg font-semibold text-gray-900 mb-1"
          >
            {item.title}
          </h3>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            item.status === 'active' ? 'bg-green-100 text-green-800' :
            item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {item.status}
          </span>
        </div>
        
        <span className="text-sm text-gray-500">
          {formatDate(item.created_at)}
        </span>
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-gray-600 mb-4">
          {item.description}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <Link 
          href={`/items/${item.id}`}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
          aria-label={`View details for ${item.title}`}
        >
          View Details
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link
            href={`/items/${item.id}/edit`}
            className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
            aria-label={`Edit ${item.title}`}
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(item.id)}
            className="text-sm text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
            aria-label={`Delete ${item.title}`}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}
