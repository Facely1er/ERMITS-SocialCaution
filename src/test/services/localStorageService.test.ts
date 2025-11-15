import { describe, it, expect, beforeEach } from 'vitest';
import { localStorageService } from '../../services/localStorageService';
import type { AssessmentResult, LocalUser } from '../../services/localStorageService';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('localStorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('User Management', () => {
    it('creates a user', () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user'
      };

      const user = localStorageService.createUser(userData as Omit<LocalUser, '_id' | 'createdAt' | 'updatedAt' | 'lastActivity'>);

      expect(user._id).toBeTruthy();
      expect(user.email).toBe('test@example.com');
      expect(user.firstName).toBe('Test');
      expect(user.isActive).toBe(true);
    });

    it('gets user by email', () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user'
      };

      localStorageService.createUser(userData as Omit<LocalUser, '_id' | 'createdAt' | 'updatedAt' | 'lastActivity'>);
      const retrievedUser = localStorageService.getUserByEmail('test@example.com');

      expect(retrievedUser).toBeTruthy();
      expect(retrievedUser?.email).toBe('test@example.com');
    });

    it('updates user', () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user'
      };

      localStorageService.createUser(userData as Omit<LocalUser, '_id' | 'createdAt' | 'updatedAt' | 'lastActivity'>);
      const updated = localStorageService.updateUser({ firstName: 'Updated' });

      expect(updated?.firstName).toBe('Updated');
    });

    it('deletes user', () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user'
      };

      localStorageService.createUser(userData as Omit<LocalUser, '_id' | 'createdAt' | 'updatedAt' | 'lastActivity'>);
      localStorageService.deleteUser();

      const retrieved = localStorageService.getUserByEmail('test@example.com');
      expect(retrieved).toBeNull();
    });
  });

  describe('Assessment Management', () => {
    it('saves assessment result', () => {
      const assessment: AssessmentResult = {
        id: 'assessment-1',
        userId: 'user-1',
        type: 'complete',
        status: 'completed',
        score: 75,
        answers: [],
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };

      localStorageService.saveAssessment(assessment);
      const saved = localStorageService.getAssessmentById('assessment-1');

      expect(saved).toBeTruthy();
      expect(saved?.score).toBe(75);
    });

    it('gets assessment results by user', () => {
      const assessment: AssessmentResult = {
        id: 'assessment-1',
        userId: 'user-1',
        type: 'complete',
        status: 'completed',
        score: 75,
        answers: [],
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };

      localStorageService.saveAssessment(assessment);
      const results = localStorageService.getUserAssessments('user-1');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].userId).toBe('user-1');
    });
  });

  describe('Action Plan Management', () => {
    it('saves action plan item', () => {
      const itemData = {
        title: 'Test Action',
        description: 'Test Description',
        category: 'Security',
        priority: 'high' as const,
        isCompleted: false
      };

      const saved = localStorageService.createActionPlanItem('user-1', itemData);

      expect(saved.id).toBeTruthy();
      expect(saved.title).toBe('Test Action');
    });

    it('gets action plan items by user', () => {
      const itemData = {
        title: 'Test Action',
        description: 'Test Description',
        category: 'Security',
        priority: 'high' as const,
        isCompleted: false
      };

      localStorageService.createActionPlanItem('user-1', itemData);
      const items = localStorageService.getActionPlan('user-1');

      expect(items.length).toBeGreaterThan(0);
      expect(items[0].userId).toBe('user-1');
    });

    it('updates action plan item', () => {
      const itemData = {
        title: 'Test Action',
        description: 'Test Description',
        category: 'Security',
        priority: 'high' as const,
        isCompleted: false
      };

      const saved = localStorageService.createActionPlanItem('user-1', itemData);
      const updatedItem = { ...saved, isCompleted: true };
      localStorageService.saveActionPlanItem(updatedItem);
      const items = localStorageService.getActionPlan('user-1');

      expect(items[0].isCompleted).toBe(true);
    });
  });

  describe('Data Export', () => {
    it('exports all user data', () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user'
      };

      const user = localStorageService.createUser(userData as Omit<LocalUser, '_id' | 'createdAt' | 'updatedAt' | 'lastActivity'>);
      const exported = localStorageService.getAllUserData(user._id);

      expect(exported).toBeTruthy();
      expect(exported.user).toBeTruthy();
    });
  });
});

