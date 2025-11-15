import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Section from '../../components/common/Section';
import ScoreHistory from '../../components/dashboard/ScoreHistory';
import Card from '../../components/common/Card';
import { Shield, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';


const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  // Mock data - in a real app this would come from your backend
  const mockHistory = [
    { date: '2024-01-01', score: 65 },
    { date: '2024-02-01', score: 72 },
    { date: '2024-03-01', score: 78 }
  ];

  const assessmentDetails = [
    {
      date: '2024-03-01',
      type: 'Privacy Rights',
      score: 78,
      improvements: [
        'Enabled two-factor authentication',
        'Updated privacy settings',
        'Reviewed app permissions'
      ]
    },
    {
      date: '2024-02-01',
      type: 'Privacy Exposure',
      score: 72,
      improvements: [
        'Set up password manager',
        'Configured secure DNS',
        'Updated weak passwords'
      ]
    },
    {
      date: '2024-01-01',
      type: 'Initial Assessment',
      score: 65,
      improvements: []
    }
  ];

  return (
    <DashboardLayout
      title="Assessment History"
      subtitle="View your privacy assessment history and track your progress over time"
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'History', path: '/dashboard/history' }
      ]}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Section>
        <div className="grid grid-cols-1 gap-6">
          <ScoreHistory data={mockHistory} />
          
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-primary mb-6">Assessment Details</h3>
            <div className="space-y-6">
              {assessmentDetails.map((assessment, index) => (
                <div 
                  key={index}
                  className="border-b border-gray-200 last:border-0 pb-6 last:pb-0"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-primary">{assessment.type}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(assessment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-accent mr-2" />
                      <span className="font-medium">
                        Score: {assessment.score}%
                      </span>
                    </div>
                  </div>

                  {assessment.improvements.length > 0 && (
                    <div className="bg-light-blue/10 rounded-lg p-4">
                      <h5 className="font-medium text-primary mb-2">Improvements Made</h5>
                      <ul className="space-y-2">
                        {assessment.improvements.map((improvement, i) => (
                          <li key={i} className="flex items-center text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></div>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-sm"
                    >
                      View Full Report
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 text-center">
            <p className="text-gray-600 mb-4">
              Ready to see how your privacy protection has improved?
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/assessment')}
            >
              Take New Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        </div>
        </Section>
      </motion.div>
    </DashboardLayout>
  );
};

export default HistoryPage;