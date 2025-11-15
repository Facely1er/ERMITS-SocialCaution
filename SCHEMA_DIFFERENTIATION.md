# Database Schema Differentiation

## Overview

This document outlines the changes made to differentiate the database schema and avoid conflicts with other Supabase projects. All table names have been prefixed with `privacy_` to clearly identify them as belonging to the privacy protection platform.

## Changes Made

### 1. Table Name Changes

| Original Table Name | New Table Name | Purpose |
|---------------------|----------------|---------|
| `users` | `privacy_users` | User profiles and authentication data |
| `thirty_day_challenges` | `privacy_thirty_day_challenges` | 30-day privacy challenge tracking |
| `daily_tasks` | `privacy_daily_tasks` | Individual daily tasks within challenges |
| `user_progress` | `privacy_user_progress` | User progress and level tracking |
| `achievements` | `privacy_achievements` | User achievements and badges |

### 2. Updated Components

#### Database Schema Files
- **Migration**: `supabase/migrations/20250110000000_differentiate_schema_with_prefix.sql`
- **Main Schema**: `supabase-schema.sql` (updated with prefixed names)
- **TypeScript Types**: `src/lib/supabase.ts` (updated Database interface)

#### Application Code
- **Service Layer**: `src/services/supabaseThirtyDayService.ts` (all queries updated)
- **Backend Services**: 
  - `backend/src/services/SyncService.js` (sync operations updated)
  - `backend/src/services/SupabaseService.js` (health check updated)

### 3. Database Objects Updated

#### Tables
- All table names prefixed with `privacy_`
- All foreign key references updated
- All constraints and indexes renamed

#### Indexes
- `idx_privacy_thirty_day_challenges_user_id`
- `idx_privacy_thirty_day_challenges_start_date`
- `idx_privacy_daily_tasks_challenge_id`
- `idx_privacy_daily_tasks_day`
- `idx_privacy_daily_tasks_completed`
- `idx_privacy_user_progress_user_id`
- `idx_privacy_achievements_user_id`
- `idx_privacy_achievements_unlocked`

#### Triggers
- `update_privacy_users_updated_at`
- `update_privacy_thirty_day_challenges_updated_at`
- `update_privacy_daily_tasks_updated_at`
- `update_privacy_user_progress_updated_at`
- `update_privacy_achievements_updated_at`
- `create_initial_privacy_achievements_trigger`

#### Functions
- `create_initial_privacy_achievements()`
- `calculate_privacy_user_level()`
- `get_privacy_challenge_progress()`

#### Views
- `privacy_challenge_stats`

#### RLS Policies
All Row Level Security policies updated with new table names:
- `Privacy users can view own profile`
- `Privacy users can update own profile`
- `Privacy users can view own challenges`
- `Privacy users can create own challenges`
- `Privacy users can update own challenges`
- `Privacy users can delete own challenges`
- `Privacy users can view own daily tasks`
- `Privacy users can create own daily tasks`
- `Privacy users can update own daily tasks`
- `Privacy users can view own progress`
- `Privacy users can create own progress`
- `Privacy users can update own progress`
- `Privacy users can view own achievements`
- `Privacy users can create own achievements`
- `Privacy users can update own achievements`

## Migration Strategy

### For New Deployments
1. Run the migration: `supabase/migrations/20250110000000_differentiate_schema_with_prefix.sql`
2. The migration will create all tables with the `privacy_` prefix
3. No data migration needed for new deployments

### For Existing Deployments
1. The migration includes data migration logic
2. If old tables exist, data will be automatically migrated to new prefixed tables
3. Old tables can be dropped after confirming successful migration

## Benefits

### 1. Conflict Prevention
- Eliminates naming conflicts with other Supabase projects
- Clear identification of tables belonging to this specific project
- Prevents accidental data access or modification

### 2. Project Isolation
- Each project has its own clearly defined schema namespace
- Easier to manage multiple projects in the same Supabase instance
- Better organization and maintainability

### 3. Security
- All RLS policies updated to use new table names
- No security vulnerabilities introduced
- Maintains all existing access controls

### 4. Type Safety
- TypeScript types updated to reflect new schema
- Compile-time checking ensures correct table references
- Better developer experience with autocomplete

## Testing

### Verification Steps
1. **Schema Verification**: Confirm all tables exist with `privacy_` prefix
2. **Data Integrity**: Verify all foreign key relationships work correctly
3. **RLS Testing**: Test that users can only access their own data
4. **Application Testing**: Ensure all application features work with new schema
5. **Migration Testing**: Test data migration from old to new tables

### Test Queries
```sql
-- Verify table existence
SELECT table_name FROM information_schema.tables 
WHERE table_name LIKE 'privacy_%' AND table_schema = 'public';

-- Test RLS policies
SELECT * FROM privacy_users WHERE id = auth.uid();

-- Test foreign key relationships
SELECT c.*, dt.title 
FROM privacy_thirty_day_challenges c 
LEFT JOIN privacy_daily_tasks dt ON c.id = dt.challenge_id 
LIMIT 5;
```

## Rollback Plan

If rollback is needed:
1. Create a new migration to rename tables back to original names
2. Update all application code to use original table names
3. Update TypeScript types
4. Test thoroughly before deploying

## Maintenance

### Future Changes
- Always use the `privacy_` prefix for new tables
- Update this documentation when adding new database objects
- Ensure all new code references the prefixed table names

### Monitoring
- Monitor for any queries using old table names
- Check logs for migration errors
- Verify data consistency after migration

## Conclusion

The schema differentiation successfully isolates this project's database objects from other Supabase projects while maintaining all existing functionality and security measures. The `privacy_` prefix clearly identifies all database objects as belonging to the privacy protection platform, preventing conflicts and improving maintainability.