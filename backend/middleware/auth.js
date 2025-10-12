/**
 * C6Group.AI OS v1.0 – SUPERAAI System Initialization
 * Authentication Middleware
 * 
 * @description JWT and AWS Cognito authentication middleware
 * @author C6Group.AI Development Team
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken'
import { CognitoJwtVerifier } from 'aws-jwt-verify'

// Create Cognito JWT verifier (if configured)
let cognitoVerifier = null
if (process.env.COGNITO_USER_POOL_ID) {
  cognitoVerifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    tokenUse: 'access',
    clientId: process.env.COGNITO_CLIENT_ID
  })
}

/**
 * Authentication middleware
 * Supports both AWS Cognito JWT tokens and custom JWT tokens
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // In development mode, allow requests without authentication
      if (process.env.NODE_ENV !== 'production') {
        req.user = { 
          id: 'dev-user',
          email: 'dev@c6group.ai',
          name: 'Development User',
          role: 'admin'
        }
        return next()
      }
      
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please provide a valid authorization token'
      })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    let user = null

    // Try AWS Cognito verification first (if configured)
    if (cognitoVerifier) {
      try {
        const payload = await cognitoVerifier.verify(token)
        user = {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          username: payload.username,
          role: payload['custom:role'] || 'user',
          groups: payload['cognito:groups'] || [],
          tokenUse: payload.token_use
        }
      } catch (cognitoError) {
        console.log('Cognito verification failed, trying custom JWT:', cognitoError.message)
      }
    }

    // Fallback to custom JWT verification
    if (!user && process.env.JWT_SECRET) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        user = {
          id: payload.sub || payload.userId,
          email: payload.email,
          name: payload.name,
          username: payload.username,
          role: payload.role || 'user'
        }
      } catch (jwtError) {
        console.log('Custom JWT verification failed:', jwtError.message)
      }
    }

    if (!user) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'The provided authentication token is invalid or expired'
      })
    }

    // Attach user to request object
    req.user = user
    next()

  } catch (error) {
    console.error('Authentication error:', error)
    res.status(500).json({
      error: 'Authentication error',
      message: 'An error occurred during authentication'
    })
  }
}

/**
 * Role-based authorization middleware
 */
export const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please authenticate first'
      })
    }

    const userRole = req.user.role
    const roleHierarchy = {
      'user': 1,
      'moderator': 2, 
      'admin': 3,
      'super_admin': 4
    }

    const userLevel = roleHierarchy[userRole] || 0
    const requiredLevel = roleHierarchy[requiredRole] || 0

    if (userLevel < requiredLevel) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `This endpoint requires ${requiredRole} role or higher`
      })
    }

    next()
  }
}

/**
 * Optional authentication middleware
 * Adds user to request if authenticated, but doesn't block unauthenticated requests
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      
      // Try to authenticate but don't fail if it doesn't work
      if (cognitoVerifier) {
        try {
          const payload = await cognitoVerifier.verify(token)
          req.user = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            username: payload.username,
            role: payload['custom:role'] || 'user'
          }
        } catch (error) {
          // Ignore authentication errors for optional auth
        }
      }
    }
    
    next()
  } catch (error) {
    // Ignore errors and continue without authentication
    next()
  }
}