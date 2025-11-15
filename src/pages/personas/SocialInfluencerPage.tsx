import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Camera,
  Users,
  Eye,
  Settings,
  Clock,
  ArrowRight,
  Globe,
  Lock,
  ArrowLeft
} from 'lucide-react';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
// import Badge from '../../components/common/Badge';

const SocialInfluencerPage: React.FC = () => {

  // Get translated priorities based on current language
  const getTranslatedPriorities = () => {
    return [
      {
        icon: Users,
        title: "Audience Management",
        description: "Controlling who can see and interact with your content"
      },
      {
        icon: Eye,
        title: "Personal Boundary",
        description: "Maintaining separation between public and private life"
      },
      {
        icon: Lock,
        title: "Account Security",
        description: "Protecting your professional online presence from threats"
      }
    ];
  };

  // Get translated recommendations based on current language
  const getTranslatedRecommendations = () => {
    return [
        {
          title: "Content Privacy Audit",
          description: "Review your content for unintended personal information exposure",
          difficulty: "Intermediate",
          time: "60 minutes"
        },
        {
          title: "Account Security Setup",
          description: "Implement enhanced security for your professional accounts",
          difficulty: "Beginner",
          time: "30 minutes"
        },
        {
          title: "Audience Segmentation",
          description: "Create boundaries between different audience groups",
          difficulty: "Advanced",
          time: "45 minutes"
        }
      ];
  };

  // Get translated button and link text
  const getTranslatedText = () => {
    return {
      backToPersonas: "Back to Privacy Personas",
      title: "Social Influencer",
      description: "Balancing public presence with personal privacy while maintaining an authentic and secure online brand.",
      recommendedActions: "Recommended Actions",
      balancingTitle: "Balancing Public and Private Life",
      balancingDescription: "As a social influencer, you face unique privacy challenges. Creating clear boundaries between your public persona and private life is essential for long-term sustainability and mental wellbeing. Consider using separate accounts, devices, or profiles for personal and professional use.",
      readyToProtect: "Ready to Protect Your Online Brand?",
      startWithAssessment: "Start with our influencer privacy assessment to get personalized recommendations.",
      takeAssessment: "Take Assessment"
    };
  };

  const priorities = getTranslatedPriorities();
  const recommendations = getTranslatedRecommendations();
  const text = getTranslatedText();

  return (
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
          {text.backToPersonas}
        </Link>

        <Card className="p-8 mb-8">
          <div className="text-center mb-8">
            <div className="bg-secondary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Camera className="h-8 w-8 text-secondary" />
            </div>
            <h1 className="text-3xl font-bold text-primary dark:text-white mb-4">
              {text.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {text.description}
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
                    <Icon className="h-6 w-6 text-secondary" />
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
              {text.recommendedActions}
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
            <div className="flex items-start">
              <Globe className="h-5 w-5 text-secondary mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-primary dark:text-white mb-2">{text.balancingTitle}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {text.balancingDescription}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-secondary p-8 rounded-lg text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">{text.readyToProtect}</h2>
          <p className="text-white/90 mb-6">
            {text.startWithAssessment}
          </p>
          <Link to="/assessment">
            <Button
              variant="primary"
              className="bg-white hover:bg-gray-100 text-secondary"
            >
              {text.takeAssessment}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </Section>
  );
};

export default SocialInfluencerPage;