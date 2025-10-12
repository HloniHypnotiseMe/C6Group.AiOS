/**
 * C6Group.AI OS v1.0 – SUPERAAI System Initialization
 * React Application Entry Point
 * 
 * @description Main application bootstrap with React Router and AWS Amplify
 * @author C6Group.AI Development Team
 * @version 1.0.0
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

// AWS Amplify Configuration
import { Amplify } from '@aws-amplify/core'
import { Auth } from '@aws-amplify/auth'

// Configure AWS Amplify with environment variables
const awsConfig = {
  Auth: {
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    mandatorySignIn: true,
    authenticationFlowType: 'USER_SRP_AUTH',
    oauth: {
      domain: import.meta.env.VITE_COGNITO_DOMAIN,
      scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
      redirectSignIn: import.meta.env.VITE_APP_URL || 'http://localhost:3000',
      redirectSignOut: import.meta.env.VITE_APP_URL || 'http://localhost:3000',
      responseType: 'code'
    }
  },
  API: {
    endpoints: [
      {
        name: 'SuperAAIAPI',
        endpoint: import.meta.env.VITE_API_GATEWAY_URL,
        region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      }
    ]
  }
}

// Initialize Amplify only if configuration is available
if (awsConfig.Auth.userPoolId && awsConfig.Auth.userPoolWebClientId) {
  Amplify.configure(awsConfig)
} else {
  console.warn('AWS Amplify configuration incomplete. Running in development mode.')
}

// Render React Application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)