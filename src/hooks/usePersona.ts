import { useContext } from 'react';
import { PersonaContext } from '../core/providers/PersonaProvider';
import type { PersonaContextType, PersonaConfig } from '../core/types/personaTypes';
import { JourneyPhase } from '../core/types/personaTypes';

export const usePersona = (): PersonaContextType => {
  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
};

// Helper hooks for common use cases
export const usePersonaConfig = (): PersonaConfig | null => {
  const { personaConfig } = usePersona();
  return personaConfig;
};

export const usePersonaNavigation = () => {
  const { personaConfig } = usePersona();
  return personaConfig?.navigation || { primaryActions: [], quickLinks: [] };
};

export const usePersonaDashboard = () => {
  const { personaConfig } = usePersona();
  return personaConfig?.dashboard || { widgets: [], layout: 'privacy-first' as const };
};

export const useJourneyProgress = () => {
  const { journeyPhase, updateJourneyPhase } = usePersona();
  
  const phases = Object.values(JourneyPhase);
  const currentIndex = phases.indexOf(journeyPhase);
  const progress = ((currentIndex + 1) / phases.length) * 100;
  
  const nextPhase = () => {
    if (currentIndex < phases.length - 1) {
      updateJourneyPhase(phases[currentIndex + 1]);
    }
  };
  
  const previousPhase = () => {
    if (currentIndex > 0) {
      updateJourneyPhase(phases[currentIndex - 1]);
    }
  };
  
  return {
    currentPhase: journeyPhase,
    progress,
    isFirstPhase: currentIndex === 0,
    isLastPhase: currentIndex === phases.length - 1,
    nextPhase,
    previousPhase,
    phases
  };
};

