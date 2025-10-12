/**
 * C6Group.AI OS v1.0 – SUPERAAI System Initialization
 * Loading Spinner Component
 * 
 * @description Reusable loading spinner with gold theme
 * @author C6Group.AI Development Team
 * @version 1.0.0
 */

import React from 'react'

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  return (
    <div className={`loading-spinner ${sizeClasses[size]} ${className}`}>
    </div>
  )
}

export default LoadingSpinner