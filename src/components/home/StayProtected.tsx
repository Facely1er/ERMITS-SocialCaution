import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle, Mail, Shield } from 'lucide-react';
import Section from '../common/Section';
import Button from '../common/Button';

export const StayProtected: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send the email to your backend
      // Track email subscription (commented out for production)
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <Section
      title="Stay Protected"
      subtitle="Get privacy alerts and tips delivered to your inbox"
      centered
      className="bg-yellow-100 dark:bg-yellow-900/20 py-12"
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Alert Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <div className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="h-7 w-7 text-white" />
          </div>
        </motion.div>

        {/* Email Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="subscribe-email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-card text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  className="px-6 py-3 bg-accent hover:bg-accent-dark text-white font-medium"
                >
                  Subscribe
                </Button>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="h-6 w-6 text-green-600 mr-2" />
                  <span className="text-green-800 dark:text-green-200 font-medium">
                    Successfully Subscribed!
                  </span>
                </div>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  You'll receive privacy alerts and tips in your inbox.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Privacy Reassurance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6"
        >
          <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
            <Shield className="h-4 w-4 mr-2" />
            <span>
              We respect your privacy. No spam, unsubscribe anytime.{' '}
              <Link to="/privacy" className="text-yellow-600 hover:text-yellow-700 ml-1 underline">
                Privacy Policy
              </Link>
            </span>
          </div>
        </motion.div>

        {/* Compact Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span>Breach Alerts</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-yellow-600" />
            <span>Weekly Tips</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-yellow-600" />
            <span>Privacy Updates</span>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};