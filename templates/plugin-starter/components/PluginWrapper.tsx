/**
 * PLUGIN WRAPPER COMPONENT
 * 
 * This component demonstrates how to integrate plugins into a React application.
 * It provides a wrapper for plugin execution and error handling.
 * 
 * LEARNING GOALS:
 * - Understand plugin integration patterns
 * - Learn error handling for plugins
 * - See plugin lifecycle management
 * - Understand plugin communication
 */

'use client'

import { useState, useEffect } from 'react'
import { pluginRegistry, type Plugin } from '../plugin.config'

interface PluginWrapperProps {
  pluginName: string
  data: any
  onResult?: (result: any) => void
  onError?: (error: Error) => void
  className?: string
}

export function PluginWrapper({ 
  pluginName, 
  data, 
  onResult, 
  onError,
  className 
}: PluginWrapperProps) {
  const [plugin, setPlugin] = useState<Plugin | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  // Load plugin on mount
  useEffect(() => {
    const loadPlugin = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Check if plugin is already loaded
        let loadedPlugin = pluginRegistry.getPlugin(pluginName)
        
        if (!loadedPlugin) {
          // Load plugin if not already loaded
          loadedPlugin = await pluginRegistry.loadPlugin({
            name: pluginName,
            path: `./plugins/${pluginName}`,
            enabled: true
          })
        }
        
        setPlugin(loadedPlugin)
      } catch (err) {
        const errorMessage = `Failed to load plugin ${pluginName}: ${err}`
        setError(errorMessage)
        onError?.(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadPlugin()
  }, [pluginName, onError])

  // Execute plugin when data changes
  useEffect(() => {
    if (plugin && data) {
      executePlugin()
    }
  }, [plugin, data])

  const executePlugin = async () => {
    if (!plugin) return

    try {
      setLoading(true)
      setError(null)
      
      const pluginResult = await pluginRegistry.executePlugin(pluginName, data)
      setResult(pluginResult)
      onResult?.(pluginResult)
    } catch (err) {
      const errorMessage = `Plugin execution failed: ${err}`
      setError(errorMessage)
      onError?.(err as Error)
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading && !plugin) {
    return (
      <div className={`card ${className || ''}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Loading plugin...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={`card bg-red-50 border-red-200 ${className || ''}`}>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-red-500" aria-hidden="true">⚠️</span>
          <h3 className="text-sm font-medium text-red-800">
            Plugin Error
          </h3>
        </div>
        <p className="text-sm text-red-700 mb-4">{error}</p>
        <button
          onClick={executePlugin}
          className="btn-secondary text-sm"
          disabled={loading}
        >
          Retry
        </button>
      </div>
    )
  }

  // Plugin not found
  if (!plugin) {
    return (
      <div className={`card bg-yellow-50 border-yellow-200 ${className || ''}`}>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-yellow-500" aria-hidden="true">⚠️</span>
          <h3 className="text-sm font-medium text-yellow-800">
            Plugin Not Found
          </h3>
        </div>
        <p className="text-sm text-yellow-700">
          Plugin "{pluginName}" could not be loaded.
        </p>
      </div>
    )
  }

  // Success state
  return (
    <div className={`card ${className || ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {plugin.name}
          </h3>
          <p className="text-sm text-gray-600">
            {plugin.description}
          </p>
        </div>
        <div className="text-xs text-gray-500">
          v{plugin.version}
        </div>
      </div>

      {loading && (
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
            <span className="text-sm text-gray-600">Executing...</span>
          </div>
        </div>
      )}

      {result && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Result:</h4>
          <pre className="bg-gray-100 rounded-lg p-3 text-sm overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <button
          onClick={executePlugin}
          className="btn-primary text-sm"
          disabled={loading}
        >
          Execute Plugin
        </button>
        <button
          onClick={() => setResult(null)}
          className="btn-secondary text-sm"
        >
          Clear Result
        </button>
      </div>
    </div>
  )
}

/**
 * USAGE EXAMPLES:
 * 
 * // Basic usage
 * <PluginWrapper 
 *   pluginName="HelloPlugin" 
 *   data={{ name: "World" }} 
 * />
 * 
 * // With callbacks
 * <PluginWrapper 
 *   pluginName="DataPlugin" 
 *   data={formData}
 *   onResult={(result) => console.log('Plugin result:', result)}
 *   onError={(error) => console.error('Plugin error:', error)}
 * />
 * 
 * // In a form
 * <PluginWrapper 
 *   pluginName="UIPlugin" 
   data={{ text: "Submit" }}
   className="mb-4"
 />
 */
