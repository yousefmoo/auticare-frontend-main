// User roles
export const USER_ROLES = {
  DOCTOR: 'doctor',
  THERAPIST: 'therapist',
  PARENT: 'parent',
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

// Assessment frequency
export const ASSESSMENT_FREQUENCY = {
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
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/update',
    LIST: '/users',
  },
  PLANS: {
    LIST: '/treatment-plans/my-plans',
    CREATE: '/treatment-plans',
    UPDATE: '/treatment-plans',
    DELETE: '/treatment-plans',
    BY_CHILD: '/treatment-plans/child',
  },
  NOTES: {
    LIST: '/notes/my-notes',
    CREATE: '/notes',
    UPDATE: '/notes',
    BY_CHILD: '/notes/child',
  },
  SESSIONS: {
    LIST: '/sessions',
    CREATE: '/sessions',
    BY_TREATMENT: '/sessions/treatment',
  },
  BOOKINGS: {
    LIST: '/bookings',
    MY_BOOKINGS: '/bookings/my-bookings',
    UPCOMING: '/bookings/upcoming',
    STATUS: '/bookings/status',
  },
  STATISTICS: {
    OVERVIEW: '/dashboard/specialist', // Mapping reports to the dashboard overview for now
  },
  MESSAGES: {
    START: '/chat/start',
    MY_CHATS: '/chat/my-chats',
    MESSAGES: '/chat', // appends {chatId}/messages
  },
  RESOURCES: {
    LIST: '/resources',
    CATEGORIES: '/resources/categories',
  },
  ASSESSMENT: {
    QUESTIONS: '/assessment/questions',
    SUBMIT: '/assessment/submit',
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
