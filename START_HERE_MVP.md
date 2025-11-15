# 🚀 START HERE - ERMITS Social Caution MVP

## Welcome! Your MVP is Ready to Launch

This simplified MVP is a **persona-based privacy awareness platform** that helps users stay informed about privacy threats and security risks tailored to their specific needs.

## 🎯 What This MVP Does

1. **Persona Selection** - Users choose a persona (Parent, Teen, Professional, Senior, etc.)
2. **Caution Feed** - Real-time privacy/security alerts from 10+ trusted RSS sources
3. **Privacy Rights** - Learn about rights specific to your persona
4. **Dashboard** - View statistics and recent alerts

## ⚡ Quick Start (3 Options)

### Option A: One-Command Start (Easiest!) 🌟

```bash
./start-mvp.sh
```

This script does everything for you:
- ✅ Starts MongoDB
- ✅ Installs dependencies
- ✅ Seeds the database
- ✅ Configures environment
- ✅ Launches frontend & backend

**Then open:** http://localhost:3000

---

### Option B: Manual Docker Setup

```bash
# 1. Start MongoDB
docker-compose -f docker-compose.mvp.yml up -d mongodb

# 2. Wait for MongoDB (10 seconds)
sleep 10

# 3. Backend setup
cd backend
npm install --legacy-peer-deps

# Create .env (copy from below)
nano .env

# Seed database
node src/database/seedPersonas.js

# Start backend
npm run dev
```

**In another terminal:**
```bash
# 4. Frontend setup
npm install

# Create .env.local
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Switch to MVP version
cp src/main.mvp.tsx src/main.tsx

# Start frontend
npm run dev
```

**Backend .env contents:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ermits-social-caution
JWT_SECRET=your-super-secret-jwt-key-change-this-min-32-characters-long
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-min-32-characters-long
JWT_REFRESH_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
```

---

### Option C: Local MongoDB

If you have MongoDB installed locally (not Docker):

```bash
# 1. Start your local MongoDB
mongod

# 2. Follow steps from Option B but use this MongoDB URI in .env:
MONGODB_URI=mongodb://localhost:27017/ermits-social-caution
```

---

## 📋 First Time User Journey

### 1. Register Your Account
- Go to http://localhost:3000
- Click "Register"
- Fill in your details
- Click "Create Account"

### 2. Select Your Persona
After registration, you'll be taken to persona selection. Choose one:

- **👪 Parent/Guardian** - Concerned about children's online safety
- **🎓 Teen/Student** - Learning about social media safety
- **💼 Professional/Business** - Work-related privacy concerns
- **👴 Senior Citizen** - Protection from scams and fraud
- **🔒 Privacy Advocate** - Maximum privacy control
- **👤 General User** - Basic privacy awareness

### 3. Explore Your Caution Feed
- See real-time alerts tailored to your persona
- Filter by severity (Critical, High, Medium, Low)
- Filter by category (Data Breach, Phishing, Scams, etc.)
- Click alerts to read full details from trusted sources

### 4. Check Your Dashboard
- View alert statistics
- See recent cautions
- Review your privacy rights
- Change persona anytime

## 🔍 What's Pre-Loaded

### 6 Personas with Privacy Rights
Each persona has specific risk categories and actionable privacy rights.

### 10+ Trusted RSS Sources
- **Krebs on Security** - Data breaches
- **CISA** - Government cybersecurity alerts
- **The Hacker News** - Security news
- **Schneier on Security** - Privacy analysis
- **EFF** - Digital rights
- **SANS ISC** - Threat intelligence
- **FTC Consumer Alerts** - Scam warnings
- **Common Sense Media** - Child safety
- **Privacy International** - Privacy advocacy
- **AARP Fraud Watch** - Senior protection

### Automatic Updates
- RSS feeds refresh **every hour**
- Old items (90+ days) cleaned up **daily**

## 🛠️ Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
pgrep mongod

# If not, start with Docker:
docker-compose -f docker-compose.mvp.yml up -d mongodb

# Or start local MongoDB:
mongod
```

### Backend Won't Start
```bash
# Check .env file exists
cat backend/.env

# Test MongoDB connection
mongosh "mongodb://localhost:27017/ermits-social-caution"
```

### No Alerts Showing
The RSS feeds populate on first cron run (hourly) or you can manually trigger:

```bash
# Make yourself admin first
mongosh "mongodb://localhost:27017/ermits-social-caution"
db.users.updateOne({email: "your@email.com"}, {$set: {role: "admin"}})

# Then call refresh endpoint (get token from browser localStorage)
curl -X POST http://localhost:5000/api/cautions/refresh \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Frontend Shows Network Error
```bash
# Verify backend is running:
curl http://localhost:5000/health

# Should return: {"status":"healthy",...}
```

## 📊 Verify Setup

**Check database contents:**
```bash
mongosh "mongodb://localhost:27017/ermits-social-caution"

# View personas
db.personas.find().pretty()

# View RSS feeds
db.rssfeeds.find().pretty()

# Count caution items
db.cautionitems.countDocuments()
```

**Test API endpoints:**
```bash
# Health check
curl http://localhost:5000/health

# Get personas (no auth needed)
curl http://localhost:5000/api/personas

# Get RSS feeds (no auth needed)
curl http://localhost:5000/api/personas
```

## 📚 Documentation

- **`MVP_README.md`** - Full technical documentation
- **`QUICKSTART.md`** - Detailed setup guide
- **`README.md`** - Original project documentation

## 🎨 Customization

### Add More RSS Feeds
Edit `backend/src/database/seedPersonas.js` and add to the `rssFeeds` array:

```javascript
{
  name: 'Your Source Name',
  url: 'https://example.com/feed.xml',
  category: 'data-breach', // or phishing, scams, etc.
  personas: ['professional', 'general'], // which personas see this
  source: 'Source Display Name',
  updateFrequency: 3600000, // 1 hour in milliseconds
  isActive: true
}
```

Then re-seed: `node backend/src/database/seedPersonas.js`

### Add More Personas
Edit the `personas` array in the same file.

### Change Update Frequency
Edit `backend/src/jobs/rssCronJob.js` to change the cron schedule.

## 🚀 Production Deployment

When ready for production:

1. **Use strong secrets** in environment variables
2. **Use managed MongoDB** (MongoDB Atlas, etc.)
3. **Enable HTTPS**
4. **Set up logging and monitoring**
5. **Configure backup strategy**

See `MVP_README.md` for detailed production deployment guide.

## 🎉 You're All Set!

The MVP is production-ready. Users can now:
- ✅ Create accounts
- ✅ Select personas
- ✅ View tailored alerts
- ✅ Learn privacy rights
- ✅ Stay informed automatically

**Need help?** Check the detailed guides:
- Technical issues → `QUICKSTART.md`
- Architecture details → `MVP_README.md`
- API documentation → `MVP_README.md` (API Endpoints section)

---

**Happy launching! 🎊**

*ERMITS Social Caution MVP - Privacy awareness through personalization.*
