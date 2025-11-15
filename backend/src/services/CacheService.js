const NodeCache = require('node-cache');
const logger = require('../utils/logger');

class CacheService {
  constructor() {
    // Create cache instances for different data types
    this.userCache = new NodeCache({ 
      stdTTL: 300, // 5 minutes
      checkperiod: 60, // Check for expired keys every minute
      useClones: false
    });

    this.assessmentCache = new NodeCache({ 
      stdTTL: 600, // 10 minutes
      checkperiod: 60,
      useClones: false
    });

    this.challengeCache = new NodeCache({ 
      stdTTL: 300, // 5 minutes
      checkperiod: 60,
      useClones: false
    });

    this.progressCache = new NodeCache({ 
      stdTTL: 180, // 3 minutes
      checkperiod: 60,
      useClones: false
    });

    this.achievementCache = new NodeCache({ 
      stdTTL: 1800, // 30 minutes
      checkperiod: 60,
      useClones: false
    });

    this.generalCache = new NodeCache({ 
      stdTTL: 300, // 5 minutes
      checkperiod: 60,
      useClones: false
    });

    // Set up event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    // User cache events
    this.userCache.on('set', (key, _value) => {
      logger.debug(`User cache set: ${key}`);
    });

    this.userCache.on('del', (key) => {
      logger.debug(`User cache deleted: ${key}`);
    });

    // Assessment cache events
    this.assessmentCache.on('set', (key, _value) => {
      logger.debug(`Assessment cache set: ${key}`);
    });

    this.assessmentCache.on('del', (key) => {
      logger.debug(`Assessment cache deleted: ${key}`);
    });

    // Challenge cache events
    this.challengeCache.on('set', (key, _value) => {
      logger.debug(`Challenge cache set: ${key}`);
    });

    this.challengeCache.on('del', (key) => {
      logger.debug(`Challenge cache deleted: ${key}`);
    });

    // Progress cache events
    this.progressCache.on('set', (key, _value) => {
      logger.debug(`Progress cache set: ${key}`);
    });

    this.progressCache.on('del', (key) => {
      logger.debug(`Progress cache deleted: ${key}`);
    });

    // Achievement cache events
    this.achievementCache.on('set', (key, _value) => {
      logger.debug(`Achievement cache set: ${key}`);
    });

    this.achievementCache.on('del', (key) => {
      logger.debug(`Achievement cache deleted: ${key}`);
    });
  }

  // User cache methods
  setUser(userId, userData, ttl = 300) {
    const key = `user:${userId}`;
    return this.userCache.set(key, userData, ttl);
  }

  getUser(userId) {
    const key = `user:${userId}`;
    return this.userCache.get(key);
  }

  deleteUser(userId) {
    const key = `user:${userId}`;
    return this.userCache.del(key);
  }

  // Assessment cache methods
  setAssessment(assessmentId, assessmentData, ttl = 600) {
    const key = `assessment:${assessmentId}`;
    return this.assessmentCache.set(key, assessmentData, ttl);
  }

  getAssessment(assessmentId) {
    const key = `assessment:${assessmentId}`;
    return this.assessmentCache.get(key);
  }

  setUserAssessments(userId, assessments, ttl = 300) {
    const key = `user:${userId}:assessments`;
    return this.assessmentCache.set(key, assessments, ttl);
  }

  getUserAssessments(userId) {
    const key = `user:${userId}:assessments`;
    return this.assessmentCache.get(key);
  }

  deleteAssessment(assessmentId) {
    const key = `assessment:${assessmentId}`;
    return this.assessmentCache.del(key);
  }

  deleteUserAssessments(userId) {
    const key = `user:${userId}:assessments`;
    return this.assessmentCache.del(key);
  }

  // Challenge cache methods
  setChallenge(challengeId, challengeData, ttl = 300) {
    const key = `challenge:${challengeId}`;
    return this.challengeCache.set(key, challengeData, ttl);
  }

  getChallenge(challengeId) {
    const key = `challenge:${challengeId}`;
    return this.challengeCache.get(key);
  }

  setUserChallenges(userId, challenges, ttl = 300) {
    const key = `user:${userId}:challenges`;
    return this.challengeCache.set(key, challenges, ttl);
  }

  getUserChallenges(userId) {
    const key = `user:${userId}:challenges`;
    return this.challengeCache.get(key);
  }

  deleteChallenge(challengeId) {
    const key = `challenge:${challengeId}`;
    return this.challengeCache.del(key);
  }

  deleteUserChallenges(userId) {
    const key = `user:${userId}:challenges`;
    return this.challengeCache.del(key);
  }

  // Progress cache methods
  setProgress(userId, progressData, ttl = 180) {
    const key = `user:${userId}:progress`;
    return this.progressCache.set(key, progressData, ttl);
  }

  getProgress(userId) {
    const key = `user:${userId}:progress`;
    return this.progressCache.get(key);
  }

  deleteProgress(userId) {
    const key = `user:${userId}:progress`;
    return this.progressCache.del(key);
  }

  // Achievement cache methods
  setAchievements(userId, achievements, ttl = 1800) {
    const key = `user:${userId}:achievements`;
    return this.achievementCache.set(key, achievements, ttl);
  }

  getAchievements(userId) {
    const key = `user:${userId}:achievements`;
    return this.achievementCache.get(key);
  }

  setAchievement(achievementId, achievementData, ttl = 1800) {
    const key = `achievement:${achievementId}`;
    return this.achievementCache.set(key, achievementData, ttl);
  }

  getAchievement(achievementId) {
    const key = `achievement:${achievementId}`;
    return this.achievementCache.get(key);
  }

  deleteAchievements(userId) {
    const key = `user:${userId}:achievements`;
    return this.achievementCache.del(key);
  }

  deleteAchievement(achievementId) {
    const key = `achievement:${achievementId}`;
    return this.achievementCache.del(key);
  }

  // General cache methods
  set(key, value, ttl = 300) {
    return this.generalCache.set(key, value, ttl);
  }

  get(key) {
    return this.generalCache.get(key);
  }

  delete(key) {
    return this.generalCache.del(key);
  }

  // Leaderboard cache methods
  setLeaderboard(type, data, ttl = 600) {
    const key = `leaderboard:${type}`;
    return this.generalCache.set(key, data, ttl);
  }

  getLeaderboard(type) {
    const key = `leaderboard:${type}`;
    return this.generalCache.get(key);
  }

  deleteLeaderboard(type) {
    const key = `leaderboard:${type}`;
    return this.generalCache.del(key);
  }

  // Statistics cache methods
  setStatistics(userId, type, data, ttl = 300) {
    const key = `stats:${userId}:${type}`;
    return this.generalCache.set(key, data, ttl);
  }

  getStatistics(userId, type) {
    const key = `stats:${userId}:${type}`;
    return this.generalCache.get(key);
  }

  deleteStatistics(userId, type) {
    const key = `stats:${userId}:${type}`;
    return this.generalCache.del(key);
  }

  // Cache warming methods
  async warmUserCache(userId) {
    try {
      const User = require('../models/User');
      const user = await User.findById(userId);
      if (user) {
        this.setUser(userId, user);
        logger.info(`Warmed user cache for user: ${userId}`);
      }
    } catch (error) {
      logger.error('Error warming user cache:', error);
    }
  }

  async warmProgressCache(userId) {
    try {
      const Progress = require('../models/Progress');
      const progress = await Progress.findOne({ userId });
      if (progress) {
        this.setProgress(userId, progress);
        logger.info(`Warmed progress cache for user: ${userId}`);
      }
    } catch (error) {
      logger.error('Error warming progress cache:', error);
    }
  }

  async warmAchievementCache(userId) {
    try {
      const Achievement = require('../models/Achievement');
      const achievements = await Achievement.find({ userId });
      if (achievements.length > 0) {
        this.setAchievements(userId, achievements);
        logger.info(`Warmed achievement cache for user: ${userId}`);
      }
    } catch (error) {
      logger.error('Error warming achievement cache:', error);
    }
  }

  // Cache invalidation methods
  invalidateUser(userId) {
    this.deleteUser(userId);
    this.deleteUserAssessments(userId);
    this.deleteUserChallenges(userId);
    this.deleteProgress(userId);
    this.deleteAchievements(userId);
    logger.info(`Invalidated all caches for user: ${userId}`);
  }

  invalidateAssessment(assessmentId, userId = null) {
    this.deleteAssessment(assessmentId);
    if (userId) {
      this.deleteUserAssessments(userId);
    }
    logger.info(`Invalidated assessment cache: ${assessmentId}`);
  }

  invalidateChallenge(challengeId, userId = null) {
    this.deleteChallenge(challengeId);
    if (userId) {
      this.deleteUserChallenges(userId);
    }
    logger.info(`Invalidated challenge cache: ${challengeId}`);
  }

  invalidateProgress(userId) {
    this.deleteProgress(userId);
    logger.info(`Invalidated progress cache for user: ${userId}`);
  }

  invalidateAchievements(userId) {
    this.deleteAchievements(userId);
    logger.info(`Invalidated achievement cache for user: ${userId}`);
  }

  // Cache statistics
  getStats() {
    return {
      user: {
        keys: this.userCache.keys().length,
        hits: this.userCache.getStats().hits,
        misses: this.userCache.getStats().misses,
        hitRate: this.userCache.getStats().hits / (this.userCache.getStats().hits + this.userCache.getStats().misses) * 100
      },
      assessment: {
        keys: this.assessmentCache.keys().length,
        hits: this.assessmentCache.getStats().hits,
        misses: this.assessmentCache.getStats().misses,
        hitRate: this.assessmentCache.getStats().hits / (this.assessmentCache.getStats().hits + this.assessmentCache.getStats().misses) * 100
      },
      challenge: {
        keys: this.challengeCache.keys().length,
        hits: this.challengeCache.getStats().hits,
        misses: this.challengeCache.getStats().misses,
        hitRate: this.challengeCache.getStats().hits / (this.challengeCache.getStats().hits + this.challengeCache.getStats().misses) * 100
      },
      progress: {
        keys: this.progressCache.keys().length,
        hits: this.progressCache.getStats().hits,
        misses: this.progressCache.getStats().misses,
        hitRate: this.progressCache.getStats().hits / (this.progressCache.getStats().hits + this.progressCache.getStats().misses) * 100
      },
      achievement: {
        keys: this.achievementCache.keys().length,
        hits: this.achievementCache.getStats().hits,
        misses: this.achievementCache.getStats().misses,
        hitRate: this.achievementCache.getStats().hits / (this.achievementCache.getStats().hits + this.achievementCache.getStats().misses) * 100
      },
      general: {
        keys: this.generalCache.keys().length,
        hits: this.generalCache.getStats().hits,
        misses: this.generalCache.getStats().misses,
        hitRate: this.generalCache.getStats().hits / (this.generalCache.getStats().hits + this.generalCache.getStats().misses) * 100
      }
    };
  }

  // Clear all caches
  clearAll() {
    this.userCache.flushAll();
    this.assessmentCache.flushAll();
    this.challengeCache.flushAll();
    this.progressCache.flushAll();
    this.achievementCache.flushAll();
    this.generalCache.flushAll();
    logger.info('All caches cleared');
  }

  // Clear expired keys
  clearExpired() {
    this.userCache.flushExpired();
    this.assessmentCache.flushExpired();
    this.challengeCache.flushExpired();
    this.progressCache.flushExpired();
    this.achievementCache.flushExpired();
    this.generalCache.flushExpired();
    logger.info('Expired cache keys cleared');
  }
}

module.exports = new CacheService();