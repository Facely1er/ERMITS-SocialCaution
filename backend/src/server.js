const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');
const path = require('path');
require('dotenv').config();

const connectDB = require('./database/connection');
const errorHandler = require('./middleware/errorHandler');
const { syncMiddleware, offlineMiddleware } = require('./middleware/syncMiddleware');
const logger = require('./utils/logger');
const { validateCredentials } = require('./utils/validateCredentials');
const { validateEnvironment } = require('./utils/envValidator');
const { rateLimiters, initRedis } = require('./middleware/rateLimiter');
const { csrfProtection, csrfToken, addCsrfTokenToLocals } = require('./middleware/csrf');
const cookieParser = require('cookie-parser');
const { getHealthStatus, getDetailedHealth } = require('./utils/healthCheck');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const assessmentRoutes = require('./routes/assessments');
const dashboardRoutes = require('./routes/dashboard');
const toolsRoutes = require('./routes/tools');
const resourcesRoutes = require('./routes/resources');
const blogRoutes = require('./routes/blog');
const notificationRoutes = require('./routes/notifications');
const challengeRoutes = require('./routes/challenges');
const progressRoutes = require('./routes/progress');
const achievementRoutes = require('./routes/achievements');

const app = express();

// Validate environment variables and credentials before starting
if (process.env.NODE_ENV !== 'test') {
  try {
    validateEnvironment();
    validateCredentials();
  } catch (error) {
    logger.error('Environment validation failed:', error.message);
    process.exit(1);
  }
}

// Initialize Redis for persistent rate limiting
if (process.env.REDIS_HOST) {
  initRedis();
}

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      scriptSrcElem: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      styleSrcElem: ["'self'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://*.supabase.co", "https://*.supabase.in", "wss://*.supabase.co"],
      frameSrc: ["'self'", "https://*.supabase.co"],
      frameAncestors: ["'self'"],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["'self'", "blob:"],
      manifestSrc: ["'self'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      objectSrc: ["'none'"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting - Use persistent Redis-based rate limiter
app.use('/api/', rateLimiters.api);

// Apply stricter rate limiting to authentication endpoints
app.use('/api/auth/login', rateLimiters.auth);
app.use('/api/auth/register', rateLimiters.registration);
app.use('/api/auth/password-reset', rateLimiters.passwordReset);

// Cookie parser (required for CSRF protection)
app.use(cookieParser());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// CSRF token endpoint (must be before CSRF protection)
app.get('/api/csrf-token', csrfToken);

// Add CSRF token to response locals for templates
app.use(addCsrfTokenToLocals);

// CSRF protection (exclude API endpoints that use token-based auth)
app.use(csrfProtection({
  excludedPaths: [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh',
    '/api/health',
  ],
}));

// Data sanitization against XSS
app.use((req, res, next) => {
  if (req.body) {
    req.body = JSON.parse(xss(JSON.stringify(req.body)));
  }
  next();
});

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Sync middleware
app.use(syncMiddleware);
app.use(offlineMiddleware);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoints
app.get('/health', async (req, res) => {
  const health = await getHealthStatus();
  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

app.get('/health/detailed', async (req, res) => {
  const health = await getDetailedHealth();
  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/achievements', achievementRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;