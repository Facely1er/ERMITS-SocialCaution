const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
// const { authorize } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticate, async (req, res) => {
  try {
    res.json({
      status: 'success',
      data: {
        user: req.user.getPublicProfile()
      }
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile',
  authenticate,
  [
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    body('preferences.language')
      .optional()
      .isIn(['en'])
      .withMessage('Invalid language'),
    body('preferences.theme')
      .optional()
      .isIn(['light', 'dark', 'auto'])
      .withMessage('Invalid theme')
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

      const allowedUpdates = ['firstName', 'lastName', 'preferences'];
      const updates = {};

      Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key];
        }
      });

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      res.json({
        status: 'success',
        message: 'Profile updated successfully',
        data: {
          user: user.getPublicProfile()
        }
      });

    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server error while updating profile'
      });
    }
  }
);

// @route   PUT /api/users/password
// @desc    Change user password
// @access  Private
router.put('/password',
  authenticate,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
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

      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const user = await User.findById(req.user._id).select('+password');
      
      // Check current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          status: 'error',
          message: 'Current password is incorrect'
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        status: 'success',
        message: 'Password changed successfully'
      });

    } catch (error) {
      logger.error('Change password error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server error while changing password'
      });
    }
  }
);

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account',
  authenticate,
  [
    body('password')
      .notEmpty()
      .withMessage('Password is required to delete account')
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

      const { password } = req.body;

      // Get user with password
      const user = await User.findById(req.user._id).select('+password');
      
      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(400).json({
          status: 'error',
          message: 'Password is incorrect'
        });
      }

      // Soft delete - deactivate account
      user.isActive = false;
      await user.save();

      res.json({
        status: 'success',
        message: 'Account deleted successfully'
      });

    } catch (error) {
      logger.error('Delete account error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server error while deleting account'
      });
    }
  }
);

// @route   GET /api/users/notifications
// @desc    Get user notifications
// @access  Private
router.get('/notifications', authenticate, async (req, res) => {
  try {
    // This would typically fetch from a notifications collection
    // For now, return comprehensive mock data
    const notifications = [
      {
        id: '1',
        type: 'privacy_alert',
        title: 'New Privacy Risk Detected',
        message: 'Your digital footprint analysis found 3 new data exposures.',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        priority: 'high',
        actionRequired: true,
        category: 'security'
      },
      {
        id: '2',
        type: 'assessment_reminder',
        title: 'Assessment Reminder',
        message: 'It\'s been 30 days since your last privacy assessment.',
        isRead: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        priority: 'medium',
        actionRequired: false,
        category: 'maintenance'
      },
      {
        id: '3',
        type: 'data_breach_alert',
        title: 'Data Breach Alert',
        message: 'A service you use has reported a data breach. Check if your account is affected.',
        isRead: false,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        priority: 'high',
        actionRequired: true,
        category: 'security'
      },
      {
        id: '4',
        type: 'privacy_score_update',
        title: 'Privacy Score Improved',
        message: 'Your privacy score has increased by 15 points! Keep up the great work.',
        isRead: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        priority: 'low',
        actionRequired: false,
        category: 'achievement'
      },
      {
        id: '5',
        type: 'action_plan_reminder',
        title: 'Action Plan Update',
        message: 'You have 2 high-priority tasks due this week. Review your action plan.',
        isRead: false,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        priority: 'medium',
        actionRequired: true,
        category: 'tasks'
      }
    ];

    res.json({
      status: 'success',
      data: {
        notifications,
        unreadCount: notifications.filter(n => !n.isRead).length
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

// @route   PUT /api/users/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/notifications/:id/read', authenticate, async (req, res) => {
  try {
    const { id } = req.params; // eslint-disable-line no-unused-vars

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

module.exports = router;