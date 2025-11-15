const axios = require('axios');
const logger = require('../utils/logger');

class RealApiService {
  constructor() {
    this.apiKeys = {
      haveIBeenPwned: process.env.HIBP_API_KEY || null,
      googleSearch: process.env.GOOGLE_SEARCH_API_KEY || null,
      googleCSE: process.env.GOOGLE_CSE_ID || null,
      shodan: process.env.SHODAN_API_KEY || null,
      virustotal: process.env.VIRUSTOTAL_API_KEY || null,
      hunter: process.env.HUNTER_API_KEY || null,
      clearbit: process.env.CLEARBIT_API_KEY || null
    };
  }

  /**
   * Check if email has been involved in data breaches using Have I Been Pwned API
   */
  async checkDataBreaches(email) {
    if (!this.apiKeys.haveIBeenPwned) {
      logger.warn('Have I Been Pwned API key not configured');
      return this.getMockBreachData(email);
    }

    try {
      const response = await axios.get(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`, {
        headers: {
          'hibp-api-key': this.apiKeys.haveIBeenPwned,
          'user-agent': 'Social-Caution-Privacy-Platform/1.0'
        },
        timeout: 10000
      });

      return {
        email: email,
        breaches: response.data,
        isCompromised: response.data.length > 0,
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          email: email,
          breaches: [],
          isCompromised: false,
          lastChecked: new Date().toISOString()
        };
      }
      logger.error('Have I Been Pwned API error:', error);
      return this.getMockBreachData(email);
    }
  }

  /**
   * Search for information using Google Custom Search API
   */
  async searchGoogle(query, _searchType = 'web') {
    if (!this.apiKeys.googleSearch || !this.apiKeys.googleCSE) {
      logger.warn('Google Search API keys not configured');
      return this.getMockSearchResults(query);
    }

    try {
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: this.apiKeys.googleSearch,
          cx: this.apiKeys.googleCSE,
          q: query,
          num: 10,
          safe: 'off'
        },
        timeout: 10000
      });

      return {
        query: query,
        results: response.data.items || [],
        totalResults: response.data.searchInformation?.totalResults || 0,
        searchTime: response.data.searchInformation?.searchTime || 0,
        lastSearched: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Google Search API error:', error);
      return this.getMockSearchResults(query);
    }
  }

  /**
   * Search for domain information using Shodan API
   */
  async searchShodan(domain) {
    if (!this.apiKeys.shodan) {
      logger.warn('Shodan API key not configured');
      return this.getMockShodanData(domain);
    }

    try {
      const response = await axios.get(`https://api.shodan.io/shodan/host/${domain}`, {
        params: {
          key: this.apiKeys.shodan
        },
        timeout: 10000
      });

      return {
        domain: domain,
        ip: response.data.ip_str,
        ports: response.data.ports || [],
        services: response.data.data || [],
        lastScanned: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Shodan API error:', error);
      return this.getMockShodanData(domain);
    }
  }

  /**
   * Check domain reputation using VirusTotal API
   */
  async checkVirusTotal(domain) {
    if (!this.apiKeys.virustotal) {
      logger.warn('VirusTotal API key not configured');
      return this.getMockVirusTotalData(domain);
    }

    try {
      const response = await axios.get(`https://www.virustotal.com/vtapi/v2/domain/report`, {
        params: {
          apikey: this.apiKeys.virustotal,
          domain: domain
        },
        timeout: 10000
      });

      return {
        domain: domain,
        positives: response.data.positives || 0,
        total: response.data.total || 0,
        scans: response.data.scans || {},
        lastScanned: new Date().toISOString()
      };
    } catch (error) {
      logger.error('VirusTotal API error:', error);
      return this.getMockVirusTotalData(domain);
    }
  }

  /**
   * Search for email information using Hunter API
   */
  async searchHunter(email) {
    if (!this.apiKeys.hunter) {
      logger.warn('Hunter API key not configured');
      return this.getMockHunterData(email);
    }

    try {
      const response = await axios.get('https://api.hunter.io/v2/email-verifier', {
        params: {
          email: email,
          api_key: this.apiKeys.hunter
        },
        timeout: 10000
      });

      return {
        email: email,
        deliverable: response.data.data?.deliverable || false,
        disposable: response.data.data?.disposable || false,
        webmail: response.data.data?.webmail || false,
        sources: response.data.data?.sources || [],
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Hunter API error:', error);
      return this.getMockHunterData(email);
    }
  }

  /**
   * Search for company information using Clearbit API
   */
  async searchClearbit(domain) {
    if (!this.apiKeys.clearbit) {
      logger.warn('Clearbit API key not configured');
      return this.getMockClearbitData(domain);
    }

    try {
      const response = await axios.get(`https://company.clearbit.com/v2/companies/find`, {
        params: {
          domain: domain
        },
        headers: {
          'Authorization': `Bearer ${this.apiKeys.clearbit}`
        },
        timeout: 10000
      });

      return {
        domain: domain,
        name: response.data.name,
        description: response.data.description,
        location: response.data.location,
        employees: response.data.metrics?.employees,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Clearbit API error:', error);
      return this.getMockClearbitData(domain);
    }
  }

  /**
   * Search social media platforms for username
   */
  async searchSocialMedia(username) {
    const platforms = [
      'twitter.com',
      'instagram.com',
      'facebook.com',
      'linkedin.com',
      'github.com',
      'reddit.com',
      'youtube.com',
      'tiktok.com'
    ];

    const results = [];
    
    for (const platform of platforms) {
      try {
        const searchQuery = `site:${platform} ${username}`;
        const searchResults = await this.searchGoogle(searchQuery, 'social');
        
        if (searchResults.results.length > 0) {
          results.push({
            platform: platform,
            username: username,
            found: true,
            results: searchResults.results,
            lastChecked: new Date().toISOString()
          });
        }
      } catch (error) {
        logger.error(`Error searching ${platform}:`, error);
      }
    }

    return results;
  }

  /**
   * Search for phone number information
   */
  async searchPhoneNumber(phone) {
    try {
      const searchQuery = `"${phone}" OR "${phone.replace(/\D/g, '')}"`;
      const searchResults = await this.searchGoogle(searchQuery, 'phone');
      
      return {
        phone: phone,
        results: searchResults.results,
        totalResults: searchResults.totalResults,
        lastSearched: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Phone number search error:', error);
      return this.getMockPhoneData(phone);
    }
  }

  // Mock data methods for when APIs are not available
  getMockBreachData(email) {
    return {
      email: email,
      breaches: [],
      isCompromised: false,
      lastChecked: new Date().toISOString(),
      message: 'API not configured - using mock data'
    };
  }

  getMockSearchResults(query) {
    return {
      query: query,
      results: [],
      totalResults: 0,
      searchTime: 0,
      lastSearched: new Date().toISOString(),
      message: 'API not configured - using mock data'
    };
  }

  getMockShodanData(domain) {
    return {
      domain: domain,
      ip: '192.168.1.1',
      ports: [],
      services: [],
      lastScanned: new Date().toISOString(),
      message: 'API not configured - using mock data'
    };
  }

  getMockVirusTotalData(domain) {
    return {
      domain: domain,
      positives: 0,
      total: 0,
      scans: {},
      lastScanned: new Date().toISOString(),
      message: 'API not configured - using mock data'
    };
  }

  getMockHunterData(email) {
    return {
      email: email,
      deliverable: true,
      disposable: false,
      webmail: true,
      sources: [],
      lastChecked: new Date().toISOString(),
      message: 'API not configured - using mock data'
    };
  }

  getMockClearbitData(domain) {
    return {
      domain: domain,
      name: 'Unknown Company',
      description: 'Company information not available',
      location: 'Unknown',
      employees: 0,
      lastUpdated: new Date().toISOString(),
      message: 'API not configured - using mock data'
    };
  }

  getMockPhoneData(phone) {
    return {
      phone: phone,
      results: [],
      totalResults: 0,
      lastSearched: new Date().toISOString(),
      message: 'API not configured - using mock data'
    };
  }
}

module.exports = new RealApiService();
