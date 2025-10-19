/**
 * RESOURCE DETAIL PAGE - Individual Resource View
 * 
 * This page displays detailed information about a single resource.
 * It uses Server Components for data fetching and includes
 * related resources and action buttons.
 * 
 * LEARNING GOALS:
 * - Understand dynamic routing in Next.js
 * - Learn how to handle not-found states
 * - See detailed page layouts
 * - Understand data fetching patterns
 * 
 * SEO NOTES:
 * - Dynamic metadata based on resource data
 * - Structured data for search engines
 * - Proper heading hierarchy
 * - Social media sharing optimization
 */

import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ResourceDetail } from '../components/ResourceDetail'
import { type Resource, type ResourceCategory } from '@/lib/types'

interface ResourcePageProps {
  params: {
    id: string
  }
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const supabase = await createClient()
  
  // Fetch resource data
  const { data: resource, error } = await supabase
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
    .eq('id', params.id)
    .eq('deleted_at', null)
    .single()

  if (error || !resource) {
    notFound()
  }

  // Fetch category data
  const category = resource.resource_categories as ResourceCategory

  return (
    <ResourceDetail 
      resource={resource as Resource} 
      category={category} 
    />
  )
}

/**
 * DYNAMIC METADATA
 * 
 * This generates page-specific metadata for SEO and social sharing
 */
export async function generateMetadata({ params }: ResourcePageProps) {
  const supabase = await createClient()
  
  const { data: resource } = await supabase
    .from('resources')
    .select(`
      name,
      description,
      city,
      state,
      resource_categories (name)
    `)
    .eq('id', params.id)
    .eq('deleted_at', null)
    .single()

  if (!resource) {
    return {
      title: 'Resource Not Found',
      description: 'The requested resource could not be found.',
    }
  }

  const category = resource.resource_categories as { name: string }
  const location = resource.city && resource.state 
    ? ` in ${resource.city}, ${resource.state}` 
    : ''

  return {
    title: `${resource.name} - ${category.name}${location}`,
    description: resource.description,
    openGraph: {
      title: resource.name,
      description: resource.description,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: resource.name,
      description: resource.description,
    },
  }
}

/**
 * STATIC PARAMS
 * 
 * This tells Next.js which pages to pre-render at build time.
 * For a dynamic app, you might want to pre-render popular resources.
 */
export async function generateStaticParams() {
  const supabase = await createClient()
  
  // Pre-render the first 20 resources for better performance
  const { data: resources } = await supabase
    .from('resources')
    .select('id')
    .eq('deleted_at', null)
    .eq('is_verified', true)
    .order('created_at', { ascending: false })
    .limit(20)

  return resources?.map((resource) => ({
    id: resource.id,
  })) || []
}

/**
 * NOT FOUND PAGE
 * 
 * This is shown when a resource doesn't exist
 */
export function generateNotFound() {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="text-6xl mb-4" aria-hidden="true">🔍</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Resource Not Found
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        The resource you're looking for doesn't exist or has been removed.
      </p>
      <div className="space-x-4">
        <a 
          href="/resource-finder" 
          className="btn-primary"
        >
          Browse All Resources
        </a>
        <a 
          href="/resource-finder/new" 
          className="btn-secondary"
        >
          Add a Resource
        </a>
      </div>
    </div>
  )
}
