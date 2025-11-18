const NodeCache = require('node-cache');
const logger = require('../utils/logger');

// Create cache instance
// stdTTL: default time to live in seconds
// checkperiod: automatic delete check interval in seconds
const cache = new NodeCache({
  stdTTL: 600, // 10 minutes default
  checkperiod: 120, // check every 2 minutes
  useClones: false // performance optimization
});

/**
 * Cache middleware factory
 * @param {number} duration - Cache duration in seconds
 * @param {function} keyGenerator - Function to generate cache key from request
 */
const cacheMiddleware = (duration = 600, keyGenerator = null) => {
  return (req, res, next) => {
    // Skip cache for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key
    const key = keyGenerator
      ? keyGenerator(req)
      : `${req.user?.id || 'anonymous'}:${req.originalUrl}`;

    try {
      // Try to get cached response
      const cachedResponse = cache.get(key);

      if (cachedResponse) {
        logger.debug('Cache hit:', { key });
        return res.json(cachedResponse);
      }

      // Store original res.json
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = (body) => {
        // Only cache successful responses
        if (res.statusCode === 200 && body.success !== false) {
          cache.set(key, body, duration);
          logger.debug('Cache set:', { key, duration });
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next(); // Continue without caching on error
    }
  };
};

/**
 * Invalidate cache by pattern
 * @param {string} pattern - Pattern to match keys (supports wildcards)
 */
const invalidateCache = (pattern) => {
  try {
    const keys = cache.keys();
    const keysToDelete = keys.filter(key => {
      if (pattern.includes('*')) {
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        return regex.test(key);
      }
      return key === pattern;
    });

    keysToDelete.forEach(key => cache.del(key));
    logger.info('Cache invalidated:', { pattern, count: keysToDelete.length });

    return keysToDelete.length;
  } catch (error) {
    logger.error('Cache invalidation error:', error);
    return 0;
  }
};

/**
 * Clear all cache
 */
const clearCache = () => {
  try {
    cache.flushAll();
    logger.info('All cache cleared');
  } catch (error) {
    logger.error('Cache clear error:', error);
  }
};

/**
 * Get cache statistics
 */
const getCacheStats = () => {
  return cache.getStats();
};

/**
 * Specific cache key generators
 */
const keyGenerators = {
  personas: (_req) => 'personas:all',
  personaByName: (req) => `persona:${req.params.name}`,
  userPersona: (req) => `user:${req.user.id}:persona`,
  cautions: (req) => {
    const { page, limit, category, severity } = req.query;
    return `user:${req.user.id}:cautions:${page || 1}:${limit || 20}:${category || 'all'}:${severity || 'all'}`;
  },
  cautionStats: (req) => `user:${req.user.id}:caution-stats`,
  categories: () => 'caution:categories'
};

module.exports = {
  cache,
  cacheMiddleware,
  invalidateCache,
  clearCache,
  getCacheStats,
  keyGenerators
};
