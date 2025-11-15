const logger = require('../utils/logger');

class LocalStorageService {
  constructor() {
    this.storageKey = 'social-caution-data';
    this.syncKey = 'social-caution-sync';
    this.offlineKey = 'social-caution-offline';
  }

  // Generic storage methods
  setItem(key, value) {
    try {
      const data = {
        value,
        timestamp: Date.now(),
        version: '1.0.0'
      };
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      logger.error('Failed to set localStorage item:', error);
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      
      const data = JSON.parse(item);
      return data.value || defaultValue;
    } catch (error) {
      logger.error('Failed to get localStorage item:', error);
      return defaultValue;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      logger.error('Failed to remove localStorage item:', error);
      return false;
    }
  }

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      logger.error('Failed to clear localStorage:', error);
      return false;
    }
  }

  // User data methods
  setUser(user) {
    return this.setItem('user', user);
  }

  getUser() {
    return this.getItem('user');
  }

  removeUser() {
    return this.removeItem('user');
  }

  // Auth token methods
  setAuthToken(token) {
    return this.setItem('auth_token', token);
  }

  getAuthToken() {
    return this.getItem('auth_token');
  }

  removeAuthToken() {
    return this.removeItem('auth_token');
  }

  // Assessment data methods
  setAssessments(assessments) {
    return this.setItem('assessments', assessments);
  }

  getAssessments() {
    return this.getItem('assessments', []);
  }

  addAssessment(assessment) {
    const assessments = this.getAssessments();
    assessments.push(assessment);
    return this.setAssessments(assessments);
  }

  updateAssessment(assessmentId, updates) {
    const assessments = this.getAssessments();
    const index = assessments.findIndex(a => a._id === assessmentId);
    if (index !== -1) {
      assessments[index] = { ...assessments[index], ...updates };
      return this.setAssessments(assessments);
    }
    return false;
  }

  removeAssessment(assessmentId) {
    const assessments = this.getAssessments();
    const filtered = assessments.filter(a => a._id !== assessmentId);
    return this.setAssessments(filtered);
  }

  // Challenge data methods
  setChallenges(challenges) {
    return this.setItem('challenges', challenges);
  }

  getChallenges() {
    return this.getItem('challenges', []);
  }

  addChallenge(challenge) {
    const challenges = this.getChallenges();
    challenges.push(challenge);
    return this.setChallenges(challenges);
  }

  updateChallenge(challengeId, updates) {
    const challenges = this.getChallenges();
    const index = challenges.findIndex(c => c._id === challengeId);
    if (index !== -1) {
      challenges[index] = { ...challenges[index], ...updates };
      return this.setChallenges(challenges);
    }
    return false;
  }

  // Progress data methods
  setProgress(progress) {
    return this.setItem('progress', progress);
  }

  getProgress() {
    return this.getItem('progress');
  }

  updateProgress(updates) {
    const progress = this.getProgress() || {};
    const updatedProgress = { ...progress, ...updates };
    return this.setProgress(updatedProgress);
  }

  // Achievements data methods
  setAchievements(achievements) {
    return this.setItem('achievements', achievements);
  }

  getAchievements() {
    return this.getItem('achievements', []);
  }

  addAchievement(achievement) {
    const achievements = this.getAchievements();
    const existingIndex = achievements.findIndex(a => a.achievementId === achievement.achievementId);
    if (existingIndex !== -1) {
      achievements[existingIndex] = achievement;
    } else {
      achievements.push(achievement);
    }
    return this.setAchievements(achievements);
  }

  // Offline queue methods
  addToOfflineQueue(action) {
    const queue = this.getOfflineQueue();
    queue.push({
      ...action,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    });
    return this.setItem(this.offlineKey, queue);
  }

  getOfflineQueue() {
    return this.getItem(this.offlineKey, []);
  }

  clearOfflineQueue() {
    return this.removeItem(this.offlineKey);
  }

  removeFromOfflineQueue(actionId) {
    const queue = this.getOfflineQueue();
    const filtered = queue.filter(action => action.id !== actionId);
    return this.setItem(this.offlineKey, filtered);
  }

  // Sync status methods
  setLastSync(timestamp = Date.now()) {
    return this.setItem(this.syncKey, timestamp);
  }

  getLastSync() {
    return this.getItem(this.syncKey, 0);
  }

  isSyncNeeded() {
    const lastSync = this.getLastSync();
    const now = Date.now();
    const syncInterval = 5 * 60 * 1000; // 5 minutes
    return (now - lastSync) > syncInterval;
  }

  // Data export/import methods
  exportData() {
    const data = {
      user: this.getUser(),
      assessments: this.getAssessments(),
      challenges: this.getChallenges(),
      progress: this.getProgress(),
      achievements: this.getAchievements(),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    return data;
  }

  importData(data) {
    try {
      if (data.user) this.setUser(data.user);
      if (data.assessments) this.setAssessments(data.assessments);
      if (data.challenges) this.setChallenges(data.challenges);
      if (data.progress) this.setProgress(data.progress);
      if (data.achievements) this.setAchievements(data.achievements);
      return true;
    } catch (error) {
      logger.error('Failed to import data:', error);
      return false;
    }
  }

  // Storage management methods
  getStorageSize() {
    let totalSize = 0;
    for (let key in localStorage) {
      if (key.startsWith('social-caution-')) {
        totalSize += localStorage[key].length;
      }
    }
    return totalSize;
  }

  getStorageInfo() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('social-caution-'));
    return {
      totalKeys: keys.length,
      totalSize: this.getStorageSize(),
      keys: keys.map(key => ({
        key,
        size: localStorage[key].length
      }))
    };
  }

  cleanup() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('social-caution-'));
    const now = Date.now();
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    
    keys.forEach(key => {
      try {
        const item = JSON.parse(localStorage.getItem(key));
        if (item.timestamp && (now - item.timestamp) > maxAge) {
          localStorage.removeItem(key);
        }
      } catch (error) {
        // Remove corrupted items
        localStorage.removeItem(key);
      }
    });
  }

  // Data validation methods
  validateData(data) {
    const requiredFields = ['user', 'assessments', 'challenges', 'progress', 'achievements'];
    return requiredFields.every(field => Object.prototype.hasOwnProperty.call(data, field));
  }

  // Backup methods
  createBackup() {
    const data = this.exportData();
    const backupKey = `backup-${Date.now()}`;
    return this.setItem(backupKey, data);
  }

  getBackups() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('backup-'));
    return keys.map(key => ({
      key,
      timestamp: this.getItem(key)?.exportDate || 'Unknown'
    })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  restoreBackup(backupKey) {
    const backup = this.getItem(backupKey);
    if (backup && this.validateData(backup)) {
      return this.importData(backup);
    }
    return false;
  }
}

module.exports = new LocalStorageService();