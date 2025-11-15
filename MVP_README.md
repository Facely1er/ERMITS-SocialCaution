# ERMITS Social Caution - MVP (Persona-Based Privacy Awareness Platform)

## 🎯 Overview

This is a **simplified MVP** of the ERMITS Social Caution platform, reimagined with a **persona-based approach** to promote privacy awareness, risk exposure education, and privacy rights information.

The platform helps users understand privacy threats and risks tailored to their specific life situation through:
- **Persona Selection** - Choose a persona that matches your needs (Parent, Teen, Professional, Senior, etc.)
- **Caution Feed** - Real-time privacy alerts and security threats from trusted RSS sources, filtered by persona
- **Privacy Rights** - Learn about your specific privacy rights based on your persona
- **Simple Dashboard** - View statistics and recent alerts at a glance

## 🏗️ Architecture

### Core Concept
Users select a **persona** (e.g., Parent, Teen, Professional, Senior) and receive **tailored caution alerts** about:
- Data breaches
- Phishing threats
- Online scams
- Privacy law changes
- Social media risks
- Identity theft warnings

### Technology Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- Zustand (optional, for state management)

**Backend:**
- Node.js + Express
- MongoDB for data storage
- RSS Parser for feed aggregation
- JWT authentication
- Node-cron for scheduled RSS updates

**Data Models:**
1. **User** - Authentication and persona selection
2. **Persona** - Predefined user personas with risk categories and privacy rights
3. **RSSFeed** - Configured RSS feed sources mapped to personas
4. **CautionItem** - Individual alerts/warnings from RSS feeds

## 📦 Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB v5+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ermits-social-caution
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-change-this
JWT_REFRESH_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
```

4. Seed the database with personas and RSS feeds:
```bash
npm run seed
# or
node src/database/seedPersonas.js
```

5. Start the backend:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. From project root, install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🚀 Quick Start Guide

### Step 1: Create an Account
1. Visit `http://localhost:3000`
2. Click "Register" and create your account
3. Log in with your credentials

### Step 2: Select Your Persona
1. After login, you'll be prompted to select a persona
2. Choose the persona that best matches your needs:
   - **Parent/Guardian** - Child online safety and parental controls
   - **Teen/Student** - Social media safety and online reputation
   - **Professional/Business** - Work-related privacy and data security
   - **Senior Citizen** - Scam protection and financial fraud awareness
   - **Privacy Advocate** - Maximum privacy control and GDPR/CCPA rights
   - **General User** - Basic privacy and security awareness

### Step 3: View Your Caution Feed
1. Access your personalized caution feed with alerts tailored to your persona
2. Filter by severity (Critical, High, Medium, Low)
3. Filter by category (Data Breach, Phishing, Scams, etc.)
4. Click on any alert to read more details

### Step 4: Monitor Your Dashboard
1. View statistics about active alerts
2. See recent cautions at a glance
3. Review your privacy rights based on your persona
4. Change persona anytime if your needs change

## 🎨 MVP Features

### ✅ Implemented Features
1. **User Authentication**
   - Register/Login with JWT
   - Secure password hashing
   - Token-based session management

2. **Persona System**
   - 6 predefined personas
   - Persona-specific risk categories
   - Privacy rights information per persona
   - Easy persona switching

3. **RSS Feed Integration**
   - 10+ curated security/privacy RSS feeds
   - Automatic hourly updates via cron jobs
   - Category and persona mapping
   - Severity detection (Critical, High, Medium, Low)

4. **Caution Feed**
   - Real-time privacy alerts
   - Advanced filtering (category, severity, date)
   - Pagination
   - External links to source articles
   - Tag-based categorization

5. **Simple Dashboard**
   - Alert statistics
   - Category breakdown
   - Recent cautions preview
   - Privacy rights summary

### 📋 Personas Included

1. **Parent/Guardian** 👪
   - Focus: Children's online safety, parental controls
   - Categories: Parental controls, online safety, social media, scams

2. **Teen/Student** 🎓
   - Focus: Social media safety, digital reputation
   - Categories: Social media, online safety, identity theft, phishing

3. **Professional/Business** 💼
   - Focus: Work privacy, data security, professional reputation
   - Categories: Data breach, phishing, identity theft, device security

4. **Senior Citizen** 👴
   - Focus: Scam protection, financial fraud prevention
   - Categories: Scams, phishing, financial fraud, identity theft

5. **Privacy Advocate** 🔒
   - Focus: Maximum privacy control, legal rights
   - Categories: Privacy laws, data breach, device security

6. **General User** 👤
   - Focus: Basic privacy and security awareness
   - Categories: Phishing, identity theft, social media, online safety

### 📡 RSS Feed Sources

Default RSS feeds included:
- Krebs on Security
- CISA Cybersecurity Advisories
- The Hacker News
- Schneier on Security
- Electronic Frontier Foundation (EFF)
- SANS Internet Storm Center
- FTC Consumer Alerts
- Common Sense Media
- Privacy International
- AARP Fraud Watch

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Personas
- `GET /api/personas` - Get all personas
- `GET /api/personas/:name` - Get specific persona
- `POST /api/personas/select` - Select persona for user
- `GET /api/personas/user/current` - Get user's current persona

### Cautions
- `GET /api/cautions` - Get caution items (supports filtering)
- `GET /api/cautions/:id` - Get specific caution
- `GET /api/cautions/categories` - Get all categories
- `GET /api/cautions/stats/summary` - Get statistics
- `POST /api/cautions/refresh` - Manually refresh RSS feeds (admin only)

## 🔄 Automated RSS Updates

RSS feeds are automatically updated:
- **Every hour** - New caution items are fetched from all active RSS feeds
- **Daily at 2 AM** - Old caution items (90+ days) are automatically cleaned up

To manually trigger an update (requires admin role):
```bash
curl -X POST http://localhost:5000/api/cautions/refresh \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Database Schema

### User
```javascript
{
  email: String,
  password: String (hashed),
  firstName: String,
  lastName: String,
  selectedPersona: String (ref: Persona.name),
  isActive: Boolean,
  createdAt: Date
}
```

### Persona
```javascript
{
  name: String (unique),
  displayName: String,
  description: String,
  icon: String (emoji),
  riskCategories: [String],
  privacyRights: [{
    title: String,
    description: String,
    actionable: Boolean
  }],
  targetAudience: String
}
```

### CautionItem
```javascript
{
  title: String,
  description: String,
  category: String,
  personas: [String],
  severity: String (low|medium|high|critical),
  source: { name: String, url: String },
  publishedDate: Date,
  link: String,
  tags: [String]
}
```

### RSSFeed
```javascript
{
  name: String,
  url: String,
  category: String,
  personas: [String],
  updateFrequency: Number (milliseconds),
  lastFetched: Date,
  source: String
}
```

## 🎯 MVP vs Full Platform

This MVP is a **simplified version** focusing on core functionality:

**What's Included:**
✅ Persona-based approach
✅ RSS-fed caution alerts
✅ Privacy rights education
✅ Simple, clean UI
✅ Essential authentication
✅ Real-time threat awareness

**What's Removed (from original platform):**
❌ Complex assessment system
❌ Gamification features
❌ Multiple privacy tools
❌ Advanced analytics
❌ Multi-language support
❌ Social features
❌ Subscription tiers

## 🚀 Deployment

### Environment Variables (Production)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ermits
JWT_SECRET=your-production-secret-minimum-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-minimum-32-characters
FRONTEND_URL=https://yourdomain.com
```

### Build Frontend
```bash
npm run build
```

### Start Production Backend
```bash
cd backend
npm start
```

### Docker Deployment
```bash
docker-compose up -d
```

## 📝 Future Enhancements

Potential additions for future versions:
- Email notifications for critical alerts
- Custom RSS feed management
- Multi-language support
- Mobile app (React Native)
- Browser extension
- Social sharing features
- More personas
- AI-powered threat analysis
- Personalized recommendations

## 🤝 Contributing

This is an MVP designed for rapid deployment. For contributions:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues or questions:
- Create an issue on GitHub
- Email: support@ermits.com (if configured)

---

**ERMITS Social Caution MVP** - Privacy awareness through personalization.
