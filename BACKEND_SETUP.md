# Backend Configuration for 30-Day Privacy Roadmap

This project uses Supabase as the backend service for the 30-day privacy roadmap feature.

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://snrpdosiuwmdaegxkqux.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNucnBkb3NpdXdtZGFlZ3hrcXV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTA5MTYsImV4cCI6MjA3NDc4NjkxNn0.tl_ipfmxSwMNLBQ-QeqQPyp_w6xvocTtXqaFGHHFwe0

# Optional: For development with local backend
VITE_API_URL=http://localhost:5000/api
```

### 2. Database Setup

Run the SQL schema in your Supabase project:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Execute the SQL to create all necessary tables, indexes, and policies

### 3. Database Schema

The backend includes the following tables:

- **users**: User profiles and preferences
- **thirty_day_challenges**: Challenge instances for each user
- **daily_tasks**: Individual tasks for each challenge
- **user_progress**: User progress tracking and points
- **achievements**: User achievements and badges

### 4. Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:
- Users can only access their own data
- Proper authentication is required
- Data isolation between users

### 5. Features Included

- **Challenge Management**: Create, update, and track 30-day challenges
- **Task Management**: Daily task creation, completion, and tracking
- **Progress Tracking**: Points, levels, streaks, and milestones
- **Achievements System**: Badges and achievements for motivation
- **Analytics**: Challenge statistics and user insights
- **Real-time Updates**: Live progress updates across devices

### 6. API Service

The `SupabaseThirtyDayService` class provides methods for:

- Challenge CRUD operations
- Task management
- Progress tracking
- Achievement handling
- Analytics and reporting

### 7. Integration with Frontend

The Zustand store (`thirtyDayChallengeStore`) automatically syncs with Supabase:

- Local state for immediate UI updates
- Background sync with Supabase for persistence
- Offline support with local storage fallback
- Real-time updates when user is authenticated

### 8. Authentication

The system integrates with Supabase Auth:

- Automatic user identification
- Secure data access
- Session management
- Anonymous usage support

### 9. Development

To test the backend integration:

1. Ensure environment variables are set
2. Start the development server: `npm run dev`
3. Navigate to the 30-day roadmap page
4. Start a challenge to test database operations

### 10. Production Considerations

- Monitor database performance
- Set up proper backup strategies
- Configure rate limiting if needed
- Monitor usage and costs
- Set up proper error logging

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure `.env` file is in the root directory
   - Restart the development server after changes
   - Check for typos in variable names

2. **Database Connection Issues**
   - Verify Supabase URL and key are correct
   - Check Supabase project status
   - Ensure RLS policies are properly configured

3. **Authentication Issues**
   - Verify Supabase Auth is enabled
   - Check user permissions
   - Ensure proper session handling

4. **Data Sync Issues**
   - Check network connectivity
   - Verify user authentication status
   - Check browser console for errors

### Support

For issues with the backend configuration, check:
- Supabase documentation
- Browser developer console
- Network tab for API calls
- Supabase dashboard logs
