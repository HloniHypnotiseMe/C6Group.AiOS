/**
 * C6Group.AI OS v1.0 – SUPERAAI System Initialization
 * Agent Status Management Hook
 * 
 * @description Custom React hook for managing AI agent states and operations
 * @author C6Group.AI Development Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react'
import { apiService } from '../services/apiService'

export const useAgentStatus = () => {
  const [agents, setAgents] = useState({
    architect: {
      id: 'architect',
      status: 'standby',
      lastActivity: 'System design completed',
      metrics: {
        cpu: 15,
        memory: 32,
        load: 8
      }
    },
    executor: {
      id: 'executor', 
      status: 'online',
      lastActivity: 'Deployment pipeline active',
      metrics: {
        cpu: 28,
        memory: 45,
        load: 22
      }
    },
    observer: {
      id: 'observer',
      status: 'processing',
      lastActivity: 'Analytics report generation',
      metrics: {
        cpu: 42,
        memory: 67,
        load: 35
      }
    }
  })

  // Simulate real-time status updates
  useEffect(() => {
    const updateMetrics = () => {
      setAgents(prev => {
        const updated = { ...prev }
        
        Object.keys(updated).forEach(agentId => {
          const agent = updated[agentId]
          
          // Simulate metric fluctuations based on status
          let cpuRange, memoryRange, loadRange
          
          switch (agent.status) {
            case 'online':
              cpuRange = [20, 50]
              memoryRange = [40, 80]
              loadRange = [15, 40]
              break
            case 'processing':
              cpuRange = [60, 90]
              memoryRange = [70, 95]
              loadRange = [50, 80]
              break
            case 'standby':
              cpuRange = [5, 20]
              memoryRange = [20, 40]
              loadRange = [2, 15]
              break
            case 'offline':
              cpuRange = [0, 5]
              memoryRange = [10, 20]
              loadRange = [0, 5]
              break
            default:
              cpuRange = [10, 30]
              memoryRange = [20, 50]
              loadRange = [5, 20]
          }
          
          updated[agentId] = {
            ...agent,
            metrics: {
              cpu: Math.floor(Math.random() * (cpuRange[1] - cpuRange[0])) + cpuRange[0],
              memory: Math.floor(Math.random() * (memoryRange[1] - memoryRange[0])) + memoryRange[0],
              load: Math.floor(Math.random() * (loadRange[1] - loadRange[0])) + loadRange[0]
            }
          }
        })
        
        return updated
      })
    }

    // Update metrics every 2 seconds
    const interval = setInterval(updateMetrics, 2000)
    return () => clearInterval(interval)
  }, [])

  // Update agent status
  const updateAgentStatus = (agentId, newStatus, activity = null) => {
    setAgents(prev => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        status: newStatus,
        lastActivity: activity || prev[agentId].lastActivity,
        lastUpdated: new Date().toISOString()
      }
    }))
  }

  // Execute agent command
  const executeAgentCommand = async (agentId, command) => {
    try {
      console.log(`Executing ${command} on ${agentId}`)
      
      // Optimistic update
      let newStatus
      let activity
      
      switch (command) {
        case 'start':
          newStatus = 'processing'
          activity = `Agent starting up...`
          setTimeout(() => {
            updateAgentStatus(agentId, 'online', `Agent ${agentId} is now online`)
          }, 2000)
          break
          
        case 'pause':
          newStatus = 'standby'
          activity = `Agent paused`
          break
          
        case 'stop':
          newStatus = 'offline'
          activity = `Agent stopped`
          break
          
        case 'restart':
          newStatus = 'processing'
          activity = `Agent restarting...`
          setTimeout(() => {
            updateAgentStatus(agentId, 'online', `Agent ${agentId} restarted successfully`)
          }, 3000)
          break
          
        default:
          console.warn(`Unknown command: ${command}`)
          return
      }
      
      updateAgentStatus(agentId, newStatus, activity)
      
      // In production, this would make an API call
      if (import.meta.env.VITE_API_GATEWAY_URL) {
        await apiService.executeAgentCommand(agentId, command)
      }
      
    } catch (error) {
      console.error(`Failed to execute ${command} on ${agentId}:`, error)
      
      // Revert to previous status on error
      updateAgentStatus(agentId, 'offline', `Error executing ${command}`)
    }
  }

  // Get agent statistics
  const getAgentStats = () => {
    const agentList = Object.values(agents)
    const total = agentList.length
    const online = agentList.filter(agent => agent.status === 'online').length
    const processing = agentList.filter(agent => agent.status === 'processing').length
    const offline = agentList.filter(agent => agent.status === 'offline').length
    const standby = agentList.filter(agent => agent.status === 'standby').length
    
    const avgCpu = Math.round(
      agentList.reduce((sum, agent) => sum + (agent.metrics?.cpu || 0), 0) / total
    )
    
    const avgMemory = Math.round(
      agentList.reduce((sum, agent) => sum + (agent.metrics?.memory || 0), 0) / total
    )
    
    return {
      total,
      online,
      processing,
      offline,
      standby,
      avgCpu,
      avgMemory,
      healthScore: Math.round((online / total) * 100)
    }
  }

  // Fetch latest agent status (for production API integration)
  const refreshAgentStatus = async () => {
    try {
      if (import.meta.env.VITE_API_GATEWAY_URL) {
        const statusData = await apiService.getAgentStatus()
        setAgents(statusData)
      }
    } catch (error) {
      console.error('Failed to refresh agent status:', error)
    }
  }

  return {
    agents,
    updateAgentStatus,
    executeAgentCommand,
    getAgentStats,
    refreshAgentStatus
  }
}