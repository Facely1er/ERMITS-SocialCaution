import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Section from '../../components/common/Section';
import ExposureAssessment from '../../components/assessment/ExposureAssessment';
import Button from '../../components/common/Button';

const ExposureAssessmentPage: React.FC = () => {
  const navigate = useNavigate();

  const handleComplete = (results: any) => {
    // Store results in localStorage for dashboard access
    localStorage.setItem('assessment-results', JSON.stringify({
      type: 'exposure',
      data: results,
      timestamp: new Date().toISOString()
    }));
    
    // Navigate to results page with the assessment results
    navigate('/assessment/results', { 
      state: { 
        results,
        type: 'exposure'
      }
    });
  };

  // Translation helpers
  const getTranslatedTitle = () => {
    return "Digital Exposure Check";
  };

  const getTranslatedSubtitle = () => {
    return "Identify potential privacy vulnerabilities and exposure risks in your digital presence";
  };

  const getTranslatedBackToAssessment = () => {
    return "Back to Assessments";
  };

  return (
    <PageLayout
      title={getTranslatedTitle()}
      subtitle={getTranslatedSubtitle()}
      heroBackground={false}
      breadcrumbs={[
        { label: 'Assessment', path: '/assessment' },
        { label: 'Digital Exposure Check', path: '/assessment/exposure' }
      ]}
    >

      <Section>
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/assessment')}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {getTranslatedBackToAssessment()}
          </Button>
        </div>
        
        <ExposureAssessment onComplete={handleComplete} />
      </Section>
    </PageLayout>
  );
};

export default ExposureAssessmentPage;