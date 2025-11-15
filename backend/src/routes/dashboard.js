const express = require('express');
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/dashboard/overview
// @desc    Get dashboard overview data
// @access  Private
router.get('/overview', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's latest assessment
    const latestAssessment = await Assessment.findOne({
      userId,
      status: 'completed'
    }).sort({ completedAt: -1 });

    // Get assessment history (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const assessmentHistory = await Assessment.find({
      userId,
      status: 'completed',
      completedAt: { $gte: sixMonthsAgo }
    }).sort({ completedAt: -1 }).limit(10);

    // Calculate category scores from latest assessment
    let categoryScores = {};
    if (latestAssessment && latestAssessment.results.categoryScores) {
      latestAssessment.results.categoryScores.forEach(category => {
        categoryScores[category.category] = category.score;
      });
    }

    // Get user's privacy profile
    const user = await User.findById(userId);
    const privacyProfile = user.privacyProfile || {};

    // Get upcoming tasks from action plan
    const upcomingTasks = latestAssessment ? 
      latestAssessment.actionPlan
        .filter(item => !item.isCompleted)
        .sort((a, b) => {
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        })
        .slice(0, 5) : [];

    // Calculate privacy score trend
    const scoreTrend = assessmentHistory.map(assessment => ({
      date: assessment.completedAt,
      score: assessment.results.percentage,
      type: assessment.type
    }));

    // Get risk level distribution
    const riskLevels = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };

    assessmentHistory.forEach(assessment => {
      const riskLevel = assessment.results.overallRiskLevel;
      if (Object.prototype.hasOwnProperty.call(riskLevels, riskLevel)) {
        riskLevels[riskLevel]++;
      }
    });

    res.json({
      status: 'success',
      data: {
        privacyScore: latestAssessment ? latestAssessment.results.percentage : 0,
        userLevel: latestAssessment ? latestAssessment.results.userLevel : 'beginner',
        riskLevel: latestAssessment ? latestAssessment.results.overallRiskLevel : 'medium',
        lastAssessmentDate: latestAssessment ? latestAssessment.completedAt : null,
        categoryScores,
        assessmentHistory: scoreTrend,
        upcomingTasks,
        riskLevelDistribution: riskLevels,
        privacyProfile,
        totalAssessments: assessmentHistory.length,
        improvementAreas: latestAssessment ? latestAssessment.results.weaknesses : [],
        strengths: latestAssessment ? latestAssessment.results.strengths : []
      }
    });

  } catch (error) {
    logger.error('Dashboard overview error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching dashboard data'
    });
  }
});

// @route   GET /api/dashboard/assessments
// @desc    Get user's assessment history
// @access  Private
router.get('/assessments', authenticate, async (req, res) => {
  try {
    const { type, limit = 20, page = 1 } = req.query;
    const userId = req.user._id;

    // Build query
    const query = { userId, status: 'completed' };
    if (type) query.type = type;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get assessments
    const assessments = await Assessment.find(query)
      .sort({ completedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-answers -actionPlan'); // Exclude detailed data for list view

    const total = await Assessment.countDocuments(query);

    res.json({
      status: 'success',
      data: {
        assessments: assessments.map(assessment => ({
          id: assessment._id,
          type: assessment.type,
          score: assessment.results.percentage,
          level: assessment.results.userLevel,
          riskLevel: assessment.results.overallRiskLevel,
          completedAt: assessment.completedAt,
          duration: assessment.timeSpent,
          categoryScores: assessment.results.categoryScores
        })),
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Dashboard assessments error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching assessments'
    });
  }
});

// @route   GET /api/dashboard/action-plan
// @desc    Get user's action plan
// @access  Private
router.get('/action-plan', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get latest assessment with action plan
    const latestAssessment = await Assessment.findOne({
      userId,
      status: 'completed'
    }).sort({ completedAt: -1 });

    if (!latestAssessment) {
      return res.json({
        status: 'success',
        data: {
          actionPlan: [],
          message: 'No completed assessments found. Complete an assessment to get your personalized action plan.'
        }
      });
    }

    // Group action items by priority
    const actionPlanByPriority = {
      critical: latestAssessment.actionPlan.filter(item => item.priority === 'critical'),
      high: latestAssessment.actionPlan.filter(item => item.priority === 'high'),
      medium: latestAssessment.actionPlan.filter(item => item.priority === 'medium'),
      low: latestAssessment.actionPlan.filter(item => item.priority === 'low')
    };

    // Calculate completion statistics
    const totalItems = latestAssessment.actionPlan.length;
    const completedItems = latestAssessment.actionPlan.filter(item => item.isCompleted).length;
    const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    res.json({
      status: 'success',
      data: {
        actionPlan: latestAssessment.actionPlan,
        actionPlanByPriority,
        statistics: {
          total: totalItems,
          completed: completedItems,
          remaining: totalItems - completedItems,
          completionRate
        },
        lastUpdated: latestAssessment.completedAt
      }
    });

  } catch (error) {
    logger.error('Dashboard action plan error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching action plan'
    });
  }
});

// @route   PATCH /api/dashboard/action-plan/:itemId
// @desc    Update action plan item status
// @access  Private
router.patch('/action-plan/:itemId', authenticate, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { isCompleted } = req.body;
    const userId = req.user._id;

    // Find the assessment containing this action item
    const assessment = await Assessment.findOne({
      userId,
      'actionPlan._id': itemId
    });

    if (!assessment) {
      return res.status(404).json({
        status: 'error',
        message: 'Action plan item not found'
      });
    }

    // Update the action item
    const actionItem = assessment.actionPlan.id(itemId);
    if (!actionItem) {
      return res.status(404).json({
        status: 'error',
        message: 'Action plan item not found'
      });
    }

    actionItem.isCompleted = isCompleted;
    if (isCompleted) {
      actionItem.completedAt = new Date();
    } else {
      actionItem.completedAt = undefined;
    }

    await assessment.save();

    res.json({
      status: 'success',
      message: 'Action plan item updated successfully',
      data: {
        actionItem: {
          id: actionItem._id,
          title: actionItem.title,
          isCompleted: actionItem.isCompleted,
          completedAt: actionItem.completedAt
        }
      }
    });

  } catch (error) {
    logger.error('Update action plan item error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating action plan item'
    });
  }
});

// @route   GET /api/dashboard/analytics
// @desc    Get privacy analytics and insights
// @access  Private
router.get('/analytics', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = '6months' } = req.query;

    // Calculate date range
    let startDate = new Date();
    switch (period) {
      case '1month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 6);
    }

    // Get assessments in the specified period
    const assessments = await Assessment.find({
      userId,
      status: 'completed',
      completedAt: { $gte: startDate }
    }).sort({ completedAt: 1 });

    // Calculate score trends
    const scoreTrend = assessments.map(assessment => ({
      date: assessment.completedAt,
      score: assessment.results.percentage,
      type: assessment.type
    }));

    // Calculate category improvement over time
    const categoryTrends = {};
    assessments.forEach(assessment => {
      assessment.results.categoryScores.forEach(category => {
        if (!categoryTrends[category.category]) {
          categoryTrends[category.category] = [];
        }
        categoryTrends[category.category].push({
          date: assessment.completedAt,
          score: category.score
        });
      });
    });

    // Calculate average scores by category
    const categoryAverages = {};
    Object.keys(categoryTrends).forEach(category => {
      const scores = categoryTrends[category].map(item => item.score);
      categoryAverages[category] = {
        average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        trend: scores.length > 1 ? scores[scores.length - 1] - scores[0] : 0,
        dataPoints: scores.length
      };
    });

    // Calculate risk level distribution
    const riskDistribution = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };

    assessments.forEach(assessment => {
      const riskLevel = assessment.results.overallRiskLevel;
      if (Object.prototype.hasOwnProperty.call(riskDistribution, riskLevel)) {
        riskDistribution[riskLevel]++;
      }
    });

    // Calculate improvement rate
    let improvementRate = 0;
    if (assessments.length >= 2) {
      const firstScore = assessments[0].results.percentage;
      const lastScore = assessments[assessments.length - 1].results.percentage;
      improvementRate = lastScore - firstScore;
    }

    res.json({
      status: 'success',
      data: {
        period,
        scoreTrend,
        categoryTrends,
        categoryAverages,
        riskDistribution,
        improvementRate,
        totalAssessments: assessments.length,
        averageScore: assessments.length > 0 ? 
          Math.round(assessments.reduce((sum, a) => sum + a.results.percentage, 0) / assessments.length) : 0,
        bestScore: assessments.length > 0 ? 
          Math.max(...assessments.map(a => a.results.percentage)) : 0,
        latestScore: assessments.length > 0 ? 
          assessments[assessments.length - 1].results.percentage : 0
      }
    });

  } catch (error) {
    logger.error('Dashboard analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching analytics'
    });
  }
});

// @route   GET /api/dashboard/recommendations
// @desc    Get personalized recommendations
// @access  Private
router.get('/recommendations', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get latest assessment
    const latestAssessment = await Assessment.findOne({
      userId,
      status: 'completed'
    }).sort({ completedAt: -1 });

    if (!latestAssessment) {
      return res.json({
        status: 'success',
        data: {
          recommendations: [],
          message: 'Complete an assessment to get personalized recommendations'
        }
      });
    }

    // Generate recommendations based on assessment results
    const recommendations = [];

    // Based on overall score
    if (latestAssessment.results.percentage < 60) {
      recommendations.push({
        type: 'urgent',
        title: 'Improve Your Privacy Score',
        description: 'Your privacy score is below 60%. Focus on implementing basic privacy practices.',
        priority: 'high',
        category: 'general',
        actionUrl: '/assessment',
        estimatedTime: '2 hours'
      });
    }

    // Based on category scores
    latestAssessment.results.categoryScores.forEach(category => {
      if (category.score < 50) {
        recommendations.push({
          type: 'category-improvement',
          title: `Strengthen ${category.category}`,
          description: `Your ${category.category} score is ${category.score}%. Review our guides to improve this area.`,
          priority: category.score < 30 ? 'critical' : 'high',
          category: category.category,
          actionUrl: `/resources/guides/${category.category.toLowerCase().replace(/\s+/g, '-')}`,
          estimatedTime: '1 hour'
        });
      }
    });

    // Based on weaknesses
    latestAssessment.results.weaknesses.forEach(weakness => {
      recommendations.push({
        type: 'weakness-addressing',
        title: `Address ${weakness.category} Weakness`,
        description: weakness.description,
        priority: weakness.priority,
        category: weakness.category,
        actionUrl: `/dashboard/action-plan`,
        estimatedTime: '30 minutes'
      });
    });

    // Sort by priority
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    recommendations.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

    res.json({
      status: 'success',
      data: {
        recommendations: recommendations.slice(0, 10), // Limit to top 10
        totalRecommendations: recommendations.length,
        lastUpdated: latestAssessment.completedAt
      }
    });

  } catch (error) {
    logger.error('Dashboard recommendations error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching recommendations'
    });
  }
});

module.exports = router;