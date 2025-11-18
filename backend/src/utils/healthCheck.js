/**
 * Health Check Utility
 * Provides detailed health status for monitoring
 */

const mongoose = require('mongoose');
// const logger = require('./logger'); // Unused but kept for future logging

let redisClient = null;

// Try to get Redis client if available
try {
  const Redis = require('ioredis');
  if (process.env.REDIS_HOST) {
    redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0', 10),
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });
  }
} catch (error) {
  // Redis not available
}

/**
 * Check database health
 */
async function checkDatabase() {
  try {
    if (mongoose.connection.readyState === 1) {
      // Ping database
      await mongoose.connection.db.admin().ping();
      return { status: 'healthy', latency: Date.now() };
    }
    return { status: 'unhealthy', error: 'Database not connected' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

/**
 * Check Redis health
 */
async function checkRedis() {
  if (!redisClient) {
    return { status: 'not_configured' };
  }

  try {
    const start = Date.now();
    await redisClient.ping();
    const latency = Date.now() - start;
    return { status: 'healthy', latency };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

/**
 * Get system health status
 */
async function getHealthStatus() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: await checkDatabase(),
    redis: await checkRedis(),
  };

  // Determine overall status
  if (checks.database.status === 'unhealthy') {
    checks.status = 'unhealthy';
  }

  return checks;
}

/**
 * Get detailed health status for monitoring
 */
async function getDetailedHealth() {
  const health = await getHealthStatus();
  
  return {
    ...health,
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || 'unknown',
    nodeVersion: process.version,
  };
}

module.exports = {
  getHealthStatus,
  getDetailedHealth,
  checkDatabase,
  checkRedis,
};

