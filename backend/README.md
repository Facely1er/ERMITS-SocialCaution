# Social Caution Backend API

A comprehensive privacy assessment and management platform with offline-first architecture, real-time synchronization, and advanced security features.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - JWT-based auth with refresh tokens
- **Privacy Assessments** - Comprehensive privacy evaluation tools
- **30-Day Challenges** - Structured privacy improvement programs
- **Progress Tracking** - Points, levels, streaks, and achievements
- **Real-time Synchronization** - Supabase integration with offline support
- **Advanced Caching** - Multi-layer caching for optimal performance

### Security Features
- **Password Security** - Bcrypt hashing with configurable rounds
- **Input Validation** - Comprehensive validation and sanitization
- **Rate Limiting** - Configurable rate limits for different endpoints
- **XSS Protection** - Built-in XSS prevention
- **SQL Injection Prevention** - MongoDB sanitization
- **CORS Configuration** - Flexible CORS settings

### Offline Support
- **Local Storage Service** - Comprehensive offline data persistence
- **Sync Service** - Automatic data synchronization
- **Conflict Resolution** - Intelligent conflict handling
- **Queue Management** - Offline action queuing

## 🏗️ Architecture

### Database Layer
- **MongoDB** - Primary database for user data and assessments
- **Supabase** - Real-time synchronization and additional features
- **Redis** - Caching and session storage (optional)

### API Layer
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Express Validator** - Input validation

### Services
- **LocalStorageService** - Offline data management
- **SyncService** - Data synchronization
- **SupabaseService** - Supabase integration
- **CacheService** - Multi-layer caching

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB 5+
- Redis 6+ (optional)
- Supabase account

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment configuration**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/social-caution
MONGODB_TEST_URI=mongodb://localhost:27017/social-caution-test

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_REFRESH_EXPIRE=30d

# Additional configuration...
```

5. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

## 🧪 Testing

### Run Tests
```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Test Structure
- **Unit Tests** - Individual function testing
- **Integration Tests** - API endpoint testing
- **E2E Tests** - Full workflow testing

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Assessment Endpoints
- `GET /api/assessments/questions` - Get assessment questions
- `POST /api/assessments/start` - Start new assessment
- `POST /api/assessments/:id/answer` - Submit answer
- `POST /api/assessments/:id/complete` - Complete assessment
- `GET /api/assessments` - Get user assessments
- `GET /api/assessments/:id` - Get specific assessment

### Challenge Endpoints
- `POST /api/challenges/start` - Start 30-day challenge
- `GET /api/challenges` - Get user challenges
- `POST /api/challenges/:id/tasks/:taskId/complete` - Complete task
- `GET /api/challenges/:id/tasks` - Get challenge tasks
- `PUT /api/challenges/:id/pause` - Pause challenge
- `PUT /api/challenges/:id/resume` - Resume challenge

### Progress Endpoints
- `GET /api/progress` - Get user progress
- `PUT /api/progress` - Update progress
- `POST /api/progress/add-points` - Add points
- `POST /api/progress/update-streak` - Update streak
- `GET /api/progress/leaderboard` - Get leaderboard

### Achievement Endpoints
- `GET /api/achievements` - Get user achievements
- `POST /api/achievements/unlock` - Unlock achievement
- `GET /api/achievements/statistics` - Get statistics
- `POST /api/achievements/check` - Check for new achievements

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | Required |
| `SUPABASE_URL` | Supabase project URL | Required |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `BCRYPT_ROUNDS` | Bcrypt salt rounds | `12` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

### Caching Configuration
- **User Cache** - 5 minutes TTL
- **Assessment Cache** - 10 minutes TTL
- **Challenge Cache** - 5 minutes TTL
- **Progress Cache** - 3 minutes TTL
- **Achievement Cache** - 30 minutes TTL

## 🚀 Deployment

### Docker Deployment
```bash
# Build image
docker build -t social-caution-backend .

# Run container
docker run -p 5000:5000 social-caution-backend
```

### Environment Setup
1. Set up MongoDB cluster
2. Configure Supabase project
3. Set up Redis (optional)
4. Configure environment variables
5. Deploy to your preferred platform

## 📊 Monitoring

### Health Checks
- `GET /health` - Basic health check
- `GET /api/health/detailed` - Detailed system status

### Logging
- **Winston** - Structured logging
- **Morgan** - HTTP request logging
- **Custom** - Application-specific logs

### Metrics
- Request/response times
- Error rates
- Cache hit rates
- Database performance

## 🔒 Security

### Authentication
- JWT tokens with refresh mechanism
- Password hashing with bcrypt
- Rate limiting on sensitive endpoints
- Account lockout protection

### Data Protection
- Input validation and sanitization
- XSS prevention
- SQL injection protection
- CORS configuration
- Helmet security headers

### Privacy
- Data encryption at rest
- Secure data transmission
- Privacy-focused data handling
- GDPR compliance features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Development Guidelines
- Follow ESLint configuration
- Write comprehensive tests
- Update documentation
- Follow semantic versioning

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](API_DOCUMENTATION.md)
- [Database Schema](supabase-schema.sql)
- [Environment Configuration](.env.example)

### Issues
- Report bugs via GitHub Issues
- Request features via GitHub Discussions
- Check existing issues before creating new ones

### Contact
- Email: support@socialcaution.com
- GitHub: [@social-caution](https://github.com/social-caution)

## 🗺️ Roadmap

### Upcoming Features
- [ ] Advanced analytics dashboard
- [ ] Machine learning recommendations
- [ ] Mobile app API support
- [ ] Third-party integrations
- [ ] Advanced reporting features

### Performance Improvements
- [ ] Database query optimization
- [ ] Caching strategy improvements
- [ ] CDN integration
- [ ] Load balancing support

---

**Built with ❤️ for privacy protection**