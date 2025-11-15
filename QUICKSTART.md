# ERMITS Social Caution MVP - Quick Start Guide

## 🚀 Fastest Way to Get Started

### Option 1: Docker (Recommended)

This is the **easiest** way to run the MVP with zero configuration:

```bash
# Start MongoDB and Backend
docker-compose -f docker-compose.mvp.yml up -d mongodb

# Wait for MongoDB to be ready (about 10 seconds)
sleep 10

# Seed the database
cd backend
MONGODB_URI="mongodb://admin:ermits2024@localhost:27017/ermits-social-caution?authSource=admin" node src/database/seedPersonas.js

# Start backend (or use docker-compose for this too)
npm run dev
```

Then in another terminal:
```bash
# Start frontend
npm run dev
```

**Done!** Access the app at `http://localhost:3000`

### Option 2: Local MongoDB

If you have MongoDB installed locally:

1. **Start MongoDB:**
```bash
# On macOS (Homebrew)
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
```

2. **Backend Setup:**
```bash
cd backend

# Create .env file
cat > .env << 'EOF'
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ermits-social-caution
JWT_SECRET=your-super-secret-jwt-key-change-this-min-32-chars
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-change-this-min-32-chars
JWT_REFRESH_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
EOF

# Install dependencies
npm install --legacy-peer-deps

# Seed database with personas and RSS feeds
node src/database/seedPersonas.js

# Start backend
npm run dev
```

3. **Frontend Setup:**
```bash
# From project root
npm install

# Create .env.local
cat > .env.local << 'EOF'
VITE_API_URL=http://localhost:5000/api
EOF

# Start frontend
npm run dev
```

4. **Access the MVP:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

## 📋 First Time User Flow

1. **Register Account**
   - Go to http://localhost:3000
   - Click "Register" or go to /register
   - Create your account

2. **Login**
   - Use your credentials to login
   - You'll be redirected to persona selection

3. **Select Your Persona**
   - Choose one of 6 personas:
     - 👪 Parent/Guardian
     - 🎓 Teen/Student
     - 💼 Professional/Business
     - 👴 Senior Citizen
     - 🔒 Privacy Advocate
     - 👤 General User
   - Read about your privacy rights
   - Click "Continue to Cautions"

4. **View Your Caution Feed**
   - See privacy/security alerts tailored to your persona
   - Filter by severity (Critical, High, Medium, Low)
   - Filter by category (Data Breach, Phishing, Scams, etc.)
   - Click alerts to read full details

5. **Check Dashboard**
   - View statistics about active alerts
   - See category breakdown
   - Review recent cautions
   - Read your privacy rights summary

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Error: "MongoServerError: Authentication failed"**
```bash
# Drop the database and reseed
mongosh
use ermits-social-caution
db.dropDatabase()
exit

# Then reseed
cd backend
node src/database/seedPersonas.js
```

### Backend Won't Start

**Check MongoDB is running:**
```bash
# Test connection
mongosh "mongodb://localhost:27017/ermits-social-caution"
```

**Check .env file exists:**
```bash
cd backend
cat .env  # Should show your environment variables
```

### Frontend Shows "Network Error"

**Verify backend is running:**
```bash
curl http://localhost:5000/health
# Should return: {"status":"healthy",...}
```

**Check VITE_API_URL in .env.local:**
```bash
cat .env.local
# Should show: VITE_API_URL=http://localhost:5000/api
```

### No Caution Items Showing

**Manually trigger RSS feed refresh:**

First, you need to be logged in and have admin role. For testing, you can modify a user to be admin:

```bash
mongosh "mongodb://localhost:27017/ermits-social-caution"
db.users.updateOne({email: "your-email@example.com"}, {$set: {role: "admin"}})
exit
```

Then trigger refresh via API:
```bash
# Get your JWT token from localStorage in browser console
# localStorage.getItem('token')

curl -X POST http://localhost:5000/api/cautions/refresh \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Or wait for the hourly cron job to run automatically.

## 🎯 What's Seeded

When you run `node src/database/seedPersonas.js`, you get:

### 6 Personas
- Parent/Guardian - Child safety focus
- Teen/Student - Social media safety
- Professional/Business - Work privacy
- Senior Citizen - Scam protection
- Privacy Advocate - Maximum control
- General User - Basic awareness

### 10+ RSS Feeds
- Krebs on Security (Data Breach)
- CISA Cybersecurity Advisories (General Security)
- The Hacker News (General Security)
- Schneier on Security (Privacy Laws)
- Electronic Frontier Foundation (Privacy Laws)
- SANS Internet Storm Center (General Security)
- FTC Consumer Alerts (Scams)
- Common Sense Media (Parental Controls)
- Privacy International (Privacy Laws)
- AARP Fraud Watch (Scams)

## 🔄 RSS Feed Updates

RSS feeds are automatically updated:
- **Every hour** - New alerts are fetched
- **Daily at 2 AM** - Old items (90+ days) are cleaned up

To see this in action, the cron jobs start when you run `npm run dev` in backend.

## 📊 Database Inspection

To view data in MongoDB:

```bash
mongosh "mongodb://localhost:27017/ermits-social-caution"

# View all personas
db.personas.find().pretty()

# View all RSS feeds
db.rssfeeds.find().pretty()

# View caution items
db.cautionitems.find().limit(5).pretty()

# View users
db.users.find().pretty()

# Count documents
db.personas.countDocuments()
db.rssfeeds.countDocuments()
db.cautionitems.countDocuments()
```

## 🚀 Production Deployment

For production deployment:

1. **Update environment variables** (use strong secrets!)
2. **Use managed MongoDB** (MongoDB Atlas, AWS DocumentDB, etc.)
3. **Enable HTTPS**
4. **Set up proper logging and monitoring**
5. **Configure CORS properly**
6. **Set up backup strategy for MongoDB**

See `MVP_README.md` for detailed production deployment guide.

## 📝 Notes

- First RSS feed fetch happens on server start or when cron runs
- Caution items are persona-specific, filtered automatically
- You can change persona anytime from the dashboard
- All passwords are hashed with bcrypt
- JWT tokens expire after 7 days by default

---

**Ready to launch!** 🎉

If you encounter any issues, check the backend logs in the terminal where you ran `npm run dev`.
