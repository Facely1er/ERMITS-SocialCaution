// Re-export everything for backward compatibility
export { PersonaProvider, personaConfigs } from './PersonaProvider';
export { usePersona, usePersonaConfig, usePersonaNavigation, usePersonaDashboard, useJourneyProgress } from '../../hooks/usePersona';
export { PersonaType, JourneyPhase } from '../types/personaTypes';
export type { PersonaConfig, NavigationItem, AssessmentConfig, PersonaContextType } from '../types/personaTypes';

