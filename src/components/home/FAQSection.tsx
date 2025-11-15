import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Section from '../common/Section';
import Button from '../common/Button';

export const FAQSection: React.FC = () => {
  const navigate = useNavigate();
  const [openItem, setOpenItem] = useState<number | null>(null);
  
  const faqs = [
    {
      id: 1,
      question: 'How does the privacy assessment work?',
      answer: 'Our assessment analyzes your digital footprint by checking your social media settings, password security, data broker exposure, and device security. The process takes about 3-5 minutes and provides you with a comprehensive privacy score and personalized recommendations.'
    },
    {
      id: 2,
      question: 'Is my data safe during the assessment?',
      answer: 'Absolutely. We don\'t store any of your personal data. The assessment runs locally in your browser, and we only collect anonymized analytics to improve our service. Your privacy is our top priority.'
    },
    {
      id: 3,
      question: 'What if I get a low privacy score?',
      answer: 'Don\'t worry! A low score just means there are opportunities to improve your privacy. We provide step-by-step guidance to help you address each vulnerability, and you can retake the assessment anytime to track your progress.'
    },
    {
      id: 4,
      question: 'How often should I reassess my privacy?',
      answer: 'We recommend reassessing your privacy every 3-6 months, or whenever you make significant changes to your digital habits, add new accounts, or install new apps. Our monitoring features will also alert you to new risks.'
    }
  ];

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <Section
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about privacy protection"
      centered
      className="bg-gray-50 dark:bg-gray-800 py-16"
    >
      <div className="max-w-3xl mx-auto">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-lg font-semibold text-primary dark:text-white pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openItem === faq.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {openItem === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-gray-600 dark:text-gray-300 pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Get All Answers Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <Button
            variant="outline"
            className="px-8 py-3"
            onClick={() => navigate('/help')}
          >
            Get All Answers
          </Button>
        </motion.div>
      </div>
    </Section>
  );
};