import React from 'react';
import TestAssessmentButton from '../test-assessment-button';

const TestAssessmentPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Assessment Button Test</h1>
          <TestAssessmentButton />
        </div>
      </div>
    </div>
  );
};

export default TestAssessmentPage;