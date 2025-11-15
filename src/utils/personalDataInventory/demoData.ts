import { PersonalDataEntry } from '../../types/personalDataInventory';

export const generateDemoData = (): PersonalDataEntry[] => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return [
    {
      id: 'demo-1',
      category: 'personal_identification',
      dataType: 'Full Name',
      description: 'Complete legal name including first, middle, and last name',
      source: 'Government Records',
      purpose: 'Identity verification and legal compliance',
      retentionPeriod: 'Indefinite',
      legalBasis: 'Legal obligation',
      isSensitive: false,
      isShared: false,
      sharedWith: [],
      createdAt: oneMonthAgo,
      updatedAt: oneMonthAgo,
      notes: 'Required for official documents and legal purposes'
    },
    {
      id: 'demo-2',
      category: 'contact_information',
      dataType: 'Email Address',
      description: 'Primary email address used for communication',
      source: 'Google',
      purpose: 'Account creation and communication',
      retentionPeriod: 'Until consent withdrawn',
      legalBasis: 'Consent',
      isSensitive: false,
      isShared: true,
      sharedWith: ['Google', 'Marketing Partners'],
      createdAt: twoWeeksAgo,
      updatedAt: twoWeeksAgo,
      notes: 'Shared with third-party marketing services'
    },
    {
      id: 'demo-3',
      category: 'financial_data',
      dataType: 'Credit Card Information',
      description: 'Credit card number, expiry date, and CVV',
      source: 'Bank of America',
      purpose: 'Payment processing and fraud prevention',
      retentionPeriod: '7 years',
      legalBasis: 'Contract',
      isSensitive: true,
      isShared: true,
      sharedWith: ['Visa', 'Fraud Detection Services'],
      createdAt: oneWeekAgo,
      updatedAt: oneWeekAgo,
      notes: 'Highly sensitive financial data requiring special protection'
    },
    {
      id: 'demo-4',
      category: 'health_data',
      dataType: 'Medical Records',
      description: 'Health conditions, medications, and treatment history',
      source: 'Mayo Clinic',
      purpose: 'Medical treatment and care coordination',
      retentionPeriod: '10 years',
      legalBasis: 'Vital interests',
      isSensitive: true,
      isShared: false,
      sharedWith: [],
      createdAt: oneMonthAgo,
      updatedAt: oneWeekAgo,
      notes: 'Protected health information under HIPAA'
    },
    {
      id: 'demo-5',
      category: 'location_data',
      dataType: 'GPS Coordinates',
      description: 'Real-time location tracking data',
      source: 'Google Maps',
      purpose: 'Navigation and location-based services',
      retentionPeriod: '2 years',
      legalBasis: 'Consent',
      isSensitive: true,
      isShared: true,
      sharedWith: ['Google', 'Location Analytics Partners'],
      createdAt: twoWeeksAgo,
      updatedAt: oneWeekAgo,
      notes: 'Location data collected for personalized services'
    },
    {
      id: 'demo-6',
      category: 'online_activity',
      dataType: 'Browsing History',
      description: 'Websites visited and search queries',
      source: 'Google Chrome',
      purpose: 'Personalized recommendations and advertising',
      retentionPeriod: '3 years',
      legalBasis: 'Consent',
      isSensitive: false,
      isShared: true,
      sharedWith: ['Google', 'Advertising Partners'],
      createdAt: oneWeekAgo,
      updatedAt: oneWeekAgo,
      notes: 'Used for targeted advertising and service improvement'
    },
    {
      id: 'demo-7',
      category: 'biometric_data',
      dataType: 'Fingerprint Data',
      description: 'Biometric fingerprint template for device authentication',
      source: 'iPhone',
      purpose: 'Device security and authentication',
      retentionPeriod: 'Until device is reset',
      legalBasis: 'Consent',
      isSensitive: true,
      isShared: false,
      sharedWith: [],
      createdAt: oneMonthAgo,
      updatedAt: oneMonthAgo,
      notes: 'Stored locally on device, never transmitted'
    },
    {
      id: 'demo-8',
      category: 'preferences',
      dataType: 'Marketing Preferences',
      description: 'Email subscription preferences and communication settings',
      source: 'Newsletter Services',
      purpose: 'Marketing communication management',
      retentionPeriod: 'Until consent withdrawn',
      legalBasis: 'Consent',
      isSensitive: false,
      isShared: true,
      sharedWith: ['Marketing Partners', 'Email Service Providers'],
      createdAt: twoWeeksAgo,
      updatedAt: oneWeekAgo,
      notes: 'Controls frequency and type of marketing communications'
    },
    {
      id: 'demo-9',
      category: 'communication_data',
      dataType: 'Text Messages',
      description: 'SMS and iMessage content and metadata',
      source: 'Apple iMessage',
      purpose: 'Communication and message delivery',
      retentionPeriod: '1 year',
      legalBasis: 'Contract',
      isSensitive: true,
      isShared: false,
      sharedWith: [],
      createdAt: oneWeekAgo,
      updatedAt: oneWeekAgo,
      notes: 'End-to-end encrypted, not accessible by service provider'
    },
    {
      id: 'demo-10',
      category: 'other',
      dataType: 'Social Security Number',
      description: 'Social Security Number for tax and employment purposes',
      source: 'Employer Records',
      purpose: 'Tax reporting and employment verification',
      retentionPeriod: 'Indefinite',
      legalBasis: 'Legal obligation',
      isSensitive: true,
      isShared: true,
      sharedWith: ['IRS', 'Social Security Administration'],
      createdAt: oneMonthAgo,
      updatedAt: oneMonthAgo,
      notes: 'Required for tax reporting and government compliance'
    }
  ];
};

export const loadDemoData = (): void => {
  const existingData = localStorage.getItem('personalDataInventory');
  if (!existingData) {
    const demoData = generateDemoData();
    localStorage.setItem('personalDataInventory', JSON.stringify(demoData));
  }
};
