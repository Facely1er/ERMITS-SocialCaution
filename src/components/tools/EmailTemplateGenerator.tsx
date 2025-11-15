import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Copy, Download, Send } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

interface EmailTemplateGeneratorProps {
  brokerName: string;
  userInfo: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  onClose: () => void;
}

const EmailTemplateGenerator: React.FC<EmailTemplateGeneratorProps> = ({
  brokerName,
  userInfo,
  onClose
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<'ccpa' | 'gdpr' | 'general'>('ccpa');
  const [customMessage, setCustomMessage] = useState('');
  const [includePersonalInfo, setIncludePersonalInfo] = useState(true);

  const templates = {
    ccpa: {
      subject: `CCPA Data Deletion Request - ${userInfo.name}`,
      body: `Dear Privacy Team,

I am writing to request the deletion of my personal information from your database under the California Consumer Privacy Act (CCPA).

Personal Information to be Deleted:
- Full Name: ${userInfo.name}
- Email Address: ${userInfo.email}${userInfo.phone ? `\n- Phone Number: ${userInfo.phone}` : ''}${userInfo.address ? `\n- Address: ${userInfo.address}` : ''}

Under CCPA Section 1798.105, I have the right to request that you delete my personal information. Please confirm that you have:
1. Deleted my personal information from your databases
2. Instructed any service providers to delete my information
3. Not sold my personal information in the 12 months preceding the request

Please confirm the deletion within 45 days as required by law.

${customMessage ? `\nAdditional Information:\n${customMessage}` : ''}

Thank you for your prompt attention to this matter.

Best regards,
${userInfo.name}
${userInfo.email}`
    },
    gdpr: {
      subject: `GDPR Article 17 Data Erasure Request - ${userInfo.name}`,
      body: `Dear Data Protection Officer,

I am writing to exercise my right to erasure under Article 17 of the General Data Protection Regulation (GDPR).

Personal Information to be Erased:
- Full Name: ${userInfo.name}
- Email Address: ${userInfo.email}${userInfo.phone ? `\n- Phone Number: ${userInfo.phone}` : ''}${userInfo.address ? `\n- Address: ${userInfo.address}` : ''}

I request that you erase all personal data relating to me without undue delay and in any event within one month of receipt of this request, as required by GDPR Article 17.

Please confirm that you have:
1. Erased my personal data from all systems
2. Notified any third parties who have received my data
3. Ceased further processing of my personal data

${customMessage ? `\nAdditional Information:\n${customMessage}` : ''}

I look forward to your confirmation of erasure within the required timeframe.

Yours sincerely,
${userInfo.name}
${userInfo.email}`
    },
    general: {
      subject: `Data Deletion Request - ${userInfo.name}`,
      body: `Dear Privacy Team,

I am writing to request the deletion of my personal information from your database.

Personal Information to be Deleted:
- Full Name: ${userInfo.name}
- Email Address: ${userInfo.email}${userInfo.phone ? `\n- Phone Number: ${userInfo.phone}` : ''}${userInfo.address ? `\n- Address: ${userInfo.address}` : ''}

I request that you:
1. Delete all personal information you have about me
2. Remove my information from any marketing lists
3. Cease any further processing of my personal data
4. Confirm deletion in writing

${customMessage ? `\nAdditional Information:\n${customMessage}` : ''}

Please process this request promptly and confirm deletion within 30 days.

Thank you for your attention to this matter.

Best regards,
${userInfo.name}
${userInfo.email}`
    }
  };

  const currentTemplate = templates[selectedTemplate];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadTemplate = () => {
    const content = `Subject: ${currentTemplate.subject}\n\n${currentTemplate.body}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-deletion-request-${brokerName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openEmailClient = () => {
    const subject = encodeURIComponent(currentTemplate.subject);
    const body = encodeURIComponent(currentTemplate.body);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-text dark:text-white flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Email Template Generator - {brokerName}
            </h3>
            <Button onClick={onClose} variant="outline" size="sm">
              ✕
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Template Options */}
            <div>
              <h4 className="text-lg font-semibold text-text dark:text-white mb-4">
                Choose Template Type
              </h4>
              
              <div className="space-y-3 mb-6">
                <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="template"
                    value="ccpa"
                    checked={selectedTemplate === 'ccpa'}
                    onChange={(e) => setSelectedTemplate(e.target.value as 'ccpa')}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium text-text dark:text-white">CCPA Template</div>
                    <div className="text-sm text-text-secondary dark:text-gray-300">
                      California Consumer Privacy Act compliant
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="template"
                    value="gdpr"
                    checked={selectedTemplate === 'gdpr'}
                    onChange={(e) => setSelectedTemplate(e.target.value as 'gdpr')}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium text-text dark:text-white">GDPR Template</div>
                    <div className="text-sm text-text-secondary dark:text-gray-300">
                      General Data Protection Regulation compliant
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="template"
                    value="general"
                    checked={selectedTemplate === 'general'}
                    onChange={(e) => setSelectedTemplate(e.target.value as 'general')}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium text-text dark:text-white">General Template</div>
                    <div className="text-sm text-text-secondary dark:text-gray-300">
                      Universal data deletion request
                    </div>
                  </div>
                </label>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-text dark:text-white mb-2">
                  Custom Message (Optional)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Add any additional information or specific requests..."
                />
              </div>

              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="includePersonalInfo"
                  checked={includePersonalInfo}
                  onChange={(e) => setIncludePersonalInfo(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="includePersonalInfo" className="text-sm text-text dark:text-white">
                  Include personal information in the email
                </label>
              </div>
            </div>

            {/* Email Preview */}
            <div>
              <h4 className="text-lg font-semibold text-text dark:text-white mb-4">
                Email Preview
              </h4>
              
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                <div className="mb-4">
                  <div className="text-sm font-medium text-text dark:text-white mb-1">Subject:</div>
                  <div className="text-sm text-text-secondary dark:text-gray-300">
                    {currentTemplate.subject}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm font-medium text-text dark:text-white mb-1">Body:</div>
                  <div className="text-sm text-text-secondary dark:text-gray-300 whitespace-pre-wrap">
                    {currentTemplate.body}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  onClick={() => copyToClipboard(currentTemplate.body)}
                  size="sm"
                  variant="outline"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Body
                </Button>
                <Button
                  onClick={() => copyToClipboard(currentTemplate.subject)}
                  size="sm"
                  variant="outline"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Subject
                </Button>
                <Button
                  onClick={downloadTemplate}
                  size="sm"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button
                  onClick={openEmailClient}
                  size="sm"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Open Email Client
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default EmailTemplateGenerator;