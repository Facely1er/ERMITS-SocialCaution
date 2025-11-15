import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'assessment' | 'action' | 'streak' | 'social' | 'security';
}

export interface UserProgress {
  totalPoints: number;
  level: number;
  currentLevelPoints: number;
  nextLevelPoints: number;
  streak: number;
  lastActivityDate: string | null;
  achievements: Achievement[];
  completedActions: string[];
  assessmentCount: number;
  socialShares: number;
  badges: string[];
}

export interface ProgressActions {
  addPoints: (points: number, source: string) => void;
  completeAction: (actionId: string) => void;
  completeAssessment: () => void;
  shareContent: () => void;
  checkAchievements: () => void;
  checkThirtyDayAchievements: (completedDays: number, hasStarted: boolean) => void;
  resetProgress: () => void;
  updateStreak: () => void;
}

const initialAchievements: Achievement[] = [
  {
    id: 'first-assessment',
    title: 'Privacy Explorer',
    description: 'Complete your first privacy assessment',
    icon: 'Search',
    points: 50,
    unlocked: false,
    category: 'assessment'
  },
  {
    id: 'assessment-master',
    title: 'Assessment Master',
    description: 'Complete 5 privacy assessments',
    icon: 'Trophy',
    points: 200,
    unlocked: false,
    category: 'assessment'
  },
  {
    id: 'action-hero',
    title: 'Action Hero',
    description: 'Complete your first action item',
    icon: 'Zap',
    points: 25,
    unlocked: false,
    category: 'action'
  },
  {
    id: 'action-champion',
    title: 'Action Champion',
    description: 'Complete 10 action items',
    icon: 'Award',
    points: 150,
    unlocked: false,
    category: 'action'
  },
  {
    id: 'streak-starter',
    title: 'Streak Starter',
    description: 'Maintain a 3-day activity streak',
    icon: 'Flame',
    points: 100,
    unlocked: false,
    category: 'streak'
  },
  {
    id: 'streak-master',
    title: 'Streak Master',
    description: 'Maintain a 7-day activity streak',
    icon: 'Star',
    points: 300,
    unlocked: false,
    category: 'streak'
  },
  {
    id: 'social-butterfly',
    title: 'Social Butterfly',
    description: 'Share your progress 5 times',
    icon: 'Share2',
    points: 75,
    unlocked: false,
    category: 'social'
  },
  {
    id: 'security-expert',
    title: 'Security Expert',
    description: 'Achieve a 90%+ privacy score',
    icon: 'Shield',
    points: 500,
    unlocked: false,
    category: 'security'
  },
  {
    id: '30day-challenge-starter',
    title: 'Privacy Protector',
    description: 'Start your 30-day privacy protection plan',
    icon: 'Calendar',
    points: 100,
    unlocked: false,
    category: 'action'
  },
  {
    id: '30day-week-one',
    title: 'Week One Warrior',
    description: 'Complete your first week of the 30-day plan',
    icon: 'Target',
    points: 200,
    unlocked: false,
    category: 'action'
  },
  {
    id: '30day-week-two',
    title: 'Week Two Champion',
    description: 'Complete your second week of the 30-day plan',
    icon: 'Medal',
    points: 300,
    unlocked: false,
    category: 'action'
  },
  {
    id: '30day-week-three',
    title: 'Week Three Master',
    description: 'Complete your third week of the 30-day plan',
    icon: 'Award',
    points: 400,
    unlocked: false,
    category: 'action'
  },
  {
    id: '30day-complete',
    title: 'Privacy Master',
    description: 'Complete all 30 days of the protection plan',
    icon: 'Crown',
    points: 1000,
    unlocked: false,
    category: 'security'
  }
];

const calculateLevel = (points: number): { level: number; currentLevelPoints: number; nextLevelPoints: number } => {
  const level = Math.floor(points / 100) + 1;
  const currentLevelPoints = points % 100;
  const nextLevelPoints = 100;
  return { level, currentLevelPoints, nextLevelPoints };
};

export const useProgressStore = create<UserProgress & ProgressActions>()(
  persist(
    (set, get) => ({
      totalPoints: 0,
      level: 1,
      currentLevelPoints: 0,
      nextLevelPoints: 100,
      streak: 0,
      lastActivityDate: null,
      achievements: initialAchievements,
      completedActions: [],
      assessmentCount: 0,
      socialShares: 0,
      badges: [],

      addPoints: (points: number, source: string) => {
        const state = get();
        const newTotalPoints = state.totalPoints + points;
        const { level, currentLevelPoints, nextLevelPoints } = calculateLevel(newTotalPoints);
        
        set({
          totalPoints: newTotalPoints,
          level,
          currentLevelPoints,
          nextLevelPoints,
          lastActivityDate: new Date().toISOString()
        });

        // Check for level up
        if (level > state.level) {
          // Trigger level up notification
          // Level up notification (commented out for production)
        }

        // Check achievements only if not called from checkAchievements itself
        // This prevents infinite recursion
        if (source !== 'achievement') {
          get().checkAchievements();
        }
      },

      completeAction: (actionId: string) => {
        const state = get();
        if (!state.completedActions.includes(actionId)) {
          set({
            completedActions: [...state.completedActions, actionId]
          });
          get().addPoints(25, 'action-completion');
        }
      },

      completeAssessment: () => {
        const state = get();
        const newAssessmentCount = state.assessmentCount + 1;
        set({
          assessmentCount: newAssessmentCount
        });
        get().addPoints(50, 'assessment-completion');
      },

      shareContent: () => {
        const state = get();
        const newSocialShares = state.socialShares + 1;
        set({
          socialShares: newSocialShares
        });
        get().addPoints(15, 'social-share');
      },

      checkAchievements: () => {
        const state = get();
        const achievementsToUnlock: Array<{ achievement: typeof state.achievements[0]; points: number }> = [];
        
        const updatedAchievements = state.achievements.map(achievement => {
          if (achievement.unlocked) return achievement;

          let shouldUnlock = false;

          switch (achievement.id) {
            case 'first-assessment':
              shouldUnlock = state.assessmentCount >= 1;
              break;
            case 'assessment-master':
              shouldUnlock = state.assessmentCount >= 5;
              break;
            case 'action-hero':
              shouldUnlock = state.completedActions.length >= 1;
              break;
            case 'action-champion':
              shouldUnlock = state.completedActions.length >= 10;
              break;
            case 'streak-starter':
              shouldUnlock = state.streak >= 3;
              break;
            case 'streak-master':
              shouldUnlock = state.streak >= 7;
              break;
            case 'social-butterfly':
              shouldUnlock = state.socialShares >= 5;
              break;
            case 'security-expert':
              // This would need to be checked when assessment results are available
              shouldUnlock = false;
              break;
            // 30-day challenge achievements are handled separately
            case '30day-challenge-starter':
            case '30day-week-one':
            case '30day-week-two':
            case '30day-week-three':
            case '30day-complete':
              shouldUnlock = false;
              break;
          }

          if (shouldUnlock) {
            achievementsToUnlock.push({ achievement, points: achievement.points });
            return {
              ...achievement,
              unlocked: true,
              unlockedAt: new Date().toISOString()
            };
          }

          return achievement;
        });

        set({ achievements: updatedAchievements });
        
        // Add points for all unlocked achievements after updating the state
        // This prevents recursion since we're not calling checkAchievements again
        achievementsToUnlock.forEach(({ points }) => {
          const currentState = get();
          const newTotalPoints = currentState.totalPoints + points;
          const { level, currentLevelPoints, nextLevelPoints } = calculateLevel(newTotalPoints);
          
          set({
            totalPoints: newTotalPoints,
            level,
            currentLevelPoints,
            nextLevelPoints,
            lastActivityDate: new Date().toISOString()
          });
        });
      },

      checkThirtyDayAchievements: (completedDays: number, hasStarted: boolean) => {
        const state = get();
        const updatedAchievements = state.achievements.map(achievement => {
          if (achievement.unlocked) return achievement;

          let shouldUnlock = false;

          switch (achievement.id) {
            case '30day-challenge-starter':
              shouldUnlock = hasStarted;
              break;
            case '30day-week-one':
              shouldUnlock = completedDays >= 7;
              break;
            case '30day-week-two':
              shouldUnlock = completedDays >= 14;
              break;
            case '30day-week-three':
              shouldUnlock = completedDays >= 21;
              break;
            case '30day-complete':
              shouldUnlock = completedDays >= 30;
              break;
          }

          if (shouldUnlock) {
            get().addPoints(achievement.points, '30day-achievement');
            return {
              ...achievement,
              unlocked: true,
              unlockedAt: new Date().toISOString()
            };
          }

          return achievement;
        });

        set({ achievements: updatedAchievements });
      },

      updateStreak: () => {
        const state = get();
        const today = new Date().toDateString();
        const lastActivity = state.lastActivityDate ? new Date(state.lastActivityDate).toDateString() : null;

        if (lastActivity === today) {
          // Already updated today
          return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();

        if (lastActivity === yesterdayString) {
          // Consecutive day
          set({ streak: state.streak + 1 });
        } else if (lastActivity !== today) {
          // Streak broken
          set({ streak: 1 });
        }

        set({ lastActivityDate: new Date().toISOString() });
      },

      resetProgress: () => {
        set({
          totalPoints: 0,
          level: 1,
          currentLevelPoints: 0,
          nextLevelPoints: 100,
          streak: 0,
          lastActivityDate: null,
          achievements: initialAchievements,
          completedActions: [],
          assessmentCount: 0,
          socialShares: 0,
          badges: []
        });
      }
    }),
    {
      name: 'social-caution-progress',
    }
  )
);