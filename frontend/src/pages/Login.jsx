/**
 * C6Group.AI OS v1.0 – SUPERAAI System Initialization
 * Authentication Login Page
 * 
 * @description AWS Cognito login interface with dark-gold theme
 * @author C6Group.AI Development Team
 * @version 1.0.0
 */

import React, { useState } from 'react'
import { Auth } from '@aws-amplify/auth'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const Login = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Sign in function
  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // Development mode bypass
      if (!import.meta.env.VITE_COGNITO_USER_POOL_ID) {
        console.log('Development mode - bypassing authentication')
        setTimeout(() => {
          setMessage({ type: 'success', text: 'Successfully authenticated in development mode!' })
          onAuthSuccess()
        }, 1000)
        return
      }

      // Production AWS Cognito sign in
      await Auth.signIn(formData.email, formData.password)
      setMessage({ type: 'success', text: 'Successfully signed in!' })
      onAuthSuccess()
    } catch (error) {
      console.error('Sign in error:', error)
      setMessage({ 
        type: 'error', 
        text: error.message || 'Authentication failed. Please check your credentials.' 
      })
    } finally {
      setLoading(false)
    }
  }

  // Sign up function
  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' })
      setLoading(false)
      return
    }

    try {
      if (!import.meta.env.VITE_COGNITO_USER_POOL_ID) {
        setMessage({ type: 'success', text: 'Account created successfully in development mode!' })
        setIsSignUp(false)
        return
      }

      await Auth.signUp({
        username: formData.email,
        password: formData.password,
        attributes: {
          email: formData.email,
          name: formData.name
        }
      })
      setMessage({ type: 'success', text: 'Account created! Please check your email for verification.' })
      setIsSignUp(false)
    } catch (error) {
      console.error('Sign up error:', error)
      setMessage({ type: 'error', text: error.message || 'Registration failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto h-20 w-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-gold-lg mb-6"
          >
            <Lock className="h-10 w-10 text-dark-900" />
          </motion.div>
          
          <h1 className="text-4xl font-display font-bold text-white mb-2 animate-glow">
            C6Group.AI OS
          </h1>
          <p className="text-lg text-primary-500 font-medium">SUPERAAI Control System</p>
          <p className="text-sm text-gray-400 mt-2">v1.0 - System Initialization</p>
        </div>

        {/* Form */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-6">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={isSignUp}
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field w-full pl-10"
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field w-full pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field w-full pl-10"
                    placeholder="Confirm your password"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            )}

            {/* Message Display */}
            {message.text && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center space-x-2 p-3 rounded-lg ${
                  message.type === 'error' 
                    ? 'bg-red-500/10 border border-red-500/20 text-red-400' 
                    : 'bg-green-500/10 border border-green-500/20 text-green-400'
                }`}
              >
                {message.type === 'error' ? (
                  <AlertCircle className="h-5 w-5" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
                <span className="text-sm">{message.text}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2 py-3 text-lg font-semibold"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>

            {/* Toggle Sign Up/Sign In */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary-500 hover:text-primary-400 transition-colors text-sm font-medium"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Create one"
                }
              </button>
            </div>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-gray-500"
        >
          <p>Powered by AWS Cognito & C6Group.AI Infrastructure</p>
          <p className="mt-1">© 2024 C6Group.AI. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login