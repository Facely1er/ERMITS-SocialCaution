/**
 * Environment variable validator
 * Validates all required environment variables on startup
 * Fails fast with clear error messages
 */

const logger = require('./logger');

// Required environment variables by environment
const REQUIRED_VARS = {
  all: [
    'NODE_ENV',
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
  ],
  production: [
    'FRONTEND_URL',
    'MONGO_ROOT_USERNAME',
    'MONGO_ROOT_PASSWORD',
  ],
  development: [],
};

// Optional but recommended variables
const RECOMMENDED_VARS = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS',
];

// Validation rules for specific variables
const VALIDATION_RULES = {
  NODE_ENV: {
    validator: (value) => ['development', 'staging', 'production', 'test'].includes(value),
    message: 'NODE_ENV must be one of: development, staging, production, test',
  },
  PORT: {
    validator: (value) => {
      const port = parseInt(value, 10);
      return !isNaN(port) && port > 0 && port < 65536;
    },
    message: 'PORT must be a valid port number (1-65535)',
  },
  MONGODB_URI: {
    validator: (value) => typeof value === 'string' && value.startsWith('mongodb://'),
    message: 'MONGODB_URI must be a valid MongoDB connection string',
  },
  FRONTEND_URL: {
    validator: (value) => {
      try {
        // eslint-disable-next-line no-undef
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message: 'FRONTEND_URL must be a valid URL',
  },
  JWT_SECRET: {
    validator: (value) => typeof value === 'string' && value.length >= 32,
    message: 'JWT_SECRET must be at least 32 characters long',
  },
  JWT_REFRESH_SECRET: {
    validator: (value) => typeof value === 'string' && value.length >= 32,
    message: 'JWT_REFRESH_SECRET must be at least 32 characters long',
  },
  MONGO_ROOT_USERNAME: {
    validator: (value) => typeof value === 'string' && value.length > 0,
    message: 'MONGO_ROOT_USERNAME must be set',
  },
  MONGO_ROOT_PASSWORD: {
    validator: (value) => typeof value === 'string' && value.length >= 12,
    message: 'MONGO_ROOT_PASSWORD must be at least 12 characters long',
  },
  BCRYPT_ROUNDS: {
    validator: (value) => {
      const rounds = parseInt(value, 10);
      return !isNaN(rounds) && rounds >= 10 && rounds <= 15;
    },
    message: 'BCRYPT_ROUNDS must be between 10 and 15',
  },
  RATE_LIMIT_WINDOW_MS: {
    validator: (value) => {
      const ms = parseInt(value, 10);
      return !isNaN(ms) && ms > 0;
    },
    message: 'RATE_LIMIT_WINDOW_MS must be a positive number',
  },
  RATE_LIMIT_MAX_REQUESTS: {
    validator: (value) => {
      const max = parseInt(value, 10);
      return !isNaN(max) && max > 0;
    },
    message: 'RATE_LIMIT_MAX_REQUESTS must be a positive number',
  },
};

function validateEnvironment() {
  const errors = [];
  const warnings = [];
  const nodeEnv = process.env.NODE_ENV || 'development';

  // Get required variables for current environment
  const requiredVars = [
    ...REQUIRED_VARS.all,
    ...(REQUIRED_VARS[nodeEnv] || []),
  ];

  // Check required variables
  requiredVars.forEach((varName) => {
    const value = process.env[varName];
    if (!value || value.trim() === '') {
      errors.push(`Required environment variable ${varName} is not set`);
      return;
    }

    // Apply validation rules if they exist
    const rule = VALIDATION_RULES[varName];
    if (rule) {
      if (!rule.validator(value)) {
        errors.push(`${varName}: ${rule.message}`);
      }
    }
  });

  // Check recommended variables
  RECOMMENDED_VARS.forEach((varName) => {
    const value = process.env[varName];
    if (!value || value.trim() === '') {
      warnings.push(`Recommended environment variable ${varName} is not set`);
    }
  });

  // Check for placeholder values
  const placeholderPatterns = [
    /^your_.*_here$/i,
    /^change_me$/i,
    /^replace_me$/i,
    /^example\.com$/i,
  ];

  Object.keys(process.env).forEach((key) => {
    const value = process.env[key];
    if (typeof value === 'string' && value.length > 0) {
      placeholderPatterns.forEach((pattern) => {
        if (pattern.test(value)) {
          warnings.push(`Environment variable ${key} appears to contain a placeholder value: ${value}`);
        }
      });
    }
  });

  // Log warnings
  if (warnings.length > 0) {
    logger.warn('Environment validation warnings:');
    warnings.forEach((warning) => {
      logger.warn(`  - ${warning}`);
    });
  }

  // Throw errors if any
  if (errors.length > 0) {
    const errorMessage = `Environment validation failed:\n${errors.map((e) => `  - ${e}`).join('\n')}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  logger.info('Environment validation passed');
  
  if (warnings.length > 0) {
    logger.info(`${warnings.length} warning(s) found - please review`);
  }
}

module.exports = { validateEnvironment };

