// App configuration and constants
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  apiTimeout: import.meta.env.VITE_API_TIMEOUT || 30000,
  appName: import.meta.env.VITE_APP_NAME || 'AutiCare',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  features: {
    enableRealTime: import.meta.env.VITE_ENABLE_REAL_TIME === 'true',
    enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',
    enableDarkMode: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
  },
  
  // Pagination
  defaultPageSize: 10,
  maxPageSize: 100,
  
  // File upload limits
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  
  // Session timeout (in milliseconds)
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
}

export default config
