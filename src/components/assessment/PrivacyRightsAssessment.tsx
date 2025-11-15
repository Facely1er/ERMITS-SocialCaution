import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Globe, Database, Info, Edit, Trash, SlidersHorizontal, Hand as HandStop, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import PrivacyRightsStartScreen from './PrivacyRightsStartScreen';

interface Question {
  id: string;
  text: string;
  icon: React.ElementType;
  description: string;
  options: {
    id: string;
    text: string;
    description: string;
    value: number;
  }[];
  standards?: {
    name: string;
    description: string;
  }[];
}

interface PrivacyRightsAssessmentProps {
  onComplete?: (results: any) => void;
}

const PrivacyRightsAssessment: React.FC<PrivacyRightsAssessmentProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Get questions
  const getTranslatedQuestions = (): Question[] => {
    return [
        {
          id: 'be_informed',
          text: 'How often do you read privacy policies?',
          icon: Info,
          description: 'Understanding how your data is collected and used',
          options: [
            { id: 'never', text: 'Never', description: 'I don\'t read privacy policies', value: 0 },
            { id: 'rarely', text: 'Rarely', description: 'I rarely read privacy policies', value: 1 },
            { id: 'sometimes', text: 'Sometimes', description: 'I sometimes read privacy policies', value: 2 },
            { id: 'often', text: 'Often', description: 'I often read privacy policies', value: 3 },
            { id: 'always', text: 'Always', description: 'I always read privacy policies', value: 4 }
          ],
          standards: [
            {
              name: 'GDPR',
              description: 'Right to Information and Transparency'
            },
            {
              name: 'CCPA/CPRA',
              description: 'Right to Know What Information is Collected'
            }
          ]
        },
        {
          id: 'access',
          text: 'How frequently do you request your personal data?',
          icon: Database,
          description: 'Exercising your right to access your personal information',
          options: [
            { id: 'never', text: 'Never', description: 'I never request my personal data', value: 0 },
            { id: 'once_year', text: 'Once a year', description: 'I request my data about once a year', value: 1 },
            { id: 'occasionally', text: 'Occasionally', description: 'I occasionally request my data when needed', value: 2 },
            { id: 'often', text: 'Often', description: 'I often request my data from services I use', value: 3 },
            { id: 'always', text: 'Always', description: 'I regularly request data from all services', value: 4 }
          ],
          standards: [
            {
              name: 'GDPR',
              description: 'Right of Access to Data'
            },
            {
              name: 'CCPA/CPRA',
              description: 'Right to Know and Access'
            }
          ]
        },
        {
          id: 'rectification',
          text: 'What do you do when you find inaccurate personal information?',
          icon: Edit,
          description: 'Correcting errors in your personal data',
          options: [
            { id: 'ignore', text: 'Ignore it', description: 'I don\'t take any action', value: 0 },
            { id: 'fix_later', text: 'Fix later', description: 'I plan to fix it but often forget', value: 1 },
            { id: 'fix_major', text: 'Fix major errors', description: 'I fix only significant errors', value: 2 },
            { id: 'fix_all', text: 'Fix all issues', description: 'I fix all inaccuracies I find', value: 3 },
            { id: 'fix_immediately', text: 'Fix all immediately', description: 'I immediately correct any errors I find', value: 4 }
          ],
          standards: [
            {
              name: 'GDPR',
              description: 'Right to Rectification'
            }
          ]
        },
        {
          id: 'erasure',
          text: 'How do you manage unused online accounts?',
          icon: Trash,
          description: 'Removing your data when no longer needed',
          options: [
            { id: 'never_delete', text: 'Never delete', description: 'I keep all accounts indefinitely', value: 0 },
            { id: 'delete_yearly', text: 'Delete yearly', description: 'I do an annual cleanup', value: 1 },
            { id: 'delete_needed', text: 'Delete when needed', description: 'I delete accounts when I remember', value: 2 },
            { id: 'proactive_delete', text: 'Proactively delete', description: 'I regularly delete unused accounts', value: 3 },
            { id: 'delete_request', text: 'Delete + request removal', description: 'I delete accounts and request data removal', value: 4 }
          ],
          standards: [
            {
              name: 'GDPR',
              description: 'Right to Erasure (Right to be Forgotten)'
            },
            {
              name: 'CCPA/CPRA',
              description: 'Right to Delete'
            }
          ]
        },
        {
          id: 'restriction',
          text: 'How do you handle app and site privacy settings?',
          icon: SlidersHorizontal,
          description: 'Limiting how your data is processed',
          options: [
            { id: 'ignore_defaults', text: 'Ignore defaults', description: 'I use default settings', value: 0 },
            { id: 'set_key', text: 'Set for key apps', description: 'I adjust settings for important apps only', value: 1 },
            { id: 'set_most', text: 'Set for most', description: 'I adjust settings for most apps', value: 2 },
            { id: 'audit_regularly', text: 'Audit regularly', description: 'I regularly review all privacy settings', value: 3 },
            { id: 'use_tools', text: 'Use privacy tools', description: 'I use specialized tools to manage privacy', value: 4 }
          ],
          standards: [
            {
              name: 'GDPR',
              description: 'Right to Restriction of Processing'
            }
          ]
        },
        {
          id: 'object',
          text: 'How do you handle personalized ads?',
          icon: HandStop,
          description: 'Objecting to certain types of data processing',
          options: [
            { id: 'accept_all', text: 'Accept all', description: 'I accept all personalized advertising', value: 0 },
            { id: 'opt_out_sometimes', text: 'Opt out sometimes', description: 'I occasionally opt out of personalization', value: 1 },
            { id: 'block_key', text: 'Block key trackers', description: 'I block major tracking services', value: 2 },
            { id: 'use_blockers', text: 'Use ad blockers', description: 'I use ad blockers on most devices', value: 3 },
            { id: 'block_everything', text: 'Block everything', description: 'I use comprehensive blocking tools', value: 4 }
          ],
          standards: [
            {
              name: 'GDPR',
              description: 'Right to Object to Processing'
            },
            {
              name: 'CCPA/CPRA',
              description: 'Right to Opt-Out of Sale/Sharing'
            }
          ]
        },
        {
          id: 'portability',
          text: 'How do you manage data portability?',
          icon: ArrowRight,
          description: 'Moving your data between different services',
          options: [
            { id: 'never', text: 'Never', description: 'I never transfer my data between services', value: 0 },
            { id: 'rarely', text: 'Rarely', description: 'I rarely use data portability features', value: 1 },
            { id: 'sometimes', text: 'Sometimes', description: 'I sometimes transfer my data', value: 2 },
            { id: 'often', text: 'Often', description: 'I often use data portability options', value: 3 },
            { id: 'always', text: 'Always', description: 'I always use data portability when available', value: 4 }
          ],
          standards: [
            {
              name: 'GDPR',
              description: 'Right to Data Portability'
            }
          ]
        },
        {
          id: 'security',
          text: 'How do you protect your online accounts?',
          icon: Shield,
          description: 'Securing your personal information',
          options: [
            { id: 'same_password', text: 'Same password', description: 'I use the same password everywhere', value: 0 },
            { id: 'few_variations', text: 'Few variations', description: 'I use a few different passwords', value: 1 },
            { id: 'password_manager', text: 'Password manager', description: 'I use a password manager', value: 2 },
            { id: '2fa_major', text: '2FA on major', description: 'I use two-factor auth on important accounts', value: 3 },
            { id: '2fa_all', text: '2FA on all', description: 'I use two-factor auth on all possible accounts', value: 4 }
          ],
          standards: [
            {
              name: 'GDPR',
              description: 'Security of Processing'
            },
            {
              name: 'NIST',
              description: 'Digital Identity Guidelines'
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
    const maxScore = questions.length * 4; // Each question has a max value of 4
    const categoryScores: Record<string, number> = {};
    
    // Group questions by category
    const categories: Record<string, string[]> = {
      'Data Protection': ['be_informed', 'access'],
      'Privacy Controls': ['restriction', 'object'],
      'Data Management': ['rectification', 'erasure', 'portability'],
      'Security': ['security']
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
        // Calculate percentage based on max value of 4 per question
        categoryScores[category] = Math.round((categoryTotal / (answeredQuestions * 4)) * 100);
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
    } else {
      navigate('/assessment/results', { 
        state: { 
          results,
          type: 'rights'
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
          case 'Data Protection':
            rec = 'Regularly review privacy policies and request your data to understand what information companies have about you';
            break;
          case 'Privacy Controls':
            rec = 'Take time to adjust privacy settings on all your apps and services, and opt out of personalized advertising';
            break;
          case 'Data Management':
            rec = 'Regularly clean up your digital footprint by correcting inaccurate information and deleting unused accounts';
            break;
          case 'Security':
            rec = 'Implement stronger security measures like password managers and two-factor authentication';
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
      
      if (option && option.value < 2) {
        let recommendation = '';
        
        switch (questionId) {
          case 'be_informed':
            recommendation = 'Start reading privacy policies for services you use regularly to understand how your data is being used';
            break;
          case 'access':
            recommendation = 'Exercise your right to access by requesting your data from major services you use';
            break;
          case 'rectification':
            recommendation = 'Regularly check your personal information for accuracy and correct any errors';
            break;
          case 'erasure':
            recommendation = 'Identify and delete unused accounts to reduce your digital footprint';
            break;
          case 'restriction':
            recommendation = 'Review and adjust privacy settings across all your apps and online services';
            break;
          case 'object':
            recommendation = 'Opt out of personalized advertising and consider using ad blockers';
            break;
          case 'portability':
            recommendation = 'Use data portability features to maintain control of your information when switching services';
            break;
          case 'security':
            recommendation = 'Implement a password manager and enable two-factor authentication on all important accounts';
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

  if (!started) {
    return <PrivacyRightsStartScreen onStart={handleStart} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 35, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-primary/8 to-accent/8 rounded-full blur-3xl"
        />
      </div>

      <Card className="max-w-4xl mx-auto relative z-10 overflow-hidden">
        {/* Enhanced Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-primary/3 to-accent/5" />
        
        {/* Floating Particles */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent/40 rounded-full"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-primary/30 rounded-full"
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
        />

        <div className="p-8 relative z-10">
          {/* Enhanced Progress Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <motion.span 
                className="text-sm font-semibold text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                Question {currentQuestion + 1} of {questions.length}
              </motion.span>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Badge variant="primary" className="text-sm font-bold px-4 py-2">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
                </Badge>
              </motion.div>
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-accent via-accent/90 to-primary rounded-full relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="absolute inset-0 assessment-shimmer" />
              </motion.div>
            </div>
          </div>

          {/* Enhanced Question Section */}
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-start mb-8">
              <motion.div 
                className="p-4 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl mr-6 flex-shrink-0 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                animate={{ 
                  boxShadow: [
                    "0 4px 15px rgba(255, 107, 53, 0.2)",
                    "0 8px 25px rgba(255, 107, 53, 0.3)",
                    "0 4px 15px rgba(255, 107, 53, 0.2)"
                  ]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <currentQ.icon className="h-8 w-8 text-accent" />
              </motion.div>
              <div className="flex-1">
                <motion.h3 
                  className="text-2xl font-bold text-primary dark:text-white mb-3 leading-tight"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {currentQ.text}
                </motion.h3>
                <motion.p 
                  className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {currentQ.description}
                </motion.p>
              </div>
            </div>

            {/* Enhanced Answer Options */}
            <div className="space-y-4">
              {currentQ.options.map((option, index) => (
                <motion.div
                  key={option.id}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 group relative overflow-hidden ${
                    answers[currentQ.id] === option.id
                      ? 'border-2 border-accent bg-gradient-to-r from-accent/10 to-accent/5 shadow-lg'
                      : 'border-2 border-gray-200 dark:border-gray-700 hover:border-accent/50 hover:bg-gradient-to-r hover:from-accent/5 hover:to-transparent hover:shadow-md'
                  }`}
                  onClick={() => handleAnswer(currentQ.id, option.id)}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ y: -2, scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {/* Selection Indicator Background */}
                  {answers[currentQ.id] === option.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  
                  <div className="flex items-center relative z-10">
                    <motion.div 
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 transition-all duration-300 ${
                        answers[currentQ.id] === option.id
                          ? 'border-accent bg-gradient-to-r from-accent to-accent/80 shadow-lg'
                          : 'border-gray-400 dark:border-gray-500 group-hover:border-accent/70'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {answers[currentQ.id] === option.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2, type: "spring", stiffness: 200 }}
                          className="w-3 h-3 rounded-full bg-white"
                        />
                      )}
                    </motion.div>
                    <div className="flex-1">
                      <motion.div 
                        className={`font-semibold text-lg mb-1 transition-colors duration-300 ${
                          answers[currentQ.id] === option.id
                            ? 'text-accent dark:text-accent'
                            : 'text-primary dark:text-white group-hover:text-accent'
                        }`}
                        whileHover={{ x: 5 }}
                      >
                        {option.text}
                      </motion.div>
                      <motion.div 
                        className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
                        whileHover={{ x: 5 }}
                      >
                        {option.description}
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Standards Section */}
          {currentQ.standards && (
            <motion.div 
              className="mb-8 p-6 bg-gradient-to-r from-slate-50/80 to-slate-100/80 dark:from-slate-800/60 dark:to-slate-700/60 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center mb-4">
                <motion.div
                  className="p-2 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl mr-3"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Globe className="h-5 w-5 text-accent" />
                </motion.div>
                <h4 className="font-bold text-lg text-primary dark:text-white">Standards & Regulations</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQ.standards.map((standard, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 5, scale: 1.02 }}
                  >
                    <motion.div
                      className="p-1.5 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg mr-3 flex-shrink-0"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Globe className="h-4 w-4 text-accent" />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-sm text-primary dark:text-white mb-1">{standard.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{standard.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Enhanced Navigation */}
          <motion.div 
            className="flex justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`px-8 py-3 text-lg font-semibold border-2 transition-all duration-300 ${
                  currentQuestion === 0 
                    ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                    : 'border-accent text-accent hover:bg-accent hover:text-white hover:scale-105'
                }`}
              >
                {getTranslatedPrevious()}
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!answers[currentQ.id]}
                className={`px-8 py-3 text-lg font-bold bg-gradient-to-r from-accent to-primary text-white hover:from-accent/90 hover:to-primary/90 transition-all duration-300 flex items-center space-x-2 shadow-lg ${
                  !answers[currentQ.id] 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:scale-105 hover:shadow-xl'
                }`}
              >
                <span>{currentQuestion === questions.length - 1 ? getTranslatedComplete() : getTranslatedNext()}</span>
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PrivacyRightsAssessment;