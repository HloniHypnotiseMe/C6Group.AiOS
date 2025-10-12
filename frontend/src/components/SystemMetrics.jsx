/**
 * C6Group.AI OS v1.0 – SUPERAAI System Initialization
 * System Metrics Dashboard Component
 * 
 * @description Real-time system performance and AI agent metrics
 * @author C6Group.AI Development Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Wifi, 
  Zap,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const SystemMetrics = ({ agents }) => {
  const [metrics, setMetrics] = useState({
    system: {
      cpu: 0,
      memory: 0,
      storage: 0,
      network: 0
    },
    agents: {
      online: 0,
      total: 3,
      totalTasks: 0,
      completedTasks: 0
    }
  })

  const [performanceData, setPerformanceData] = useState([])

  // Simulate real-time metrics updates
  useEffect(() => {
    const updateMetrics = () => {
      // Calculate agent statistics
      const agentEntries = Object.values(agents)
      const onlineAgents = agentEntries.filter(agent => agent.status === 'online').length
      
      // Simulate system metrics (in production, these would come from real monitoring)
      const newMetrics = {
        system: {
          cpu: Math.floor(Math.random() * 30) + 15, // 15-45%
          memory: Math.floor(Math.random() * 40) + 30, // 30-70%
          storage: Math.floor(Math.random() * 20) + 40, // 40-60%
          network: Math.floor(Math.random() * 50) + 20 // 20-70%
        },
        agents: {
          online: onlineAgents,
          total: agentEntries.length,
          totalTasks: Math.floor(Math.random() * 50) + 100,
          completedTasks: Math.floor(Math.random() * 40) + 80
        }
      }
      
      setMetrics(newMetrics)
      
      // Update performance chart data
      const now = new Date()
      setPerformanceData(prev => {
        const newData = [...prev, {
          time: now.toLocaleTimeString([], { hour12: false }),
          cpu: newMetrics.system.cpu,
          memory: newMetrics.system.memory,
          network: newMetrics.system.network
        }]
        return newData.slice(-10) // Keep last 10 data points
      })
    }

    updateMetrics()
    const interval = setInterval(updateMetrics, 5000) // Update every 5 seconds
    
    return () => clearInterval(interval)
  }, [agents])

  const getTrendIcon = (current, previous = 0) => {
    if (current > previous) return <TrendingUp className="h-3 w-3 text-green-400" />
    if (current < previous) return <TrendingDown className="h-3 w-3 text-red-400" />
    return <Minus className="h-3 w-3 text-gray-400" />
  }

  const MetricCard = ({ title, value, unit, icon: Icon, color, trend }) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-dark-850/60 backdrop-blur-sm border border-primary-500/20 rounded-xl p-4 hover:border-primary-500/40 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-300">{title}</span>
        </div>
        {trend && getTrendIcon(value)}
      </div>
      
      <div className="flex items-baseline space-x-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-sm text-gray-400">{unit}</span>
      </div>
      
      {/* Progress bar for percentage values */}
      {unit === '%' && (
        <div className="mt-2 w-full bg-dark-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(value, 100)}%` }}
          ></div>
        </div>
      )}
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* System Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="CPU Usage"
          value={metrics.system.cpu}
          unit="%"
          icon={Cpu}
          color="bg-blue-600"
          trend={true}
        />
        <MetricCard
          title="Memory"
          value={metrics.system.memory}
          unit="%"
          icon={MemoryStick}
          color="bg-green-600"
          trend={true}
        />
        <MetricCard
          title="Storage"
          value={metrics.system.storage}
          unit="%"
          icon={HardDrive}
          color="bg-orange-600"
          trend={true}
        />
        <MetricCard
          title="Network"
          value={metrics.system.network}
          unit="%"
          icon={Wifi}
          color="bg-purple-600"
          trend={true}
        />
      </div>

      {/* Agent Status and Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Status */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center">
            <Activity className="h-5 w-5 text-primary-500 mr-2" />
            Agent Status
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Online Agents</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-400">
                  {metrics.agents.online}
                </span>
                <span className="text-gray-400">/ {metrics.agents.total}</span>
              </div>
            </div>
            
            <div className="w-full bg-dark-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(metrics.agents.online / metrics.agents.total) * 100}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <p className="text-sm text-gray-400">Total Tasks</p>
                <p className="text-xl font-bold text-white">{metrics.agents.totalTasks}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-xl font-bold text-primary-500">{metrics.agents.completedTasks}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Chart */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 card"
        >
          <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center">
            <Zap className="h-5 w-5 text-primary-500 mr-2" />
            Real-time Performance
          </h3>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #e5b90b',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cpu" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={false}
                  name="CPU %"
                />
                <Line 
                  type="monotone" 
                  dataKey="memory" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={false}
                  name="Memory %"
                />
                <Line 
                  type="monotone" 
                  dataKey="network" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={false}
                  name="Network %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-300">CPU</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Memory</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-300">Network</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SystemMetrics