import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Lock, AlertTriangle, Info, CheckCircle, Shield, Globe, FileText } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const { user } = useAuth();
  const standards = [
    {
      name: "GDPR",
      description: "European data protection and privacy standards",
      icon: <Shield className="h-5 w-5 text-blue-600" />,
      requirements: [
        "Data minimization and purpose limitation",
        "Lawful basis for processing",
        "Privacy by design and default",
        "Data subject rights (access, erasure, etc.)"
      ]
    },
    {
      name: "NIST",
      description: "US cybersecurity framework guidelines",
      icon: <Lock className="h-5 w-5 text-green-600" />,
      requirements: [
        "Risk assessment and management",
        "Access control and authentication",
        "Data protection and privacy",
        "Security monitoring and incident response"
      ]
    },
    {
      name: "ISO 27701",
      description: "International privacy information management",
      icon: <Info className="h-5 w-5 text-purple-600" />,
      requirements: [
        "Privacy management system implementation",
        "Data lifecycle protection",
        "Privacy impact assessments",
        "Privacy controls and documentation"
      ]
    }
  ];

  const additionalRegulations = [
    {
      name: "CCPA/CPRA (California)",
      description: "California Consumer Privacy Act and Privacy Rights Act",
      requirements: [
        "Right to know what personal information is collected",
        "Right to delete personal information",
        "Right to opt-out of data sales",
        "Data breach notification requirements"
      ]
    },
    {
      name: "PIPEDA (Canada)",
      description: "Personal Information Protection and Electronic Documents Act",
      requirements: [
        "Consent for data collection and use",
        "Limited collection and retention",
        "Accuracy of personal information",
        "Safeguards for data protection"
      ]
    },
    {
      name: "LGPD (Brazil)",
      description: "Lei Geral de Proteção de Dados",
      requirements: [
        "Legal basis for data processing",
        "Data subject rights and consent",
        "Data protection officer requirement",
        "International data transfer rules"
      ]
    },
    {
      name: "PIPL (China)",
      description: "Personal Information Protection Law",
      requirements: [
        "Separate consent for sensitive data",
        "Data localization requirements",
        "Cross-border data transfer restrictions",
        "Privacy impact assessments"
      ]
    },
    {
      name: "PDPA (Singapore)",
      description: "Personal Data Protection Act",
      requirements: [
        "Consent obligation",
        "Purpose limitation",
        "Notification requirement",
        "Protection and retention policies"
      ]
    },
    {
      name: "APP (Australia)",
      description: "Australian Privacy Principles",
      requirements: [
        "Open and transparent management",
        "Collection and use limitations",
        "Data quality and security",
        "Access and correction rights"
      ]
    }
  ];

  const features = [
    {
      title: "Privacy Analysis",
      description: "Evaluate your current privacy settings and practices",
      icon: <Shield className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Risk Assessment",
      description: "Identify potential privacy vulnerabilities",
      icon: <AlertTriangle className="h-6 w-6 text-amber-600" />
    },
    {
      title: "Action Plan",
      description: "Get personalized recommendations for improvement",
      icon: <CheckCircle className="h-6 w-6 text-green-600" />
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 md:p-10">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-full mb-6">
          <ShieldCheck className="h-12 w-12 text-accent" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Privacy Assessment
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Complete our comprehensive assessment to evaluate your privacy practices and get personalized recommendations.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-lg">
              {feature.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

        {/* Optional Authentication Notice */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
          >
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>No account required!</strong> You can start the assessment immediately. 
                  Sign in to save your progress, sync across devices, and access personalized recommendations.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center px-8 py-4 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all text-lg font-semibold mb-10 shadow-lg hover:shadow-xl"
        >
          <span>Start Assessment</span>
          <ArrowRight className="ml-2 h-5 w-5" />
        </motion.button>

        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6 md:p-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 text-center">
            Standards & Regulations Coverage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {standards.map((standard, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="mr-3">{standard.icon}</div>
                  <h4 className="font-medium text-slate-900 dark:text-white">
                    {standard.name}
                  </h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                  {standard.description}
                </p>
                <ul className="space-y-2">
                  {standard.requirements.map((req, i) => (
                    <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-slate-200 dark:border-slate-600 pt-6 mt-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-center">
              Additional Regulations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {additionalRegulations.map((reg, index) => (
                <div key={index} className="bg-white dark:bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Globe className="h-4 w-4 text-slate-400 mr-2" />
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {reg.name}
                    </h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {reg.description}
                  </p>
                  <ul className="space-y-1">
                    {reg.requirements.map((req, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start">
                        <FileText className="h-3 w-3 text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;