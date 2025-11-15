import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HelpCircle, Book, MessageCircle, ExternalLink } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';

const HelpPage: React.FC = () => {
  return (
    <DashboardLayout
      title="Help & Support"
      subtitle="Get help with using SocialCaution and protecting your privacy"
      breadcrumbs={[
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Help', path: '/dashboard/help' }
      ]}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Book className="w-6 h-6 text-accent mr-3" />
              <h3 className="text-lg font-semibold">Documentation</h3>
            </div>
            <div className="space-y-4">
              <Link to="/help/getting-started" className="block p-4 bg-light-blue/10 rounded-lg hover:bg-light-blue/20 transition-colors">
                <h4 className="font-medium mb-1">Getting Started Guide</h4>
                <p className="text-sm text-gray-600">Learn the basics of using SocialCaution</p>
              </Link>
              <Link to="/assessment" className="block p-4 bg-light-blue/10 rounded-lg hover:bg-light-blue/20 transition-colors">
                <h4 className="font-medium mb-1">Privacy Assessment Guide</h4>
                <p className="text-sm text-gray-600">Understanding your privacy assessment results</p>
              </Link>
              <Link to="/help/action-plan" className="block p-4 bg-light-blue/10 rounded-lg hover:bg-light-blue/20 transition-colors">
                <h4 className="font-medium mb-1">Action Plan Tutorial</h4>
                <p className="text-sm text-gray-600">How to implement privacy recommendations</p>
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <HelpCircle className="w-6 h-6 text-accent mr-3" />
              <h3 className="text-lg font-semibold">FAQs</h3>
            </div>
            <div className="space-y-4">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-light-blue/10 rounded-lg">
                  <span className="font-medium">How often should I run assessments?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="mt-4 px-4 text-gray-600">
                  We recommend running a full privacy assessment every 3 months, or whenever you make significant changes to your digital habits or accounts.
                </div>
              </details>

              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-light-blue/10 rounded-lg">
                  <span className="font-medium">What's included in the free plan?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="mt-4 px-4 text-gray-600">
                  The free plan includes basic privacy assessments, limited recommendations, and essential privacy tools. Upgrade to Premium for advanced features.
                </div>
              </details>

              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-light-blue/10 rounded-lg">
                  <span className="font-medium">How secure is my data?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="mt-4 px-4 text-gray-600">
                  We use industry-standard encryption and security measures to protect your data. Your privacy assessment data is stored securely and never shared with third parties.
                </div>
              </details>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <MessageCircle className="w-6 h-6 text-accent mr-3" />
              <h3 className="text-lg font-semibold">Contact Support</h3>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  id="dashboard-help-subject"
                  name="subject"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="What can we help you with?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="dashboard-help-message"
                  name="message"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  rows={4}
                  placeholder="Search for help topics..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-accent text-white py-2 px-4 rounded-lg hover:bg-accent-dark transition-colors"
              >
                Send Message
              </button>
            </form>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <ExternalLink className="w-6 h-6 text-accent mr-3" />
              <h3 className="text-lg font-semibold">Additional Resources</h3>
            </div>
            <div className="space-y-4">
              <Link to="/blog" className="block p-4 bg-light-blue/10 rounded-lg hover:bg-light-blue/20 transition-colors">
                <h4 className="font-medium mb-1">Privacy Blog</h4>
                <p className="text-sm text-gray-600">Latest privacy news and tips</p>
              </Link>
            </div>
          </Card>
        </div>
        </Section>
      </motion.div>
    </DashboardLayout>
  );
};

export default HelpPage;