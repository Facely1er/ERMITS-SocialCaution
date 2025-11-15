# Vercel Deployment Fix

## Issue
Vercel was failing with: `Function Runtimes must have a valid version`

## Solution
Updated `vercel.json` to use Vercel v2 configuration with proper framework detection.

## Frontend Deployment to Vercel

### 1. Configure Environment Variables in Vercel Dashboard

Go to your Vercel project settings and add:

```
VITE_API_URL = https://your-backend-url.com/api
```

### 2. Deploy

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy
vercel

# Or push to GitHub (if connected)
git push origin main
```

### 3. Expected Build Output

```
✓ Building...
✓ Compiled successfully
✓ Exported successfully
```

## Backend Deployment Options

Since the MVP has a separate backend, you need to deploy it separately:

### Option 1: Railway (Recommended - Free Tier)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
cd backend
railway init

# Add environment variables in Railway dashboard:
# - MONGODB_URI
# - JWT_SECRET
# - JWT_REFRESH_SECRET
# - FRONTEND_URL (your Vercel URL)

# Deploy
railway up

# Get your backend URL and update Vercel env var
```

### Option 2: Render (Free Tier)

1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repo
4. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables
6. Deploy

### Option 3: Heroku

```bash
# Install Heroku CLI
heroku create ermits-backend

# Add MongoDB
heroku addons:create mongolab:sandbox

# Set env vars
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 64)
heroku config:set JWT_REFRESH_SECRET=$(openssl rand -base64 64)
heroku config:set FRONTEND_URL=https://your-vercel-app.vercel.app

# Deploy
cd backend
git subtree push --prefix backend heroku main
```

## Update Frontend After Backend Deployment

Once backend is deployed, update Vercel environment variable:

```bash
vercel env add VITE_API_URL
# Enter: https://your-backend-url.com/api

# Redeploy
vercel --prod
```

## Troubleshooting

### Build Fails on Vercel

**Issue:** TypeScript errors
```bash
# Fix locally first
npm run type-check
npm run lint:fix
npm run build
```

**Issue:** Missing dependencies
```bash
# Ensure all deps are in package.json, not devDependencies
npm install
```

### CORS Errors After Deployment

Update `backend/src/server.js`:

```javascript
app.use(cors({
  origin: [
    'https://your-vercel-app.vercel.app',
    'https://your-custom-domain.com',
    process.env.FRONTEND_URL
  ],
  credentials: true
}));
```

### API Not Working

1. Check backend is running: `https://your-backend-url.com/health`
2. Verify VITE_API_URL in Vercel environment variables
3. Check browser console for CORS errors
4. Verify backend FRONTEND_URL matches Vercel URL

## Quick Deploy Commands

```bash
# Frontend to Vercel
vercel --prod

# Backend to Railway
cd backend && railway up

# Or backend to Render (via git push)
git push render main
```

## Architecture

```
┌─────────────────┐
│  Vercel         │
│  (Frontend)     │ → https://ermits.vercel.app
└────────┬────────┘
         │
         │ API calls
         ↓
┌─────────────────┐
│  Railway/Render │
│  (Backend)      │ → https://ermits-api.up.railway.app
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  MongoDB Atlas  │
│  (Database)     │
└─────────────────┘
```

## Recommended Setup

1. **Frontend**: Vercel (zero config, automatic builds)
2. **Backend**: Railway (free tier, easy setup)
3. **Database**: MongoDB Atlas (free tier, reliable)

This gives you a completely free, production-ready deployment!
