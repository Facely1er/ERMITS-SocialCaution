import { createClient } from '@supabase/supabase-js';

// Database types with privacy_ prefix to avoid conflicts with other Supabase projects
export interface Database {
  public: {
    Tables: {
      privacy_users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          created_at: string;
          updated_at: string;
          privacy_profile: any;
          preferences: any;
        };
        Insert: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          privacy_profile?: any;
          preferences?: any;
        };
        Update: {
          first_name?: string;
          last_name?: string;
          privacy_profile?: any;
          preferences?: any;
          updated_at?: string;
        };
      };
      privacy_thirty_day_challenges: {
        Row: {
          id: string;
          user_id: string;
          start_date: string;
          current_day: number;
          completed_days: number;
          streak: number;
          total_points: number;
          milestones: {
            day7: boolean;
            day14: boolean;
            day21: boolean;
            day30: boolean;
          };
          achievements: {
            firstWeek: boolean;
            secondWeek: boolean;
            thirdWeek: boolean;
            privacyMaster: boolean;
            streakKeeper: boolean;
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          start_date: string;
          current_day?: number;
          completed_days?: number;
          streak?: number;
          total_points?: number;
          milestones?: {
            day7: boolean;
            day14: boolean;
            day21: boolean;
            day30: boolean;
          };
          achievements?: {
            firstWeek: boolean;
            secondWeek: boolean;
            thirdWeek: boolean;
            privacyMaster: boolean;
            streakKeeper: boolean;
          };
        };
        Update: {
          current_day?: number;
          completed_days?: number;
          streak?: number;
          total_points?: number;
          milestones?: {
            day7: boolean;
            day14: boolean;
            day21: boolean;
            day30: boolean;
          };
          achievements?: {
            firstWeek: boolean;
            secondWeek: boolean;
            thirdWeek: boolean;
            privacyMaster: boolean;
            streakKeeper: boolean;
          };
          updated_at?: string;
        };
      };
      privacy_daily_tasks: {
        Row: {
          id: string;
          challenge_id: string;
          day: number;
          title: string;
          description: string;
          category: string;
          difficulty: string;
          estimated_time: string;
          completed: boolean;
          completed_at: string | null;
          resources: any;
          tips: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          day: number;
          title: string;
          description: string;
          category: string;
          difficulty: string;
          estimated_time: string;
          completed?: boolean;
          completed_at?: string | null;
          resources?: any;
          tips?: any;
        };
        Update: {
          completed?: boolean;
          completed_at?: string | null;
          updated_at?: string;
        };
      };
      privacy_user_progress: {
        Row: {
          id: string;
          user_id: string;
          total_points: number;
          level: number;
          current_level_points: number;
          next_level_points: number;
          streak: number;
          last_activity_date: string | null;
          assessment_count: number;
          social_shares: number;
          badges: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_points?: number;
          level?: number;
          current_level_points?: number;
          next_level_points?: number;
          streak?: number;
          last_activity_date?: string | null;
          assessment_count?: number;
          social_shares?: number;
          badges?: string[];
        };
        Update: {
          total_points?: number;
          level?: number;
          current_level_points?: number;
          next_level_points?: number;
          streak?: number;
          last_activity_date?: string | null;
          assessment_count?: number;
          social_shares?: number;
          badges?: string[];
          updated_at?: string;
        };
      };
      privacy_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          title: string;
          description: string;
          icon: string;
          points: number;
          category: string;
          unlocked: boolean;
          unlocked_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          title: string;
          description: string;
          icon: string;
          points: number;
          category: string;
          unlocked?: boolean;
          unlocked_at?: string | null;
        };
        Update: {
          unlocked?: boolean;
          unlocked_at?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      privacy_challenge_stats: {
        Row: {
          id: string;
          user_id: string;
          start_date: string;
          current_day: number;
          completed_days: number;
          streak: number;
          total_points: number;
          progress_percentage: number;
          total_tasks: number;
          completed_tasks: number;
        };
      };
    };
    Functions: {
      calculate_privacy_user_level: {
        Args: {
          total_points: number;
        };
        Returns: number;
      };
      get_privacy_challenge_progress: {
        Args: {
          challenge_id: string;
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single Supabase client instance to avoid multiple GoTrueClient instances
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
