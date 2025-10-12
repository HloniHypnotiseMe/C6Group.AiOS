/**
 * C6Group.AI OS v1.0 – SUPERAAI System Initialization
 * Main Dashboard - AI Agent Control Center
 * 
 * @description Dashboard with three AI agent panels and system monitoring
 * @author C6Group.AI Development Team
 * @version 1.0.0
 */

import React, { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Code, 
  Eye, 
  Activity, 
  Settings, 
  LogOut,
  Bell,
  Cpu,
  Zap,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'

import { AuthContext } from '../App'
import AgentPanel from '../components/AgentPanel'
import SystemMetrics from '../components/SystemMetrics'
import ActivityFeed from '../components/ActivityFeed'
import { useAgentStatus } from '../hooks/useAgentStatus'

const Dashboard = () => {
  const { user, signOut } = useContext(AuthContext)
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [systemTime, setSystemTime] = useState(new Date())
  
  // Custom hook for agent status management
  const { agents, updateAgentStatus, executeAgentCommand } = useAgentStatus()

  // Update system time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Agent configurations
  const agentConfigs = {
    architect: {
      id: 'architect',
      name: 'Architect.AI',
      description: 'System design and creative strategy',
      icon: Brain,
      color: 'from-blue-500 to-purple-600',
      capabilities: [
        'System Architecture Design',
        'Creative Strategy Planning',
        'Technical Specifications',
        'Infrastructure Planning'
      ]
    },
    executor: {
      id: 'executor', 
      name: 'Executor.AI',
      description: 'Coding and deployment operations',
      icon: Code,
      color: 'from-green-500 to-emerald-600',
      capabilities: [
        'Code Generation & Deployment',
        'CI/CD Pipeline Management', 
        'Infrastructure Automation',
        'Performance Optimization'
      ]
    },
    observer: {
      id: 'observer',
      name: 'Observer.AI', 
      description: 'Analytics and learning feedback',
      icon: Eye,
      color: 'from-orange-500 to-red-600',
      capabilities: [
        'System Analytics & Monitoring',
        'Performance Metrics Analysis',
        'Learning Feedback Loops',
        'Predictive Insights'
      ]
    }
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="border-b border-primary-500/20 bg-dark-850/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-gold"
              >
                <Cpu className="h-6 w-6 text-dark-900" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-display font-bold text-white animate-glow">
                  C6Group.AI OS
                </h1>
                <p className="text-sm text-gray-400">SUPERAAI Control System v1.0</p>
              </div>
            </div>

            {/* System Status */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-primary-500" />
                <span className="text-gray-300 font-mono">
                  {systemTime.toLocaleTimeString()}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400 font-medium">System Online</span>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-primary-500 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-primary-500 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <button 
                onClick={signOut}
                className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors p-2"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-display font-bold text-white mb-2">
            Welcome back, {user?.name || user?.username || 'Commander'}
          </h2>
          <p className="text-gray-400 text-lg">
            Manage and monitor your AI agents from the SUPERAAI Control System
          </p>
        </motion.div>

        {/* System Metrics Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <SystemMetrics agents={agents} />
        </motion.div>

        {/* AI Agents Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {Object.values(agentConfigs).map((config, index) => (
            <motion.div
              key={config.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <AgentPanel
                agent={{
                  ...config,
                  ...agents[config.id]
                }}
                onSelect={setSelectedAgent}
                onExecuteCommand={executeAgentCommand}
                isSelected={selectedAgent === config.id}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ActivityFeed />
        </motion.div>

        {/* Global Agent Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <div className="card">
            <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center">
              <Zap className="h-5 w-5 text-primary-500 mr-2" />
              Global Agent Controls
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                onClick={() => {
                  Object.keys(agents).forEach(agentId => {
                    if (agents[agentId].status !== 'online') {
                      executeAgentCommand(agentId, 'start')
                    }
                  })
                }}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Start All Agents</span>
              </button>
              
              <button 
                onClick={() => {
                  Object.keys(agents).forEach(agentId => {
                    if (agents[agentId].status === 'online') {
                      executeAgentCommand(agentId, 'pause')
                    }
                  })
                }}
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <Pause className="h-4 w-4" />
                <span>Pause All Agents</span>
              </button>
              
              <button 
                onClick={() => {
                  Object.keys(agents).forEach(agentId => {
                    executeAgentCommand(agentId, 'restart')
                  })
                }}
                className="btn-ghost flex items-center justify-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Restart System</span>
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary-500/20 bg-dark-850/30 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <p>© 2024 C6Group.AI. All rights reserved.</p>
            <p>SUPERAAI Control System v1.0 - Status: Operational</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard