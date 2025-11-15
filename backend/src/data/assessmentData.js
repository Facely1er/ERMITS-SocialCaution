// Note: This file contains assessment data and doesn't need lucide-react icons
// The icons are referenced by name strings for frontend use

const questions = [
  {
    id: 'password-security',
    text: 'How do you manage your passwords for social media accounts?',
    category: 'Account Security',
    importance: 'critical',
    criticality: 5,
    complexity: 2,
    icon: 'Lock',
    options: [
      {
        text: 'I use the same password for multiple accounts',
        value: 'same-password',
        score: 0,
        level: 'beginner'
      },
      {
        text: 'I use different but simple passwords',
        value: 'simple-passwords',
        score: 1,
        level: 'beginner'
      },
      {
        text: 'I use strong, unique passwords for important accounts',
        value: 'strong-important',
        score: 2,
        level: 'intermediate'
      },
      {
        text: 'I use a password manager with unique, strong passwords for all accounts',
        value: 'password-manager',
        score: 3,
        level: 'advanced'
      }
    ],
    standards: [
      {
        name: 'NIST SP 800-63B',
        description: 'Digital Identity Guidelines - Authentication and Lifecycle Management'
      },
      {
        name: 'ISO 27001',
        description: 'Information Security Management - Access Control'
      }
    ]
  },
  {
    id: 'two-factor',
    text: 'Do you use two-factor authentication (2FA) for your accounts?',
    category: 'Account Security',
    importance: 'critical',
    criticality: 5,
    complexity: 1,
    icon: 'Shield',
    options: [
      {
        text: 'No, I don\'t use two-factor authentication',
        value: 'no-2fa',
        score: 0,
        level: 'beginner'
      },
      {
        text: 'I use it only for my email account',
        value: 'email-only',
        score: 1,
        level: 'beginner'
      },
      {
        text: 'I use it for email and some social media accounts',
        value: 'some-accounts',
        score: 2,
        level: 'intermediate'
      },
      {
        text: 'I use it for all accounts that offer it',
        value: 'all-accounts',
        score: 3,
        level: 'advanced'
      }
    ],
    standards: [
      {
        name: 'NIST SP 800-63B',
        description: 'Digital Identity Guidelines - Multi-factor Authentication'
      }
    ]
  },
  {
    id: 'privacy-settings',
    text: 'How often do you review your privacy settings on social media?',
    category: 'Privacy Configuration',
    importance: 'high',
    criticality: 4,
    complexity: 2,
    icon: 'Settings',
    options: [
      {
        text: 'I\'ve never checked them',
        value: 'never',
        score: 0,
        level: 'beginner'
      },
      {
        text: 'I checked them once when I created my accounts',
        value: 'once',
        score: 1,
        level: 'beginner'
      },
      {
        text: 'I check them occasionally, maybe once a year',
        value: 'yearly',
        score: 2,
        level: 'intermediate'
      },
      {
        text: 'I review them regularly and after platform updates',
        value: 'regularly',
        score: 3,
        level: 'advanced'
      }
    ],
    standards: [
      {
        name: 'GDPR',
        description: 'Privacy by Design and Default Principles'
      }
    ]
  },
  {
    id: 'public-sharing',
    text: 'How do you share personal information on social media?',
    category: 'Content Management',
    importance: 'high',
    criticality: 4,
    complexity: 2,
    icon: 'Share',
    options: [
      {
        text: 'I share everything publicly without restrictions',
        value: 'public-all',
        score: 0,
        level: 'beginner'
      },
      {
        text: 'I sometimes limit who can see my posts',
        value: 'sometimes-limited',
        score: 1,
        level: 'beginner'
      },
      {
        text: 'I usually share with friends only, not publicly',
        value: 'friends-only',
        score: 2,
        level: 'intermediate'
      },
      {
        text: 'I carefully control audience settings for each post',
        value: 'controlled-sharing',
        score: 3,
        level: 'advanced'
      }
    ],
    standards: [
      {
        name: 'GDPR',
        description: 'Data Minimization and Purpose Limitation'
      }
    ]
  },
  {
    id: 'location-sharing',
    text: 'How do you handle location information in your posts and photos?',
    category: 'Location Privacy',
    importance: 'high',
    criticality: 4,
    complexity: 1,
    icon: 'MapPin',
    options: [
      {
        text: 'I always share my exact location in real-time',
        value: 'always-share',
        score: 0,
        level: 'beginner'
      },
      {
        text: 'I sometimes include location data without thinking about it',
        value: 'sometimes-share',
        score: 1,
        level: 'beginner'
      },
      {
        text: 'I share location only for special occasions, not routinely',
        value: 'special-occasions',
        score: 2,
        level: 'intermediate'
      },
      {
        text: 'I have disabled location services for social media apps',
        value: 'disabled',
        score: 3,
        level: 'advanced'
      }
    ],
    standards: [
      {
        name: 'GDPR',
        description: 'Processing of Special Categories of Personal Data'
      }
    ]
  },
  {
    id: 'friend-requests',
    text: 'How do you handle friend or connection requests?',
    category: 'Social Connections',
    importance: 'medium',
    criticality: 3,
    complexity: 1,
    icon: 'UserPlus',
    options: [
      {
        text: 'I accept all requests without checking who they are',
        value: 'accept-all',
        score: 0,
        level: 'beginner'
      },
      {
        text: 'I usually accept requests if the person looks familiar',
        value: 'accept-familiar',
        score: 1,
        level: 'beginner'
      },
      {
        text: 'I only accept people I know personally',
        value: 'know-personally',
        score: 2,
        level: 'intermediate'
      },
      {
        text: 'I verify identity through mutual connections before accepting',
        value: 'verify-identity',
        score: 3,
        level: 'advanced'
      }
    ]
  },
  {
    id: 'suspicious-links',
    text: 'How do you handle suspicious links sent to you on social media?',
    category: 'Scam Prevention',
    importance: 'critical',
    criticality: 5,
    complexity: 1,
    icon: 'LinkIcon',
    options: [
      {
        text: 'I click on links without checking them',
        value: 'click-without-checking',
        score: 0,
        level: 'beginner'
      },
      {
        text: 'I sometimes check if the link looks suspicious',
        value: 'sometimes-check',
        score: 1,
        level: 'beginner'
      },
      {
        text: 'I only click links from trusted sources',
        value: 'trusted-sources',
        score: 2,
        level: 'intermediate'
      },
      {
        text: 'I verify all links and never click suspicious ones',
        value: 'verify-all',
        score: 3,
        level: 'advanced'
      }
    ]
  },
  {
    id: 'public-wifi',
    text: 'How do you access social media on public Wi-Fi networks?',
    category: 'Network Security',
    importance: 'high',
    criticality: 4,
    complexity: 2,
    icon: 'Wifi',
    options: [
      {
        text: 'I regularly use public Wi-Fi without any protection',
        value: 'unprotected',
        score: 0,
        level: 'beginner'
      },
      {
        text: 'I use public Wi-Fi but avoid logging into sensitive accounts',
        value: 'avoid-sensitive',
        score: 1,
        level: 'beginner'
      },
      {
        text: 'I sometimes use a VPN on public networks',
        value: 'sometimes-vpn',
        score: 2,
        level: 'intermediate'
      },
      {
        text: 'I always use a VPN or mobile data instead of public Wi-Fi',
        value: 'always-protected',
        score: 3,
        level: 'advanced'
      }
    ],
    standards: [
      {
        name: 'ISO 27001',
        description: 'Information Security Management - Network Security'
      }
    ]
  },
  {
    id: 'app-permissions',
    text: 'How do you manage app permissions for social media apps?',
    category: 'Data Permissions',
    importance: 'high',
    criticality: 4,
    complexity: 2,
    icon: 'Apps',
    options: [
      {
        text: 'I accept all permission requests without reviewing them',
        value: 'accept-all',
        score: 0,
        level: 'beginner'
      },
      {
        text: 'I sometimes review permissions but usually accept them',
        value: 'sometimes-review',
        score: 1,
        level: 'beginner'
      },
      {
        text: 'I carefully review permissions and reject unnecessary ones',
        value: 'careful-review',
        score: 2,
        level: 'intermediate'
      },
      {
        text: 'I use the minimum permissions needed and regularly audit them',
        value: 'minimum-audit',
        score: 3,
        level: 'advanced'
      }
    ],
    standards: [
      {
        name: 'GDPR',
        description: 'Data Minimization and Purpose Limitation'
      }
    ]
  },
  {
    id: 'account-recovery',
    text: 'How have you set up account recovery options?',
    category: 'Account Security',
    importance: 'high',
    criticality: 4,
    complexity: 1,
    icon: 'Lock',
    options: [
      {
        text: 'I haven\'t set up any recovery options',
        value: 'no-recovery',
        score: 0,
        level: 'beginner'
      },
      {
        text: 'I have an old email as recovery that I rarely check',
        value: 'old-email',
        score: 1,
        level: 'beginner'
      },
      {
        text: 'I have a current email and phone number for recovery',
        value: 'email-phone',
        score: 2,
        level: 'intermediate'
      },
      {
        text: 'I have multiple recovery methods and keep them updated',
        value: 'multiple-updated',
        score: 3,
        level: 'advanced'
      }
    ]
  }
];

const actionPlans = {
  high: {
    'privacy-settings': {
      steps: [
        'Review all privacy settings on your social media accounts',
        'Set posts to "Friends Only" by default',
        'Disable data sharing with third-party apps',
        'Opt out of targeted advertising where possible',
        'Disable location tracking in social media apps'
      ],
      resources: [
        {
          title: 'Facebook Privacy Checkup',
          url: 'https://www.facebook.com/privacy/checkup/'
        },
        {
          title: 'Instagram Privacy Guide',
          url: 'https://help.instagram.com/196883487377501'
        },
        {
          title: 'Twitter Privacy Settings',
          url: 'https://twitter.com/settings/privacy'
        }
      ]
    },
    'account-security': {
      steps: [
        'Enable two-factor authentication on all accounts',
        'Use a password manager to create and store strong, unique passwords',
        'Set up account recovery options (backup email, phone number)',
        'Remove access from unused third-party applications',
        'Set up login alerts for unusual activity'
      ],
      resources: [
        {
          title: 'Two-Factor Authentication Guide',
          url: 'https://www.consumer.ftc.gov/articles/how-use-two-factor-authentication'
        },
        {
          title: 'Password Manager Comparison',
          url: 'https://www.consumerreports.org/electronics-computers/password-managers/password-managers-review/'
        }
      ]
    }
  },
  medium: {
    'content-management': {
      steps: [
        'Review past posts for sensitive information',
        'Use audience selection tools for each post',
        'Limit who can tag you in photos',
        'Control who can see your friends list',
        'Regularly delete old content you no longer need public'
      ],
      resources: [
        {
          title: 'Facebook Timeline Review',
          url: 'https://www.facebook.com/help/timeline'
        },
        {
          title: 'Instagram Privacy Guide',
          url: 'https://help.instagram.com/196883487377501'
        }
      ]
    }
  },
  low: {
    'general-awareness': {
      steps: [
        'Follow privacy news sources to stay informed',
        'Review privacy policies before using new services',
        'Participate in privacy awareness training',
        'Join privacy-focused communities for tips'
      ],
      resources: [
        {
          title: 'Electronic Frontier Foundation',
          url: 'https://www.eff.org/'
        },
        {
          title: 'Privacy Rights Clearinghouse',
          url: 'https://privacyrights.org/'
        }
      ]
    }
  }
};

module.exports = {
  questions,
  actionPlans
};