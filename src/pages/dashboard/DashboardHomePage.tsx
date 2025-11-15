import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Shield, ArrowRight, Bell, Calendar, FileText } from 'lucide-react';
// PageLayout removed - using DashboardLayout instead
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import PrivacyRightsWidget from '../../components/dashboard/PrivacyRightsWidget';
// import CategoryScores from '../../components/dashboard/CategoryScores';
import ScoreHistory from '../../components/dashboard/ScoreHistory';
// import ActionPlan from '../../components/dashboard/ActionPlan';
import ResourceRecommendations from '../../components/dashboard/ResourceRecommendations';
import PrivacyRadarChart from '../../components/dashboard/PrivacyRadarChart';
import ExposureResultsWidget from '../../components/dashboard/ExposureResultsWidget';
import { useDashboard } from '../../hooks/useDashboard';
// import { useAuth } from '../../components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

const DashboardHomePage: React.FC = () => {
  const { data, error } = useDashboard();
  // const { user: _user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showAssessmentComplete, setShowAssessmentComplete] = useState(false);
  // const [assessmentResults] = useState<any>(null);

  useEffect(() => {
    // Check if we're coming from a completed assessment
    if (location.state?.assessmentCompleted) {
      setShowAssessmentComplete(true);
      
      // Clear the state after 5 seconds
      const timer = setTimeout(() => {
        setShowAssessmentComplete(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  if (error) {
    return (
      <div className="">
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <Shield className="h-16 w-16 text-red-300 mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-4">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-6 max-w-md">
              There was an error loading your dashboard data. Please try refreshing the page or contact support if the problem persists.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="primary" 
                onClick={() => window.location.reload()}
              >
                Refresh Page
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/assessment')}
              >
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
      <div className="">
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <Shield className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-4">Welcome to Your Privacy Dashboard</h2>
            <p className="text-gray-600 mb-6 max-w-md">
              Take your first privacy assessment to see your personalized dashboard and recommendations.
            </p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/assessment')}
            >
              Start Your First Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const radarData = Object.entries(data.categoryScores).map(([category, score]) => ({
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
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      title: 'Review Privacy Settings',
      description: 'Check and update your privacy preferences',
      priority: 'medium' as const,
      completed: false,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      title: 'Complete Security Assessment',
      description: 'Take the security assessment to identify vulnerabilities',
      priority: 'high' as const,
      completed: true,
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className=""
    >
      {/* Compact Dashboard Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-text dark:text-white mb-1">
          Privacy Dashboard
        </h1>
        <p className="text-text-secondary dark:text-gray-300">
          Monitor your privacy status and take action to improve your digital security.
        </p>
      </div>
        {/* Assessment Complete Notification */}
        {showAssessmentComplete && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-md"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <Shield className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Assessment completed successfully! Your privacy score has been updated.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Compact Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <ExposureResultsWidget 
            score={75} 
            lastAssessmentDate={new Date().toISOString()}
            priorityAreas={['Network Security', 'Password Management', 'Data Sharing']}
            categoryScores={{
              'Network Security': 60,
              'Password Management': 70,
              'Data Sharing': 65,
              'Device Security': 80,
              'Online Presence': 75
            }}
          />
          <PrivacyRightsWidget 
            score={data.privacyScore} 
            lastAssessmentDate={new Date().toISOString()}
            priorityAreas={['Password Security', 'Data Sharing', 'Account Protection']}
          />
          <PrivacyRadarChart data={radarData} />
        </div>

        {/* Compact Two-Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
          <ScoreHistory data={data.assessmentHistory} />
          <Card className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold">Quick Actions</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/dashboard/action-plan')}
              >
                View All
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>

            <div className="space-y-2">
              {tasks.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className={`p-2 rounded-md text-sm ${
                    item.completed 
                      ? 'bg-green-50 border-green-200' 
                      : item.priority === 'high'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-amber-50 border-amber-200'
                  } border`}
                >
                  <div className="flex items-center">
                    <div className="mr-2">
                      {item.completed ? (
                        <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        <div className={`h-4 w-4 rounded-full ${
                          item.priority === 'high' ? 'bg-red-500' : 'bg-amber-500'
                        } flex items-center justify-center`}>
                          <Bell className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`font-medium text-xs ${item.completed ? 'line-through text-gray-500' : 'text-primary'}`}>
                        {item.title}
                      </h4>
                      <div className="flex items-center mt-0.5 text-xs">
                        <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                        <span className="text-gray-500">
                          {new Date(item.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Compact Resource Recommendations */}
        <div className="mb-4">
          <ResourceRecommendations
            resources={recommendedResources.slice(0, 2)}
            categoryScores={data.categoryScores}
            priorityAreas={['Account Security', 'Privacy Settings', 'Data Protection']}
          />
        </div>

        {/* Compact Recent Activity */}
        <Card className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold">Recent Activity</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard/history')}
            >
              View History
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-2">
            {data.assessmentHistory.slice(-2).map((assessment, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <div className="p-1.5 bg-light-blue rounded-full mr-2">
                    <FileText className="h-3 w-3 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-primary">Privacy Assessment</p>
                    <p className="text-xs text-gray-500">{new Date(assessment.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-sm font-semibold text-accent">
                  {assessment.score}%
                </div>
              </div>
            ))}
          </div>
        </Card>
    </motion.div>
  );
};

export default DashboardHomePage;