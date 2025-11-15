import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Scale, Info, ArrowRight, Globe, FileText, Lock, Shield, AlertTriangle, BookOpen, Check } from 'lucide-react';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import VerticalNav from '../../components/legal/VerticalNav';
// import { useTranslation } from 'react-i18next';
// import { useTranslationContext } from '../../hooks/useTranslationContext';

const PrivacyLawsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Section className="pt-32">
        <div className="flex items-center mb-8">
          <div className="p-4 bg-accent/10 rounded-full mr-4">
            <Scale className="h-8 w-8 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">Privacy Laws & Regulations</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">Understanding the legal framework that protects your digital privacy</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <VerticalNav />
          
          <div className="flex-1">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">Overview</h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The digital privacy landscape has undergone significant transformation in 2024-2025, with several major regulations coming into effect globally. These changes have profound implications for how your personal data is collected, stored, processed, and shared online.
              </p>

              <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg mb-8">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-accent mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-primary dark:text-white mb-2">Why Privacy Laws Matter</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Privacy laws provide the foundation for your digital rights. They establish boundaries for data collection, mandate security standards, and give you mechanisms to control your personal information. As data-driven technologies continue to advance, these laws serve as essential guardrails protecting individual privacy in the digital age.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-6 text-primary dark:text-white">The Global Privacy Landscape in 2025</h3>
              
              <div className="space-y-6 mb-8">
                <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                  <div className="flex items-start">
                    <Globe className="h-5 w-5 text-accent mt-1 mr-3" />
                    <div>
                      <h4 className="font-semibold text-primary dark:text-white mb-2">Global Privacy Act (GPA)</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        The Global Privacy Act, effective January 2025, represents the most comprehensive international data protection framework to date. Spanning 42 countries including the US, EU member states, UK, Canada, Japan, Australia, and Brazil, it creates a harmonized approach to privacy protection.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-accent/10 text-accent dark:text-accent px-2 py-1 rounded-full">Effective Jan 2025</span>
                        <span className="text-xs bg-accent/10 text-accent dark:text-accent px-2 py-1 rounded-full">42 Countries</span>
                        <span className="text-xs bg-accent/10 text-accent dark:text-accent px-2 py-1 rounded-full">6% Revenue Penalties</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-accent mt-1 mr-3" />
                    <div>
                      <h4 className="font-semibold text-primary dark:text-white mb-2">GDPR 2.0 Enhancements</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        The European Union's "GDPR 2.0" amendments took effect in March 2025, strengthening the original framework with additional protections including enhanced consent requirements, IoT device provisions, and the right to offline alternatives for essential services.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-accent/10 text-accent dark:text-accent px-2 py-1 rounded-full">Effective Mar 2025</span>
                        <span className="text-xs bg-accent/10 text-accent dark:text-accent px-2 py-1 rounded-full">EU-wide</span>
                        <span className="text-xs bg-accent/10 text-accent dark:text-accent px-2 py-1 rounded-full">Enhanced Protections</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-accent mt-1 mr-3" />
                    <div>
                      <h4 className="font-semibold text-primary dark:text-white mb-2">US State Privacy Laws</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        By 2025, 38 US states have enacted comprehensive privacy legislation, creating a complex patchwork of regulations. Notable laws include the California Privacy Rights Act (CPRA), Virginia Consumer Data Protection Act (VCDPA), Colorado Privacy Act (CPA), and the New York Privacy Act (NYPA).
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-accent/10 text-accent dark:text-accent px-2 py-1 rounded-full">38 States</span>
                        <span className="text-xs bg-accent/10 text-accent dark:text-accent px-2 py-1 rounded-full">Varying Requirements</span>
                        <span className="text-xs bg-accent/10 text-accent dark:text-accent px-2 py-1 rounded-full">State-specific Rights</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-primary dark:text-white">Key Privacy Rights in 2025</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Info className="h-4 w-4 text-accent mr-2" />
                    <h4 className="font-medium text-primary dark:text-white">Right to Be Informed</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Detailed notifications about data collection and processing in clear, plain language</p>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FileText className="h-4 w-4 text-accent mr-2" />
                    <h4 className="font-medium text-primary dark:text-white">Right to Access</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Obtain copies of your personal data and information about how it's being used</p>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Check className="h-4 w-4 text-accent mr-2" />
                    <h4 className="font-medium text-primary dark:text-white">Right to Rectification</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Correct inaccurate or incomplete data</p>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-4 w-4 text-accent mr-2" />
                    <h4 className="font-medium text-primary dark:text-white">Right to Erasure</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Request deletion of your personal data under specific circumstances</p>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Lock className="h-4 w-4 text-accent mr-2" />
                    <h4 className="font-medium text-primary dark:text-white">Right to Restriction</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Limit how your data is used</p>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center mb-2">
                    <BookOpen className="h-4 w-4 text-accent mr-2" />
                    <h4 className="font-medium text-primary dark:text-white">Right to Data Portability</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Receive and transfer your data between services</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-primary dark:text-white">Enforcement Mechanisms</h3>
              
              <div className="space-y-4 mb-8">
                <p className="text-gray-600 dark:text-gray-300">
                  A key development in recent privacy regulation is the strengthening of enforcement mechanisms. The creation of dedicated privacy authorities and increased penalties has significantly raised the stakes for non-compliance.
                </p>
                
                <div className="bg-light-blue/10 dark:bg-card-hover p-4 rounded-lg">
                  <h4 className="font-medium text-primary dark:text-white mb-2">International Coordination</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    The International Data Protection Authority (IDPA) facilitates cooperation between national regulators, coordinates cross-border investigations, and serves as a clearinghouse for privacy complaints that span multiple jurisdictions.
                  </p>
                </div>
                
                <div className="bg-light-blue/10 dark:bg-card-hover p-4 rounded-lg">
                  <h4 className="font-medium text-primary dark:text-white mb-2">Individual Action</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Most modern privacy frameworks include provisions for both administrative complaints and private rights of action, allowing individuals to seek remedies directly from organizations that violate their privacy rights.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-primary dark:text-white">Future Outlook</h3>
              
              <div className="space-y-4 mb-8">
                <p className="text-gray-600 dark:text-gray-300">
                  Privacy regulation continues to evolve rapidly. Looking ahead, several trends are likely to shape the next generation of privacy laws:
                </p>
                
                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                  <li><strong>AI-Specific Regulation:</strong> More targeted rules for artificial intelligence and machine learning systems</li>
                  <li><strong>Data Fiduciary Models:</strong> Requirements for companies to act as trustworthy stewards of personal data</li>
                  <li><strong>Expanded Definition of Personal Data:</strong> Broader recognition of what constitutes identifiable information</li>
                  <li><strong>Collective Redress:</strong> Enhanced mechanisms for groups of affected individuals to seek remedies</li>
                  <li><strong>Privacy-Enhancing Technologies:</strong> Incentives or requirements for implementing PETs</li>
                </ul>
              </div>

              <div className="bg-accent/5 dark:bg-accent/10 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-primary dark:text-white">Protecting Your Privacy Rights</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Understanding privacy laws empowers you to take practical steps to protect your personal information:
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <div className="bg-accent/10 p-1 rounded-full mr-3 mt-1">
                      <Check className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-primary dark:text-white">Data Access Requests</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Periodically request your data from major services to understand what information is being collected</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-accent/10 p-1 rounded-full mr-3 mt-1">
                      <Check className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-primary dark:text-white">Opt-Out of Sale/Sharing</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Use privacy rights portals to opt out of data sharing and sales</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-accent/10 p-1 rounded-full mr-3 mt-1">
                      <Check className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-primary dark:text-white">Delete Unnecessary Accounts</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Request account deletion for services you no longer use</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-accent/10 p-1 rounded-full mr-3 mt-1">
                      <Check className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-primary dark:text-white">Review Settings</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Regularly audit privacy settings on social media platforms and apps</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-accent/10 p-1 rounded-full mr-3 mt-1">
                      <Check className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-primary dark:text-white">Report Violations</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">File complaints with appropriate authorities when your rights are violated</p>
                    </div>
                  </div>
                </div>
                
                <Button variant="primary" onClick={() => navigate('/assessment')}>
                  Take Privacy Assessment <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </motion.div>
  );
};

export default PrivacyLawsPage;