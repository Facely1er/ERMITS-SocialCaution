import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AssessmentResults, UserLevel } from '../types/assessment';

interface AssessmentState {
  results: AssessmentResults | null;
  userLevel: UserLevel | null;
  lastAssessmentDate: string | null;
}

interface AssessmentActions {
  setResults: (results: AssessmentResults, userLevel: UserLevel) => void;
  clearResults: () => void;
}

export const useAssessmentStore = create<AssessmentState & AssessmentActions>()(
  persist(
    (set) => ({
      results: null,
      userLevel: null,
      lastAssessmentDate: null,

      setResults: (results, userLevel) => set({
        results,
        userLevel,
        lastAssessmentDate: new Date().toISOString()
      }),

      clearResults: () => set({
        results: null,
        userLevel: null
      })
    }),
    {
      name: 'social-caution-assessment',
    }
  )
);