export const APP_CONFIG = {
  NAME: 'Smart Microblog Generator',
  DESCRIPTION: 'Transform your ideas into engaging microblogs with A.I',
  VERSION: '2.0.0',
  AUTHOR: {
    NAME: 'Glaucia Lemos',
    URL: 'https://www.youtube.com/@GlauciaLemos'
  }
} as const

export const MICROBLOG_LIMITS = {
  MIN_TOPIC_LENGTH: 10,
  MAX_TOPIC_LENGTH: 280,
  MAX_KEYWORDS: 5,
  MAX_CONTENT_LENGTH: 280,
  CHARACTER_WARNING_THRESHOLD: 0.8
} as const;

export const RATE_LIMITING = {
  WINDOW_MS: 60 * 1000,
  MAX_REQUESTS: 10
} as const;

export const UI_CONFIG = {
  AUTO_HIDE_NOTIFICATION_MS: 5000,
  TRANSITION_DURATION_MS: 300,
  LOADING_DELAY_MS: 1000
} as const;