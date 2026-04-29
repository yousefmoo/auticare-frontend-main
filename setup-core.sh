#!/bin/bash

# AutiCare Frontend - Complete File Generator
# This script creates all remaining project files

cd /home/claude/auticare-frontend

# Create store index
cat > src/store/index.js << 'EOF'
// Export all stores
export { useAuthStore, MOCK_USERS } from './authStore'
export { useUIStore } from './uiStore'
EOF

# Create API client
cat > src/api/client.js << 'EOF'
import axios from 'axios'
import { config } from '../config'
import { STORAGE_KEYS } from '../utils/constants'

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER_DATA)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
EOF

# Create auth API
cat > src/api/auth.api.js << 'EOF'
import apiClient from './client'
import { API_ENDPOINTS } from '../utils/constants'
import { MOCK_USERS } from '../store/authStore'

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise} User data
 */
export const login = async (email, password) => {
  // MOCK: Replace with real API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = Object.values(MOCK_USERS).find(
        (u) => u.email === email && u.password === password
      )
      
      if (user) {
        const { password, ...userWithoutPassword } = user
        resolve(userWithoutPassword)
      } else {
        reject(new Error('Invalid credentials'))
      }
    }, 1000)
  })
  
  // REAL API CALL (uncomment when backend is ready):
  // return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password })
}

/**
 * Register new user
 * @param {Object} userData
 * @returns {Promise} User data
 */
export const register = async (userData) => {
  return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData)
}

/**
 * Logout current user
 * @returns {Promise}
 */
export const logout = async () => {
  return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
}
EOF

echo "✅ Core API files created"

# Create ProtectedRoute component
cat > src/components/shared/ProtectedRoute.jsx << 'EOF'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

/**
 * ProtectedRoute - Wrapper for routes that require authentication
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {Array<string>} props.allowedRoles - Roles that can access this route
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
EOF

# Create LoadingSpinner component
cat > src/components/shared/LoadingSpinner.jsx << 'EOF'
export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`${sizes[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`}></div>
    </div>
  )
}
EOF

# Create ErrorBoundary component
cat > src/components/shared/ErrorBoundary.jsx << 'EOF'
import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
            <p className="text-gray-600 mb-4">Something went wrong.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
EOF

echo "✅ Shared components created"

# Create Login component
cat > src/features/auth/Login.jsx << 'EOF'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { login as loginAPI } from '../../api/auth.api'
import { USER_ROLES } from '../../utils/constants'

export default function Login() {
  const navigate = useNavigate()
  const { login, setLoading, setError } = useAuthStore()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    setLoading(true)

    try {
      const userData = await loginAPI(formData.email, formData.password)
      login(userData)
      
      // Redirect based on role
      switch (userData.role) {
        case USER_ROLES.DOCTOR:
          navigate('/doctor/dashboard')
          break
        case USER_ROLES.THERAPIST:
          navigate('/therapist/dashboard')
          break
        case USER_ROLES.PARENT:
          navigate('/parent/dashboard')
          break
        default:
          navigate('/')
      }
    } catch (error) {
      setLocalError(error.message || 'Login failed')
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AutiCare</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              className="input-field"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="input-field"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          {localError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {localError}
            </div>
          )}

          <button type="submit" className="w-full btn-primary">
            Sign In
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">Demo Accounts:</p>
          <div className="text-xs text-blue-700 space-y-1">
            <p>Doctor: doctor@auticare.com / doctor123</p>
            <p>Therapist: therapist@auticare.com / therapist123</p>
            <p>Parent: parent@auticare.com / parent123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
EOF

echo "✅ Authentication components created"

echo "
========================================
✅ Core files generation complete!
========================================
"
