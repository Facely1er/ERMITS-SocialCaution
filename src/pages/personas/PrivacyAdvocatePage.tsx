import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users,
  Shield,
  Settings,
  Clock,
  ArrowRight,
  Globe,
  FileText,
  Database,
  ArrowLeft
} from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const PrivacyAdvocatePage: React.FC = () => {
  const priorities = [
    {
      icon: Shield,
      title: "Advanced Protection",
      description: "Implementing sophisticated privacy and security measures"
    },
    {
      icon: Globe,
      title: "Digital Rights",
      description: "Understanding and exercising your legal privacy rights"
    },
    {
      icon: FileText,
      title: "Privacy Advocacy",
      description: "Promoting privacy awareness and best practices"
    }
  ];

  const recommendations = [
    {
      title: "Privacy Tech Stack",
      description: "Build a comprehensive suite of privacy tools and services",
      difficulty: "Advanced",
      time: "90 minutes"
    },
    {
      title: "Data Rights Audit",
      description: "Systematically exercise your privacy rights across services",
      difficulty: "Advanced",
      time: "120 minutes"
    },
    {
      title: "Privacy Hardening",
      description: "Implement advanced techniques to minimize your digital footprint",
      difficulty: "Advanced",
      time: "60 minutes"
    }
  ];

  const advancedTools = [
    {
      name: "Encrypted Communications",
      description: "End-to-end encrypted messaging and email"
    },
    {
      name: "Network Privacy",
      description: "VPNs, Tor, and DNS-level protection"
    },
    {
      name: "Data Sovereignty",
      description: "Self-hosted services and local data storage"
    },
    {
      name: "Identity Separation",
      description: "Compartmentalization techniques for digital identities"
    }
  ];

  return (
    <PageLayout
      title="Privacy Advocate"
      subtitle="Advanced privacy protection strategies and digital rights awareness for those who prioritize information security and data sovereignty."
      breadcrumbs={[
        { label: 'Personas', path: '/personas' },
        { label: 'Privacy Advocate', path: '/personas/privacy-advocate' }
      ]}
    >
      <Section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Link
            to="/personas"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8 group transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Privacy Personas
          </Link>

          <Card className="p-8 mb-8">
            <div className="text-center mb-8">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary dark:text-white" />
              </div>
              <h1 className="text-3xl font-bold text-primary dark:text-white mb-4">
                Privacy Advocate
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Advanced privacy protection strategies and digital rights awareness for those who prioritize information security and data sovereignty.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {priorities.map((priority, index) => {
                const Icon = priority.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-light-blue/10 dark:bg-card-hover rounded-lg p-6"
                  >
                    <div className="mb-4">
                      <Icon className="h-6 w-6 text-primary dark:text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary dark:text-white mb-2">
                      {priority.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {priority.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">
                Recommended Actions
              </h2>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start p-4 bg-light-blue/10 dark:bg-card-hover rounded-lg"
                  >
                    <div className="flex-grow">
                      <h3 className="font-semibold text-primary dark:text-white mb-1">
                        {rec.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                        {rec.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center text-gray-500 dark:text-gray-400">
                          <Settings className="h-4 w-4 mr-1" />
                          {rec.difficulty}
                        </span>
                        <span className="flex items-center text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-1" />
                          {rec.time}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg mb-8">
              <h3 className="font-semibold text-primary dark:text-white mb-4">Advanced Privacy Toolkit</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advancedTools.map((tool, index) => (
                  <div key={index} className="bg-white dark:bg-card p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium text-primary dark:text-white mb-1">{tool.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{tool.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-lg">
              <div className="flex items-start">
                <Database className="h-5 w-5 text-primary dark:text-white mt-1 mr-3" />
                <div>
                  <h3 className="font-medium text-primary dark:text-white mb-2">Data Sovereignty Principles</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    As a privacy advocate, you understand that true privacy requires control over where and how your data is stored. Consider implementing self-hosted solutions, local-first applications, and open-source alternatives to maintain sovereignty over your digital information.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-primary text-white p-8 rounded-lg text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Ready for Advanced Privacy Protection?</h2>
            <p className="text-white/90 mb-6">
              Take our comprehensive privacy assessment to identify any remaining vulnerabilities in your privacy setup.
            </p>
            <Link to="/assessment">
              <Button
                variant="primary"
                className="bg-white hover:bg-gray-100 text-primary"
              >
                Take Advanced Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </Section>
    </PageLayout>
  );
};

export default PrivacyAdvocatePage;