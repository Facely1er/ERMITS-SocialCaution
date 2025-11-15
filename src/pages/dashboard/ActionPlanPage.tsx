import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';
import ActionPlan from '../../components/dashboard/ActionPlan';

const ActionPlanPage: React.FC = () => {

  // Comprehensive privacy action plan tasks - memoized to prevent re-renders
  const tasks = useMemo(() => {
    const now = Date.now();
    return [
    {
      id: '1',
      title: 'Enable Two-Factor Authentication',
      description: 'Set up 2FA on your critical accounts (email, banking, social media)',
      priority: 'high' as const,
      completed: false,
      dueDate: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Account Security',
      estimatedTime: '30 minutes'
    },
    {
      id: '2',
      title: 'Review Privacy Settings',
      description: 'Check and update privacy settings on social media platforms',
      priority: 'medium' as const,
      completed: false,
      dueDate: new Date(now + 14 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Privacy Settings',
      estimatedTime: '45 minutes'
    },
    {
      id: '3',
      title: 'Update Weak Passwords',
      description: 'Change passwords that are weak or reused across multiple accounts',
      priority: 'high' as const,
      completed: false,
      dueDate: new Date(now + 3 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Account Security',
      estimatedTime: '1 hour'
    },
    {
      id: '4',
      title: 'Configure App Permissions',
      description: 'Review and update app permissions on your devices',
      priority: 'medium' as const,
      completed: false,
      dueDate: new Date(now + 10 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Device Security',
      estimatedTime: '20 minutes'
    },
    {
      id: '5',
      title: 'Set Up Password Manager',
      description: 'Install and configure a password manager for secure password storage',
      priority: 'high' as const,
      completed: true,
      dueDate: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Account Security',
      estimatedTime: '45 minutes'
    },
    {
      id: '6',
      title: 'Enable Privacy-Focused Browser Settings',
      description: 'Configure browser settings to block trackers and enhance privacy',
      priority: 'medium' as const,
      completed: false,
      dueDate: new Date(now + 5 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Browser Security',
      estimatedTime: '15 minutes'
    },
    {
      id: '7',
      title: 'Review Data Broker Opt-Outs',
      description: 'Opt out of data broker services to reduce personal data exposure',
      priority: 'high' as const,
      completed: false,
      dueDate: new Date(now + 21 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Data Protection',
      estimatedTime: '2 hours'
    },
    {
      id: '8',
      title: 'Secure Your Home Network',
      description: 'Update router settings and enable WPA3 encryption',
      priority: 'medium' as const,
      completed: false,
      dueDate: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Network Security',
      estimatedTime: '30 minutes'
    }
    ];
  }, []); // Empty dependency array - tasks are static

  // Memoize breadcrumbs to prevent re-renders
  const breadcrumbs = useMemo(() => [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Action Plan', path: '/dashboard/action-plan' }
  ], []);

  return (
    <DashboardLayout
      title="Action Plan"
      subtitle="Your personalized privacy improvement roadmap"
      breadcrumbs={breadcrumbs}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Section>
        <ActionPlan tasks={tasks} />

        {/* Tips Section */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center mb-3">
              <Shield className="h-5 w-5 text-accent mr-2" />
              <h3 className="font-medium text-primary">Prioritize High Impact</h3>
            </div>
            <p className="text-sm text-gray-600">
              Focus on completing high-impact actions first to quickly improve your privacy protection.
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center mb-3">
              <AlertTriangle className="h-5 w-5 text-warning mr-2" />
              <h3 className="font-medium text-primary">Regular Updates</h3>
            </div>
            <p className="text-sm text-gray-600">
              Check your action plan regularly as new recommendations may be added based on emerging threats.
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center mb-3">
              <ArrowRight className="h-5 w-5 text-accent mr-2" />
              <h3 className="font-medium text-primary">Track Progress</h3>
            </div>
            <p className="text-sm text-gray-600">
              Mark actions as complete to track your progress and see your privacy score improve.
            </p>
          </Card>
        </div>
        </Section>
      </motion.div>
    </DashboardLayout>
  );
};

export default ActionPlanPage;