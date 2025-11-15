import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Challenge = Database['public']['Tables']['privacy_thirty_day_challenges']['Row'];
type ChallengeInsert = Database['public']['Tables']['privacy_thirty_day_challenges']['Insert'];
type ChallengeUpdate = Database['public']['Tables']['privacy_thirty_day_challenges']['Update'];

type DailyTask = Database['public']['Tables']['privacy_daily_tasks']['Row'];
type DailyTaskInsert = Database['public']['Tables']['privacy_daily_tasks']['Insert'];
type UserProgress = Database['public']['Tables']['privacy_user_progress']['Row'];
type UserProgressInsert = Database['public']['Tables']['privacy_user_progress']['Insert'];
type UserProgressUpdate = Database['public']['Tables']['privacy_user_progress']['Update'];

type Achievement = Database['public']['Tables']['privacy_achievements']['Row'];
type AchievementInsert = Database['public']['Tables']['privacy_achievements']['Insert'];

export class SupabaseThirtyDayService {
  // Challenge Management
  async createChallenge(userId: string): Promise<Challenge> {
    const challengeData: ChallengeInsert = {
      user_id: userId,
      start_date: new Date().toISOString(),
      current_day: 1,
      completed_days: 0,
      streak: 0,
      total_points: 0,
      milestones: {
        day7: false,
        day14: false,
        day21: false,
        day30: false
      },
      achievements: {
        firstWeek: false,
        secondWeek: false,
        thirdWeek: false,
        privacyMaster: false,
        streakKeeper: false
      }
    };

    const { data, error } = await supabase
      .from('privacy_thirty_day_challenges')
      .insert(challengeData)
      .select()
      .single();

    if (error) throw error;

    // Create daily tasks for this challenge
    await this.createDailyTasks(data.id);

    return data;
  }

  async getChallenge(userId: string): Promise<Challenge | null> {
    const { data, error } = await supabase
      .from('privacy_thirty_day_challenges')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateChallenge(challengeId: string, updates: ChallengeUpdate): Promise<Challenge> {
    const { data, error } = await supabase
      .from('privacy_thirty_day_challenges')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', challengeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteChallenge(challengeId: string): Promise<void> {
    // Delete associated daily tasks first
    await supabase
      .from('privacy_daily_tasks')
      .delete()
      .eq('challenge_id', challengeId);

    // Delete the challenge
    const { error } = await supabase
      .from('privacy_thirty_day_challenges')
      .delete()
      .eq('id', challengeId);

    if (error) throw error;
  }

  // Daily Tasks Management
  async createDailyTasks(challengeId: string): Promise<void> {
    const tasks = this.generateDailyTasks();
    
    const tasksData: DailyTaskInsert[] = tasks.map(task => ({
      challenge_id: challengeId,
      day: task.day,
      title: task.title,
      description: task.description,
      category: task.category,
      difficulty: task.difficulty,
      estimated_time: task.estimatedTime,
      completed: false,
      resources: task.resources || null,
      tips: task.tips || null
    }));

    const { error } = await supabase
      .from('privacy_daily_tasks')
      .insert(tasksData);

    if (error) throw error;
  }

  async getDailyTasks(challengeId: string): Promise<DailyTask[]> {
    const { data, error } = await supabase
      .from('privacy_daily_tasks')
      .select('*')
      .eq('challenge_id', challengeId)
      .order('day');

    if (error) throw error;
    return data;
  }

  async getTasksForDay(challengeId: string, day: number): Promise<DailyTask[]> {
    const { data, error } = await supabase
      .from('privacy_daily_tasks')
      .select('*')
      .eq('challenge_id', challengeId)
      .eq('day', day);

    if (error) throw error;
    return data;
  }

  async completeTask(taskId: string): Promise<DailyTask> {
    const { data, error } = await supabase
      .from('privacy_daily_tasks')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getCompletedTasks(challengeId: string): Promise<DailyTask[]> {
    const { data, error } = await supabase
      .from('privacy_daily_tasks')
      .select('*')
      .eq('challenge_id', challengeId)
      .eq('completed', true)
      .order('day');

    if (error) throw error;
    return data;
  }

  // User Progress Management
  async getUserProgress(userId: string): Promise<UserProgress | null> {
    const { data, error } = await supabase
      .from('privacy_user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createUserProgress(userId: string): Promise<UserProgress> {
    const progressData: UserProgressInsert = {
      user_id: userId,
      total_points: 0,
      level: 1,
      current_level_points: 0,
      next_level_points: 100,
      streak: 0,
      assessment_count: 0,
      social_shares: 0,
      badges: []
    };

    const { data, error } = await supabase
      .from('privacy_user_progress')
      .insert(progressData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateUserProgress(userId: string, updates: UserProgressUpdate): Promise<UserProgress> {
    const { data, error } = await supabase
      .from('privacy_user_progress')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async addPoints(userId: string, points: number): Promise<UserProgress> {
    const currentProgress = await this.getUserProgress(userId);
    if (!currentProgress) {
      throw new Error('User progress not found');
    }

    const newTotalPoints = currentProgress.total_points + points;
    const level = Math.floor(newTotalPoints / 100) + 1;
    const currentLevelPoints = newTotalPoints % 100;
    const nextLevelPoints = 100;

    return this.updateUserProgress(userId, {
      total_points: newTotalPoints,
      level,
      current_level_points: currentLevelPoints,
      next_level_points: nextLevelPoints,
      last_activity_date: new Date().toISOString()
    });
  }

  // Achievements Management
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('privacy_achievements')
      .select('*')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async createAchievement(userId: string, achievementData: Omit<AchievementInsert, 'user_id'>): Promise<Achievement> {
    const { data, error } = await supabase
      .from('privacy_achievements')
      .insert({
        ...achievementData,
        user_id: userId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<Achievement> {
    const { data, error } = await supabase
      .from('privacy_achievements')
      .update({
        unlocked: true,
        unlocked_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Helper Methods
  private generateDailyTasks() {
    // This should match the tasks from the store
    return [
      // Week 1: Foundation
      {
        id: 'day-1-password-audit',
        day: 1,
        title: 'Audit Your Passwords',
        description: 'Review all your passwords and identify weak or reused ones',
        category: 'password',
        difficulty: 'medium',
        estimatedTime: '20 min',
        resources: [
          { title: 'Password Security Guide', url: '/resources/guides/password-management', type: 'guide' },
          { title: 'Password Manager Comparison', url: '/resources/tools/password-managers', type: 'tool' }
        ],
        tips: [
          'Start with your most important accounts (email, banking)',
          'Use a password manager to generate strong passwords',
          'Enable 2FA wherever possible'
        ]
      },
      {
        id: 'day-2-browser-cleanup',
        day: 2,
        title: 'Clean Up Your Browser',
        description: 'Remove unnecessary extensions, clear browsing data, and review permissions',
        category: 'browser',
        difficulty: 'easy',
        estimatedTime: '10 min',
        resources: [
          { title: 'Browser Privacy Settings', url: '/resources/guides/browser-privacy', type: 'guide' }
        ],
        tips: [
          'Remove extensions you no longer use',
          'Clear cookies and browsing history',
          'Review which sites can access your location, camera, etc.'
        ]
      },
      // Add more tasks as needed...
    ];
  }

  // Analytics and Reporting
  async getChallengeStats(userId: string): Promise<{
    totalChallenges: number;
    completedChallenges: number;
    averageCompletionRate: number;
    totalPointsEarned: number;
    longestStreak: number;
  }> {
    const { data: challenges, error: challengesError } = await supabase
      .from('privacy_thirty_day_challenges')
      .select('*')
      .eq('user_id', userId);

    if (challengesError) throw challengesError;

    const totalChallenges = challenges.length;
    const completedChallenges = challenges.filter(c => c.completed_days >= 30).length;
    const averageCompletionRate = totalChallenges > 0 
      ? challenges.reduce((sum, c) => sum + (c.completed_days / 30), 0) / totalChallenges 
      : 0;
    const totalPointsEarned = challenges.reduce((sum, c) => sum + c.total_points, 0);
    const longestStreak = Math.max(...challenges.map(c => c.streak), 0);

    return {
      totalChallenges,
      completedChallenges,
      averageCompletionRate,
      totalPointsEarned,
      longestStreak
    };
  }

  async getGlobalStats(): Promise<{
    totalUsers: number;
    activeChallenges: number;
    completedChallenges: number;
    averageCompletionRate: number;
  }> {
    const { data: challenges, error: challengesError } = await supabase
      .from('privacy_thirty_day_challenges')
      .select('*');

    if (challengesError) throw challengesError;

    const uniqueUsers = new Set(challenges.map(c => c.user_id)).size;
    const activeChallenges = challenges.filter(c => c.completed_days < 30).length;
    const completedChallenges = challenges.filter(c => c.completed_days >= 30).length;
    const averageCompletionRate = challenges.length > 0 
      ? challenges.reduce((sum, c) => sum + (c.completed_days / 30), 0) / challenges.length 
      : 0;

    return {
      totalUsers: uniqueUsers,
      activeChallenges,
      completedChallenges,
      averageCompletionRate
    };
  }
}

export const supabaseThirtyDayService = new SupabaseThirtyDayService();
