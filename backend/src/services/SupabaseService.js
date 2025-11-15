const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

class SupabaseService {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseKey = process.env.SUPABASE_ANON_KEY;
    this.serviceKey = process.env.SUPABASE_SERVICE_KEY;
    
    if (!this.supabaseUrl || !this.supabaseKey) {
      logger.warn('Supabase credentials not found. Service will run in offline mode.');
      this.client = null;
      this.serviceClient = null;
      return;
    }

    // Client for user operations
    this.client = createClient(this.supabaseUrl, this.supabaseKey);
    
    // Service client for admin operations
    if (this.serviceKey) {
      this.serviceClient = createClient(this.supabaseUrl, this.serviceKey);
    }
  }

  // User Management
  async createUser(userData) {
    if (!this.client) throw new Error('Supabase client not initialized');
    
    try {
      const { data, error } = await this.client.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            privacy_profile: userData.privacyProfile || {},
            preferences: userData.preferences || {}
          }
        }
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      logger.error('Supabase create user error:', error);
      throw error;
    }
  }

  async signIn(email, password) {
    if (!this.client) throw new Error('Supabase client not initialized');
    
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      logger.error('Supabase sign in error:', error);
      throw error;
    }
  }

  async signOut() {
    if (!this.client) throw new Error('Supabase client not initialized');
    
    try {
      const { error } = await this.client.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      logger.error('Supabase sign out error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    if (!this.client) throw new Error('Supabase client not initialized');
    
    try {
      const { data: { user }, error } = await this.client.auth.getUser();
      if (error) throw error;
      return { success: true, data: user };
    } catch (error) {
      logger.error('Supabase get current user error:', error);
      throw error;
    }
  }

  // Database Operations
  async insert(table, data) {
    if (!this.client) throw new Error('Supabase client not initialized');
    
    try {
      const { data: result, error } = await this.client
        .from(table)
        .insert(data)
        .select();

      if (error) throw error;
      return { success: true, data: result };
    } catch (error) {
      logger.error(`Supabase insert error for table ${table}:`, error);
      throw error;
    }
  }

  async select(table, options = {}) {
    if (!this.client) throw new Error('Supabase client not initialized');
    
    try {
      let query = this.client.from(table).select(options.select || '*');
      
      if (options.where) {
        Object.entries(options.where).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      if (options.orderBy) {
        query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending });
      }
      
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      logger.error(`Supabase select error for table ${table}:`, error);
      throw error;
    }
  }

  async update(table, data, where) {
    if (!this.client) throw new Error('Supabase client not initialized');
    
    try {
      let query = this.client.from(table).update(data);
      
      Object.entries(where).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { data: result, error } = await query.select();
      if (error) throw error;
      return { success: true, data: result };
    } catch (error) {
      logger.error(`Supabase update error for table ${table}:`, error);
      throw error;
    }
  }

  async delete(table, where) {
    if (!this.client) throw new Error('Supabase client not initialized');
    
    try {
      let query = this.client.from(table).delete();
      
      Object.entries(where).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { error } = await query;
      if (error) throw error;
      return { success: true };
    } catch (error) {
      logger.error(`Supabase delete error for table ${table}:`, error);
      throw error;
    }
  }

  async upsert(table, data) {
    if (!this.client) throw new Error('Supabase client not initialized');
    
    try {
      const { data: result, error } = await this.client
        .from(table)
        .upsert(data)
        .select();

      if (error) throw error;
      return { success: true, data: result };
    } catch (error) {
      logger.error(`Supabase upsert error for table ${table}:`, error);
      throw error;
    }
  }

  // Assessment Operations
  async createAssessment(assessmentData) {
    return await this.insert('assessments', assessmentData);
  }

  async getAssessments(userId, options = {}) {
    return await this.select('assessments', {
      where: { user_id: userId },
      ...options
    });
  }

  async updateAssessment(assessmentId, updates) {
    return await this.update('assessments', updates, { id: assessmentId });
  }

  // Challenge Operations
  async createChallenge(challengeData) {
    return await this.insert('thirty_day_challenges', challengeData);
  }

  async getChallenges(userId, options = {}) {
    return await this.select('thirty_day_challenges', {
      where: { user_id: userId },
      ...options
    });
  }

  async updateChallenge(challengeId, updates) {
    return await this.update('thirty_day_challenges', updates, { id: challengeId });
  }

  // Progress Operations
  async createProgress(progressData) {
    return await this.upsert('user_progress', progressData);
  }

  async getProgress(userId) {
    const result = await this.select('user_progress', {
      where: { user_id: userId },
      limit: 1
    });
    return result.success ? { success: true, data: result.data[0] } : result;
  }

  async updateProgress(userId, updates) {
    return await this.upsert('user_progress', { user_id: userId, ...updates });
  }

  // Achievement Operations
  async createAchievement(achievementData) {
    return await this.insert('achievements', achievementData);
  }

  async getAchievements(userId, options = {}) {
    return await this.select('achievements', {
      where: { user_id: userId },
      ...options
    });
  }

  async updateAchievement(achievementId, updates) {
    return await this.update('achievements', updates, { id: achievementId });
  }

  // Batch Operations
  async batchInsert(table, dataArray) {
    if (!this.client) throw new Error('Supabase client not initialized');
    
    try {
      const { data, error } = await this.client
        .from(table)
        .insert(dataArray)
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      logger.error(`Supabase batch insert error for table ${table}:`, error);
      throw error;
    }
  }

  async batchUpdate(table, updatesArray) {
    if (!this.client) throw new Error('Supabase client not initialized');
    
    try {
      const { data, error } = await this.client
        .from(table)
        .upsert(updatesArray)
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      logger.error(`Supabase batch update error for table ${table}:`, error);
      throw error;
    }
  }

  // Real-time Subscriptions
  subscribeToTable(table, callback, filter = {}) {
    if (!this.client) throw new Error('Supabase client not initialized');
    
    try {
      let subscription = this.client
        .channel(`${table}_changes`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: table,
          filter: filter
        }, callback)
        .subscribe();

      return subscription;
    } catch (error) {
      logger.error(`Supabase subscription error for table ${table}:`, error);
      throw error;
    }
  }

  // Storage Operations
  async uploadFile(bucket, path, file) {
    if (!this.client) throw new Error('Supabase client not initialized');
    
    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .upload(path, file);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      logger.error(`Supabase file upload error:`, error);
      throw error;
    }
  }

  async downloadFile(bucket, path) {
    if (!this.client) throw new Error('Supabase client not initialized');
    
    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .download(path);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      logger.error(`Supabase file download error:`, error);
      throw error;
    }
  }

  async deleteFile(bucket, path) {
    if (!this.client) throw new Error('Supabase client not initialized');
    
    try {
      const { error } = await this.client.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      logger.error(`Supabase file delete error:`, error);
      throw error;
    }
  }

  // Health Check
  async healthCheck() {
    if (!this.client) return { success: false, message: 'Client not initialized' };
    
    try {
      const { error } = await this.client
        .from('privacy_users')
        .select('count')
        .limit(1);

      if (error) throw error;
      return { success: true, message: 'Supabase connection healthy' };
    } catch (error) {
      logger.error('Supabase health check error:', error);
      return { success: false, message: 'Supabase connection failed' };
    }
  }

  // Get client instance for direct operations
  getClient() {
    return this.client;
  }

  getServiceClient() {
    return this.serviceClient;
  }
}

module.exports = new SupabaseService();