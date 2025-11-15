import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabaseThirtyDayService } from '../services/supabaseThirtyDayService';
import { supabase } from '../lib/supabase';
// Lazy import to prevent circular dependency and initialization order issues
// Import useProgressStore dynamically inside the function where it's used

export interface DailyTask {
  id: string;
  day: number;
  title: string;
  description: string;
  category: 'password' | 'browser' | 'social' | 'device' | 'data' | 'privacy-settings' | 'education' | 'tools';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string; // e.g., "5 min", "15 min", "30 min"
  completed: boolean;
  completedAt?: string;
  resources?: {
    title: string;
    url: string;
    type: 'guide' | 'tool' | 'article' | 'video';
  }[];
  tips?: string[];
}

export interface ChallengeProgress {
  startDate: string | null;
  currentDay: number;
  completedDays: number;
  streak: number;
  totalPoints: number;
  dailyTasks: DailyTask[];
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
}

export interface ChallengeActions {
  startChallenge: () => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  resetChallenge: () => Promise<void>;
  getCurrentDayTasks: () => DailyTask[];
  getProgressPercentage: () => number;
  getStreakDays: () => number;
  checkMilestones: () => void;
  checkAchievements: () => void;
  loadChallenge: (userId: string) => Promise<void>;
  syncWithBackend: (userId: string) => Promise<void>;
}

// Generate 30 days of privacy tasks
const generateDailyTasks = (): DailyTask[] => {
  const tasks: DailyTask[] = [
    // Week 1: Foundation
    {
      id: 'day-1-password-audit',
      day: 1,
      title: 'Audit Your Passwords',
      description: 'Review all your passwords and identify weak or reused ones',
      category: 'password',
      difficulty: 'medium',
      estimatedTime: '20 min',
      completed: false,
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
      completed: false,
      resources: [
        { title: 'Browser Privacy Settings', url: '/resources/guides/browser-privacy', type: 'guide' }
      ],
      tips: [
        'Remove extensions you no longer use',
        'Clear cookies and browsing history',
        'Review which sites can access your location, camera, etc.'
      ]
    },
    {
      id: 'day-3-social-privacy-check',
      day: 3,
      title: 'Review Social Media Privacy',
      description: 'Check and update privacy settings on your social media accounts',
      category: 'social',
      difficulty: 'medium',
      estimatedTime: '15 min',
      completed: false,
      resources: [
        { title: 'Social Media Privacy Guide', url: '/resources/guides/social-media-privacy', type: 'guide' }
      ],
      tips: [
        'Make your profile private where possible',
        'Review who can see your posts',
        'Check app permissions and third-party access'
      ]
    },
    {
      id: 'day-4-device-permissions',
      day: 4,
      title: 'Review Device Permissions',
      description: 'Audit app permissions on your phone and computer',
      category: 'device',
      difficulty: 'easy',
      estimatedTime: '15 min',
      completed: false,
      resources: [
        { title: 'Mobile Privacy Settings', url: '/resources/guides/mobile-privacy', type: 'guide' }
      ],
      tips: [
        'Remove unnecessary location permissions',
        'Review camera and microphone access',
        'Check which apps can access your contacts'
      ]
    },
    {
      id: 'day-5-two-factor-setup',
      day: 5,
      title: 'Enable Two-Factor Authentication',
      description: 'Set up 2FA on your most important accounts',
      category: 'password',
      difficulty: 'medium',
      estimatedTime: '25 min',
      completed: false,
      resources: [
        { title: '2FA Setup Guide', url: '/resources/guides/two-factor-authentication', type: 'guide' }
      ],
      tips: [
        'Start with email, banking, and social media',
        'Use an authenticator app instead of SMS when possible',
        'Save backup codes in a secure place'
      ]
    },
    {
      id: 'day-6-data-inventory',
      day: 6,
      title: 'Create Personal Data Inventory',
      description: 'List all the personal data you share online',
      category: 'data',
      difficulty: 'hard',
      estimatedTime: '30 min',
      completed: false,
      resources: [
        { title: 'Personal Data Inventory Tool', url: '/resources/tools/personal-data-inventory', type: 'tool' }
      ],
      tips: [
        'Include social media, shopping sites, apps',
        'Note what data each service collects',
        'Consider which data sharing is necessary'
      ]
    },
    {
      id: 'day-7-privacy-policy-review',
      day: 7,
      title: 'Review Privacy Policies',
      description: 'Read privacy policies of your most-used services',
      category: 'education',
      difficulty: 'hard',
      estimatedTime: '20 min',
      completed: false,
      resources: [
        { title: 'Understanding Privacy Policies', url: '/resources/guides/privacy-policies', type: 'guide' }
      ],
      tips: [
        'Focus on data collection and sharing sections',
        'Look for opt-out options',
        'Note any concerning data practices'
      ]
    },

    // Week 2: Advanced Protection
    {
      id: 'day-8-vpn-setup',
      day: 8,
      title: 'Set Up VPN',
      description: 'Install and configure a VPN for secure browsing',
      category: 'tools',
      difficulty: 'medium',
      estimatedTime: '15 min',
      completed: false,
      resources: [
        { title: 'VPN Setup Guide', url: '/resources/guides/vpn-setup', type: 'guide' }
      ],
      tips: [
        'Choose a reputable VPN provider',
        'Enable VPN for public WiFi',
        'Test your IP address before and after'
      ]
    },
    {
      id: 'day-9-ad-blocker',
      day: 9,
      title: 'Install Ad Blocker',
      description: 'Set up ad blocking to reduce tracking',
      category: 'browser',
      difficulty: 'easy',
      estimatedTime: '10 min',
      completed: false,
      resources: [
        { title: 'Ad Blocker Guide', url: '/resources/guides/ad-blocking', type: 'guide' }
      ],
      tips: [
        'Use uBlock Origin or similar',
        'Configure custom filter lists',
        'Test on various websites'
      ]
    },
    {
      id: 'day-10-data-broker-removal',
      day: 10,
      title: 'Remove Data from Brokers',
      description: 'Start removing your data from data broker sites',
      category: 'data',
      difficulty: 'hard',
      estimatedTime: '45 min',
      completed: false,
      resources: [
        { title: 'Data Broker Removal Tool', url: '/resources/tools/data-broker-removal', type: 'tool' }
      ],
      tips: [
        'Start with the biggest brokers first',
        'Keep records of your requests',
        'Follow up if removal is denied'
      ]
    },
    {
      id: 'day-11-privacy-focused-search',
      day: 11,
      title: 'Switch to Privacy Search',
      description: 'Change your default search engine to a privacy-focused one',
      category: 'browser',
      difficulty: 'easy',
      estimatedTime: '5 min',
      completed: false,
      resources: [
        { title: 'Privacy Search Engines', url: '/resources/guides/privacy-search', type: 'guide' }
      ],
      tips: [
        'Try DuckDuckGo or Startpage',
        'Update all your browsers',
        'Test search quality vs Google'
      ]
    },
    {
      id: 'day-12-app-permissions-cleanup',
      day: 12,
      title: 'Clean Up App Permissions',
      description: 'Remove unnecessary permissions from mobile apps',
      category: 'device',
      difficulty: 'medium',
      estimatedTime: '20 min',
      completed: false,
      resources: [
        { title: 'App Permission Guide', url: '/resources/guides/app-permissions', type: 'guide' }
      ],
      tips: [
        'Review each app individually',
        'Remove location access from non-essential apps',
        'Check background app refresh settings'
      ]
    },
    {
      id: 'day-13-privacy-browser',
      day: 13,
      title: 'Try Privacy Browser',
      description: 'Test a privacy-focused browser like Firefox or Brave',
      category: 'browser',
      difficulty: 'medium',
      estimatedTime: '15 min',
      completed: false,
      resources: [
        { title: 'Privacy Browser Comparison', url: '/resources/guides/privacy-browsers', type: 'guide' }
      ],
      tips: [
        'Try Firefox with privacy settings',
        'Test Brave browser',
        'Compare tracking protection'
      ]
    },
    {
      id: 'day-14-digital-detox',
      day: 14,
      title: 'Digital Detox Day',
      description: 'Take a break from social media and track your usage',
      category: 'education',
      difficulty: 'hard',
      estimatedTime: 'All day',
      completed: false,
      resources: [
        { title: 'Digital Wellness Guide', url: '/resources/guides/digital-wellness', type: 'guide' }
      ],
      tips: [
        'Delete social media apps temporarily',
        'Use screen time tracking',
        'Focus on offline activities'
      ]
    },

    // Week 3: Deep Dive
    {
      id: 'day-15-email-privacy',
      day: 15,
      title: 'Secure Your Email',
      description: 'Set up email encryption and secure practices',
      category: 'privacy-settings',
      difficulty: 'hard',
      estimatedTime: '30 min',
      completed: false,
      resources: [
        { title: 'Email Security Guide', url: '/resources/guides/email-security', type: 'guide' }
      ],
      tips: [
        'Enable PGP encryption if possible',
        'Use aliases for different purposes',
        'Review email forwarding rules'
      ]
    },
    {
      id: 'day-16-cloud-backup-review',
      day: 16,
      title: 'Review Cloud Backups',
      description: 'Audit what you store in cloud services',
      category: 'data',
      difficulty: 'medium',
      estimatedTime: '20 min',
      completed: false,
      resources: [
        { title: 'Cloud Storage Privacy', url: '/resources/guides/cloud-privacy', type: 'guide' }
      ],
      tips: [
        'Review what files are synced',
        'Enable encryption for sensitive files',
        'Consider local backup alternatives'
      ]
    },
    {
      id: 'day-17-smart-home-privacy',
      day: 17,
      title: 'Smart Home Privacy Check',
      description: 'Review privacy settings on smart home devices',
      category: 'device',
      difficulty: 'medium',
      estimatedTime: '25 min',
      completed: false,
      resources: [
        { title: 'Smart Home Privacy', url: '/resources/guides/smart-home-privacy', type: 'guide' }
      ],
      tips: [
        'Disable unnecessary data collection',
        'Review voice recording settings',
        'Update device firmware'
      ]
    },
    {
      id: 'day-18-privacy-laws-research',
      day: 18,
      title: 'Learn Privacy Laws',
      description: 'Research privacy laws that protect you',
      category: 'education',
      difficulty: 'medium',
      estimatedTime: '20 min',
      completed: false,
      resources: [
        { title: 'Privacy Laws Overview', url: '/privacy-laws', type: 'guide' },
        { title: 'GDPR Guide', url: '/privacy-laws/gdpr', type: 'guide' }
      ],
      tips: [
        'Learn about GDPR if you\'re in EU',
        'Understand CCPA if you\'re in California',
        'Know your rights to data deletion'
      ]
    },
    {
      id: 'day-19-password-manager-advanced',
      day: 19,
      title: 'Advanced Password Manager',
      description: 'Set up advanced password manager features',
      category: 'password',
      difficulty: 'medium',
      estimatedTime: '20 min',
      completed: false,
      resources: [
        { title: 'Advanced Password Management', url: '/resources/guides/advanced-passwords', type: 'guide' }
      ],
      tips: [
        'Set up password sharing for family',
        'Configure emergency access',
        'Enable breach monitoring'
      ]
    },
    {
      id: 'day-20-social-media-audit',
      day: 20,
      title: 'Deep Social Media Audit',
      description: 'Comprehensive review of all social media accounts',
      category: 'social',
      difficulty: 'hard',
      estimatedTime: '40 min',
      completed: false,
      resources: [
        { title: 'Social Media Audit Checklist', url: '/resources/checklists/social-media-audit', type: 'guide' }
      ],
      tips: [
        'Review old posts and photos',
        'Check tagged content',
        'Audit friend/follower lists'
      ]
    },
    {
      id: 'day-21-privacy-tools-exploration',
      day: 21,
      title: 'Explore Privacy Tools',
      description: 'Try additional privacy tools and services',
      category: 'tools',
      difficulty: 'medium',
      estimatedTime: '30 min',
      completed: false,
      resources: [
        { title: 'Privacy Tools Directory', url: '/resources/tools', type: 'tool' }
      ],
      tips: [
        'Try encrypted messaging apps',
        'Test privacy-focused email services',
        'Explore decentralized alternatives'
      ]
    },

    // Week 4: Mastery
    {
      id: 'day-22-data-portability',
      day: 22,
      title: 'Exercise Data Portability',
      description: 'Download your data from major services',
      category: 'data',
      difficulty: 'medium',
      estimatedTime: '25 min',
      completed: false,
      resources: [
        { title: 'Data Portability Guide', url: '/resources/guides/data-portability', type: 'guide' }
      ],
      tips: [
        'Download data from Google, Facebook, etc.',
        'Review what data they have',
        'Consider deleting unnecessary data'
      ]
    },
    {
      id: 'day-23-privacy-monitoring',
      day: 23,
      title: 'Set Up Privacy Monitoring',
      description: 'Configure tools to monitor your privacy',
      category: 'tools',
      difficulty: 'hard',
      estimatedTime: '35 min',
      completed: false,
      resources: [
        { title: 'Privacy Monitoring Tools', url: '/resources/tools/privacy-monitoring', type: 'tool' }
      ],
      tips: [
        'Set up breach notifications',
        'Monitor data broker listings',
        'Track privacy policy changes'
      ]
    },
    {
      id: 'day-24-family-privacy',
      day: 24,
      title: 'Family Privacy Discussion',
      description: 'Discuss privacy with family members',
      category: 'education',
      difficulty: 'medium',
      estimatedTime: '30 min',
      completed: false,
      resources: [
        { title: 'Family Privacy Guide', url: '/resources/guides/family-privacy', type: 'guide' }
      ],
      tips: [
        'Share privacy best practices',
        'Set up family password manager',
        'Discuss online safety for children'
      ]
    },
    {
      id: 'day-25-privacy-automation',
      day: 25,
      title: 'Automate Privacy Tasks',
      description: 'Set up automated privacy protections',
      category: 'tools',
      difficulty: 'hard',
      estimatedTime: '40 min',
      completed: false,
      resources: [
        { title: 'Privacy Automation Guide', url: '/resources/guides/privacy-automation', type: 'guide' }
      ],
      tips: [
        'Set up automatic data deletion',
        'Configure privacy-focused browser settings',
        'Automate security updates'
      ]
    },
    {
      id: 'day-26-privacy-advocacy',
      day: 26,
      title: 'Become a Privacy Advocate',
      description: 'Share privacy knowledge with others',
      category: 'education',
      difficulty: 'medium',
      estimatedTime: '20 min',
      completed: false,
      resources: [
        { title: 'Privacy Advocacy Guide', url: '/resources/guides/privacy-advocacy', type: 'guide' }
      ],
      tips: [
        'Share privacy tips on social media',
        'Help friends with privacy settings',
        'Support privacy-focused organizations'
      ]
    },
    {
      id: 'day-27-privacy-audit',
      day: 27,
      title: 'Comprehensive Privacy Audit',
      description: 'Conduct a full privacy audit of your digital life',
      category: 'data',
      difficulty: 'hard',
      estimatedTime: '60 min',
      completed: false,
      resources: [
        { title: 'Privacy Audit Checklist', url: '/resources/checklists/privacy-audit', type: 'guide' }
      ],
      tips: [
        'Review all accounts and services',
        'Check for data breaches',
        'Update privacy settings everywhere'
      ]
    },
    {
      id: 'day-28-privacy-planning',
      day: 28,
      title: 'Create Privacy Maintenance Plan',
      description: 'Develop a plan for ongoing privacy maintenance',
      category: 'education',
      difficulty: 'medium',
      estimatedTime: '25 min',
      completed: false,
      resources: [
        { title: 'Privacy Maintenance Guide', url: '/resources/guides/privacy-maintenance', type: 'guide' }
      ],
      tips: [
        'Schedule regular privacy reviews',
        'Set up recurring security checks',
        'Plan for privacy policy updates'
      ]
    },
    {
      id: 'day-29-privacy-celebration',
      day: 29,
      title: 'Celebrate Your Progress',
      description: 'Review your achievements and celebrate your privacy journey',
      category: 'education',
      difficulty: 'easy',
      estimatedTime: '15 min',
      completed: false,
      resources: [
        { title: 'Privacy Achievement Guide', url: '/resources/guides/privacy-achievements', type: 'guide' }
      ],
      tips: [
        'Review all completed tasks',
        'Share your progress',
        'Plan for continued privacy protection'
      ]
    },
    {
      id: 'day-30-privacy-master',
      day: 30,
      title: 'Become a Privacy Master',
      description: 'Complete your 30-day privacy transformation',
      category: 'education',
      difficulty: 'easy',
      estimatedTime: '20 min',
      completed: false,
      resources: [
        { title: 'Privacy Master Certificate', url: '/resources/certificates/privacy-master', type: 'guide' }
      ],
      tips: [
        'Take a final privacy assessment',
        'Share your transformation story',
        'Commit to ongoing privacy protection'
      ]
    }
  ];

  return tasks;
};

export const useThirtyDayChallengeStore = create<ChallengeProgress & ChallengeActions>()(
  persist(
    (set, get) => ({
      startDate: null,
      currentDay: 1,
      completedDays: 0,
      streak: 0,
      totalPoints: 0,
      dailyTasks: generateDailyTasks(),
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
      },

      startChallenge: async () => {
        try {
          const startDate = new Date().toISOString();
          set({
            startDate,
            currentDay: 1,
            completedDays: 0,
            streak: 0,
            totalPoints: 0,
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
          });
          
          // Create challenge in Supabase if user is authenticated
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabaseThirtyDayService.createChallenge(user.id);
          }
        } catch (error) {
          console.error('Failed to start challenge:', error);
        }
      },

      completeTask: async (taskId: string) => {
        try {
          const state = get();
          const updatedTasks = state.dailyTasks.map(task => {
            if (task.id === taskId && !task.completed) {
              return {
                ...task,
                completed: true,
                completedAt: new Date().toISOString()
              };
            }
            return task;
          });

          const completedTasks = updatedTasks.filter(task => task.completed);
          const completedDays = Math.max(...completedTasks.map(task => task.day), 0);
          
          // Calculate points based on difficulty
          const task = updatedTasks.find(t => t.id === taskId);
          const points = task ? (task.difficulty === 'easy' ? 10 : task.difficulty === 'medium' ? 20 : 30) : 0;

          set({
            dailyTasks: updatedTasks,
            completedDays,
            currentDay: Math.min(completedDays + 1, 30),
            totalPoints: state.totalPoints + points
          });

          get().checkMilestones();
          get().checkAchievements();
          
          // Sync with Supabase if user is authenticated
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabaseThirtyDayService.completeTask(taskId);
            await supabaseThirtyDayService.addPoints(user.id, points);
          }
          
          // Trigger achievement check in progress store
          // Use lazy import to prevent circular dependency issues
          if (typeof window !== 'undefined') {
            const { useProgressStore } = await import('./progressStore');
            const progressStore = useProgressStore.getState();
            progressStore.checkThirtyDayAchievements(completedDays, true);
          }
        } catch (error) {
          console.error('Failed to complete task:', error);
        }
      },

      resetChallenge: async () => {
        set({
          startDate: null,
          currentDay: 1,
          completedDays: 0,
          streak: 0,
          totalPoints: 0,
          dailyTasks: generateDailyTasks(),
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
        });
      },

      getCurrentDayTasks: () => {
        const state = get();
        return state.dailyTasks.filter(task => task.day === state.currentDay);
      },

      getProgressPercentage: () => {
        const state = get();
        const completedTasks = state.dailyTasks.filter(task => task.completed).length;
        return Math.round((completedTasks / 30) * 100);
      },

      getStreakDays: () => {
        const state = get();
        if (!state.startDate) return 0;
        
        const start = new Date(state.startDate);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return Math.min(diffDays, 30);
      },

      checkMilestones: () => {
        const state = get();
        const completedTasks = state.dailyTasks.filter(task => task.completed).length;
        
        set({
          milestones: {
            day7: completedTasks >= 7,
            day14: completedTasks >= 14,
            day21: completedTasks >= 21,
            day30: completedTasks >= 30
          }
        });
      },

      checkAchievements: () => {
        const state = get();
        const completedTasks = state.dailyTasks.filter(task => task.completed).length;
        const streak = state.streak;
        
        set({
          achievements: {
            firstWeek: completedTasks >= 7,
            secondWeek: completedTasks >= 14,
            thirdWeek: completedTasks >= 21,
            privacyMaster: completedTasks >= 30,
            streakKeeper: streak >= 7
          }
        });
      },

      loadChallenge: async (userId: string) => {
        try {
          const challenge = await supabaseThirtyDayService.getChallenge(userId);
          if (challenge) {
            const tasks = await supabaseThirtyDayService.getDailyTasks(challenge.id);
            set({
              startDate: challenge.start_date,
              currentDay: challenge.current_day,
              completedDays: challenge.completed_days,
              streak: challenge.streak,
              totalPoints: challenge.total_points,
              milestones: challenge.milestones,
              achievements: challenge.achievements,
              dailyTasks: tasks.map(task => ({
                id: task.id,
                day: task.day,
                title: task.title,
                description: task.description,
                category: task.category as any,
                difficulty: task.difficulty as any,
                estimatedTime: task.estimated_time,
                completed: task.completed,
                completedAt: task.completed_at || undefined,
                resources: task.resources,
                tips: task.tips
              }))
            });
          }
        } catch (error) {
          console.error('Failed to load challenge:', error);
        }
      },

      syncWithBackend: async (userId: string) => {
        try {
          const state = get();
          if (!state.startDate) return;

          const challenge = await supabaseThirtyDayService.getChallenge(userId);
          if (challenge) {
            await supabaseThirtyDayService.updateChallenge(challenge.id, {
              current_day: state.currentDay,
              completed_days: state.completedDays,
              streak: state.streak,
              total_points: state.totalPoints,
              milestones: state.milestones,
              achievements: state.achievements
            });
          }
        } catch (error) {
          console.error('Failed to sync with backend:', error);
        }
      }
    }),
    {
      name: 'social-caution-30day-challenge',
    }
  )
);
