const logger = require('../utils/logger');

/**
 * Custom API Error class
 */
class APIError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async error wrapper
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Enhanced error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Log error
  logger.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    user: req.user?.id || 'anonymous'
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new APIError('Resource not found', 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error = new APIError(`${field} already exists`, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new APIError('Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new APIError('Token expired', 401);
  }

  // Rate limit error
  if (err.name === 'TooManyRequestsError') {
    error = new APIError('Too many requests, please try again later', 429);
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      error: err
    })
  };

  res.status(statusCode).json(response);
};

/**
 * 404 handler
 */
const notFound = (req, res, next) => {
  const error = new APIError(`Route not found: ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Validation error formatter
 */
const formatValidationError = (errors) => {
  return errors.map(err => ({
    field: err.path || err.param,
    message: err.msg || err.message
  }));
};

module.exports = {
  APIError,
  asyncHandler,
  errorHandler,
  notFound,
  formatValidationError
};
