import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, AlertTriangle, Info, Shield } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
interface GuideSection {
  heading: string;
  text: string;
  steps?: string[];
  tips?: string[];
  warnings?: string[];
}

interface PrivacyGuide {
  id: string;
  title: string;
  description: string;
  icon: any;
  lastUpdated: string;
  platform: string;
  sections: GuideSection[];
  difficulty: string;
  timeToComplete: string;
}

interface GuideDisplayProps {
  guide: PrivacyGuide;
}

const GuideDisplay: React.FC<GuideDisplayProps> = ({ guide }) => {

  // Translation helpers
  const getTranslatedStepsToFollow = () => {
    return "Steps to Follow";
  };

  const getTranslatedHelpfulTips = () => {
    return "Helpful Tips";
  };

  const getTranslatedImportantWarnings = () => {
    return "Important Warnings";
  };

  return (
    <Card className="p-6">
      <div className="flex items-start mb-6">
        <div className="p-3 bg-accent/10 rounded-full mr-4">
          <Shield className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">{guide.title}</h1>
          <p className="text-gray-600 dark:text-gray-300">{guide.description}</p>
          
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="primary">{guide.difficulty}</Badge>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Clock className="h-4 w-4 mr-1" />
              {guide.timeToComplete}
            </div>
          </div>
        </div>
      </div>

      {guide.sections.map((section, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-primary dark:text-white mb-4">{section.heading}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{section.text}</p>

          {section.steps && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-primary dark:text-white mb-3">{getTranslatedStepsToFollow()}</h3>
              <div className="space-y-3">
                {section.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-sm font-medium text-accent">{stepIndex + 1}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section.tips && (
            <div className="mb-6 bg-light-blue/10 dark:bg-card-hover rounded-lg p-4">
              <div className="flex items-center mb-3">
                <BookOpen className="h-5 w-5 text-accent mr-2" />
                <h3 className="text-lg font-medium text-primary dark:text-white">{getTranslatedHelpfulTips()}</h3>
              </div>
              <ul className="space-y-2">
                {section.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {section.warnings && (
            <div className="bg-warning/10 dark:bg-warning/5 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <AlertTriangle className="h-5 w-5 text-warning mr-2" />
                <h3 className="text-lg font-medium text-primary dark:text-white">{getTranslatedImportantWarnings()}</h3>
              </div>
              <ul className="space-y-2">
                {section.warnings.map((warning, warningIndex) => (
                  <li key={warningIndex} className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-warning mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      ))}

      <div className="mt-8 p-4 bg-light-blue/10 dark:bg-card-hover rounded-lg">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-accent mt-1 mr-3" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Learn more about privacy protection
            </p>
            <p className="text-sm text-accent mt-1">
              Last Updated: {guide.lastUpdated}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GuideDisplay;