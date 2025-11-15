import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, Smartphone, Wifi, Globe } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import ProgressBar from './ProgressBar';

interface Question {
  id: string;
  text: string;
  description: string;
  icon: React.ElementType;
  options: {
    id: string;
    text: string;
    description: string;
    value: number;
  }[];
}

interface SecurityAssessmentProps {
  onComplete?: (results: any) => void;
}

const SecurityAssessment: React.FC<SecurityAssessmentProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Get questions
  const getTranslatedQuestions = (): Question[] => {
    return [
        {
          id: 'password_security',
          text: 'How do you manage your passwords?',
          description: 'Password management practices are crucial for account security.',
          icon: Key,
          options: [
            { 
              id: 'basic',
              text: 'Simple passwords',
              description: 'Using easy-to-remember passwords, often reused across accounts',
              value: 0 
            },
            { 
              id: 'mixed',
              text: 'Mixed strength',
              description: 'Some strong passwords, but some reuse across accounts',
              value: 2 
            },
            { 
              id: 'unique',
              text: 'Unique passwords',
              description: 'Strong, unique passwords for each account',
              value: 4 
            },
            { 
              id: 'password_manager',
              text: 'Password manager',
              description: 'Using a password manager with generated strong passwords',
              value: 5 
            }
          ]
        },
        {
          id: 'two_factor',
          text: 'How do you use two-factor authentication (2FA)?',
          description: 'Additional security layer beyond passwords.',
          icon: Shield,
          options: [
            { 
              id: 'none',
              text: 'Not using 2FA',
              description: 'Relying only on passwords',
              value: 0 
            },
            { 
              id: 'some',
              text: 'On some accounts',
              description: 'Enabled on select important accounts',
              value: 2 
            },
            { 
              id: 'sms',
              text: 'SMS-based 2FA',
              description: 'Using text messages for verification',
              value: 3 
            },
            { 
              id: 'authenticator',
              text: 'Authenticator app/security key',
              description: 'Using authenticator apps or hardware security keys',
              value: 5 
            }
          ]
        },
        {
          id: 'device_security',
          text: 'How do you secure your devices?',
          description: 'Device-level security measures.',
          icon: Smartphone,
          options: [
            { 
              id: 'minimal',
              text: 'Minimal security',
              description: 'No screen lock or basic PIN only',
              value: 0 
            },
            { 
              id: 'basic',
              text: 'Basic protection',
              description: 'Screen lock with simple password/pattern',
              value: 2 
            },
            { 
              id: 'enhanced',
              text: 'Enhanced security',
              description: 'Strong passwords and some encryption',
              value: 4 
            },
            { 
              id: 'maximum',
              text: 'Maximum security',
              description: 'Full device encryption, biometrics, and remote wipe capability',
              value: 5 
            }
          ]
        },
        {
          id: 'network_security',
          text: 'How do you secure your home network?',
          description: 'Network security practices for your home Wi-Fi.',
          icon: Wifi,
          options: [
            { 
              id: 'default',
              text: 'Default settings',
              description: 'Using default router settings and password',
              value: 0 
            },
            { 
              id: 'changed_password',
              text: 'Changed password',
              description: 'Changed default password but kept other settings',
              value: 2 
            },
            { 
              id: 'wpa2',
              text: 'WPA2 security',
              description: 'Using WPA2 with strong password',
              value: 4 
            },
            { 
              id: 'advanced',
              text: 'Advanced security',
              description: 'WPA3, guest network, firewall, and regular updates',
              value: 5 
            }
          ]
        },
        {
          id: 'software_updates',
          text: 'How do you manage software updates?',
          description: 'Keeping software and devices updated with security patches.',
          icon: Globe,
          options: [
            { 
              id: 'ignore',
              text: 'Ignore updates',
              description: 'Rarely or never update software',
              value: 0 
            },
            { 
              id: 'eventually',
              text: 'Eventually update',
              description: 'Update after multiple reminders',
              value: 2 
            },
            { 
              id: 'regular',
              text: 'Regular updates',
              description: 'Update most software regularly',
              value: 4 
            },
            { 
              id: 'automatic',
              text: 'Automatic updates',
              description: 'Enable automatic updates for all software and devices',
              value: 5 
            }
          ]
        }
      ];
  };

  const questions = getTranslatedQuestions();

  const handleStart = () => {
    setStarted(true);
  };

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    let totalScore = 0;
    let maxPossibleScore = 0;
    const categoryScores: Record<string, number> = {};
    
    // Group questions by category
    const categories: Record<string, string[]> = {
      'Password Management': ['password_security', 'two_factor'],
      'Device Security': ['device_security', 'software_updates'],
      'Network Protection': ['network_security'],
      'Access Monitoring': ['login_monitoring', 'security_monitoring'],
      'App Security': ['app_permissions']
    };
    
    // Calculate overall score
    questions.forEach(question => {
      const answer = answers[question.id];
      const option = question.options.find(opt => opt.id === answer);
      if (option) {
        totalScore += option.value;
      }
      // Find max possible value for this question
      const maxValue = Math.max(...question.options.map(opt => opt.value));
      maxPossibleScore += maxValue;
    });
    
    // Calculate category scores
    Object.entries(categories).forEach(([category, questionIds]) => {
      let categoryTotal = 0;
      let categoryMaxPossible = 0;
      
      questionIds.forEach(questionId => {
        const question = questions.find(q => q.id === questionId);
        if (question) {
          const answer = answers[questionId];
          const option = question.options.find(opt => opt.id === answer);
          if (option) {
            categoryTotal += option.value;
          }
          // Find max possible value for this question
          const maxValue = Math.max(...question.options.map(opt => opt.value));
          categoryMaxPossible += maxValue;
        }
      });
      
      if (categoryMaxPossible > 0) {
        categoryScores[category] = Math.round((categoryTotal / categoryMaxPossible) * 100);
      } else {
        categoryScores[category] = 0;
      }
    });

    const overallScore = Math.round((totalScore / maxPossibleScore) * 100);
    
    const results = {
      overallScore,
      categoryScores,
      details: answers,
      recommendations: getRecommendations(answers, categoryScores),
      priorityAreas: getPriorityAreas(categoryScores)
    };
    
    if (onComplete) {
      onComplete(results);
    } else {
      navigate('/assessment/results', { 
        state: { 
          results,
          type: 'security'
        },
        replace: true
      });
    }
  };

  const getPriorityAreas = (categoryScores: Record<string, number>): string[] => {
    // Return categories with scores below 60 as priority areas
    return Object.entries(categoryScores)
      .filter(([_, score]) => score < 60)
      .map(([category]) => category)
      .sort((a, b) => categoryScores[a] - categoryScores[b]); // Sort by lowest score first
  };

  const getRecommendations = (userAnswers: Record<string, string>, categoryScores: Record<string, number>): string[] => {
    const recommendations: string[] = [];
    const addedRecommendations = new Set<string>(); // To avoid duplicates
    
    // Add recommendations based on low category scores first
    Object.entries(categoryScores)
      .filter(([_, score]) => score < 60)
      .sort((a, b) => a[1] - b[1]) // Sort by lowest score first
      .forEach(([category]) => {
        let rec = '';
        
        switch(category) {
          case 'Password Management':
            rec = 'Implement a password manager and use strong, unique passwords for all accounts';
            break;
          case 'Device Security':
            rec = 'Enhance device security with strong encryption and biometrics';
            break;
          case 'Network Protection':
            rec = 'Upgrade your home network security with WPA3, strong passwords, and regular firmware updates';
            break;
          case 'Access Monitoring':
            rec = 'Set up proactive login monitoring and alerts';
            break;
          case 'App Security':
            rec = 'Regularly audit and restrict third-party app permissions';
            break;
        }
        
        if (rec && !addedRecommendations.has(rec)) {
          recommendations.push(rec);
          addedRecommendations.add(rec);
        }
      });
    
    // Add specific recommendations based on individual question answers
    Object.entries(userAnswers).forEach(([questionId, answerId]) => {
      const question = questions.find(q => q.id === questionId);
      const option = question?.options.find(o => o.id === answerId);
      
      if (option && option.value < 3) {
        let recommendation = '';
        
        switch (questionId) {
          case 'password_security':
            recommendation = 'Use a password manager with strong, unique passwords for all accounts';
            break;
          case 'two_factor':
            recommendation = 'Enable two-factor authentication with an authenticator app on all important accounts';
            break;
          case 'device_security':
            recommendation = 'Implement stronger device security measures including encryption and biometric authentication';
            break;
          case 'network_security':
            recommendation = 'Upgrade your home network security with WPA3, strong passwords, and regular firmware updates';
            break;
          case 'software_updates':
            recommendation = 'Set up automatic updates for all your devices and software to ensure security patches are applied';
            break;
        }
        
        if (recommendation && !addedRecommendations.has(recommendation)) {
          recommendations.push(recommendation);
          addedRecommendations.add(recommendation);
        }
      }
    });
    
    // Limit to top 5 recommendations to avoid overwhelming the user
    return recommendations.slice(0, 5);
  };

  const currentQ = questions[currentQuestion];

  if (!started) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8">
        <div className="text-center">
          <Shield className="h-16 w-16 text-accent mx-auto mb-8" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {'Security Assessment'}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            {'Comprehensive security evaluation covering all aspects of your digital privacy'}
          </p>
          <button
            onClick={handleStart}
            className="inline-flex items-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors text-lg font-medium"
          >
            {'Start Assessment'}
          </button>
        </div>
      </div>
    );
  }

  // Translation helpers
  const getTranslatedPrevious = () => {
    return "Previous";
  };

  const getTranslatedNext = () => {
    return "Next";
  };

  const getTranslatedComplete = () => {
    return "Complete";
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="p-6">
        <ProgressBar 
          currentStep={currentQuestion + 1} 
          totalSteps={questions.length} 
        />

        <div className="mb-8">
          <div className="flex items-start">
            <div className="p-2 bg-accent/10 rounded-full mr-3">
              <currentQ.icon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">{currentQ.text}</h3>
              <p className="text-gray-600">{currentQ.description}</p>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {currentQ.options.map(option => (
              <motion.div
                key={option.id}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  answers[currentQ.id] === option.id
                    ? 'border-accent bg-light-blue'
                    : 'border-gray-200 hover:border-accent/50 hover:bg-light-blue/50'
                } border`}
                onClick={() => handleAnswer(currentQ.id, option.id)}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                    answers[currentQ.id] === option.id
                      ? 'border-accent bg-accent'
                      : 'border-gray-400'
                  }`}>
                    {answers[currentQ.id] === option.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-white"
                      />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-primary">{option.text}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            {getTranslatedPrevious()}
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!answers[currentQ.id]}
          >
            {currentQuestion === questions.length - 1 ? getTranslatedComplete() : getTranslatedNext()}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SecurityAssessment;