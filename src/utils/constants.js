// User roles
export const USER_ROLES = {
  DOCTOR: 'Doctor',
  THERAPIST: 'Therapist',
  PARENT: 'Parent',
}

// Activity status
export const ACTIVITY_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  REFUSED: 'refused',
  SKIPPED: 'skipped',
}

// Therapy types
export const THERAPY_TYPES = {
  SPEECH: 'speech',
  BEHAVIORAL: 'behavioral',
  OCCUPATIONAL: 'occupational',
  PHYSICAL: 'physical',
  SOCIAL: 'social',
}

// Feedback types
export const FEEDBACK_TYPES = {
  POSITIVE: 'positive',
  NEUTRAL: 'neutral',
  NEGATIVE: 'negative',
  REFUSED: 'refused',
}

// Screening frequency
export const SCREENING_FREQUENCY = {
  BASELINE: 'baseline',
  THREE_MONTHS: '3_months',
  SIX_MONTHS: '6_months',
  ANNUAL: 'annual',
}

// Notification types
export const NOTIFICATION_TYPES = {
  MESSAGE: 'message',
  PLAN_UPDATE: 'plan_update',
  FEEDBACK_ALERT: 'feedback_alert',
  SESSION_REMINDER: 'session_reminder',
  REPORT_READY: 'report_ready',
}

// Chart types
export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  AREA: 'area',
  RADAR: 'radar',
}

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  FULL: 'MMMM dd, yyyy',
  SHORT: 'MM/dd/yyyy',
  TIME: 'hh:mm a',
  DATETIME: 'MMM dd, yyyy hh:mm a',
}

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  PROFILE: {
    UPDATE: '/profile/update',
    PICTURE: '/profile/picture',
    LICENSE: '/profile/license',
  },
  CHILDREN: {
    BASE: '/children',
    BY_ID: (id) => `/children/${id}`,
  },
  SCREENING: {
    START: '/screening/start',
    QUESTIONS: '/screening/questions',
    SUBMIT: '/screening/submit',
    RESULTS: (childId) => `/screening/results/${childId}`,
    ANALYTICS: (childId) => `/screening/analytics/${childId}`,
  },
  BOOKINGS: {
    BASE: '/bookings',
    MY_BOOKINGS: '/bookings/my-bookings',
    UPCOMING: '/bookings/upcoming',
    STATUS: (id) => `/bookings/${id}/status`,
  },
  DASHBOARD: {
    PARENT: '/dashboard/parent',
    SPECIALIST: '/dashboard/specialist',
  },
  NOTES: {
    BASE: '/notes',
    MY_NOTES: '/notes/my-notes',
    BY_CHILD: (childId) => `/notes/child/${childId}`,
    BY_ID: (id) => `/notes/${id}`,
  },
  SESSIONS: {
    BASE: '/sessions',
    BY_TREATMENT: (treatmentId) => `/sessions/treatment/${treatmentId}`,
  },
  SPECIALISTS: {
    BASE: '/specialists',
    BY_ID: (id) => `/specialists/${id}`,
  },
  TREATMENT_PLANS: {
    BASE: '/treatment-plans',
    BY_CHILD: (childId) => `/treatment-plans/child/${childId}`,
    MY_PLANS: '/treatment-plans/my-plans',
  },
  CHAT: {
    START: '/chat/start',
    MY_CHATS: '/chat/my-chats',
    MESSAGES: (chatId) => `/chat/${chatId}/messages`,
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    READ: (id) => `/notifications/${id}/read`,
    READ_ALL: '/notifications/read-all',
  },
}

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auticare_auth_token',
  USER_DATA: 'auticare_user_data',
  THEME: 'auticare_theme',
  LANGUAGE: 'auticare_language',
  SCREENING_RESULT: 'auticare_screening_result',
}

// Validation rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  MAX_TEXT_LENGTH: 500,
  MAX_NOTE_LENGTH: 2000,
}
