import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, FileText, Info, Check, AlertTriangle } from 'lucide-react';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';
import VerticalNav from '../../components/legal/VerticalNav';
// import { useTranslation } from 'react-i18next';
// import { useTranslationContext } from '../../hooks/useTranslationContext';

const GDPRPage: React.FC = () => {


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
            <Shield className="h-8 w-8 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">GDPR Updates</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">Key changes to the European Union's data protection framework</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <VerticalNav />
          
          <div className="flex-1">
            <Card className="p-8">
              <div className="prose max-w-none dark:prose-invert">
                <p className="lead text-lg text-gray-600 dark:text-gray-300 mb-8">
                  The European Union's General Data Protection Regulation (GDPR) remains the gold standard for comprehensive privacy protection. While there are ongoing discussions about potential updates, the current GDPR framework continues to provide strong data protection rights and obligations.
                </p>

                <h2 id="key-provisions" className="text-2xl font-bold text-primary dark:text-white mb-4">Key Provisions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Lock className="h-5 w-5 text-accent mr-2" />
                      <h3 className="font-semibold text-primary dark:text-white">Consent Requirements</h3>
                    </div>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>Clear and unambiguous consent for data processing</li>
                      <li>Easy withdrawal of consent at any time</li>
                      <li>Specific consent for different processing purposes</li>
                      <li>Special protections for children's consent</li>
                    </ul>
                  </div>
                  
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <div className="flex items-center mb-3">
                      <FileText className="h-5 w-5 text-accent mr-2" />
                      <h3 className="font-semibold text-primary dark:text-white">Data Subject Rights</h3>
                    </div>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>Right to access personal data</li>
                      <li>Right to rectification and erasure</li>
                      <li>Right to data portability</li>
                      <li>Right to object to processing</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Check className="h-5 w-5 text-accent mr-2" />
                      <h3 className="font-semibold text-primary dark:text-white">Privacy by Design and Default</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Organizations must implement privacy considerations from the earliest stages of product development and ensure that privacy-friendly settings are the default option for users.
                    </p>
                  </div>
                  
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Info className="h-5 w-5 text-accent mr-2" />
                      <h3 className="font-semibold text-primary dark:text-white">Data Protection Impact Assessments</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Organizations must conduct impact assessments for high-risk processing activities, evaluating potential privacy risks and implementing appropriate safeguards.
                    </p>
                  </div>
                  
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Shield className="h-5 w-5 text-accent mr-2" />
                      <h3 className="font-semibold text-primary dark:text-white">Data Breach Notification</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Organizations must notify authorities of data breaches within 72 hours and inform affected individuals without undue delay when there is a high risk to their rights and freedoms.
                    </p>
                  </div>
                </div>

                <h2 id="compliance" className="text-2xl font-bold text-primary dark:text-white mb-4">Compliance Requirements</h2>
                <div className="space-y-6 mb-8">
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <h3 className="font-semibold text-primary dark:text-white mb-3">Documentation Requirements</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>Privacy impact assessments for high-risk processing</li>
                      <li>Records of processing activities</li>
                      <li>Data protection policies and procedures</li>
                      <li>Staff training records and privacy awareness programs</li>
                    </ul>
                  </div>
                  
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <h3 className="font-semibold text-primary dark:text-white mb-3">Technical and Organizational Measures</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>Appropriate technical safeguards for data security</li>
                      <li>Data minimization and purpose limitation</li>
                      <li>Regular security assessments and updates</li>
                      <li>Incident response and breach management procedures</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">Enforcement</h2>
                <div className="space-y-4 mb-8">
                  <p className="text-gray-600 dark:text-gray-300">
                    The GDPR is enforced by national Data Protection Authorities (DPAs) in each EU member state, with the following key aspects:
                  </p>
                  
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300 list-disc pl-5">
                    <li>Complaint handling and investigation procedures</li>
                    <li>Cooperation between national DPAs through the European Data Protection Board</li>
                    <li>Administrative fines up to €20 million or 4% of annual global turnover</li>
                    <li>Corrective measures and compliance orders</li>
                    <li>Individual rights to seek judicial remedies</li>
                  </ul>
                  
                  <p className="text-gray-600 dark:text-gray-300">
                    Enforcement has become increasingly active since GDPR's implementation, with significant fines imposed on major companies for various violations.
                  </p>
                </div>

                <div className="bg-warning/10 dark:bg-warning/5 p-6 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-warning mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-primary dark:text-white mb-2">Important Disclaimer</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        <strong>This content is for educational purposes only and does not constitute legal advice.</strong> GDPR compliance requirements are complex and vary by organization and situation. Always consult with qualified legal professionals for advice specific to your organization and circumstances.
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        Organizations must ensure ongoing GDPR compliance through regular reviews and updates of their privacy programs. Non-compliance can result in administrative fines up to €20 million or 4% of global annual revenue, whichever is higher.
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

export default GDPRPage;
