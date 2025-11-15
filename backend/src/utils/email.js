const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create transporter
const createTransporter = () => {
  // Check if SMTP is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.warn('SMTP configuration missing. Email notifications will not be sent.');
    return null;
  }

  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== 'false'
    }
  });
};

// Email templates
const templates = {
  emailVerification: (data) => ({
    subject: 'Verify Your Email - Social Caution',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0a1929; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; background: #ff6b35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Social Caution</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <p>Thank you for registering with Social Caution. To complete your registration and start protecting your privacy, please verify your email address.</p>
            <p>Click the button below to verify your email:</p>
            <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p><a href="${data.verificationUrl}">${data.verificationUrl}</a></p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with Social Caution, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 Social Caution. All rights reserved.</p>
            <p>This email was sent to ${data.email || 'your email address'}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to Social Caution!
      
      Hello ${data.name}!
      
      Thank you for registering with Social Caution. To complete your registration and start protecting your privacy, please verify your email address.
      
      Click this link to verify your email: ${data.verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't create an account with Social Caution, please ignore this email.
      
      © 2024 Social Caution. All rights reserved.
    `
  }),

  passwordReset: (data) => ({
    subject: 'Password Reset - Social Caution',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0a1929; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; background: #ff6b35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <p>We received a request to reset your password for your Social Caution account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${data.resetUrl}" class="button">Reset Password</a>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p><a href="${data.resetUrl}">${data.resetUrl}</a></p>
            <div class="warning">
              <strong>Security Notice:</strong> This link will expire in 10 minutes for your security. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
            </div>
          </div>
          <div class="footer">
            <p>© 2024 Social Caution. All rights reserved.</p>
            <p>This email was sent to ${data.email || 'your email address'}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Reset Request - Social Caution
      
      Hello ${data.name}!
      
      We received a request to reset your password for your Social Caution account.
      
      Click this link to reset your password: ${data.resetUrl}
      
      This link will expire in 10 minutes for your security.
      
      If you didn't request this password reset, please ignore this email and your password will remain unchanged.
      
      © 2024 Social Caution. All rights reserved.
    `
  }),

  privacyAlert: (data) => ({
    subject: 'Privacy Alert - Social Caution',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Privacy Alert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .alert { background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; background: #ff6b35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 Privacy Alert</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <div class="alert">
              <h3>${data.alertTitle}</h3>
              <p>${data.alertDescription}</p>
            </div>
            <p>We recommend taking immediate action to protect your privacy:</p>
            <ul>
              ${(data.recommendations || []).map(rec => `<li>${rec}</li>`).join('')}
            </ul>
            <a href="${data.actionUrl || process.env.FRONTEND_URL + '/dashboard'}" class="button">Take Action Now</a>
            <p>For more information, visit your <a href="${process.env.FRONTEND_URL || ''}/dashboard">privacy dashboard</a>.</p>
          </div>
          <div class="footer">
            <p>© 2024 Social Caution. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Privacy Alert - Social Caution
      
      Hello ${data.name}!
      
      ${data.alertTitle}
      ${data.alertDescription}
      
      We recommend taking immediate action to protect your privacy:
      ${(data.recommendations || []).map(rec => `- ${rec}`).join('\n')}
      
      Take action now: ${data.actionUrl || process.env.FRONTEND_URL + '/dashboard'}
      
      For more information, visit your privacy dashboard: ${process.env.FRONTEND_URL || ''}/dashboard
      
      © 2024 Social Caution. All rights reserved.
    `
  }),

  assessmentReminder: (data) => ({
    subject: 'Privacy Assessment Reminder - Social Caution',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Assessment Reminder</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0a1929; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; background: #ff6b35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Assessment Reminder</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <p>It's been ${data.daysSinceLastAssessment || 30} days since your last privacy assessment.</p>
            <p>Regular assessments help you track your privacy progress and identify areas for improvement.</p>
            <a href="${data.actionUrl || process.env.FRONTEND_URL + '/assessment'}" class="button">Take Assessment Now</a>
            <p>Keep your privacy score up to date and stay protected!</p>
          </div>
          <div class="footer">
            <p>© 2024 Social Caution. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Privacy Assessment Reminder - Social Caution
      
      Hello ${data.name}!
      
      It's been ${data.daysSinceLastAssessment || 30} days since your last privacy assessment.
      
      Regular assessments help you track your privacy progress and identify areas for improvement.
      
      Take your assessment now: ${data.actionUrl || process.env.FRONTEND_URL + '/assessment'}
      
      Keep your privacy score up to date and stay protected!
      
      © 2024 Social Caution. All rights reserved.
    `
  }),

  dataBreachAlert: (data) => ({
    subject: '🚨 Data Breach Alert - Social Caution',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Data Breach Alert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .alert { background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 Data Breach Alert</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <div class="alert">
              <h3>Important Security Notice</h3>
              <p>A service you use (${data.serviceName || 'Unknown Service'}) has experienced a data breach.</p>
              <p><strong>Breach Date:</strong> ${data.breachDate || 'Unknown'}</p>
            </div>
            <p>We recommend taking immediate action:</p>
            <ul>
              <li>Change your password for the affected service</li>
              <li>Enable two-factor authentication if available</li>
              <li>Monitor your accounts for suspicious activity</li>
              <li>Check if your email was exposed in the breach</li>
            </ul>
            <a href="${data.actionUrl || process.env.FRONTEND_URL + '/tools/data-breach-check'}" class="button">Check Your Exposure</a>
          </div>
          <div class="footer">
            <p>© 2024 Social Caution. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Data Breach Alert - Social Caution
      
      Hello ${data.name}!
      
      IMPORTANT SECURITY NOTICE
      
      A service you use (${data.serviceName || 'Unknown Service'}) has experienced a data breach.
      Breach Date: ${data.breachDate || 'Unknown'}
      
      We recommend taking immediate action:
      - Change your password for the affected service
      - Enable two-factor authentication if available
      - Monitor your accounts for suspicious activity
      - Check if your email was exposed in the breach
      
      Check your exposure: ${data.actionUrl || process.env.FRONTEND_URL + '/tools/data-breach-check'}
      
      © 2024 Social Caution. All rights reserved.
    `
  }),

  privacyScoreUpdate: (data) => ({
    subject: 'Privacy Score Update - Social Caution',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Privacy Score Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .score { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; }
          .button { display: inline-block; background: #ff6b35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Privacy Score Update</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <div class="score">
              <h3>Your Privacy Score</h3>
              <p style="font-size: 48px; font-weight: bold; margin: 10px 0;">${data.newScore || 0}</p>
              ${data.scoreImprovement ? `<p style="color: #28a745; font-size: 18px;">+${data.scoreImprovement} points improvement!</p>` : ''}
            </div>
            <p>Great job on improving your privacy! Keep up the excellent work.</p>
            <a href="${data.actionUrl || process.env.FRONTEND_URL + '/dashboard'}" class="button">View Dashboard</a>
          </div>
          <div class="footer">
            <p>© 2024 Social Caution. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Privacy Score Update - Social Caution
      
      Hello ${data.name}!
      
      Your Privacy Score: ${data.newScore || 0}
      ${data.scoreImprovement ? `+${data.scoreImprovement} points improvement!` : ''}
      
      Great job on improving your privacy! Keep up the excellent work.
      
      View your dashboard: ${data.actionUrl || process.env.FRONTEND_URL + '/dashboard'}
      
      © 2024 Social Caution. All rights reserved.
    `
  }),

  actionPlanUpdate: (data) => ({
    subject: 'Action Plan Update - Social Caution',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Action Plan Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0a1929; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; background: #ff6b35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Action Plan Update</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name}!</h2>
            <div class="success">
              <h3>Great job!</h3>
              <p>You've completed "${data.actionItemTitle || 'an action item'}" from your privacy action plan.</p>
            </div>
            <p>Keep up the momentum and continue improving your privacy!</p>
            <a href="${data.actionUrl || process.env.FRONTEND_URL + '/dashboard/action-plan'}" class="button">View Action Plan</a>
          </div>
          <div class="footer">
            <p>© 2024 Social Caution. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Action Plan Update - Social Caution
      
      Hello ${data.name}!
      
      Great job! You've completed "${data.actionItemTitle || 'an action item'}" from your privacy action plan.
      
      Keep up the momentum and continue improving your privacy!
      
      View your action plan: ${data.actionUrl || process.env.FRONTEND_URL + '/dashboard/action-plan'}
      
      © 2024 Social Caution. All rights reserved.
    `
  })
};

// Send email function
const sendEmail = async ({ to, subject, template, data }) => {
  try {
    const transporter = createTransporter();
    
    // If SMTP is not configured, log and return mock result
    if (!transporter) {
      logger.warn(`Email not sent to ${to} - SMTP not configured. Template: ${template}`);
      return {
        messageId: `mock-${Date.now()}`,
        accepted: [to],
        rejected: [],
        pending: [],
        response: 'SMTP not configured - email not sent'
      };
    }
    
    // Get template
    const emailTemplate = templates[template];
    if (!emailTemplate) {
      throw new Error(`Email template '${template}' not found`);
    }

    const templateData = emailTemplate(data);

    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Social Caution'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject: subject || templateData.subject,
      html: templateData.html,
      text: templateData.text
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${to}:`, result.messageId);
    return result;

  } catch (error) {
    logger.error('Email sending failed:', error);
    throw error;
  }
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    logger.info('Email configuration verified successfully');
    return true;
  } catch (error) {
    logger.error('Email configuration verification failed:', error);
    return false;
  }
};

module.exports = {
  sendEmail,
  verifyEmailConfig
};