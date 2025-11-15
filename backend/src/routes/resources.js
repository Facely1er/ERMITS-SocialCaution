const express = require('express');
// const { optionalAuth } = require('../middleware/auth'); // eslint-disable-line no-unused-vars
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/resources/guides
// @desc    Get privacy guides
// @access  Public
router.get('/guides', async (req, res) => {
  try {
    const { category, limit = 20, page = 1 } = req.query;

    // Mock data - in a real app, this would come from a database
    const guides = [
      {
        id: 'password-security-guide',
        title: 'Complete Password Security Guide',
        description: 'Learn how to create and manage secure passwords for all your accounts.',
        category: 'Account Security',
        difficulty: 'beginner',
        estimatedTime: '15 minutes',
        rating: 4.8,
        author: 'Privacy Team',
        publishedAt: '2024-01-15',
        tags: ['passwords', 'security', 'authentication'],
        content: 'This comprehensive guide covers everything you need to know about password security...',
        steps: [
          'Use a password manager',
          'Create strong, unique passwords',
          'Enable two-factor authentication',
          'Regularly update passwords'
        ],
        resources: [
          {
            title: 'Password Manager Comparison',
            url: 'https://example.com/password-managers',
            type: 'article'
          }
        ]
      },
      {
        id: 'social-media-privacy',
        title: 'Social Media Privacy Settings',
        description: 'Step-by-step guide to securing your social media accounts.',
        category: 'Privacy Configuration',
        difficulty: 'intermediate',
        estimatedTime: '30 minutes',
        rating: 4.6,
        author: 'Privacy Team',
        publishedAt: '2024-01-10',
        tags: ['social-media', 'privacy-settings', 'facebook', 'instagram'],
        content: 'Social media platforms collect vast amounts of personal data...',
        steps: [
          'Review privacy settings',
          'Limit data sharing',
          'Control audience settings',
          'Disable location tracking'
        ],
        resources: [
          {
            title: 'Facebook Privacy Checkup',
            url: 'https://www.facebook.com/privacy/checkup/',
            type: 'tool'
          }
        ]
      }
    ];

    // Filter by category if specified
    let filteredGuides = guides;
    if (category) {
      filteredGuides = guides.filter(guide => 
        guide.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedGuides = filteredGuides.slice(startIndex, endIndex);

    res.json({
      status: 'success',
      data: {
        guides: paginatedGuides,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(filteredGuides.length / parseInt(limit)),
          total: filteredGuides.length,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get guides error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching guides'
    });
  }
});

// @route   GET /api/resources/guides/:id
// @desc    Get specific guide
// @access  Public
router.get('/guides/:id', async (req, res) => {
  try {
    const { id } = req.params; // eslint-disable-line no-unused-vars

    // Mock data - in a real app, this would come from a database
    const guide = {
      id: 'password-security-guide',
      title: 'Complete Password Security Guide',
      description: 'Learn how to create and manage secure passwords for all your accounts.',
      category: 'Account Security',
      difficulty: 'beginner',
      estimatedTime: '15 minutes',
      rating: 4.8,
      author: 'Privacy Team',
      publishedAt: '2024-01-15',
      lastUpdated: '2024-01-20',
      tags: ['passwords', 'security', 'authentication'],
      content: `
        <h2>Why Password Security Matters</h2>
        <p>Passwords are your first line of defense against unauthorized access to your accounts. Weak passwords can be easily cracked by attackers, putting your personal information at risk.</p>
        
        <h3>Common Password Mistakes</h3>
        <ul>
          <li>Using the same password for multiple accounts</li>
          <li>Using personal information (birthday, name, etc.)</li>
          <li>Using simple patterns like "123456" or "password"</li>
          <li>Not changing passwords regularly</li>
        </ul>

        <h3>Creating Strong Passwords</h3>
        <p>A strong password should:</p>
        <ul>
          <li>Be at least 12 characters long</li>
          <li>Include uppercase and lowercase letters</li>
          <li>Include numbers and special characters</li>
          <li>Be unique for each account</li>
          <li>Not contain personal information</li>
        </ul>

        <h3>Using a Password Manager</h3>
        <p>Password managers are tools that help you create, store, and manage strong passwords securely. They can:</p>
        <ul>
          <li>Generate strong, unique passwords</li>
          <li>Store passwords encrypted</li>
          <li>Auto-fill passwords on websites</li>
          <li>Sync across all your devices</li>
        </ul>
      `,
      steps: [
        {
          title: 'Choose a Password Manager',
          description: 'Select a reputable password manager that fits your needs.',
          tips: ['Look for end-to-end encryption', 'Check for multi-device sync', 'Read user reviews']
        },
        {
          title: 'Create Master Password',
          description: 'Create a strong master password for your password manager.',
          tips: ['Use a passphrase instead of a password', 'Make it memorable but complex', 'Never share it with anyone']
        },
        {
          title: 'Import Existing Passwords',
          description: 'Import passwords from your browser or other password managers.',
          tips: ['Export passwords from your browser', 'Use the import feature in your password manager', 'Review and update weak passwords']
        },
        {
          title: 'Enable Two-Factor Authentication',
          description: 'Add an extra layer of security to your password manager.',
          tips: ['Use an authenticator app', 'Keep backup codes safe', 'Test the setup']
        }
      ],
      resources: [
        {
          title: 'Password Manager Comparison',
          url: 'https://example.com/password-managers',
          type: 'article',
          description: 'Detailed comparison of popular password managers'
        },
        {
          title: 'Two-Factor Authentication Guide',
          url: 'https://example.com/2fa-guide',
          type: 'guide',
          description: 'Learn how to set up 2FA for your accounts'
        }
      ]
    };

    res.json({
      status: 'success',
      data: {
        guide
      }
    });

  } catch (error) {
    logger.error('Get guide error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching guide'
    });
  }
});

// @route   GET /api/resources/checklists
// @desc    Get privacy checklists
// @access  Public
router.get('/checklists', async (req, res) => {
  try {
    const { category, limit = 20, page = 1 } = req.query;

    // Mock data
    const checklists = [
      {
        id: 'social-media-security-checklist',
        title: 'Social Media Security Checklist',
        description: 'Complete checklist for securing your social media accounts.',
        category: 'Social Media',
        difficulty: 'beginner',
        estimatedTime: '20 minutes',
        rating: 4.7,
        author: 'Privacy Team',
        publishedAt: '2024-01-12',
        tags: ['social-media', 'security', 'checklist'],
        items: [
          {
            id: '1',
            title: 'Enable two-factor authentication',
            description: 'Add an extra layer of security to your accounts',
            category: 'Account Security',
            priority: 'high',
            completed: false
          },
          {
            id: '2',
            title: 'Review privacy settings',
            description: 'Check and update your privacy preferences',
            category: 'Privacy Settings',
            priority: 'high',
            completed: false
          },
          {
            id: '3',
            title: 'Remove personal information',
            description: 'Delete or hide sensitive personal details',
            category: 'Data Minimization',
            priority: 'medium',
            completed: false
          }
        ]
      }
    ];

    // Filter and paginate
    let filteredChecklists = checklists;
    if (category) {
      filteredChecklists = checklists.filter(checklist => 
        checklist.category.toLowerCase() === category.toLowerCase()
      );
    }

    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedChecklists = filteredChecklists.slice(startIndex, endIndex);

    res.json({
      status: 'success',
      data: {
        checklists: paginatedChecklists,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(filteredChecklists.length / parseInt(limit)),
          total: filteredChecklists.length,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get checklists error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching checklists'
    });
  }
});

// @route   GET /api/resources/tools
// @desc    Get privacy tools
// @access  Public
router.get('/tools', async (req, res) => {
  try {
    const { category, limit = 20, page = 1 } = req.query;

    // Mock data
    const tools = [
      {
        id: 'password-generator',
        title: 'Password Generator',
        description: 'Generate strong, secure passwords for your accounts.',
        category: 'Password Security',
        type: 'generator',
        difficulty: 'beginner',
        estimatedTime: '5 minutes',
        rating: 4.9,
        author: 'Privacy Team',
        publishedAt: '2024-01-08',
        tags: ['passwords', 'generator', 'security'],
        features: [
          'Customizable length',
          'Character type selection',
          'Exclude similar characters',
          'Copy to clipboard'
        ],
        url: '/tools/password-generator'
      },
      {
        id: 'privacy-settings-checker',
        title: 'Privacy Settings Checker',
        description: 'Check and optimize your social media privacy settings.',
        category: 'Privacy Configuration',
        type: 'checker',
        difficulty: 'intermediate',
        estimatedTime: '15 minutes',
        rating: 4.6,
        author: 'Privacy Team',
        publishedAt: '2024-01-05',
        tags: ['privacy-settings', 'social-media', 'checker'],
        features: [
          'Multi-platform support',
          'Step-by-step guidance',
          'Settings backup',
          'Progress tracking'
        ],
        url: '/tools/privacy-settings-checker'
      }
    ];

    // Filter and paginate
    let filteredTools = tools;
    if (category) {
      filteredTools = tools.filter(tool => 
        tool.category.toLowerCase() === category.toLowerCase()
      );
    }

    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedTools = filteredTools.slice(startIndex, endIndex);

    res.json({
      status: 'success',
      data: {
        tools: paginatedTools,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(filteredTools.length / parseInt(limit)),
          total: filteredTools.length,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get tools error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching tools'
    });
  }
});

module.exports = router;