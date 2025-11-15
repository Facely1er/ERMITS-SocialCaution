import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Globe, Info, AlertTriangle } from 'lucide-react';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';
import VerticalNav from '../../components/legal/VerticalNav';
// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useTranslationContext } from '../../hooks/useTranslationContext';

const USPrivacyPage: React.FC = () => {


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
            <FileText className="h-8 w-8 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">US Privacy Laws</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">The evolving landscape of data protection in the United States</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <VerticalNav />
          
          <div className="flex-1">
            <Card className="p-8">
              <div className="prose max-w-none dark:prose-invert">
                <p className="lead text-lg text-gray-600 dark:text-gray-300 mb-8">
                  The United States takes a sectoral approach to privacy regulation, with different laws 
                  governing specific industries and types of data. Understanding these various regulations 
                  is crucial for effective privacy protection.
                </p>

                <h2 id="federal" className="text-2xl font-bold text-primary dark:text-white mb-4">Federal Framework</h2>
                <div className="space-y-4 mb-8">
                  <p className="text-gray-600 dark:text-gray-300">
                    The United States currently lacks comprehensive federal privacy legislation. Instead, privacy protection is provided through a patchwork of state laws and sector-specific federal regulations.
                  </p>
                  
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Shield className="h-5 w-5 text-accent mr-2" />
                      <h3 className="font-semibold text-primary dark:text-white">Proposed Federal Privacy Legislation</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      While comprehensive federal privacy legislation has been proposed multiple times, including the American Data Privacy and Protection Act (ADPPA), no federal law has been enacted as of 2024. Key proposals typically include:
                    </p>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>Consumer rights to access, correct, and delete personal data</li>
                      <li>Data minimization and purpose limitation requirements</li>
                      <li>Algorithmic transparency and automated decision-making protections</li>
                      <li>Private right of action for certain violations</li>
                      <li>Preemption of weaker state laws while preserving stronger protections</li>
                    </ul>
                  </div>
                  
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Globe className="h-5 w-5 text-accent mr-2" />
                      <h3 className="font-semibold text-primary dark:text-white">Sectoral Federal Laws</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      In addition to the FPPA, several industry-specific federal laws continue to provide targeted protections:
                    </p>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li><strong>HIPAA</strong> (Health Insurance Portability and Accountability Act) - Healthcare privacy</li>
                      <li><strong>GLBA</strong> (Gramm-Leach-Bliley Act) - Financial privacy</li>
                      <li><strong>COPPA</strong> (Children's Online Privacy Protection Act) - Children's privacy</li>
                      <li><strong>FCRA</strong> (Fair Credit Reporting Act) - Consumer reporting</li>
                      <li><strong>FERPA</strong> (Family Educational Rights and Privacy Act) - Educational records</li>
                    </ul>
                  </div>
                </div>

                <h2 id="state" className="text-2xl font-bold text-primary dark:text-white mb-4">State Privacy Laws</h2>
                <div className="space-y-4 mb-8">
                  <p className="text-gray-600 dark:text-gray-300">
                    As of 2024, several states have enacted comprehensive privacy legislation, creating a complex patchwork of regulations. Each state law offers varying levels of protection and different requirements.
                  </p>
                  
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <h3 className="font-semibold text-primary dark:text-white mb-3">Leading State Privacy Laws</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-primary dark:text-white">California Privacy Rights Act (CPRA)</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">The most comprehensive state law, establishing a dedicated privacy agency and expanding consumer rights beyond the original CCPA. Key features include the right to correct inaccurate information, expanded opt-out rights, and heightened protections for sensitive data.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-primary dark:text-white">Virginia Consumer Data Protection Act (VCDPA)</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Focuses on consumer control with strong opt-in requirements for sensitive data and clear provisions for data subject rights. Includes unique provisions for data protection assessments and consumer appeals processes.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-primary dark:text-white">Colorado Privacy Act (CPA)</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Combines elements of both CPRA and VCDPA with additional transparency requirements and universal opt-out mechanisms. Features strong controller obligations and regular risk assessment requirements.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-primary dark:text-white">New York Privacy Act (NYPA)</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Introduces the concept of "data fiduciaries," requiring businesses to act in the best interest of consumers when handling their data. Includes robust enforcement mechanisms and broad applicability to businesses of all sizes.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <h3 className="font-semibold text-primary dark:text-white mb-3">State Law Comparison</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-800">
                            <th className="p-2 text-left">Feature</th>
                            <th className="p-2 text-center">California (CPRA)</th>
                            <th className="p-2 text-center">Virginia (VCDPA)</th>
                            <th className="p-2 text-center">Colorado (CPA)</th>
                            <th className="p-2 text-center">New York (NYPA)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="p-2 font-medium">Right to Delete</td>
                            <td className="p-2 text-center">✓</td>
                            <td className="p-2 text-center">✓</td>
                            <td className="p-2 text-center">✓</td>
                            <td className="p-2 text-center">✓</td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="p-2 font-medium">Right to Correct</td>
                            <td className="p-2 text-center">✓</td>
                            <td className="p-2 text-center">✓</td>
                            <td className="p-2 text-center">✓</td>
                            <td className="p-2 text-center">✓</td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="p-2 font-medium">Private Right of Action</td>
                            <td className="p-2 text-center">Limited</td>
                            <td className="p-2 text-center">No</td>
                            <td className="p-2 text-center">No</td>
                            <td className="p-2 text-center">Yes</td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="p-2 font-medium">Opt-Out of Profiling</td>
                            <td className="p-2 text-center">✓</td>
                            <td className="p-2 text-center">✓</td>
                            <td className="p-2 text-center">✓</td>
                            <td className="p-2 text-center">✓</td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="p-2 font-medium">Data Fiduciary Duty</td>
                            <td className="p-2 text-center">No</td>
                            <td className="p-2 text-center">No</td>
                            <td className="p-2 text-center">No</td>
                            <td className="p-2 text-center">✓</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg mb-8">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-accent mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-primary dark:text-white mb-2">Navigating Multiple Laws</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        For US residents, your privacy rights may vary depending on your state of residence. Many businesses opt to apply the strictest standards across all operations, meaning consumers often benefit from protections beyond what their state law requires.
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">Enforcement Landscape</h2>
                <div className="space-y-4 mb-8">
                  <p className="text-gray-600 dark:text-gray-300">
                    The US privacy enforcement landscape involves multiple agencies and mechanisms:
                  </p>
                  
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300 list-disc pl-5">
                    <li><strong>Federal Trade Commission (FTC):</strong> Primary federal enforcer for consumer privacy and unfair business practices</li>
                    <li><strong>State Attorneys General:</strong> Enforcement authority for state privacy laws</li>
                    <li><strong>California Privacy Protection Agency (CPPA):</strong> Dedicated privacy regulator in California</li>
                    <li><strong>Private Litigation:</strong> Available under some laws for certain violations</li>
                    <li><strong>Sectoral Regulators:</strong> Various federal agencies oversee specific industries (e.g., HHS for healthcare, CFPB for financial services)</li>
                  </ul>
                </div>

                <div className="bg-warning/10 dark:bg-warning/5 p-6 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-warning mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-primary dark:text-white mb-2">Important Disclaimer</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        <strong>This content is for educational purposes only and does not constitute legal advice.</strong> US privacy laws are complex and vary significantly by state and industry. Always consult with qualified legal professionals for advice specific to your situation and location.
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        Organizations must navigate multiple, sometimes overlapping privacy regulations. A comprehensive privacy program should address both federal and state requirements while maintaining flexibility for emerging regulations. For individuals, understanding these overlapping protections helps you effectively exercise your rights.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </motion.div>
  );
};

export default USPrivacyPage;
