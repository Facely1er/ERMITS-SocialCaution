import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Section from '../../components/common/Section';
import ExposureAssessment from '../../components/assessment/ExposureAssessment';


const ExposureCheckDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleComplete = (results: any) => {
    // Store results in localStorage for dashboard access
    localStorage.setItem('assessment-results', JSON.stringify({
      type: 'exposure',
      data: results,
      timestamp: new Date().toISOString()
    }));
    
    // Navigate to dashboard with results
    navigate('/dashboard', { 
      state: { 
        assessmentCompleted: true,
        assessmentType: 'exposure',
        results 
      }
    });
  };

  return (
    <DashboardLayout
      title="Exposure Check"
      subtitle="Assess your digital exposure and privacy risks"
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Exposure Check', path: '/dashboard/exposure-check' }
      ]}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Section>
          <ExposureAssessment onComplete={handleComplete} />
        </Section>
      </motion.div>
    </DashboardLayout>
  );
};

export default ExposureCheckDashboardPage;