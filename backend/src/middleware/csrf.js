/**
 * CSRF Protection Middleware
 * Implements Double Submit Cookie pattern for CSRF protection
 * Compatible with stateless API architecture
 */

const crypto = require('crypto');
const logger = require('../utils/logger');

// Store for CSRF tokens (in production, use Redis or database)
const tokenStore = new Map();

// Clean up expired tokens
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of tokenStore.entries()) {
    if (value.expiresAt < now) {
      tokenStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

// Token expiration time (1 hour)
const TOKEN_EXPIRATION = 60 * 60 * 1000;

// Safe HTTP methods that don't require CSRF protection
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

/**
 * Generate a CSRF token
 * @returns {string} CSRF token
 */
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create CSRF token and set cookie
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {string} CSRF token
 */
function createToken(req, res) {
  const token = generateToken();
  const sessionId = req.sessionID || req.ip || 'anonymous';
  const expiresAt = Date.now() + TOKEN_EXPIRATION;

  // Store token
  tokenStore.set(token, {
    sessionId,
    expiresAt,
    createdAt: Date.now(),
  });

  // Set cookie with SameSite attribute for CSRF protection
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false, // Must be readable by JavaScript for Double Submit Cookie pattern
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // CSRF protection
    maxAge: TOKEN_EXPIRATION,
    path: '/',
  });

  return token;
}

/**
 * Verify CSRF token
 * @param {Object} req - Express request object
 * @param {string} token - CSRF token from request
 * @returns {boolean} True if token is valid
 */
function verifyToken(req, token) {
  if (!token) {
    return false;
  }

  const stored = tokenStore.get(token);
  if (!stored) {
    return false;
  }

  // Check expiration
  if (stored.expiresAt < Date.now()) {
    tokenStore.delete(token);
    return false;
  }

  // Verify session match (if session exists)
  const sessionId = req.sessionID || req.ip || 'anonymous';
  if (stored.sessionId !== sessionId) {
    logger.warn('CSRF token session mismatch', {
      tokenSession: stored.sessionId,
      requestSession: sessionId,
    });
    return false;
  }

  return true;
}

/**
 * CSRF protection middleware
 * @param {Object} options - Configuration options
 * @param {Array} options.excludedPaths - Paths to exclude from CSRF protection
 * @param {Function} options.getToken - Custom function to extract token from request
 */
function csrfProtection(options = {}) {
  const {
    excludedPaths = [],
    getToken = (req) => {
      // Try header first (for API clients)
      return req.headers['x-csrf-token'] || 
             req.headers['xsrf-token'] ||
             // Try body (for form submissions)
             req.body?._csrf ||
             // Try query parameter (for GET requests with side effects - not recommended)
             req.query?._csrf;
    },
  } = options;

  return (req, res, next) => {
    // Skip CSRF protection for safe methods
    if (SAFE_METHODS.includes(req.method)) {
      return next();
    }

    // Skip CSRF protection for excluded paths
    if (excludedPaths.some((path) => req.path.startsWith(path))) {
      return next();
    }

    // Get token from cookie (Double Submit Cookie pattern)
    const cookieToken = req.cookies?.['XSRF-TOKEN'];
    const requestToken = getToken(req);

    // Both cookie and request token must be present
    if (!cookieToken || !requestToken) {
      logger.warn('CSRF token missing', {
        hasCookieToken: !!cookieToken,
        hasRequestToken: !!requestToken,
        path: req.path,
        method: req.method,
      });
      return res.status(403).json({
        status: 'error',
        message: 'CSRF token missing',
        code: 'CSRF_TOKEN_MISSING',
      });
    }

    // Tokens must match (Double Submit Cookie pattern)
    if (cookieToken !== requestToken) {
      logger.warn('CSRF token mismatch', {
        path: req.path,
        method: req.method,
        ip: req.ip,
      });
      return res.status(403).json({
        status: 'error',
        message: 'CSRF token mismatch',
        code: 'CSRF_TOKEN_MISMATCH',
      });
    }

    // Verify token exists in store
    if (!verifyToken(req, requestToken)) {
      logger.warn('CSRF token invalid or expired', {
        path: req.path,
        method: req.method,
        ip: req.ip,
      });
      return res.status(403).json({
        status: 'error',
        message: 'CSRF token invalid or expired',
        code: 'CSRF_TOKEN_INVALID',
      });
    }

    // Token is valid, proceed
    next();
  };
}

/**
 * Middleware to generate and return CSRF token
 * Should be used on routes that need to get a CSRF token
 */
function csrfToken(req, res, next) {
  const token = createToken(req, res);
  
  // Return token in response for API clients
  res.locals.csrfToken = token;
  
  // For JSON responses, include token in body
  if (req.headers.accept?.includes('application/json')) {
    res.json({
      csrfToken: token,
    });
  } else {
    // For HTML responses, token is in cookie and can be read by JavaScript
    next();
  }
}

/**
 * Express middleware to add CSRF token to response locals
 * Makes token available in templates
 */
function addCsrfTokenToLocals(req, res, next) {
  const cookieToken = req.cookies?.['XSRF-TOKEN'];
  
  if (!cookieToken) {
    // Create new token if none exists
    createToken(req, res);
    res.locals.csrfToken = req.cookies?.['XSRF-TOKEN'];
  } else {
    res.locals.csrfToken = cookieToken;
  }
  
  next();
}

module.exports = {
  csrfProtection,
  csrfToken,
  addCsrfTokenToLocals,
  createToken,
  verifyToken,
};

