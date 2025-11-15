/**
 * Comprehensive localStorage service for user accounts and application data
 * Provides full offline functionality with localStorage persistence
 */

export interface LocalUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Hashed password (for demo purposes, in production use proper hashing)
  avatar?: string;
  role: string;
  isEmailVerified: boolean;
  preferences: {
    language: string;
    theme: string;
    notifications: {
      email: boolean;
      push: boolean;
      privacyAlerts: boolean;
      assessmentReminders: boolean;
    };
  };
  privacyProfile: {
    persona?: string;
    riskLevel: string;
    lastAssessmentDate?: string;
    overallScore: number;
  };
  subscription: {
    plan: string;
    status: string;
  };
  isActive: boolean;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  type: 'exposure' | 'rights' | 'security' | 'complete';
  status: 'in-progress' | 'completed';
  score: number;
  answers: Array<{
    questionId: string;
    value: string;
    score: number;
    level: string;
  }>;
  startedAt: string;
  completedAt?: string;
  recommendations?: string[];
}

export interface ActionPlanItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface UserData {
  user: LocalUser | null;
  assessments: AssessmentResult[];
  actionPlan: ActionPlanItem[];
  notifications: Notification[];
  digitalFootprint: any[];
  dataBrokerRemovals: any[];
  personalDataInventory: any[];
  challengeProgress: any;
  preferences: any;
}

const STORAGE_KEYS = {
  USER: 'social-caution-user',
  ASSESSMENTS: 'social-caution-assessments',
  ACTION_PLAN: 'social-caution-action-plan',
  NOTIFICATIONS: 'social-caution-notifications',
  DIGITAL_FOOTPRINT: 'social-caution-digital-footprint',
  DATA_BROKER_REMOVALS: 'social-caution-data-broker-removals',
  PERSONAL_DATA_INVENTORY: 'social-caution-personal-data-inventory',
  CHALLENGE_PROGRESS: 'social-caution-challenge-progress',
  PREFERENCES: 'social-caution-preferences',
  AUTH_TOKEN: 'auth_token',
} as const;

class LocalStorageService {
  // Check if localStorage is available
  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // User Management
  createUser(userData: Omit<LocalUser, '_id' | 'createdAt' | 'updatedAt' | 'lastActivity'>): LocalUser {
    const user: LocalUser = {
      ...userData,
      _id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      isEmailVerified: false,
      role: userData.role || 'user',
      isActive: true,
      privacyProfile: userData.privacyProfile || {
        riskLevel: 'medium',
        overallScore: 0,
      },
      subscription: userData.subscription || {
        plan: 'free',
        status: 'active',
      },
      preferences: userData.preferences || {
        language: 'en',
        theme: 'system',
        notifications: {
          email: true,
          push: true,
          privacyAlerts: true,
          assessmentReminders: true,
        },
      },
    };

    this.saveUser(user);
    return user;
  }

  getUser(): LocalUser | null {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return null;
    }
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      if (!userData) return null;
      const parsed = JSON.parse(userData);
      // Validate user structure
      if (!parsed || typeof parsed !== 'object' || !parsed._id || !parsed.email) {
        console.error('Invalid user data structure');
        return null;
      }
      return parsed;
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      return null;
    }
  }

  getUserByEmail(email: string): LocalUser | null {
    const user = this.getUser();
    if (user && user.email.toLowerCase() === email.toLowerCase()) {
      return user;
    }
    return null;
  }

  saveUser(user: LocalUser): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return;
    }
    try {
      // Create a new object to avoid mutating the original
      const userToSave: LocalUser = {
        ...user,
        updatedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userToSave));
    } catch (error: any) {
      if (error?.name === 'QuotaExceededError' || error?.code === 22) {
        console.error('localStorage quota exceeded. Please clear some data.');
        throw new Error('Storage quota exceeded. Please clear some data and try again.');
      }
      console.error('Error saving user to localStorage:', error);
      throw error;
    }
  }

  updateUser(updates: Partial<LocalUser>): LocalUser | null {
    const user = this.getUser();
    if (!user) return null;

    const updatedUser: LocalUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    };

    this.saveUser(updatedUser);
    return updatedUser;
  }

  deleteUser(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    this.clearAllUserData();
  }

  // Assessment Management
  getAssessments(): AssessmentResult[] {
    if (!this.isLocalStorageAvailable()) {
      return [];
    }
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      // Validate it's an array
      if (!Array.isArray(parsed)) {
        console.error('Invalid assessments data structure');
        return [];
      }
      return parsed;
    } catch (error) {
      console.error('Error loading assessments from localStorage:', error);
      return [];
    }
  }

  getAssessmentById(id: string): AssessmentResult | null {
    const assessments = this.getAssessments();
    return assessments.find(a => a.id === id) || null;
  }

  getUserAssessments(userId: string): AssessmentResult[] {
    const assessments = this.getAssessments();
    return assessments.filter(a => a.userId === userId);
  }

  saveAssessment(assessment: AssessmentResult): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return;
    }
    const assessments = this.getAssessments();
    const index = assessments.findIndex(a => a.id === assessment.id);
    
    if (index >= 0) {
      assessments[index] = assessment;
    } else {
      assessments.push(assessment);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(assessments));
    } catch (error: any) {
      if (error?.name === 'QuotaExceededError' || error?.code === 22) {
        console.error('localStorage quota exceeded');
        throw new Error('Storage quota exceeded. Please clear some data and try again.');
      }
      console.error('Error saving assessment to localStorage:', error);
      throw error;
    }
  }

  createAssessment(userId: string, type: AssessmentResult['type']): AssessmentResult {
    const assessment: AssessmentResult = {
      id: this.generateId(),
      userId,
      type,
      status: 'in-progress',
      score: 0,
      answers: [],
      startedAt: new Date().toISOString(),
    };

    this.saveAssessment(assessment);
    return assessment;
  }

  // Action Plan Management
  getActionPlan(userId: string): ActionPlanItem[] {
    if (!this.isLocalStorageAvailable()) {
      return [];
    }
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTION_PLAN);
      if (!data) return [];
      const allItems = JSON.parse(data);
      // Validate it's an array
      if (!Array.isArray(allItems)) {
        console.error('Invalid action plan data structure');
        return [];
      }
      return allItems.filter((item: ActionPlanItem) => item.userId === userId);
    } catch (error) {
      console.error('Error loading action plan from localStorage:', error);
      return [];
    }
  }

  saveActionPlanItem(item: ActionPlanItem): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return;
    }
    const data = localStorage.getItem(STORAGE_KEYS.ACTION_PLAN);
    let allItems: ActionPlanItem[] = [];
    
    if (data) {
      try {
        const parsed = JSON.parse(data);
        // Validate it's an array
        if (Array.isArray(parsed)) {
          allItems = parsed;
        } else {
          console.error('Invalid action plan data structure');
        }
      } catch (error) {
        console.error('Error parsing action plan data:', error);
      }
    }

    const index = allItems.findIndex(i => i.id === item.id);
    if (index >= 0) {
      allItems[index] = { ...item, updatedAt: new Date().toISOString() };
    } else {
      allItems.push({
        ...item,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    try {
      localStorage.setItem(STORAGE_KEYS.ACTION_PLAN, JSON.stringify(allItems));
    } catch (error: any) {
      if (error?.name === 'QuotaExceededError' || error?.code === 22) {
        console.error('localStorage quota exceeded');
        throw new Error('Storage quota exceeded. Please clear some data and try again.');
      }
      console.error('Error saving action plan item to localStorage:', error);
      throw error;
    }
  }

  createActionPlanItem(userId: string, itemData: Omit<ActionPlanItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): ActionPlanItem {
    const item: ActionPlanItem = {
      ...itemData,
      id: this.generateId(),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.saveActionPlanItem(item);
    return item;
  }

  // Notification Management
  getNotifications(userId: string): Notification[] {
    if (!this.isLocalStorageAvailable()) {
      return [];
    }
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (!data) return [];
      const allNotifications = JSON.parse(data);
      // Validate it's an array
      if (!Array.isArray(allNotifications)) {
        console.error('Invalid notifications data structure');
        return [];
      }
      return allNotifications.filter((n: Notification) => n.userId === userId);
    } catch (error) {
      console.error('Error loading notifications from localStorage:', error);
      return [];
    }
  }

  createNotification(userId: string, notificationData: Omit<Notification, 'id' | 'userId' | 'isRead' | 'createdAt'>): Notification {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      // Return notification object even if we can't save it
      return {
        ...notificationData,
        id: this.generateId(),
        userId,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
    }
    const notification: Notification = {
      ...notificationData,
      id: this.generateId(),
      userId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    let allNotifications: Notification[] = [];
    
    if (data) {
      try {
        const parsed = JSON.parse(data);
        // Validate it's an array
        if (Array.isArray(parsed)) {
          allNotifications = parsed;
        } else {
          console.error('Invalid notifications data structure');
        }
      } catch (error) {
        console.error('Error parsing notifications data:', error);
      }
    }

    allNotifications.push(notification);

    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(allNotifications));
    } catch (error: any) {
      if (error?.name === 'QuotaExceededError' || error?.code === 22) {
        console.error('localStorage quota exceeded');
        throw new Error('Storage quota exceeded. Please clear some data and try again.');
      }
      console.error('Error saving notification to localStorage:', error);
      throw error;
    }

    return notification;
  }

  markNotificationRead(notificationId: string): void {
    if (!this.isLocalStorageAvailable()) {
      return;
    }
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!data) return;

    try {
      const notifications: Notification[] = JSON.parse(data);
      // Validate it's an array
      if (!Array.isArray(notifications)) {
        console.error('Invalid notifications data structure');
        return;
      }
      const notification = notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.isRead = true;
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      }
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  }

  // Digital Footprint Management
  saveDigitalFootprint(userId: string, data: any): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return;
    }
    const key = `${STORAGE_KEYS.DIGITAL_FOOTPRINT}-${userId}`;
    try {
      const existing = localStorage.getItem(key);
      let footprints: any[] = [];
      if (existing) {
        try {
          const parsed = JSON.parse(existing);
          if (Array.isArray(parsed)) {
            footprints = parsed;
          }
        } catch (error) {
          console.error('Error parsing digital footprint data:', error);
        }
      }
      footprints.push({
        ...data,
        id: this.generateId(),
        userId,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(key, JSON.stringify(footprints));
    } catch (error: any) {
      if (error?.name === 'QuotaExceededError' || error?.code === 22) {
        console.error('localStorage quota exceeded');
        throw new Error('Storage quota exceeded. Please clear some data and try again.');
      }
      console.error('Error saving digital footprint to localStorage:', error);
      throw error;
    }
  }

  getDigitalFootprints(userId: string): any[] {
    if (!this.isLocalStorageAvailable()) {
      return [];
    }
    const key = `${STORAGE_KEYS.DIGITAL_FOOTPRINT}-${userId}`;
    try {
      const data = localStorage.getItem(key);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error loading digital footprints from localStorage:', error);
      return [];
    }
  }

  // Data Broker Removals Management
  saveDataBrokerRemoval(userId: string, data: any): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return;
    }
    const key = `${STORAGE_KEYS.DATA_BROKER_REMOVALS}-${userId}`;
    try {
      const existing = localStorage.getItem(key);
      let removals: any[] = [];
      if (existing) {
        try {
          const parsed = JSON.parse(existing);
          if (Array.isArray(parsed)) {
            removals = parsed;
          }
        } catch (error) {
          console.error('Error parsing data broker removals data:', error);
        }
      }
      removals.push({
        ...data,
        id: this.generateId(),
        userId,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(key, JSON.stringify(removals));
    } catch (error: any) {
      if (error?.name === 'QuotaExceededError' || error?.code === 22) {
        console.error('localStorage quota exceeded');
        throw new Error('Storage quota exceeded. Please clear some data and try again.');
      }
      console.error('Error saving data broker removal to localStorage:', error);
      throw error;
    }
  }

  getDataBrokerRemovals(userId: string): any[] {
    if (!this.isLocalStorageAvailable()) {
      return [];
    }
    const key = `${STORAGE_KEYS.DATA_BROKER_REMOVALS}-${userId}`;
    try {
      const data = localStorage.getItem(key);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error loading data broker removals from localStorage:', error);
      return [];
    }
  }

  // Personal Data Inventory Management
  savePersonalDataInventory(userId: string, data: any[]): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return;
    }
    const key = `${STORAGE_KEYS.PERSONAL_DATA_INVENTORY}-${userId}`;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error: any) {
      if (error?.name === 'QuotaExceededError' || error?.code === 22) {
        console.error('localStorage quota exceeded');
        throw new Error('Storage quota exceeded. Please clear some data and try again.');
      }
      console.error('Error saving personal data inventory to localStorage:', error);
      throw error;
    }
  }

  getPersonalDataInventory(userId: string): any[] {
    if (!this.isLocalStorageAvailable()) {
      return [];
    }
    const key = `${STORAGE_KEYS.PERSONAL_DATA_INVENTORY}-${userId}`;
    try {
      const data = localStorage.getItem(key);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error loading personal data inventory from localStorage:', error);
      return [];
    }
  }

  // Challenge Progress Management
  saveChallengeProgress(userId: string, progress: any): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return;
    }
    const key = `${STORAGE_KEYS.CHALLENGE_PROGRESS}-${userId}`;
    try {
      localStorage.setItem(key, JSON.stringify(progress));
    } catch (error: any) {
      if (error?.name === 'QuotaExceededError' || error?.code === 22) {
        console.error('localStorage quota exceeded');
        throw new Error('Storage quota exceeded. Please clear some data and try again.');
      }
      console.error('Error saving challenge progress to localStorage:', error);
      throw error;
    }
  }

  getChallengeProgress(userId: string): any | null {
    if (!this.isLocalStorageAvailable()) {
      return null;
    }
    const key = `${STORAGE_KEYS.CHALLENGE_PROGRESS}-${userId}`;
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading challenge progress from localStorage:', error);
      return null;
    }
  }

  // Preferences Management
  savePreferences(userId: string, preferences: any): void {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return;
    }
    const key = `${STORAGE_KEYS.PREFERENCES}-${userId}`;
    try {
      localStorage.setItem(key, JSON.stringify(preferences));
    } catch (error: any) {
      if (error?.name === 'QuotaExceededError' || error?.code === 22) {
        console.error('localStorage quota exceeded');
        throw new Error('Storage quota exceeded. Please clear some data and try again.');
      }
      console.error('Error saving preferences to localStorage:', error);
      throw error;
    }
  }

  getPreferences(userId: string): any | null {
    if (!this.isLocalStorageAvailable()) {
      return null;
    }
    const key = `${STORAGE_KEYS.PREFERENCES}-${userId}`;
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading preferences from localStorage:', error);
      return null;
    }
  }

  // Utility Methods
  clearAllUserData(): void {
    if (!this.isLocalStorageAvailable()) {
      return;
    }
    const user = this.getUser();
    if (!user) return;

    const userId = user._id;
    
    try {
      // Clear all user-specific data
      localStorage.removeItem(`${STORAGE_KEYS.DIGITAL_FOOTPRINT}-${userId}`);
      localStorage.removeItem(`${STORAGE_KEYS.DATA_BROKER_REMOVALS}-${userId}`);
      localStorage.removeItem(`${STORAGE_KEYS.PERSONAL_DATA_INVENTORY}-${userId}`);
      localStorage.removeItem(`${STORAGE_KEYS.CHALLENGE_PROGRESS}-${userId}`);
      localStorage.removeItem(`${STORAGE_KEYS.PREFERENCES}-${userId}`);
      
      // Remove user from shared collections
      const assessments = this.getAssessments().filter(a => a.userId !== userId);
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(assessments));

      const actionPlanData = localStorage.getItem(STORAGE_KEYS.ACTION_PLAN);
      if (actionPlanData) {
        try {
          const allItems = JSON.parse(actionPlanData);
          if (Array.isArray(allItems)) {
            const filtered = allItems.filter((item: ActionPlanItem) => item.userId !== userId);
            localStorage.setItem(STORAGE_KEYS.ACTION_PLAN, JSON.stringify(filtered));
          }
        } catch (error) {
          console.error('Error parsing action plan data during cleanup:', error);
        }
      }

      const notificationsData = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (notificationsData) {
        try {
          const allNotifications = JSON.parse(notificationsData);
          if (Array.isArray(allNotifications)) {
            const filtered = allNotifications.filter((n: Notification) => n.userId !== userId);
            localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(filtered));
          }
        } catch (error) {
          console.error('Error parsing notifications data during cleanup:', error);
        }
      }
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }

  getAllUserData(userId: string): UserData {
    return {
      user: this.getUser(),
      assessments: this.getUserAssessments(userId),
      actionPlan: this.getActionPlan(userId),
      notifications: this.getNotifications(userId),
      digitalFootprint: this.getDigitalFootprints(userId),
      dataBrokerRemovals: this.getDataBrokerRemovals(userId),
      personalDataInventory: this.getPersonalDataInventory(userId),
      challengeProgress: this.getChallengeProgress(userId),
      preferences: this.getPreferences(userId),
    };
  }

  // Simple password hashing (for demo purposes - in production use proper hashing)
  hashPassword(password: string): string {
    // Simple hash for demo - in production use bcrypt or similar
    return btoa(password).split('').reverse().join('');
  }

  verifyPassword(password: string, hashedPassword: string): boolean {
    const hashed = this.hashPassword(password);
    return hashed === hashedPassword;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
  }
}

export const localStorageService = new LocalStorageService();
export default localStorageService;

