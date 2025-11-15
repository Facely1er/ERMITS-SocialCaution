import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Bell, LucideIcon } from 'lucide-react';
import Section from '../common/Section';
import Button from '../common/Button';

interface ToolkitItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  color: string;
  features: string[];
  ctaText: string;
  ctaVariant: 'outline' | 'primary' | 'secondary';
  premium: boolean;
}

export const EssentialPrivacyToolkit: React.FC = () => {
  const navigate = useNavigate();
  const toolkitItems = [
    {
      id: 1,
      title: 'Privacy Audit Guide',
      subtitle: 'Free Resource',
      description: 'Complete step-by-step guide to auditing your digital privacy across all platforms and devices.',
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      features: [
        'Platform-by-platform audit',
        'Device security checklist',
        'Account privacy settings',
        'Data deletion guides'
      ] as string[],
      ctaText: 'Go to Guide',
      ctaVariant: "outline" as const,
      premium: false
    },
    {
      id: 3,
      title: 'Weekly Privacy Tips',
      subtitle: 'Newsletter',
      description: 'Stay updated with the latest privacy news, tips, and best practices delivered to your inbox.',
      icon: Bell,
      color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      features: [
        'Weekly privacy updates',
        'Expert insights',
        'Tool recommendations',
        'Privacy news digest'
      ] as string[],
      ctaText: 'Subscribe',
      ctaVariant: "outline" as const,
      premium: false
    }
  ].map((item): ToolkitItem => ({
    ...item,
    features: Array.isArray(item.features) ? item.features : []
  }));

  return (
    <Section
      title="Essential Privacy Toolkit"
      subtitle="Free resources to help you protect your privacy"
      centered
      className="py-16"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {toolkitItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  item.premium ? 'ring-2 ring-orange-500 ring-opacity-50' : ''
                }`}
              >
                {/* Premium Badge */}
                {item.premium && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-medium">
                      Premium
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className="text-center mb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${item.color}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-primary dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.subtitle}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{item.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {Array.isArray(item.features) && item.features.length > 0 ? (
                    item.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500 dark:text-gray-400 italic">No features available</li>
                  )}
                </ul>

                {/* CTA Button */}
                <div className="text-center">
                  <Button
                    variant={item.ctaVariant}
                    className={`w-full ${
                      item.premium 
                        ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500' 
                        : ''
                    }`}
                    onClick={() => {
                      if (item.id === 1) {
                        navigate('/resources/guides');
                      } else {
                        navigate('/contact');
                      }
                    }}
                  >
                    {item.ctaText}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Explore All Resources Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <Button
            variant="outline"
            className="px-8 py-3"
            onClick={() => navigate('/resources')}
          >
            Explore All Resources
          </Button>
        </motion.div>
      </div>
    </Section>
  );
};