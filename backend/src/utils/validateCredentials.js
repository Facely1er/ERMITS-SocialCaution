/**
 * Validates that default/insecure credentials are not being used
 * This should be called before starting the server
 */

const logger = require('./logger');

const DEFAULT_CREDENTIALS = {
  MONGO_ROOT_USERNAME: ['admin', 'root', 'user', 'mongodb'],
  MONGO_ROOT_PASSWORD: ['password', 'admin', 'root', '123456', 'password123'],
  JWT_SECRET: ['secret', 'jwt-secret', 'your_jwt_secret_here'],
  JWT_REFRESH_SECRET: ['refresh-secret', 'jwt-refresh-secret', 'your_jwt_refresh_secret_here'],
  SESSION_SECRET: ['session-secret', 'your_session_secret_here'],
};

const PLACEHOLDER_PATTERNS = [
  /^your_.*_here$/i,
  /^change_me$/i,
  /^replace_me$/i,
  /^example\.com$/i,
  /^localhost$/i,
];

function validateCredentials() {
  const errors = [];
  const warnings = [];

  // Check MongoDB credentials
  const mongoUsername = process.env.MONGO_ROOT_USERNAME;
  const mongoPassword = process.env.MONGO_ROOT_PASSWORD;

  if (!mongoUsername || !mongoPassword) {
    errors.push('MONGO_ROOT_USERNAME and MONGO_ROOT_PASSWORD must be set');
  } else {
    if (DEFAULT_CREDENTIALS.MONGO_ROOT_USERNAME.includes(mongoUsername.toLowerCase())) {
      errors.push(`MONGO_ROOT_USERNAME cannot be a default value: ${mongoUsername}`);
    }
    if (DEFAULT_CREDENTIALS.MONGO_ROOT_PASSWORD.includes(mongoPassword.toLowerCase())) {
      errors.push('MONGO_ROOT_PASSWORD cannot be a default/insecure password');
    }
    if (mongoPassword.length < 12) {
      errors.push('MONGO_ROOT_PASSWORD must be at least 12 characters long');
    }
  }

  // Check JWT secrets
  const jwtSecret = process.env.JWT_SECRET;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!jwtSecret || !jwtRefreshSecret) {
    errors.push('JWT_SECRET and JWT_REFRESH_SECRET must be set');
  } else {
    if (DEFAULT_CREDENTIALS.JWT_SECRET.includes(jwtSecret.toLowerCase())) {
      errors.push('JWT_SECRET cannot be a default value');
    }
    if (DEFAULT_CREDENTIALS.JWT_REFRESH_SECRET.includes(jwtRefreshSecret.toLowerCase())) {
      errors.push('JWT_REFRESH_SECRET cannot be a default value');
    }
    if (jwtSecret.length < 32) {
      errors.push('JWT_SECRET must be at least 32 characters long');
    }
    if (jwtRefreshSecret.length < 32) {
      errors.push('JWT_REFRESH_SECRET must be at least 32 characters long');
    }
    if (jwtSecret === jwtRefreshSecret) {
      errors.push('JWT_SECRET and JWT_REFRESH_SECRET must be different');
    }
  }

  // Check for placeholder values
  Object.keys(process.env).forEach((key) => {
    const value = process.env[key];
    if (typeof value === 'string' && value.length > 0) {
      PLACEHOLDER_PATTERNS.forEach((pattern) => {
        if (pattern.test(value)) {
          warnings.push(`Environment variable ${key} appears to contain a placeholder value`);
        }
      });
    }
  });

  // Log warnings
  if (warnings.length > 0) {
    warnings.forEach((warning) => {
      logger.warn(warning);
    });
  }

  // Throw errors if any
  if (errors.length > 0) {
    const errorMessage = `Credential validation failed:\n${errors.join('\n')}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  logger.info('Credential validation passed');
}

module.exports = { validateCredentials };

