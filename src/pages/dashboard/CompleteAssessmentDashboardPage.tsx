import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Section from '../../components/common/Section';
import SecurityAssessment from '../../components/assessment/SecurityAssessment';

const CompleteAssessmentDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleComplete = (results: any) => {
    // Store results in localStorage for dashboard access
    localStorage.setItem('assessment-results', JSON.stringify({
      type: 'security',
      data: results,
      timestamp: new Date().toISOString()
    }));
    
    // Navigate to dashboard with results
    navigate('/dashboard', { 
      state: { 
        assessmentCompleted: true,
        assessmentType: 'security',
        results 
      }
    });
  };

  return (
    <DashboardLayout
      title="Complete Assessment"
      subtitle="Complete your security awareness assessment"
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Complete Assessment', path: '/dashboard/complete-assessment' }
      ]}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Section>
          <SecurityAssessment onComplete={handleComplete} />
        </Section>
      </motion.div>
    </DashboardLayout>
  );
};

export default CompleteAssessmentDashboardPage;