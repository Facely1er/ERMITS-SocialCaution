// Demo mode API - works without backend
import {
  mockPersonas,
  mockCautionItems,
  mockCautionStats,
  mockUser
} from '../data/mockData';
import type { Persona, CautionItem, CautionStats } from './cautionApi';

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true' || !import.meta.env.VITE_API_URL;
const STORAGE_KEY = 'ermits-demo-data';

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Get demo data from localStorage
const getDemoData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    user: { ...mockUser },
    selectedPersona: null
  };
};

// Save demo data to localStorage
const saveDemoData = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Demo API implementation
export const demoApi = {
  // Check if in demo mode
  isDemoMode: () => DEMO_MODE,

  // Personas
  getAllPersonas: async (): Promise<Persona[]> => {
    await delay();
    return mockPersonas;
  },

  getPersonaByName: async (name: string): Promise<Persona> => {
    await delay();
    const persona = mockPersonas.find(p => p.name === name);
    if (!persona) throw new Error('Persona not found');
    return persona;
  },

  selectPersona: async (personaName: string): Promise<{ user: any; persona: Persona }> => {
    await delay();
    const persona = mockPersonas.find(p => p.name === personaName);
    if (!persona) throw new Error('Persona not found');

    const demoData = getDemoData();
    demoData.user.selectedPersona = personaName;
    demoData.selectedPersona = personaName;
    saveDemoData(demoData);

    return {
      user: demoData.user,
      persona
    };
  },

  getCurrentUserPersona: async (): Promise<Persona | null> => {
    await delay();
    const demoData = getDemoData();
    if (!demoData.selectedPersona) return null;

    const persona = mockPersonas.find(p => p.name === demoData.selectedPersona);
    return persona || null;
  },

  // Cautions
  getCautionItems: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    severity?: string;
    startDate?: string;
  }): Promise<{ data: CautionItem[]; pagination: any }> => {
    await delay();

    const demoData = getDemoData();
    if (!demoData.selectedPersona) {
      throw new Error('Please select a persona first');
    }

    let filtered = mockCautionItems.filter(item =>
      item.personas.includes(demoData.selectedPersona)
    );

    // Apply filters
    if (params?.category) {
      filtered = filtered.filter(item => item.category === params.category);
    }
    if (params?.severity) {
      filtered = filtered.filter(item => item.severity === params.severity);
    }
    if (params?.startDate) {
      filtered = filtered.filter(item =>
        new Date(item.publishedDate) >= new Date(params.startDate!)
      );
    }

    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: filtered.slice(start, end),
      pagination: {
        total: filtered.length,
        page,
        limit,
        pages: Math.ceil(filtered.length / limit)
      }
    };
  },

  getCautionById: async (id: string): Promise<CautionItem> => {
    await delay();
    const caution = mockCautionItems.find(c => c._id === id);
    if (!caution) throw new Error('Caution not found');
    return caution;
  },

  getCautionCategories: async (): Promise<string[]> => {
    await delay();
    return [...new Set(mockCautionItems.map(c => c.category))];
  },

  getCautionStats: async (): Promise<CautionStats> => {
    await delay();
    const demoData = getDemoData();
    if (!demoData.selectedPersona) {
      throw new Error('Please select a persona first');
    }
    return mockCautionStats;
  },

  // Auth (demo mode)
  login: async (email: string, password: string): Promise<{ user: any; token: string }> => {
    await delay();
    const demoData = getDemoData();
    return {
      user: demoData.user,
      token: 'demo-token-' + Date.now()
    };
  },

  register: async (data: any): Promise<{ user: any; token: string }> => {
    await delay();
    const user = {
      ...mockUser,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email
    };
    saveDemoData({ user, selectedPersona: null });
    return {
      user,
      token: 'demo-token-' + Date.now()
    };
  },

  logout: async (): Promise<void> => {
    await delay();
    localStorage.removeItem('token');
  }
};
