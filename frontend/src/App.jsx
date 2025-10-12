/**
 * C6Group.AI OS v1.0 – SUPERAAI System Initialization
 * Main Application Component
 * 
 * @description Root component with routing and authentication context
 * @author C6Group.AI Development Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Auth } from '@aws-amplify/auth'

// Import pages and components
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import LoadingSpinner from './components/LoadingSpinner'

// Authentication context
export const AuthContext = React.createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  signOut: () => {}
})

function App() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check authentication status on app load
  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      setLoading(true)
      
      // Check if AWS Amplify is configured
      if (!import.meta.env.VITE_COGNITO_USER_POOL_ID) {
        // Development mode - auto authenticate
        console.log('Running in development mode - skipping authentication')
        setUser({ username: 'dev-user', email: 'dev@c6group.ai' })
        setIsAuthenticated(true)
        setLoading(false)
        return
      }

      // Production mode - check AWS Cognito
      const currentUser = await Auth.currentAuthenticatedUser()
      setUser(currentUser)
      setIsAuthenticated(true)
    } catch (error) {
      console.log('User not authenticated:', error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      if (import.meta.env.VITE_COGNITO_USER_POOL_ID) {
        await Auth.signOut()
      }
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Authentication context value
  const authContextValue = {
    user,
    isAuthenticated,
    loading,
    signOut,
    checkAuthState
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <h2 className="text-xl font-display text-primary-500 mt-4 animate-glow">
            Initializing SUPERAAI Control System...
          </h2>
          <p className="text-gray-400 mt-2">C6Group.AI OS v1.0</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <Router>
        <div className="min-h-screen bg-dark-900">
          {/* Background Effects */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-500/3 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          </div>
          
          {/* Main Content */}
          <div className="relative z-10">
            <Routes>
              <Route 
                path="/login" 
                element={
                  isAuthenticated ? 
                    <Navigate to="/dashboard" replace /> : 
                    <Login onAuthSuccess={checkAuthState} />
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  isAuthenticated ? 
                    <Dashboard /> : 
                    <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/" 
                element={
                  <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
                } 
              />
              {/* Catch-all route */}
              <Route 
                path="*" 
                element={
                  <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
                } 
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App