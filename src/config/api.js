// Environment configuration for API integration

// API Configuration
export const API_CONFIG = {
  // Development settings (when running locally)
  development: {
    baseUrl: 'http://localhost:3000',
    timeout: 30000,
    retries: 3
  },
  
  // Production settings (when deployed)
  production: {
    baseUrl: 'https://api.krishnapaul.in',
    timeout: 30000,
    retries: 3
  }
};

// Get current environment configuration
export const getCurrentConfig = () => {
  return import.meta.env.PROD ? API_CONFIG.production : API_CONFIG.development;
};

// Rate limiting information (from API documentation)
export const RATE_LIMITS = {
  contact: {
    requests: 5,
    window: '15 minutes',
    description: 'Contact form submissions'
  },
  compatibility: {
    requests: 3,
    window: '1 hour',
    description: 'AI compatibility checks'
  },
  general: {
    requests: 100,
    window: '15 minutes',
    description: 'General API endpoints'
  }
};

// File upload constraints
export const FILE_CONSTRAINTS = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  maxTotalSize: 50 * 1024 * 1024, // 50MB total
  maxFiles: 10,
  allowedTypes: {
    contact: ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.gif', '.zip', '.rar'],
    compatibility: ['.pdf', '.doc', '.docx', '.txt']
  }
};

// API endpoints
export const ENDPOINTS = {
  health: '/api/health',
  contact: '/api/contact',
  compatibility: '/api/check-compatibility'
};

export default {
  API_CONFIG,
  getCurrentConfig,
  RATE_LIMITS,
  FILE_CONSTRAINTS,
  ENDPOINTS
};
