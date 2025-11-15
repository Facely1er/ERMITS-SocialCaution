# Complete Backend Configuration for 30-Day Privacy Roadmap

This document provides complete setup instructions for the Supabase backend integration with the 30-day privacy roadmap feature.

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://snrpdosiuwmdaegxkqux.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNucnBkb3NpdXdtZGFlZ3hrcXV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTA5MTYsImV4cCI6MjA3NDc4NjkxNn0.tl_ipfmxSwMNLBQ-QeqQPyp_w6xvocTtXqaFGHHFwe0
```

### 2. Database Setup

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Execute the SQL to create all tables and policies

### 3. Install Dependencies

```bash
npm install @supabase/supabase-js
```

## 📊 Database Schema

### Tables Created

1. **users** - User profiles and preferences
2. **thirty_day_challenges** - Challenge instances for each user
3. **daily_tasks** - Individual tasks for each challenge
4. **user_progress** - User progress tracking and points
5. **achievements** - User achievements and badges

### Key Features

- **Row Level Security (RLS)** - Users can only access their own data
- **Automatic Triggers** - Updates timestamps and creates initial achievements
- **Indexes** - Optimized for performance
- **Constraints** - Data validation and integrity

## 🔧 API Services

### SupabaseThirtyDayService

Located in `src/services/supabaseThirtyDayService.ts`, this service provides:

- Challenge CRUD operations
- Task management
- Progress tracking
- Achievement handling
- Analytics and reporting

### Key Methods

```typescript
// Challenge Management
createChallenge(userId: string): Promise<Challenge>
getChallenge(userId: string): Promise<Challenge | null>
updateChallenge(challengeId: string, updates: ChallengeUpdate): Promise<Challenge>

// Task Management
createDailyTasks(challengeId: string): Promise<void>
getDailyTasks(challengeId: string): Promise<DailyTask[]>
completeTask(taskId: string): Promise<DailyTask>

// Progress Tracking
getUserProgress(userId: string): Promise<UserProgress | null>
addPoints(userId: string, points: number): Promise<UserProgress>

// Achievements
getUserAchievements(userId: string): Promise<Achievement[]>
unlockAchievement(userId: string, achievementId: string): Promise<Achievement>
```

## 🔐 Authentication

### useAuth Hook

Located in `src/hooks/useAuth.ts`, provides:

```typescript
const { user, loading, signUp, signIn, signOut, resetPassword, isAuthenticated } = useAuth();
```

### Features

- Real-time auth state updates
- Session persistence
- Automatic user data loading
- Error handling

## 🎯 State Management

### Updated Zustand Store

The `thirtyDayChallengeStore` now includes:

- **Supabase Integration** - Automatic sync with backend
- **Authentication Awareness** - Works with and without auth
- **Offline Support** - Local storage fallback
- **Real-time Updates** - Live progress sync

### New Methods

```typescript
loadChallenge(userId: string): Promise<void>
syncWithBackend(userId: string): Promise<void>
```

## 📱 Frontend Integration

### Updated Components

1. **ThirtyDayRoadmapPage** - Now includes:
   - Authentication state management
   - Loading states
   - Error handling
   - Backend sync

2. **Authentication Flow** - Seamless integration with Supabase Auth

### Features

- **Progressive Enhancement** - Works offline, enhanced online
- **Real-time Sync** - Changes sync across devices
- **Error Recovery** - Graceful handling of network issues
- **Performance** - Optimized queries and caching

## 🚀 Deployment

### Production Checklist

1. **Environment Variables**
   - Set production Supabase URL and keys
   - Configure proper CORS settings
   - Set up proper domain restrictions

2. **Database**
   - Run production migrations
   - Set up proper backup strategies
   - Configure monitoring and alerts

3. **Security**
   - Review RLS policies
   - Set up proper rate limiting
   - Configure audit logging

4. **Performance**
   - Monitor query performance
   - Set up proper indexing
   - Configure caching strategies

## 🔍 Monitoring & Analytics

### Built-in Analytics

The service includes methods for:

- User engagement tracking
- Challenge completion rates
- Achievement unlock statistics
- Performance metrics

### Usage

```typescript
// Get user's challenge statistics
const stats = await supabaseThirtyDayService.getChallengeStats(userId);

// Get global statistics
const globalStats = await supabaseThirtyDayService.getGlobalStats();
```

## 🛠️ Development

### Local Development

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Backend Integration**
   - Navigate to `/30-day-roadmap`
   - Start a challenge
   - Complete tasks
   - Check Supabase dashboard for data

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure `.env` file is in root directory
   - Restart development server
   - Check for typos in variable names

2. **Database Connection Issues**
   - Verify Supabase URL and key
   - Check project status in dashboard
   - Ensure RLS policies are configured

3. **Authentication Issues**
   - Verify Supabase Auth is enabled
   - Check user permissions
   - Ensure proper session handling

4. **Data Sync Issues**
   - Check network connectivity
   - Verify user authentication status
   - Check browser console for errors

### Debug Tools

- **Supabase Dashboard** - Monitor queries and logs
- **Browser DevTools** - Check network requests
- **Console Logs** - Error messages and debugging info

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

## 🎉 Success!

Your backend is now fully configured! The 30-day privacy roadmap feature includes:

- ✅ Complete database schema
- ✅ Authentication integration
- ✅ Real-time data sync
- ✅ Offline support
- ✅ Achievement system
- ✅ Progress tracking
- ✅ Analytics and reporting

Users can now start challenges, complete tasks, earn achievements, and track their progress across all devices with full data persistence.
