# Social Caution - Privacy Education Platform

**Social Caution** is a comprehensive privacy education platform that empowers users to understand, assess, and improve their digital privacy through interactive assessments, personalized learning paths, and practical privacy tools. Built with modern web technologies, the platform provides an educational approach to digital privacy awareness and protection.

## 🎯 Overview

Social Caution helps individuals and organizations learn about digital privacy through:

- **Interactive Privacy Assessments** - Comprehensive questionnaires covering security, exposure, and privacy rights
- **Personalized Learning Journeys** - Customized recommendations based on assessment results and user personas
- **Privacy Tools & Resources** - Educational tools for understanding digital footprints, data breaches, and privacy rights
- **Progress Tracking** - Gamified system with challenges, achievements, and milestone tracking
- **Persona-Based Guidance** - Tailored privacy advice based on user roles (Parent, Professional, Teen, Senior, etc.)

## 🚀 Key Features

### Core Functionality
- **Privacy Assessments**: Interactive educational questionnaires covering security practices, data exposure, and privacy rights awareness
- **Privacy Scoring System**: Educational scoring with weighted risk factors to help users understand their privacy posture
- **Personalized Learning Plans**: Customized educational recommendations and action plans based on assessment results
- **Dashboard Analytics**: Real-time privacy analytics, progress visualization, and learning journey tracking
- **30-Day Privacy Challenge**: Structured privacy improvement program with daily tasks and streak tracking
- **Achievement System**: 13 privacy milestones with point-based rewards and progress gamification

### Privacy Tools (Educational Mode)
- **Digital Footprint Analyzer**: Educational analysis of common online exposure patterns (uses simulated data for demonstration)
- **Data Breach Checker**: Educational information about common data breaches and breach response strategies (uses simulated data for demonstration)
- **Password Strength Checker**: Client-side password security evaluation and improvement recommendations
- **Privacy Settings Scanner**: Educational analysis of website privacy configurations and tracking patterns (uses simulated data for demonstration)
- **Data Broker Removal Tool**: Step-by-step guidance and tracking for data broker opt-out requests
- **Personal Data Inventory**: Comprehensive tool for tracking and managing personal data across services with export capabilities

### Persona-Based Features (MVP)
- **Persona Selection**: Choose from 6+ personas (Parent, Teen, Professional, Senior, Privacy Advocate, General User)
- **Caution Feed**: Real-time privacy alerts and security threats from trusted RSS sources, filtered by persona
- **Privacy Rights Education**: Learn about privacy rights specific to your persona and situation
- **Tailored Recommendations**: Persona-specific privacy guidance and risk category filtering

### User Experience
- **Multi-language Support**: English, Spanish, and French with full internationalization
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: User preference-based theme switching with system detection
- **Privacy Journey Tracking**: Four-phase progression system (Discover → Learn → Protect → Monitor)
- **Accessibility**: WCAG-compliant design with keyboard navigation and screen reader support
- **Offline Support**: Local storage with cloud synchronization for offline-first experience

**⚠️ Important Note**: Some privacy tools use simulated or educational data for demonstration purposes. These tools are designed for privacy education and awareness, not for real-time monitoring or active protection services. See [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md) for details on production-ready vs. demo features.

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe component development
- **Vite** for fast build tooling and hot module replacement
- **Tailwind CSS 4** for utility-first styling and responsive design
- **Framer Motion** for smooth animations and transitions
- **React Router v6** for client-side routing and navigation
- **Zustand** for lightweight state management
- **React i18next** for internationalization and multi-language support
- **Recharts** for data visualization and analytics
- **Lucide React** for consistent iconography

### Backend
- **Node.js** with Express.js for RESTful API development
- **MongoDB** with Mongoose ODM (primary database for user data, assessments, action plans)
- **Supabase** (PostgreSQL) for real-time features, progress tracking, challenges, and achievements (hybrid architecture)
- **JWT** (JSON Web Tokens) for stateless authentication with refresh tokens
- **Bcrypt** for secure password hashing with configurable rounds
- **Joi** for comprehensive input validation and sanitization
- **Winston** for structured logging and error tracking
- **Nodemailer** for email services (password reset, notifications)
- **RSS Parser** for feed aggregation (MVP persona-based features)
- **Node-cron** for scheduled tasks (RSS feed updates)

### Development & DevOps
- **TypeScript** for type safety across frontend and backend
- **ESLint** with TypeScript rules for code quality
- **Vitest** for frontend unit testing
- **Jest** for backend testing (configured, tests in progress)
- **Docker** & **Docker Compose** for containerization and local development
- **GitHub Actions** for CI/CD pipeline
- **Nginx** for production reverse proxy and static file serving

## 📦 Installation & Setup

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** v5 or higher (or use Docker)
- **npm** or **yarn** package manager
- **Git** for version control

### Quick Start with Docker (Recommended)

The easiest way to get started is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/your-username/social-caution.git
cd social-caution

# Start MongoDB and services
docker-compose up -d mongodb

# Wait for MongoDB to be ready (10 seconds)
sleep 10

# Start backend and frontend
docker-compose up
```

Access the application at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### Manual Setup

#### Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create environment file**:
```bash
cp .env.example .env
```

4. **Configure environment variables** in `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-caution
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-min-32-characters-long
JWT_REFRESH_EXPIRE=30d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. **Start the backend server**:
```bash
npm run dev
```

#### Frontend Setup

1. **Navigate to project root**:
```bash
cd ..
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create environment file**:
```bash
cp .env.example .env.local
```

4. **Configure environment variables** in `.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. **Start the development server**:
```bash
npm run dev
```

### MVP Setup (Persona-Based Features)

For the persona-based MVP features (RSS feeds, caution alerts), see [START_HERE_MVP.md](./START_HERE_MVP.md) for detailed setup instructions.

## 🚀 Quick Start

1. **Clone the repository**:
```bash
git clone https://github.com/your-username/social-caution.git
cd social-caution
```

2. **Choose your setup method**:
   - **Docker** (easiest): `docker-compose up`
   - **Manual**: Follow Backend Setup and Frontend Setup above

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - API Documentation: http://localhost:5000/api/docs (if enabled)

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Assessment Endpoints
- `GET /api/assessments/questions` - Get assessment questions
- `POST /api/assessments/start` - Start new assessment
- `POST /api/assessments/:id/answer` - Submit answer
- `POST /api/assessments/:id/complete` - Complete assessment
- `GET /api/assessments` - Get user assessments

### Dashboard Endpoints
- `GET /api/dashboard/overview` - Get dashboard overview
- `GET /api/dashboard/assessments` - Get assessment history
- `GET /api/dashboard/action-plan` - Get action plan
- `PATCH /api/dashboard/action-plan/:itemId` - Update action plan item
- `GET /api/dashboard/analytics` - Get privacy analytics
- `GET /api/dashboard/recommendations` - Get recommendations

### Tools Endpoints
- `POST /api/tools/digital-footprint` - Analyze digital footprint
- `POST /api/tools/data-breach-check` - Check data breaches
- `POST /api/tools/privacy-scan` - Scan website privacy
- `GET /api/tools/data-brokers` - Get data brokers list
- `POST /api/tools/password-strength` - Check password strength

## 🧪 Testing

### Current Test Status
- **Frontend Tests**: 4+ tests implemented (using Vitest)
- **Backend Tests**: Test infrastructure in place (Jest configured, tests in progress)
- **E2E Tests**: Planned for Phase 2
- **Coverage Goal**: 50% minimum coverage

### Running Tests

#### Frontend Tests
```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

#### Backend Tests
```bash
cd backend
npm test
```

**Note**: Backend test suite is in development. Test infrastructure (Jest) is configured and ready for implementation. See [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md) for current status.

## 🐳 Docker Deployment

### Development with Docker Compose
```bash
# Start all services (MongoDB, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Production Build
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### Individual Containers
```bash
# Backend
docker build -t social-caution-backend ./backend
docker run -p 5000:5000 --env-file backend/.env social-caution-backend

# Frontend
docker build -t social-caution-frontend .
docker run -p 3000:3000 --env-file .env.local social-caution-frontend
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md) and [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md).

## 📱 Mobile Support

The platform is fully responsive and optimized for mobile devices with:
- **Progressive Web App (PWA)** capabilities
- **Touch-optimized** interfaces and gestures
- **Mobile-first** responsive design
- **Offline support** with local storage

A native mobile app (iOS and Android) is planned for Phase 3.

## ⚠️ Important Disclaimer

**Social Caution is an educational platform designed for privacy awareness and learning.** 

### What We Provide ✅
- Privacy education and comprehensive learning resources
- Educational assessments and privacy scoring tools
- Privacy awareness training and best practices guidance
- Learning materials about data rights and privacy laws
- Educational tools for understanding digital footprints and data exposure
- Personalized learning paths and action plans

### What We Do NOT Provide ❌
- Real-time monitoring or active protection services
- Automated data removal or privacy setting changes
- Guaranteed privacy protection or security
- Professional legal, financial, or security advice
- Real-time breach monitoring (currently uses educational/simulated data)
- Active threat detection or prevention services

**This platform is designed for education and awareness purposes.** For active protection services, real-time monitoring, or professional advice, please consult with qualified privacy professionals, security experts, or legal counsel.

See [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md) for details on which features are production-ready vs. educational/demo mode.

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Password Hashing** using bcrypt
- **Input Validation** and sanitization
- **Rate Limiting** to prevent abuse
- **CORS Protection** for API security
- **Helmet.js** for security headers
- **XSS Protection** for user input
- **Content Security Policy (CSP)** configured
- **HTTPS Enforcement** (automatic on Netlify)
- **Security Headers** (X-Frame-Options, X-XSS-Protection, etc.)

## 🌍 Internationalization

The platform supports multiple languages:
- English (en)
- Spanish (es)
- French (fr)

Language files are located in `public/locales/`.

## 📊 Analytics and Monitoring

- **Winston Logging** for application logs
- **Error Tracking** with detailed error reporting
- **Performance Monitoring** for API endpoints
- **User Analytics** for privacy insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Resources

### Getting Help
- **Documentation**: Check the [docs](./docs) directory for detailed guides
- **Issues**: Report bugs or request features on [GitHub Issues](https://github.com/your-username/social-caution/issues)
- **Development Status**: See [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md) for feature status
- **Contributing**: Read [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines

### Additional Resources
- **Quick Start Guide**: [QUICKSTART.md](./QUICKSTART.md)
- **MVP Setup**: [START_HERE_MVP.md](./START_HERE_MVP.md)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Security**: [SECURITY.md](./SECURITY.md) for vulnerability reporting
- **Changelog**: [CHANGELOG.md](./CHANGELOG.md) for version history

## 🗺️ Roadmap

### Phase 1 (Completed) ✅
- ✅ Privacy assessments with comprehensive scoring
- ✅ User authentication and authorization
- ✅ Dashboard analytics and progress tracking
- ✅ Educational resources and guides
- ✅ Multi-language support (EN, ES, FR)
- ✅ 30-Day Privacy Challenge
- ✅ Achievement system and gamification
- ✅ Persona-based privacy guidance (MVP)
- ✅ Personal Data Inventory tool

### Phase 2 (In Progress) 🔄
- 🔄 WebSocket integration for real-time notifications
- 🔄 External API integrations:
  - Have I Been Pwned API for real data breach checking
  - Search engine APIs for digital footprint analysis
  - Real website scanning capabilities
- 🔄 Email notification system (SMTP configuration)
- 🔄 Comprehensive backend test suite
- 🔄 End-to-end (E2E) testing
- 🔄 Performance monitoring and analytics

### Phase 3 (Planned) ⏳
- ⏳ AI-powered privacy recommendations
- ⏳ Social features and community sharing
- ⏳ Enterprise features and team management
- ⏳ Advanced predictive analytics
- ⏳ Native mobile apps (iOS and Android)
- ⏳ Browser extension for privacy scanning
- ⏳ Automated data broker removal workflows

## 🙏 Acknowledgments

- Privacy advocates and security experts
- Open source community
- Beta testers and early adopters

---

**Social Caution** - Educating about digital privacy, one learning experience at a time.