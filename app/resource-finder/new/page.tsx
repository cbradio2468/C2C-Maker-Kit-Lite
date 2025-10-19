/**
 * CREATE RESOURCE PAGE - Add New Resource
 * 
 * This page allows authenticated users to add new resources.
 * It includes form validation, error handling, and success feedback.
 * 
 * LEARNING GOALS:
 * - Understand protected route patterns
 * - Learn form handling with Server Components
 * - See authentication integration
 * - Understand data validation patterns
 * 
 * SECURITY NOTES:
 * - Requires authentication (handled by middleware)
 * - Server-side validation
 * - Input sanitization
 * - Rate limiting considerations
 */

import { createClient } from '@/lib/supabase/server'
import { ResourceForm } from '../components/ResourceForm'
import { type ResourceCategory } from '@/lib/types'

export default async function CreateResourcePage() {
  const supabase = await createClient()
  
  // Fetch categories for the form
  const { data: categories } = await supabase
    .from('resource_categories')
    .select('*')
    .order('display_order')

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Add a New Resource
        </h1>
        <p className="text-lg text-gray-600">
          Help your community by adding information about a local resource or service.
        </p>
      </div>

      {/* Form */}
      <ResourceForm 
        categories={categories || []} 
        mode="create" 
      />

      {/* Help Section */}
      <div className="mt-12 card bg-blue-50 border-blue-200">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          Tips for Adding Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              What to Include
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Clear, descriptive name</li>
              <li>• Detailed description of services</li>
              <li>• Accurate contact information</li>
              <li>• Current hours of operation</li>
              <li>• Eligibility requirements</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Best Practices
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Verify information before submitting</li>
              <li>• Use inclusive, respectful language</li>
              <li>• Include accessibility information</li>
              <li>• Mention any language support</li>
              <li>• Update if information changes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * METADATA
 */
export const metadata = {
  title: 'Add Resource - Resource Finder',
  description: 'Add a new community resource to help others in your area.',
}
