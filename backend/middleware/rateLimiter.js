/**
 * C6Group.AI OS v1.0 – SUPERAAI System Initialization
 * Rate Limiting Middleware
 * 
 * @description Rate limiting for API endpoints
 * @author C6Group.AI Development Team
 * @version 1.0.0
 */

// Simple in-memory rate limiter (for production, use Redis)
const rateLimitStore = new Map()

/**
 * Rate limiting middleware
 */
export const rateLimiter = (req, res, next) => {
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000 // 15 minutes
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  
  // Get identifier (IP or user ID)
  const identifier = req.user?.id || req.ip || req.connection.remoteAddress
  
  if (!identifier) {
    return next()
  }

  const now = Date.now()
  const windowStart = now - windowMs
  
  // Clean up old entries
  rateLimitStore.forEach((value, key) => {
    if (value.resetTime < now) {
      rateLimitStore.delete(key)
    }
  })
  
  // Get current request count for this identifier
  let requestData = rateLimitStore.get(identifier)
  
  if (!requestData || requestData.resetTime < now) {
    // New window or expired
    requestData = {
      count: 1,
      resetTime: now + windowMs,
      firstRequest: now
    }
  } else {
    // Within current window
    requestData.count++
  }
  
  // Update store
  rateLimitStore.set(identifier, requestData)
  
  // Add rate limit headers
  res.set({
    'X-RateLimit-Limit': maxRequests,
    'X-RateLimit-Remaining': Math.max(0, maxRequests - requestData.count),
    'X-RateLimit-Reset': new Date(requestData.resetTime).toISOString()
  })
  
  // Check if limit exceeded
  if (requestData.count > maxRequests) {
    const retryAfter = Math.ceil((requestData.resetTime - now) / 1000)
    
    res.set('Retry-After', retryAfter)
    
    return res.status(429).json({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests',
        status: 429,
        retryAfter: retryAfter,
        limit: maxRequests,
        windowMs: windowMs
      }
    })
  }
  
  next()
}

/**
 * Strict rate limiter for sensitive endpoints
 */
export const strictRateLimiter = (req, res, next) => {
  const windowMs = 60000 // 1 minute
  const maxRequests = 5
  
  const identifier = req.user?.id || req.ip || req.connection.remoteAddress
  const key = `strict_${identifier}`
  
  if (!identifier) {
    return next()
  }

  const now = Date.now()
  let requestData = rateLimitStore.get(key)
  
  if (!requestData || requestData.resetTime < now) {
    requestData = {
      count: 1,
      resetTime: now + windowMs
    }
  } else {
    requestData.count++
  }
  
  rateLimitStore.set(key, requestData)
  
  res.set({
    'X-RateLimit-Limit': maxRequests,
    'X-RateLimit-Remaining': Math.max(0, maxRequests - requestData.count),
    'X-RateLimit-Reset': new Date(requestData.resetTime).toISOString()
  })
  
  if (requestData.count > maxRequests) {
    const retryAfter = Math.ceil((requestData.resetTime - now) / 1000)
    res.set('Retry-After', retryAfter)
    
    return res.status(429).json({
      error: {
        code: 'STRICT_RATE_LIMIT_EXCEEDED',
        message: 'Too many requests to sensitive endpoint',
        status: 429,
        retryAfter: retryAfter
      }
    })
  }
  
  next()
}