/**
 * C6Group.AI OS v1.0 – SUPERAAI System Initialization
 * AI Agent Control Panel Component
 * 
 * @description Individual agent monitoring and control interface
 * @author C6Group.AI Development Team
 * @version 1.0.0
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Settings, 
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Cpu,
  MemoryStick,
  Zap
} from 'lucide-react'

const AgentPanel = ({ agent, onSelect, onExecuteCommand, isSelected }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <CheckCircle2 className="h-4 w-4 text-green-400" />
      case 'offline':
        return <AlertCircle className="h-4 w-4 text-red-400" />
      case 'processing':
        return <Activity className="h-4 w-4 text-yellow-400 animate-pulse" />
      case 'standby':
        return <Clock className="h-4 w-4 text-blue-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'online':
        return 'status-online'
      case 'offline':
        return 'status-offline'
      case 'processing':
        return 'status-processing'
      case 'standby':
        return 'status-standby'
      default:
        return 'bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium'
    }
  }

  return (
    <motion.div 
      layout
      className={`agent-panel cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-2 ring-primary-500 scale-105' : 'hover:scale-102'
      }`}
      onClick={() => onSelect(agent.id)}
      whileHover={{ y: -5 }}
    >
      {/* Agent Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${agent.color} shadow-lg`}>
            <agent.icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-white">
              {agent.name}
            </h3>
            <p className="text-sm text-gray-400">{agent.description}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className={getStatusClass(agent.status)}>
            {agent.status}
          </div>
          {getStatusIcon(agent.status)}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Cpu className="h-4 w-4 text-primary-500 mr-1" />
            <span className="text-xs text-gray-400">CPU</span>
          </div>
          <p className="text-sm font-bold text-white">{agent.metrics?.cpu || 0}%</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <MemoryStick className="h-4 w-4 text-primary-500 mr-1" />
            <span className="text-xs text-gray-400">Memory</span>
          </div>
          <p className="text-sm font-bold text-white">{agent.metrics?.memory || 0}%</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Zap className="h-4 w-4 text-primary-500 mr-1" />
            <span className="text-xs text-gray-400">Load</span>
          </div>
          <p className="text-sm font-bold text-white">{agent.metrics?.load || 0}%</p>
        </div>
      </div>

      {/* Agent Controls */}
      <div className="flex space-x-2 mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            onExecuteCommand(agent.id, 'start')
          }}
          disabled={agent.status === 'online'}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1"
        >
          <Play className="h-3 w-3" />
          <span>Start</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            onExecuteCommand(agent.id, 'pause')
          }}
          disabled={agent.status !== 'online'}
          className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1"
        >
          <Pause className="h-3 w-3" />
          <span>Pause</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            onExecuteCommand(agent.id, 'stop')
          }}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1"
        >
          <Square className="h-3 w-3" />
          <span>Stop</span>
        </motion.button>
      </div>

      {/* Expandable Details */}
      <div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
          className="w-full text-left text-sm text-primary-500 hover:text-primary-400 transition-colors mb-2"
        >
          {isExpanded ? '▼ Hide Details' : '▶ Show Details'}
        </button>
        
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="space-y-3">
            {/* Capabilities */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Capabilities:</h4>
              <ul className="space-y-1">
                {agent.capabilities?.map((capability, index) => (
                  <li key={index} className="text-xs text-gray-400 flex items-center">
                    <CheckCircle2 className="h-3 w-3 text-primary-500 mr-2" />
                    {capability}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Last Activity */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Last Activity:</h4>
              <p className="text-xs text-gray-400">
                {agent.lastActivity || 'No recent activity'}
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onExecuteCommand(agent.id, 'restart')
                }}
                className="flex-1 btn-ghost text-xs py-2 flex items-center justify-center space-x-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Restart</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation()
                  // Open settings modal
                }}
                className="flex-1 btn-ghost text-xs py-2 flex items-center justify-center space-x-1"
              >
                <Settings className="h-3 w-3" />
                <span>Settings</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default AgentPanel