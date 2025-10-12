/**
 * C6Group.AI OS v1.0 – SUPERAAI System Initialization
 * Global Error Handler Middleware
 * 
 * @description Centralized error handling and logging
 * @author C6Group.AI Development Team
 * @version 1.0.0
 */

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error occurred:', {
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    user: req.user?.id || 'anonymous',
    timestamp: new Date().toISOString()
  })

  // Default error response
  let statusCode = err.statusCode || err.status || 500
  let message = err.message || 'Internal server error'
  let errorCode = err.code || 'INTERNAL_ERROR'
  let details = null

  // Handle specific error types
  switch (err.name) {
    case 'ValidationError':
      statusCode = 400
      message = 'Validation failed'
      details = err.details || err.message
      errorCode = 'VALIDATION_ERROR'
      break
      
    case 'JsonWebTokenError':
      statusCode = 401
      message = 'Invalid authentication token'
      errorCode = 'INVALID_TOKEN'
      break
      
    case 'TokenExpiredError':
      statusCode = 401
      message = 'Authentication token has expired'
      errorCode = 'TOKEN_EXPIRED'
      break
      
    case 'CastError':
      statusCode = 400
      message = 'Invalid data format'
      errorCode = 'INVALID_FORMAT'
      break
      
    case 'MongoError':
    case 'MongooseError':
      statusCode = 500
      message = 'Database error'
      errorCode = 'DATABASE_ERROR'
      break
      
    case 'AwsError':
      statusCode = 500
      message = 'AWS service error'
      errorCode = 'AWS_ERROR'
      details = process.env.NODE_ENV !== 'production' ? err.message : undefined
      break
  }

  // Handle AWS SDK errors
  if (err.Code || err.$fault) {
    statusCode = 500
    errorCode = 'AWS_ERROR'
    
    switch (err.Code || err.name) {
      case 'ResourceNotFoundException':
        statusCode = 404
        message = 'Resource not found'
        errorCode = 'RESOURCE_NOT_FOUND'
        break
        
      case 'AccessDeniedException':
        statusCode = 403
        message = 'Access denied'
        errorCode = 'ACCESS_DENIED'
        break
        
      case 'ValidationException':
        statusCode = 400
        message = 'Invalid request parameters'
        errorCode = 'INVALID_PARAMETERS'
        break
        
      case 'ThrottlingException':
      case 'TooManyRequestsException':
        statusCode = 429
        message = 'Too many requests'
        errorCode = 'RATE_LIMIT_EXCEEDED'
        break
    }
  }

  // Handle HTTP errors from external APIs
  if (err.response) {
    statusCode = err.response.status
    message = err.response.data?.message || message
    errorCode = 'EXTERNAL_API_ERROR'
  }

  // Construct error response
  const errorResponse = {
    error: {
      code: errorCode,
      message: message,
      status: statusCode,
      timestamp: new Date().toISOString()
    }
  }

  // Add details in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.error.details = details
    errorResponse.error.stack = err.stack
    errorResponse.error.requestId = req.id || req.headers['x-request-id']
  }

  // Add correlation ID for tracking
  if (req.correlationId) {
    errorResponse.error.correlationId = req.correlationId
  }

  // Send error response
  res.status(statusCode).json(errorResponse)
}

/**
 * Async error handler wrapper
 * Wraps async route handlers to catch errors and pass them to error handler
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * Create custom error
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message)
    this.statusCode = statusCode
    this.status = statusCode
    this.code = code
    this.details = details
    this.isOperational = true
    
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Not found error handler
 */
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Cannot ${req.method} ${req.originalUrl}`,
    404,
    'NOT_FOUND'
  )
  next(error)
}

/**
 * Validation error handler
 */
export const validationError = (message, details = null) => {
  return new AppError(message, 400, 'VALIDATION_ERROR', details)
}

/**
 * Authentication error handler
 */
export const authError = (message = 'Authentication required') => {
  return new AppError(message, 401, 'AUTHENTICATION_ERROR')
}

/**
 * Authorization error handler
 */
export const forbiddenError = (message = 'Insufficient permissions') => {
  return new AppError(message, 403, 'AUTHORIZATION_ERROR')
}