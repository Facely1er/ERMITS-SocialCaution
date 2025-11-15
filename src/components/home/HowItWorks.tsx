import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Lightbulb, Shield, LineChart, AlertCircle, Sparkles } from 'lucide-react';
import Section from '../../components/common/Section';
import Button from '../../components/common/Button';

export const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  const steps = [
    {
      id: 1,
      title: 'Discover',
      subtitle: 'Assess Your Privacy',
      description: 'PROBLEM: You don\'t know where your data is exposed or how it\'s being used. SOLUTION: Our comprehensive assessment reveals your digital footprint and privacy vulnerabilities.',
      microCopy: 'Get started in minutes',
      icon: Search,
      color: "bg-accent",
      timeline: '5 minutes'
    },
    {
      id: 2,
      title: 'Learn',
      subtitle: 'Understand Your Rights',
      description: 'PROBLEM: Privacy laws are complex and hard to understand. SOLUTION: We explain your rights in simple terms and show you how to exercise them.',
      microCopy: 'Knowledge is power',
      icon: Lightbulb,
      color: "bg-warning",
      timeline: '15 minutes'
    },
    {
      id: 3,
      title: 'Protect',
      subtitle: 'Take Action',
      description: 'PROBLEM: You don\'t know where to start improving your privacy. SOLUTION: Get personalized recommendations and step-by-step action plans.',
      microCopy: 'Actionable guidance',
      icon: Shield,
      color: "bg-success",
      timeline: '30 minutes'
    },
    {
      id: 4,
      title: 'Track',
      subtitle: 'Monitor Progress',
      description: 'PROBLEM: Privacy protection is an ongoing process, not a one-time fix. SOLUTION: Track your progress and get alerts about new privacy risks.',
      microCopy: 'Stay protected',
      icon: LineChart,
      color: "bg-primary",
      timeline: 'Ongoing'
    }
  ];

  return (
    <Section
      title="How SocialCaution Works"
      subtitle={
        <div className="space-y-2">
          <p className="text-xl text-accent font-semibold">A Simple 4-Step Process</p>
          <p className="text-gray-600 dark:text-white">From assessment to ongoing protection, we guide you every step of the way</p>
        </div>
      }
      centered
      className="bg-blue-50 dark:bg-gray-800 py-16"
    >
      <div className="max-w-6xl mx-auto">
        {/* Horizontal Timeline */}
        <div className="relative">
          {/* Connecting Line */}
          <div 
            className="absolute top-16 left-0 right-0 h-0.5 hidden lg:block how-it-works-timeline"
          />
          
          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative text-center"
              >
                {/* Numbered Circle */}
                <div className="relative mb-6">
                  <motion.div
                    className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center shadow-lg mx-auto relative z-10`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <step.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-accent text-lg font-bold border-2 border-accent shadow-md">
                    {step.id}
                  </div>
                </div>

                {/* Content */}
                <div className="px-2">
                  <h3 className="text-xl font-bold text-primary dark:text-white mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{step.subtitle}</p>
                  
                  {/* Problem-Solution Display */}
                  {(() => {
                    const problemMatch = step.description.match(/PROBLEM:\s*(.+?)(?=\s*SOLUTION:|$)/i);
                    const solutionMatch = step.description.match(/SOLUTION:\s*(.+?)$/i);
                    const problem = problemMatch ? problemMatch[1].trim() : '';
                    const solution = solutionMatch ? solutionMatch[1].trim() : '';
                    
                    // Get color classes based on step
                    const colorClasses = {
                      1: { bg: 'bg-accent/10', border: 'border-accent/30', text: 'text-accent', icon: 'bg-accent/20' },
                      2: { bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning', icon: 'bg-warning/20' },
                      3: { bg: 'bg-success/10', border: 'border-success/30', text: 'text-success', icon: 'bg-success/20' },
                      4: { bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary', icon: 'bg-primary/20' }
                    };
                    const colors = colorClasses[step.id as keyof typeof colorClasses] || colorClasses[1];
                    
                    return (
                      <div className="mb-3 space-y-3">
                        {problem && (
                          <div className={`relative ${colors.bg} ${colors.border} border-l-4 rounded-r-lg p-3`}>
                            <div className="flex items-start gap-2.5">
                              <div className={`flex-shrink-0 p-1.5 ${colors.icon} rounded-lg`}>
                                <AlertCircle className={`h-3.5 w-3.5 ${colors.text}`} />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Challenge</p>
                                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {problem}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        {solution && (
                          <div className={`relative ${colors.bg} ${colors.border} border-l-4 rounded-r-lg p-3`}>
                            <div className="flex items-start gap-2.5">
                              <div className={`flex-shrink-0 p-1.5 ${colors.icon} rounded-lg`}>
                                <Sparkles className={`h-3.5 w-3.5 ${colors.text}`} />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Our Approach</p>
                                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                  {solution}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  
                  {step.timeline && (
                    <div className="text-xs text-accent font-medium mb-2 bg-accent/10 px-2 py-1 rounded-full inline-block">
                      {step.timeline}
                    </div>
                  )}
                  {step.microCopy && (
                    <p className="text-xs text-accent font-medium">{step.microCopy}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Button
            variant="primary"
            className="text-lg px-8 py-4 group"
            onClick={() => navigate('/30-day-roadmap')}
          >
            Start Your Privacy Journey
            <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
          </Button>
        </motion.div>
      </div>
    </Section>
  );
};