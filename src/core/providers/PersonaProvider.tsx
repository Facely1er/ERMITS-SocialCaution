// src/core/providers/PersonaProvider.tsx
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState, type FC, type ReactNode } from 'react';
import { PersonaType, JourneyPhase, type PersonaConfig, type PersonaContextType } from '../types/personaTypes';

export const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

// Persona configurations
const personaConfigs: Record<PersonaType, PersonaConfig> = {
  [PersonaType.CAUTIOUS_PARENT]: {
    id: PersonaType.CAUTIOUS_PARENT,
    title: 'Cautious Parent',
    description: 'Protecting your family\'s digital presence while fostering healthy online experiences.',
    primaryColor: 'blue-600',
    secondaryColor: 'green-500',
    icon: 'Heart',
    navigation: {
      primaryActions: [
        { label: 'Family Assessment', path: '/parent/family-assessment', icon: 'Users', description: 'Evaluate your family\'s privacy protection' },
        { label: 'Parental Controls', path: '/parent/controls', icon: 'Shield', description: 'Manage children\'s device settings' },
        { label: 'Child Safety', path: '/parent/safety', icon: 'Heart', description: 'Online safety tools and guides' },
        { label: 'Screen Time', path: '/parent/screen-time', icon: 'Clock', description: 'Monitor and manage screen time' }
      ],
      quickLinks: [
        { label: 'Emergency Lockdown', path: '/parent/emergency', icon: 'AlertTriangle' },
        { label: 'App Permissions', path: '/parent/app-permissions', icon: 'Settings' },
        { label: 'Safe Browsing Setup', path: '/parent/safe-browsing', icon: 'Globe' },
        { label: 'Privacy Talks Guide', path: '/parent/privacy-talks', icon: 'MessageSquare' }
      ]
    },
    dashboard: {
      widgets: ['FamilyOverview', 'ChildrenStatus', 'RecentActivity', 'ParentalControls', 'EducationalResources'],
      layout: 'family-focused'
    },
    assessments: [
      {
        id: 'family-privacy-checkup',
        title: 'Family Privacy Checkup',
        description: 'Comprehensive evaluation of your family\'s digital privacy protection',
        estimatedTime: '15 minutes',
        priority: 'high'
      },
      {
        id: 'parental-controls-audit',
        title: 'Parental Controls Audit',
        description: 'Review and optimize your current parental control settings',
        estimatedTime: '20 minutes',
        priority: 'medium'
      }
    ],
    onboarding: {
      steps: ['welcome-family', 'children-info', 'family-goals', 'initial-assessment', 'dashboard-tour'],
      estimatedTime: '10 minutes'
    }
  },

  [PersonaType.DIGITAL_NOVICE]: {
    id: PersonaType.DIGITAL_NOVICE,
    title: 'Digital Novice',
    description: 'Learning the basics of online privacy and digital security step by step.',
    primaryColor: 'green-600',
    secondaryColor: 'blue-500',
    icon: 'BookOpen',
    navigation: {
      primaryActions: [
        { label: 'Privacy Basics', path: '/novice/basics', icon: 'BookOpen', description: 'Learn fundamental privacy concepts' },
        { label: 'Quick Checkup', path: '/novice/checkup', icon: 'Search', description: 'Simple privacy assessment' },
        { label: 'Step-by-Step Guides', path: '/novice/guides', icon: 'List', description: 'Easy-to-follow tutorials' },
        { label: 'Help & Support', path: '/novice/help', icon: 'HelpCircle', description: 'Get assistance when needed' }
      ],
      quickLinks: [
        { label: 'Privacy 101', path: '/novice/privacy-101', icon: 'GraduationCap' },
        { label: 'Common Mistakes', path: '/novice/mistakes', icon: 'AlertCircle' },
        { label: 'Essential Settings', path: '/novice/settings', icon: 'Settings' },
        { label: 'Progress Tracker', path: '/novice/progress', icon: 'TrendingUp' }
      ]
    },
    dashboard: {
      widgets: ['LearningProgress', 'NextSteps', 'QuickWins', 'PrivacyScore', 'HelpResources'],
      layout: 'learning-focused'
    },
    assessments: [
      {
        id: 'privacy-knowledge-check',
        title: 'Privacy Knowledge Check',
        description: 'Discover what you know and what to learn next',
        estimatedTime: '10 minutes',
        priority: 'high'
      }
    ],
    onboarding: {
      steps: ['welcome-novice', 'knowledge-assessment', 'learning-style', 'quick-wins', 'learning-path'],
      estimatedTime: '8 minutes'
    }
  },

  [PersonaType.PRIVACY_ADVOCATE]: {
    id: PersonaType.PRIVACY_ADVOCATE,
    title: 'Privacy Advocate',
    description: 'Advanced privacy protection and digital rights awareness for power users.',
    primaryColor: 'purple-600',
    secondaryColor: 'indigo-500',
    icon: 'Users',
    navigation: {
      primaryActions: [
        { label: 'Advanced Analytics', path: '/advocate/analytics', icon: 'BarChart', description: 'Comprehensive privacy metrics' },
        { label: 'Digital Rights Tracker', path: '/advocate/rights', icon: 'Scale', description: 'Monitor and exercise your rights' },
        { label: 'Privacy Tools', path: '/advocate/tools', icon: 'Wrench', description: 'Advanced privacy utilities' },
        { label: 'Community Hub', path: '/advocate/community', icon: 'Users', description: 'Connect with other advocates' }
      ],
      quickLinks: [
        { label: 'Data Export', path: '/advocate/data-export', icon: 'Download' },
        { label: 'Compliance Checker', path: '/advocate/compliance', icon: 'CheckCircle' },
        { label: 'Threat Monitor', path: '/advocate/threats', icon: 'Eye' },
        { label: 'Legislative Updates', path: '/advocate/legislation', icon: 'Gavel' }
      ]
    },
    dashboard: {
      widgets: ['AdvancedAnalytics', 'RightsTracker', 'ComplianceStatus', 'ThreatMonitoring', 'CommunityActivity'],
      layout: 'data-rich'
    },
    assessments: [
      {
        id: 'comprehensive-privacy-audit',
        title: 'Comprehensive Privacy Audit',
        description: 'Deep dive into all aspects of your digital privacy',
        estimatedTime: '30 minutes',
        priority: 'high'
      }
    ],
    onboarding: {
      steps: ['welcome-advocate', 'advanced-assessment', 'tool-preferences', 'community-setup', 'advocacy-goals'],
      estimatedTime: '15 minutes'
    }
  },

  [PersonaType.ONLINE_SHOPPER]: {
    id: PersonaType.ONLINE_SHOPPER,
    title: 'Online Shopper',
    description: 'Securing your financial information and protecting your shopping data.',
    primaryColor: 'emerald-600',
    secondaryColor: 'teal-500',
    icon: 'ShoppingBag',
    navigation: {
      primaryActions: [
        { label: 'Shopping Safety', path: '/shopper/safety', icon: 'ShoppingBag', description: 'Safe online shopping practices' },
        { label: 'Payment Security', path: '/shopper/payments', icon: 'CreditCard', description: 'Protect your financial data' },
        { label: 'Account Audit', path: '/shopper/accounts', icon: 'User', description: 'Review shopping accounts' },
        { label: 'Data Tracking', path: '/shopper/tracking', icon: 'Eye', description: 'Monitor data collection' }
      ],
      quickLinks: [
        { label: 'Secure Checkout Tips', path: '/shopper/checkout-tips', icon: 'Lock' },
        { label: 'Coupon Safety', path: '/shopper/coupon-safety', icon: 'Tag' },
        { label: 'Review Management', path: '/shopper/reviews', icon: 'Star' },
        { label: 'Return Privacy', path: '/shopper/returns', icon: 'RotateCcw' }
      ]
    },
    dashboard: {
      widgets: ['ShoppingSafety', 'PaymentSecurity', 'AccountStatus', 'DataTracking', 'ShoppingTips'],
      layout: 'action-oriented'
    },
    assessments: [
      {
        id: 'shopping-privacy-checkup',
        title: 'Shopping Privacy Checkup',
        description: 'Evaluate your online shopping privacy and security',
        estimatedTime: '12 minutes',
        priority: 'high'
      }
    ],
    onboarding: {
      steps: ['welcome-shopper', 'shopping-habits', 'security-assessment', 'payment-setup', 'monitoring-preferences'],
      estimatedTime: '12 minutes'
    }
  },

  [PersonaType.SOCIAL_INFLUENCER]: {
    id: PersonaType.SOCIAL_INFLUENCER,
    title: 'Social Influencer',
    description: 'Balancing public presence with personal privacy and security.',
    primaryColor: 'pink-600',
    secondaryColor: 'rose-500',
    icon: 'Camera',
    navigation: {
      primaryActions: [
        { label: 'Public vs Private', path: '/influencer/balance', icon: 'Scale', description: 'Balance visibility and privacy' },
        { label: 'Content Security', path: '/influencer/content', icon: 'Shield', description: 'Protect your content and brand' },
        { label: 'Audience Safety', path: '/influencer/audience', icon: 'Users', description: 'Manage audience interactions safely' },
        { label: 'Brand Protection', path: '/influencer/brand', icon: 'Award', description: 'Protect your personal brand' }
      ],
      quickLinks: [
        { label: 'Platform Settings', path: '/influencer/platforms', icon: 'Settings' },
        { label: 'Content Backup', path: '/influencer/backup', icon: 'Save' },
        { label: 'Harassment Tools', path: '/influencer/harassment', icon: 'Shield' },
        { label: 'Analytics Privacy', path: '/influencer/analytics', icon: 'BarChart' }
      ]
    },
    dashboard: {
      widgets: ['PublicPrivateBalance', 'ContentSecurity', 'AudienceManagement', 'BrandProtection', 'PlatformStatus'],
      layout: 'social-focused'
    },
    assessments: [
      {
        id: 'influencer-privacy-audit',
        title: 'Influencer Privacy Audit',
        description: 'Comprehensive review of your public-facing privacy settings',
        estimatedTime: '18 minutes',
        priority: 'high'
      }
    ],
    onboarding: {
      steps: ['welcome-influencer', 'platform-inventory', 'privacy-goals', 'audience-settings', 'brand-protection'],
      estimatedTime: '15 minutes'
    }
  },

  [PersonaType.PRIVATE_INDIVIDUAL]: {
    id: PersonaType.PRIVATE_INDIVIDUAL,
    title: 'Private Individual',
    description: 'Maintaining personal privacy and controlling your digital footprint.',
    primaryColor: 'slate-600',
    secondaryColor: 'gray-500',
    icon: 'Shield',
    navigation: {
      primaryActions: [
        { label: 'Privacy Audit', path: '/private/audit', icon: 'Search', description: 'Comprehensive privacy review' },
        { label: 'Data Control', path: '/private/data-control', icon: 'Database', description: 'Manage your personal data' },
        { label: 'Digital Footprint', path: '/private/footprint', icon: 'Footprints', description: 'Monitor your online presence' },
        { label: 'Security Settings', path: '/private/security', icon: 'Lock', description: 'Enhance account security' }
      ],
      quickLinks: [
        { label: 'Data Deletion', path: '/private/data-deletion', icon: 'Trash2' },
        { label: 'Account Cleanup', path: '/private/cleanup', icon: 'Broom' },
        { label: 'Monitoring Setup', path: '/private/monitoring', icon: 'Eye' },
        { label: 'Privacy Score', path: '/private/score', icon: 'Target' }
      ]
    },
    dashboard: {
      widgets: ['PrivacyScore', 'DigitalFootprint', 'DataControl', 'SecurityStatus', 'PrivacyInsights'],
      layout: 'privacy-first'
    },
    assessments: [
      {
        id: 'personal-privacy-audit',
        title: 'Personal Privacy Audit',
        description: 'Complete evaluation of your personal privacy protection',
        estimatedTime: '20 minutes',
        priority: 'high'
      }
    ],
    onboarding: {
      steps: ['welcome-private', 'privacy-assessment', 'data-inventory', 'security-review', 'monitoring-setup'],
      estimatedTime: '15 minutes'
    }
  },

  [PersonaType.CONCERNED_EMPLOYEE]: {
    id: PersonaType.CONCERNED_EMPLOYEE,
    title: 'Concerned Employee',
    description: 'Protecting your personal data and privacy in the workplace while understanding your rights and risks.',
    primaryColor: 'orange-600',
    secondaryColor: 'amber-500',
    icon: 'AlertTriangle',
    navigation: {
      primaryActions: [
        { label: 'Workplace Privacy Audit', path: '/employee/audit', icon: 'Search', description: 'Assess your workplace privacy risks' },
        { label: 'Employee Rights', path: '/employee/rights', icon: 'Scale', description: 'Understand your data protection rights' },
        { label: 'Monitoring Check', path: '/employee/monitoring', icon: 'Eye', description: 'Check what your employer monitors' },
        { label: 'Data Protection', path: '/employee/data-protection', icon: 'Shield', description: 'Protect your personal data at work' }
      ],
      quickLinks: [
        { label: 'Policy Review', path: '/employee/policies', icon: 'FileText' },
        { label: 'Data Request', path: '/employee/data-request', icon: 'Download' },
        { label: 'Privacy Settings', path: '/employee/settings', icon: 'Settings' },
        { label: 'Legal Resources', path: '/employee/legal', icon: 'Gavel' }
      ]
    },
    dashboard: {
      widgets: ['WorkplacePrivacy', 'EmployeeRights', 'MonitoringStatus', 'DataProtection', 'PolicyCompliance'],
      layout: 'action-oriented'
    },
    assessments: [
      {
        id: 'workplace-privacy-assessment',
        title: 'Workplace Privacy Assessment',
        description: 'Comprehensive evaluation of your workplace privacy protection and rights',
        estimatedTime: '18 minutes',
        priority: 'high'
      },
      {
        id: 'employee-monitoring-check',
        title: 'Employee Monitoring Check',
        description: 'Understand what your employer monitors and your rights',
        estimatedTime: '12 minutes',
        priority: 'medium'
      }
    ],
    onboarding: {
      steps: ['welcome-employee', 'workplace-assessment', 'rights-education', 'monitoring-check', 'protection-setup'],
      estimatedTime: '12 minutes'
    }
  }
};

export const PersonaProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [persona, setPersonaState] = useState<PersonaType | null>(null);
  const [journeyPhase, setJourneyPhase] = useState<JourneyPhase>(JourneyPhase.DISCOVERY);

  useEffect(() => {
    // Load persona from localStorage
    try {
      const savedPersona = localStorage.getItem('socialcaution-persona') as PersonaType;
      const savedPhase = localStorage.getItem('socialcaution-journey-phase') as JourneyPhase;
      
      if (savedPersona && Object.values(PersonaType).includes(savedPersona)) {
        setPersonaState(savedPersona);
      }
      
      if (savedPhase && Object.values(JourneyPhase).includes(savedPhase)) {
        setJourneyPhase(savedPhase);
      }
    } catch (error) {
      // Log error but don't block the app
      console.error('PersonaProvider initialization error:', error);
    }
  }, []);

  const setPersona = (newPersona: PersonaType) => {
    try {
      setPersonaState(newPersona);
      localStorage.setItem('socialcaution-persona', newPersona);
      
      // Analytics tracking (you can replace with your analytics)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'persona_selected', {
          persona: newPersona,
          timestamp: new Date().toISOString()
        });
      }
      
      // Auto-advance journey phase if this is first persona selection
      if (journeyPhase === JourneyPhase.DISCOVERY) {
        updateJourneyPhase(JourneyPhase.ASSESSMENT);
      }
    } catch (error) {
      console.error('PersonaProvider setPersona error:', error);
    }
  };

  const updateJourneyPhase = (phase: JourneyPhase) => {
    try {
      setJourneyPhase(phase);
      localStorage.setItem('socialcaution-journey-phase', phase);
      
      // Analytics tracking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'journey_phase_entered', {
          phase,
          persona,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('PersonaProvider updateJourneyPhase error:', error);
    }
  };

  const getPersonaConfig = (): PersonaConfig | null => {
    return persona ? personaConfigs[persona] : null;
  };

  const personaConfig = getPersonaConfig();
  const isPersonaSelected = Boolean(persona);

  const value: PersonaContextType = {
    persona,
    journeyPhase,
    personaConfig,
    setPersona,
    updateJourneyPhase,
    getPersonaConfig,
    isPersonaSelected
  };

  return (
    <PersonaContext.Provider value={value}>
      {children}
    </PersonaContext.Provider>
  );
};

// Export hooks, types, and constants for backward compatibility
export { usePersona, usePersonaConfig, usePersonaNavigation, usePersonaDashboard, useJourneyProgress } from '../../hooks/usePersona';
export { PersonaType, JourneyPhase } from '../types/personaTypes';
export type { PersonaConfig, NavigationItem, AssessmentConfig } from '../types/personaTypes';
export { personaConfigs };