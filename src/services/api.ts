const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: any[];
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
    retries = 3,
    retryDelay = 1000
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    // Retry logic for failed requests
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, config);
        
        // Handle non-JSON responses
        let data: any;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          data = { message: text || 'Request failed' };
        }

        if (!response.ok) {
          // Don't retry on client errors (4xx) except 429 (rate limit)
          if (response.status >= 400 && response.status < 500 && response.status !== 429) {
            throw new Error(data.message || 'Request failed');
          }
          
          // Retry on server errors (5xx) or rate limits (429)
          if (attempt < retries && (response.status >= 500 || response.status === 429)) {
            await this.delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
            continue;
          }
          
          throw new Error(data.message || 'Request failed');
        }

        return data;
      } catch (error: any) {
        // Network errors - retry if attempts remaining
        if (attempt < retries && (error.name === 'TypeError' || error.message.includes('fetch'))) {
          await this.delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
          continue;
        }
        
        // Log error for debugging (only in development)
        if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
          console.error('API request failed:', error);
        }
        
        // Don't expose sensitive error details
        const errorMessage = error?.message || 'Request failed. Please try again.';
        
        // Sanitize error message to prevent information leakage
        const sanitizedError = new Error(errorMessage);
        (sanitizedError as any).status = error?.status || 500;
        
        throw sanitizedError;
      }
    }
    
    // Should never reach here, but TypeScript needs it
    throw new Error('Request failed after retries');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Auth endpoints
  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });
    
    this.setToken(null);
    return response;
  }

  async refreshToken(refreshToken: string) {
    const response = await this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async verifyEmail(token: string) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(profileData: any) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/users/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async deleteAccount(password: string) {
    return this.request('/users/account', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
  }


  // Assessment endpoints
  async getAssessmentQuestions(type?: string) {
    const params = type ? `?type=${type}` : '';
    return this.request(`/assessments/questions${params}`);
  }

  async startAssessment(type: string) {
    return this.request('/assessments/start', {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  }

  async submitAnswer(assessmentId: string, answer: {
    questionId: string;
    value: string;
    score: number;
    level: string;
  }) {
    return this.request(`/assessments/${assessmentId}/answer`, {
      method: 'POST',
      body: JSON.stringify(answer),
    });
  }

  async completeAssessment(assessmentId: string) {
    return this.request(`/assessments/${assessmentId}/complete`, {
      method: 'POST',
    });
  }

  async getUserAssessments(params?: {
    type?: string;
    status?: string;
    limit?: number;
    page?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return this.request(`/assessments${queryString ? `?${queryString}` : ''}`);
  }

  async getAssessment(assessmentId: string) {
    return this.request(`/assessments/${assessmentId}`);
  }

  // Dashboard endpoints
  async getDashboardOverview() {
    return this.request('/dashboard/overview');
  }

  async getDashboardAssessments(params?: {
    type?: string;
    status?: string;
    limit?: number;
    page?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return this.request(`/dashboard/assessments${queryString ? `?${queryString}` : ''}`);
  }

  async getActionPlan() {
    return this.request('/dashboard/action-plan');
  }

  async updateActionPlanItem(itemId: string, isCompleted: boolean) {
    return this.request(`/dashboard/action-plan/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ isCompleted }),
    });
  }

  async getAnalytics(period?: string) {
    const params = period ? `?period=${period}` : '';
    return this.request(`/dashboard/analytics${params}`);
  }

  async getRecommendations() {
    return this.request('/dashboard/recommendations');
  }

  // Tools endpoints
  async analyzeDigitalFootprint(searchQuery: string) {
    return this.request('/tools/digital-footprint', {
      method: 'POST',
      body: JSON.stringify({ searchQuery }),
    });
  }

  async getAnalysisHistory(type?: string) {
    const url = type ? `/tools/analysis-history?type=${type}` : '/tools/analysis-history';
    return this.request(url);
  }

  async getAnalysisResult(id: string) {
    return this.request(`/tools/analysis/${id}`);
  }

  async deleteAnalysisResult(id: string) {
    return this.request(`/tools/analysis/${id}`, {
      method: 'DELETE'
    });
  }

  async checkDataBreaches(email: string) {
    return this.request('/tools/data-breach-check', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async scanWebsitePrivacy(url: string) {
    return this.request('/tools/privacy-scan', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  }

  async getDataBrokers() {
    return this.request('/tools/data-brokers');
  }

  async searchDataBrokers(searchParams: any) {
    return this.request('/tools/data-brokers/search', {
      method: 'POST',
      body: JSON.stringify(searchParams),
    });
  }

  async submitRemovalRequest(brokerId: string, userInfo: any) {
    return this.request('/tools/data-brokers/removal-request', {
      method: 'POST',
      body: JSON.stringify({ brokerId, userInfo, requestType: 'removal' }),
    });
  }

  async checkRemovalStatus(requestId: string) {
    return this.request(`/tools/data-brokers/removal-status/${requestId}`);
  }

  async verifyRemoval(brokerId: string, userInfo: any) {
    return this.request('/tools/data-brokers/verify-removal', {
      method: 'POST',
      body: JSON.stringify({ brokerId, userInfo }),
    });
  }

  async checkPasswordStrength(password: string) {
    return this.request('/tools/password-strength', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  // Resources endpoints
  async getGuides(params?: {
    category?: string;
    limit?: number;
    page?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return this.request(`/resources/guides${queryString ? `?${queryString}` : ''}`);
  }

  async getGuide(guideId: string) {
    return this.request(`/resources/guides/${guideId}`);
  }

  async getChecklists(params?: {
    category?: string;
    limit?: number;
    page?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return this.request(`/resources/checklists${queryString ? `?${queryString}` : ''}`);
  }

  async getTools(params?: {
    category?: string;
    limit?: number;
    page?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return this.request(`/resources/tools${queryString ? `?${queryString}` : ''}`);
  }

  // Blog endpoints
  async getBlogPosts(params?: {
    category?: string;
    tag?: string;
    limit?: number;
    page?: number;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return this.request(`/blog/posts${queryString ? `?${queryString}` : ''}`);
  }

  async getBlogPost(slug: string) {
    return this.request(`/blog/posts/${slug}`);
  }

  async getBlogCategories() {
    return this.request('/blog/categories');
  }

  async getBlogTags() {
    return this.request('/blog/tags');
  }

  // Notifications endpoints
  async getNotifications(params?: {
    type?: string;
    isRead?: boolean;
    limit?: number;
    page?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return this.request(`/notifications${queryString ? `?${queryString}` : ''}`);
  }

  async markNotificationRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async deleteNotification(notificationId: string) {
    return this.request(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }

  async updateNotificationPreferences(preferences: {
    email?: boolean;
    push?: boolean;
    privacyAlerts?: boolean;
    assessmentReminders?: boolean;
  }) {
    return this.request('/notifications/preferences', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  }
}

export const apiService = new ApiService(API_BASE_URL);
export default apiService;