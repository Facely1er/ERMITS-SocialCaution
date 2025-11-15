import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, AlertTriangle, Shield, BarChart3 } from 'lucide-react';
import Section from '../common/Section';
import Button from '../common/Button';

export const PrivacyAssessmentPreview: React.FC = () => {
  const navigate = useNavigate();
  const concerns = [
    { id: 1, text: 'Social Media Privacy Settings', checked: true },
    { id: 2, text: 'Password Security', checked: true },
    { id: 3, text: 'Data Broker Exposure', checked: false },
    { id: 4, text: 'Device Security', checked: true },
    { id: 5, text: 'Location Tracking', checked: false },
    { id: 6, text: 'Browser Privacy', checked: true }
  ];

  return (
    <Section
      title="Get Your Personalized Privacy Score"
      subtitle="Discover your digital footprint and get actionable recommendations"
      centered
      className="bg-yellow-100 dark:bg-yellow-900/20 py-16"
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Assessment Form Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-card rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-primary dark:text-white mb-4">
              Privacy Assessment Preview
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Answer a few questions about your digital habits to get your personalized privacy score.
            </p>
            
            <div className="space-y-3">
              {concerns.map((concern) => (
                <div key={concern.id} className="flex items-center">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 ${
                    concern.checked 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {concern.checked && <CheckSquare className="h-3 w-3 text-white" />}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{concern.text}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Assessment takes approximately 3-5 minutes
              </p>
            </div>
          </motion.div>

          {/* Privacy Score Gauge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-white dark:bg-card rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-primary dark:text-white mb-6">
                Your Privacy Score
              </h3>
              
              {/* Circular Progress */}
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="251.2"
                    strokeDashoffset="75.36"
                    className="text-green-500"
                    strokeLinecap="round"
                  />
                </svg>
                
                {/* Score Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-500">70</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">out of 100</div>
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Security</span>
                  </div>
                  <span className="text-sm font-medium text-green-500">Good</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Exposure</span>
                  </div>
                  <span className="text-sm font-medium text-yellow-500">Moderate</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Control</span>
                  </div>
                  <span className="text-sm font-medium text-blue-500">Strong</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <Button
            variant="primary"
            className="text-lg px-8 py-4"
            onClick={() => navigate('/assessment')}
          >
            Start Your Assessment
          </Button>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            Free • No signup required • Results in minutes
          </p>
        </motion.div>
      </div>
    </Section>
  );
};