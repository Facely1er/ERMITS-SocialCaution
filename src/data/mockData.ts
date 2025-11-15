// Mock data for demo mode (no backend required)

export const mockPersonas = [
  {
    _id: '1',
    name: 'parent',
    displayName: 'Parent/Guardian',
    description: "Concerned about children's online safety, privacy, and digital well-being",
    icon: '👪',
    riskCategories: ['parental-controls', 'online-safety', 'social-media', 'scams', 'privacy-laws'],
    privacyRights: [
      {
        title: "Children's Online Privacy Protection (COPPA)",
        description: 'Parents have the right to control what information websites collect from children under 13',
        actionable: true
      },
      {
        title: 'Right to Request Data Deletion',
        description: "You can request deletion of your child's personal information from online services",
        actionable: true
      },
      {
        title: 'School Data Privacy Rights',
        description: 'FERPA protects student educational records and gives parents control over disclosure',
        actionable: true
      }
    ],
    targetAudience: 'Parents and guardians protecting their children online',
    isActive: true
  },
  {
    _id: '2',
    name: 'teen',
    displayName: 'Teen/Student',
    description: 'Young people learning about digital privacy, social media safety, and online reputation',
    icon: '🎓',
    riskCategories: ['social-media', 'online-safety', 'identity-theft', 'phishing', 'scams'],
    privacyRights: [
      {
        title: 'Right to Delete Social Media Posts',
        description: 'Many platforms allow you to delete old posts and manage your digital footprint',
        actionable: true
      },
      {
        title: 'Protection from Online Harassment',
        description: 'You have rights to report and block harassment on social platforms',
        actionable: true
      },
      {
        title: 'Data Portability',
        description: 'You can download your data from most social media platforms',
        actionable: true
      }
    ],
    targetAudience: 'Teenagers and students learning about online privacy',
    isActive: true
  },
  {
    _id: '3',
    name: 'professional',
    displayName: 'Professional/Business',
    description: 'Professionals concerned about work-related privacy, data security, and professional reputation',
    icon: '💼',
    riskCategories: ['data-breach', 'phishing', 'identity-theft', 'financial-fraud', 'device-security', 'privacy-laws'],
    privacyRights: [
      {
        title: 'Workplace Privacy Rights',
        description: 'Understand what employers can and cannot monitor in the workplace',
        actionable: false
      },
      {
        title: 'Professional Data Protection',
        description: 'GDPR and other laws protect your professional information',
        actionable: true
      },
      {
        title: 'Right to Correct Inaccurate Information',
        description: 'You can request correction of inaccurate professional data',
        actionable: true
      }
    ],
    targetAudience: 'Working professionals and business owners',
    isActive: true
  },
  {
    _id: '4',
    name: 'senior',
    displayName: 'Senior Citizen',
    description: 'Older adults learning about digital safety, avoiding scams, and protecting personal information',
    icon: '👴',
    riskCategories: ['scams', 'phishing', 'financial-fraud', 'identity-theft', 'online-safety'],
    privacyRights: [
      {
        title: 'Protection from Financial Exploitation',
        description: 'Federal and state laws protect seniors from financial scams and fraud',
        actionable: true
      },
      {
        title: 'Healthcare Privacy (HIPAA)',
        description: 'Your medical information is protected and requires your consent to share',
        actionable: false
      },
      {
        title: 'Right to Opt-Out of Data Selling',
        description: 'You can opt-out of companies selling your personal information',
        actionable: true
      }
    ],
    targetAudience: 'Senior citizens and older adults',
    isActive: true
  },
  {
    _id: '5',
    name: 'privacy-advocate',
    displayName: 'Privacy Advocate',
    description: 'Privacy-conscious individuals seeking maximum control over their digital footprint',
    icon: '🔒',
    riskCategories: ['data-breach', 'privacy-laws', 'social-media', 'identity-theft', 'device-security', 'phishing'],
    privacyRights: [
      {
        title: 'GDPR Data Rights (if in EU)',
        description: 'Comprehensive rights to access, delete, and control your personal data',
        actionable: true
      },
      {
        title: 'CCPA Rights (if in California)',
        description: 'Right to know, delete, and opt-out of sale of personal information',
        actionable: true
      },
      {
        title: 'Right to Data Portability',
        description: 'Request your data in a machine-readable format from most services',
        actionable: true
      }
    ],
    targetAudience: 'Privacy-conscious individuals and advocates',
    isActive: true
  },
  {
    _id: '6',
    name: 'general',
    displayName: 'General User',
    description: 'Anyone interested in learning about online privacy and digital security basics',
    icon: '👤',
    riskCategories: ['phishing', 'identity-theft', 'social-media', 'online-safety', 'privacy-laws'],
    privacyRights: [
      {
        title: 'Right to Know What Data is Collected',
        description: 'Companies must disclose what personal information they collect about you',
        actionable: true
      },
      {
        title: 'Right to Access Your Data',
        description: 'You can request a copy of the personal data companies have about you',
        actionable: true
      },
      {
        title: 'Right to Opt-Out',
        description: 'You can opt-out of targeted advertising and some data collection',
        actionable: true
      }
    ],
    targetAudience: 'General internet users',
    isActive: true
  }
];

export const mockCautionItems = [
  {
    _id: 'c1',
    title: 'Major Data Breach Affects 50 Million Users',
    description: 'A major social media platform has confirmed a data breach affecting 50 million user accounts. Personal information including names, email addresses, and phone numbers may have been exposed.',
    category: 'data-breach',
    personas: ['general', 'professional', 'privacy-advocate'],
    severity: 'critical',
    source: { name: 'Security News', url: 'https://example.com' },
    publishedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://example.com/breach-news',
    tags: ['data-breach', 'social-media'],
    viewCount: 1523
  },
  {
    _id: 'c2',
    title: 'New Phishing Campaign Targets Email Users',
    description: 'Security researchers have identified a sophisticated phishing campaign that mimics popular email providers. Users are urged to verify sender addresses before clicking links.',
    category: 'phishing',
    personas: ['general', 'senior', 'professional'],
    severity: 'high',
    source: { name: 'Cyber Security Alert', url: 'https://example.com' },
    publishedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://example.com/phishing-alert',
    tags: ['phishing', 'email'],
    viewCount: 892
  },
  {
    _id: 'c3',
    title: 'Scammers Target Seniors with Fake Tech Support',
    description: 'A wave of fake tech support scams is targeting senior citizens. Scammers are calling victims claiming to be from Microsoft or Apple and requesting remote access to computers.',
    category: 'scams',
    personas: ['senior', 'general'],
    severity: 'high',
    source: { name: 'FTC Alerts', url: 'https://example.com' },
    publishedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://example.com/scam-warning',
    tags: ['scams', 'tech-support', 'seniors'],
    viewCount: 645
  },
  {
    _id: 'c4',
    title: 'New Privacy Law Gives Users More Control',
    description: 'A new state privacy law now requires companies to provide easy opt-out mechanisms for data selling. Residents can now request deletion of their personal information.',
    category: 'privacy-laws',
    personas: ['privacy-advocate', 'general', 'professional'],
    severity: 'medium',
    source: { name: 'Privacy International', url: 'https://example.com' },
    publishedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://example.com/privacy-law',
    tags: ['privacy', 'legislation'],
    viewCount: 432
  },
  {
    _id: 'c5',
    title: 'Social Media App Updates Privacy Settings',
    description: 'A popular social media platform has updated its privacy settings. Users should review their settings to ensure their information is protected according to their preferences.',
    category: 'social-media',
    personas: ['teen', 'general', 'parent'],
    severity: 'medium',
    source: { name: 'Tech News', url: 'https://example.com' },
    publishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://example.com/social-update',
    tags: ['social-media', 'privacy-settings'],
    viewCount: 1205
  },
  {
    _id: 'c6',
    title: 'Parental Control Software Vulnerability Found',
    description: 'Security researchers discovered a vulnerability in popular parental control software that could allow bypassing restrictions. Parents are advised to update their software immediately.',
    category: 'parental-controls',
    personas: ['parent'],
    severity: 'high',
    source: { name: 'Security Watch', url: 'https://example.com' },
    publishedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://example.com/parental-control-vuln',
    tags: ['parental-controls', 'vulnerability'],
    viewCount: 567
  },
  {
    _id: 'c7',
    title: 'Identity Theft Cases Rise 30% This Year',
    description: 'Federal authorities report a 30% increase in identity theft cases. Experts recommend using password managers and enabling two-factor authentication on all accounts.',
    category: 'identity-theft',
    personas: ['general', 'professional', 'senior', 'privacy-advocate'],
    severity: 'high',
    source: { name: 'Government Alert', url: 'https://example.com' },
    publishedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://example.com/identity-theft-rise',
    tags: ['identity-theft', 'statistics'],
    viewCount: 923
  },
  {
    _id: 'c8',
    title: 'Mobile Banking Apps Security Tips',
    description: 'Financial institutions are warning users about the importance of securing mobile banking apps. Tips include avoiding public WiFi and enabling biometric authentication.',
    category: 'financial-fraud',
    personas: ['professional', 'senior', 'general'],
    severity: 'medium',
    source: { name: 'Banking Security', url: 'https://example.com' },
    publishedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://example.com/mobile-banking-tips',
    tags: ['financial', 'mobile-security'],
    viewCount: 756
  },
  {
    _id: 'c9',
    title: 'Teen Social Media Safety: What Parents Need to Know',
    description: 'New research shows that many teens are unaware of privacy risks on social media. Experts provide guidance for parents on discussing online safety with their children.',
    category: 'online-safety',
    personas: ['parent', 'teen'],
    severity: 'medium',
    source: { name: 'Family Safety', url: 'https://example.com' },
    publishedDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://example.com/teen-social-safety',
    tags: ['social-media', 'children', 'education'],
    viewCount: 834
  },
  {
    _id: 'c10',
    title: 'Device Security Update: Patch Now',
    description: 'A critical security update is available for major operating systems. Users should update their devices immediately to protect against newly discovered vulnerabilities.',
    category: 'device-security',
    personas: ['professional', 'privacy-advocate', 'general'],
    severity: 'critical',
    source: { name: 'Security Advisory', url: 'https://example.com' },
    publishedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://example.com/security-update',
    tags: ['update', 'vulnerability', 'urgent'],
    viewCount: 2156
  }
];

export const mockCautionStats = {
  bySeverity: [
    { _id: 'critical', count: 2 },
    { _id: 'high', count: 4 },
    { _id: 'medium', count: 4 },
    { _id: 'low', count: 0 }
  ],
  byCategory: [
    { _id: 'data-breach', count: 1 },
    { _id: 'phishing', count: 1 },
    { _id: 'scams', count: 1 },
    { _id: 'privacy-laws', count: 1 },
    { _id: 'social-media', count: 1 },
    { _id: 'parental-controls', count: 1 },
    { _id: 'identity-theft', count: 1 },
    { _id: 'financial-fraud', count: 1 },
    { _id: 'online-safety', count: 1 },
    { _id: 'device-security', count: 1 }
  ],
  recentCount: 5,
  totalActive: 10
};

export const mockUser = {
  _id: 'demo-user',
  firstName: 'Demo',
  lastName: 'User',
  email: 'demo@ermits.com',
  selectedPersona: null
};
