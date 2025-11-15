import api from './api';

export interface DigitalFootprintResult {
  id: string;
  name: string;
  type: string;
  risk: 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
  examples: string[];
  found: boolean;
}

export interface DigitalFootprintAnalysis {
  searchQuery: string;
  results: DigitalFootprintResult[];
  analyzedAt: string;
  riskLevel: 'high' | 'medium' | 'low';
}

export interface DataBreach {
  name: string;
  domain: string;
  breachDate: string;
  addedDate: string;
  modifiedDate: string;
  pwnCount: number;
  description: string;
  dataClasses: string[];
  isVerified: boolean;
  isFabricated: boolean;
  isSensitive: boolean;
  isRetired: boolean;
  isSpamList: boolean;
}

export interface DataBreachCheck {
  email: string;
  breaches: DataBreach[];
  isCompromised: boolean;
  lastChecked: string;
}

export interface PrivacyIssue {
  type: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
}

export interface PrivacyScanResult {
  url: string;
  results: PrivacyIssue[];
  scannedAt: string;
  riskScore: number;
}

export interface DataBroker {
  id: string;
  name: string;
  website: string;
  optOutUrl: string;
  optOutMethod: 'online' | 'email' | 'phone' | 'mail';
  description: string;
  dataTypes: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  requiresId: boolean;
  instructions: string[];
  legalBasis: string;
  responseTime: string;
  verificationMethod: string;
  recheckInterval: number;
  categories: string[];
  hasData?: boolean;
  confidence?: number;
  lastUpdated?: string;
}

export interface SearchResult {
  brokerId: string;
  brokerName: string;
  website: string;
  hasData: boolean;
  confidence: number;
  dataTypes: string[];
  lastUpdated: string;
  optOutUrl: string;
  difficulty: string;
  estimatedTime: string;
}

export interface RemovalRequest {
  id: string;
  brokerId: string;
  brokerName: string;
  userInfo: any;
  requestType: string;
  status: string;
  submittedAt: string;
  estimatedResponseTime: string;
  nextCheckDate: string;
}

export interface RemovalStatus {
  requestId: string;
  status: string;
  lastUpdated: string;
  message: string;
  nextAction: string;
}

export interface VerificationResult {
  brokerId: string;
  verified: boolean;
  verificationDate: string;
  message: string;
  nextSteps: string[];
}

export interface PasswordStrengthAnalysis {
  score: number;
  strength: 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
  requirements: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    numbers: boolean;
    special: boolean;
  };
}

export interface PasswordRecommendations {
  strength: PasswordStrengthAnalysis;
  recommendations: string[];
}

export interface AnalysisHistory {
  _id: string;
  type: string;
  data: DigitalFootprintAnalysis;
  analyzedAt: string;
  createdAt: string;
}

class ToolsApiService {
  /**
   * Analyze digital footprint for a given search query
   */
  static async analyzeDigitalFootprint(searchQuery: string): Promise<DigitalFootprintAnalysis> {
    try {
      const response = await api.analyzeDigitalFootprint(searchQuery.trim());
      
      if (response.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.message || 'Analysis failed');
      }
    } catch (error: any) {
      console.error('Digital footprint analysis error:', error);
      throw new Error(error.message || 'Failed to analyze digital footprint');
    }
  }

  /**
   * Check if an email has been involved in data breaches
   */
  static async checkDataBreaches(email: string): Promise<DataBreachCheck> {
    try {
      const response = await api.checkDataBreaches(email.trim().toLowerCase());
      
      if (response.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.message || 'Breach check failed');
      }
    } catch (error: any) {
      console.error('Data breach check error:', error);
      throw new Error(error.message || 'Failed to check data breaches');
    }
  }

  /**
   * Scan a website for privacy issues
   */
  static async scanWebsitePrivacy(url: string): Promise<PrivacyScanResult> {
    try {
      const response = await api.scanWebsitePrivacy(url.trim());
      
      if (response.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.message || 'Privacy scan failed');
      }
    } catch (error: any) {
      console.error('Privacy scan error:', error);
      throw new Error(error.message || 'Failed to scan website privacy');
    }
  }

  /**
   * Get list of data brokers for removal
   */
  static async getDataBrokers(): Promise<DataBroker[]> {
    try {
      const response = await api.getDataBrokers();
      
      if (response.status === 'success') {
        return response.data.brokers;
      } else {
        throw new Error(response.message || 'Failed to fetch data brokers');
      }
    } catch (error: any) {
      console.error('Get data brokers error:', error);
      throw new Error(error.message || 'Failed to fetch data brokers');
    }
  }

  /**
   * Search for user data on data broker sites
   */
  static async searchDataBrokers(searchParams: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  }): Promise<SearchResult[]> {
    try {
      const response = await api.post('/tools/data-brokers/search', searchParams);
      
      if (response.status === 'success') {
        return response.data.results;
      } else {
        throw new Error(response.message || 'Failed to search data brokers');
      }
    } catch (error: any) {
      console.error('Search data brokers error:', error);
      throw new Error(error.message || 'Failed to search data brokers');
    }
  }

  /**
   * Submit a data removal request
   */
  static async submitRemovalRequest(brokerId: string, userInfo: any): Promise<RemovalRequest> {
    try {
      const response = await api.post('/tools/data-brokers/removal-request', {
        brokerId,
        userInfo,
        requestType: 'removal'
      });
      
      if (response.status === 'success') {
        return response.data.request;
      } else {
        throw new Error(response.message || 'Failed to submit removal request');
      }
    } catch (error: any) {
      console.error('Submit removal request error:', error);
      throw new Error(error.message || 'Failed to submit removal request');
    }
  }

  /**
   * Check status of a removal request
   */
  static async checkRemovalStatus(requestId: string): Promise<RemovalStatus> {
    try {
      const response = await api.get(`/tools/data-brokers/removal-status/${requestId}`);
      
      if (response.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to check removal status');
      }
    } catch (error: any) {
      console.error('Check removal status error:', error);
      throw new Error(error.message || 'Failed to check removal status');
    }
  }

  /**
   * Verify if data has been removed from a broker
   */
  static async verifyRemoval(brokerId: string, userInfo: any): Promise<VerificationResult> {
    try {
      const response = await api.post('/tools/data-brokers/verify-removal', {
        brokerId,
        userInfo
      });
      
      if (response.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to verify removal');
      }
    } catch (error: any) {
      console.error('Verify removal error:', error);
      throw new Error(error.message || 'Failed to verify removal');
    }
  }

  /**
   * Check password strength
   */
  static async checkPasswordStrength(password: string): Promise<PasswordRecommendations> {
    try {
      const response = await api.checkPasswordStrength(password);
      
      if (response.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.message || 'Password check failed');
      }
    } catch (error: any) {
      console.error('Password strength check error:', error);
      throw new Error(error.message || 'Failed to check password strength');
    }
  }

  /**
   * Validate URL format
   */
  static validateUrl(url: string): boolean {
    try {
      const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
      return urlPattern.test(url);
    } catch {
      return false;
    }
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): boolean {
    try {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    } catch {
      return false;
    }
  }

  /**
   * Get analysis history for a specific tool type
   */
  static async getAnalysisHistory(type: string): Promise<AnalysisHistory[]> {
    try {
      const response = await api.get(`/tools/analysis-history?type=${type}`);
      
      if (response.status === 'success') {
        return response.data.results;
      } else {
        throw new Error(response.message || 'Failed to fetch analysis history');
      }
    } catch (error: any) {
      console.error('Get analysis history error:', error);
      throw new Error(error.message || 'Failed to fetch analysis history');
    }
  }

  /**
   * Get specific analysis result by ID
   */
  static async getAnalysisResult(id: string): Promise<DigitalFootprintAnalysis> {
    try {
      const response = await api.get(`/tools/analysis/${id}`);
      
      if (response.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch analysis result');
      }
    } catch (error: any) {
      console.error('Get analysis result error:', error);
      throw new Error(error.message || 'Failed to fetch analysis result');
    }
  }

  /**
   * Delete specific analysis result by ID
   */
  static async deleteAnalysisResult(id: string): Promise<void> {
    try {
      const response = await api.delete(`/tools/analysis/${id}`);
      
      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to delete analysis result');
      }
    } catch (error: any) {
      console.error('Delete analysis result error:', error);
      throw new Error(error.message || 'Failed to delete analysis result');
    }
  }

  /**
   * Normalize URL for scanning
   */
  static normalizeUrl(url: string): string {
    let normalizedUrl = url.trim();
    
    // Add protocol if missing
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    return normalizedUrl;
  }
}

// Export both named and default for maximum compatibility
export { ToolsApiService };
export default ToolsApiService;
