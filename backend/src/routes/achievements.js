const express = require('express');
const { body, validationResult } = require('express-validator');
const Achievement = require('../models/Achievement');
const Progress = require('../models/Progress');
const { authenticate } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/achievements
// @desc    Get user achievements
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { category, rarity, unlocked, limit = 50, page = 1 } = req.query;
    const userId = req.user._id;

    // Build query
    const query = { userId };
    if (category) query.category = category;
    if (rarity) query.rarity = rarity;
    if (unlocked !== undefined) query.unlocked = unlocked === 'true';

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get achievements
    const achievements = await Achievement.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Achievement.countDocuments(query);

    res.json({
      status: 'success',
      data: {
        achievements: achievements.map(achievement => achievement.getSummary()),
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get achievements error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching achievements'
    });
  }
});

// @route   GET /api/achievements/:id
// @desc    Get specific achievement details
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const achievement = await Achievement.findOne({
      _id: id,
      userId
    });

    if (!achievement) {
      return res.status(404).json({
        status: 'error',
        message: 'Achievement not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        achievement: achievement.getSummary()
      }
    });

  } catch (error) {
    logger.error('Get achievement error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching achievement'
    });
  }
});

// @route   POST /api/achievements/unlock
// @desc    Manually unlock an achievement
// @access  Private
router.post('/unlock',
  authenticate,
  [
    body('achievementId').notEmpty().withMessage('Achievement ID is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user._id;
      const { achievementId } = req.body;

      const achievement = await Achievement.findOne({
        userId,
        achievementId
      });

      if (!achievement) {
        return res.status(404).json({
          status: 'error',
          message: 'Achievement not found'
        });
      }

      if (achievement.unlocked) {
        return res.status(400).json({
          status: 'error',
          message: 'Achievement already unlocked'
        });
      }

      // Unlock achievement
      await achievement.unlock();

      // Add points to user progress
      const progress = await Progress.findOne({ userId });
      if (progress) {
        await progress.addPoints(achievement.points, 'achievement');
      }

      res.json({
        status: 'success',
        message: 'Achievement unlocked successfully',
        data: {
          achievement: achievement.getSummary()
        }
      });

    } catch (error) {
      logger.error('Unlock achievement error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server error while unlocking achievement'
      });
    }
  }
);

// @route   GET /api/achievements/statistics
// @desc    Get achievement statistics
// @access  Private
router.get('/statistics', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    const achievements = await Achievement.find({ userId });
    const unlockedAchievements = achievements.filter(a => a.unlocked);
    const lockedAchievements = achievements.filter(a => !a.unlocked);

    // Group by category
    const categoryStats = achievements.reduce((acc, achievement) => {
      const category = achievement.category;
      if (!acc[category]) {
        acc[category] = { total: 0, unlocked: 0 };
      }
      acc[category].total++;
      if (achievement.unlocked) {
        acc[category].unlocked++;
      }
      return acc;
    }, {});

    // Group by rarity
    const rarityStats = achievements.reduce((acc, achievement) => {
      const rarity = achievement.rarity;
      if (!acc[rarity]) {
        acc[rarity] = { total: 0, unlocked: 0 };
      }
      acc[rarity].total++;
      if (achievement.unlocked) {
        acc[rarity].unlocked++;
      }
      return acc;
    }, {});

    const statistics = {
      total: achievements.length,
      unlocked: unlockedAchievements.length,
      locked: lockedAchievements.length,
      completionRate: achievements.length > 0 
        ? Math.round((unlockedAchievements.length / achievements.length) * 100)
        : 0,
      totalPoints: unlockedAchievements.reduce((sum, a) => sum + a.points, 0),
      categoryStats,
      rarityStats,
      recentUnlocks: unlockedAchievements
        .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
        .slice(0, 5)
        .map(achievement => achievement.getSummary())
    };

    res.json({
      status: 'success',
      data: {
        statistics
      }
    });

  } catch (error) {
    logger.error('Get achievement statistics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching statistics'
    });
  }
});

// @route   GET /api/achievements/categories
// @desc    Get achievement categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Achievement.distinct('category');
    const rarities = await Achievement.distinct('rarity');

    res.json({
      status: 'success',
      data: {
        categories,
        rarities
      }
    });

  } catch (error) {
    logger.error('Get achievement categories error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching categories'
    });
  }
});

// @route   POST /api/achievements/check
// @desc    Check and unlock achievements for user
// @access  Private
router.post('/check', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    const progress = await Progress.findOne({ userId });
    if (!progress) {
      return res.status(404).json({
        status: 'error',
        message: 'User progress not found'
      });
    }

    // Check and unlock achievements
    const newAchievements = await Achievement.checkAndUnlockAchievements(userId, progress);

    res.json({
      status: 'success',
      message: `${newAchievements.length} new achievements unlocked`,
      data: {
        newAchievements: newAchievements.map(achievement => achievement.getSummary())
      }
    });

  } catch (error) {
    logger.error('Check achievements error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while checking achievements'
    });
  }
});

// @route   GET /api/achievements/leaderboard
// @desc    Get achievement leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await Achievement.aggregate([
      {
        $match: { unlocked: true }
      },
      {
        $group: {
          _id: '$userId',
          totalAchievements: { $sum: 1 },
          totalPoints: { $sum: '$points' },
          categories: { $addToSet: '$category' },
          rarities: { $addToSet: '$rarity' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          user: {
            id: '$user._id',
            name: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
            avatar: '$user.avatar'
          },
          totalAchievements: 1,
          totalPoints: 1,
          categories: 1,
          rarities: 1
        }
      },
      {
        $sort: { totalAchievements: -1, totalPoints: -1 }
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    res.json({
      status: 'success',
      data: {
        leaderboard
      }
    });

  } catch (error) {
    logger.error('Get achievement leaderboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching leaderboard'
    });
  }
});

// @route   POST /api/achievements/initialize
// @desc    Initialize achievements for user
// @access  Private
router.post('/initialize', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if user already has achievements
    const existingAchievements = await Achievement.find({ userId });
    if (existingAchievements.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Achievements already initialized for this user'
      });
    }

    // Create initial achievements
    const achievements = await Achievement.createInitialAchievements(userId);

    res.status(201).json({
      status: 'success',
      message: 'Achievements initialized successfully',
      data: {
        achievements: achievements.map(achievement => achievement.getSummary())
      }
    });

  } catch (error) {
    logger.error('Initialize achievements error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while initializing achievements'
    });
  }
});

module.exports = router;