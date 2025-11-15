import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

// Modern Components
import ModernStatsCard from '../../components/dashboard/ModernStatsCard';
import ModernProgressCard from '../../components/dashboard/ModernProgressCard';
import ModernChartCard from '../../components/dashboard/ModernChartCard';
import ModernActionCard from '../../components/dashboard/ModernActionCard';

// Existing Components
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import PrivacyRadarChart from '../../components/dashboard/PrivacyRadarChart';
import ScoreHistory from '../../components/dashboard/ScoreHistory';
import ResourceRecommendations from '../../components/dashboard/ResourceRecommendations';

import { useDashboard } from '../../hooks/useDashboard';
import { useAuth } from '../../components/auth/AuthContext';
import { Info, LogIn } from 'lucide-react';

const ModernDashboardHomePage: React.FC = () => {
  const { data, error } = useDashboard();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showAssessmentComplete, setShowAssessmentComplete] = useState(false);

  useEffect(() => {
    if (location.state?.assessmentCompleted) {
      setShowAssessmentComplete(true);
      setTimeout(() => setShowAssessmentComplete(false), 5000);
    }
  }, [location]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="flex flex-col items-center">
            <Shield className="h-16 w-16 text-danger mb-4" />
            <h2 className="text-2xl font-bold text-text dark:text-text mb-4">
              Error Loading Dashboard
            </h2>
            <p className="text-text-secondary dark:text-text-secondary mb-6">
              There was an error loading your dashboard data. Please try refreshing the page.
            </p>
            <div className="flex gap-3">
              <Button variant="primary" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
              <Button variant="outline" onClick={() => navigate('/assessment')}>
                Take Assessment
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="flex flex-col items-center">
            <Shield className="h-16 w-16 text-accent mb-4" />
            <h2 className="text-2xl font-bold text-text dark:text-text mb-4">
              Welcome to Your Privacy Dashboard
            </h2>
            <p className="text-text-secondary dark:text-text-secondary mb-6">
              Take your first privacy assessment to see your personalized dashboard and recommendations.
            </p>
            <Button variant="primary" onClick={() => navigate('/assessment')}>
              Start Your First Assessment
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Mock data for demonstration
  const radarData = Object.entries(data.categoryScores || {}).map(([category, score]) => ({
    category,
    score
  }));

  const tasks = [
    {
      id: '1',
      title: 'Enable Two-Factor Authentication',
      description: 'Secure your account with an additional layer of protection',
      priority: 'high' as const,
      completed: false,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Security'
    },
    {
      id: '2',
      title: 'Review Privacy Settings',
      description: 'Check and update your privacy preferences across platforms',
      priority: 'medium' as const,
      completed: false,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Privacy'
    },
    {
      id: '3',
      title: 'Complete Security Assessment',
      description: 'Take the comprehensive security assessment',
      priority: 'high' as const,
      completed: true,
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Assessment'
    },
    {
      id: '4',
      title: 'Update Password Manager',
      description: 'Ensure all passwords are stored securely',
      priority: 'low' as const,
      completed: false,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Security'
    }
  ];

  const recommendedResources = [
    {
      id: '1',
      title: 'Password Security Guide',
      type: 'guide',
      description: 'Learn how to create and manage secure passwords',
      premium: false,
      rating: 4.8,
      category: 'Account Security',
      priority: 'high' as const,
      path: '/resources/guides/password-management'
    },
    {
      id: '2',
      title: 'Privacy Rights Essentials',
      type: 'course',
      description: 'Comprehensive guide to understanding and exercising your privacy rights',
      premium: true,
      rating: 4.9,
      category: 'Privacy Settings',
      priority: 'high' as const,
      path: '/resources/guides/understanding-privacy'
    },
    {
      id: '3',
      title: 'Data Broker Removal Guide',
      type: 'guide',
      description: 'Step-by-step guide to removing your data from broker sites',
      premium: false,
      rating: 4.7,
      category: 'Data Protection',
      priority: 'medium' as const,
      path: '/resources/guides/data-broker-removal'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Guest Mode Banner - Show when not authenticated */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent/10 border border-accent/20 rounded-lg p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start flex-1">
              <Info className="h-5 w-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-text dark:text-text mb-1">
                  You're in Guest Mode
                </h3>
                <p className="text-sm text-text-secondary dark:text-text-secondary mb-2">
                  Sign in to save your progress, sync across devices, and access advanced features like personalized recommendations and progress tracking.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/dashboard/profile')}
                  className="mt-2"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In for Enhanced Features
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Assessment Complete Notification */}
      <AnimatePresence>
        {showAssessmentComplete && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-success/10 border border-success/20 rounded-lg p-4"
          >
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-success mr-3" />
              <p className="text-success font-medium">
                Assessment completed successfully! Your privacy score has been updated.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ModernStatsCard
          title="Privacy Score"
          value={`${data.privacyScore || 75}%`}
          subtitle="Your overall privacy protection level"
          icon={Shield}
          color="accent"
          trend={{
            value: 12,
            label: "vs last month"
          }}
        />
        <ModernStatsCard
          title="Data Exposures"
          value="3"
          subtitle="Active privacy risks detected"
          icon={Search}
          color="warning"
          trend={{
            value: -2,
            label: "vs last week"
          }}
        />
        <ModernStatsCard
          title="Completed Actions"
          value="8"
          subtitle="Privacy improvements completed"
          icon={CheckCircle}
          color="success"
          trend={{
            value: 5,
            label: "this month"
          }}
        />
        <ModernStatsCard
          title="Risk Level"
          value="Medium"
          subtitle="Current privacy risk assessment"
          icon={AlertTriangle}
          color="warning"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left Column - Charts */}
        <div className="xl:col-span-2 space-y-4">
          {/* Privacy Score Breakdown */}
          <ModernChartCard
            title="Privacy Score Breakdown"
            subtitle="Detailed privacy protection analysis"
            icon={PieChart}
          >
            <PrivacyRadarChart data={radarData} />
          </ModernChartCard>

          {/* Score History */}
          <ModernChartCard
            title="Score History"
            subtitle="Track your privacy score over time"
            icon={BarChart3}
          >
            <ScoreHistory data={data.assessmentHistory || []} />
          </ModernChartCard>
        </div>

        {/* Right Column - Actions & Resources */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <ModernActionCard
            title="Quick Actions"
            subtitle="Recommended privacy improvements"
            actions={tasks}
            maxItems={3}
            onViewAll={() => navigate('/dashboard/action-plan')}
            onActionClick={(_action) => {/* Track action click (commented out for production) */}}
          />

          {/* Progress Tracking */}
          <ModernProgressCard
            title="Privacy Goals"
            description="Track your progress toward privacy goals"
            progress={8}
            maxProgress={12}
            icon={Activity}
            color="accent"
          />
        </div>
      </div>

      {/* Resource Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text dark:text-text">
              Recommended Resources
            </h2>
            <p className="text-text-secondary dark:text-text-secondary">
              Personalized guides and tools to improve your privacy
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/resources')}
            className="text-accent border-accent hover:bg-accent/10"
          >
            View All Resources
          </Button>
        </div>
        
        <ResourceRecommendations
          resources={recommendedResources}
          categoryScores={data.categoryScores || {}}
          priorityAreas={['Account Security', 'Privacy Settings', 'Data Protection']}
        />
      </div>
    </div>
  );
};

export default ModernDashboardHomePage;