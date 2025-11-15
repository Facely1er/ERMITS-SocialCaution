import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Globe, MapPin, Users, ShoppingCart, Heart, Brain, Shield, UserSquare2, Target, ArrowRight } from 'lucide-react';
import Hero from '../components/home/Hero';
import PrivacyRiskTeaser from '../components/home/PrivacyRiskTeaser';
import { HowItWorks } from '../components/home/HowItWorks';
import { PrivacySolutionsCards } from '../components/home/PrivacySolutionsCards';
import { PrivacyAssessmentPreview } from '../components/home/PrivacyAssessmentPreview';
import { WhatYouReceive } from '../components/home/WhatYouReceive';
import FactsAndFigures from '../components/home/FactsAndFigures';
import { EssentialPrivacyToolkit } from '../components/home/EssentialPrivacyToolkit';
import { FAQSection } from '../components/home/FAQSection';
import { StayProtected } from '../components/home/StayProtected';
import PrivacyJourneyDemo from '../components/home/PrivacyJourneyDemo';
import ThirtyDayPlanPreview from '../components/home/ThirtyDayPlanPreview';
import { CtaSection } from '../components/home/CtaSection';
import PageLayout from '../components/layout/PageLayout';
import Section from '../components/common/Section';
import Card from '../components/common/Card';

const HomePage: React.FC = () => {
  // Data for the "Why It Matters" section
  const sectionContent = {
    title: 'Why Privacy Matters More Than Ever',
    subtitle: 'In today\'s digital world, your personal data is constantly being collected, analyzed, and monetized. Understanding the hidden costs of free services empowers you to make informed decisions about your digital life.',
    costTitle: 'The Hidden Cost of "Free"',
    costDescription: 'Every free service comes with a price - your personal data. Here\'s what you\'re really paying:',
    costItems: [
      { icon: Globe, problem: 'Every website you visit tracks your browsing habits', solution: 'Use privacy-focused browsers and ad blockers' },
      { icon: MapPin, problem: 'Your location is constantly monitored and stored', solution: 'Limit location sharing to essential apps only' },
      { icon: Users, problem: 'Social media platforms build detailed profiles of your interests', solution: 'Review and limit data sharing in privacy settings' },
      { icon: ShoppingCart, problem: 'Your purchase history is sold to advertisers', solution: 'Use private browsing and payment methods' },
      { icon: Heart, problem: 'Health apps share your medical data with third parties', solution: 'Read privacy policies and opt out when possible' },
      { icon: Brain, problem: 'Algorithms create psychological profiles to influence your behavior', solution: 'Limit social media usage and diversify your information sources' }
    ]
  };

  const whyItMattersItems = [
    {
      icon: Shield,
      title: 'Identity Protection',
      problem: 'Data breaches expose your personal information, leading to identity theft and financial fraud.',
      solution: 'Regular privacy assessments and strong security practices protect your identity.'
    },
    {
      icon: UserSquare2,
      title: 'Family Safety',
      problem: 'Children\'s data is collected without proper consent, creating long-term privacy risks.',
      solution: 'Parental controls and privacy education keep your family safe online.'
    },
    {
      icon: Target,
      title: 'Data Control',
      problem: 'You have little control over how your data is collected, used, and shared by companies.',
      solution: 'Understanding your rights and using privacy tools gives you back control.'
    }
  ];

  return (
    <PageLayout showBreadcrumbs={false}>
      {/* Hero Section */}
      <Hero />
      
      {/* 1. 30-Day Privacy Protection Plan */}
      <ThirtyDayPlanPreview />

      {/* 2. Why Privacy Matters More Than Ever */}
      <Section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {sectionContent.title}
            </motion.h2>
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {sectionContent.subtitle}
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {whyItMattersItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="group"
              >
                <Card className="p-8 h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:bg-white dark:group-hover:bg-gray-800">
                  <div className="flex flex-col items-center text-center">
                    <motion.div 
                      className="mb-6 group-hover:scale-110 transition-transform duration-300 p-4 bg-accent/10 rounded-full"
                      whileHover={{ rotate: 5 }}
                    >
                      <item.icon className="h-12 w-12 text-accent" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-primary dark:text-white mb-4 group-hover:text-accent transition-colors duration-300">
                      {item.title}
                    </h3>
                    <div className="space-y-4">
                      <div className="relative bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-l-4 border-orange-500">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                              <AlertTriangle className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide mb-1">Challenge</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {item.problem}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="relative bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-l-4 border-accent">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                              <Shield className="h-3.5 w-3.5 text-accent" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">Solution</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {item.solution}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 bg-gradient-to-r from-warning/10 to-red-500/10 dark:from-warning/5 dark:to-red-500/5 border border-warning/30 dark:border-warning/20 shadow-xl">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <motion.div
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 bg-warning/20 rounded-2xl">
                    <AlertTriangle className="h-8 w-8 text-warning" />
                  </div>
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-primary dark:text-white mb-4">
                    {sectionContent.costTitle}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {sectionContent.costDescription}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sectionContent.costItems.map((item, index) => (
                      <motion.div
                        key={index}
                        className="group"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="relative p-5 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-accent/50 dark:hover:border-accent/30 transition-all duration-300 hover:shadow-lg">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <item.icon className="h-6 w-6 text-accent" />
                            </div>
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start gap-2">
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex-shrink-0 mt-0.5">Issue</span>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                                  {item.problem}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 text-accent/60">
                                <ArrowRight className="h-4 w-4 flex-shrink-0" />
                                <div className="h-px bg-gradient-to-r from-accent/30 to-transparent flex-1"></div>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-xs font-bold text-accent uppercase tracking-wider flex-shrink-0 mt-0.5">Fix</span>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1 font-medium">
                                  {item.solution}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* 3. The State of Privacy Today */}
      <FactsAndFigures />

      {/* 4. How SocialCaution Works */}
      <HowItWorks />

      {/* 5. Privacy Solutions */}
      <PrivacySolutionsCards />

      {/* 6. Get Your Personalized Privacy Score */}
      <PrivacyAssessmentPreview />

      {/* 7. What You'll Receive */}
      <WhatYouReceive />

      {/* 8. Your Privacy Journey */}
      <Section className="bg-light-blue dark:bg-background-secondary py-12 md:py-16">
        <PrivacyJourneyDemo />
      </Section>

      {/* 9. Essential Privacy Toolkit */}
      <EssentialPrivacyToolkit />

      {/* 10. Privacy Risk Exposure & Rights Action Center™ */}
      <PrivacyRiskTeaser />

      {/* 11. FAQ Section */}
      <FAQSection />

      {/* 12. Stay Protected */}
      <StayProtected />

      {/* 13. Take Control of Your Digital Privacy */}
      <CtaSection />
    </PageLayout>
  );
};

export default HomePage;