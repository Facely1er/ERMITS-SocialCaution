const LocalStorageService = require('../services/LocalStorageService');
const SyncService = require('../services/SyncService');
const SupabaseService = require('../services/SupabaseService');
const logger = require('../utils/logger');

// Middleware to handle data synchronization
const syncMiddleware = (req, res, next) => {
  // Add sync methods to request object
  req.sync = {
    // Sync user data
    syncUser: async (userData) => {
      try {
        // Save to localStorage
        LocalStorageService.setUser(userData);
        
        // Sync to Supabase if online
        if (SyncService.isOnline) {
          await SupabaseService.upsert('users', {
            id: userData.id,
            email: userData.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            privacy_profile: userData.privacyProfile,
            preferences: userData.preferences,
            updated_at: new Date().toISOString()
          });
        } else {
          // Queue for offline sync
          SyncService.addToOfflineQueue({
            type: 'user',
            data: userData,
            method: 'upsert',
            endpoint: 'users'
          });
        }
        
        return { success: true };
      } catch (error) {
        logger.error('Sync user error:', error);
        return { success: false, error: error.message };
      }
    },

    // Sync assessment data
    syncAssessment: async (assessmentData) => {
      try {
        // Save to localStorage
        LocalStorageService.addAssessment(assessmentData);
        
        // Sync to Supabase if online
        if (SyncService.isOnline) {
          await SupabaseService.upsert('assessments', {
            id: assessmentData._id,
            user_id: assessmentData.userId,
            type: assessmentData.type,
            status: assessmentData.status,
            answers: assessmentData.answers,
            results: assessmentData.results,
            action_plan: assessmentData.actionPlan,
            started_at: assessmentData.startedAt,
            completed_at: assessmentData.completedAt,
            time_spent: assessmentData.timeSpent,
            device_info: assessmentData.deviceInfo,
            ip_address: assessmentData.ipAddress,
            is_anonymous: assessmentData.isAnonymous,
            created_at: assessmentData.createdAt,
            updated_at: assessmentData.updatedAt
          });
        } else {
          // Queue for offline sync
          SyncService.addToOfflineQueue({
            type: 'assessment',
            data: assessmentData,
            method: 'upsert',
            endpoint: 'assessments'
          });
        }
        
        return { success: true };
      } catch (error) {
        logger.error('Sync assessment error:', error);
        return { success: false, error: error.message };
      }
    },

    // Sync challenge data
    syncChallenge: async (challengeData) => {
      try {
        // Save to localStorage
        LocalStorageService.addChallenge(challengeData);
        
        // Sync to Supabase if online
        if (SyncService.isOnline) {
          await SupabaseService.upsert('thirty_day_challenges', {
            id: challengeData._id,
            user_id: challengeData.userId,
            start_date: challengeData.startDate,
            current_day: challengeData.currentDay,
            completed_days: challengeData.completedDays,
            streak: challengeData.streak,
            total_points: challengeData.totalPoints,
            milestones: challengeData.milestones,
            achievements: challengeData.achievements,
            status: challengeData.status,
            completed_at: challengeData.completedAt,
            last_activity_date: challengeData.lastActivityDate,
            created_at: challengeData.createdAt,
            updated_at: challengeData.updatedAt
          });
        } else {
          // Queue for offline sync
          SyncService.addToOfflineQueue({
            type: 'challenge',
            data: challengeData,
            method: 'upsert',
            endpoint: 'thirty_day_challenges'
          });
        }
        
        return { success: true };
      } catch (error) {
        logger.error('Sync challenge error:', error);
        return { success: false, error: error.message };
      }
    },

    // Sync progress data
    syncProgress: async (progressData) => {
      try {
        // Save to localStorage
        LocalStorageService.setProgress(progressData);
        
        // Sync to Supabase if online
        if (SyncService.isOnline) {
          await SupabaseService.upsert('user_progress', {
            id: progressData._id,
            user_id: progressData.userId,
            total_points: progressData.totalPoints,
            level: progressData.level,
            current_level_points: progressData.currentLevelPoints,
            next_level_points: progressData.nextLevelPoints,
            streak: progressData.streak,
            last_activity_date: progressData.lastActivityDate,
            assessment_count: progressData.assessmentCount,
            social_shares: progressData.socialShares,
            badges: progressData.badges,
            statistics: progressData.statistics,
            preferences: progressData.preferences,
            created_at: progressData.createdAt,
            updated_at: progressData.updatedAt
          });
        } else {
          // Queue for offline sync
          SyncService.addToOfflineQueue({
            type: 'progress',
            data: progressData,
            method: 'upsert',
            endpoint: 'user_progress'
          });
        }
        
        return { success: true };
      } catch (error) {
        logger.error('Sync progress error:', error);
        return { success: false, error: error.message };
      }
    },

    // Sync achievement data
    syncAchievement: async (achievementData) => {
      try {
        // Save to localStorage
        LocalStorageService.addAchievement(achievementData);
        
        // Sync to Supabase if online
        if (SyncService.isOnline) {
          await SupabaseService.upsert('achievements', {
            id: achievementData._id,
            user_id: achievementData.userId,
            achievement_id: achievementData.achievementId,
            title: achievementData.title,
            description: achievementData.description,
            icon: achievementData.icon,
            points: achievementData.points,
            category: achievementData.category,
            rarity: achievementData.rarity,
            unlocked: achievementData.unlocked,
            unlocked_at: achievementData.unlockedAt,
            requirements: achievementData.requirements,
            metadata: achievementData.metadata,
            is_hidden: achievementData.isHidden,
            display_order: achievementData.displayOrder,
            created_at: achievementData.createdAt,
            updated_at: achievementData.updatedAt
          });
        } else {
          // Queue for offline sync
          SyncService.addToOfflineQueue({
            type: 'achievement',
            data: achievementData,
            method: 'upsert',
            endpoint: 'achievements'
          });
        }
        
        return { success: true };
      } catch (error) {
        logger.error('Sync achievement error:', error);
        return { success: false, error: error.message };
      }
    },

    // Get local data
    getLocalData: (type) => {
      switch (type) {
        case 'user':
          return LocalStorageService.getUser();
        case 'assessments':
          return LocalStorageService.getAssessments();
        case 'challenges':
          return LocalStorageService.getChallenges();
        case 'progress':
          return LocalStorageService.getProgress();
        case 'achievements':
          return LocalStorageService.getAchievements();
        default:
          return null;
      }
    },

    // Force sync all data
    forceSync: async () => {
      return await SyncService.forceSync();
    },

    // Get sync status
    getSyncStatus: () => {
      return SyncService.getSyncStatus();
    }
  };

  next();
};

// Middleware to handle offline mode
const offlineMiddleware = (req, res, next) => {
  // Check if we're offline
  if (!SyncService.isOnline) {
    // Add offline flag to request
    req.isOffline = true;
    
    // Log offline request
    logger.info(`Offline request: ${req.method} ${req.path}`);
  }

  next();
};

// Middleware to queue offline actions
const queueOfflineAction = (actionType) => {
  return (req, res, next) => {
    // Store original response methods
    const originalJson = res.json;
    const originalSend = res.send;

    // Override response methods to queue actions when offline
    res.json = function(data) {
      if (req.isOffline && data.status === 'success') {
        // Queue the action for later sync
        SyncService.addToOfflineQueue({
          type: actionType,
          data: req.body,
          method: req.method,
          endpoint: req.path
        });
      }
      
      return originalJson.call(this, data);
    };

    res.send = function(data) {
      if (req.isOffline && typeof data === 'object' && data.status === 'success') {
        // Queue the action for later sync
        SyncService.addToOfflineQueue({
          type: actionType,
          data: req.body,
          method: req.method,
          endpoint: req.path
        });
      }
      
      return originalSend.call(this, data);
    };

    next();
  };
};

module.exports = {
  syncMiddleware,
  offlineMiddleware,
  queueOfflineAction
};