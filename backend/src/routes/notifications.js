const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { type, isRead, limit = 20, page = 1 } = req.query;
    const userId = req.user._id;

    // Mock data - in a real app, this would come from a database
    const notifications = [
      {
        id: '1',
        userId: userId.toString(),
        type: 'privacy_alert',
        title: 'New Privacy Risk Detected',
        message: 'Your digital footprint analysis found 3 new data exposures that may put your privacy at risk.',
        isRead: false,
        priority: 'high',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        data: {
          riskLevel: 'high',
          exposures: 3,
          actionUrl: '/dashboard/privacy-alerts'
        }
      },
      {
        id: '2',
        userId: userId.toString(),
        type: 'assessment_reminder',
        title: 'Assessment Reminder',
        message: 'It\'s been 30 days since your last privacy assessment. Consider taking a new one to track your progress.',
        isRead: true,
        priority: 'medium',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        data: {
          daysSinceLastAssessment: 30,
          actionUrl: '/assessment'
        }
      },
      {
        id: '3',
        userId: userId.toString(),
        type: 'action_plan_update',
        title: 'Action Plan Item Completed',
        message: 'Great job! You\'ve completed "Enable Two-Factor Authentication" from your action plan.',
        isRead: true,
        priority: 'low',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        data: {
          actionItemId: '2fa-setup',
          actionUrl: '/dashboard/action-plan'
        }
      },
      {
        id: '4',
        userId: userId.toString(),
        type: 'data_breach_alert',
        title: 'Data Breach Alert',
        message: 'A service you use has experienced a data breach. Check if your account was affected.',
        isRead: false,
        priority: 'critical',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        data: {
          serviceName: 'Example Service',
          breachDate: '2024-03-10',
          actionUrl: '/tools/data-breach-check'
        }
      },
      {
        id: '5',
        userId: userId.toString(),
        type: 'privacy_score_improvement',
        title: 'Privacy Score Improved',
        message: 'Congratulations! Your privacy score has improved by 15 points since your last assessment.',
        isRead: true,
        priority: 'low',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        data: {
          scoreImprovement: 15,
          newScore: 78,
          actionUrl: '/dashboard'
        }
      }
    ];

    // Filter notifications
    let filteredNotifications = notifications;

    if (type) {
      filteredNotifications = filteredNotifications.filter(notification => 
        notification.type === type
      );
    }

    if (isRead !== undefined) {
      const readStatus = isRead === 'true';
      filteredNotifications = filteredNotifications.filter(notification => 
        notification.isRead === readStatus
      );
    }

    // Sort by creation date (newest first)
    filteredNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

    // Calculate unread count
    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.json({
      status: 'success',
      data: {
        notifications: paginatedNotifications,
        unreadCount,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(filteredNotifications.length / parseInt(limit)),
          total: filteredNotifications.length,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get notifications error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching notifications'
    });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    const { id } = req.params; // eslint-disable-line no-unused-vars
    const userId = req.user._id; // eslint-disable-line no-unused-vars

    // In a real implementation, you would update the notification in the database
    // For now, just return success

    res.json({
      status: 'success',
      message: 'Notification marked as read'
    });

  } catch (error) {
    logger.error('Mark notification read error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating notification'
    });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', authenticate, async (req, res) => {
  try {
    const userId = req.user._id; // eslint-disable-line no-unused-vars

    // In a real implementation, you would update all notifications for the user
    // For now, just return success

    res.json({
      status: 'success',
      message: 'All notifications marked as read'
    });

  } catch (error) {
    logger.error('Mark all notifications read error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating notifications'
    });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params; // eslint-disable-line no-unused-vars
    const userId = req.user._id; // eslint-disable-line no-unused-vars

    // In a real implementation, you would delete the notification from the database
    // For now, just return success

    res.json({
      status: 'success',
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    logger.error('Delete notification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting notification'
    });
  }
});

// @route   POST /api/notifications/preferences
// @desc    Update notification preferences
// @access  Private
router.post('/preferences',
  authenticate,
  [
    body('email')
      .optional()
      .isBoolean()
      .withMessage('Email preference must be a boolean'),
    body('push')
      .optional()
      .isBoolean()
      .withMessage('Push preference must be a boolean'),
    body('privacyAlerts')
      .optional()
      .isBoolean()
      .withMessage('Privacy alerts preference must be a boolean'),
    body('assessmentReminders')
      .optional()
      .isBoolean()
      .withMessage('Assessment reminders preference must be a boolean')
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

      const { email, push, privacyAlerts, assessmentReminders } = req.body; // eslint-disable-line no-unused-vars
      const userId = req.user._id; // eslint-disable-line no-unused-vars

      // In a real implementation, you would update the user's notification preferences
      // For now, just return success

      res.json({
        status: 'success',
        message: 'Notification preferences updated successfully'
      });

    } catch (error) {
      logger.error('Update notification preferences error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server error while updating notification preferences'
      });
    }
  }
);

module.exports = router;