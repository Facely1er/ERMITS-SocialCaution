import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Bell, FileText, Activity, Gauge } from 'lucide-react';
import Button from '../common/Button';
const PrivacyRiskTeaser: React.FC = () => {
  const features = [
    {
      id: 1,
      title: 'Risk Assessment',
      icon: Shield
    },
    {
      id: 2,
      title: 'Action Plans',
      icon: FileText
    },
    {
      id: 3,
      title: 'Progress Tracking',
      icon: Activity
    },
    {
      id: 4,
      title: 'Privacy Score',
      icon: Gauge
    },
    {
      id: 5,
      title: 'Breach Alerts',
      icon: Bell
    }
  ];

  return (
    <section className="section-accent-light py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-3">
              Privacy Risk Exposure & Rights Action Center™
            </h2>
            <p className="text-xl text-accent font-semibold mb-4">
              Your Complete Privacy Protection Hub
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Comprehensive tools and resources to assess, protect, and monitor your digital privacy.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {features.map((feature) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: feature.id * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-card rounded-full px-4 py-2 flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
                >
                  <feature.icon className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium text-primary dark:text-white">
                    {feature.title}
                  </span>
                </motion.div>
              ))}
            </div>

            <Link to="/privacy-action-center">
              <Button variant="primary" className="text-lg">
                Explore Action Center
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="bg-white dark:bg-card rounded-2xl shadow-xl p-6">
              <div className="text-center mb-6">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#FF6B35"
                      strokeWidth="10"
                      strokeDasharray={`${65 * 2.83} 283`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold text-accent">65</span>
                    <span className="text-sm text-gray-500 dark:text-gray-300">
                      Privacy Score
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Data Exposure', score: 35 },
                  { name: 'Social Media', score: 65 },
                  { name: 'Device Security', score: 70 }
                ].map((category, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-300">{category.name}</span>
                      <span className="font-medium text-primary dark:text-white">{category.score}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${category.score}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="h-full bg-accent rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyRiskTeaser;