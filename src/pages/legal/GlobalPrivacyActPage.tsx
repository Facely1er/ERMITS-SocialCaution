import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, AlertTriangle, Info } from 'lucide-react';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';
import VerticalNav from '../../components/legal/VerticalNav';
// import { useTranslation } from 'react-i18next';
// import { useTranslationContext } from '../../hooks/useTranslationContext';

const GlobalPrivacyActPage: React.FC = () => {


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
            <Globe className="h-8 w-8 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">Global Privacy Laws</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">Understanding privacy regulations around the world</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <VerticalNav />
          
          <div className="flex-1">
            <Card className="p-8">
              <div className="prose max-w-none dark:prose-invert">
                <p className="lead text-lg text-gray-600 dark:text-gray-300 mb-8">
                  While there is no single global privacy law, international privacy frameworks continue to evolve through various regional and national regulations. The most significant developments include the European Union's GDPR, various state laws in the United States, and emerging privacy legislation in other countries.
                </p>

                <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg mb-8">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-accent mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-primary dark:text-white mb-2">Current Global Privacy Landscape</h3>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                        <li><strong>GDPR:</strong> European Union's comprehensive data protection regulation (effective May 2018)</li>
                        <li><strong>State Laws:</strong> California, Virginia, Colorado, Connecticut, and other US states with privacy laws</li>
                        <li><strong>International:</strong> Privacy laws in Canada (PIPEDA), Brazil (LGPD), Japan (APPI), and other countries</li>
                        <li><strong>Enforcement:</strong> National data protection authorities in each jurisdiction</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h2 id="key-principles" className="text-2xl font-bold text-primary dark:text-white mb-4">Common Privacy Principles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <h3 className="font-semibold text-primary dark:text-white mb-3">Data Minimization</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Most modern privacy laws require organizations to collect only the data necessary for their stated purposes. This principle helps reduce privacy risks and data exposure.
                    </p>
                  </div>
                  
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <h3 className="font-semibold text-primary dark:text-white mb-3">Purpose Limitation</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Personal data should only be used for the purposes for which it was originally collected, unless additional consent is obtained or other legal bases apply.
                    </p>
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <h3 className="font-semibold text-primary dark:text-white mb-3">Privacy by Design and Default</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      This principle, prominently featured in GDPR, requires organizations to build privacy protections into their systems from the ground up and set privacy-friendly defaults for users.
                    </p>
                  </div>
                  
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <h3 className="font-semibold text-primary dark:text-white mb-3">Individual Rights</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Most modern privacy laws grant individuals rights such as access to their data, the right to correction, deletion, and data portability, though the specific rights vary by jurisdiction.
                    </p>
                  </div>
                  
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <h3 className="font-semibold text-primary dark:text-white mb-3">Cross-Border Data Transfers</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      International data transfers are regulated differently across jurisdictions, with mechanisms like adequacy decisions, standard contractual clauses, and certification schemes used to ensure adequate protection.
                    </p>
                  </div>
                </div>

                <h2 id="your-rights" className="text-2xl font-bold text-primary dark:text-white mb-4">Common Privacy Rights</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-accent/10 rounded-full">
                      <Shield className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary dark:text-white mb-2">Individual Rights Framework</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Most modern privacy laws grant individuals similar rights, though the specifics vary by jurisdiction:
                      </p>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-300 mt-2 list-disc pl-5">
                        <li><strong>Right to Be Informed:</strong> Clear information about data collection and processing</li>
                        <li><strong>Right to Access:</strong> Obtain copies of your personal data</li>
                        <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                        <li><strong>Right to Erasure:</strong> Request deletion of personal data under certain circumstances</li>
                        <li><strong>Right to Restriction:</strong> Limit how your data is used</li>
                        <li><strong>Right to Data Portability:</strong> Receive and transfer your data between services</li>
                        <li><strong>Right to Object:</strong> Oppose certain types of processing</li>
                        <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-accent/10 rounded-full">
                      <FileText className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary dark:text-white mb-2">Exercising Your Rights</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        To exercise your privacy rights, you typically need to:
                      </p>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-300 mt-2 list-disc pl-5">
                        <li>Contact the organization directly through their privacy portal or designated email</li>
                        <li>Provide identification to verify your identity</li>
                        <li>Be specific about which rights you want to exercise</li>
                        <li>Follow up if you don't receive a response within the required timeframe</li>
                        <li>Contact the relevant data protection authority if your rights are not respected</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">Enforcement</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Privacy laws are enforced by national data protection authorities in each jurisdiction, with varying enforcement mechanisms and penalties.
                </p>

                <div className="bg-warning/10 dark:bg-warning/5 p-6 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-warning mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-primary dark:text-white mb-2">Important Disclaimer</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        <strong>This content is for educational purposes only and does not constitute legal advice.</strong> Privacy laws vary significantly by jurisdiction and are subject to frequent changes. Always consult with qualified legal professionals for advice specific to your situation and location.
                      </p>
                      <h4 className="font-semibold text-primary dark:text-white mb-2">Common Enforcement Mechanisms</h4>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                        <li>Administrative fines (varies by jurisdiction - GDPR: up to €20M or 4% of revenue)</li>
                        <li>Mandatory breach notifications (typically 24-72 hours)</li>
                        <li>Corrective measures and compliance orders</li>
                        <li>Data processing suspension or prohibition</li>
                        <li>Individual rights to seek judicial remedies</li>
                      </ul>
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

export default GlobalPrivacyActPage;
