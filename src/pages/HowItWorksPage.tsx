import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HowItWorks } from '../components/home/HowItWorks';
import { PrivacyJourney } from '../components/home/PrivacyJourney';
import PageLayout from '../components/layout/PageLayout';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { ArrowRight, Shield, Users, Database, Lock, Eye, FileText, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorksPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <PageLayout
      title="How It Works"
      subtitle="Discover how SocialCaution helps you protect your digital privacy"
      heroBackground={false}
      backgroundType="matrix"
      breadcrumbs={[
        { label: 'How It Works', path: '/how-it-works' }
      ]}
    >
      <HowItWorks />
      
      {/* Privacy Tools Section */}
      <Section className="bg-light-blue dark:bg-background-secondary py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">Our Privacy Protection Tools</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Comprehensive solutions for all your privacy needs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Link to="/assessment/exposure">
            <Card className="p-6 h-full hover:shadow-lg transition-all">
              <div className="flex items-start mb-4">
                <Eye className="h-6 w-6 text-accent mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-primary dark:text-white">Digital Exposure Assessment</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Discover where your personal information is exposed online and identify vulnerabilities</p>
                </div>
              </div>
              <div className="mt-4 text-accent flex items-center justify-end">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Card>
          </Link>
          
          <Link to="/resources/tools/privacy-simulator">
            <Card className="p-6 h-full hover:shadow-lg transition-all">
              <div className="flex items-start mb-4">
                <Lock className="h-6 w-6 text-accent mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-primary dark:text-white">Privacy Simulator</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Test different privacy settings and see their impact on your protection</p>
                </div>
              </div>
              <div className="mt-4 text-accent flex items-center justify-end">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Card>
          </Link>
          
          <Link to="/resources/tools/data-broker-removal">
            <Card className="p-6 h-full hover:shadow-lg transition-all">
              <div className="flex items-start mb-4">
                <Database className="h-6 w-6 text-accent mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-primary dark:text-white">Data Broker Removal</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Remove your personal information from data broker sites that sell your data</p>
                </div>
              </div>
              <div className="mt-4 text-accent flex items-center justify-end">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Card>
          </Link>
          
          <Link to="/resources/tools/personal-data-inventory">
            <Card className="p-6 h-full hover:shadow-lg transition-all">
              <div className="flex items-start mb-4">
                <FileText className="h-6 w-6 text-accent mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-primary dark:text-white">Personal Data Inventory</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Catalog where your personal information is stored and shared</p>
                </div>
              </div>
              <div className="mt-4 text-accent flex items-center justify-end">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Card>
          </Link>
        </div>
      </Section>
      
      {/* Benefits Section */}
      <Section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">Why Choose SocialCaution?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">We provide comprehensive privacy protection tools and education to help you take control of your digital life</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-6 text-center">
            <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary dark:text-white mb-2">Comprehensive Protection</h3>
            <p className="text-gray-600 dark:text-gray-300">Complete privacy assessment and protection tools for all aspects of your digital life</p>
          </Card>
          
          <Card className="p-6 text-center">
            <Users className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary dark:text-white mb-2">Expert Guidance</h3>
            <p className="text-gray-600 dark:text-gray-300">Get personalized recommendations and guidance from privacy experts</p>
          </Card>
          
          <Card className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary dark:text-white mb-2">Proven Results</h3>
            <p className="text-gray-600 dark:text-gray-300">Join thousands of users who have successfully improved their privacy protection</p>
          </Card>
        </div>
      </Section>
      
      {/* CTA Section */}
      <Section className="bg-accent text-white py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Take Control of Your Privacy?</h2>
          <p className="text-xl mb-8">Start your privacy journey today with our comprehensive assessment and protection tools</p>
          <Button
            variant="primary"
            className="bg-white text-accent hover:bg-gray-100 px-8 py-3 text-lg"
            onClick={() => navigate('/assessment')}
          >
            Start Your Assessment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </Section>
      
      <PrivacyJourney />
    </PageLayout>
  );
};

export default HowItWorksPage;