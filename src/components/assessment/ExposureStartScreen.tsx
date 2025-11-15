import React from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, AlertTriangle, ArrowRight, Wifi, CheckCircle, Globe, FileText } from 'lucide-react';

interface ExposureStartScreenProps {
  onStart: () => void;
}

const ExposureStartScreen: React.FC<ExposureStartScreenProps> = ({ onStart }) => {

  const standards = [
    {
      name: "ISO 27001",
      description: 'International information security standards',
      icon: <Shield className="h-5 w-5 text-blue-600" />,
      requirements: [
        'Network and communications security',
        'Access control and authentication',
        'Data protection and privacy',
        'Security monitoring and incident response']
    },
    {
      name: "NIST SP 800-48",
      description: 'Wireless network security',
      icon: <Wifi className="h-5 w-5 text-green-600" />,
      requirements: [
        'Secure Wi-Fi network configuration',
        'Communication encryption',
        'User authentication',
        'Access monitoring']
    },
    {
      name: "GDPR",
      description: 'General Data Protection Regulation',
      icon: <Shield className="h-5 w-5 text-purple-600" />,
      requirements: [
        'Tracking consent and user rights',
        'Data minimization',
        'Security of processing',
        'Data breach notification']
    }
  ];

  const additionalRegulations = [
    {
      name: "OWASP Mobile Top 10",
      description: 'Top 10 mobile security risks',
      requirements: [
        'Improper platform usage',
        'Insecure data storage',
        'Insecure communication',
        'Broken authentication']
    },
    {
      name: "CIS Controls",
      description: 'Essential security controls',
      requirements: [
        'Secure configuration management',
        'Access control and identity management',
        'Data protection',
        'Monitoring and analysis']
    },
    {
      name: "ePrivacy",
      description: 'Rules on cookies and online tracking',
      requirements: [
        'Cookie consent',
        'Tracking transparency',
        'User rights',
        'Privacy protection']
    }
  ];

  const features = [
    {
      title: 'Security Analysis',
      description: 'Evaluate your current online security practices',
      icon: <Shield className="h-6 w-6 text-blue-600" />
    },
    {
      title: 'Risk Assessment',
      description: 'Identify potential privacy vulnerabilities',
      icon: <AlertTriangle className="h-6 w-6 text-amber-600" />
    },
    {
      title: 'Action Plan',
      description: 'Get personalized recommendations to improve your security',
      icon: <CheckCircle className="h-6 w-6 text-green-600" />
    }
  ];

  const getTitle = () => {
    return "Cybersecurity Exposure Assessment";
  };

  const getSubtitle = () => {
    return "Identify potential privacy vulnerabilities and exposure risks in your digital presence";
  };

  const getStartButtonText = () => {
    return "Start Assessment";
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Search className="h-16 w-16 text-accent mx-auto" />
      </motion.div>
      
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          {getTitle()}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
          {getSubtitle()}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors text-lg font-medium mb-12"
        >
          {getStartButtonText()}
          <ArrowRight className="ml-2 h-5 w-5" />
        </motion.button>

        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            {'Standards & Regulations Coverage'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
          
          <div className="border-t border-slate-200 dark:border-slate-600 pt-6">
            <h3 className="font-medium text-slate-900 dark:text-white mb-4">
              {'Additional Regulations'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

export default ExposureStartScreen;
