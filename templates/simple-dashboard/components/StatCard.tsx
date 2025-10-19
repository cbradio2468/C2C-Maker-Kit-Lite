/**
 * STAT CARD COMPONENT
 * 
 * This component displays a single metric in a card format.
 * It includes the current value, change indicator, and trend information.
 * 
 * LEARNING GOALS:
 * - Understand metric display patterns
 * - Learn trend visualization
 * - See responsive card layouts
 * - Understand accessibility for data
 */

import { type Metric } from '@/lib/types'
import { formatNumber, formatPercentage } from '@/lib/utils'

interface StatCardProps {
  metric: Metric
  className?: string
}

export function StatCard({ metric, className }: StatCardProps) {
  const isPositive = metric.change > 0
  const isNegative = metric.change < 0
  const isNeutral = metric.change === 0

  return (
    <div className={`card ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">
          {metric.name}
        </h3>
        <div className={`flex items-center space-x-1 ${
          isPositive ? 'text-green-600' :
          isNegative ? 'text-red-600' :
          'text-gray-600'
        }`}>
          {isPositive && <span aria-hidden="true">↗</span>}
          {isNegative && <span aria-hidden="true">↘</span>}
          {isNeutral && <span aria-hidden="true">→</span>}
          <span className="text-xs font-medium">
            {formatPercentage(Math.abs(metric.change))}
          </span>
        </div>
      </div>

      {/* Value */}
      <div className="mb-2">
        <div className="text-2xl font-bold text-gray-900">
          {formatNumber(metric.value)} {metric.unit}
        </div>
      </div>

      {/* Change */}
      <div className="flex items-center space-x-2">
        <span className={`text-sm ${
          isPositive ? 'text-green-600' :
          isNegative ? 'text-red-600' :
          'text-gray-600'
        }`}>
          {isPositive && '+'}
          {formatNumber(metric.change)} {metric.unit}
        </span>
        <span className="text-xs text-gray-500">
          vs last period
        </span>
      </div>

      {/* Trend Indicator */}
      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                isPositive ? 'bg-green-500' :
                isNegative ? 'bg-red-500' :
                'bg-gray-500'
              }`}
              style={{ width: `${Math.min(Math.abs(metric.change) * 10, 100)}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">
            {metric.trend}
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * USAGE EXAMPLES:
 * 
 * // Basic usage
 * <StatCard metric={metric} />
 * 
 * // With custom styling
 * <StatCard 
 *   metric={metric} 
 *   className="border-l-4 border-l-primary-500" 
 * />
 * 
 * // In a grid
 * {metrics.map(metric => (
 *   <StatCard key={metric.id} metric={metric} />
 * ))}
 */
