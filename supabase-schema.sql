-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create privacy_users table (if not exists)
CREATE TABLE IF NOT EXISTS privacy_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  privacy_profile JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}'
);

-- Create privacy_thirty_day_challenges table
CREATE TABLE IF NOT EXISTS privacy_thirty_day_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES privacy_users(id) ON DELETE CASCADE,
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

-- Create privacy_daily_tasks table
CREATE TABLE IF NOT EXISTS privacy_daily_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES privacy_thirty_day_challenges(id) ON DELETE CASCADE,
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

-- Create privacy_user_progress table
CREATE TABLE IF NOT EXISTS privacy_user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES privacy_users(id) ON DELETE CASCADE,
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

-- Create privacy_achievements table
CREATE TABLE IF NOT EXISTS privacy_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES privacy_users(id) ON DELETE CASCADE,
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
CREATE INDEX IF NOT EXISTS idx_privacy_thirty_day_challenges_user_id ON privacy_thirty_day_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_privacy_thirty_day_challenges_start_date ON privacy_thirty_day_challenges(start_date);
CREATE INDEX IF NOT EXISTS idx_privacy_daily_tasks_challenge_id ON privacy_daily_tasks(challenge_id);
CREATE INDEX IF NOT EXISTS idx_privacy_daily_tasks_day ON privacy_daily_tasks(day);
CREATE INDEX IF NOT EXISTS idx_privacy_daily_tasks_completed ON privacy_daily_tasks(completed);
CREATE INDEX IF NOT EXISTS idx_privacy_user_progress_user_id ON privacy_user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_privacy_achievements_user_id ON privacy_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_privacy_achievements_unlocked ON privacy_achievements(unlocked);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_privacy_users_updated_at BEFORE UPDATE ON privacy_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_privacy_thirty_day_challenges_updated_at BEFORE UPDATE ON privacy_thirty_day_challenges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_privacy_daily_tasks_updated_at BEFORE UPDATE ON privacy_daily_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_privacy_user_progress_updated_at BEFORE UPDATE ON privacy_user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_privacy_achievements_updated_at BEFORE UPDATE ON privacy_achievements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE privacy_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE privacy_thirty_day_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE privacy_daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE privacy_user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE privacy_achievements ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Privacy users can view own profile" ON privacy_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Privacy users can update own profile" ON privacy_users
  FOR UPDATE USING (auth.uid() = id);

-- Thirty day challenges policies
CREATE POLICY "Privacy users can view own challenges" ON privacy_thirty_day_challenges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Privacy users can create own challenges" ON privacy_thirty_day_challenges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Privacy users can update own challenges" ON privacy_thirty_day_challenges
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Privacy users can delete own challenges" ON privacy_thirty_day_challenges
  FOR DELETE USING (auth.uid() = user_id);

-- Daily tasks policies
CREATE POLICY "Privacy users can view own daily tasks" ON privacy_daily_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM privacy_thirty_day_challenges 
      WHERE privacy_thirty_day_challenges.id = privacy_daily_tasks.challenge_id 
      AND privacy_thirty_day_challenges.user_id = auth.uid()
    )
  );

CREATE POLICY "Privacy users can create own daily tasks" ON privacy_daily_tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM privacy_thirty_day_challenges 
      WHERE privacy_thirty_day_challenges.id = privacy_daily_tasks.challenge_id 
      AND privacy_thirty_day_challenges.user_id = auth.uid()
    )
  );

CREATE POLICY "Privacy users can update own daily tasks" ON privacy_daily_tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM privacy_thirty_day_challenges 
      WHERE privacy_thirty_day_challenges.id = privacy_daily_tasks.challenge_id 
      AND privacy_thirty_day_challenges.user_id = auth.uid()
    )
  );

-- User progress policies
CREATE POLICY "Privacy users can view own progress" ON privacy_user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Privacy users can create own progress" ON privacy_user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Privacy users can update own progress" ON privacy_user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Privacy users can view own achievements" ON privacy_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Privacy users can create own achievements" ON privacy_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Privacy users can update own achievements" ON privacy_achievements
  FOR UPDATE USING (auth.uid() = user_id);

-- Insert initial achievements for new users
CREATE OR REPLACE FUNCTION create_initial_privacy_achievements()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO privacy_achievements (user_id, achievement_id, title, description, icon, points, category)
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
CREATE TRIGGER create_initial_privacy_achievements_trigger
  AFTER INSERT ON privacy_users
  FOR EACH ROW EXECUTE FUNCTION create_initial_privacy_achievements();

-- Create function to calculate user level
CREATE OR REPLACE FUNCTION calculate_privacy_user_level(total_points INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN FLOOR(total_points / 100) + 1;
END;
$$ language 'plpgsql';

-- Create function to get challenge progress percentage
CREATE OR REPLACE FUNCTION get_privacy_challenge_progress(challenge_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  completed_tasks INTEGER;
  total_tasks INTEGER := 30;
BEGIN
  SELECT COUNT(*) INTO completed_tasks
  FROM privacy_daily_tasks
  WHERE challenge_id = $1 AND completed = TRUE;
  
  RETURN ROUND((completed_tasks::DECIMAL / total_tasks) * 100, 2);
END;
$$ language 'plpgsql';

-- Create view for challenge statistics
CREATE OR REPLACE VIEW privacy_challenge_stats AS
SELECT 
  c.id,
  c.user_id,
  c.start_date,
  c.current_day,
  c.completed_days,
  c.streak,
  c.total_points,
  get_privacy_challenge_progress(c.id) as progress_percentage,
  COUNT(dt.id) as total_tasks,
  COUNT(CASE WHEN dt.completed THEN 1 END) as completed_tasks
FROM privacy_thirty_day_challenges c
LEFT JOIN privacy_daily_tasks dt ON c.id = dt.challenge_id
GROUP BY c.id, c.user_id, c.start_date, c.current_day, c.completed_days, c.streak, c.total_points;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
