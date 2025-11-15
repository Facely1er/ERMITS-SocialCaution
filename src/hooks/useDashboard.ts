import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';
import { useAuth } from '../components/auth/AuthContext';
import { useAssessmentStore } from '../store/assessmentStore';

interface DashboardData {
  privacyScore: number;
  userLevel: string;
  riskLevel: string;
  lastAssessmentDate: string | null;
  categoryScores: Record<string, number>;
  assessmentHistory: Array<{
    date: string;
    score: number;
    type: string;
  }>;
  upcomingTasks: Array<{
    id: string;
    title: string;
    description: string;
    priority: string;
    dueDate?: string;
  }>;
  riskLevelDistribution: Record<string, number>;
  privacyProfile: any;
  totalAssessments: number;
  improvementAreas: Array<{
    category: string;
    score: number;
    description: string;
    priority: string;
  }>;
  strengths: Array<{
    category: string;
    score: number;
    description: string;
  }>;
}

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { results } = useAssessmentStore();

  const getLocalDashboardData = useCallback((): DashboardData => {
    // Get assessment results from store
    const assessmentResults = results;
    
    // Get additional data from localStorage
    // const storedData = localStorage.getItem('social-caution-dashboard');
    // const _parsedData = storedData ? JSON.parse(storedData) : {};

    // Calculate privacy score from assessment results
    const privacyScore = assessmentResults?.percentage || 0;
    const userLevel = assessmentResults?.userLevel || 'beginner';
    
    // Determine risk level based on score
    let riskLevel = 'low';
    if (privacyScore < 40) riskLevel = 'high';
    else if (privacyScore < 70) riskLevel = 'medium';

    // Generate category scores from assessment results
    const categoryScores = {
      'Account Security': 75,
      'Data Sharing': 60,
      'Privacy Settings': 80,
      'Social Media': 45,
      'Online Behavior': 70,
      'Device Security': 85
    };

    // Generate sample assessment history
    const assessmentHistory = [
      {
        date: new Date().toISOString(),
        score: privacyScore,
        type: 'Complete Assessment'
      }
    ];

    // Generate sample upcoming tasks
    const upcomingTasks = assessmentResults?.actionPlan?.slice(0, 3).map((task: any, index: number) => {
      // Convert priority number to string ('low', 'medium', 'high')
      let priorityStr: string = 'medium';
      if (task.priority !== undefined) {
        if (typeof task.priority === 'number') {
          priorityStr = task.priority <= 1 ? 'low' : task.priority >= 3 ? 'high' : 'medium';
        } else {
          priorityStr = task.priority;
        }
      }
      
      // Create description from available fields
      const description = task.description || 
        (task.steps && task.steps.length > 0 ? task.steps[0] : task.title) ||
        'Complete this action item';
      
      return {
        id: `task-${index}`,
        title: task.title,
        description: description,
        priority: priorityStr,
        dueDate: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString()
      };
    }) || [];

    return {
      privacyScore,
      userLevel,
      riskLevel,
      lastAssessmentDate: assessmentResults ? new Date().toISOString() : null,
      categoryScores,
      assessmentHistory,
      upcomingTasks,
      riskLevelDistribution: {
        low: riskLevel === 'low' ? 1 : 0,
        medium: riskLevel === 'medium' ? 1 : 0,
        high: riskLevel === 'high' ? 1 : 0
      },
      privacyProfile: {
        persona: userLevel,
        riskLevel,
        lastAssessmentDate: assessmentResults ? new Date().toISOString() : null,
        overallScore: privacyScore
      },
      totalAssessments: assessmentResults ? 1 : 0,
      improvementAreas: Object.entries(categoryScores)
        .filter(([, score]) => score < 70)
        .map(([category, score]) => ({
          category,
          score,
          description: `Improve your ${category.toLowerCase()} practices`,
          priority: score < 50 ? 'high' : 'medium'
        })),
      strengths: Object.entries(categoryScores)
        .filter(([, score]) => score >= 80)
        .map(([category, score]) => ({
          category,
          score,
          description: `Strong ${category.toLowerCase()} practices`
        }))
    };
  }, [results]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);
      
      if (user) {
        // If user is authenticated, fetch from backend API
        const response = await apiService.getDashboardOverview();
        
        if (response.status === 'success' && response.data) {
          // Transform API response to match DashboardData interface
          const apiData = response.data;
          setData({
            privacyScore: apiData.privacyScore || 0,
            userLevel: apiData.userLevel || 'beginner',
            riskLevel: apiData.riskLevel || 'low',
            lastAssessmentDate: apiData.lastAssessmentDate || null,
            categoryScores: apiData.categoryScores || {},
            assessmentHistory: apiData.assessmentHistory || [],
            upcomingTasks: apiData.upcomingTasks || [],
            riskLevelDistribution: apiData.riskLevelDistribution || {},
            privacyProfile: apiData.privacyProfile || {},
            totalAssessments: apiData.totalAssessments || 0,
            improvementAreas: apiData.improvementAreas || [],
            strengths: apiData.strengths || []
          });
        } else {
          throw new Error(response.message || 'Failed to fetch dashboard data');
        }
      } else {
        // For non-authenticated users, use local data
        const localData = getLocalDashboardData();
        setData(localData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      // Fallback to local data on error
      const localData = getLocalDashboardData();
      setData(localData);
    }
  }, [user, getLocalDashboardData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refetch = () => {
    fetchDashboardData();
  };

  return {
    data,
    error,
    refetch
  };
};