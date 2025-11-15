import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertTriangle, XCircle, BarChart3, Target } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
interface AssessmentQuestion {
  id: string;
  question: string;
  category: 'data_protection' | 'privacy_settings' | 'online_behavior' | 'security';
  weight: number;
  options: {
    value: string;
    label: string;
    score: number;
  }[];
}

interface AssessmentResult {
  overallScore: number;
  categoryScores: {
    data_protection: number;
    privacy_settings: number;
    online_behavior: number;
    security: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

const PrivacyAssessmentTool: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const questions: AssessmentQuestion[] = [
    {
      id: 'data_sharing',
      question: 'Do you share your personal data with third-party applications?',
      category: 'data_protection',
      weight: 3,
      options: [
        { value: 'never', label: 'Never', score: 10 },
        { value: 'rarely', label: 'Rarely', score: 7 },
        { value: 'sometimes', label: 'Sometimes', score: 4 },
        { value: 'often', label: 'Often', score: 1 }
      ]
    },
    {
      id: 'privacy_settings',
      question: 'Do you regularly check the privacy settings of your accounts?',
      category: 'privacy_settings',
      weight: 2,
      options: [
        { value: 'monthly', label: 'Monthly', score: 10 },
        { value: 'quarterly', label: 'Quarterly', score: 7 },
        { value: 'yearly', label: 'Yearly', score: 4 },
        { value: 'never', label: 'Never', score: 0 }
      ]
    },
    {
      id: 'password_security',
      question: 'Do you use unique and strong passwords for each account?',
      category: 'security',
      weight: 3,
      options: [
        { value: 'always', label: 'Always', score: 10 },
        { value: 'mostly', label: 'Mostly', score: 7 },
        { value: 'sometimes', label: 'Sometimes', score: 4 },
        { value: 'rarely', label: 'Rarely', score: 1 }
      ]
    },
    {
      id: 'two_factor',
      question: 'Do you enable two-factor authentication when available?',
      category: 'security',
      weight: 2,
      options: [
        { value: 'always', label: 'Always', score: 10 },
        { value: 'important', label: 'For important accounts', score: 7 },
        { value: 'sometimes', label: 'Sometimes', score: 4 },
        { value: 'never', label: 'Never', score: 0 }
      ]
    },
    {
      id: 'public_wifi',
      question: 'Do you use public Wi-Fi networks for sensitive activities?',
      category: 'online_behavior',
      weight: 2,
      options: [
        { value: 'never', label: 'Never', score: 10 },
        { value: 'rarely', label: 'Rarely', score: 7 },
        { value: 'sometimes', label: 'Sometimes', score: 4 },
        { value: 'often', label: 'Often', score: 1 }
      ]
    },
    {
      id: 'data_backup',
      question: 'Do you regularly backup your important data?',
      category: 'data_protection',
      weight: 2,
      options: [
        { value: 'daily', label: 'Daily', score: 10 },
        { value: 'weekly', label: 'Weekly', score: 8 },
        { value: 'monthly', label: 'Monthly', score: 5 },
        { value: 'never', label: 'Never', score: 0 }
      ]
    }
  ];

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-red-600 dark:text-red-400';
    }
  };

  const getRiskIcon = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'medium': return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'high': return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
    }
  };

  const calculateResult = (): AssessmentResult => {
    const categoryScores = {
      data_protection: 0,
      privacy_settings: 0,
      online_behavior: 0,
      security: 0
    };

    let totalWeightedScore = 0;
    let totalWeight = 0;

    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const option = question.options.find(opt => opt.value === answer);
        if (option) {
          const weightedScore = option.score * question.weight;
          categoryScores[question.category] += weightedScore;
          totalWeightedScore += weightedScore;
          totalWeight += question.weight;
        }
      }
    });

    // Normalize category scores to 0-100
    Object.keys(categoryScores).forEach(category => {
      const categoryQuestions = questions.filter(q => q.category === category);
      const categoryWeight = categoryQuestions.reduce((sum, q) => sum + q.weight, 0);
      const maxScore = categoryWeight * 10; // Maximum possible score
      categoryScores[category as keyof typeof categoryScores] = Math.round((categoryScores[category as keyof typeof categoryScores] / maxScore) * 100);
    });

    const overallScore = Math.round((totalWeightedScore / (totalWeight * 10)) * 100);
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (overallScore < 40) riskLevel = 'high';
    else if (overallScore < 70) riskLevel = 'medium';

    const recommendations = generateRecommendations(overallScore, categoryScores);

    return {
      overallScore,
      categoryScores,
      riskLevel,
      recommendations
    };
  };

  const generateRecommendations = (score: number, categoryScores: any): string[] => {
    const recommendations: string[] = [];
    
    if (score < 40) {
      recommendations.push(
        'High Priority: Immediately improve your privacy practices');
    } else if (score < 70) {
      recommendations.push(
        'Medium Priority: Strengthen your privacy protection measures');
    } else {
      recommendations.push(
        'Excellent work! Continue maintaining these good practices');
    }

    if (categoryScores.data_protection < 60) {
      recommendations.push(
        'Limit data sharing with third-party applications');
    }

    if (categoryScores.privacy_settings < 60) {
      recommendations.push(
        'Regularly review and update your privacy settings');
    }

    if (categoryScores.security < 60) {
      recommendations.push(
        'Strengthen password security and enable two-factor authentication');
    }

    if (categoryScores.online_behavior < 60) {
      recommendations.push(
        'Avoid public Wi-Fi networks for sensitive activities');
    }

    return recommendations;
  };

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const assessmentResult = calculateResult();
      setResult(assessmentResult);
      setAssessmentComplete(true);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setAssessmentComplete(false);
    setResult(null);
  };

  return (
    <PageLayout
      title={'Privacy Assessment Tool'}
      subtitle={'Assess your privacy protection level'}
      description={'Answer a few questions to get a comprehensive assessment of your privacy practices and personalized recommendations.'}
      heroBackground={false}
      backgroundType="toolkit"
      breadcrumbs={[
        { label: 'Resources', path: '/resources' },
        { label: 'Tools', path: '/resources/tools' },
        { label: 'Privacy Assessment', path: '/resources/tools/privacy-assessment' }
      ]}
    >

      {/* Educational Tool Indicator */}
      <div className="mb-6">
        <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                {'Educational Tool'}
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {'This assessment tool is designed to help you understand your current privacy practices. It provides educational recommendations based on your responses.'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Section>
        {!assessmentComplete ? (
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-0 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50 dark:from-card dark:to-card-hover">
                {/* Enhanced Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-accent/4 to-transparent group-hover:from-accent/15 group-hover:via-accent/8 transition-all duration-500" />
                
                {/* Animated Decorative Elements */}
                <motion.div 
                  className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-accent/15 to-transparent rounded-full -translate-y-20 translate-x-20 group-hover:scale-125 transition-transform duration-500"
                  animate={{ 
                    rotate: [0, 180, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                />
                <motion.div 
                  className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/8 to-transparent rounded-full translate-y-16 -translate-x-16 group-hover:scale-125 transition-transform duration-500"
                  animate={{ 
                    rotate: [360, 180, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 25, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                />
                
                {/* Floating Particles */}
                <motion.div
                  className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent/60 rounded-full"
                  animate={{ 
                    y: [0, -20, 0],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
                <motion.div
                  className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-accent/40 rounded-full"
                  animate={{ 
                    y: [0, -15, 0],
                    opacity: [0.2, 0.8, 0.2]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
                
                <div className="relative p-10 z-10">
                  {/* Enhanced Progress Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <motion.h3 
                        className="text-2xl font-bold text-primary dark:text-white bg-white/50 dark:bg-gray-800/50 px-6 py-3 rounded-full"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {'Question'} {currentQuestion + 1} {'of'} {questions.length}
                      </motion.h3>
                      <motion.div
                        className="w-40 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <motion.div 
                          className="bg-gradient-to-r from-accent via-accent/90 to-primary h-3 rounded-full relative overflow-hidden"
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                          <div className="absolute inset-0 assessment-shimmer" />
                        </motion.div>
                      </motion.div>
                    </div>
                    
                    <motion.p 
                      className="text-2xl font-semibold text-primary dark:text-white mb-8 leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      {questions[currentQuestion].question}
                    </motion.p>
                  </div>

                  {/* Enhanced Answer Options */}
                  <div className="space-y-4 mb-8">
                    {questions[currentQuestion].options.map((option, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleAnswer(option.value)}
                        className="w-full p-6 text-left border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-accent hover:bg-gradient-to-r hover:from-accent/10 hover:to-transparent transition-all duration-300 group-hover:shadow-lg relative overflow-hidden"
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ y: 0, scale: 0.99 }}
                      >
                        <div className="flex items-center">
                          <motion.div 
                            className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full mr-4 group-hover:border-accent transition-colors duration-300 flex-shrink-0"
                            whileHover={{ scale: 1.1 }}
                          />
                          <span className="text-lg font-medium text-primary dark:text-white group-hover:text-accent transition-colors duration-300">{option.label}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <motion.div 
                    className="text-center p-6 bg-gradient-to-r from-slate-50/80 to-slate-100/80 dark:from-slate-800/60 dark:to-slate-700/60 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <p className="text-sm text-text-secondary dark:text-gray-300 font-medium">
                      {'Your answers are confidential and are not stored.'}
                    </p>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-8 max-w-6xl mx-auto">
            {/* Overall Score */}
            <Card className="p-8 text-center hover:shadow-2xl transition-all duration-300 relative overflow-hidden group border-0 bg-gradient-to-br from-white to-gray-50 dark:from-card dark:to-card-hover">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-accent/2 to-transparent group-hover:from-accent/10 group-hover:via-accent/5 transition-all duration-300" />
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/5 to-transparent rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform duration-300" />
              
              <div className="relative">
                <div className="mb-4">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(result!.overallScore / 100) * 251.2} 251.2`}
                        className={`${result!.overallScore >= 70 ? 'text-green-500' : result!.overallScore >= 40 ? 'text-yellow-500' : 'text-red-500'}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary dark:text-white">
                        {result!.overallScore}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-primary dark:text-white mb-2">
                    {'Overall Score'}
                  </h3>
                  <div className="flex items-center justify-center">
                    {getRiskIcon(result!.riskLevel)}
                    <span className={`ml-2 text-lg font-semibold ${getRiskColor(result!.riskLevel)}`}>
                      {result!.riskLevel.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Category Scores */}
            <Card className="p-8 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group border-0 bg-gradient-to-br from-white to-gray-50 dark:from-card dark:to-card-hover">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent group-hover:from-primary/10 group-hover:via-primary/5 transition-all duration-300" />
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/5 to-transparent rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform duration-300" />
              
              <div className="relative">
                <h3 className="text-xl font-semibold text-primary dark:text-white mb-6 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  {'Category Scores'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(result!.categoryScores).map(([category, score]) => (
                    <div key={category} className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-primary dark:text-white capitalize">
                          {category.replace('_', ' ')}
                        </h4>
                        <span className="text-lg font-bold text-primary dark:text-white">{score}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            score >= 70 ? 'bg-gradient-to-r from-green-500 to-green-400' : 
                            score >= 40 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 
                            'bg-gradient-to-r from-red-500 to-red-400'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Recommendations */}
            <Card className="p-8 bg-gradient-to-r from-accent/10 to-blue-500/10 border-accent/20 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-accent/2 to-blue-500/5 group-hover:from-accent/10 group-hover:via-accent/5 group-hover:to-blue-500/10 transition-all duration-300" />
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform duration-300" />
              
              <div className="relative">
                <h3 className="text-xl font-semibold text-primary dark:text-white mb-6 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  {'Personalized Recommendations'}
                </h3>
                <div className="space-y-4">
                  {result!.recommendations.map((recommendation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start p-4 bg-white/50 dark:bg-gray-700/50 rounded-lg backdrop-blur-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-accent to-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-text-secondary dark:text-gray-300 leading-relaxed">{recommendation}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>

            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={resetAssessment}
                  variant="outline"
                  className="px-8 py-3 text-lg font-semibold border-2 border-accent text-accent hover:bg-accent hover:text-white transition-all duration-300 hover:scale-105"
                >
                  {'Retake Assessment'}
                </Button>
                <Button className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-accent to-primary text-white hover:from-accent/90 hover:to-primary/90 transition-all duration-300 hover:scale-105 shadow-lg">
                  {'Save Results'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Section>
    </PageLayout>
  );
};

export default PrivacyAssessmentTool;