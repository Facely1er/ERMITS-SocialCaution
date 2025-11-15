# Environment Variables Template

Copy this content to a `.env` file in the root directory and fill in your values.

```env
# Environment Variables Template
# Copy this file to .env and fill in your values

# Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Sentry Error Tracking (Optional - for production error monitoring)
# Get your DSN from https://sentry.io
VITE_REACT_APP_SENTRY_DSN=

# Environment Configuration (Optional)
VITE_REACT_APP_ENVIRONMENT=production
VITE_REACT_APP_PERFORMANCE_SAMPLE_RATE=0.1

# Error Logging (Optional - for development)
VITE_ENABLE_ERROR_LOGGING=false

# Analytics (Optional - if using Google Analytics)
# VITE_GA_MEASUREMENT_ID=

# Feature Flags (Optional)
# VITE_ENABLE_BETA_FEATURES=false
# VITE_ENABLE_ADVANCED_ANALYTICS=false
```

## Required Variables

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Optional Variables

- `VITE_REACT_APP_SENTRY_DSN` - Sentry DSN for error tracking
- `VITE_REACT_APP_ENVIRONMENT` - Environment name (production, staging, etc.)
- `VITE_REACT_APP_PERFORMANCE_SAMPLE_RATE` - Sentry performance sample rate (0.0-1.0)
- `VITE_ENABLE_ERROR_LOGGING` - Enable error logging in development

