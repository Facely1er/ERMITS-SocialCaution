import api from './api';

export interface Persona {
  _id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  riskCategories: string[];
  privacyRights: PrivacyRight[];
  targetAudience: string;
  isActive: boolean;
}

export interface PrivacyRight {
  title: string;
  description: string;
  actionable: boolean;
}

export interface CautionItem {
  _id: string;
  title: string;
  description: string;
  content?: string;
  category: string;
  personas: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: {
    name: string;
    url: string;
  };
  publishedDate: string;
  link?: string;
  tags: string[];
  viewCount: number;
}

export interface CautionStats {
  bySeverity: Array<{ _id: string; count: number }>;
  byCategory: Array<{ _id: string; count: number }>;
  recentCount: number;
  totalActive: number;
}

// Persona API calls
export const getAllPersonas = async (): Promise<Persona[]> => {
  const response = await api.get('/personas');
  return response.data.data;
};

export const getPersonaByName = async (name: string): Promise<Persona> => {
  const response = await api.get(`/personas/${name}`);
  return response.data.data;
};

export const selectPersona = async (personaName: string): Promise<{ user: any; persona: Persona }> => {
  const response = await api.post('/personas/select', { personaName });
  return response.data.data;
};

export const getCurrentUserPersona = async (): Promise<Persona | null> => {
  const response = await api.get('/personas/user/current');
  return response.data.data;
};

// Caution API calls
export const getCautionItems = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  severity?: string;
  startDate?: string;
}): Promise<{ data: CautionItem[]; pagination: any }> => {
  const response = await api.get('/cautions', { params });
  return {
    data: response.data.data,
    pagination: response.data.pagination
  };
};

export const getCautionById = async (id: string): Promise<CautionItem> => {
  const response = await api.get(`/cautions/${id}`);
  return response.data.data;
};

export const getCautionCategories = async (): Promise<string[]> => {
  const response = await api.get('/cautions/categories');
  return response.data.data;
};

export const getCautionStats = async (): Promise<CautionStats> => {
  const response = await api.get('/cautions/stats/summary');
  return response.data.data;
};

export const refreshRSSFeeds = async (): Promise<any> => {
  const response = await api.post('/cautions/refresh');
  return response.data.data;
};
