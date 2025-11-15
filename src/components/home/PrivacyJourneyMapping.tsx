import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Search, Lightbulb, CheckCircle, ArrowRight, Bell, AlertTriangle, Info } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Link } from 'react-router-dom';

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  status: 'completed' | 'in-progress' | 'pending';
  score?: number;
  date?: string;
}

const PrivacyJourneyMapping: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const getTranslatedJourneySteps = (): JourneyStep[] => {
    return [
        {
          id: 'assessment',
          title: 'Initial Assessment',
          description: 'Establish your privacy baseline with a comprehensive assessment',
          icon: Search,
          color: 'bg-blue-500',
          status: 'completed',
          score: 45,
          date: '2024-04-10'
        },
        {
          id: 'education',
          title: 'Privacy Education',
          description: 'Learn about privacy concepts, rights, and best practices',
          icon: Lightbulb,
          color: 'bg-yellow-500',
          status: 'in-progress',
          date: '2024-04-15'
        },
        {
          id: 'action-plan',
          title: 'Action Plan',
          description: 'Implement personalized privacy improvements',
          icon: Shield,
          color: 'bg-green-500',
          status: 'pending'
        },
        {
          id: 'monitoring',
          title: 'Continuous Monitoring',
          description: 'Maintain privacy protection with ongoing monitoring',
          icon: Bell,
          color: 'bg-purple-500',
          status: 'pending'
        },
        {
          id: 'reassessment',
          title: 'Privacy Reassessment',
          description: 'Measure your progress and identify new opportunities',
          icon: CheckCircle,
          color: 'bg-teal-500',
          status: 'pending'
        }
      ];
  };

  const getTranslatedActionItems = () => {
    return [
        {
          id: 'passwords',
          title: 'Update Weak Passwords',
          description: 'Replace weak or reused passwords with strong, unique ones',
          priority: 'high',
          status: 'in-progress'
        },
        {
          id: '2fa',
          title: 'Enable Two-Factor Authentication',
          description: 'Add an extra layer of security to your important accounts',
          priority: 'high',
          status: 'pending'
        },
        {
          id: 'data-brokers',
          title: 'Submit Data Broker Opt-Outs',
          description: 'Remove your personal information from data broker sites',
          priority: 'medium',
          status: 'pending'
        },
        {
          id: 'social-privacy',
          title: 'Review Social Media Privacy',
          description: 'Optimize privacy settings on your social media accounts',
          priority: 'medium',
          status: 'pending'
        }
      ];
  };

  const journeySteps = getTranslatedJourneySteps();
  const actionItems = getTranslatedActionItems();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">
          {"Your Privacy Journey"}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {"Track your progress and follow a personalized roadmap to better privacy protection"}
        </p>
      </div>

      {/* Journey Progress Overview */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-primary dark:text-white">
            {"Journey Progress"}
          </h3>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">
              {"20% Complete"}
            </span>
            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-accent rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: '20%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200 dark:bg-gray-700 z-0">
            <motion.div 
              className="h-full bg-accent" 
              initial={{ width: 0 }}
              animate={{ width: '20%' }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Journey Steps */}
          <div className="flex justify-between relative z-10">
            {journeySteps.map((step) => (
              <div 
                key={step.id} 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedStep(selectedStep === step.id ? null : step.id);
                  }
                }}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  step.status === 'completed' ? step.color : 
                  step.status === 'in-progress' ? 'bg-blue-500' : 
                  'bg-gray-300 dark:bg-gray-600'
                } text-white mb-2`}>
                  {step.status === 'completed' ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    React.createElement(step.icon, { className: "h-6 w-6" })
                  )}
                </div>
                <span className={`text-xs font-medium text-center ${
                  selectedStep === step.id ? 'text-accent' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Step Details */}
        <AnimatePresence>
          {selectedStep && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 overflow-hidden"
            >
              {journeySteps.map(step => step.id === selectedStep && (
                <div key={step.id} className="bg-light-blue/10 dark:bg-card-hover p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className={`p-2 ${step.color} rounded-full mr-3 text-white`}>
                      {React.createElement(step.icon, { className: "h-5 w-5" })}
                    </div>
                    <div>
                      <h4 className="font-medium text-primary dark:text-white mb-1">{step.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{step.description}</p>
                      
                      {step.status === 'completed' && step.score !== undefined && (
                        <div className="mb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              {"Privacy Score"}
                            </span>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{step.score}/100</span>
                          </div>
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div 
                              className={`h-full rounded-full ${
                                step.score >= 70 ? 'bg-green-500' : 
                                step.score >= 40 ? 'bg-yellow-500' : 
                                'bg-red-500'
                              }`} 
                              initial={{ width: 0 }}
                              animate={{ width: `${step.score}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-medium ${
                          step.status === 'completed' ? 'text-green-600 dark:text-green-400' : 
                          step.status === 'in-progress' ? 'text-blue-600 dark:text-blue-400' : 
                          'text-gray-600 dark:text-gray-400'
                        }`}>
                          {step.status === 'completed' ? 
                            ("Completed") : 
                           step.status === 'in-progress' ? 
                            ("In Progress") : 
                            ("Pending")}
                          {step.date && ` • ${new Date(step.date).toLocaleDateString()}`}
                        </span>
                        
                        {step.status !== 'completed' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={step.status === 'pending'}
                          >
                            {step.status === 'in-progress' ? 
                              ("Continue") : 
                              ("Start")}
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Current Action Items */}
      <Card className="p-6 mb-8">
        <h3 className="text-xl font-semibold text-primary dark:text-white mb-6">
          {"Your Privacy Action Plan"}
        </h3>
        
        <div className="space-y-4">
          {actionItems.map((item) => (
            <div 
              key={item.id}
              className={`p-4 rounded-lg border ${
                item.status === 'completed' 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : item.priority === 'high'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  {item.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                  ) : item.priority === 'high' ? (
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
                  ) : (
                    <Info className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                  </div>
                </div>
                
                {item.status !== 'completed' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                  >
                    {"Take Action"}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Link to="/dashboard/action-plan">
            <Button variant="primary">
              {"View Full Action Plan"}
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default PrivacyJourneyMapping;
