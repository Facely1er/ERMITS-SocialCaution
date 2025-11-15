const { supabase } = require('../../lib/supabase');
const LocalStorageService = require('./LocalStorageService');
const logger = require('../utils/logger');

class SyncService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;
    this.syncInterval = null;
    this.retryAttempts = 0;
    this.maxRetries = 3;
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncData();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Start automatic sync
  startAutoSync(interval = 5 * 60 * 1000) { // 5 minutes default
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.syncInterval = setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.syncData();
      }
    }, interval);
  }

  // Stop automatic sync
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Main sync method
  async syncData() {
    if (this.syncInProgress || !this.isOnline) {
      return { success: false, message: 'Sync already in progress or offline' };
    }

    this.syncInProgress = true;
    this.retryAttempts = 0;

    try {
      logger.info('Starting data synchronization...');
      
      // Sync user data
      await this.syncUserData();
      
      // Sync assessments
      await this.syncAssessments();
      
      // Sync challenges
      await this.syncChallenges();
      
      // Sync progress
      await this.syncProgress();
      
      // Sync achievements
      await this.syncAchievements();
      
      // Process offline queue
      await this.processOfflineQueue();
      
      // Update last sync timestamp
      LocalStorageService.setLastSync();
      
      logger.info('Data synchronization completed successfully');
      return { success: true, message: 'Sync completed successfully' };
      
    } catch (error) {
      logger.error('Sync failed:', error);
      
      if (this.retryAttempts < this.maxRetries) {
        this.retryAttempts++;
        logger.info(`Retrying sync in 30 seconds (attempt ${this.retryAttempts}/${this.maxRetries})`);
        setTimeout(() => this.syncData(), 30000);
        return { success: false, message: 'Sync failed, retrying...' };
      }
      
      return { success: false, message: 'Sync failed after maximum retries' };
    } finally {
      this.syncInProgress = false;
    }
  }

  // Sync user data
  async syncUserData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        LocalStorageService.setUser(user);
        logger.info('User data synced');
      }
    } catch (error) {
      logger.error('Failed to sync user data:', error);
      throw error;
    }
  }

  // Sync assessments
  async syncAssessments() {
    try {
      const { data: assessments, error } = await supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (assessments) {
        LocalStorageService.setAssessments(assessments);
        logger.info(`Synced ${assessments.length} assessments`);
      }
    } catch (error) {
      logger.error('Failed to sync assessments:', error);
      throw error;
    }
  }

  // Sync challenges
  async syncChallenges() {
    try {
      const { data: challenges, error } = await supabase
        .from('privacy_thirty_day_challenges')
        .select(`
          *,
          daily_tasks(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (challenges) {
        LocalStorageService.setChallenges(challenges);
        logger.info(`Synced ${challenges.length} challenges`);
      }
    } catch (error) {
      logger.error('Failed to sync challenges:', error);
      throw error;
    }
  }

  // Sync progress
  async syncProgress() {
    try {
      const { data: progress, error } = await supabase
        .from('privacy_user_progress')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

      if (progress) {
        LocalStorageService.setProgress(progress);
        logger.info('Progress data synced');
      }
    } catch (error) {
      logger.error('Failed to sync progress:', error);
      throw error;
    }
  }

  // Sync achievements
  async syncAchievements() {
    try {
      const { data: achievements, error } = await supabase
        .from('privacy_achievements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (achievements) {
        LocalStorageService.setAchievements(achievements);
        logger.info(`Synced ${achievements.length} achievements`);
      }
    } catch (error) {
      logger.error('Failed to sync achievements:', error);
      throw error;
    }
  }

  // Process offline queue
  async processOfflineQueue() {
    const queue = LocalStorageService.getOfflineQueue();
    if (queue.length === 0) return;

    logger.info(`Processing ${queue.length} offline actions`);

    for (const action of queue) {
      try {
        await this.processOfflineAction(action);
        LocalStorageService.removeFromOfflineQueue(action.id);
      } catch (error) {
        logger.error(`Failed to process offline action ${action.id}:`, error);
        // Keep the action in queue for retry
      }
    }
  }

  // Process individual offline action
  async processOfflineAction(action) {
    const { type, data, endpoint, method } = action;

    switch (type) {
      case 'assessment':
        await this.syncAssessmentAction(data, method, endpoint);
        break;
      case 'challenge':
        await this.syncChallengeAction(data, method, endpoint);
        break;
      case 'progress':
        await this.syncProgressAction(data, method, endpoint);
        break;
      case 'achievement':
        await this.syncAchievementAction(data, method, endpoint);
        break;
      default:
        logger.warn(`Unknown offline action type: ${type}`);
    }
  }

  // Sync assessment action
  async syncAssessmentAction(data, _method, _endpoint) {
    const { error } = await supabase
      .from('assessments')
      .upsert(data);

    if (error) throw error;
  }

  // Sync challenge action
  async syncChallengeAction(data, _method, _endpoint) {
    const { error } = await supabase
      .from('privacy_thirty_day_challenges')
      .upsert(data);

    if (error) throw error;
  }

  // Sync progress action
  async syncProgressAction(data, _method, _endpoint) {
    const { error } = await supabase
      .from('privacy_user_progress')
      .upsert(data);

    if (error) throw error;
  }

  // Sync achievement action
  async syncAchievementAction(data, _method, _endpoint) {
    const { error } = await supabase
      .from('privacy_achievements')
      .upsert(data);

    if (error) throw error;
  }

  // Upload local data to server
  async uploadLocalData() {
    if (!this.isOnline) {
      return { success: false, message: 'No internet connection' };
    }

    try {
      const localData = LocalStorageService.exportData();
      
      // Upload assessments
      if (localData.assessments.length > 0) {
        const { error: assessmentError } = await supabase
          .from('assessments')
          .upsert(localData.assessments);
        
        if (assessmentError) throw assessmentError;
      }

      // Upload challenges
      if (localData.challenges.length > 0) {
        const { error: challengeError } = await supabase
          .from('privacy_thirty_day_challenges')
          .upsert(localData.challenges);
        
        if (challengeError) throw challengeError;
      }

      // Upload progress
      if (localData.progress) {
        const { error: progressError } = await supabase
          .from('privacy_user_progress')
          .upsert(localData.progress);
        
        if (progressError) throw progressError;
      }

      // Upload achievements
      if (localData.achievements.length > 0) {
        const { error: achievementError } = await supabase
          .from('privacy_achievements')
          .upsert(localData.achievements);
        
        if (achievementError) throw achievementError;
      }

      logger.info('Local data uploaded successfully');
      return { success: true, message: 'Data uploaded successfully' };

    } catch (error) {
      logger.error('Failed to upload local data:', error);
      return { success: false, message: 'Upload failed' };
    }
  }

  // Download server data to local
  async downloadServerData() {
    if (!this.isOnline) {
      return { success: false, message: 'No internet connection' };
    }

    try {
      await this.syncData();
      logger.info('Server data downloaded successfully');
      return { success: true, message: 'Data downloaded successfully' };

    } catch (error) {
      logger.error('Failed to download server data:', error);
      return { success: false, message: 'Download failed' };
    }
  }

  // Get sync status
  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress,
      lastSync: LocalStorageService.getLastSync(),
      offlineQueueLength: LocalStorageService.getOfflineQueue().length,
      retryAttempts: this.retryAttempts
    };
  }

  // Force sync
  async forceSync() {
    this.retryAttempts = 0;
    return await this.syncData();
  }

  // Clear all data
  async clearAllData() {
    try {
      LocalStorageService.clear();
      logger.info('All local data cleared');
      return { success: true, message: 'All data cleared' };
    } catch (error) {
      logger.error('Failed to clear data:', error);
      return { success: false, message: 'Failed to clear data' };
    }
  }

  // Get data summary
  getDataSummary() {
    return {
      user: LocalStorageService.getUser() ? 'Present' : 'Not found',
      assessments: LocalStorageService.getAssessments().length,
      challenges: LocalStorageService.getChallenges().length,
      progress: LocalStorageService.getProgress() ? 'Present' : 'Not found',
      achievements: LocalStorageService.getAchievements().length,
      offlineQueue: LocalStorageService.getOfflineQueue().length,
      storageInfo: LocalStorageService.getStorageInfo()
    };
  }
}

module.exports = new SyncService();