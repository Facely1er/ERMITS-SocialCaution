/*
  # Initial Database Schema Setup for Social Caution Platform
  
  ## Overview
  Complete database schema for the Social Caution privacy protection platform including user management, 30-day challenges, progress tracking, and achievements system.
  
  ## New Tables
  
  ### 1. users
  - `id` (uuid, primary key) - Unique user identifier
  - `email` (varchar, unique) - User email address
  - `first_name` (varchar) - User first name
  - `last_name` (varchar) - User last name
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `privacy_profile` (jsonb) - User privacy preferences and settings
  - `preferences` (jsonb) - User application preferences
  
  ### 2. thirty_day_challenges
  - `id` (uuid, primary key) - Challenge identifier
  - `user_id` (uuid, foreign key) - Reference to users table
  - `start_date` (timestamptz) - Challenge start date
  - `current_day` (integer) - Current day in challenge (1-30)
  - `completed_days` (integer) - Number of completed days
  - `streak` (integer) - Current completion streak
  - `total_points` (integer) - Total points earned
  - `milestones` (jsonb) - Milestone completion status
  - `achievements` (jsonb) - Challenge-specific achievements
  - `created_at`, `updated_at` (timestamptz) - Timestamps
  
  ### 3. daily_tasks
  - `id` (uuid, primary key) - Task identifier
  - `challenge_id` (uuid, foreign key) - Reference to thirty_day_challenges
  - `day` (integer) - Day number (1-30)
  - `title` (varchar) - Task title
  - `description` (text) - Task description
  - `category` (varchar) - Task category (password, browser, social, etc.)
  - `difficulty` (varchar) - Task difficulty (easy, medium, hard)
  - `estimated_time` (varchar) - Estimated completion time
  - `completed` (boolean) - Completion status
  - `completed_at` (timestamptz) - Completion timestamp
  - `resources` (jsonb) - Related resources
  - `tips` (jsonb) - Task tips and hints
  - `created_at`, `updated_at` (timestamptz) - Timestamps
  
  ### 4. user_progress
  - `id` (uuid, primary key) - Progress record identifier
  - `user_id` (uuid, foreign key) - Reference to users table
  - `total_points` (integer) - Total points earned
  - `level` (integer) - User level
  - `current_level_points` (integer) - Points in current level
  - `next_level_points` (integer) - Points needed for next level
  - `streak` (integer) - Activity streak
  - `last_activity_date` (timestamptz) - Last activity timestamp
  - `assessment_count` (integer) - Number of assessments completed
  - `social_shares` (integer) - Number of social shares
  - `badges` (text array) - Earned badges
  - `created_at`, `updated_at` (timestamptz) - Timestamps
  
  ### 5. achievements
  - `id` (uuid, primary key) - Achievement record identifier
  - `user_id` (uuid, foreign key) - Reference to users table
  - `achievement_id` (varchar) - Achievement type identifier
  - `title` (varchar) - Achievement title
  - `description` (text) - Achievement description
  - `icon` (varchar) - Achievement icon
  - `points` (integer) - Points awarded
  - `category` (varchar) - Achievement category
  - `unlocked` (boolean) - Unlock status
  - `unlocked_at` (timestamptz) - Unlock timestamp
  - `created_at`, `updated_at` (timestamptz) - Timestamps
  
  ## Security
  
  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Users can only access their own data
  - Authentication required for all operations
  - Proper foreign key constraints ensure data integrity
  
  ### Policies Created
  - Users: SELECT and UPDATE own profile
  - Challenges: Full CRUD for own challenges
  - Daily Tasks: CRUD operations via challenge ownership
  - User Progress: SELECT, INSERT, UPDATE for own progress
  - Achievements: SELECT, INSERT, UPDATE for own achievements
  
  ## Indexes
  - Performance indexes on user_id fields
  - Indexes on frequently queried fields (start_date, day, completed, unlocked)
  
  ## Triggers
  - Auto-update `updated_at` on all tables
  - Auto-create initial achievements for new users
  
  ## Functions
  - `update_updated_at_column()` - Updates timestamp on row changes
  - `create_initial_achievements()` - Creates default achievements for new users
  - `calculate_user_level()` - Calculates user level from total points
  - `get_challenge_progress()` - Calculates challenge completion percentage
  
  ## Views
  - `challenge_stats` - Aggregated challenge statistics and progress
  
  ## Notes
  - All timestamps use timezone-aware types
  - JSONB used for flexible schema fields
  - Check constraints ensure data validity
  - Unique constraints prevent duplicate records
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  privacy_profile JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}'
);

-- Create thirty_day_challenges table
CREATE TABLE IF NOT EXISTS thirty_day_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  current_day INTEGER DEFAULT 1 CHECK (current_day >= 1 AND current_day <= 30),
  completed_days INTEGER DEFAULT 0 CHECK (completed_days >= 0 AND completed_days <= 30),
  streak INTEGER DEFAULT 0 CHECK (streak >= 0),
  total_points INTEGER DEFAULT 0 CHECK (total_points >= 0),
  milestones JSONB DEFAULT '{
    "day7": false,
    "day14": false,
    "day21": false,
    "day30": false
  }',
  achievements JSONB DEFAULT '{
    "firstWeek": false,
    "secondWeek": false,
    "thirdWeek": false,
    "privacyMaster": false,
    "streakKeeper": false
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_tasks table
CREATE TABLE IF NOT EXISTS daily_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES thirty_day_challenges(id) ON DELETE CASCADE,
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 30),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('password', 'browser', 'social', 'device', 'data', 'privacy-settings', 'education', 'tools')),
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  estimated_time VARCHAR(20) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  resources JSONB DEFAULT NULL,
  tips JSONB DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(challenge_id, day, title)
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0 CHECK (total_points >= 0),
  level INTEGER DEFAULT 1 CHECK (level >= 1),
  current_level_points INTEGER DEFAULT 0 CHECK (current_level_points >= 0),
  next_level_points INTEGER DEFAULT 100 CHECK (next_level_points >= 0),
  streak INTEGER DEFAULT 0 CHECK (streak >= 0),
  last_activity_date TIMESTAMP WITH TIME ZONE,
  assessment_count INTEGER DEFAULT 0 CHECK (assessment_count >= 0),
  social_shares INTEGER DEFAULT 0 CHECK (social_shares >= 0),
  badges TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(10) NOT NULL,
  points INTEGER NOT NULL CHECK (points >= 0),
  category VARCHAR(50) NOT NULL CHECK (category IN ('assessment', 'action', 'streak', 'social', 'security')),
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_thirty_day_challenges_user_id ON thirty_day_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_thirty_day_challenges_start_date ON thirty_day_challenges(start_date);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_challenge_id ON daily_tasks(challenge_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_day ON daily_tasks(day);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_completed ON daily_tasks(completed);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_unlocked ON achievements(unlocked);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_thirty_day_challenges_updated_at ON thirty_day_challenges;
CREATE TRIGGER update_thirty_day_challenges_updated_at BEFORE UPDATE ON thirty_day_challenges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_daily_tasks_updated_at ON daily_tasks;
CREATE TRIGGER update_daily_tasks_updated_at BEFORE UPDATE ON daily_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_achievements_updated_at ON achievements;
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE thirty_day_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Thirty day challenges policies
DROP POLICY IF EXISTS "Users can view own challenges" ON thirty_day_challenges;
CREATE POLICY "Users can view own challenges" ON thirty_day_challenges
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own challenges" ON thirty_day_challenges;
CREATE POLICY "Users can create own challenges" ON thirty_day_challenges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own challenges" ON thirty_day_challenges;
CREATE POLICY "Users can update own challenges" ON thirty_day_challenges
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own challenges" ON thirty_day_challenges;
CREATE POLICY "Users can delete own challenges" ON thirty_day_challenges
  FOR DELETE USING (auth.uid() = user_id);

-- Daily tasks policies
DROP POLICY IF EXISTS "Users can view own daily tasks" ON daily_tasks;
CREATE POLICY "Users can view own daily tasks" ON daily_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM thirty_day_challenges 
      WHERE thirty_day_challenges.id = daily_tasks.challenge_id 
      AND thirty_day_challenges.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create own daily tasks" ON daily_tasks;
CREATE POLICY "Users can create own daily tasks" ON daily_tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM thirty_day_challenges 
      WHERE thirty_day_challenges.id = daily_tasks.challenge_id 
      AND thirty_day_challenges.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own daily tasks" ON daily_tasks;
CREATE POLICY "Users can update own daily tasks" ON daily_tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM thirty_day_challenges 
      WHERE thirty_day_challenges.id = daily_tasks.challenge_id 
      AND thirty_day_challenges.user_id = auth.uid()
    )
  );

-- User progress policies
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own progress" ON user_progress;
CREATE POLICY "Users can create own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Achievements policies
DROP POLICY IF EXISTS "Users can view own achievements" ON achievements;
CREATE POLICY "Users can view own achievements" ON achievements
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own achievements" ON achievements;
CREATE POLICY "Users can create own achievements" ON achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own achievements" ON achievements;
CREATE POLICY "Users can update own achievements" ON achievements
  FOR UPDATE USING (auth.uid() = user_id);

-- Insert initial achievements for new users
CREATE OR REPLACE FUNCTION create_initial_achievements()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO achievements (user_id, achievement_id, title, description, icon, points, category)
  VALUES
    (NEW.id, 'first-assessment', 'Privacy Explorer', 'Complete your first privacy assessment', '🔍', 50, 'assessment'),
    (NEW.id, 'assessment-master', 'Assessment Master', 'Complete 5 privacy assessments', '🏆', 200, 'assessment'),
    (NEW.id, 'action-hero', 'Action Hero', 'Complete your first action item', '⚡', 25, 'action'),
    (NEW.id, 'action-champion', 'Action Champion', 'Complete 10 action items', '💪', 150, 'action'),
    (NEW.id, 'streak-starter', 'Streak Starter', 'Maintain a 3-day activity streak', '🔥', 100, 'streak'),
    (NEW.id, 'streak-master', 'Streak Master', 'Maintain a 7-day activity streak', '🌟', 300, 'streak'),
    (NEW.id, 'social-butterfly', 'Social Butterfly', 'Share your progress 5 times', '🦋', 75, 'social'),
    (NEW.id, 'security-expert', 'Security Expert', 'Achieve a 90%+ privacy score', '🛡️', 500, 'security'),
    (NEW.id, '30day-challenge-starter', 'Privacy Protector', 'Start your 30-day privacy protection plan', '📅', 100, 'action'),
    (NEW.id, '30day-week-one', 'Week One Warrior', 'Complete your first week of the 30-day plan', '🎯', 200, 'action'),
    (NEW.id, '30day-week-two', 'Week Two Champion', 'Complete your second week of the 30-day plan', '🏅', 300, 'action'),
    (NEW.id, '30day-week-three', 'Week Three Master', 'Complete your third week of the 30-day plan', '🥇', 400, 'action'),
    (NEW.id, '30day-complete', 'Privacy Master', 'Complete all 30 days of the protection plan', '👑', 1000, 'security');
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to create initial achievements when a user is created
DROP TRIGGER IF EXISTS create_initial_achievements_trigger ON users;
CREATE TRIGGER create_initial_achievements_trigger
  AFTER INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION create_initial_achievements();

-- Create function to calculate user level
CREATE OR REPLACE FUNCTION calculate_user_level(total_points INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN FLOOR(total_points / 100) + 1;
END;
$$ language 'plpgsql';

-- Create function to get challenge progress percentage
CREATE OR REPLACE FUNCTION get_challenge_progress(challenge_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  completed_tasks INTEGER;
  total_tasks INTEGER := 30;
BEGIN
  SELECT COUNT(*) INTO completed_tasks
  FROM daily_tasks
  WHERE challenge_id = $1 AND completed = TRUE;
  
  RETURN ROUND((completed_tasks::DECIMAL / total_tasks) * 100, 2);
END;
$$ language 'plpgsql';

-- Create view for challenge statistics
CREATE OR REPLACE VIEW challenge_stats AS
SELECT 
  c.id,
  c.user_id,
  c.start_date,
  c.current_day,
  c.completed_days,
  c.streak,
  c.total_points,
  get_challenge_progress(c.id) as progress_percentage,
  COUNT(dt.id) as total_tasks,
  COUNT(CASE WHEN dt.completed THEN 1 END) as completed_tasks
FROM thirty_day_challenges c
LEFT JOIN daily_tasks dt ON c.id = dt.challenge_id
GROUP BY c.id, c.user_id, c.start_date, c.current_day, c.completed_days, c.streak, c.total_points;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;