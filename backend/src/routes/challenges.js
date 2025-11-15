const express = require('express');
// const { body, validationResult } = require('express-validator'); // Unused for now
const Challenge = require('../models/Challenge');
const Progress = require('../models/Progress');
const Achievement = require('../models/Achievement');
const { authenticate } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// @route   POST /api/challenges/start
// @desc    Start a new 30-day challenge
// @access  Private
router.post('/start', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if user already has an active challenge
    const existingChallenge = await Challenge.findOne({
      userId,
      status: 'active'
    });

    if (existingChallenge) {
      return res.status(400).json({
        status: 'error',
        message: 'You already have an active challenge'
      });
    }

    // Create new challenge
    const challenge = new Challenge({
      userId,
      startDate: new Date()
    });

    // Generate daily tasks
    await challenge.generateDailyTasks();

    // Update user progress
    const progress = await Progress.findOne({ userId });
    if (progress) {
      await progress.addPoints(100, 'challenge');
      await progress.updateProgress({
        'statistics.totalChallenges': progress.statistics.totalChallenges + 1
      });
    }

    // Check for achievements
    if (progress) {
      await Achievement.checkAndUnlockAchievements(userId, progress);
    }

    res.status(201).json({
      status: 'success',
      message: 'Challenge started successfully',
      data: {
        challenge: challenge.getSummary()
      }
    });

  } catch (error) {
    logger.error('Start challenge error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while starting challenge'
    });
  }
});

// @route   GET /api/challenges
// @desc    Get user's challenges
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    const userId = req.user._id;

    // Build query
    const query = { userId };
    if (status) query.status = status;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get challenges
    const challenges = await Challenge.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Challenge.countDocuments(query);

    res.json({
      status: 'success',
      data: {
        challenges: challenges.map(challenge => challenge.getSummary()),
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get challenges error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching challenges'
    });
  }
});

// @route   GET /api/challenges/:id
// @desc    Get specific challenge details
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const challenge = await Challenge.findOne({
      _id: id,
      userId
    });

    if (!challenge) {
      return res.status(404).json({
        status: 'error',
        message: 'Challenge not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        challenge
      }
    });

  } catch (error) {
    logger.error('Get challenge error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching challenge'
    });
  }
});

// @route   POST /api/challenges/:id/tasks/:taskId/complete
// @desc    Complete a daily task
// @access  Private
router.post('/:id/tasks/:taskId/complete', authenticate, async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const userId = req.user._id;

    // Find challenge
    const challenge = await Challenge.findOne({
      _id: id,
      userId,
      status: 'active'
    });

    if (!challenge) {
      return res.status(404).json({
        status: 'error',
        message: 'Challenge not found or not active'
      });
    }

    // Complete task
    await challenge.completeTask(taskId);

    // Update user progress
    const progress = await Progress.findOne({ userId });
    if (progress) {
      const task = challenge.dailyTasks.id(taskId);
      await progress.addPoints(task.points, 'action');
      await progress.updateProgress({
        'statistics.completedActionItems': progress.statistics.completedActionItems + 1
      });
    }

    // Check for achievements
    if (progress) {
      await Achievement.checkAndUnlockAchievements(userId, progress);
    }

    res.json({
      status: 'success',
      message: 'Task completed successfully',
      data: {
        challenge: challenge.getSummary(),
        task: challenge.dailyTasks.id(taskId)
      }
    });

  } catch (error) {
    logger.error('Complete task error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while completing task'
    });
  }
});

// @route   GET /api/challenges/:id/tasks
// @desc    Get challenge daily tasks
// @access  Private
router.get('/:id/tasks', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { day, completed } = req.query;
    const userId = req.user._id;

    const challenge = await Challenge.findOne({
      _id: id,
      userId
    });

    if (!challenge) {
      return res.status(404).json({
        status: 'error',
        message: 'Challenge not found'
      });
    }

    let tasks = challenge.dailyTasks;

    // Filter by day if specified
    if (day) {
      tasks = tasks.filter(task => task.day === parseInt(day));
    }

    // Filter by completion status if specified
    if (completed !== undefined) {
      const isCompleted = completed === 'true';
      tasks = tasks.filter(task => task.completed === isCompleted);
    }

    res.json({
      status: 'success',
      data: {
        tasks,
        totalTasks: challenge.dailyTasks.length,
        completedTasks: challenge.dailyTasks.filter(task => task.completed).length
      }
    });

  } catch (error) {
    logger.error('Get challenge tasks error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching tasks'
    });
  }
});

// @route   PUT /api/challenges/:id/pause
// @desc    Pause a challenge
// @access  Private
router.put('/:id/pause', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const challenge = await Challenge.findOne({
      _id: id,
      userId,
      status: 'active'
    });

    if (!challenge) {
      return res.status(404).json({
        status: 'error',
        message: 'Challenge not found or not active'
      });
    }

    challenge.status = 'paused';
    await challenge.save();

    res.json({
      status: 'success',
      message: 'Challenge paused successfully',
      data: {
        challenge: challenge.getSummary()
      }
    });

  } catch (error) {
    logger.error('Pause challenge error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while pausing challenge'
    });
  }
});

// @route   PUT /api/challenges/:id/resume
// @desc    Resume a paused challenge
// @access  Private
router.put('/:id/resume', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const challenge = await Challenge.findOne({
      _id: id,
      userId,
      status: 'paused'
    });

    if (!challenge) {
      return res.status(404).json({
        status: 'error',
        message: 'Challenge not found or not paused'
      });
    }

    challenge.status = 'active';
    await challenge.save();

    res.json({
      status: 'success',
      message: 'Challenge resumed successfully',
      data: {
        challenge: challenge.getSummary()
      }
    });

  } catch (error) {
    logger.error('Resume challenge error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while resuming challenge'
    });
  }
});

// @route   GET /api/challenges/statistics
// @desc    Get challenge statistics
// @access  Private
router.get('/statistics', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    const challenges = await Challenge.find({ userId });
    const activeChallenge = challenges.find(c => c.status === 'active');
    const completedChallenges = challenges.filter(c => c.status === 'completed');

    const statistics = {
      totalChallenges: challenges.length,
      activeChallenges: challenges.filter(c => c.status === 'active').length,
      completedChallenges: completedChallenges.length,
      totalPoints: challenges.reduce((sum, c) => sum + c.totalPoints, 0),
      averageCompletionRate: challenges.length > 0 
        ? Math.round(challenges.reduce((sum, c) => sum + c.progressPercentage, 0) / challenges.length)
        : 0,
      longestStreak: Math.max(...challenges.map(c => c.streak), 0),
      currentStreak: activeChallenge ? activeChallenge.streak : 0,
      totalTasksCompleted: challenges.reduce((sum, c) => sum + c.completedDays, 0)
    };

    res.json({
      status: 'success',
      data: {
        statistics
      }
    });

  } catch (error) {
    logger.error('Get challenge statistics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching statistics'
    });
  }
});

module.exports = router;