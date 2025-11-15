const challengeTasks = {
  1: [
    {
      title: "Update Your Password",
      description: "Change your password to a strong, unique one with at least 12 characters, including numbers, symbols, and mixed case letters.",
      category: "password",
      difficulty: "easy",
      estimatedTime: "10 minutes",
      points: 15,
      resources: [
        {
          title: "Password Best Practices Guide",
          url: "/resources/guides/password-security",
          type: "guide"
        }
      ],
      tips: [
        "Use a password manager to generate and store strong passwords",
        "Avoid using personal information in passwords",
        "Enable two-factor authentication where possible"
      ]
    }
  ],
  2: [
    {
      title: "Enable Two-Factor Authentication",
      description: "Set up 2FA on your most important accounts (email, banking, social media).",
      category: "security",
      difficulty: "medium",
      estimatedTime: "15 minutes",
      points: 20,
      resources: [
        {
          title: "2FA Setup Guide",
          url: "/resources/guides/two-factor-authentication",
          type: "guide"
        }
      ],
      tips: [
        "Use an authenticator app instead of SMS when possible",
        "Keep backup codes in a secure location",
        "Enable 2FA on all accounts that support it"
      ]
    }
  ],
  3: [
    {
      title: "Review Social Media Privacy Settings",
      description: "Go through your social media accounts and adjust privacy settings to limit who can see your posts and personal information.",
      category: "social",
      difficulty: "easy",
      estimatedTime: "20 minutes",
      points: 15,
      resources: [
        {
          title: "Social Media Privacy Settings Guide",
          url: "/resources/guides/social-media-privacy",
          type: "guide"
        }
      ],
      tips: [
        "Set posts to 'Friends Only' by default",
        "Limit who can find you by email or phone",
        "Review and remove old posts that might be too personal"
      ]
    }
  ],
  4: [
    {
      title: "Update Your Browser",
      description: "Ensure your web browser is up to date with the latest security patches and features.",
      category: "browser",
      difficulty: "easy",
      estimatedTime: "5 minutes",
      points: 10,
      resources: [
        {
          title: "Browser Security Guide",
          url: "/resources/guides/browser-security",
          type: "guide"
        }
      ],
      tips: [
        "Enable automatic updates if available",
        "Clear browser cache and cookies regularly",
        "Use a privacy-focused browser when possible"
      ]
    }
  ],
  5: [
    {
      title: "Check App Permissions",
      description: "Review and revoke unnecessary permissions for apps on your phone and computer.",
      category: "device",
      difficulty: "medium",
      estimatedTime: "25 minutes",
      points: 20,
      resources: [
        {
          title: "App Permissions Guide",
          url: "/resources/guides/app-permissions",
          type: "guide"
        }
      ],
      tips: [
        "Only grant permissions that are necessary for app functionality",
        "Regularly review and remove unused apps",
        "Be cautious of apps that request too many permissions"
      ]
    }
  ],
  6: [
    {
      title: "Secure Your Wi-Fi Network",
      description: "Change your home Wi-Fi password and ensure it's using WPA3 encryption.",
      category: "device",
      difficulty: "medium",
      estimatedTime: "15 minutes",
      points: 25,
      resources: [
        {
          title: "Wi-Fi Security Guide",
          url: "/resources/guides/wi-fi-security",
          type: "guide"
        }
      ],
      tips: [
        "Use a strong, unique password for your Wi-Fi",
        "Enable WPA3 encryption if your router supports it",
        "Disable WPS if not needed"
      ]
    }
  ],
  7: [
    {
      title: "Set Up a Password Manager",
      description: "Install and configure a password manager to securely store and manage all your passwords.",
      category: "tools",
      difficulty: "medium",
      estimatedTime: "30 minutes",
      points: 30,
      resources: [
        {
          title: "Password Manager Comparison",
          url: "/resources/guides/password-managers",
          type: "guide"
        }
      ],
      tips: [
        "Choose a reputable password manager with good security track record",
        "Use a strong master password",
        "Enable two-factor authentication for your password manager"
      ]
    }
  ],
  8: [
    {
      title: "Review Location Settings",
      description: "Check and adjust location sharing settings on your devices and apps.",
      category: "privacy-settings",
      difficulty: "easy",
      estimatedTime: "15 minutes",
      points: 15,
      resources: [
        {
          title: "Location Privacy Guide",
          url: "/resources/guides/location-privacy",
          type: "guide"
        }
      ],
      tips: [
        "Turn off location services for apps that don't need it",
        "Use approximate location when possible",
        "Review location history and delete if not needed"
      ]
    }
  ],
  9: [
    {
      title: "Enable Find My Device",
      description: "Set up device tracking and remote wipe capabilities for your phone and laptop.",
      category: "device",
      difficulty: "easy",
      estimatedTime: "10 minutes",
      points: 15,
      resources: [
        {
          title: "Device Tracking Setup Guide",
          url: "/resources/guides/device-tracking",
          type: "guide"
        }
      ],
      tips: [
        "Test the tracking feature to ensure it works",
        "Keep your devices charged to maintain tracking",
        "Know how to remotely wipe your device if stolen"
      ]
    }
  ],
  10: [
    {
      title: "Audit Your Email Subscriptions",
      description: "Unsubscribe from unnecessary email lists and newsletters to reduce your digital footprint.",
      category: "data",
      difficulty: "easy",
      estimatedTime: "20 minutes",
      points: 15,
      resources: [
        {
          title: "Email Privacy Guide",
          url: "/resources/guides/email-privacy",
          type: "guide"
        }
      ],
      tips: [
        "Use a separate email for subscriptions",
        "Regularly review and unsubscribe from lists",
        "Consider using email aliases for different purposes"
      ]
    }
  ],
  11: [
    {
      title: "Set Up a VPN",
      description: "Install and configure a VPN service to protect your internet traffic and location privacy.",
      category: "tools",
      difficulty: "medium",
      estimatedTime: "20 minutes",
      points: 25,
      resources: [
        {
          title: "VPN Setup Guide",
          url: "/resources/guides/vpn-setup",
          type: "guide"
        }
      ],
      tips: [
        "Choose a VPN with a no-logs policy",
        "Use the VPN especially on public Wi-Fi",
        "Test your VPN to ensure it's working properly"
      ]
    }
  ],
  12: [
    {
      title: "Review Browser Extensions",
      description: "Audit and remove unnecessary browser extensions that might be collecting your data.",
      category: "browser",
      difficulty: "easy",
      estimatedTime: "15 minutes",
      points: 15,
      resources: [
        {
          title: "Browser Extension Security Guide",
          url: "/resources/guides/browser-extensions",
          type: "guide"
        }
      ],
      tips: [
        "Only install extensions from trusted sources",
        "Regularly review extension permissions",
        "Remove extensions you no longer use"
      ]
    }
  ],
  13: [
    {
      title: "Secure Your Smart Home Devices",
      description: "Change default passwords and update firmware on your smart home devices.",
      category: "device",
      difficulty: "hard",
      estimatedTime: "45 minutes",
      points: 35,
      resources: [
        {
          title: "Smart Home Security Guide",
          url: "/resources/guides/smart-home-security",
          type: "guide"
        }
      ],
      tips: [
        "Change all default passwords immediately",
        "Keep firmware updated",
        "Use a separate network for IoT devices if possible"
      ]
    }
  ],
  14: [
    {
      title: "Enable Privacy Mode",
      description: "Configure your browser and apps to use privacy-focused settings and modes.",
      category: "privacy-settings",
      difficulty: "easy",
      estimatedTime: "20 minutes",
      points: 20,
      resources: [
        {
          title: "Privacy Mode Setup Guide",
          url: "/resources/guides/privacy-mode",
          type: "guide"
        }
      ],
      tips: [
        "Use private/incognito mode when appropriate",
        "Enable tracking protection",
        "Clear browsing data regularly"
      ]
    }
  ],
  15: [
    {
      title: "Set Up Account Recovery",
      description: "Configure secure account recovery options for your important accounts.",
      category: "security",
      difficulty: "medium",
      estimatedTime: "25 minutes",
      points: 25,
      resources: [
        {
          title: "Account Recovery Guide",
          url: "/resources/guides/account-recovery",
          type: "guide"
        }
      ],
      tips: [
        "Use multiple recovery methods when possible",
        "Keep recovery codes in a secure location",
        "Test recovery methods to ensure they work"
      ]
    }
  ],
  16: [
    {
      title: "Review Data Sharing Settings",
      description: "Check and limit data sharing settings across your devices and online accounts.",
      category: "privacy-settings",
      difficulty: "medium",
      estimatedTime: "30 minutes",
      points: 25,
      resources: [
        {
          title: "Data Sharing Control Guide",
          url: "/resources/guides/data-sharing-control",
          type: "guide"
        }
      ],
      tips: [
        "Opt out of data sharing when possible",
        "Review privacy policies of services you use",
        "Use privacy-focused alternatives when available"
      ]
    }
  ],
  17: [
    {
      title: "Secure Your Cloud Storage",
      description: "Enable encryption and review sharing settings for your cloud storage accounts.",
      category: "data",
      difficulty: "medium",
      estimatedTime: "20 minutes",
      points: 25,
      resources: [
        {
          title: "Cloud Security Guide",
          url: "/resources/guides/cloud-security",
          type: "guide"
        }
      ],
      tips: [
        "Enable two-factor authentication",
        "Use client-side encryption when possible",
        "Regularly review shared files and folders"
      ]
    }
  ],
  18: [
    {
      title: "Update Your Operating System",
      description: "Install the latest security updates for your operating system.",
      category: "device",
      difficulty: "easy",
      estimatedTime: "30 minutes",
      points: 20,
      resources: [
        {
          title: "OS Security Updates Guide",
          url: "/resources/guides/os-updates",
          type: "guide"
        }
      ],
      tips: [
        "Enable automatic updates if available",
        "Restart your device after updates",
        "Keep older systems updated as long as possible"
      ]
    }
  ],
  19: [
    {
      title: "Review Mobile App Permissions",
      description: "Audit and adjust permissions for all apps on your mobile device.",
      category: "device",
      difficulty: "medium",
      estimatedTime: "25 minutes",
      points: 20,
      resources: [
        {
          title: "Mobile App Permissions Guide",
          url: "/resources/guides/mobile-permissions",
          type: "guide"
        }
      ],
      tips: [
        "Only grant necessary permissions",
        "Regularly review and revoke unused permissions",
        "Be cautious of apps with excessive permission requests"
      ]
    }
  ],
  20: [
    {
      title: "Set Up Secure Backups",
      description: "Configure encrypted backups for your important data and devices.",
      category: "data",
      difficulty: "hard",
      estimatedTime: "40 minutes",
      points: 30,
      resources: [
        {
          title: "Secure Backup Guide",
          url: "/resources/guides/secure-backups",
          type: "guide"
        }
      ],
      tips: [
        "Use encryption for all backups",
        "Test backup restoration regularly",
        "Keep backups in multiple locations"
      ]
    }
  ],
  21: [
    {
      title: "Enable Screen Lock",
      description: "Set up strong screen lock methods on all your devices.",
      category: "device",
      difficulty: "easy",
      estimatedTime: "10 minutes",
      points: 15,
      resources: [
        {
          title: "Screen Lock Security Guide",
          url: "/resources/guides/screen-lock",
          type: "guide"
        }
      ],
      tips: [
        "Use biometric authentication when available",
        "Set short auto-lock times",
        "Avoid simple patterns or PINs"
      ]
    }
  ],
  22: [
    {
      title: "Review Online Shopping Privacy",
      description: "Check privacy settings and data sharing policies of your online shopping accounts.",
      category: "privacy-settings",
      difficulty: "medium",
      estimatedTime: "25 minutes",
      points: 20,
      resources: [
        {
          title: "Online Shopping Privacy Guide",
          url: "/resources/guides/shopping-privacy",
          type: "guide"
        }
      ],
      tips: [
        "Opt out of marketing communications",
        "Use guest checkout when possible",
        "Review and delete old purchase history"
      ]
    }
  ],
  23: [
    {
      title: "Secure Your Router",
      description: "Update router firmware and configure advanced security settings.",
      category: "device",
      difficulty: "hard",
      estimatedTime: "45 minutes",
      points: 35,
      resources: [
        {
          title: "Router Security Guide",
          url: "/resources/guides/router-security",
          type: "guide"
        }
      ],
      tips: [
        "Change default admin credentials",
        "Disable WPS and remote management",
        "Enable guest network for visitors"
      ]
    }
  ],
  24: [
    {
      title: "Review Financial App Security",
      description: "Audit security settings and permissions for your banking and financial apps.",
      category: "security",
      difficulty: "medium",
      estimatedTime: "20 minutes",
      points: 25,
      resources: [
        {
          title: "Financial App Security Guide",
          url: "/resources/guides/financial-security",
          type: "guide"
        }
      ],
      tips: [
        "Enable all available security features",
        "Use strong authentication methods",
        "Monitor account activity regularly"
      ]
    }
  ],
  25: [
    {
      title: "Set Up Privacy-Focused Search",
      description: "Switch to privacy-focused search engines and configure them properly.",
      category: "tools",
      difficulty: "easy",
      estimatedTime: "15 minutes",
      points: 20,
      resources: [
        {
          title: "Privacy Search Engines Guide",
          url: "/resources/guides/privacy-search",
          type: "guide"
        }
      ],
      tips: [
        "Use DuckDuckGo or Startpage for searches",
        "Configure your browser's default search engine",
        "Consider using Tor for maximum privacy"
      ]
    }
  ],
  26: [
    {
      title: "Review Smartphone Privacy Settings",
      description: "Go through all privacy settings on your smartphone and adjust them for maximum privacy.",
      category: "privacy-settings",
      difficulty: "medium",
      estimatedTime: "30 minutes",
      points: 25,
      resources: [
        {
          title: "Smartphone Privacy Guide",
          url: "/resources/guides/smartphone-privacy",
          type: "guide"
        }
      ],
      tips: [
        "Disable location services for unnecessary apps",
        "Limit ad tracking and analytics",
        "Review app permissions regularly"
      ]
    }
  ],
  27: [
    {
      title: "Secure Your Email Account",
      description: "Enable advanced security features and review email privacy settings.",
      category: "security",
      difficulty: "medium",
      estimatedTime: "25 minutes",
      points: 25,
      resources: [
        {
          title: "Email Security Guide",
          url: "/resources/guides/email-security",
          type: "guide"
        }
      ],
      tips: [
        "Enable two-factor authentication",
        "Use app-specific passwords",
        "Review and revoke third-party access"
      ]
    }
  ],
  28: [
    {
      title: "Set Up Encrypted Messaging",
      description: "Install and configure encrypted messaging apps for secure communication.",
      category: "tools",
      difficulty: "easy",
      estimatedTime: "20 minutes",
      points: 20,
      resources: [
        {
          title: "Encrypted Messaging Guide",
          url: "/resources/guides/encrypted-messaging",
          type: "guide"
        }
      ],
      tips: [
        "Use Signal or WhatsApp for encrypted messaging",
        "Verify contact identities",
        "Enable disappearing messages when appropriate"
      ]
    }
  ],
  29: [
    {
      title: "Conduct a Privacy Audit",
      description: "Perform a comprehensive review of all your digital accounts and privacy settings.",
      category: "education",
      difficulty: "hard",
      estimatedTime: "60 minutes",
      points: 40,
      resources: [
        {
          title: "Privacy Audit Checklist",
          url: "/resources/guides/privacy-audit",
          type: "guide"
        }
      ],
      tips: [
        "Use a systematic approach to review all accounts",
        "Document findings and create action plan",
        "Schedule regular privacy audits"
      ]
    }
  ],
  30: [
    {
      title: "Create a Privacy Action Plan",
      description: "Develop a long-term plan for maintaining and improving your digital privacy.",
      category: "education",
      difficulty: "medium",
      estimatedTime: "30 minutes",
      points: 30,
      resources: [
        {
          title: "Privacy Action Planning Guide",
          url: "/resources/guides/privacy-planning",
          type: "guide"
        }
      ],
      tips: [
        "Set specific privacy goals",
        "Schedule regular reviews and updates",
        "Share your knowledge with family and friends"
      ]
    }
  ]
};

module.exports = challengeTasks;