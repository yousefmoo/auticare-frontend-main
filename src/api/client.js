import axios from 'axios'
import { config } from '../config'
import { STORAGE_KEYS } from '../utils/constants'

const getErrorMessage = (status, data) =>
  data?.message ||
  data?.Message ||
  data?.error ||
  data?.Error ||
  (data?.errors ? Object.values(data.errors).flat()[0] : null) ||
  (data?.Errors ? Object.values(data.Errors).flat()[0] : null) ||
  data?.title ||
  data?.Title ||
  (typeof data === 'string' ? data : null) ||
  `Request failed with status ${status}`

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.apiTimeout,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (reqConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    if (token) {
      reqConfig.headers.Authorization = `Bearer ${token}`
    }
    return reqConfig
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle global errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      if (status === 401) {
        // Keep auth state consistent on expired/invalid token.
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER_DATA)
        sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        sessionStorage.removeItem(STORAGE_KEYS.USER_DATA)
        window.dispatchEvent(new CustomEvent('auticare:unauthorized'))
      }

      error.userMessage = getErrorMessage(status, data)
    } else if (error.request) {
      error.userMessage = 'Network error: Unable to reach the server. Please check your connection.'
    } else {
      error.userMessage = error.message || 'An unexpected error occurred.'
    }
    return Promise.reject(error)
  }
)

export default apiClient
