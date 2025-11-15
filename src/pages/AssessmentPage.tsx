import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, FileCheck, Shield, Clock, Info, ArrowRight, BookOpen, CheckCircle, Zap, Target, AlertTriangle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import AssessmentNav from '../components/navigation/AssessmentNav';

const AssessmentPage: React.FC = () => {
  // Get assessment types
  const getAssessments = () => {
    return [
      {
        id: 'exposure',
        title: 'Digital Exposure Assessment',
        description: 'Learn about your digital footprint and identify privacy risks through educational assessment',
        icon: Search,
        color: 'danger',
        duration: '10-15 min',
        path: '/assessment/exposure',
        features: [
          'Educational vulnerability awareness',
          'Privacy risk education',
          'Learning recommendations'
        ]
      },
      {
        id: 'rights',
        title: 'Privacy Rights Assessment',
        description: 'Learn about and understand your privacy rights through educational assessment',
        icon: FileCheck,
        color: 'accent',
        duration: '5-10 min',
        path: '/assessment/rights',
        features: [
          'Rights awareness education',
          'Legal framework learning',
          'Educational strategies'
        ]
      },
      {
        id: 'security',
        title: 'Security Awareness Assessment',
        description: 'Educational security evaluation and learning recommendations',
        icon: Shield,
        color: 'success',
        duration: '15-20 min',
        path: '/assessment/security',
        features: [
          'Security awareness education',
          'Threat awareness learning',
          'Educational action plan'
        ]
      }
    ];
  };

  const assessments = getAssessments();

  return (
    <PageLayout
      title="Privacy Assessment"
      subtitle="Educational privacy assessments to help you learn and understand your digital privacy"
      description="Take our educational assessments to learn about your privacy status and get personalized learning recommendations"
      heroBackground={false}
      backgroundType="assessment"
      showBreadcrumbs={false}
    >
      <Section>
        <div className="flex flex-col lg:flex-row gap-8">
          <AssessmentNav />
          
          <div className="flex-1">
            {/* Educational Disclaimer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 mr-4 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-semibold mb-2 text-lg">Educational Platform - What We Provide</p>
                    <p className="mb-2">Social Caution provides educational privacy assessments that help you learn about:</p>
                    <ul className="list-disc list-inside mb-2 space-y-1">
                      <li>Privacy awareness and risk education</li>
                      <li>Understanding your digital footprint</li>
                      <li>Learning about privacy rights and laws</li>
                      <li>Educational recommendations for improvement</li>
                    </ul>
                    <p className="mb-2">We do NOT provide:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Real-time monitoring or active protection services</li>
                      <li>Automated data removal or privacy setting changes</li>
                      <li>Guaranteed privacy protection or security</li>
                      <li>Professional legal or security advice</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Assessment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {assessments.map((assessment, index) => {
                const Icon = assessment.icon;
                return (
                  <motion.div
                    key={assessment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="h-full"
                  >
                    <Link to={assessment.path} className="h-full block group">
                      <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 group cursor-pointer">
                        <div className="flex flex-col h-full">
                          {/* Header */}
                          <div className="flex items-start mb-4">
                            <div className={`p-3 bg-${assessment.color}/10 rounded-lg mr-4 flex-shrink-0`}>
                              <Icon className={`h-8 w-8 text-${assessment.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-primary dark:text-white mb-2 group-hover:text-accent transition-colors duration-300">
                                {assessment.title}
                              </h3>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Clock className="h-4 w-4 mr-2" />
                                <span className="font-medium">{assessment.duration}</span>
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed flex-1">
                            {assessment.description}
                          </p>

                          {/* Features */}
                          <div className="space-y-3 mb-6">
                            {assessment.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <CheckCircle className="h-4 w-4 text-accent mr-3 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>

                          {/* CTA Button */}
                          <div className={`w-full text-center py-3 px-6 rounded-lg bg-${assessment.color} text-white font-semibold group-hover:bg-${assessment.color}/90 transition-all duration-300 flex items-center justify-center space-x-2`}>
                            <span>Start Assessment</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* About Assessments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <Card className="p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
                    <Info className="h-8 w-8 text-accent" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-primary dark:text-white mb-4">
                    About Our Educational Assessments
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                    Our educational assessments help you learn about your privacy status and provide personalized learning recommendations for improvement. These tools are designed for education and awareness, not active protection.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Why Choose Our Assessments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">
                  Why Choose Our Educational Assessments?
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Comprehensive, educational, and accessible privacy learning tools
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Zap,
                    title: 'Quick & Educational',
                    description: 'Learn about privacy in minutes with our educational tools',
                    color: 'warning'
                  },
                  {
                    icon: Target,
                    title: 'Personalized Learning',
                    description: 'Get educational recommendations tailored to your needs',
                    color: 'accent'
                  },
                  {
                    icon: BookOpen,
                    title: 'Educational Focus',
                    description: 'Designed for learning and awareness, not active protection',
                    color: 'success'
                  },
                  {
                    icon: CheckCircle,
                    title: 'Expert-Backed',
                    description: 'Based on privacy research and educational best practices',
                    color: 'primary'
                  }
                ].map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      className="text-center group"
                    >
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-${feature.color}/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-8 w-8 text-${feature.color}`} />
                      </div>
                      <h3 className="text-lg font-semibold text-primary dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default AssessmentPage;