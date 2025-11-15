const errorHandler = require('../../middleware/errorHandler');
const logger = require('../../utils/logger');

// Mock logger
jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
}));

describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      url: '/api/test',
      method: 'GET',
      ip: '127.0.0.1',
      get: jest.fn(() => 'test-agent'),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle generic errors', () => {
    const err = new Error('Test error');
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'Test error',
        errorId: expect.any(String),
      })
    );
  });

  it('should handle CastError (404)', () => {
    const err = { name: 'CastError' };
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'Resource not found',
      })
    );
  });

  it('should handle duplicate key error (400)', () => {
    const err = { code: 11000, keyValue: { email: 'test@example.com' } };
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'email already exists',
      })
    );
  });

  it('should handle JWT errors (401)', () => {
    const err = { name: 'JsonWebTokenError' };
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'Invalid token',
      })
    );
  });

  it('should include stack trace in development', () => {
    process.env.NODE_ENV = 'development';
    const err = new Error('Test error');
    err.stack = 'Error stack trace';
    
    errorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        stack: 'Error stack trace',
        details: 'Test error',
      })
    );
  });

  it('should not include stack trace in production', () => {
    process.env.NODE_ENV = 'production';
    const err = new Error('Test error');
    err.stack = 'Error stack trace';
    
    errorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.not.objectContaining({
        stack: expect.anything(),
        details: expect.anything(),
      })
    );
  });
});

