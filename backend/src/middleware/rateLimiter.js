/**
 * Persistent rate limiting middleware using Redis
 * Implements sliding window algorithm for accurate rate limiting
 */

const Redis = require('ioredis');
const logger = require('../utils/logger');

// Redis client instance (singleton)
let redisClient = null;

// Initialize Redis client
function initRedis() {
  if (redisClient) {
    return redisClient;
  }

  const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0', 10),
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true,
  };

  redisClient = new Redis(redisConfig);

  redisClient.on('connect', () => {
    logger.info('Redis client connected');
  });

  redisClient.on('error', (err) => {
    logger.error('Redis client error:', err);
  });

  redisClient.on('close', () => {
    logger.warn('Redis client connection closed');
  });

  return redisClient;
}

// Get Redis client (with fallback to in-memory if Redis unavailable)
async function getRedisClient() {
  try {
    if (!redisClient) {
      initRedis();
    }
    
    // Test connection
    await redisClient.ping();
    return redisClient;
  } catch (error) {
    logger.warn('Redis unavailable, falling back to in-memory rate limiting:', error.message);
    return null;
  }
}

// In-memory fallback store
const memoryStore = new Map();

// Clean up expired entries from memory store
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of memoryStore.entries()) {
    if (value.expiresAt < now) {
      memoryStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

/**
 * Sliding window rate limiter
 * @param {Object} options - Rate limit options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.maxRequests - Maximum requests per window
 * @param {string} options.keyGenerator - Function to generate rate limit key
 * @param {boolean} options.skipSuccessfulRequests - Skip rate limiting for successful requests
 * @param {boolean} options.skipFailedRequests - Skip rate limiting for failed requests
 */
function createRateLimiter(options = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes default
    maxRequests = 100,
    keyGenerator = (req) => req.ip,
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    message = 'Too many requests, please try again later',
  } = options;

  return async (req, res, next) => {
    try {
      const key = `rate_limit:${keyGenerator(req)}`;
      const now = Date.now();
      const windowStart = now - windowMs;

      const redis = await getRedisClient();

      let currentRequests = 0;
      let resetTime = now + windowMs;

      if (redis) {
        // Use Redis for persistent rate limiting
        try {
          // Remove expired entries
          await redis.zremrangebyscore(key, 0, windowStart);

          // Count current requests in window
          currentRequests = await redis.zcard(key);

          // Get oldest request timestamp
          const oldestRequest = await redis.zrange(key, 0, 0, 'WITHSCORES');
          if (oldestRequest.length > 0) {
            resetTime = parseInt(oldestRequest[1], 10) + windowMs;
          }

          if (currentRequests >= maxRequests) {
            // Rate limit exceeded
            const retryAfter = Math.ceil((resetTime - now) / 1000);
            res.setHeader('X-RateLimit-Limit', maxRequests);
            res.setHeader('X-RateLimit-Remaining', 0);
            res.setHeader('X-RateLimit-Reset', new Date(resetTime).toISOString());
            res.setHeader('Retry-After', retryAfter);
            return res.status(429).json({
              status: 'error',
              message,
              retryAfter,
            });
          }

          // Add current request
          await redis.zadd(key, now, `${now}-${Math.random()}`);
          await redis.expire(key, Math.ceil(windowMs / 1000));

          // Set rate limit headers
          res.setHeader('X-RateLimit-Limit', maxRequests);
          res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - currentRequests - 1));
          res.setHeader('X-RateLimit-Reset', new Date(resetTime).toISOString());

          // Track response status for skip options
          if (skipSuccessfulRequests || skipFailedRequests) {
            const originalSend = res.send;
            res.send = function (body) {
              const statusCode = res.statusCode;
              const shouldSkip = 
                (skipSuccessfulRequests && statusCode < 400) ||
                (skipFailedRequests && statusCode >= 400);

              if (shouldSkip && redis) {
                // Remove this request from count
                redis.zrem(key, `${now}-*`).catch(() => {});
              }

              return originalSend.call(this, body);
            };
          }

          next();
        } catch (redisError) {
          logger.error('Redis rate limiting error:', redisError);
          // Fall through to in-memory fallback
        }
      }

      // Fallback to in-memory rate limiting
      const memoryKey = key;
      const memoryEntry = memoryStore.get(memoryKey);

      if (memoryEntry) {
        // Remove expired requests
        memoryEntry.requests = memoryEntry.requests.filter(
          (timestamp) => timestamp > windowStart
        );

        if (memoryEntry.requests.length >= maxRequests) {
          const retryAfter = Math.ceil((memoryEntry.expiresAt - now) / 1000);
          res.setHeader('X-RateLimit-Limit', maxRequests);
          res.setHeader('X-RateLimit-Remaining', 0);
          res.setHeader('X-RateLimit-Reset', new Date(memoryEntry.expiresAt).toISOString());
          res.setHeader('Retry-After', retryAfter);
          return res.status(429).json({
            status: 'error',
            message,
            retryAfter,
          });
        }

        memoryEntry.requests.push(now);
        memoryEntry.expiresAt = now + windowMs;
      } else {
        memoryStore.set(memoryKey, {
          requests: [now],
          expiresAt: now + windowMs,
        });
      }

      const entry = memoryStore.get(memoryKey);
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - entry.requests.length));
      res.setHeader('X-RateLimit-Reset', new Date(entry.expiresAt).toISOString());

      next();
    } catch (error) {
      logger.error('Rate limiter error:', error);
      // On error, allow request through (fail open)
      next();
    }
  };
}

// Pre-configured rate limiters
const rateLimiters = {
  // General API rate limiter
  api: createRateLimiter({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    keyGenerator: (req) => req.ip,
  }),

  // Strict rate limiter for authentication endpoints
  auth: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 requests per 15 minutes
    keyGenerator: (req) => `auth:${req.ip}`,
    message: 'Too many authentication attempts, please try again later',
  }),

  // Rate limiter for password reset
  passwordReset: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 requests per hour
    keyGenerator: (req) => `password_reset:${req.ip}`,
    message: 'Too many password reset attempts, please try again later',
  }),

  // Rate limiter for registration
  registration: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5, // 5 registrations per hour per IP
    keyGenerator: (req) => `registration:${req.ip}`,
    message: 'Too many registration attempts, please try again later',
  }),
};

// Close Redis connection on shutdown
process.on('SIGTERM', () => {
  if (redisClient) {
    redisClient.quit();
  }
});

process.on('SIGINT', () => {
  if (redisClient) {
    redisClient.quit();
  }
});

module.exports = {
  createRateLimiter,
  rateLimiters,
  initRedis,
};

