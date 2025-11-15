const { createRateLimiter } = require('../../middleware/rateLimiter');

describe('Rate Limiter Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      ip: '127.0.0.1',
    };
    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should allow requests within limit', async () => {
    const limiter = createRateLimiter({
      windowMs: 1000,
      maxRequests: 5,
    });

    // Make 5 requests
    for (let i = 0; i < 5; i++) {
      await limiter(req, res, next);
    }

    expect(next).toHaveBeenCalledTimes(5);
    expect(res.status).not.toHaveBeenCalledWith(429);
  });

  it('should block requests exceeding limit', async () => {
    const limiter = createRateLimiter({
      windowMs: 1000,
      maxRequests: 2,
    });

    // Make 3 requests
    await limiter(req, res, next);
    await limiter(req, res, next);
    await limiter(req, res, next);

    expect(next).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: expect.any(String),
      })
    );
  });

  it('should set rate limit headers', async () => {
    const limiter = createRateLimiter({
      windowMs: 1000,
      maxRequests: 10,
    });

    await limiter(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', 10);
    expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', expect.any(Number));
    expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', expect.any(String));
  });
});

