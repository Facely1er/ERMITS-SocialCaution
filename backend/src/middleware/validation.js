const { body, param, query, validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Common validation rules
const commonValidations = {
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  password: body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  name: (field) => body(field)
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage(`${field} must be between 2 and 50 characters`),

  mongoId: (field) => param(field)
    .isMongoId()
    .withMessage(`Invalid ${field} ID format`),

  uuid: (field) => param(field)
    .isUUID()
    .withMessage(`Invalid ${field} ID format`),

  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ]
};

// Assessment validations
const assessmentValidations = {
  start: [
    body('type')
      .isIn(['exposure', 'privacy-rights', 'security', 'complete'])
      .withMessage('Invalid assessment type')
  ],

  answer: [
    body('questionId')
      .notEmpty()
      .withMessage('Question ID is required'),
    body('value')
      .notEmpty()
      .withMessage('Answer value is required'),
    body('score')
      .isInt({ min: 0, max: 3 })
      .withMessage('Score must be between 0 and 3'),
    body('level')
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Invalid level')
  ]
};

// Challenge validations
const challengeValidations = {
  completeTask: [
    param('taskId')
      .isMongoId()
      .withMessage('Invalid task ID format')
  ]
};

// Progress validations
const progressValidations = {
  update: [
    body('totalPoints')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Total points must be a non-negative integer'),
    body('level')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Level must be a positive integer'),
    body('streak')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Streak must be a non-negative integer'),
    body('badges')
      .optional()
      .isArray()
      .withMessage('Badges must be an array')
  ],

  addPoints: [
    body('points')
      .isInt({ min: 1 })
      .withMessage('Points must be a positive integer'),
    body('source')
      .optional()
      .isIn(['assessment', 'action', 'challenge', 'social', 'general'])
      .withMessage('Invalid source')
  ],

  addBadge: [
    body('badgeId')
      .notEmpty()
      .withMessage('Badge ID is required')
  ]
};

// Achievement validations
const achievementValidations = {
  unlock: [
    body('achievementId')
      .notEmpty()
      .withMessage('Achievement ID is required')
  ]
};

// User validations
const userValidations = {
  register: [
    commonValidations.name('firstName'),
    commonValidations.name('lastName'),
    commonValidations.email,
    commonValidations.password
  ],

  login: [
    commonValidations.email,
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  updateProfile: [
    commonValidations.name('firstName').optional(),
    commonValidations.name('lastName').optional(),
    body('preferences')
      .optional()
      .isObject()
      .withMessage('Preferences must be an object'),
    body('privacyProfile')
      .optional()
      .isObject()
      .withMessage('Privacy profile must be an object')
  ],

  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    commonValidations.password
  ]
};

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation errors:', errors.array());
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg,
          value: error.value
        }))
      });
    }

    next();
  };
};

// Sanitization middleware
const sanitize = (req, res, next) => {
  // Remove any potential XSS or injection attempts
  const sanitizeObject = (obj) => {
    if (typeof obj === 'string') {
      return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    if (typeof obj === 'object' && obj !== null) {
      const sanitized = {};
      for (const key in obj) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

// Custom validators
const customValidators = {
  // Check if email is not already in use
  emailNotExists: async (email) => {
    const User = require('../models/User');
    const user = await User.findOne({ email });
    if (user) {
      throw new Error('Email is already in use');
    }
    return true;
  },

  // Check if email exists
  emailExists: async (email) => {
    const User = require('../models/User');
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Email not found');
    }
    return true;
  },

  // Check if assessment exists and belongs to user
  assessmentExists: async (assessmentId, userId) => {
    const Assessment = require('../models/Assessment');
    const assessment = await Assessment.findOne({ _id: assessmentId, userId });
    if (!assessment) {
      throw new Error('Assessment not found or access denied');
    }
    return true;
  },

  // Check if challenge exists and belongs to user
  challengeExists: async (challengeId, userId) => {
    const Challenge = require('../models/Challenge');
    const challenge = await Challenge.findOne({ _id: challengeId, userId });
    if (!challenge) {
      throw new Error('Challenge not found or access denied');
    }
    return true;
  },

  // Check if achievement exists and belongs to user
  achievementExists: async (achievementId, userId) => {
    const Achievement = require('../models/Achievement');
    const achievement = await Achievement.findOne({ _id: achievementId, userId });
    if (!achievement) {
      throw new Error('Achievement not found or access denied');
    }
    return true;
  }
};

// Validation error handler
const handleValidationError = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message,
      value: err.value
    }));

    logger.warn('Mongoose validation error:', errors);
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors
    });
  }

  if (error.name === 'CastError') {
    logger.warn('Mongoose cast error:', error.message);
    return res.status(400).json({
      status: 'error',
      message: 'Invalid ID format',
      field: error.path
    });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    logger.warn('Mongoose duplicate key error:', field);
    return res.status(409).json({
      status: 'error',
      message: `${field} already exists`,
      field
    });
  }

  next(error);
};

module.exports = {
  commonValidations,
  assessmentValidations,
  challengeValidations,
  progressValidations,
  achievementValidations,
  userValidations,
  validate,
  sanitize,
  customValidators,
  handleValidationError
};