import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Globe, FileText, Scale, Check, Info } from 'lucide-react';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';
import VerticalNav from '../../components/legal/VerticalNav';
// import { useTranslation } from 'react-i18next';
// import { useTranslationContext } from '../../hooks/useTranslationContext';

const EnforcementPage: React.FC = () => {


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
            <AlertTriangle className="h-8 w-8 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">Privacy Law Enforcement</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">Understanding how privacy laws are enforced and your rights protected</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <VerticalNav />
          
          <div className="flex-1">
            <Card className="p-8">
              <div className="prose max-w-none dark:prose-invert">
                <p className="lead text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Understanding how privacy laws are enforced and the mechanisms available for protecting 
                  your rights is crucial for effective privacy protection. A key development in recent privacy regulation is the strengthening of enforcement mechanisms.
                </p>

                <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">Enforcement Authorities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Globe className="h-5 w-5 text-accent mr-2" />
                      <h3 className="font-semibold text-primary dark:text-white">International Coordination</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      The International Data Protection Authority (IDPA) facilitates cooperation between national regulators, coordinates cross-border investigations, and serves as a clearinghouse for privacy complaints that span multiple jurisdictions.
                    </p>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>Coordinates enforcement across 42 countries</li>
                      <li>Manages cross-border complaint resolution</li>
                      <li>Publishes enforcement guidelines</li>
                      <li>Maintains global violation database</li>
                    </ul>
                  </div>
                  
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Shield className="h-5 w-5 text-accent mr-2" />
                      <h3 className="font-semibold text-primary dark:text-white">National Authorities</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      Each participating country maintains its own data protection authority with primary enforcement responsibility within its borders.
                    </p>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>European Data Protection Board (EU)</li>
                      <li>Federal Privacy Bureau (US)</li>
                      <li>Office of the Privacy Commissioner (Canada)</li>
                      <li>Personal Information Protection Commission (Japan)</li>
                      <li>Office of the Australian Information Commissioner</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">Enforcement Actions</h2>
                <div className="space-y-6 mb-8">
                  <p className="text-gray-600 dark:text-gray-300">
                    Privacy authorities have a range of enforcement tools at their disposal:
                  </p>
                  
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <h3 className="font-semibold text-primary dark:text-white mb-3">Investigation Powers</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li><strong>Information Requests:</strong> Authorities can demand documentation and explanations</li>
                      <li><strong>Audits:</strong> On-site inspections and technical assessments</li>
                      <li><strong>Witness Interviews:</strong> Authority to question relevant personnel</li>
                      <li><strong>Technical Analysis:</strong> Examination of systems and data processing activities</li>
                    </ul>
                  </div>
                  
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <h3 className="font-semibold text-primary dark:text-white mb-3">Corrective Measures</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li><strong>Warnings and Reprimands:</strong> Formal notices of non-compliance</li>
                      <li><strong>Processing Limitations:</strong> Temporary or permanent restrictions</li>
                      <li><strong>Certification Withdrawal:</strong> Revocation of privacy certifications</li>
                      <li><strong>Data Deletion Orders:</strong> Mandated erasure of improperly processed data</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">Penalties and Remedies</h2>
                <div className="space-y-4 mb-8">
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <h3 className="font-semibold text-primary dark:text-white mb-3">Administrative Fines</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      Financial penalties have increased significantly under recent privacy frameworks:
                    </p>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li><strong>Global Privacy Act:</strong> Up to 6% of global annual revenue or $50 million</li>
                      <li><strong>GDPR 2.0:</strong> Up to €30 million or 6% of global revenue</li>
                      <li><strong>US Federal Privacy Protection Act:</strong> Up to $50,000 per violation with a cap of $20 million</li>
                      <li><strong>California Privacy Rights Act:</strong> Up to $7,500 per intentional violation</li>
                    </ul>
                  </div>
                  
                  <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                    <h3 className="font-semibold text-primary dark:text-white mb-3">Other Remedies</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li><strong>Injunctive Relief:</strong> Court orders to stop violations</li>
                      <li><strong>Mandatory Audits:</strong> Regular compliance reviews</li>
                      <li><strong>Corrective Actions:</strong> Required changes to business practices</li>
                      <li><strong>Public Notifications:</strong> Disclosure of violations to affected individuals</li>
                      <li><strong>Executive Accountability:</strong> Personal liability for corporate officers in cases of willful violations</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">Individual Rights</h2>
                <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg mb-8">
                  <div className="flex items-center mb-3">
                    <FileText className="h-5 w-5 text-accent mr-2" />
                    <h3 className="font-semibold text-primary dark:text-white">Your Rights</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    Modern privacy frameworks provide individuals with multiple avenues for seeking redress:
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-primary dark:text-white">File Complaints with Authorities</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">You can submit formal complaints to relevant data protection authorities when you believe your rights have been violated. These complaints trigger official investigations at no cost to you.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-primary dark:text-white">Seek Judicial Remedies</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Most frameworks provide for direct legal action against organizations that violate privacy rights, allowing you to seek compensation for both material and non-material damages.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-primary dark:text-white">Request Investigations</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">You can ask authorities to investigate specific practices or organizations, even if you haven't been directly affected.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-primary dark:text-white">Participate in Class Actions</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Many jurisdictions now allow for collective action when privacy violations affect multiple individuals, making it easier to seek redress for smaller but widespread violations.</p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">Enforcement Trends</h2>
                <div className="space-y-4 mb-8">
                  <p className="text-gray-600 dark:text-gray-300">
                    Recent enforcement actions reveal several important trends:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-light-blue/10 dark:bg-card-hover p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Scale className="h-4 w-4 text-accent mr-2" />
                        <h4 className="font-medium text-primary dark:text-white">Increasing Fine Amounts</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Penalties have grown significantly, with several multi-million dollar fines issued in 2024-2025</p>
                    </div>
                    
                    <div className="bg-light-blue/10 dark:bg-card-hover p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Check className="h-4 w-4 text-accent mr-2" />
                        <h4 className="font-medium text-primary dark:text-white">Focus on Systemic Issues</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Authorities are prioritizing cases that reveal structural or repeated compliance failures</p>
                    </div>
                    
                    <div className="bg-light-blue/10 dark:bg-card-hover p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Globe className="h-4 w-4 text-accent mr-2" />
                        <h4 className="font-medium text-primary dark:text-white">Coordinated Actions</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Multiple authorities increasingly work together on cross-border investigations</p>
                    </div>
                    
                    <div className="bg-light-blue/10 dark:bg-card-hover p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Shield className="h-4 w-4 text-accent mr-2" />
                        <h4 className="font-medium text-primary dark:text-white">Technical Compliance</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Greater scrutiny of technical measures and security practices</p>
                    </div>
                  </div>
                </div>

                <div className="bg-warning/10 dark:bg-warning/5 p-6 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-warning mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-primary dark:text-white mb-2">Important Notice</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        If you believe your privacy rights have been violated, document the incident and 
                        contact the relevant authorities promptly. Time limits may apply for filing complaints 
                        or seeking remedies. Most privacy laws require complaints to be filed within 1-2 years of discovering a violation.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-accent mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-primary dark:text-white mb-2">How to File a Complaint</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        If you need to report a privacy violation, follow these steps:
                      </p>
                      <ol className="space-y-2 text-gray-600 dark:text-gray-300 list-decimal pl-5">
                        <li>Document the violation with screenshots, emails, and other evidence</li>
                        <li>Contact the organization directly to attempt resolution</li>
                        <li>If unresolved, identify the appropriate regulatory authority</li>
                        <li>Submit a formal complaint through the authority's official channels</li>
                        <li>Follow up as needed and respond to requests for additional information</li>
                      </ol>
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

export default EnforcementPage;
