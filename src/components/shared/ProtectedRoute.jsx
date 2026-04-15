import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { STORAGE_KEYS } from '../../utils/constants'

/**
 * ProtectedRoute - Wrapper for routes that require authentication
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {Array<string>} props.allowedRoles - Roles that can access this route
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useAuthStore()
  const token =
    localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) ||
    sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
}
