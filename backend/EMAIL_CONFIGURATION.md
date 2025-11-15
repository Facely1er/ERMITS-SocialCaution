# Email Notification Configuration

This document describes how to configure email notifications for the Social Caution platform.

## Overview

The platform supports email notifications for various privacy-related events:
- Email verification
- Password reset
- Privacy alerts
- Assessment reminders
- Data breach alerts
- Privacy score updates
- Action plan updates

## SMTP Configuration

Email notifications are sent using Nodemailer with SMTP. The system gracefully handles missing SMTP configuration - if not configured, notifications will be logged but not sent.

### Required Environment Variables

Add these to your `.env` file in the backend directory:

```env
# SMTP Configuration (Required for email notifications)
SMTP_HOST=smtp.gmail.com          # Your SMTP server hostname
SMTP_PORT=587                     # SMTP port (587 for TLS, 465 for SSL)
SMTP_USER=your-email@gmail.com    # SMTP username/email
SMTP_PASS=your-app-password       # SMTP password or app password
SMTP_REJECT_UNAUTHORIZED=true     # Reject unauthorized certificates (default: true)

# Email Sender Configuration
FROM_EMAIL=your-email@gmail.com   # Email address to send from
FROM_NAME=Social Caution          # Display name for sender

# Frontend URL (for email links)
FRONTEND_URL=https://yourdomain.com
```

### Gmail Configuration

If using Gmail:

1. **Enable 2-Step Verification** on your Google account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password as `SMTP_PASS`

3. **Configuration**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   ```

### Other Email Providers

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

#### AWS SES
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-aws-access-key-id
SMTP_PASS=your-aws-secret-access-key
```

#### Outlook/Office 365
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

## Email Templates

The platform includes the following email templates:

1. **emailVerification** - Sent when users register
2. **passwordReset** - Sent when users request password reset
3. **privacyAlert** - Sent for privacy risk alerts
4. **assessmentReminder** - Sent to remind users to take assessments
5. **dataBreachAlert** - Sent when data breaches are detected
6. **privacyScoreUpdate** - Sent when privacy score improves
7. **actionPlanUpdate** - Sent when action plan items are completed

## Testing Email Configuration

### Verify SMTP Connection

You can verify your SMTP configuration by checking the server logs. The system will log warnings if SMTP is not configured.

### Test Email Sending

The email service includes a `verifyEmailConfig` function that can be used to test the SMTP connection:

```javascript
const { verifyEmailConfig } = require('./src/utils/email');

verifyEmailConfig()
  .then(result => {
    if (result) {
      console.log('Email configuration verified successfully');
    } else {
      console.log('Email configuration verification failed');
    }
  });
```

## Notification Service

The `NotificationService` handles sending email notifications based on user preferences:

- Checks if email notifications are enabled for the user
- Checks if the notification type is enabled in user preferences
- Maps notification types to email templates
- Prepares email data from notification objects
- Sends emails asynchronously

### User Notification Preferences

Users can control email notifications through their notification preferences:
- `email`: Enable/disable all email notifications
- `privacyAlerts`: Enable/disable privacy alert emails
- `assessmentReminders`: Enable/disable assessment reminder emails

## Production Considerations

1. **Rate Limiting**: Consider implementing rate limiting for email sending to prevent abuse
2. **Queue System**: For high-volume applications, consider using a queue system (e.g., Bull, RabbitMQ)
3. **Email Service Provider**: Use a dedicated email service provider (SendGrid, Mailgun, AWS SES) for production
4. **Monitoring**: Monitor email delivery rates and bounce rates
5. **Unsubscribe**: Implement unsubscribe functionality for marketing emails (not required for transactional emails)

## Troubleshooting

### Emails Not Sending

1. Check that all required environment variables are set
2. Verify SMTP credentials are correct
3. Check firewall/network settings
4. Review server logs for error messages
5. Test SMTP connection using `verifyEmailConfig()`

### Common Issues

- **Gmail "Less secure app" error**: Use App Passwords instead of regular passwords
- **Connection timeout**: Check firewall settings and SMTP port
- **Authentication failed**: Verify username and password are correct
- **TLS errors**: Set `SMTP_REJECT_UNAUTHORIZED=false` for testing (not recommended for production)

## Security Notes

- Never commit `.env` files to version control
- Use App Passwords for Gmail instead of account passwords
- Use environment-specific credentials for different environments
- Rotate SMTP credentials regularly
- Monitor for suspicious email sending activity

