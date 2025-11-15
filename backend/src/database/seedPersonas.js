const mongoose = require('mongoose');
const Persona = require('../models/Persona');
const RSSFeed = require('../models/RSSFeed');
const logger = require('../utils/logger');
require('dotenv').config();

// Persona seed data
const personas = [
  {
    name: 'parent',
    displayName: 'Parent/Guardian',
    description: 'Concerned about children\'s online safety, privacy, and digital well-being',
    icon: '👪',
    riskCategories: [
      'parental-controls',
      'online-safety',
      'social-media',
      'scams',
      'privacy-laws'
    ],
    privacyRights: [
      {
        title: 'Children\'s Online Privacy Protection (COPPA)',
        description: 'Parents have the right to control what information websites collect from children under 13',
        actionable: true
      },
      {
        title: 'Right to Request Data Deletion',
        description: 'You can request deletion of your child\'s personal information from online services',
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
    name: 'teen',
    displayName: 'Teen/Student',
    description: 'Young people learning about digital privacy, social media safety, and online reputation',
    icon: '🎓',
    riskCategories: [
      'social-media',
      'online-safety',
      'identity-theft',
      'phishing',
      'scams'
    ],
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
    name: 'professional',
    displayName: 'Professional/Business',
    description: 'Professionals concerned about work-related privacy, data security, and professional reputation',
    icon: '💼',
    riskCategories: [
      'data-breach',
      'phishing',
      'identity-theft',
      'financial-fraud',
      'device-security',
      'privacy-laws'
    ],
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
    name: 'senior',
    displayName: 'Senior Citizen',
    description: 'Older adults learning about digital safety, avoiding scams, and protecting personal information',
    icon: '👴',
    riskCategories: [
      'scams',
      'phishing',
      'financial-fraud',
      'identity-theft',
      'online-safety'
    ],
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
    name: 'privacy-advocate',
    displayName: 'Privacy Advocate',
    description: 'Privacy-conscious individuals seeking maximum control over their digital footprint',
    icon: '🔒',
    riskCategories: [
      'data-breach',
      'privacy-laws',
      'social-media',
      'identity-theft',
      'device-security',
      'phishing'
    ],
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
    name: 'general',
    displayName: 'General User',
    description: 'Anyone interested in learning about online privacy and digital security basics',
    icon: '👤',
    riskCategories: [
      'phishing',
      'identity-theft',
      'social-media',
      'online-safety',
      'privacy-laws'
    ],
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

// RSS Feed seed data
const rssFeeds = [
  {
    name: 'Krebs on Security',
    url: 'https://krebsonsecurity.com/feed/',
    category: 'data-breach',
    personas: ['professional', 'privacy-advocate', 'general'],
    source: 'Krebs on Security',
    updateFrequency: 7200000, // 2 hours
    isActive: true
  },
  {
    name: 'Cybersecurity & Infrastructure Security Agency (CISA)',
    url: 'https://www.cisa.gov/cybersecurity-advisories/all.xml',
    category: 'general-security',
    personas: ['professional', 'privacy-advocate'],
    source: 'CISA',
    updateFrequency: 3600000, // 1 hour
    isActive: true
  },
  {
    name: 'The Hacker News',
    url: 'https://feeds.feedburner.com/TheHackersNews',
    category: 'general-security',
    personas: ['professional', 'privacy-advocate', 'general'],
    source: 'The Hacker News',
    updateFrequency: 3600000,
    isActive: true
  },
  {
    name: 'Schneier on Security',
    url: 'https://www.schneier.com/feed/atom/',
    category: 'privacy-laws',
    personas: ['professional', 'privacy-advocate'],
    source: 'Schneier on Security',
    updateFrequency: 7200000,
    isActive: true
  },
  {
    name: 'Electronic Frontier Foundation',
    url: 'https://www.eff.org/rss/updates.xml',
    category: 'privacy-laws',
    personas: ['privacy-advocate', 'professional', 'general'],
    source: 'EFF',
    updateFrequency: 7200000,
    isActive: true
  },
  {
    name: 'SANS Internet Storm Center',
    url: 'https://isc.sans.edu/rssfeed.xml',
    category: 'general-security',
    personas: ['professional', 'privacy-advocate'],
    source: 'SANS ISC',
    updateFrequency: 3600000,
    isActive: true
  },
  {
    name: 'Federal Trade Commission Consumer Alerts',
    url: 'https://www.consumer.ftc.gov/feeds/consumer.gov_scam-alerts.xml',
    category: 'scams',
    personas: ['senior', 'parent', 'general'],
    source: 'FTC',
    updateFrequency: 7200000,
    isActive: true
  },
  {
    name: 'Common Sense Media',
    url: 'https://www.commonsensemedia.org/rss/articles',
    category: 'parental-controls',
    personas: ['parent'],
    source: 'Common Sense Media',
    updateFrequency: 14400000, // 4 hours
    isActive: true
  },
  {
    name: 'Privacy International',
    url: 'https://privacyinternational.org/rss.xml',
    category: 'privacy-laws',
    personas: ['privacy-advocate', 'professional'],
    source: 'Privacy International',
    updateFrequency: 14400000,
    isActive: true
  },
  {
    name: 'AARP Fraud Watch',
    url: 'https://www.aarp.org/money/scams-fraud/rss.xml',
    category: 'scams',
    personas: ['senior', 'general'],
    source: 'AARP',
    updateFrequency: 14400000,
    isActive: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/social-caution');
    logger.info('Connected to MongoDB');

    // Clear existing data
    await Persona.deleteMany({});
    await RSSFeed.deleteMany({});
    logger.info('Cleared existing personas and RSS feeds');

    // Insert personas
    const insertedPersonas = await Persona.insertMany(personas);
    logger.info(`Inserted ${insertedPersonas.length} personas`);

    // Insert RSS feeds
    const insertedFeeds = await RSSFeed.insertMany(rssFeeds);
    logger.info(`Inserted ${insertedFeeds.length} RSS feeds`);

    logger.info('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { personas, rssFeeds, seedDatabase };
