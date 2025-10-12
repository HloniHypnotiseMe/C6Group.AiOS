/**
 * C6Group.AI OS v1.0 – SUPERAAI System Initialization
 * Main Backend Server - Express with AWS Lambda Integration
 * 
 * @description Main server entry point with Serverless HTTP wrapper
 * @author C6Group.AI Development Team
 * @version 1.0.0
 */

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import serverless from 'serverless-http'
import dotenv from 'dotenv'

// Import routes
import architectRoutes from './api/architect/routes.js'
import executorRoutes from './api/executor/routes.js'
import observerRoutes from './api/observer/routes.js'
import agentRoutes from './api/agents/routes.js'
import systemRoutes from './api/system/routes.js'

// Import middleware
import { errorHandler } from './middleware/errorHandler.js'
import { authMiddleware } from './middleware/auth.js'
import { rateLimiter } from './middleware/rateLimiter.js'

// Load environment variables
dotenv.config()

// Create Express application
const app = express()

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", process.env.CORS_ORIGIN || "http://localhost:3000"]
    }
  }
}))

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'https://os.c6group.co.za'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression middleware
app.use(compression())

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// Rate limiting
app.use('/api', rateLimiter)

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'C6Group.AI OS - SUPERAAI Control System',
    uptime: process.uptime()
  })
})

// API Documentation
app.get('/api', (req, res) => {
  res.json({
    name: 'C6Group.AI OS v1.0 – SUPERAAI System API',
    version: '1.0.0',
    description: 'Backend API for AI agent management and control',
    endpoints: {
      health: '/health',
      architect: '/api/architect/*',
      executor: '/api/executor/*', 
      observer: '/api/observer/*',
      agents: '/api/agents/*',
      system: '/api/system/*'
    },
    documentation: 'https://docs.c6group.ai/superaai-api'
  })
})

// Apply authentication middleware to all API routes
app.use('/api', authMiddleware)

// API Routes
app.use('/api/architect', architectRoutes)
app.use('/api/executor', executorRoutes)
app.use('/api/observer', observerRoutes)
app.use('/api/agents', agentRoutes)
app.use('/api/system', systemRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: ['/health', '/api']
  })
})

// Global error handler
app.use(errorHandler)

// Export for serverless
export const handler = serverless(app, {
  // Serverless configuration
  binary: ['image/*', 'application/pdf'],
  request: (request, event, context) => {
    request.serverless = { event, context }
  }
})

// Local development server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001
  
  app.listen(PORT, () => {
    console.log(`
🚀 C6Group.AI OS v1.0 – SUPERAAI Control System Backend
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Server running on port ${PORT}
🌐 Health check: http://localhost:${PORT}/health
📊 API docs: http://localhost:${PORT}/api
🛡️  Environment: ${process.env.NODE_ENV || 'development'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `)
  })
}

export default app