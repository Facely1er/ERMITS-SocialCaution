import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Database, 
  Eye, 
  Shield, 
  Camera, 
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  FileText,
  Building
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const EmployeePersonaPage: React.FC = () => {

  // Get translated content based on current language
  const getTranslatedContent = () => {
    return {
      title: "Concerned Employee Profile",
      subtitle: "Protecting your personal data and privacy in the workplace while understanding your rights and risks",
      description: "As a concerned employee, you need to understand how your employer collects, uses, and protects your personal data. Discover your rights, identify risks, and learn to protect your privacy at work.",
      keyConcerns: "Key Concerns",
      monitoring: "Employee Monitoring",
      monitoringDesc: "Understanding how employers monitor and track employee activities",
      dataCollection: "Personal Data Collection",
      dataCollectionDesc: "How employers collect, store, and use your personal information",
      workplaceSurveillance: "Workplace Surveillance",
      workplaceSurveillanceDesc: "Physical and digital surveillance in the workplace",
      dataRights: "Employee Data Rights",
      dataRightsDesc: "Your rights regarding personal data in the workplace",
      commonRisks: "Common Risks",
      risk1: "Excessive monitoring of employee activities",
      risk2: "Unnecessary collection of personal data",
      risk3: "Data sharing with third parties without consent",
      risk4: "Inadequate data security measures",
      risk5: "Lack of transparency about data usage",
      recommendations: "Recommendations",
      rec1: "Understand your company's monitoring policies",
      rec2: "Use personal devices for personal activities",
      rec3: "Know your rights under data protection laws",
      rec4: "Request access to your personal data",
      rec5: "Use encrypted communication for sensitive matters",
      rec6: "Regularly review privacy settings on work accounts",
      takeAssessment: "Take Privacy Assessment",
      learnMore: "Learn More About Workplace Privacy"
    };
  };

  const content = getTranslatedContent();

  const concerns = [
    {
      id: 'monitoring',
      title: content.monitoring,
      description: content.monitoringDesc,
      icon: Eye,
      color: 'bg-danger/10',
      textColor: 'text-danger',
      borderColor: 'border-danger/20'
    },
    {
      id: 'data-collection',
      title: content.dataCollection,
      description: content.dataCollectionDesc,
      icon: Database,
      color: 'bg-warning/10',
      textColor: 'text-warning',
      borderColor: 'border-warning/20'
    },
    {
      id: 'surveillance',
      title: content.workplaceSurveillance,
      description: content.workplaceSurveillanceDesc,
      icon: Camera,
      color: 'bg-secondary/10',
      textColor: 'text-secondary',
      borderColor: 'border-secondary/20'
    },
    {
      id: 'data-rights',
      title: content.dataRights,
      description: content.dataRightsDesc,
      icon: Shield,
      color: 'bg-success/10',
      textColor: 'text-success',
      borderColor: 'border-success/20'
    }
  ];

  const risks = [
    content.risk1,
    content.risk2,
    content.risk3,
    content.risk4,
    content.risk5
  ];

  const recommendations = [
    content.rec1,
    content.rec2,
    content.rec3,
    content.rec4,
    content.rec5,
    content.rec6
  ];

  return (
    <PageLayout
      title={content.title}
      subtitle={content.subtitle}
      description={content.description}
      heroBackground={false}
      backgroundType="privacy"
      breadcrumbs={[
        { label: 'Personas', path: '/personas' },
        { label: content.title, path: '/personas/concerned-employee' }
      ]}
    >
      {/* Key Concerns Section */}
      <Section
        title={content.keyConcerns}
        subtitle="Understanding the main privacy challenges employees face in the workplace"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {concerns.map((concern, index) => {
            const Icon = concern.icon;
            return (
              <motion.div
                key={concern.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-6 border ${concern.borderColor}`}>
                  <div className="flex items-start">
                    <div className={`${concern.color} rounded-lg w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0`}>
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-semibold ${concern.textColor} mb-2`}>
                        {concern.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {concern.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Risks and Recommendations */}
      <div className="bg-light-blue dark:bg-background-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Common Risks */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-danger/10 rounded-lg mr-4">
                      <AlertTriangle className="h-8 w-8 text-danger" />
                    </div>
                    <h3 className="text-2xl font-semibold text-primary dark:text-white">
                      {content.commonRisks}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {risks.map((risk, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-danger rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-success/10 rounded-lg mr-4">
                      <CheckCircle className="h-8 w-8 text-success" />
                    </div>
                    <h3 className="text-2xl font-semibold text-primary dark:text-white">
                      {content.recommendations}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-success rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Section */}
      <Section
        title="Take Action"
        subtitle="Start protecting your workplace privacy today"
        centered
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 text-center">
                <div className="p-4 bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-primary dark:text-white mb-3">
                  {content.takeAssessment}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Get personalized recommendations based on your workplace privacy needs
                </p>
                <Link to="/assessment">
                  <Button variant="primary" className="w-full">
                    Start Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="p-6 text-center">
                <div className="p-4 bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-primary dark:text-white mb-3">
                  {content.learnMore}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Explore our comprehensive workplace privacy resources and guides
                </p>
                <Link to="/privacy-focus">
                  <Button variant="outline" className="w-full">
                    Explore Resources
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default EmployeePersonaPage;