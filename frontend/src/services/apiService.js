/**
 * C6Group.AI OS v1.0 – SUPERAAI System Initialization
 * API Service - Axios HTTP Client
 * 
 * @description Centralized API communication service for SUPERAAI backend
 * @author C6Group.AI Development Team
 * @version 1.0.0
 */

import axios from 'axios'
import { Auth } from '@aws-amplify/auth'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3001'
const API_TIMEOUT = 10000 // 10 seconds

// Create Axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor for authentication
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Get JWT token from AWS Cognito (if configured)
      if (import.meta.env.VITE_COGNITO_USER_POOL_ID) {
        const session = await Auth.currentSession()
        const token = session.getAccessToken().getJwtToken()
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.log('No authentication token available')
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication failed - redirecting to login')
      // In production, this would trigger logout
    }
    
    return Promise.reject(error)
  }
)

// API Service Class
class APIService {
  // Architect.AI Endpoints
  async getArchitectStatus() {
    try {
      const response = await apiClient.get('/api/architect/status')
      return response.data
    } catch (error) {
      console.error('Failed to get architect status:', error)
      throw error
    }
  }

  async createArchitectureDesign(requirements) {
    try {
      const response = await apiClient.post('/api/architect/design', requirements)
      return response.data
    } catch (error) {
      console.error('Failed to create architecture design:', error)
      throw error
    }
  }

  async getDesignTemplates() {
    try {
      const response = await apiClient.get('/api/architect/templates')
      return response.data
    } catch (error) {
      console.error('Failed to get design templates:', error)
      throw error
    }
  }

  async analyzeProject(projectData) {
    try {
      const response = await apiClient.post('/api/architect/analyze', projectData)
      return response.data
    } catch (error) {
      console.error('Failed to analyze project:', error)
      throw error
    }
  }

  // Executor.AI Endpoints
  async getExecutorStatus() {
    try {
      const response = await apiClient.get('/api/executor/status')
      return response.data
    } catch (error) {
      console.error('Failed to get executor status:', error)
      throw error
    }
  }

  async deployApplication(deploymentConfig) {
    try {
      const response = await apiClient.post('/api/executor/deploy', deploymentConfig)
      return response.data
    } catch (error) {
      console.error('Failed to deploy application:', error)
      throw error
    }
  }

  async getDeploymentStatus(deploymentId) {
    try {
      const response = await apiClient.get(`/api/executor/status/${deploymentId}`)
      return response.data
    } catch (error) {
      console.error('Failed to get deployment status:', error)
      throw error
    }
  }

  async rollbackDeployment(deploymentId) {
    try {
      const response = await apiClient.post(`/api/executor/rollback/${deploymentId}`)
      return response.data
    } catch (error) {
      console.error('Failed to rollback deployment:', error)
      throw error
    }
  }

  // Observer.AI Endpoints
  async getObserverStatus() {
    try {
      const response = await apiClient.get('/api/observer/status')
      return response.data
    } catch (error) {
      console.error('Failed to get observer status:', error)
      throw error
    }
  }

  async getSystemAnalytics(timeRange = '24h') {
    try {
      const response = await apiClient.get(`/api/observer/analytics?range=${timeRange}`)
      return response.data
    } catch (error) {
      console.error('Failed to get system analytics:', error)
      throw error
    }
  }

  async submitFeedback(feedbackData) {
    try {
      const response = await apiClient.post('/api/observer/feedback', feedbackData)
      return response.data
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      throw error
    }
  }

  async getPerformanceInsights() {
    try {
      const response = await apiClient.get('/api/observer/insights')
      return response.data
    } catch (error) {
      console.error('Failed to get performance insights:', error)
      throw error
    }
  }

  // Agent Management Endpoints
  async getAgentStatus() {
    try {
      const response = await apiClient.get('/api/agents/status')
      return response.data
    } catch (error) {
      console.error('Failed to get agent status:', error)
      throw error
    }
  }

  async executeAgentCommand(agentId, command) {
    try {
      const response = await apiClient.post(`/api/agents/${agentId}/command`, { command })
      return response.data
    } catch (error) {
      console.error(`Failed to execute ${command} on ${agentId}:`, error)
      throw error
    }
  }

  async getAgentMetrics(agentId, timeRange = '1h') {
    try {
      const response = await apiClient.get(`/api/agents/${agentId}/metrics?range=${timeRange}`)
      return response.data
    } catch (error) {
      console.error(`Failed to get metrics for ${agentId}:`, error)
      throw error
    }
  }

  async getAgentLogs(agentId, limit = 100) {
    try {
      const response = await apiClient.get(`/api/agents/${agentId}/logs?limit=${limit}`)
      return response.data
    } catch (error) {
      console.error(`Failed to get logs for ${agentId}:`, error)
      throw error
    }
  }

  // System Management Endpoints
  async getSystemHealth() {
    try {
      const response = await apiClient.get('/api/system/health')
      return response.data
    } catch (error) {
      console.error('Failed to get system health:', error)
      throw error
    }
  }

  async getSystemMetrics() {
    try {
      const response = await apiClient.get('/api/system/metrics')
      return response.data
    } catch (error) {
      console.error('Failed to get system metrics:', error)
      throw error
    }
  }

  async getActivityFeed(limit = 50) {
    try {
      const response = await apiClient.get(`/api/system/activity?limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('Failed to get activity feed:', error)
      throw error
    }
  }

  // Utility Methods
  async testConnection() {
    try {
      const response = await apiClient.get('/api/health')
      return response.status === 200
    } catch (error) {
      console.error('API connection test failed:', error)
      return false
    }
  }

  // File Upload (for future use)
  async uploadFile(file, path = '/uploads') {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await apiClient.post(`${path}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return response.data
    } catch (error) {
      console.error('File upload failed:', error)
      throw error
    }
  }
}

// Export singleton instance
export const apiService = new APIService()
export default apiService