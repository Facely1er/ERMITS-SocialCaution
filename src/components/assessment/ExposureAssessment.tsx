import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, Key, Share2, Smartphone, Eye, AlertTriangle, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import ExposureStartScreen from './ExposureStartScreen';

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
    risk?: 'high' | 'medium' | 'low' | 'none';
  }[];
  standards?: {
    name: string;
    description: string;
  }[];
}

interface ExposureAssessmentProps {
  onComplete?: (results: any) => void;
  navigate?: (path: string, options?: any) => void;
}

const ExposureAssessment: React.FC<ExposureAssessmentProps> = ({ onComplete, navigate }) => {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showTip, setShowTip] = useState<string | null>(null);

  // Get questions
  const getTranslatedQuestions = (): Question[] => {
    return [
        {
          id: 'public_wifi',
          text: 'How often do you use public Wi-Fi networks?',
          description: 'Public Wi-Fi includes networks in coffee shops, airports, hotels, and other public places.',
          icon: Wifi,
          options: [
            {
              id: 'frequently',
              text: 'Frequently',
              description: 'Several times a week (coffee shops, airports, hotels)',
              value: 0,
              risk: 'high'
            },
            {
              id: 'occasionally',
              text: 'Occasionally',
              description: 'A few times a month when convenient',
              value: 2,
              risk: 'medium'
            },
            {
              id: 'rarely',
              text: 'Rarely',
              description: 'Only in emergencies when no alternatives exist',
              value: 4,
              risk: 'low'
            },
            {
              id: 'never',
              text: 'Never',
              description: 'I only use my home network or mobile data',
              value: 5,
              risk: 'none'
            }
          ],
          standards: [
            {
              name: 'ISO 27001',
              description: 'Network and Communications Security'
            },
            {
              name: 'NIST SP 800-48',
              description: 'Wireless Network Security'
            }
          ]
        },
        {
          id: 'vpn_usage',
          text: 'When using public Wi-Fi, do you use a VPN (Virtual Private Network)?',
          description: 'A VPN creates a secure, encrypted connection for your internet traffic.',
          icon: Wifi,
          options: [
            {
              id: 'always',
              text: 'Always',
              description: 'I never connect to public Wi-Fi without a VPN',
              value: 5,
              risk: 'none'
            },
            {
              id: 'sometimes',
              text: 'Sometimes',
              description: 'I use a VPN when handling sensitive information',
              value: 3,
              risk: 'low'
            },
            {
              id: 'rarely',
              text: 'Rarely',
              description: 'I occasionally use a VPN if I remember',
              value: 1,
              risk: 'medium'
            },
            {
              id: 'never',
              text: 'Never',
              description: 'I don\'t use a VPN or don\'t know what it is',
              value: 0,
              risk: 'high'
            }
          ],
          standards: [
            {
              name: 'NIST SP 800-77',
              description: 'Guide to Virtual Private Networks'
            }
          ]
        },
        {
          id: 'password_management',
          text: 'How do you manage your passwords?',
          description: 'Your password strategy is a critical element of your online security.',
          icon: Key,
          options: [
            {
              id: 'same',
              text: 'Same Password',
              description: 'I use the same or similar passwords for most accounts',
              value: 0,
              risk: 'high'
            },
            {
              id: 'variations',
              text: 'Few Variations',
              description: 'I use a few different passwords with small variations',
              value: 1,
              risk: 'medium'
            },
            {
              id: 'important_unique',
              text: 'Important Accounts Only',
              description: 'I use unique passwords only for important accounts',
              value: 3,
              risk: 'low'
            },
            {
              id: 'all_unique',
              text: 'All Unique',
              description: 'I use unique strong passwords for all accounts',
              value: 5,
              risk: 'none'
            }
          ],
          standards: [
            {
              name: 'NIST SP 800-63B',
              description: 'Digital Identity Guidelines'
            },
            {
              name: 'CIS Controls',
              description: 'Control 4: Secure Configuration Management'
            }
          ]
        },
        {
          id: 'password_manager',
          text: 'Do you use a password manager?',
          description: 'Password managers securely store all your passwords in an encrypted vault.',
          icon: Key,
          options: [
            {
              id: 'dedicated',
              text: 'Dedicated Password Manager',
              description: 'I use a dedicated password manager (1Password, LastPass, Bitwarden, etc.)',
              value: 5,
              risk: 'none'
            },
            {
              id: 'browser',
              text: 'Browser Built-in',
              description: 'I use my browser\'s built-in password manager',
              value: 3,
              risk: 'low'
            },
            {
              id: 'notes',
              text: 'Notes or Document',
              description: 'I keep passwords in notes, document, or physical list',
              value: 1,
              risk: 'medium'
            },
            {
              id: 'memory',
              text: 'Memory Only',
              description: 'I remember all my passwords without storing them',
              value: 0,
              risk: 'high'
            }
          ],
          standards: [
            {
              name: 'NIST SP 800-63B',
              description: 'Digital Identity Guidelines'
            }
          ]
        },
        {
          id: 'app_permissions',
          text: 'How do you approach app permissions when installing new apps?',
          description: 'App permissions determine what data and device functions an app can access.',
          icon: Share2,
          options: [
            {
              id: 'accept_all',
              text: 'Accept All',
              description: 'I typically accept all permission requests without reviewing',
              value: 0,
              risk: 'high'
            },
            {
              id: 'quick_review',
              text: 'Quick Glance',
              description: 'I quickly review permissions but usually accept most',
              value: 1,
              risk: 'medium'
            },
            {
              id: 'careful_review',
              text: 'Careful Review',
              description: 'I carefully review and often deny unnecessary permissions',
              value: 3,
              risk: 'low'
            },
            {
              id: 'minimum_required',
              text: 'Minimum Required',
              description: 'I only allow absolutely necessary permissions and regularly audit them',
              value: 5,
              risk: 'none'
            }
          ],
          standards: [
            {
              name: 'OWASP Mobile Top 10',
              description: 'M1: Improper Platform Usage'
            },
            {
              name: 'GDPR',
              description: 'Data Minimization Principle'
            }
          ]
        },
        {
          id: 'device_security',
          text: 'How do you secure your mobile devices?',
          description: 'Your device security is the first line of defense in protecting your personal data.',
          icon: Smartphone,
          options: [
            {
              id: 'no_lock',
              text: 'No Lock',
              description: 'I don\'t use screen lock methods on my devices',
              value: 0,
              risk: 'high'
            },
            {
              id: 'simple_pin',
              text: 'Simple PIN',
              description: 'I use a simple PIN code or unlock pattern',
              value: 1,
              risk: 'medium'
            },
            {
              id: 'complex_password',
              text: 'Complex Password',
              description: 'I use a complex password or long PIN code',
              value: 3,
              risk: 'low'
            },
            {
              id: 'biometric',
              text: 'Biometric + Password',
              description: 'I use biometric methods (fingerprint, face) with a backup password',
              value: 5,
              risk: 'none'
            }
          ],
          standards: [
            {
              name: 'NIST SP 800-124',
              description: 'Mobile Device Security'
            }
          ]
        },
        {
          id: 'tracking_protection',
          text: 'What measures do you take to limit online tracking?',
          description: 'Online trackers collect data about your browsing behavior to create detailed profiles.',
          icon: Eye,
          options: [
            {
              id: 'no_protection',
              text: 'No Protection',
              description: 'I don\'t use any tools or settings to block tracking',
              value: 0,
              risk: 'high'
            },
            {
              id: 'browser_settings',
              text: 'Basic Settings',
              description: 'I use basic browser settings to block some trackers',
              value: 2,
              risk: 'medium'
            },
            {
              id: 'privacy_extensions',
              text: 'Privacy Extensions',
              description: 'I use browser extensions dedicated to privacy protection',
              value: 4,
              risk: 'low'
            },
            {
              id: 'comprehensive',
              text: 'Comprehensive Protection',
              description: 'I use a privacy-focused browser and multiple protection tools',
              value: 5,
              risk: 'none'
            }
          ],
          standards: [
            {
              name: 'GDPR',
              description: 'Tracking consent and user rights'
            },
            {
              name: 'ePrivacy',
              description: 'Rules on cookies and online tracking'
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
    
    // Show tip based on selected option
    const question = questions.find(q => q.id === questionId);
    const option = question?.options.find(o => o.id === optionId);
    
    if (option && option.risk && option.risk !== 'none') {
      setShowTip(questionId);
    } else {
      setShowTip(null);
    }
  };

  const handleNext = () => {
    setShowTip(null);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    setShowTip(null);
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    let totalScore = 0;
    const maxScore = questions.length * 5;
    const categoryScores: Record<string, number> = {};
    
    // Group questions by category
    const categories: Record<string, string[]> = {
      'Network Security': ['public_wifi', 'vpn_usage'],
      'Password Security': ['password_management', 'password_manager'],
      'Data Sharing': ['app_permissions'],
      'Device Security': ['device_security'],
      'Online Presence': ['tracking_protection']
    };
    
    // Calculate overall score
    Object.entries(answers).forEach(([questionId, answerId]) => {
      const question = questions.find(q => q.id === questionId);
      const option = question?.options.find(o => o.id === answerId);
      if (option) {
        totalScore += option.value;
      }
    });
    
    // Calculate category scores
    Object.entries(categories).forEach(([category, questionIds]) => {
      let categoryTotal = 0;
      let answeredQuestions = 0;
      
      questionIds.forEach(questionId => {
        if (answers[questionId]) {
          const question = questions.find(q => q.id === questionId);
          const option = question?.options.find(o => o.id === answers[questionId]);
          if (option) {
            categoryTotal += option.value;
            answeredQuestions++;
          }
        }
      });
      
      if (answeredQuestions > 0) {
        categoryScores[category] = Math.round((categoryTotal / (answeredQuestions * 5)) * 100);
      } else {
        categoryScores[category] = 0;
      }
    });

    const overallScore = Math.round((totalScore / maxScore) * 100);
    
    const results = {
      overallScore,
      categoryScores,
      details: answers,
      recommendations: getRecommendations(answers, categoryScores),
      priorityAreas: getPriorityAreas(categoryScores)
    };
    
    if (onComplete) {
      onComplete(results);
    } else if (navigate) {
      navigate('/assessment/results', { 
        state: { 
          results,
          type: 'exposure'
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
          case 'Network Security':
            rec = 'Use a VPN service when connecting to public Wi-Fi networks';
            break;
          case 'Password Security':
            rec = 'Use a password manager and unique strong passwords for all accounts';
            break;
          case 'Data Sharing':
            rec = 'Review and limit app permissions and social media privacy settings';
            break;
          case 'Device Security':
            rec = 'Strengthen your device security with strong authentication and encryption';
            break;
          case 'Online Presence':
            rec = 'Reduce your digital footprint and implement tracking protection';
            break;
        }
        
        if (rec && !addedRecommendations.has(rec)) {
          recommendations.push(rec);
          addedRecommendations.add(rec);
        }
      });
    
    // Add specific recommendations based on individual answers
    Object.entries(userAnswers).forEach(([questionId, answerId]) => {
      let rec = '';
      
      if (questionId === 'public_wifi' && answerId === 'frequently') {
        rec = 'Avoid using public Wi-Fi for sensitive activities like banking or shopping';
      } else if (questionId === 'vpn_usage' && answerId === 'never') {
        rec = 'Start using a reliable VPN to protect your internet traffic on public networks';
      } else if (questionId === 'password_management' && (answerId === 'same' || answerId === 'variations')) {
        rec = 'Create unique passwords for all your accounts, especially for sensitive accounts';
      } else if (questionId === 'device_security' && (answerId === 'no_lock' || answerId === 'simple_pin')) {
        rec = 'Implement stronger authentication on your devices with biometrics and a complex password';
      }
      
      if (rec && !addedRecommendations.has(rec)) {
        recommendations.push(rec);
        addedRecommendations.add(rec);
      }
    });
    
    return recommendations;
  };

  const getSecurityTip = (questionId: string): string => {
    const question = questions.find(q => q.id === questionId);
    const answer = answers[questionId];
    const option = question?.options.find(o => o.id === answer);
    
    if (option && option.risk === 'high') {
      switch(questionId) {
        case 'public_wifi':
          return 'Regularly using public Wi-Fi networks without protection exposes your data. Consider using a VPN or prefer your cellular network for sensitive activities.';
        case 'vpn_usage':
          return 'Without a VPN, your data on public networks is vulnerable to interception. Use a reliable VPN service to encrypt your connection.';
        case 'password_management':
          return 'Using the same password everywhere creates a single point of failure. If one service is compromised, all your accounts are at risk.';
        case 'app_permissions':
          return 'Granting all permissions without verification can compromise your privacy and security. Apps can access your contacts, location, and more.';
        default:
          return 'This practice presents a high risk to your online security. Consider safer alternatives.';
      }
    } else if (option && option.risk === 'medium') {
      return 'This practice presents a moderate risk. A few simple improvements could significantly strengthen your security.';
    } else if (option && option.risk === 'low') {
      return 'Good practice, but there is still room for improvement for optimal security.';
    }
    
    return '';
  };
  
  const getQuestionProgress = (): string => {
    const progress = `${currentQuestion + 1}/${questions.length}`;
    return `Question ${progress}`;
  };
  
  const getNextButtonText = (): string => {
    if (currentQuestion < questions.length - 1) {
      return 'Next';
    } else {
      return 'Finish';
    }
  };
  
  const getPreviousButtonText = (): string => {
    return 'Previous';
  };
  
  const getAssessmentTitle = (): string => {
    return 'Cybersecurity Exposure Assessment';
  };

  if (!started) {
    return <ExposureStartScreen onStart={handleStart} />;
  }

  const currentQuestionData = questions[currentQuestion];
  const Icon = currentQuestionData.icon;

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center text-sm mb-3">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {getQuestionProgress()}
          </span>
          <span className="font-semibold text-accent">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
          <motion.div 
            className="bg-accent h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <Card className="mb-8 p-8 md:p-10">
        <div className="flex items-start mb-8">
          <div className="p-3 bg-accent/10 rounded-lg mr-4 flex-shrink-0">
            <Icon size={28} className="text-accent" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
              {currentQuestionData.text}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg">{currentQuestionData.description}</p>
          </div>
        </div>

        <div className="space-y-3">
          {currentQuestionData.options.map((option) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full p-5 rounded-lg text-left transition-all duration-200 ${
                answers[currentQuestionData.id] === option.id 
                  ? 'bg-accent/10 dark:bg-accent/20 border-2 border-accent shadow-md' 
                  : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-accent/50 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              onClick={() => handleAnswer(currentQuestionData.id, option.id)}
            >
              <div className="flex items-start">
                <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  answers[currentQuestionData.id] === option.id
                    ? 'bg-accent'
                    : 'border-2 border-slate-400 dark:border-slate-600'
                }`}>
                  {answers[currentQuestionData.id] === option.id && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-medium text-lg ${
                      answers[currentQuestionData.id] === option.id
                        ? 'text-accent dark:text-accent'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {option.text}
                    </span>
                    {option.risk && (
                      <Badge 
                        variant={
                          option.risk === 'high' ? 'danger' : 
                          option.risk === 'medium' ? 'warning' : 
                          option.risk === 'low' ? 'success' : 'success'
                        }
                        className="ml-3 flex-shrink-0"
                      >
                        {option.risk === 'high' 
                          ? ('High Risk')
                          : option.risk === 'medium' 
                          ? ('Medium Risk')
                          : option.risk === 'low' 
                          ? ('Low Risk')
                          : ('No Risk')
                        }
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{option.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {showTip === currentQuestionData.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <div className="flex items-start">
              <AlertTriangle size={20} className="text-amber-500 mr-2 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">
                  {'Security Tip'}
                </h3>
                <p className="text-sm text-amber-700 mt-1">{getSecurityTip(currentQuestionData.id)}</p>
              </div>
            </div>
          </motion.div>
        )}

        {currentQuestionData.standards && (
          <div className="mt-6 text-xs text-gray-500">
            <p className="mb-1 font-medium">
                {'Relevant Standards:'}
            </p>
            <ul className="list-disc list-inside space-y-1">
              {currentQuestionData.standards.map((standard, index) => (
                <li key={index}>
                  <span className="font-medium">{standard.name}</span>: {standard.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700 mt-8">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-3 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>{getPreviousButtonText()}</span>
        </Button>
        <Button 
          variant="primary" 
          onClick={handleNext}
          disabled={!answers[currentQuestionData.id]}
          className="px-6 py-3 flex items-center space-x-2 font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <span>{getNextButtonText()}</span>
          {currentQuestion < questions.length - 1 && (
            <ArrowRight size={18} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ExposureAssessment;