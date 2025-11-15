import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from '../../store/progressStore';

describe('progressStore', () => {
  beforeEach(() => {
    useProgressStore.getState().resetProgress();
  });

  it('initializes with default values', () => {
    const state = useProgressStore.getState();
    expect(state.totalPoints).toBe(0);
    expect(state.level).toBe(1);
    expect(state.streak).toBe(0);
    expect(state.assessmentCount).toBe(0);
    expect(state.completedActions).toEqual([]);
  });

  it('adds points and updates level', () => {
    useProgressStore.getState().addPoints(50, 'test');
    
    const state = useProgressStore.getState();
    expect(state.totalPoints).toBe(50);
    expect(state.currentLevelPoints).toBe(50);
  });

  it('calculates level correctly', () => {
    useProgressStore.getState().addPoints(150, 'test');
    
    const state = useProgressStore.getState();
    expect(state.level).toBe(2);
    expect(state.currentLevelPoints).toBe(50);
  });

  it('completes an action', () => {
    useProgressStore.getState().completeAction('action-1');
    
    const state = useProgressStore.getState();
    expect(state.completedActions).toContain('action-1');
    // 25 points for completing action + 25 points for unlocking 'action-hero' achievement
    expect(state.totalPoints).toBe(50);
  });

  it('does not add duplicate actions', () => {
    useProgressStore.getState().completeAction('action-1');
    useProgressStore.getState().completeAction('action-1');
    
    const state = useProgressStore.getState();
    expect(state.completedActions.filter(id => id === 'action-1').length).toBe(1);
  });

  it('completes an assessment', () => {
    useProgressStore.getState().completeAssessment();
    
    const state = useProgressStore.getState();
    expect(state.assessmentCount).toBe(1);
    // 50 points for completing assessment + 50 points for unlocking 'first-assessment' achievement
    expect(state.totalPoints).toBe(100);
  });

  it('shares content', () => {
    useProgressStore.getState().shareContent();
    
    const state = useProgressStore.getState();
    expect(state.socialShares).toBe(1);
    expect(state.totalPoints).toBe(15); // Points for sharing
  });

  it('unlocks first assessment achievement', () => {
    useProgressStore.getState().completeAssessment();
    
    const state = useProgressStore.getState();
    const achievement = state.achievements.find(a => a.id === 'first-assessment');
    expect(achievement?.unlocked).toBe(true);
  });

  it('unlocks action hero achievement', () => {
    useProgressStore.getState().completeAction('action-1');
    
    const state = useProgressStore.getState();
    const achievement = state.achievements.find(a => a.id === 'action-hero');
    expect(achievement?.unlocked).toBe(true);
  });

  it('updates streak correctly', () => {
    useProgressStore.getState().updateStreak();
    
    const state = useProgressStore.getState();
    expect(state.streak).toBeGreaterThanOrEqual(0);
    expect(state.lastActivityDate).toBeTruthy();
  });

  it('resets progress', () => {
    useProgressStore.getState().addPoints(100, 'test');
    useProgressStore.getState().completeAction('action-1');
    useProgressStore.getState().resetProgress();
    
    const state = useProgressStore.getState();
    expect(state.totalPoints).toBe(0);
    expect(state.level).toBe(1);
    expect(state.completedActions).toEqual([]);
  });

  it('checks thirty day achievements', () => {
    useProgressStore.getState().checkThirtyDayAchievements(7, true);
    
    const state = useProgressStore.getState();
    const achievement = state.achievements.find(a => a.id === '30day-week-one');
    expect(achievement?.unlocked).toBe(true);
  });
});

