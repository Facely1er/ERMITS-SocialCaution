export enum PersonaType {
  CAUTIOUS_PARENT = 'cautious-parent',
  PRIVATE_INDIVIDUAL = 'private-individual',
  ONLINE_SHOPPER = 'online-shopper',
  SOCIAL_INFLUENCER = 'social-influencer',
  DIGITAL_NOVICE = 'digital-novice',
  PRIVACY_ADVOCATE = 'privacy-advocate',
  CONCERNED_EMPLOYEE = 'concerned-employee'
}

export enum JourneyPhase {
  DISCOVERY = 'discovery',
  ASSESSMENT = 'assessment',
  ONBOARDING = 'onboarding',
  ENGAGEMENT = 'engagement',
  CONVERSION = 'conversion',
  RETENTION = 'retention',
  ADVOCACY = 'advocacy'
}

export interface NavigationItem {
  label: string;
  path: string;
  icon: string;
  description?: string;
}

export interface AssessmentConfig {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  priority: 'high' | 'medium' | 'low';
}

export interface PersonaConfig {
  id: PersonaType;
  title: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  icon: string;
  navigation: {
    primaryActions: NavigationItem[];
    quickLinks: NavigationItem[];
  };
  dashboard: {
    widgets: string[];
    layout: 'family-focused' | 'learning-focused' | 'data-rich' | 'action-oriented' | 'social-focused' | 'privacy-first';
  };
  assessments: AssessmentConfig[];
  onboarding: {
    steps: string[];
    estimatedTime: string;
  };
}

export interface PersonaContextType {
  persona: PersonaType | null;
  journeyPhase: JourneyPhase;
  personaConfig: PersonaConfig | null;
  setPersona: (persona: PersonaType) => void;
  updateJourneyPhase: (phase: JourneyPhase) => void;
  getPersonaConfig: () => PersonaConfig | null;
  isPersonaSelected: boolean;
}

