# Social Caution Backend API Documentation

## Overview

The Social Caution Backend API provides comprehensive privacy assessment and management services with offline-first architecture and real-time synchronization capabilities.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All API responses follow this format:

```json
{
  "status": "success" | "error",
  "message": "Human readable message",
  "data": {}, // Response data (only on success)
  "errors": [] // Validation errors (only on error)
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "isEmailVerified": false
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### POST /auth/login
Authenticate user and return tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

#### POST /auth/logout
Logout user and invalidate tokens.

#### GET /auth/me
Get current user information.

### Assessments

#### GET /assessments/questions
Get assessment questions.

**Query Parameters:**
- `type` (optional): Filter by assessment type (exposure, privacy-rights, security, complete)

#### POST /assessments/start
Start a new assessment.

**Request Body:**
```json
{
  "type": "complete"
}
```

#### POST /assessments/:id/answer
Submit an answer to an assessment.

**Request Body:**
```json
{
  "questionId": "q1",
  "value": "yes",
  "score": 2,
  "level": "intermediate"
}
```

#### POST /assessments/:id/complete
Complete an assessment and get results.

#### GET /assessments
Get user's assessments with pagination.

**Query Parameters:**
- `type` (optional): Filter by type
- `status` (optional): Filter by status
- `limit` (optional): Number of results per page (default: 10)
- `page` (optional): Page number (default: 1)

#### GET /assessments/:id
Get specific assessment details.

### Challenges

#### POST /challenges/start
Start a new 30-day privacy challenge.

#### GET /challenges
Get user's challenges.

#### GET /challenges/:id
Get specific challenge details.

#### POST /challenges/:id/tasks/:taskId/complete
Complete a daily task.

#### GET /challenges/:id/tasks
Get challenge daily tasks.

**Query Parameters:**
- `day` (optional): Filter by day number
- `completed` (optional): Filter by completion status

#### PUT /challenges/:id/pause
Pause an active challenge.

#### PUT /challenges/:id/resume
Resume a paused challenge.

#### GET /challenges/statistics
Get challenge statistics.

### Progress

#### GET /progress
Get user progress information.

#### PUT /progress
Update user progress.

**Request Body:**
```json
{
  "totalPoints": 150,
  "level": 2,
  "streak": 5,
  "badges": ["first-assessment", "streak-starter"]
}
```

#### POST /progress/add-points
Add points to user progress.

**Request Body:**
```json
{
  "points": 25,
  "source": "assessment"
}
```

#### POST /progress/update-streak
Update user streak.

#### POST /progress/add-badge
Add badge to user progress.

**Request Body:**
```json
{
  "badgeId": "first-assessment"
}
```

#### GET /progress/leaderboard
Get global leaderboard.

#### GET /progress/statistics
Get progress statistics.

#### PUT /progress/preferences
Update progress preferences.

### Achievements

#### GET /achievements
Get user achievements.

**Query Parameters:**
- `category` (optional): Filter by category
- `rarity` (optional): Filter by rarity
- `unlocked` (optional): Filter by unlock status
- `limit` (optional): Number of results per page
- `page` (optional): Page number

#### GET /achievements/:id
Get specific achievement details.

#### POST /achievements/unlock
Manually unlock an achievement.

#### GET /achievements/statistics
Get achievement statistics.

#### GET /achievements/categories
Get available achievement categories and rarities.

#### POST /achievements/check
Check and unlock achievements for user.

#### GET /achievements/leaderboard
Get achievement leaderboard.

#### POST /achievements/initialize
Initialize achievements for user.

### Dashboard

#### GET /dashboard/overview
Get dashboard overview data.

#### GET /dashboard/assessments
Get dashboard assessment data.

#### GET /dashboard/action-plan
Get user's action plan.

#### PUT /dashboard/action-plan/:id
Update action plan item.

#### GET /dashboard/analytics
Get analytics data.

#### GET /dashboard/recommendations
Get personalized recommendations.

### Tools

#### POST /tools/digital-footprint
Analyze digital footprint.

#### POST /tools/data-breach-check
Check for data breaches.

#### POST /tools/privacy-scan
Scan website privacy policy.

#### GET /tools/data-brokers
Get data broker information.

#### POST /tools/password-strength
Check password strength.

### Resources

#### GET /resources/guides
Get privacy guides.

#### GET /resources/guides/:id
Get specific guide.

#### GET /resources/checklists
Get privacy checklists.

#### GET /resources/tools
Get privacy tools.

### Blog

#### GET /blog/posts
Get blog posts.

#### GET /blog/posts/:slug
Get specific blog post.

#### GET /blog/categories
Get blog categories.

#### GET /blog/tags
Get blog tags.

### Notifications

#### GET /notifications
Get user notifications.

#### PUT /notifications/:id/read
Mark notification as read.

#### PUT /notifications/read-all
Mark all notifications as read.

#### DELETE /notifications/:id
Delete notification.

#### POST /notifications/preferences
Update notification preferences.

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation errors |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## Rate Limiting

- General API: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes
- Sensitive operations: 3 requests per 15 minutes

## Offline Support

The API supports offline-first architecture:

- Data is cached in localStorage
- Actions are queued when offline
- Automatic sync when connection is restored
- Conflict resolution for concurrent edits

## Data Synchronization

- Real-time sync with Supabase
- Automatic conflict resolution
- Offline queue management
- Data integrity validation

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- XSS protection
- CORS configuration
- Rate limiting
- SQL injection prevention

## Development

### Prerequisites

- Node.js 18+
- MongoDB 5+
- Redis 6+ (optional, for caching)

### Installation

```bash
npm install
```

### Environment Setup

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Database Schema

### Users
- Basic user information
- Privacy profile
- Preferences
- Subscription details

### Assessments
- Assessment data
- Answers and results
- Action plans
- Recommendations

### Challenges
- 30-day challenge data
- Daily tasks
- Progress tracking
- Milestones and achievements

### Progress
- User progress tracking
- Points and levels
- Streaks and badges
- Statistics

### Achievements
- Achievement definitions
- User progress
- Unlock conditions
- Rewards

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.