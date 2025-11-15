import { PersonalDataEntry } from '../../types/personalDataInventory';

const STORAGE_KEY = 'personalDataInventory';

export const loadFromStorage = (): PersonalDataEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    return parsed.map((entry: any) => ({
      ...entry,
      createdAt: new Date(entry.createdAt),
      updatedAt: new Date(entry.updatedAt),
    }));
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return [];
  }
};

export const saveToStorage = (entries: PersonalDataEntry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

export const addEntry = (entry: Omit<PersonalDataEntry, 'id' | 'createdAt' | 'updatedAt'>): PersonalDataEntry => {
  const entries = loadFromStorage();
  const newEntry: PersonalDataEntry = {
    ...entry,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  entries.push(newEntry);
  saveToStorage(entries);
  return newEntry;
};

export const updateEntry = (id: string, updates: Partial<PersonalDataEntry>): PersonalDataEntry | null => {
  const entries = loadFromStorage();
  const index = entries.findIndex(entry => entry.id === id);
  
  if (index === -1) return null;
  
  entries[index] = {
    ...entries[index],
    ...updates,
    updatedAt: new Date(),
  };
  
  saveToStorage(entries);
  return entries[index];
};

export const deleteEntry = (id: string): boolean => {
  const entries = loadFromStorage();
  const filtered = entries.filter(entry => entry.id !== id);
  
  if (filtered.length === entries.length) return false;
  
  saveToStorage(filtered);
  return true;
};

export const getEntryById = (id: string): PersonalDataEntry | null => {
  const entries = loadFromStorage();
  return entries.find(entry => entry.id === id) || null;
};

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
