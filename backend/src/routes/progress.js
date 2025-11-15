const express = require('express');
const { body, validationResult } = require('express-validator');
const Progress = require('../models/Progress');
const Achievement = require('../models/Achievement');
const { authenticate } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/progress
// @desc    Get user progress
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    let progress = await Progress.findOne({ userId });

    // Create progress record if it doesn't exist
    if (!progress) {
      progress = new Progress({ userId });
      await progress.save();
    }

    res.json({
      status: 'success',
      data: {
        progress: progress.getSummary()
      }
    });

  } catch (error) {
    logger.error('Get progress error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching progress'
    });
  }
});

// @route   PUT /api/progress
// @desc    Update user progress
// @access  Private
router.put('/', 
  authenticate,
  [
    body('totalPoints').optional().isInt({ min: 0 }).withMessage('Total points must be a non-negative integer'),
    body('level').optional().isInt({ min: 1 }).withMessage('Level must be a positive integer'),
    body('streak').optional().isInt({ min: 0 }).withMessage('Streak must be a non-negative integer'),
    body('badges').optional().isArray().withMessage('Badges must be an array')
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
      const updates = req.body;

      let progress = await Progress.findOne({ userId });

      if (!progress) {
        progress = new Progress({ userId });
      }

      // Update progress fields
      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined) {
          progress[key] = updates[key];
        }
      });

      await progress.save();

      // Check for new achievements
      const newAchievements = await Achievement.checkAndUnlockAchievements(userId, progress);

      res.json({
        status: 'success',
        message: 'Progress updated successfully',
        data: {
          progress: progress.getSummary(),
          newAchievements: newAchievements.map(achievement => achievement.getSummary())
        }
      });

    } catch (error) {
      logger.error('Update progress error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server error while updating progress'
      });
    }
  }
);

// @route   POST /api/progress/add-points
// @desc    Add points to user progress
// @access  Private
router.post('/add-points',
  authenticate,
  [
    body('points').isInt({ min: 1 }).withMessage('Points must be a positive integer'),
    body('source').optional().isIn(['assessment', 'action', 'challenge', 'social', 'general']).withMessage('Invalid source')
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
      const { points, source = 'general' } = req.body;

      let progress = await Progress.findOne({ userId });

      if (!progress) {
        progress = new Progress({ userId });
      }

      // Add points
      await progress.addPoints(points, source);

      // Check for new achievements
      const newAchievements = await Achievement.checkAndUnlockAchievements(userId, progress);

      res.json({
        status: 'success',
        message: 'Points added successfully',
        data: {
          progress: progress.getSummary(),
          newAchievements: newAchievements.map(achievement => achievement.getSummary())
        }
      });

    } catch (error) {
      logger.error('Add points error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server error while adding points'
      });
    }
  }
);

// @route   POST /api/progress/update-streak
// @desc    Update user streak
// @access  Private
router.post('/update-streak', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    let progress = await Progress.findOne({ userId });

    if (!progress) {
      progress = new Progress({ userId });
    }

    // Update streak
    await progress.updateStreak();

    // Check for new achievements
    const newAchievements = await Achievement.checkAndUnlockAchievements(userId, progress);

    res.json({
      status: 'success',
      message: 'Streak updated successfully',
      data: {
        progress: progress.getSummary(),
        newAchievements: newAchievements.map(achievement => achievement.getSummary())
      }
    });

  } catch (error) {
    logger.error('Update streak error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating streak'
    });
  }
});

// @route   POST /api/progress/add-badge
// @desc    Add badge to user progress
// @access  Private
router.post('/add-badge',
  authenticate,
  [
    body('badgeId').notEmpty().withMessage('Badge ID is required')
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
      const { badgeId } = req.body;

      let progress = await Progress.findOne({ userId });

      if (!progress) {
        progress = new Progress({ userId });
      }

      // Add badge
      await progress.addBadge(badgeId);

      res.json({
        status: 'success',
        message: 'Badge added successfully',
        data: {
          progress: progress.getSummary()
        }
      });

    } catch (error) {
      logger.error('Add badge error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server error while adding badge'
      });
    }
  }
);

// @route   GET /api/progress/leaderboard
// @desc    Get leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await Progress.getLeaderboard(parseInt(limit));

    res.json({
      status: 'success',
      data: {
        leaderboard: leaderboard.map(user => ({
          user: {
            id: user.userId._id,
            name: `${user.userId.firstName} ${user.userId.lastName}`,
            avatar: user.userId.avatar
          },
          totalPoints: user.totalPoints,
          level: user.level,
          streak: user.streak,
          badges: user.badges.length
        }))
      }
    });

  } catch (error) {
    logger.error('Get leaderboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching leaderboard'
    });
  }
});

// @route   GET /api/progress/statistics
// @desc    Get progress statistics
// @access  Private
router.get('/statistics', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    const progress = await Progress.findOne({ userId });
    if (!progress) {
      return res.status(404).json({
        status: 'error',
        message: 'Progress not found'
      });
    }

    const statistics = {
      totalPoints: progress.totalPoints,
      level: progress.level,
      currentLevelPoints: progress.currentLevelPoints,
      nextLevelPoints: progress.nextLevelPoints,
      levelProgressPercentage: progress.levelProgressPercentage,
      pointsToNextLevel: progress.pointsToNextLevel,
      streak: progress.streak,
      longestStreak: progress.statistics.longestStreak,
      badges: progress.badges.length,
      totalAssessments: progress.statistics.totalAssessments,
      completedAssessments: progress.statistics.completedAssessments,
      averageScore: progress.statistics.averageScore,
      totalActionItems: progress.statistics.totalActionItems,
      completedActionItems: progress.statistics.completedActionItems,
      totalChallenges: progress.statistics.totalChallenges,
      completedChallenges: progress.statistics.completedChallenges,
      socialShares: progress.socialShares
    };

    res.json({
      status: 'success',
      data: {
        statistics
      }
    });

  } catch (error) {
    logger.error('Get progress statistics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching statistics'
    });
  }
});

// @route   PUT /api/progress/preferences
// @desc    Update progress preferences
// @access  Private
router.put('/preferences',
  authenticate,
  [
    body('preferences').isObject().withMessage('Preferences must be an object')
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
      const { preferences } = req.body;

      let progress = await Progress.findOne({ userId });

      if (!progress) {
        progress = new Progress({ userId });
      }

      // Update preferences
      progress.preferences = { ...progress.preferences, ...preferences };
      await progress.save();

      res.json({
        status: 'success',
        message: 'Preferences updated successfully',
        data: {
          progress: progress.getSummary()
        }
      });

    } catch (error) {
      logger.error('Update preferences error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server error while updating preferences'
      });
    }
  }
);

module.exports = router;