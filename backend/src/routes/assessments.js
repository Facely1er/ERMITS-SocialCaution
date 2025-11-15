const express = require('express');
const { body, validationResult } = require('express-validator');
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const { questions } = require('../data/assessmentData');
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/assessments/questions
// @desc    Get assessment questions
// @access  Public
router.get('/questions', (req, res) => {
  try {
    const { type } = req.query;
    
    let filteredQuestions = questions;
    
    // Filter questions by type if specified
    if (type && ['exposure', 'privacy-rights', 'security'].includes(type)) {
      // This would filter questions based on type in a real implementation
      // For now, return all questions
    }

    res.json({
      status: 'success',
      data: {
        questions: filteredQuestions,
        totalQuestions: filteredQuestions.length
      }
    });
  } catch (error) {
    logger.error('Get questions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching questions'
    });
  }
});

// @route   POST /api/assessments/start
// @desc    Start a new assessment
// @access  Private
router.post('/start', 
  authenticate,
  [
    body('type')
      .isIn(['exposure', 'privacy-rights', 'security', 'complete'])
      .withMessage('Invalid assessment type')
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

      const { type } = req.body;
      const userId = req.user._id;

      // Check if user has an incomplete assessment of the same type
      const existingAssessment = await Assessment.findOne({
        userId,
        type,
        status: 'in-progress'
      });

      if (existingAssessment) {
        return res.json({
          status: 'success',
          message: 'Resuming existing assessment',
          data: {
            assessment: existingAssessment
          }
        });
      }

      // Create new assessment
      const assessment = new Assessment({
        userId,
        type,
        status: 'in-progress',
        deviceInfo: {
          userAgent: req.get('User-Agent'),
          platform: req.get('User-Agent')?.includes('Mobile') ? 'mobile' : 'desktop'
        },
        ipAddress: req.ip
      });

      await assessment.save();

      res.status(201).json({
        status: 'success',
        message: 'Assessment started successfully',
        data: {
          assessment
        }
      });

    } catch (error) {
      logger.error('Start assessment error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server error while starting assessment'
      });
    }
  }
);

// @route   POST /api/assessments/:id/answer
// @desc    Submit an answer to an assessment
// @access  Private
router.post('/:id/answer',
  authenticate,
  [
    body('questionId').notEmpty().withMessage('Question ID is required'),
    body('value').notEmpty().withMessage('Answer value is required'),
    body('score').isInt({ min: 0, max: 3 }).withMessage('Score must be between 0 and 3'),
    body('level').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid level')
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

      const { id } = req.params;
      const { questionId, value, score, level } = req.body;

      // Find assessment
      const assessment = await Assessment.findOne({
        _id: id,
        userId: req.user._id,
        status: 'in-progress'
      });

      if (!assessment) {
        return res.status(404).json({
          status: 'error',
          message: 'Assessment not found or not in progress'
        });
      }

      // Check if question already answered
      const existingAnswerIndex = assessment.answers.findIndex(
        answer => answer.questionId === questionId
      );

      const answerData = {
        questionId,
        value,
        score,
        level,
        answeredAt: new Date()
      };

      if (existingAnswerIndex >= 0) {
        // Update existing answer
        assessment.answers[existingAnswerIndex] = answerData;
      } else {
        // Add new answer
        assessment.answers.push(answerData);
      }

      await assessment.save();

      res.json({
        status: 'success',
        message: 'Answer submitted successfully',
        data: {
          assessment: {
            id: assessment._id,
            answers: assessment.answers,
            progress: {
              answered: assessment.answers.length,
              total: questions.length
            }
          }
        }
      });

    } catch (error) {
      logger.error('Submit answer error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server error while submitting answer'
      });
    }
  }
);

// @route   POST /api/assessments/:id/complete
// @desc    Complete an assessment and calculate results
// @access  Private
router.post('/:id/complete', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Find assessment
    const assessment = await Assessment.findOne({
      _id: id,
      userId: req.user._id,
      status: 'in-progress'
    });

    if (!assessment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assessment not found or not in progress'
      });
    }

    // Calculate results
    const results = calculateAssessmentResults(assessment.answers);
    
    // Update assessment with results
    assessment.status = 'completed';
    assessment.completedAt = new Date();
    assessment.results = results;
    assessment.actionPlan = generateActionPlan(results);
    assessment.timeSpent = Math.round((assessment.completedAt - assessment.startedAt) / 1000 / 60);

    await assessment.save();

    // Update user's privacy profile
    await updateUserPrivacyProfile(req.user._id, results);

    res.json({
      status: 'success',
      message: 'Assessment completed successfully',
      data: {
        assessment: assessment.getSummary(),
        results: assessment.results,
        actionPlan: assessment.actionPlan
      }
    });

  } catch (error) {
    logger.error('Complete assessment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while completing assessment'
    });
  }
});

// @route   GET /api/assessments
// @desc    Get user's assessments
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { type, status, limit = 10, page = 1 } = req.query;
    const userId = req.user._id;

    // Build query
    const query = { userId };
    if (type) query.type = type;
    if (status) query.status = status;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get assessments
    const assessments = await Assessment.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-answers'); // Exclude detailed answers for list view

    const total = await Assessment.countDocuments(query);

    res.json({
      status: 'success',
      data: {
        assessments: assessments.map(assessment => assessment.getSummary()),
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get assessments error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching assessments'
    });
  }
});

// @route   GET /api/assessments/:id
// @desc    Get specific assessment details
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const assessment = await Assessment.findOne({
      _id: id,
      userId
    });

    if (!assessment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assessment not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        assessment
      }
    });

  } catch (error) {
    logger.error('Get assessment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching assessment'
    });
  }
});

// Helper function to calculate assessment results
const calculateAssessmentResults = (answers) => {
  const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
  const maxPossibleScore = answers.length * 3;
  const percentage = Math.round((totalScore / maxPossibleScore) * 100);

  // Calculate category scores
  const categoryTotals = {};
  const categoryCounts = {};
  const categoryMaxScores = {};

  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question) {
      const category = question.category;
      
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
        categoryCounts[category] = 0;
        categoryMaxScores[category] = 0;
      }
      
      categoryTotals[category] += answer.score;
      categoryCounts[category]++;
      categoryMaxScores[category] += 3;
    }
  });

  const categoryScores = Object.keys(categoryTotals).map(category => {
    const totalScore = categoryTotals[category];
    const maxScore = categoryMaxScores[category];
    const percentage = Math.round((totalScore / maxScore) * 100);
    
    return {
      category,
      score: percentage,
      maxPossibleScore: maxScore,
      questionCount: categoryCounts[category],
      averageScore: Math.round(totalScore / categoryCounts[category] * 10) / 10
    };
  });

  // Determine user level
  const levelCounts = answers.reduce((counts, answer) => {
    counts[answer.level] = (counts[answer.level] || 0) + 1;
    return counts;
  }, {});

  let userLevel = 'beginner';
  if (levelCounts.advanced > levelCounts.intermediate && levelCounts.advanced > levelCounts.beginner) {
    userLevel = 'advanced';
  } else if (levelCounts.intermediate > levelCounts.beginner) {
    userLevel = 'intermediate';
  }

  // Determine overall risk level
  let overallRiskLevel = 'low';
  if (percentage < 40) {
    overallRiskLevel = 'critical';
  } else if (percentage < 60) {
    overallRiskLevel = 'high';
  } else if (percentage < 80) {
    overallRiskLevel = 'medium';
  }

  // Identify strengths and weaknesses
  const strengths = categoryScores
    .filter(cat => cat.score >= 80)
    .map(cat => ({
      category: cat.category,
      score: cat.score,
      description: `Strong performance in ${cat.category}`
    }));

  const weaknesses = categoryScores
    .filter(cat => cat.score < 70)
    .map(cat => ({
      category: cat.category,
      score: cat.score,
      description: `Needs improvement in ${cat.category}`,
      priority: cat.score < 40 ? 'critical' : cat.score < 60 ? 'high' : 'medium'
    }));

  return {
    totalScore,
    maxPossibleScore,
    percentage,
    userLevel,
    categoryScores,
    overallRiskLevel,
    strengths,
    weaknesses
  };
};

// Helper function to generate action plan
const generateActionPlan = (results) => {
  const actionItems = [];

  results.categoryScores.forEach(category => {
    if (category.score < 70) {
      const priority = category.score < 40 ? 'critical' : 
                     category.score < 60 ? 'high' : 'medium';
      
      actionItems.push({
        title: `Improve ${category.category}`,
        description: `Your ${category.category} score is ${category.score}%. Focus on improving this area.`,
        priority,
        category: category.category,
        questionId: 'category-improvement',
        steps: [
          `Review ${category.category} best practices`,
          'Update your privacy settings',
          'Implement recommended security measures',
          'Monitor your progress regularly'
        ],
        resources: [
          {
            title: `${category.category} Privacy Guide`,
            url: `/resources/guides/${category.category.toLowerCase().replace(/\s+/g, '-')}`,
            type: 'guide'
          }
        ],
        estimatedTime: priority === 'critical' ? '2 hours' : '1 hour',
        dueDate: new Date(Date.now() + (priority === 'critical' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000))
      });
    }
  });

  return actionItems;
};

// Helper function to update user privacy profile
const updateUserPrivacyProfile = async (userId, results) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    user.privacyProfile.overallScore = results.percentage;
    user.privacyProfile.lastAssessmentDate = new Date();
    user.privacyProfile.riskLevel = results.overallRiskLevel;

    await user.save();
  } catch (error) {
    logger.error('Update user privacy profile error:', error);
  }
};

module.exports = router;