import api from './api';
import { demoApi } from './demoApi';

// Check if in demo mode
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true' || !import.meta.env.VITE_API_URL;

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
  if (DEMO_MODE) return demoApi.getAllPersonas();
  const response = await api.get('/personas');
  return response.data.data;
};

export const getPersonaByName = async (name: string): Promise<Persona> => {
  if (DEMO_MODE) return demoApi.getPersonaByName(name);
  const response = await api.get(`/personas/${name}`);
  return response.data.data;
};

export const selectPersona = async (personaName: string): Promise<{ user: any; persona: Persona }> => {
  if (DEMO_MODE) return demoApi.selectPersona(personaName);
  const response = await api.post('/personas/select', { personaName });
  return response.data.data;
};

export const getCurrentUserPersona = async (): Promise<Persona | null> => {
  if (DEMO_MODE) return demoApi.getCurrentUserPersona();
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
  if (DEMO_MODE) return demoApi.getCautionItems(params);
  const response = await api.get('/cautions', { params });
  return {
    data: response.data.data,
    pagination: response.data.pagination
  };
};

export const getCautionById = async (id: string): Promise<CautionItem> => {
  if (DEMO_MODE) return demoApi.getCautionById(id);
  const response = await api.get(`/cautions/${id}`);
  return response.data.data;
};

export const getCautionCategories = async (): Promise<string[]> => {
  if (DEMO_MODE) return demoApi.getCautionCategories();
  const response = await api.get('/cautions/categories');
  return response.data.data;
};

export const getCautionStats = async (): Promise<CautionStats> => {
  if (DEMO_MODE) return demoApi.getCautionStats();
  const response = await api.get('/cautions/stats/summary');
  return response.data.data;
};

export const refreshRSSFeeds = async (): Promise<any> => {
  const response = await api.post('/cautions/refresh');
  return response.data.data;
};
