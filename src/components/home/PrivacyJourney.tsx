import React from 'react';
import { motion } from 'framer-motion';
import { Search, Lightbulb, Shield, LineChart } from 'lucide-react';
import Section from '../../components/common/Section';
import PrivacySlideshow from './PrivacySlideshow';

export const PrivacyJourney: React.FC = () => {
  // Get steps
  const getTranslatedSteps = () => {
    return [
      {
        id: 1,
        title: 'Discover',
        description: 'Uncover your current privacy vulnerabilities through our comprehensive assessment',
        icon: Search,
      },
      {
        id: 2,
        title: 'Learn',
        description: 'Understand your privacy rights and how to effectively exercise them',
        icon: Lightbulb,
      },
      {
        id: 3,
        title: 'Protect',
        description: 'Implement personalized recommendations to strengthen your privacy posture',
        icon: Shield,
      },
      {
        id: 4,
        title: 'Track',
        description: 'Monitor your progress and celebrate privacy protection milestones',
        icon: LineChart,
      },
    ];
  };

  // Get translated title
  const getTranslatedTitle = () => {
    return "Your Privacy Journey";
  };

  // Get translated subtitle
  const getTranslatedSubtitle = () => {
    return "A step-by-step approach to understanding and enhancing your privacy protection";
  };

  const steps = getTranslatedSteps();

  return (
    <Section
      title={getTranslatedTitle()}
      subtitle={getTranslatedSubtitle()}
      centered
      className="bg-light-blue dark:bg-background-secondary py-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <PrivacySlideshow />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                {step.id}
              </div>

              {/* Icon */}
              <div className="bg-white dark:bg-card rounded-full p-6 w-20 h-20 mx-auto mb-6 shadow-lg">
                <step.icon className="w-full h-full text-accent" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-primary dark:text-white mb-3">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{step.description}</p>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-t-2 border-r-2 border-gray-200 dark:border-gray-700" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};