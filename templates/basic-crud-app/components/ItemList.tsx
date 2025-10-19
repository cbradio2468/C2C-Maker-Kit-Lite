/**
 * ITEM LIST COMPONENT
 * 
 * This component displays a list of items with basic CRUD operations.
 * It includes loading states, empty states, and action buttons.
 * 
 * LEARNING GOALS:
 * - Understand list rendering patterns
 * - Learn loading and error state handling
 * - See CRUD operation patterns
 * - Understand accessibility for lists
 */

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ItemCard } from './ItemCard'
import { type Item } from '@/lib/types'

interface ItemListProps {
  initialItems?: Item[]
}

export function ItemList({ initialItems = [] }: ItemListProps) {
  const [items, setItems] = useState<Item[]>(initialItems)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  // Fetch items
  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('deleted_at', null)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setItems(data || [])
    } catch (err) {
      console.error('Error fetching items:', err)
      setError('Failed to load items. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Delete item (soft delete)
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('items')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) {
        throw error
      }

      // Remove from local state
      setItems(items.filter(item => item.id !== id))
    } catch (err) {
      console.error('Error deleting item:', err)
      alert('Failed to delete item. Please try again.')
    }
  }

  // Loading state
  if (loading && items.length === 0) {
    return (
      <div className="space-y-4" role="status" aria-label="Loading items">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
        <p className="sr-only">Loading items...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="card text-center py-12" role="alert">
        <div className="text-red-500 text-6xl mb-4" aria-hidden="true">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Unable to Load Items
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchItems}
          className="btn-primary"
          aria-label="Retry loading items"
        >
          Try Again
        </button>
      </div>
    )
  }

  // Empty state
  if (items.length === 0 && !loading) {
    return (
      <div className="card text-center py-12">
        <div className="text-gray-400 text-6xl mb-4" aria-hidden="true">📝</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Items Yet
        </h3>
        <p className="text-gray-600 mb-4">
          Get started by creating your first item.
        </p>
        <a
          href="/items/new"
          className="btn-primary"
          aria-label="Create your first item"
        >
          Create First Item
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-4" role="list" aria-label="Items list">
      {items.map((item) => (
        <div key={item.id} role="listitem">
          <ItemCard
            item={item}
            onDelete={handleDelete}
          />
        </div>
      ))}
    </div>
  )
}
