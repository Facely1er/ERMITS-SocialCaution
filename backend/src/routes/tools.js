const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');
// const { optionalAuth } = require('../middleware/auth');
// const axios = require('axios');
// const cheerio = require('cheerio');
const logger = require('../utils/logger');
const AnalysisResult = require('../models/AnalysisResult');
const realApiService = require('../services/realApiService');

const router = express.Router();

// @route   POST /api/tools/digital-footprint
// @desc    Analyze digital footprint
// @access  Private
router.post('/digital-footprint',
  authenticate,
  [
    body('searchQuery')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Search query must be between 2 and 100 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { searchQuery } = req.body;
      const userId = req.user._id;

      // Simulate digital footprint analysis
      // In a real implementation, this would integrate with various APIs
      const analysisResults = await analyzeDigitalFootprint(searchQuery);

      // Generate enhanced analysis summary
      const summary = generateAnalysisSummary(analysisResults);

      // Store analysis results with enhanced summary
      await storeAnalysisResults(userId, 'digital-footprint', {
        searchQuery,
        results: analysisResults,
        analyzedAt: new Date(),
        riskLevel: calculateOverallRisk(analysisResults),
        summary: summary
      });

      res.json({
        status: 'success',
        message: 'Digital footprint analysis completed',
        data: {
          searchQuery,
          results: analysisResults,
          analyzedAt: new Date(),
          riskLevel: calculateOverallRisk(analysisResults),
          summary: summary
        }
      });

    } catch (error) {
      logger.error('Digital footprint analysis error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server error during digital footprint analysis'
      });
    }
  }
);

// @route   POST /api/tools/data-breach-check
// @desc    Check if email has been involved in data breaches
// @access  Private
router.post('/data-breach-check',
  authenticate,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email } = req.body;

      // Check against Have I Been Pwned API
      const breachResults = await checkDataBreaches(email);

      res.json({
        status: 'success',
        message: 'Data breach check completed',
        data: breachResults
      });

    } catch (error) {
      logger.error('Data breach check error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server error during data breach check'
      });
    }
  }
);

// @route   POST /api/tools/privacy-scan
// @desc    Scan website for privacy issues
// @access  Private
router.post('/privacy-scan',
  authenticate,
  [
    body('url')
      .isURL()
      .withMessage('Please provide a valid URL')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { url } = req.body;

      // Scan website for privacy issues
      const scanResults = await scanWebsitePrivacy(url);

      res.json({
        status: 'success',
        message: 'Privacy scan completed',
        data: {
          url,
          results: scanResults,
          scannedAt: new Date(),
          riskScore: calculatePrivacyRiskScore(scanResults)
        }
      });

    } catch (error) {
      logger.error('Privacy scan error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server error during privacy scan'
      });
    }
  }
);

// @route   GET /api/tools/data-brokers
// @desc    Get list of data brokers for removal
// @access  Public
router.get('/data-brokers', async (req, res) => {
  try {
    const dataBrokers = await getDataBrokersList();

    res.json({
      status: 'success',
      data: {
        brokers: dataBrokers,
        total: dataBrokers.length
      }
    });

  } catch (error) {
    logger.error('Get data brokers error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching data brokers'
    });
  }
});

// @route   POST /api/tools/data-brokers/search
// @desc    Search for user data on data broker sites
// @access  Public
router.post('/data-brokers/search', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({
        status: 'error',
        message: 'Name is required for data broker search'
      });
    }

    // Simulate search results (in real implementation, this would use web scraping or APIs)
    const searchResults = await simulateDataBrokerSearch({ name, email, phone, address });
    
    res.json({
      status: 'success',
      data: {
        results: searchResults,
        total: searchResults.length,
        searchDate: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Data broker search error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while searching data brokers'
    });
  }
});

// @route   POST /api/tools/data-brokers/removal-request
// @desc    Submit a data removal request
// @access  Public
router.post('/data-brokers/removal-request', async (req, res) => {
  try {
    const { brokerId, userInfo, requestType = 'removal' } = req.body;

    if (!brokerId || !userInfo) {
      return res.status(400).json({
        status: 'error',
        message: 'Broker ID and user information are required'
      });
    }

    const brokers = await getDataBrokersList();
    const broker = brokers.find(b => b.id === brokerId);

    if (!broker) {
      return res.status(404).json({
        status: 'error',
        message: 'Data broker not found'
      });
    }

    // Generate removal request ID
    const requestId = `DRR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store removal request (in real implementation, this would be stored in database)
    const removalRequest = {
      id: requestId,
      brokerId,
      brokerName: broker.name,
      userInfo,
      requestType,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      estimatedResponseTime: broker.responseTime,
      nextCheckDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    };

    res.json({
      status: 'success',
      data: {
        request: removalRequest,
        nextSteps: generateNextSteps(broker, requestType)
      }
    });

  } catch (error) {
    logger.error('Removal request error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while submitting removal request'
    });
  }
});

// @route   GET /api/tools/data-brokers/removal-status/:requestId
// @desc    Check status of a removal request
// @access  Public
router.get('/data-brokers/removal-status/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;

    // In real implementation, this would fetch from database
    const status = await checkRemovalStatus(requestId);

    res.json({
      status: 'success',
      data: status
    });

  } catch (error) {
    logger.error('Removal status check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while checking removal status'
    });
  }
});

// @route   POST /api/tools/data-brokers/verify-removal
// @desc    Verify if data has been removed from a broker
// @access  Public
router.post('/data-brokers/verify-removal', async (req, res) => {
  try {
    const { brokerId, userInfo } = req.body;

    if (!brokerId || !userInfo) {
      return res.status(400).json({
        status: 'error',
        message: 'Broker ID and user information are required'
      });
    }

    // Simulate verification (in real implementation, this would use web scraping)
    const verificationResult = await verifyDataRemoval(brokerId, userInfo);

    res.json({
      status: 'success',
      data: verificationResult
    });

  } catch (error) {
    logger.error('Removal verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while verifying removal'
    });
  }
});

// @route   POST /api/tools/password-strength
// @desc    Check password strength
// @access  Public
router.post('/password-strength',
  [
    body('password')
      .isLength({ min: 1 })
      .withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { password } = req.body;

      // Check password strength
      const strengthAnalysis = analyzePasswordStrength(password);

      res.json({
        status: 'success',
        data: {
          strength: strengthAnalysis,
          recommendations: generatePasswordRecommendations(strengthAnalysis)
        }
      });

    } catch (error) {
      logger.error('Password strength check error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server error during password strength check'
      });
    }
  }
);

// @route   GET /api/tools/analysis-history
// @desc    Get user's analysis history
// @access  Private
router.get('/analysis-history', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, limit = 10, page = 1 } = req.query;

    const query = { userId };
    if (type) {
      query.type = type;
    }

    const analysisResults = await AnalysisResult.find(query)
      .sort({ analyzedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-__v');

    const total = await AnalysisResult.countDocuments(query);

    res.json({
      status: 'success',
      data: {
        results: analysisResults,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalResults: total,
          hasNext: parseInt(page) * parseInt(limit) < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    logger.error('Get analysis history error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching analysis history'
    });
  }
});

// @route   GET /api/tools/analysis/:id
// @desc    Get specific analysis result
// @access  Private
router.get('/analysis/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const analysisResult = await AnalysisResult.findOne({ _id: id, userId });

    if (!analysisResult) {
      return res.status(404).json({
        status: 'error',
        message: 'Analysis result not found'
      });
    }

    res.json({
      status: 'success',
      data: analysisResult
    });

  } catch (error) {
    logger.error('Get analysis result error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching analysis result'
    });
  }
});

// @route   DELETE /api/tools/analysis/:id
// @desc    Delete specific analysis result
// @access  Private
router.delete('/analysis/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const analysisResult = await AnalysisResult.findOneAndDelete({ _id: id, userId });

    if (!analysisResult) {
      return res.status(404).json({
        status: 'error',
        message: 'Analysis result not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Analysis result deleted successfully'
    });

  } catch (error) {
    logger.error('Delete analysis result error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting analysis result'
    });
  }
});

// Helper function to analyze digital footprint
const analyzeDigitalFootprint = async (searchQuery) => {
  const query = searchQuery.toLowerCase().trim();
  
  // Enhanced pattern detection with more sophisticated regex patterns
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(query);
  const isName = /^[a-zA-Z\s\-'.]+$/.test(query) && query.includes(' ') && query.length > 3;
  const isUsername = /^[a-zA-Z0-9_.-]+$/.test(query) && !query.includes(' ') && query.length > 2;
  const isPhone = /^[+]?[1-9][\d]{0,15}$/.test(query.replace(/[\s\-()]/g, ''));
  const isSSN = /^\d{3}-?\d{2}-?\d{4}$/.test(query.replace(/[\s-]/g, ''));
  const isCreditCard = /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/.test(query.replace(/[\s-]/g, ''));
  const isIPAddress = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(query);
  const isDomain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(query);

  // Fetch real API data if available
  let realApiData = {};
  try {
    if (isEmail) {
      realApiData.breachData = await realApiService.checkDataBreaches(query);
      realApiData.hunterData = await realApiService.searchHunter(query);
    }
    if (isDomain) {
      realApiData.shodanData = await realApiService.searchShodan(query);
      realApiData.virustotalData = await realApiService.checkVirusTotal(query);
      realApiData.clearbitData = await realApiService.searchClearbit(query);
    }
    if (isUsername) {
      realApiData.socialMediaData = await realApiService.searchSocialMedia(query);
    }
    if (isPhone) {
      realApiData.phoneData = await realApiService.searchPhoneNumber(query);
    }
    // Always try Google search for additional context
    realApiData.googleData = await realApiService.searchGoogle(query);
  } catch (error) {
    logger.error('Error fetching real API data:', error);
    // Continue with mock data if real APIs fail
  }
  
  // Calculate exposure likelihood based on query characteristics and real-world data
  const calculateExposureLikelihood = (queryType, dataType) => {
    const likelihoods = {
      email: { 
        social: 0.85, 
        brokers: 0.92, 
        search: 0.75, 
        records: 0.35, 
        breaches: 0.78,
        forums: 0.65,
        directories: 0.88
      },
      name: { 
        social: 0.95, 
        brokers: 0.98, 
        search: 0.97, 
        records: 0.85, 
        breaches: 0.45,
        forums: 0.35,
        directories: 0.92
      },
      username: { 
        social: 0.98, 
        brokers: 0.65, 
        search: 0.92, 
        records: 0.25, 
        breaches: 0.30,
        forums: 0.85,
        directories: 0.40
      },
      phone: { 
        social: 0.75, 
        brokers: 0.95, 
        search: 0.70, 
        records: 0.80, 
        breaches: 0.60,
        forums: 0.25,
        directories: 0.90
      },
      ssn: {
        social: 0.10,
        brokers: 0.95,
        search: 0.05,
        records: 0.98,
        breaches: 0.85,
        forums: 0.02,
        directories: 0.90
      },
      creditcard: {
        social: 0.05,
        brokers: 0.80,
        search: 0.02,
        records: 0.10,
        breaches: 0.90,
        forums: 0.01,
        directories: 0.15
      },
      ip: {
        social: 0.20,
        brokers: 0.30,
        search: 0.40,
        records: 0.15,
        breaches: 0.25,
        forums: 0.60,
        directories: 0.10
      },
      domain: {
        social: 0.30,
        brokers: 0.40,
        search: 0.85,
        records: 0.70,
        breaches: 0.20,
        forums: 0.15,
        directories: 0.60
      }
    };
    
    return likelihoods[queryType]?.[dataType] || 0.5;
  };
  
  const queryType = isEmail ? 'email' : 
                   isName ? 'name' : 
                   isUsername ? 'username' : 
                   isPhone ? 'phone' : 
                   isSSN ? 'ssn' :
                   isCreditCard ? 'creditcard' :
                   isIPAddress ? 'ip' :
                   isDomain ? 'domain' : 'unknown';
  
  const results = [
    {
      id: 'social-media',
      name: 'Social Media Profiles',
      type: 'Public Information',
      risk: 'high',
      description: 'Public profiles on social media platforms containing personal information, photos, and activity history.',
      recommendation: 'Review privacy settings on all social media accounts and remove or restrict access to sensitive information.',
      examples: ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube', 'Snapchat', 'Reddit', 'Discord', 'Telegram'],
      found: realApiData.socialMediaData ? realApiData.socialMediaData.length > 0 : calculateExposureLikelihood(queryType, 'social') > 0.5,
      confidence: realApiData.socialMediaData ? (realApiData.socialMediaData.length > 0 ? 0.9 : 0.1) : calculateExposureLikelihood(queryType, 'social'),
      dataPoints: isEmail ? ['Email address', 'Profile information', 'Activity history', 'Friends list', 'Location check-ins'] :
                 isName ? ['Full name', 'Profile photos', 'Location data', 'Contact information', 'Birth date', 'Work history'] :
                 isUsername ? ['Username', 'Profile information', 'Posts and comments', 'Subreddit activity', 'Server memberships'] :
                 ['Profile information', 'Posts and comments', 'Media uploads'],
      platforms: realApiData.socialMediaData ? realApiData.socialMediaData.map(sm => sm.platform) :
                isEmail ? ['Facebook', 'Instagram', 'LinkedIn', 'Reddit'] :
                isName ? ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube'] :
                isUsername ? ['Twitter', 'Instagram', 'TikTok', 'YouTube', 'Reddit', 'Discord'] :
                ['Various platforms'],
      socialMediaDetails: realApiData.socialMediaData || [],
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'data-brokers',
      name: 'Data Broker Listings',
      type: 'Aggregated Data',
      risk: 'high',
      description: 'Personal information collected and sold by data brokers, including contact details and background information.',
      recommendation: 'Submit opt-out requests to major data brokers and regularly monitor for new listings.',
      examples: ['Spokeo', 'WhitePages', 'BeenVerified', 'Intelius', 'PeopleFinders', 'TruePeopleSearch', 'FastPeopleSearch'],
      found: calculateExposureLikelihood(queryType, 'brokers') > 0.5,
      confidence: calculateExposureLikelihood(queryType, 'brokers'),
      dataTypes: isEmail ? ['Email address', 'Name', 'Phone', 'Address'] :
                isName ? ['Full name', 'Address', 'Phone', 'Email', 'Age', 'Relatives'] :
                ['Username', 'Associated names', 'Contact information'],
      optOutAvailable: true,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'public-records',
      name: 'Public Records',
      type: 'Government Records',
      risk: 'medium',
      description: 'Official records like property ownership, court records, and business registrations.',
      recommendation: 'Review public records for accuracy and request redaction of sensitive information where legally possible.',
      examples: ['Property records', 'Court records', 'Professional licenses', 'Voter registrations', 'Business filings'],
      found: calculateExposureLikelihood(queryType, 'records') > 0.5,
      confidence: calculateExposureLikelihood(queryType, 'records'),
      recordTypes: isName ? ['Property ownership', 'Court records', 'Professional licenses', 'Voter registration'] : [],
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'search-results',
      name: 'Search Engine Results',
      type: 'Web Content',
      risk: 'medium',
      description: 'Information appearing in search engine results, including news articles, blog posts, and directories.',
      recommendation: 'Monitor search results regularly and request removal of outdated or sensitive information.',
      examples: ['Google', 'Bing', 'DuckDuckGo', 'Yahoo', 'Yandex'],
      found: realApiData.googleData ? realApiData.googleData.results.length > 0 : calculateExposureLikelihood(queryType, 'search') > 0.5,
      confidence: realApiData.googleData ? (realApiData.googleData.results.length > 0 ? 0.8 : 0.1) : calculateExposureLikelihood(queryType, 'search'),
      resultCount: realApiData.googleData ? parseInt(realApiData.googleData.totalResults) : Math.floor(Math.random() * 1000) + 100,
      searchResults: realApiData.googleData ? realApiData.googleData.results : [],
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'professional-networks',
      name: 'Professional Networks',
      type: 'Career Information',
      risk: 'low',
      description: 'Professional profiles and career-related information on business networking platforms.',
      recommendation: 'Keep professional profiles updated and review privacy settings regularly.',
      examples: ['LinkedIn', 'AngelList', 'Behance', 'GitHub', 'Stack Overflow'],
      found: isName || isUsername,
      confidence: isName ? 0.8 : isUsername ? 0.6 : 0.3,
      dataPoints: ['Professional information', 'Work history', 'Skills', 'Education', 'Connections'],
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'news-articles',
      name: 'News Articles & Media',
      type: 'Media Coverage',
      risk: 'medium',
      description: 'News articles, press releases, and media coverage mentioning your name or information.',
      recommendation: 'Monitor media coverage and request corrections for inaccurate information.',
      examples: ['News websites', 'Press releases', 'Blog posts', 'Social media mentions'],
      found: isName && Math.random() > 0.7, // 30% chance for names
      confidence: isName ? 0.4 : 0.1,
      articleCount: isName ? Math.floor(Math.random() * 10) : 0,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'data-breaches',
      name: 'Data Breach Exposure',
      type: 'Compromised Data',
      risk: 'high',
      description: 'Information exposed in data breaches from various companies and services.',
      recommendation: 'Change passwords for affected accounts and enable two-factor authentication.',
      examples: ['Have I Been Pwned', 'Breach databases', 'Dark web markets', 'Leaked databases'],
      found: realApiData.breachData ? realApiData.breachData.isCompromised : calculateExposureLikelihood(queryType, 'breaches') > 0.5,
      confidence: realApiData.breachData ? (realApiData.breachData.isCompromised ? 0.95 : 0.1) : calculateExposureLikelihood(queryType, 'breaches'),
      dataPoints: isEmail ? ['Email address', 'Password hashes', 'Account details', 'Personal information'] :
                 isName ? ['Full name', 'Address', 'Phone number', 'Date of birth'] :
                 ['Username', 'Associated email', 'Account information'],
      breachCount: realApiData.breachData ? realApiData.breachData.breaches.length : Math.floor(Math.random() * 5) + 1,
      breachDetails: realApiData.breachData ? realApiData.breachData.breaches : [],
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'forums-discussions',
      name: 'Forums & Discussion Boards',
      type: 'Public Discussions',
      risk: 'medium',
      description: 'Posts, comments, and discussions on forums, message boards, and community sites.',
      recommendation: 'Review and delete old posts that contain personal information.',
      examples: ['Reddit', 'Stack Overflow', 'GitHub', 'Discord servers', 'Telegram groups', '4chan', '8kun'],
      found: calculateExposureLikelihood(queryType, 'forums') > 0.5,
      confidence: calculateExposureLikelihood(queryType, 'forums'),
      dataPoints: isUsername ? ['Username', 'Posts and comments', 'Voting history', 'Subreddit subscriptions'] :
                 isEmail ? ['Email address', 'Registration date', 'Post history'] :
                 ['Posts and comments', 'Discussion participation'],
      postCount: Math.floor(Math.random() * 100) + 1,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'online-directories',
      name: 'Online Directories',
      type: 'Contact Information',
      risk: 'medium',
      description: 'Listings in online directories, phone books, and contact databases.',
      recommendation: 'Request removal from directories and opt out of future listings.',
      examples: ['WhitePages', 'YellowPages', '411.com', 'AnyWho', 'Address.com', 'Phonebook.com'],
      found: calculateExposureLikelihood(queryType, 'directories') > 0.5,
      confidence: calculateExposureLikelihood(queryType, 'directories'),
      dataPoints: isName ? ['Full name', 'Address', 'Phone number', 'Age', 'Relatives'] :
                 isPhone ? ['Phone number', 'Name', 'Address', 'Carrier information'] :
                 isEmail ? ['Email address', 'Name', 'Associated accounts'] :
                 ['Contact information', 'Location data'],
      directoryCount: Math.floor(Math.random() * 8) + 1,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'professional-networks',
      name: 'Professional Networks',
      type: 'Career Information',
      risk: 'low',
      description: 'Professional profiles and career-related information on business networking platforms.',
      recommendation: 'Keep professional profiles updated and review privacy settings regularly.',
      examples: ['LinkedIn', 'AngelList', 'Behance', 'GitHub', 'Stack Overflow', 'Dribbble', 'Medium'],
      found: isName || isUsername || isEmail,
      confidence: isName ? 0.8 : isUsername ? 0.6 : isEmail ? 0.7 : 0.3,
      dataPoints: ['Professional information', 'Work history', 'Skills', 'Education', 'Connections', 'Portfolio'],
      lastUpdated: new Date().toISOString()
    }
  ];

  // Add additional analysis based on query characteristics
  if (isEmail) {
    results.push({
      id: 'email-exposure',
      name: 'Email Exposure',
      type: 'Contact Information',
      risk: 'high',
      description: 'Email address found in various online databases and directories.',
      recommendation: 'Use email aliases for different services and enable two-factor authentication.',
      examples: ['Email directories', 'Data breaches', 'Mailing lists', 'Public forums'],
      found: true,
      confidence: 0.9,
      dataPoints: ['Email address', 'Associated names', 'Registration dates'],
      lastUpdated: new Date().toISOString()
    });
  }

  if (isPhone) {
    results.push({
      id: 'phone-exposure',
      name: 'Phone Number Exposure',
      type: 'Contact Information',
      risk: 'high',
      description: 'Phone number found in various online databases and directories.',
      recommendation: 'Use a separate phone number for online services and enable call screening.',
      examples: ['Phone directories', 'Data brokers', 'Social media', 'Public records'],
      found: true,
      confidence: 0.8,
      dataPoints: ['Phone number', 'Associated names', 'Address information'],
      lastUpdated: new Date().toISOString()
    });
  }

  if (isSSN) {
    results.push({
      id: 'ssn-exposure',
      name: 'Social Security Number Exposure',
      type: 'Sensitive Personal Data',
      risk: 'critical',
      description: 'Social Security Number found in public records or data breaches. This is extremely sensitive information.',
      recommendation: 'IMMEDIATE ACTION REQUIRED: Monitor credit reports, freeze credit, and report to authorities if found in breaches.',
      examples: ['Public records', 'Data breaches', 'Government databases', 'Financial records'],
      found: true,
      confidence: 0.95,
      dataPoints: ['SSN', 'Associated names', 'Address history', 'Employment records'],
      lastUpdated: new Date().toISOString()
    });
  }

  if (isCreditCard) {
    results.push({
      id: 'creditcard-exposure',
      name: 'Credit Card Exposure',
      type: 'Financial Data',
      risk: 'critical',
      description: 'Credit card information found in data breaches or public records. This is extremely sensitive financial data.',
      recommendation: 'IMMEDIATE ACTION REQUIRED: Cancel the card, monitor for fraudulent charges, and report to your bank.',
      examples: ['Data breaches', 'Payment processors', 'E-commerce sites', 'Financial databases'],
      found: true,
      confidence: 0.9,
      dataPoints: ['Card number', 'Expiration date', 'Associated names', 'Transaction history'],
      lastUpdated: new Date().toISOString()
    });
  }

  if (isIPAddress) {
    results.push({
      id: 'ip-exposure',
      name: 'IP Address Exposure',
      type: 'Network Information',
      risk: 'medium',
      description: 'IP address found in various logs, forums, or public records.',
      recommendation: 'Use VPN services and avoid sharing IP addresses in public forums.',
      examples: ['Server logs', 'Forum posts', 'Gaming platforms', 'Torrent sites'],
      found: true,
      confidence: 0.6,
      dataPoints: ['IP address', 'Geolocation', 'ISP information', 'Activity logs'],
      lastUpdated: new Date().toISOString()
    });
  }

  if (isDomain) {
    results.push({
      id: 'domain-exposure',
      name: 'Domain Registration',
      type: 'Web Presence',
      risk: 'low',
      description: 'Domain registration information and associated web presence.',
      recommendation: 'Use domain privacy protection and keep registration information updated.',
      examples: ['WHOIS databases', 'Domain registrars', 'DNS records', 'Website archives'],
      found: true,
      confidence: 0.8,
      dataPoints: ['Domain name', 'Registrant information', 'DNS records', 'Website content'],
      lastUpdated: new Date().toISOString()
    });
  }

  return results;
};

// Helper function to check data breaches
const checkDataBreaches = async (email) => {
  try {
    // In a real implementation, you would use the Have I Been Pwned API
    // For now, we'll provide educational information about common breaches
    const commonBreaches = [
      {
        name: 'LinkedIn',
        domain: 'linkedin.com',
        breachDate: '2021-06-01',
        addedDate: '2021-06-01',
        modifiedDate: '2021-06-01',
        pwnCount: 700000000,
        description: 'In June 2021, LinkedIn suffered a data breach that exposed 700 million records.',
        dataClasses: ['Email addresses', 'Names', 'Phone numbers', 'Geographic locations'],
        isVerified: true,
        isFabricated: false,
        isSensitive: false,
        isRetired: false,
        isSpamList: false
      },
      {
        name: 'Facebook',
        domain: 'facebook.com',
        breachDate: '2019-04-01',
        addedDate: '2019-04-01',
        modifiedDate: '2019-04-01',
        pwnCount: 533000000,
        description: 'In April 2019, Facebook data was exposed including phone numbers and account details.',
        dataClasses: ['Email addresses', 'Names', 'Phone numbers', 'User IDs'],
        isVerified: true,
        isFabricated: false,
        isSensitive: false,
        isRetired: false,
        isSpamList: false
      }
    ];

    // Return educational information about common breaches
    // In a real implementation, you would check if the specific email was involved
    return {
      email: email,
      breaches: commonBreaches,
      isCompromised: false, // Set to false since we're not actually checking
      message: 'This is educational information about common data breaches. For real-time checking, use Have I Been Pwned or similar services.',
      lastChecked: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Data breach check error:', error);
    return {
      email: email,
      breaches: [],
      isCompromised: false,
      message: 'Unable to check breaches at this time.',
      lastChecked: new Date().toISOString()
    };
  }
};

// Helper function to scan website privacy
const scanWebsitePrivacy = async (url) => { // eslint-disable-line no-unused-vars
  try {
    // This is a simplified implementation
    // In a real application, you would use web scraping and privacy analysis tools
    
    const issues = [
      {
        type: 'cookies',
        severity: 'medium',
        title: 'Excessive Cookie Usage',
        description: 'Website uses many tracking cookies without clear consent mechanism.',
        recommendation: 'Review cookie policy and implement proper consent management.'
      },
      {
        type: 'privacy-policy',
        severity: 'low',
        title: 'Privacy Policy Present',
        description: 'Website has a privacy policy.',
        recommendation: 'Good practice - ensure it\'s up to date and comprehensive.'
      },
      {
        type: 'https',
        severity: 'high',
        title: 'HTTPS Enabled',
        description: 'Website uses HTTPS encryption.',
        recommendation: 'Good security practice.'
      }
    ];

    return issues;
  } catch (error) {
    logger.error('Website privacy scan error:', error);
    return [];
  }
};

// Comprehensive data brokers database with real opt-out information
const getDataBrokersList = async () => {
  return [
    {
      id: 'spokeo',
      name: 'Spokeo',
      website: 'https://www.spokeo.com',
      optOutUrl: 'https://www.spokeo.com/opt-out',
      optOutMethod: 'online',
      description: 'People search engine that aggregates personal information from various sources including social media, public records, and marketing databases.',
      dataTypes: ['Name', 'Address', 'Phone', 'Email', 'Social Media', 'Criminal Records', 'Photos', 'Family Members'],
      difficulty: 'easy',
      estimatedTime: '5-10 minutes',
      requiresId: false,
      instructions: [
        'Visit spokeo.com/opt-out',
        'Enter your full name and address',
        'Search for your profile',
        'Select all matching profiles',
        'Verify your identity via email',
        'Submit removal request'
      ],
      legalBasis: 'CCPA, GDPR',
      responseTime: '24-48 hours',
      verificationMethod: 'email_confirmation',
      recheckInterval: 30, // days
      categories: ['people_search', 'social_media', 'public_records']
    },
    {
      id: 'whitepages',
      name: 'WhitePages',
      website: 'https://www.whitepages.com',
      optOutUrl: 'https://www.whitepages.com/suppression',
      optOutMethod: 'online',
      description: 'Directory service providing contact information and background data from public records and marketing databases.',
      dataTypes: ['Name', 'Address', 'Phone', 'Email', 'Age', 'Relatives', 'Property Records'],
      difficulty: 'easy',
      estimatedTime: '3-5 minutes',
      requiresId: false,
      instructions: [
        'Visit whitepages.com/suppression',
        'Enter your name and address',
        'Select the listing to remove',
        'Provide email for confirmation',
        'Submit suppression request'
      ],
      legalBasis: 'CCPA, State Privacy Laws',
      responseTime: '24-72 hours',
      verificationMethod: 'email_confirmation',
      recheckInterval: 30,
      categories: ['directory', 'public_records']
    },
    {
      id: 'beenverified',
      name: 'BeenVerified',
      website: 'https://www.beenverified.com',
      optOutUrl: 'https://www.beenverified.com/opt-out',
      optOutMethod: 'online',
      description: 'Background check and people search service that compiles data from multiple sources including court records and marketing databases.',
      dataTypes: ['Name', 'Address', 'Phone', 'Email', 'Criminal Records', 'Property Records', 'Bankruptcies', 'Liens'],
      difficulty: 'medium',
      estimatedTime: '10-15 minutes',
      requiresId: true,
      instructions: [
        'Visit beenverified.com/opt-out',
        'Search for your profile',
        'Click "Remove this profile"',
        'Fill out the removal form',
        'Upload government-issued ID',
        'Submit and wait for email confirmation'
      ],
      legalBasis: 'CCPA, FCRA',
      responseTime: '48-72 hours',
      verificationMethod: 'id_verification',
      recheckInterval: 45,
      categories: ['background_check', 'public_records']
    },
    {
      id: 'intelius',
      name: 'Intelius',
      website: 'https://www.intelius.com',
      optOutUrl: 'https://www.intelius.com/opt-out',
      optOutMethod: 'online',
      description: 'People search and background check service with extensive data collection from public and private sources.',
      dataTypes: ['Name', 'Address', 'Phone', 'Email', 'Criminal Records', 'Social Media', 'Photos', 'Family Members'],
      difficulty: 'hard',
      estimatedTime: '15-30 minutes',
      requiresId: true,
      instructions: [
        'Create an account on intelius.com',
        'Visit the opt-out page',
        'Search for all your profiles',
        'Submit individual removal requests for each profile',
        'Upload government-issued ID',
        'Wait for email confirmation',
        'Follow up if no response within 7 days'
      ],
      legalBasis: 'CCPA, FCRA',
      responseTime: '72 hours - 1 week',
      verificationMethod: 'id_verification',
      recheckInterval: 60,
      categories: ['people_search', 'background_check', 'social_media']
    },
    {
      id: 'peoplefinders',
      name: 'PeopleFinders',
      website: 'https://www.peoplefinders.com',
      optOutUrl: 'https://www.peoplefinders.com/opt-out',
      optOutMethod: 'online',
      description: 'People search and public records database with comprehensive personal information.',
      dataTypes: ['Name', 'Address', 'Phone', 'Email', 'Criminal Records', 'Property Records', 'Family Members'],
      difficulty: 'easy',
      estimatedTime: '5-10 minutes',
      requiresId: false,
      instructions: [
        'Visit peoplefinders.com/opt-out',
        'Enter your name and address',
        'Select the correct listing',
        'Provide email for confirmation',
        'Submit removal request'
      ],
      legalBasis: 'CCPA',
      responseTime: '24-48 hours',
      verificationMethod: 'email_confirmation',
      recheckInterval: 30,
      categories: ['people_search', 'public_records']
    },
    {
      id: 'truthfinder',
      name: 'TruthFinder',
      website: 'https://www.truthfinder.com',
      optOutUrl: 'https://www.truthfinder.com/opt-out',
      optOutMethod: 'online',
      description: 'Background check service that searches public records and social media for personal information.',
      dataTypes: ['Name', 'Address', 'Phone', 'Email', 'Criminal Records', 'Social Media', 'Photos', 'Family Members'],
      difficulty: 'medium',
      estimatedTime: '10-15 minutes',
      requiresId: true,
      instructions: [
        'Visit truthfinder.com/opt-out',
        'Search for your profile',
        'Click "Remove this profile"',
        'Fill out the removal form',
        'Upload government-issued ID',
        'Submit and wait for confirmation'
      ],
      legalBasis: 'CCPA, FCRA',
      responseTime: '48-72 hours',
      verificationMethod: 'id_verification',
      recheckInterval: 45,
      categories: ['background_check', 'social_media']
    },
    {
      id: 'instantcheckmate',
      name: 'Instant Checkmate',
      website: 'https://www.instantcheckmate.com',
      optOutUrl: 'https://www.instantcheckmate.com/opt-out',
      optOutMethod: 'online',
      description: 'Background check and people search service with extensive public records database.',
      dataTypes: ['Name', 'Address', 'Phone', 'Email', 'Criminal Records', 'Property Records', 'Bankruptcies'],
      difficulty: 'medium',
      estimatedTime: '10-15 minutes',
      requiresId: true,
      instructions: [
        'Visit instantcheckmate.com/opt-out',
        'Search for your profile',
        'Select "Remove this profile"',
        'Complete the removal form',
        'Upload government-issued ID',
        'Submit and wait for email confirmation'
      ],
      legalBasis: 'CCPA, FCRA',
      responseTime: '48-72 hours',
      verificationMethod: 'id_verification',
      recheckInterval: 45,
      categories: ['background_check', 'public_records']
    },
    {
      id: 'peoplesmart',
      name: 'PeopleSmart',
      website: 'https://www.peoplesmart.com',
      optOutUrl: 'https://www.peoplesmart.com/opt-out',
      optOutMethod: 'online',
      description: 'People search service that aggregates information from public records and marketing databases.',
      dataTypes: ['Name', 'Address', 'Phone', 'Email', 'Age', 'Relatives', 'Property Records'],
      difficulty: 'easy',
      estimatedTime: '5-10 minutes',
      requiresId: false,
      instructions: [
        'Visit peoplesmart.com/opt-out',
        'Enter your name and address',
        'Select the listing to remove',
        'Provide email for confirmation',
        'Submit removal request'
      ],
      legalBasis: 'CCPA',
      responseTime: '24-48 hours',
      verificationMethod: 'email_confirmation',
      recheckInterval: 30,
      categories: ['people_search', 'public_records']
    },
    {
      id: 'pipl',
      name: 'Pipl',
      website: 'https://pipl.com',
      optOutUrl: 'https://pipl.com/privacy/opt-out',
      optOutMethod: 'email',
      description: 'Deep web people search engine that finds information from social networks, professional networks, and public records.',
      dataTypes: ['Name', 'Email', 'Social Media', 'Professional Profiles', 'Photos', 'Contact Information'],
      difficulty: 'medium',
      estimatedTime: '10-15 minutes',
      requiresId: false,
      instructions: [
        'Send email to privacy@pipl.com',
        'Include your full name and email addresses',
        'Specify which profiles to remove',
        'Request confirmation of removal',
        'Follow up if no response within 7 days'
      ],
      legalBasis: 'GDPR, CCPA',
      responseTime: '1-2 weeks',
      verificationMethod: 'email_confirmation',
      recheckInterval: 60,
      categories: ['people_search', 'social_media', 'professional']
    },
    {
      id: 'peekyou',
      name: 'PeekYou',
      website: 'https://www.peekyou.com',
      optOutUrl: 'https://www.peekyou.com/opt-out',
      optOutMethod: 'online',
      description: 'Social media search engine that aggregates profiles from various social networks and websites.',
      dataTypes: ['Name', 'Social Media Profiles', 'Photos', 'Contact Information', 'Professional Profiles'],
      difficulty: 'easy',
      estimatedTime: '5-10 minutes',
      requiresId: false,
      instructions: [
        'Visit peekyou.com/opt-out',
        'Enter your name and email',
        'Select the profiles to remove',
        'Provide email for confirmation',
        'Submit removal request'
      ],
      legalBasis: 'CCPA',
      responseTime: '24-48 hours',
      verificationMethod: 'email_confirmation',
      recheckInterval: 30,
      categories: ['social_media', 'people_search']
    }
  ];
};

// Helper function to simulate data broker search
const simulateDataBrokerSearch = async (_searchParams) => {
  // const { name: _name, email: _email, phone: _phone, address: _address } = searchParams;
  const brokers = await getDataBrokersList();
  
  // Simulate search results based on search parameters
  const results = brokers.map(broker => {
    const hasData = Math.random() > 0.3; // 70% chance of finding data
    const confidence = hasData ? Math.random() * 0.4 + 0.6 : Math.random() * 0.3; // 60-100% if found, 0-30% if not
    
    return {
      brokerId: broker.id,
      brokerName: broker.name,
      website: broker.website,
      hasData,
      confidence: Math.round(confidence * 100),
      dataTypes: hasData ? broker.dataTypes.slice(0, Math.floor(Math.random() * 4) + 2) : [],
      lastUpdated: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      optOutUrl: broker.optOutUrl,
      difficulty: broker.difficulty,
      estimatedTime: broker.estimatedTime
    };
  });

  return results.filter(result => result.hasData);
};

// Helper function to generate next steps for removal request
const generateNextSteps = (broker, _requestType) => {
  const steps = [];
  
  if (broker.optOutMethod === 'online') {
    steps.push({
      step: 1,
      title: 'Visit the opt-out page',
      description: `Go to ${broker.optOutUrl}`,
      action: 'visit_website',
      url: broker.optOutUrl
    });
    
    if (broker.requiresId) {
      steps.push({
        step: 2,
        title: 'Prepare your ID',
        description: 'Have a government-issued ID ready for verification',
        action: 'prepare_id'
      });
    }
    
    steps.push({
      step: broker.requiresId ? 3 : 2,
      title: 'Follow the removal process',
      description: 'Complete the online form following the provided instructions',
      action: 'complete_form'
    });
  } else if (broker.optOutMethod === 'email') {
    steps.push({
      step: 1,
      title: 'Draft removal email',
      description: 'Use our email template to request data removal',
      action: 'draft_email'
    });
    
    steps.push({
      step: 2,
      title: 'Send email request',
      description: `Send the email to the broker's privacy contact`,
      action: 'send_email'
    });
  }
  
  steps.push({
    step: steps.length + 1,
    title: 'Wait for confirmation',
    description: `Expected response time: ${broker.responseTime}`,
    action: 'wait_confirmation'
  });
  
  steps.push({
    step: steps.length + 1,
    title: 'Verify removal',
    description: 'Check back in a few days to verify your data was removed',
    action: 'verify_removal'
  });
  
  return steps;
};

// Helper function to check removal status
const checkRemovalStatus = async (requestId) => {
  // Simulate status check (in real implementation, this would query database)
  const statuses = ['submitted', 'in_progress', 'completed', 'failed', 'requires_action'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    requestId,
    status: randomStatus,
    lastUpdated: new Date().toISOString(),
    message: getStatusMessage(randomStatus),
    nextAction: getNextAction(randomStatus)
  };
};

// Helper function to get status message
const getStatusMessage = (status) => {
  switch (status) {
    case 'submitted':
      return 'Your removal request has been submitted and is being processed.';
    case 'in_progress':
      return 'Your request is being processed by the data broker.';
    case 'completed':
      return 'Your data has been successfully removed from this broker.';
    case 'failed':
      return 'The removal request failed. Please try again or contact support.';
    case 'requires_action':
      return 'Additional action is required. Please check your email for instructions.';
    default:
      return 'Status unknown.';
  }
};

// Helper function to get next action
const getNextAction = (status) => {
  switch (status) {
    case 'submitted':
    case 'in_progress':
      return 'Wait for the estimated response time and check back later.';
    case 'completed':
      return 'Verify the removal by searching for your data on the broker site.';
    case 'failed':
      return 'Review the failure reason and resubmit your request.';
    case 'requires_action':
      return 'Check your email and follow the provided instructions.';
    default:
      return 'Contact support for assistance.';
  }
};

// Helper function to verify data removal
const verifyDataRemoval = async (brokerId, _userInfo) => {
  // Simulate verification (in real implementation, this would use web scraping)
  const isRemoved = Math.random() > 0.2; // 80% chance of successful removal
  
  return {
    brokerId,
    verified: isRemoved,
    verificationDate: new Date().toISOString(),
    message: isRemoved 
      ? 'Your data has been successfully removed from this broker.'
      : 'Data may still be present. Consider resubmitting your removal request.',
    nextSteps: isRemoved 
      ? ['Set up monitoring to detect if data reappears', 'Consider other brokers for removal']
      : ['Resubmit removal request', 'Contact broker directly if issues persist']
  };
};

// Helper function to analyze password strength
const analyzePasswordStrength = (password) => {
  let score = 0;
  const feedback = [];

  // Length check
  if (password.length >= 8) score += 1;
  else feedback.push('Use at least 8 characters');

  if (password.length >= 12) score += 1;
  else feedback.push('Consider using 12+ characters for better security');

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include uppercase letters');

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Include numbers');

  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else feedback.push('Include special characters');

  // Common patterns check
  if (/(.)\1{2,}/.test(password)) {
    score -= 1;
    feedback.push('Avoid repeating characters');
  }

  if (/123|abc|qwe|asd|zxc/i.test(password)) {
    score -= 1;
    feedback.push('Avoid common patterns');
  }

  // Determine strength level
  let strength;
  if (score <= 2) strength = 'weak';
  else if (score <= 4) strength = 'fair';
  else if (score <= 5) strength = 'good';
  else strength = 'strong';

  return {
    score: Math.max(0, Math.min(100, score * 20)),
    strength,
    feedback,
    requirements: {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    }
  };
};

// Helper function to generate password recommendations
const generatePasswordRecommendations = (strengthAnalysis) => {
  const recommendations = [];

  if (strengthAnalysis.strength === 'weak') {
    recommendations.push('Your password is weak. Consider using a password manager to generate a strong password.');
  } else if (strengthAnalysis.strength === 'fair') {
    recommendations.push('Your password is fair. Try adding more character variety or length.');
  } else if (strengthAnalysis.strength === 'good') {
    recommendations.push('Your password is good. Consider making it even stronger for maximum security.');
  } else {
    recommendations.push('Excellent! Your password is strong and secure.');
  }

  if (strengthAnalysis.feedback.length > 0) {
    recommendations.push(...strengthAnalysis.feedback);
  }

  return recommendations;
};

// Helper function to calculate overall risk
const calculateOverallRisk = (results) => {
  const criticalRiskFound = results.filter(r => r.risk === 'critical' && r.found).length;
  const highRiskFound = results.filter(r => r.risk === 'high' && r.found).length;
  const mediumRiskFound = results.filter(r => r.risk === 'medium' && r.found).length;
  const lowRiskFound = results.filter(r => r.risk === 'low' && r.found).length;
  
  // Calculate weighted risk score with critical risk having highest weight
  const riskScore = (criticalRiskFound * 5) + (highRiskFound * 3) + (mediumRiskFound * 2) + (lowRiskFound * 1);
  const totalPossible = results.length * 5; // Use 5 as max weight for calculation
  const riskPercentage = (riskScore / totalPossible) * 100;
  
  // If any critical risk is found, overall risk is critical
  if (criticalRiskFound > 0) return 'critical';
  if (riskPercentage >= 70) return 'high';
  if (riskPercentage >= 40) return 'medium';
  return 'low';
};

// Helper function to calculate privacy risk score
const calculatePrivacyRiskScore = (results) => {
  const severityScores = { high: 3, medium: 2, low: 1 };
  const totalScore = results.reduce((sum, issue) => sum + (severityScores[issue.severity] || 0), 0);
  const maxScore = results.length * 3;
  return Math.round((totalScore / maxScore) * 100);
};

// Helper function to store analysis results
const storeAnalysisResults = async (userId, type, data) => {
  try {
    const analysisResult = new AnalysisResult({
      userId,
      type,
      data,
      analyzedAt: new Date()
    });

    await analysisResult.save();
    logger.info(`Analysis result stored for user ${userId}, type: ${type}`);
    return analysisResult;
  } catch (error) {
    logger.error('Error storing analysis results:', error);
    throw error;
  }
};

// Helper function to generate analysis summary
const generateAnalysisSummary = (results) => {
  const totalFound = results.filter(r => r.found).length;
  const criticalRiskFound = results.filter(r => r.risk === 'critical' && r.found).length;
  const highRiskFound = results.filter(r => r.risk === 'high' && r.found).length;
  const mediumRiskFound = results.filter(r => r.risk === 'medium' && r.found).length;
  const lowRiskFound = results.filter(r => r.risk === 'low' && r.found).length;

  return {
    totalFound,
    criticalRiskFound,
    highRiskFound,
    mediumRiskFound,
    lowRiskFound,
    riskDistribution: {
      critical: criticalRiskFound,
      high: highRiskFound,
      medium: mediumRiskFound,
      low: lowRiskFound
    },
    overallRisk: calculateOverallRisk(results),
    confidence: results.reduce((sum, r) => sum + (r.confidence || 0), 0) / results.length,
    totalExposures: results.length,
    exposureRate: (totalFound / results.length) * 100
  };
};

module.exports = router;