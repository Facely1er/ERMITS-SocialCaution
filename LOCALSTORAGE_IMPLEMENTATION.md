# localStorage Implementation for User Accounts

This document describes the comprehensive localStorage-based user account system that enables full offline functionality for the SocialCaution application.

## Overview

The application now functions fully with localStorage for user accounts, assessments, preferences, and all user data. This enables:
- **Full offline functionality** - Users can use the app without internet connection
- **Data persistence** - All user data is stored locally and persists across sessions
- **No backend dependency** - The app works completely standalone with localStorage

## Architecture

### Core Components

1. **localStorageService** (`src/services/localStorageService.ts`)
   - Centralized service for all localStorage operations
   - Manages user accounts, assessments, action plans, notifications, and more
   - Provides CRUD operations for all user data

2. **AuthProvider** (`src/components/auth/AuthProvider.tsx`)
   - Updated to use localStorage instead of API calls
   - Handles login, registration, logout, and user refresh
   - Works completely offline

3. **useStore** (`src/store/useStore.ts`)
   - Zustand store integrated with localStorage service
   - Provides reactive state management with localStorage persistence

## Features

### User Account Management

- **Registration**: Create new user accounts stored in localStorage
- **Login**: Authenticate users from localStorage
- **User Profile**: Store and retrieve user profile data
- **Preferences**: Save user preferences (theme, language, notifications)
- **Privacy Profile**: Track privacy persona, risk level, and assessment scores

### Data Storage

All user data is stored in localStorage with the following structure:

```typescript
{
  user: LocalUser,                    // User account data
  assessments: AssessmentResult[],     // Assessment results
  actionPlan: ActionPlanItem[],       // Action plan items
  notifications: Notification[],      // User notifications
  digitalFootprint: any[],           // Digital footprint analysis
  dataBrokerRemovals: any[],         // Data broker removal requests
  personalDataInventory: any[],      // Personal data inventory
  challengeProgress: any,            // 30-day challenge progress
  preferences: any                   // User preferences
}
```

### Storage Keys

The following localStorage keys are used:

- `social-caution-user` - Current user account
- `social-caution-assessments` - All assessment results
- `social-caution-action-plan` - Action plan items
- `social-caution-notifications` - User notifications
- `social-caution-digital-footprint-{userId}` - Digital footprint data
- `social-caution-data-broker-removals-{userId}` - Data broker removals
- `social-caution-personal-data-inventory-{userId}` - Personal data inventory
- `social-caution-challenge-progress-{userId}` - Challenge progress
- `social-caution-preferences-{userId}` - User preferences
- `auth_token` - Authentication token

## Usage

### Authentication

```typescript
import { useAuth } from '../components/auth/AuthProvider';

const { login, register, logout, user } = useAuth();

// Register new user
await register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'password123'
});

// Login
await login('john@example.com', 'password123');

// Logout
await logout();
```

### User Data Management

```typescript
import localStorageService from '../services/localStorageService';

// Get current user
const user = localStorageService.getUser();

// Update user
const updatedUser = localStorageService.updateUser({
  firstName: 'Jane',
  preferences: { theme: 'dark' }
});

// Create assessment
const assessment = localStorageService.createAssessment(userId, 'exposure');

// Save assessment result
localStorageService.saveAssessment(assessment);

// Get user assessments
const assessments = localStorageService.getUserAssessments(userId);
```

### Store Integration

```typescript
import useStore from '../store/useStore';

const { user, setUser, updateUser } = useStore();

// Update user in store (automatically saves to localStorage)
updateUser({ firstName: 'Jane' });
```

## Security Considerations

⚠️ **Important**: The current implementation uses simple password hashing for demo purposes. In production:

1. **Password Hashing**: Use proper password hashing (bcrypt, argon2, etc.)
2. **Data Encryption**: Consider encrypting sensitive data in localStorage
3. **Token Management**: Implement proper JWT or session token management
4. **Data Validation**: Add input validation and sanitization
5. **Storage Limits**: Be aware of localStorage size limits (~5-10MB)

## Migration Notes

If migrating from API-based authentication:

1. Existing users will need to re-register (localStorage is browser-specific)
2. Data migration scripts may be needed if syncing with backend
3. Consider implementing data export/import functionality

## Benefits

✅ **Offline First**: App works without internet connection
✅ **Fast Performance**: No network latency for data operations
✅ **Privacy**: User data stays on their device
✅ **Cost Effective**: No backend infrastructure needed
✅ **Simple Deployment**: Static hosting is sufficient

## Limitations

⚠️ **Browser Specific**: Data is stored per browser/device
⚠️ **No Sync**: Data doesn't sync across devices
⚠️ **Storage Limits**: localStorage has size limitations
⚠️ **No Backup**: Data can be lost if browser data is cleared

## Future Enhancements

- [ ] Data export/import functionality
- [ ] Cloud sync option (optional)
- [ ] Data encryption for sensitive information
- [ ] Backup and restore functionality
- [ ] Multi-device sync (optional)

## Testing

To test the localStorage functionality:

1. Register a new user account
2. Complete an assessment
3. Create action plan items
4. Close and reopen the browser
5. Verify all data persists

## Support

For issues or questions about the localStorage implementation, refer to:
- `src/services/localStorageService.ts` - Main service implementation
- `src/components/auth/AuthProvider.tsx` - Authentication logic
- `src/store/useStore.ts` - State management

