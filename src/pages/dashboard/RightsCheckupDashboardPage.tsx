import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Section from '../../components/common/Section';
import PrivacyRightsAssessment from '../../components/assessment/PrivacyRightsAssessment';

const RightsCheckupDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleComplete = (results: any) => {
    // Store results in localStorage for dashboard access
    localStorage.setItem('assessment-results', JSON.stringify({
      type: 'rights',
      data: results,
      timestamp: new Date().toISOString()
    }));
    
    // Navigate to dashboard with results
    navigate('/dashboard', { 
      state: { 
        assessmentCompleted: true,
        assessmentType: 'rights',
        results 
      }
    });
  };

  return (
    <DashboardLayout
      title="Privacy Rights Checkup"
      subtitle="Evaluate your understanding and exercise of privacy rights across platforms"
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Rights Checkup', path: '/dashboard/rights-checkup' }
      ]}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Section>
          <PrivacyRightsAssessment onComplete={handleComplete} />
        </Section>
      </motion.div>
    </DashboardLayout>
  );
};

export default RightsCheckupDashboardPage;