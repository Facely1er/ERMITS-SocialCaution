const Joi = require('joi');
const logger = require('../utils/logger');

/**
 * Validation middleware factory
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      logger.warn('Validation error:', { errors, path: req.path });

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    // Replace request data with validated/sanitized data
    req[property] = value;
    next();
  };
};

/**
 * Common validation schemas
 */
const schemas = {
  // Persona selection
  selectPersona: Joi.object({
    personaName: Joi.string()
      .required()
      .trim()
      .lowercase()
      .valid('parent', 'teen', 'professional', 'senior', 'privacy-advocate', 'general')
      .messages({
        'any.required': 'Persona name is required',
        'any.only': 'Invalid persona name'
      })
  }),

  // Caution query params
  cautionQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    category: Joi.string().trim().lowercase().optional(),
    severity: Joi.string().trim().lowercase().valid('low', 'medium', 'high', 'critical').optional(),
    startDate: Joi.date().iso().optional()
  }),

  // User registration
  registerUser: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required(),
    lastName: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(8).max(128).required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      })
  }),

  // User login
  login: Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().required()
  }),

  // MongoDB ObjectId
  objectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message('Invalid ID format')
};

/**
 * Validate pagination parameters
 */
const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({
      success: false,
      message: 'Invalid pagination parameters',
      errors: [
        { field: 'page', message: 'Page must be >= 1' },
        { field: 'limit', message: 'Limit must be between 1 and 100' }
      ]
    });
  }

  req.pagination = { page, limit, skip: (page - 1) * limit };
  next();
};

/**
 * Sanitize query parameters
 */
const sanitizeQuery = (allowedParams) => {
  return (req, res, next) => {
    const sanitized = {};

    for (const param of allowedParams) {
      if (req.query[param] !== undefined) {
        sanitized[param] = req.query[param];
      }
    }

    req.query = sanitized;
    next();
  };
};

module.exports = {
  validate,
  schemas,
  validatePagination,
  sanitizeQuery
};
