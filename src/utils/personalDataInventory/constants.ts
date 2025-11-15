import { DataCategoryInfo } from '../../types/personalDataInventory';

export const DATA_CATEGORIES: DataCategoryInfo[] = [
  {
    value: 'personal_identification',
    label: 'Personal Identification',
    description: 'Names, ID numbers, passport details, etc.',
    icon: '🆔'
  },
  {
    value: 'contact_information',
    label: 'Contact Information',
    description: 'Email addresses, phone numbers, postal addresses',
    icon: '📞'
  },
  {
    value: 'financial_data',
    label: 'Financial Data',
    description: 'Bank accounts, credit cards, payment information',
    icon: '💳'
  },
  {
    value: 'health_data',
    label: 'Health Data',
    description: 'Medical records, health conditions, prescriptions',
    icon: '🏥'
  },
  {
    value: 'biometric_data',
    label: 'Biometric Data',
    description: 'Fingerprints, facial recognition, voice patterns',
    icon: '👤'
  },
  {
    value: 'location_data',
    label: 'Location Data',
    description: 'GPS coordinates, IP addresses, check-ins',
    icon: '📍'
  },
  {
    value: 'online_activity',
    label: 'Online Activity',
    description: 'Browsing history, search queries, social media activity',
    icon: '🌐'
  },
  {
    value: 'preferences',
    label: 'Preferences',
    description: 'Settings, interests, marketing preferences',
    icon: '⚙️'
  },
  {
    value: 'communication_data',
    label: 'Communication Data',
    description: 'Messages, emails, call logs, chat history',
    icon: '💬'
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Any other personal data not covered above',
    icon: '📋'
  }
];

export const LEGAL_BASIS_OPTIONS = [
  'Consent',
  'Contract',
  'Legal obligation',
  'Vital interests',
  'Public task',
  'Legitimate interests'
];

export const RETENTION_PERIOD_OPTIONS = [
  '1 year',
  '2 years',
  '3 years',
  '5 years',
  '7 years',
  '10 years',
  'Indefinite',
  'Until consent withdrawn',
  'Other'
];
