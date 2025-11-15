import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  ExternalLink, 
  Copy, 
  Download, 
  FileText,
  Shield,
  Info
} from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

interface FormAutoFillerProps {
  brokerName: string;
  brokerUrl: string;
  userInfo: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  onClose: () => void;
}

interface FormField {
  id: string;
  name: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  value: string;
  options?: string[];
}

const FormAutoFiller: React.FC<FormAutoFillerProps> = ({
  brokerName,
  brokerUrl,
  userInfo,
  onClose
}) => {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [autoFillData, setAutoFillData] = useState<Record<string, string>>({});
  const [instructions, setInstructions] = useState<string[]>([]);

  useEffect(() => {
    analyzeForm();
  }, [analyzeForm]);

  const analyzeForm = useCallback(async () => {
    setIsAnalyzing(true);
    
    // Simulate form analysis (in real implementation, this would use web scraping)
    setTimeout(() => {
      const mockFields: FormField[] = [
        {
          id: 'full_name',
          name: 'full_name',
          type: 'text',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true,
          value: userInfo.name,
          options: []
        },
        {
          id: 'email',
          name: 'email',
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email',
          required: true,
          value: userInfo.email,
          options: []
        },
        {
          id: 'phone',
          name: 'phone',
          type: 'tel',
          label: 'Phone Number',
          placeholder: 'Enter your phone number',
          required: false,
          value: userInfo.phone || '',
          options: []
        },
        {
          id: 'address',
          name: 'address',
          type: 'textarea',
          label: 'Address',
          placeholder: 'Enter your address',
          required: false,
          value: userInfo.address || '',
          options: []
        },
        {
          id: 'reason',
          name: 'reason',
          type: 'select',
          label: 'Reason for Removal',
          placeholder: 'Select a reason',
          required: true,
          value: 'privacy_concerns',
          options: ['privacy_concerns', 'data_accuracy', 'unwanted_marketing', 'other']
        },
        {
          id: 'verification',
          name: 'verification',
          type: 'checkbox',
          label: 'I verify that this information is accurate',
          placeholder: '',
          required: true,
          value: 'true',
          options: []
        }
      ];

      setFormFields(mockFields);
      setAutoFillData({
        full_name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone || '',
        address: userInfo.address || '',
        reason: 'privacy_concerns',
        verification: 'true'
      });

      setInstructions([
        '1. Open the opt-out page in a new tab',
        '2. Use the auto-fill data below to complete the form',
        '3. Review all information before submitting',
        '4. Take a screenshot of the confirmation page',
        '5. Save the confirmation email for your records'
      ]);

      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2000);
  }, [userInfo.name, userInfo.email, userInfo.phone, userInfo.address]);

  const generateAutoFillScript = () => {
    const script = `
// Auto-fill script for ${brokerName}
// Run this in the browser console on the opt-out page

const autoFillData = ${JSON.stringify(autoFillData, null, 2)};

// Function to fill form fields
function fillForm() {
  Object.entries(autoFillData).forEach(([fieldName, value]) => {
    // Try different selectors for the field
    const selectors = [
      \`input[name="\${fieldName}"]\`,
      \`input[id="\${fieldName}"]\`,
      \`textarea[name="\${fieldName}"]\`,
      \`textarea[id="\${fieldName}"]\`,
      \`select[name="\${fieldName}"]\`,
      \`select[id="\${fieldName}"]\`
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        if (element.type === 'checkbox' || element.type === 'radio') {
          element.checked = value === 'true';
        } else {
          element.value = value;
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
        }
        // Track field fill (commented out for production)
        break;
      }
    }
  });
  
  // Auto-fill completed (commented out for production)
}

// Run the auto-fill function
fillForm();
`;

    return script;
  };

  const copyAutoFillScript = async () => {
    const script = generateAutoFillScript();
    try {
      await navigator.clipboard.writeText(script);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy script: ', err);
    }
  };

  const downloadAutoFillScript = () => {
    const script = generateAutoFillScript();
    const blob = new Blob([script], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auto-fill-${brokerName.toLowerCase().replace(/\s+/g, '-')}.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateFormData = () => {
    const formData = new FormData();
    Object.entries(autoFillData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return formData;
  };

  const downloadFormData = () => {
    const formData = generateFormData();
    const data = Object.fromEntries(formData.entries());
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-data-${brokerName.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
              <Zap className="h-5 w-5 mr-2" />
              Form Auto-Filler - {brokerName}
            </h3>
            <Button onClick={onClose} variant="outline" size="sm">
              ✕
            </Button>
          </div>

          {isAnalyzing && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-text dark:text-white">Analyzing form fields...</p>
            </div>
          )}

          {analysisComplete && (
            <div className="space-y-6">
              {/* Instructions */}
              <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Instructions
                </h4>
                <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  {instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </Card>

              {/* Form Fields Preview */}
              <div>
                <h4 className="text-lg font-semibold text-text dark:text-white mb-4">
                  Detected Form Fields
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formFields.map((field) => (
                    <div key={field.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-text dark:text-white">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <span className="text-xs text-text-secondary dark:text-gray-400">
                          {field.type}
                        </span>
                      </div>
                      {field.type === 'select' ? (
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white">
                          {field.options?.map((option) => (
                            <option key={option} value={option}>
                              {option.replace('_', ' ').toUpperCase()}
                            </option>
                          ))}
                        </select>
                      ) : field.type === 'checkbox' ? (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            defaultChecked={field.value === 'true'}
                          />
                          <span className="text-sm text-text-secondary dark:text-gray-300">
                            {field.label}
                          </span>
                        </div>
                      ) : (
                        <input
                          type={field.type}
                          value={field.value}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:text-white"
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Auto-Fill Tools */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h4 className="font-semibold text-text dark:text-white mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Auto-Fill Script
                  </h4>
                  <p className="text-sm text-text-secondary dark:text-gray-300 mb-4">
                    Copy and paste this script into the browser console on the opt-out page to automatically fill the form.
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={copyAutoFillScript} size="sm" variant="outline">
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Script
                    </Button>
                    <Button onClick={downloadAutoFillScript} size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold text-text dark:text-white mb-3 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Form Data
                  </h4>
                  <p className="text-sm text-text-secondary dark:text-gray-300 mb-4">
                    Download the form data as JSON for manual entry or backup purposes.
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={downloadFormData} size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download Data
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={() => window.open(brokerUrl, '_blank')}
                  className="flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Opt-Out Page
                </Button>
                <div className="flex gap-2">
                  <Button onClick={onClose} variant="outline">
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default FormAutoFiller;