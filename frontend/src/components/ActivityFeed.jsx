/**
 * C6Group.AI OS v1.0 – SUPERAAI System Initialization
 * Activity Feed Component
 * 
 * @description Real-time system and agent activity monitoring
 * @author C6Group.AI Development Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  Brain, 
  Code, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Clock,
  Filter,
  RefreshCw
} from 'lucide-react'

const ActivityFeed = () => {
  const [activities, setActivities] = useState([])
  const [filter, setFilter] = useState('all')
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)

  // Sample activity types for simulation
  const activityTypes = {
    architect: {
      icon: Brain,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      actions: [
        'Generated system architecture blueprint',
        'Analyzed infrastructure requirements', 
        'Created deployment strategy',
        'Optimized resource allocation'
      ]
    },
    executor: {
      icon: Code,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      actions: [
        'Deployed application to production',
        'Executed database migration',
        'Updated CI/CD pipeline',
        'Rolled back problematic deployment'
      ]
    },
    observer: {
      icon: Eye,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      actions: [
        'Detected performance anomaly',
        'Generated analytics report',
        'Triggered automated alert',
        'Analyzed user behavior patterns'
      ]
    },
    system: {
      icon: Activity,
      color: 'text-primary-500',
      bgColor: 'bg-primary-500/10',
      actions: [
        'System health check completed',
        'Security scan initiated',
        'Backup process started',
        'Resource scaling triggered'
      ]
    }
  }

  // Generate random activity
  const generateActivity = () => {
    const types = Object.keys(activityTypes)
    const randomType = types[Math.floor(Math.random() * types.length)]
    const typeConfig = activityTypes[randomType]
    const randomAction = typeConfig.actions[Math.floor(Math.random() * typeConfig.actions.length)]
    
    const severities = ['info', 'success', 'warning']
    const randomSeverity = severities[Math.floor(Math.random() * severities.length)]
    
    return {
      id: Date.now() + Math.random(),
      type: randomType,
      message: randomAction,
      severity: randomSeverity,
      timestamp: new Date(),
      ...typeConfig
    }
  }

  // Add new activities periodically
  useEffect(() => {
    // Add initial activities
    const initialActivities = Array.from({ length: 5 }, generateActivity)
    setActivities(initialActivities.reverse())

    if (isAutoRefresh) {
      const interval = setInterval(() => {
        const newActivity = generateActivity()
        setActivities(prev => [newActivity, ...prev.slice(0, 19)]) // Keep last 20
      }, 3000) // New activity every 3 seconds

      return () => clearInterval(interval)
    }
  }, [isAutoRefresh])

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true
    return activity.type === filter
  })

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-400" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      default:
        return <Info className="h-4 w-4 text-blue-400" />
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-display font-bold text-white flex items-center">
          <Activity className="h-5 w-5 text-primary-500 mr-2" />
          System Activity Feed
        </h3>
        
        <div className="flex items-center space-x-3">
          {/* Auto-refresh toggle */}
          <button
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isAutoRefresh 
                ? 'bg-primary-500 text-dark-900' 
                : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${isAutoRefresh ? 'animate-spin' : ''}`} />
            <span>{isAutoRefresh ? 'Live' : 'Paused'}</span>
          </button>

          {/* Filter dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-dark-700 text-white border border-primary-500/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
          >
            <option value="all">All Activities</option>
            <option value="architect">Architect.AI</option>
            <option value="executor">Executor.AI</option>
            <option value="observer">Observer.AI</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
        <AnimatePresence>
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex items-start space-x-3 p-4 rounded-xl border border-gray-700/50 hover:border-primary-500/30 transition-all duration-300 ${activity.bgColor}`}
            >
              {/* Icon */}
              <div className={`p-2 rounded-lg bg-dark-800 ${activity.color}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-white capitalize">
                    {activity.type === 'system' ? 'System' : `${activity.type}.AI`}
                  </p>
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(activity.severity)}
                    <span className="text-xs text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-300">{activity.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredActivities.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No activities found for the selected filter</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-700/50 flex justify-between items-center text-xs text-gray-500">
        <span>Showing {filteredActivities.length} activities</span>
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </motion.div>
  )
}

export default ActivityFeed