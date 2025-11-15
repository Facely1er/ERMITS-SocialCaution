const { sendEmail } = require('../utils/email');
const logger = require('../utils/logger');

/**
 * Notification Service
 * Handles sending email notifications based on notification types
 */
class NotificationService {
  /**
   * Send email notification based on notification type
   * @param {Object} notification - Notification object
   * @param {Object} user - User object with email and name
   * @param {Object} preferences - User notification preferences
   * @returns {Promise<Object>} Result of email sending
   */
  static async sendEmailNotification(notification, user, preferences = {}) {
    try {
      // Check if email notifications are enabled for this user
      if (preferences.email === false) {
        logger.info(`Email notifications disabled for user ${user._id}`);
        return { sent: false, reason: 'Email notifications disabled' };
      }

      // Check if email notifications are enabled for this notification type
      const notificationTypeEnabled = this.isNotificationTypeEnabled(notification.type, preferences);
      if (!notificationTypeEnabled) {
        logger.info(`Email notifications disabled for type ${notification.type} for user ${user._id}`);
        return { sent: false, reason: 'Notification type disabled' };
      }

      // Check if user has email
      if (!user.email) {
        logger.warn(`No email address for user ${user._id}`);
        return { sent: false, reason: 'No email address' };
      }

      // Map notification type to email template
      const templateMapping = {
        'privacy_alert': 'privacyAlert',
        'assessment_reminder': 'assessmentReminder',
        'data_breach_alert': 'dataBreachAlert',
        'privacy_score_improvement': 'privacyScoreUpdate',
        'action_plan_update': 'actionPlanUpdate'
      };

      const template = templateMapping[notification.type];
      if (!template) {
        logger.warn(`No email template for notification type ${notification.type}`);
        return { sent: false, reason: 'No template available' };
      }

      // Prepare email data
      const emailData = this.prepareEmailData(notification, user, template);

      // Send email
      const result = await sendEmail({
        to: user.email,
        template: template,
        data: emailData
      });

      logger.info(`Email notification sent to ${user.email} for notification ${notification.id}`);
      return { sent: true, messageId: result.messageId };

    } catch (error) {
      logger.error('Failed to send email notification:', error);
      // Don't throw - email failures shouldn't break the notification system
      return { sent: false, error: error.message };
    }
  }

  /**
   * Check if notification type is enabled in user preferences
   * @param {string} notificationType - Type of notification
   * @param {Object} preferences - User notification preferences
   * @returns {boolean}
   */
  static isNotificationTypeEnabled(notificationType, preferences) {
    // Default to enabled if preferences not set
    if (!preferences || Object.keys(preferences).length === 0) {
      return true;
    }

    // Check specific type preferences
    switch (notificationType) {
      case 'privacy_alert':
        return preferences.privacyAlerts !== false;
      case 'assessment_reminder':
        return preferences.assessmentReminders !== false;
      case 'data_breach_alert':
        return preferences.privacyAlerts !== false; // Data breaches are privacy alerts
      case 'privacy_score_improvement':
        return preferences.privacyAlerts !== false;
      case 'action_plan_update':
        return true; // Always enabled for action plan updates
      default:
        return true; // Default to enabled
    }
  }

  /**
   * Prepare email data from notification
   * @param {Object} notification - Notification object
   * @param {Object} user - User object
   * @param {string} template - Email template name
   * @returns {Object} Email data object
   */
  static prepareEmailData(notification, user, template) {
    const baseData = {
      name: user.name || user.email?.split('@')[0] || 'User',
      email: user.email
    };

    switch (template) {
      case 'privacyAlert':
        return {
          ...baseData,
          alertTitle: notification.title,
          alertDescription: notification.message,
          recommendations: notification.data?.recommendations || [
            'Review your privacy settings',
            'Check your digital footprint',
            'Update your passwords'
          ],
          actionUrl: notification.data?.actionUrl || `${process.env.FRONTEND_URL || ''}/dashboard`
        };

      case 'assessmentReminder':
        return {
          ...baseData,
          daysSinceLastAssessment: notification.data?.daysSinceLastAssessment || 30,
          actionUrl: notification.data?.actionUrl || `${process.env.FRONTEND_URL || ''}/assessment`
        };

      case 'dataBreachAlert':
        return {
          ...baseData,
          serviceName: notification.data?.serviceName || 'Unknown Service',
          breachDate: notification.data?.breachDate || 'Unknown',
          actionUrl: notification.data?.actionUrl || `${process.env.FRONTEND_URL || ''}/tools/data-breach-check`
        };

      case 'privacyScoreUpdate':
        return {
          ...baseData,
          newScore: notification.data?.newScore || 0,
          scoreImprovement: notification.data?.scoreImprovement || null,
          actionUrl: notification.data?.actionUrl || `${process.env.FRONTEND_URL || ''}/dashboard`
        };

      case 'actionPlanUpdate':
        return {
          ...baseData,
          actionItemTitle: notification.data?.actionItemTitle || notification.message,
          actionUrl: notification.data?.actionUrl || `${process.env.FRONTEND_URL || ''}/dashboard/action-plan`
        };

      default:
        return baseData;
    }
  }

  /**
   * Send bulk email notifications
   * @param {Array} notifications - Array of notification objects
   * @param {Object} user - User object
   * @param {Object} preferences - User notification preferences
   * @returns {Promise<Array>} Array of results
   */
  static async sendBulkEmailNotifications(notifications, user, preferences = {}) {
    const results = [];
    
    for (const notification of notifications) {
      const result = await this.sendEmailNotification(notification, user, preferences);
      results.push({
        notificationId: notification.id,
        ...result
      });
    }

    return results;
  }
}

module.exports = NotificationService;

