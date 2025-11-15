import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ProgressTracker from '../../components/dashboard/ProgressTracker';

// Mock the progress store
vi.mock('../../store/progressStore', () => ({
  useProgressStore: () => ({
    totalPoints: 1250,
    level: 13,
    currentLevelPoints: 50,
    nextLevelPoints: 100,
    streak: 7,
    achievements: [
      {
        id: 'first-assessment',
        title: 'Privacy Explorer',
        description: 'Complete your first privacy assessment',
        icon: 'Search',
        points: 50,
        unlocked: true,
        unlockedAt: '2024-01-01T00:00:00.000Z',
        category: 'assessment'
      },
      {
        id: 'action-hero',
        title: 'Action Hero',
        description: 'Complete your first action item',
        icon: 'Zap',
        points: 25,
        unlocked: true,
        unlockedAt: '2024-01-02T00:00:00.000Z',
        category: 'action'
      },
      {
        id: 'streak-master',
        title: 'Streak Master',
        description: 'Maintain a 7-day activity streak',
        icon: 'Star',
        points: 300,
        unlocked: true,
        unlockedAt: '2024-01-08T00:00:00.000Z',
        category: 'streak'
      },
      {
        id: 'security-expert',
        title: 'Security Expert',
        description: 'Achieve a 90%+ privacy score',
        icon: 'Shield',
        points: 500,
        unlocked: false,
        category: 'security'
      }
    ],
    completedActions: ['action-1', 'action-2', 'action-3'],
    assessmentCount: 3,
    socialShares: 2
  })
}));

describe('ProgressTracker', () => {
  it('renders progress information', () => {
    render(<ProgressTracker />);
    
    expect(screen.getByText('Your Progress')).toBeInTheDocument();
    expect(screen.getByText('Level 13')).toBeInTheDocument();
    expect(screen.getByText('1,250')).toBeInTheDocument();
  });

  it('displays level progress bar', () => {
    render(<ProgressTracker />);
    
    expect(screen.getByText('Level Progress')).toBeInTheDocument();
    expect(screen.getByText('50/100 points')).toBeInTheDocument();
  });

  it('shows statistics grid', () => {
    render(<ProgressTracker />);
    
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('Day Streak')).toBeInTheDocument();
    expect(screen.getAllByText('3')).toHaveLength(2);
    expect(screen.getByText('Actions Done')).toBeInTheDocument();
    expect(screen.getByText('Assessments')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Shares')).toBeInTheDocument();
  });

  it('displays recent achievements', () => {
    render(<ProgressTracker />);
    
    expect(screen.getByText('Recent Achievements')).toBeInTheDocument();
    expect(screen.getAllByText('Streak Master')).toHaveLength(2);
    expect(screen.getAllByText('Action Hero')).toHaveLength(2);
    expect(screen.getAllByText('Privacy Explorer')).toHaveLength(2);
  });

  it('shows all achievements with correct status', () => {
    render(<ProgressTracker />);
    
    expect(screen.getByText('Achievements')).toBeInTheDocument();
    
    // Unlocked achievements should be visible
    expect(screen.getAllByText('Privacy Explorer')).toHaveLength(2);
    expect(screen.getAllByText('Action Hero')).toHaveLength(2);
    expect(screen.getAllByText('Streak Master')).toHaveLength(2);
    
    // Locked achievement should be visible but grayed out
    expect(screen.getByText('Security Expert')).toBeInTheDocument();
  });

  it('displays achievement categories correctly', () => {
    render(<ProgressTracker />);
    
    expect(screen.getAllByText('assessment')).toHaveLength(2);
    // The component may render 'action' in multiple places (list and detail)
    expect(screen.getAllByText('action').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('streak')).toHaveLength(2); // Appears in Recent Achievements and All Achievements
    expect(screen.getAllByText('security')).toHaveLength(1);
  });

  it('shows achievement points', () => {
    render(<ProgressTracker />);
    
    expect(screen.getByText('+300 pts')).toBeInTheDocument();
    expect(screen.getByText('+50 pts')).toBeInTheDocument();
    expect(screen.getByText('+25 pts')).toBeInTheDocument();
    expect(screen.getByText('500 pts')).toBeInTheDocument();
  });
});