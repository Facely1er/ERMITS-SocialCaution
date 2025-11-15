# Production Deployment Guide

This guide covers deploying Social Caution to production environments.

## Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- Production database (Supabase recommended)
- Domain name and SSL certificate
- Environment variables configured

## Environment Setup

### 1. Environment Variables

Create a `.env.production` file with the following variables:

```bash
# Application
NODE_ENV=production
VITE_API_URL=https://api.yourdomain.com/api
VITE_APP_NAME=Social Caution
VITE_APP_VERSION=1.0.0

# Database (Supabase)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Security
JWT_SECRET=your-super-secure-jwt-secret
JWT_REFRESH_SECRET=your-super-secure-refresh-secret
BCRYPT_ROUNDS=12

# Email Service
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Social Caution

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=your-ga-id
VITE_SENTRY_DSN=your-sentry-dsn

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
VITE_ENABLE_DEBUG_MODE=false
```

### 2. Database Setup

#### Supabase Setup
1. Create a new Supabase project
2. Run the migration script: `supabase/supabase-schema.sql`
3. Configure Row Level Security policies
4. Set up database backups

#### MongoDB Setup (Alternative)
1. Set up MongoDB Atlas or self-hosted MongoDB
2. Configure authentication and network access
3. Set up regular backups

## Deployment Options

### Option 1: Docker Deployment

1. **Build and run with Docker Compose:**
   ```bash
   # Set environment variables
   export JWT_SECRET="your-secret"
   export JWT_REFRESH_SECRET="your-refresh-secret"
   # ... other variables
   
   # Deploy
   docker-compose up -d
   ```

2. **Using production environment file:**
   ```bash
   docker-compose --env-file .env.production up -d
   ```

### Option 2: Manual Deployment

1. **Build the application:**
   ```bash
   npm ci
   npm run build
   ```

2. **Serve with a web server:**
   - Use Nginx, Apache, or similar
   - Configure SSL/TLS
   - Set up proper headers

### Option 3: Platform Deployment

#### Vercel
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

#### AWS/GCP/Azure
1. Use container services (ECS, Cloud Run, Container Instances)
2. Set up load balancers
3. Configure auto-scaling
4. Set up monitoring and logging

## Security Configuration

### 1. SSL/TLS
- Obtain SSL certificate (Let's Encrypt recommended)
- Configure HTTPS redirect
- Set up HSTS headers

### 2. Security Headers
Configure your web server with:
```nginx
# Nginx configuration
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.supabase.co;" always;
```

### 3. CORS Configuration
```javascript
// Backend CORS configuration
const corsOptions = {
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true,
  optionsSuccessStatus: 200
};
```

## Monitoring and Logging

### 1. Application Monitoring
- Set up error tracking (Sentry)
- Configure performance monitoring
- Set up uptime monitoring

### 2. Logging
- Configure structured logging
- Set up log aggregation
- Implement log rotation

### 3. Health Checks
- Set up health check endpoints
- Configure monitoring alerts
- Set up automated recovery

## Performance Optimization

### 1. CDN Configuration
- Set up CDN for static assets
- Configure caching headers
- Enable compression

### 2. Database Optimization
- Set up database indexes
- Configure connection pooling
- Monitor query performance

### 3. Caching
- Implement Redis for session storage
- Set up application-level caching
- Configure browser caching

## Backup and Recovery

### 1. Database Backups
- Set up automated daily backups
- Test backup restoration
- Store backups securely

### 2. Application Backups
- Version control all code
- Document configuration changes
- Maintain deployment rollback procedures

## Post-Deployment Checklist

- [ ] SSL certificate installed and working
- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Security headers configured
- [ ] Monitoring and logging set up
- [ ] Health checks passing
- [ ] Performance testing completed
- [ ] Backup procedures tested
- [ ] Documentation updated
- [ ] Team trained on deployment process

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify connection strings
   - Check network connectivity
   - Verify authentication credentials

3. **Environment Variable Issues**
   - Ensure all required variables are set
   - Check variable naming (case-sensitive)
   - Verify no trailing spaces

4. **Performance Issues**
   - Check bundle sizes
   - Monitor database queries
   - Review caching configuration

### Support

For deployment issues:
- Check logs for error messages
- Review this documentation
- Contact the development team
- Check GitHub issues

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review security advisories
- Monitor performance metrics
- Test backup restoration
- Update documentation

### Security Updates
- Apply security patches promptly
- Review access logs regularly
- Update SSL certificates before expiration
- Conduct security audits quarterly