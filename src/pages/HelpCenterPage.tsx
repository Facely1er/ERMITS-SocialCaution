import React from 'react';
// motion removed - not used
import { HelpCircle, Book, MessageCircle, ExternalLink, Search, FileText, Shield, ArrowRight, Globe, Users } from 'lucide-react';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
// Button removed - not used
import PageLayout from '../components/layout/PageLayout';
import { Link } from 'react-router-dom';
// useTranslationContext removed - not used

const HelpCenterPage: React.FC = () => {
  return (
    <PageLayout
      title="Help Center"
      subtitle="Find answers to your questions and get the support you need"
      heroBackground={false}
      backgroundType="help"
      breadcrumbs={[
        { label: 'Help Center', path: '/help' }
      ]}
    >
      <Section>
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="help-search"
              name="search"
              placeholder="Search for help..."
              className="w-full py-3 pl-10 pr-4 border border-gray-300 dark:border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-card text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-accent/10 rounded-full mr-4">
                <Book className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Documentation</h3>
            </div>
            <div className="space-y-4">
              <Link to="/help/getting-started" className="block p-4 bg-light-blue/10 rounded-lg hover:bg-light-blue/20 transition-colors">
                <h4 className="font-medium mb-1">Getting Started</h4>
                <p className="text-sm text-gray-600">
                  Learn the basics of using SocialCaution
                </p>
              </Link>
              <Link to="/assessment" className="block p-4 bg-light-blue/10 rounded-lg hover:bg-light-blue/20 transition-colors">
                <h4 className="font-medium mb-1">Privacy Assessment</h4>
                <p className="text-sm text-gray-600">
                  Understanding your privacy assessment results
                </p>
              </Link>
              <Link to="/help/action-plan" className="block p-4 bg-light-blue/10 rounded-lg hover:bg-light-blue/20 transition-colors">
                <h4 className="font-medium mb-1">Action Plan</h4>
                <p className="text-sm text-gray-600">
                  How to implement privacy recommendations
                </p>
              </Link>
              <Link to="/resources/guides" className="flex items-center text-accent hover:text-accent-dark mt-2">
                View all guides
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-accent/10 rounded-full mr-4">
                <HelpCircle className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
            </div>
            <div className="space-y-4">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-light-blue/10 rounded-lg">
                  <span className="font-medium">How often should I run a privacy assessment?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="mt-4 px-4 text-gray-600">
                  We recommend running a privacy assessment every 3-6 months, or whenever you make significant changes to your online presence, such as creating new accounts or changing privacy settings.
                </div>
              </details>

              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-light-blue/10 rounded-lg">
                  <span className="font-medium">Is the free plan really free?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="mt-4 px-4 text-gray-600">
                  Yes! Our free plan includes basic privacy assessments, recommendations, and educational resources. There are no hidden fees or credit card required.
                </div>
              </details>

              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-light-blue/10 rounded-lg">
                  <span className="font-medium">Is my data safe with SocialCaution?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="mt-4 px-4 text-gray-600">
                  Absolutely. We take your privacy seriously. All assessment data is stored securely and never shared with third parties. We use industry-standard encryption and security practices.
                </div>
              </details>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-accent/10 rounded-full mr-4">
                <MessageCircle className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Contact Us</h3>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  id="help-subject"
                  name="subject"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="What can we help you with?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="help-message"
                  name="message"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  rows={4}
                  placeholder="Tell us more about your question or issue..."
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
              <div className="p-3 bg-accent/10 rounded-full mr-4">
                <ExternalLink className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Resources</h3>
            </div>
            <div className="space-y-4">
              <Link to="/blog" className="block p-4 bg-light-blue/10 rounded-lg hover:bg-light-blue/20 transition-colors">
                <h4 className="font-medium mb-1">Blog</h4>
                <p className="text-sm text-gray-600">
                  Latest privacy news and tips
                </p>
              </Link>
              <Link to="/toolkit" className="block p-4 bg-light-blue/10 rounded-lg hover:bg-light-blue/20 transition-colors">
                <h4 className="font-medium mb-1">Tools</h4>
                <p className="text-sm text-gray-600">
                  Interactive privacy protection tools
                </p>
              </Link>
            </div>
          </Card>
        </div>

        {/* Popular Help Topics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6">Popular Help Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center mb-3">
                <Shield className="h-5 w-5 text-accent mr-2" />
                <h3 className="font-medium">Privacy Scores</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Learn how privacy scores work and what they mean for your digital safety
              </p>
              <Link to="/assessment" className="text-accent hover:text-accent-dark text-sm flex items-center">
                Read more
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-3">
                <FileText className="h-5 w-5 text-accent mr-2" />
                <h3 className="font-medium">Data Brokers</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Understand what data brokers are and how to remove your information from their databases
              </p>
              <Link to="/resources/tools/data-broker-removal" className="text-accent hover:text-accent-dark text-sm flex items-center">
                Read more
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-3">
                <Globe className="h-5 w-5 text-accent mr-2" />
                <h3 className="font-medium">Social Media Privacy</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Best practices for protecting your privacy on social media platforms
              </p>
              <Link to="/resources/guides" className="text-accent hover:text-accent-dark text-sm flex items-center">
                Read more
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-3">
                <Users className="h-5 w-5 text-accent mr-2" />
                <h3 className="font-medium">Family Privacy</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Protect your family's privacy online with our comprehensive guides
              </p>
              <Link to="/resources/guides" className="text-accent hover:text-accent-dark text-sm flex items-center">
                Read more
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Card>
          </div>
        </div>



        {/* Additional Resources */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <ExternalLink className="h-5 w-5 text-accent mr-2" />
                <h3 className="font-medium">Blog</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Stay updated with the latest privacy news and tips.
              </p>
              <Link to="/blog" className="text-accent hover:text-accent-dark text-sm flex items-center">
                Visit our blog
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Book className="h-5 w-5 text-accent mr-2" />
                <h3 className="font-medium">Guides</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Comprehensive guides on various privacy topics and protection strategies.
              </p>
              <Link to="/toolkit" className="text-accent hover:text-accent-dark text-sm flex items-center">
                Browse guides
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-5 w-5 text-accent mr-2" />
                <h3 className="font-medium">Tools</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Interactive tools to help you manage and enhance your privacy.
              </p>
              <Link to="/toolkit" className="text-accent hover:text-accent-dark text-sm flex items-center">
                Explore tools
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Card>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default HelpCenterPage;