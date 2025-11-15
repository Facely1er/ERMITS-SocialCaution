export interface PersonalDataEntry {
  id: string;
  category: DataCategory;
  dataType: string;
  description: string;
  source: string;
  purpose: string;
  retentionPeriod: string;
  legalBasis: string;
  isSensitive: boolean;
  isShared: boolean;
  sharedWith: string[];
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export type DataCategory = 
  | 'personal_identification'
  | 'contact_information'
  | 'financial_data'
  | 'health_data'
  | 'biometric_data'
  | 'location_data'
  | 'online_activity'
  | 'preferences'
  | 'communication_data'
  | 'other';

export interface DataCategoryInfo {
  value: DataCategory;
  label: string;
  description: string;
  icon: string;
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  includeSensitive: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: DataCategory[];
}

export interface InventoryStats {
  totalEntries: number;
  sensitiveDataCount: number;
  sharedDataCount: number;
  categoryBreakdown: Record<DataCategory, number>;
  recentEntries: number;
}
