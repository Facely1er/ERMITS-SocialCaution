import { describe, it, expect, beforeEach } from 'vitest';
import { useAssessmentStore } from '../../store/assessmentStore';
import type { AssessmentResults, UserLevel } from '../../types/assessment';

describe('assessmentStore', () => {
  beforeEach(() => {
    // Reset store state
    useAssessmentStore.setState({
      results: null,
      userLevel: null,
      lastAssessmentDate: null
    });
  });

  it('initializes with null values', () => {
    const state = useAssessmentStore.getState();
    expect(state.results).toBe(null);
    expect(state.userLevel).toBe(null);
    expect(state.lastAssessmentDate).toBe(null);
  });

  it('sets assessment results', () => {
    const mockResults: AssessmentResults = {
      score: 75,
      maxScore: 100,
      percentage: 75,
      actionPlan: [],
      userLevel: 'intermediate'
    };

    useAssessmentStore.getState().setResults(mockResults, 'intermediate');

    const state = useAssessmentStore.getState();
    expect(state.results).toEqual(mockResults);
    expect(state.userLevel).toBe('intermediate');
    expect(state.lastAssessmentDate).toBeTruthy();
  });

  it('updates lastAssessmentDate when setting results', () => {
    const mockResults: AssessmentResults = {
      score: 80,
      maxScore: 100,
      percentage: 80,
      actionPlan: [],
      userLevel: 'advanced'
    };

    const beforeDate = new Date().toISOString();
    useAssessmentStore.getState().setResults(mockResults, 'advanced');
    const afterDate = new Date().toISOString();

    const state = useAssessmentStore.getState();
    expect(state.lastAssessmentDate).toBeTruthy();
    if (state.lastAssessmentDate) {
      expect(state.lastAssessmentDate >= beforeDate).toBe(true);
      expect(state.lastAssessmentDate <= afterDate).toBe(true);
    }
  });

  it('clears results', () => {
    const mockResults: AssessmentResults = {
      score: 75,
      maxScore: 100,
      percentage: 75,
      actionPlan: [],
      userLevel: 'intermediate'
    };

    useAssessmentStore.getState().setResults(mockResults, 'intermediate');
    useAssessmentStore.getState().clearResults();

    const state = useAssessmentStore.getState();
    expect(state.results).toBe(null);
    expect(state.userLevel).toBe(null);
  });

  it('handles different user levels', () => {
    const levels: UserLevel[] = ['beginner', 'intermediate', 'advanced'];

    levels.forEach((level) => {
      const mockResults: AssessmentResults = {
        score: level === 'beginner' ? 30 : level === 'intermediate' ? 60 : 90,
        maxScore: 100,
        percentage: level === 'beginner' ? 30 : level === 'intermediate' ? 60 : 90,
        actionPlan: [],
        userLevel: level
      };

      useAssessmentStore.getState().setResults(mockResults, level);
      expect(useAssessmentStore.getState().userLevel).toBe(level);
    });
  });
});

