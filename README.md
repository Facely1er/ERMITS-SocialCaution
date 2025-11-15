# Social Caution - Privacy Education Platform

An educational privacy platform that helps users learn about digital privacy through interactive assessments, personalized learning recommendations, and comprehensive educational resources.

## 🚀 Features

### Core Functionality
- **Privacy Assessments**: Interactive educational questionnaires covering various privacy aspects
- **Privacy Scoring**: Educational scoring system to help users understand their privacy practices
- **Personalized Learning Plans**: Customized educational recommendations based on assessment results
- **Dashboard Analytics**: Educational privacy analytics and learning progress tracking
- **Educational Resources**: Comprehensive guides, checklists, and learning tools for privacy education

### Privacy Tools
- **Digital Footprint Analyzer**: Educational analysis of common online exposure patterns (uses simulated data for demonstration)
- **Data Breach Checker**: Educational information about common data breaches (uses simulated data for demonstration)
- **Password Strength Checker**: Evaluate and improve password security (client-side analysis)
- **Privacy Settings Scanner**: Educational analysis of website privacy configurations (uses simulated data for demonstration)
- **Data Broker Removal**: Guidance and tracking for data broker opt-out requests (educational tool)

### User Experience
- **Multi-language Support**: English, Spanish, and French
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Theme**: User preference-based theme switching
- **Privacy Guidance**: Educational alerts and assessment reminders
- **Progress Tracking**: Gamified progress tracking and achievements

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Zustand** for state management
- **React i18next** for internationalization

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose (primary database)
- **Supabase** (PostgreSQL) for user progress, challenges, and achievements (hybrid architecture)
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Joi** for validation
- **Winston** for logging
- **Nodemailer** for email services

### Development Tools
- **ESLint** for code linting
- **Prettier** for code formatting
- **Jest** for testing
- **Docker** for containerization

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-caution
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

5. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the project root:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

## 🚀 Quick Start

1. **Clone the repository**:
```bash
git clone https://github.com/your-username/social-caution.git
cd social-caution
```

2. **Set up the backend** (see Backend Setup above)

3. **Set up the frontend** (see Frontend Setup above)

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

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
- **Frontend Tests**: 4 tests implemented (using Vitest)
- **Backend Tests**: 0 tests currently (test infrastructure in place)
- **E2E Tests**: Not yet implemented

### Running Tests

#### Frontend Tests
```bash
npm test
```

#### Backend Tests
```bash
cd backend
npm test
```

**Note**: Backend test suite is planned but not yet implemented. Test infrastructure (Jest) is configured and ready for implementation.

## 🐳 Docker Deployment

### Build and run with Docker Compose
```bash
docker-compose up -d
```

### Individual containers
```bash
# Backend
docker build -t social-caution-backend ./backend
docker run -p 5000:5000 social-caution-backend

# Frontend
docker build -t social-caution-frontend .
docker run -p 3000:3000 social-caution-frontend
```

## 📱 Mobile App

The platform is designed to be responsive and works well on mobile devices. A native mobile app is planned for future releases.

## ⚠️ Important Disclaimer

**Social Caution is an educational platform only.** We provide:
- ✅ Privacy education and learning resources
- ✅ Educational assessments and tools
- ✅ Privacy awareness and best practices
- ✅ Learning materials about data rights

**We do NOT provide:**
- ❌ Real-time monitoring or active protection services
- ❌ Automated data removal or privacy setting changes
- ❌ Guaranteed privacy protection or security
- ❌ Professional legal or security advice

This platform is designed for education and awareness. For active protection services, consult with qualified privacy professionals.

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

## 🆘 Support

For support, email support@socialcaution.com or join our Discord community.

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Basic privacy assessment
- ✅ User authentication
- ✅ Dashboard analytics
- ✅ Educational resources

### Phase 2 (In Progress)
- 🔄 Advanced privacy tools
- 🔄 Polling-based notifications (WebSocket implementation planned)
- 🔄 Mobile app
- 🔄 API integrations (Have I Been Pwned, etc.)

### Phase 3 (Planned)
- ⏳ AI-powered recommendations
- ⏳ Social features
- ⏳ Enterprise features
- ⏳ Advanced analytics

## 🙏 Acknowledgments

- Privacy advocates and security experts
- Open source community
- Beta testers and early adopters

---

**Social Caution** - Educating about digital privacy, one learning experience at a time.