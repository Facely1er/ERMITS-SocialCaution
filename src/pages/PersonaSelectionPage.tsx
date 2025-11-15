// src/pages/PersonaSelectionPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Shield, ShoppingBag, Camera, BookOpen, Users, AlertTriangle,
  ArrowRight, CheckCircle, Clock, Target, Lightbulb
} from 'lucide-react';
import { usePersona, PersonaType, personaConfigs } from '../core/providers/PersonaProvider.index';
import PageLayout from '../components/layout/PageLayout';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const iconMap = {
  Heart,
  Shield, 
  ShoppingBag,
  Camera,
  BookOpen,
  Users,
  AlertTriangle
};

interface PersonaCardProps {
  persona: PersonaType;
  isSelected: boolean;
  onSelect: (persona: PersonaType) => void;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ persona, isSelected, onSelect }) => {
  const config = personaConfigs[persona];
  const IconComponent = iconMap[config.icon as keyof typeof iconMap];
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <Card 
        className={`p-6 cursor-pointer transition-all duration-300 ${
          isSelected 
            ? `ring-2 ring-${config.primaryColor} bg-${config.primaryColor}/5` 
            : 'hover:shadow-lg border-2 border-transparent hover:border-border dark:hover:border-border'
        }`}
        onClick={() => onSelect(persona)}
      >
        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute top-4 right-4 w-6 h-6 bg-${config.primaryColor} rounded-full flex items-center justify-center`}
          >
            <CheckCircle className="w-4 h-4 text-white" />
          </motion.div>
        )}
        
        {/* Icon */}
        <div className={`w-16 h-16 bg-${config.primaryColor}/10 rounded-full flex items-center justify-center mb-4`}>
          <IconComponent className={`w-8 h-8 text-${config.primaryColor}`} />
        </div>
        
        {/* Content */}
        <h3 className="text-xl font-bold text-text dark:text-white mb-2">{config.title}</h3>
        <p className="text-text-secondary dark:text-gray-300 mb-4 leading-relaxed">{config.description}</p>
        
        {/* Quick stats */}
        <div className="space-y-2 text-sm text-text-secondary dark:text-gray-400">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>Setup: {config.onboarding.estimatedTime}</span>
          </div>
          <div className="flex items-center">
            <Target className="w-4 h-4 mr-2" />
            <span>{config.assessments.length} specialized assessment{config.assessments.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center">
            <Lightbulb className="w-4 h-4 mr-2" />
            <span>{config.navigation.primaryActions.length} key privacy areas</span>
          </div>
        </div>
        
        {/* Preview of primary actions */}
        <div className="mt-4 pt-4 border-t border-border dark:border-border">
          <p className="text-xs font-medium text-text-secondary dark:text-gray-400 mb-2">YOUR PRIVACY FOCUS:</p>
          <div className="flex flex-wrap gap-1">
            {config.navigation.primaryActions.slice(0, 3).map((action, index) => (
              <span 
                key={index}
                className={`inline-block px-2 py-1 text-xs bg-${config.primaryColor}/10 text-${config.primaryColor} rounded-full`}
              >
                {action.label}
              </span>
            ))}
            {config.navigation.primaryActions.length > 3 && (
              <span className="inline-block px-2 py-1 text-xs bg-background-secondary dark:bg-card-hover text-text-secondary dark:text-gray-400 rounded-full">
                +{config.navigation.primaryActions.length - 3} more
              </span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const PersonaSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { setPersona, journeyPhase } = usePersona();
  const [selectedPersona, setSelectedPersona] = useState<PersonaType | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const personas = Object.values(PersonaType);

  const handlePersonaSelect = (persona: PersonaType) => {
    setSelectedPersona(persona);
  };

  const handleContinue = async () => {
    if (!selectedPersona) return;
    
    setIsTransitioning(true);
    
    // Set persona in context
    setPersona(selectedPersona);
    
    // Small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Navigate based on journey phase
    switch (journeyPhase) {
      case 'discovery':
        navigate('/assessment');
        break;
      case 'assessment':
        navigate('/assessment');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    // Allow users to continue without selecting a persona
    navigate('/assessment');
  };

  return (
    <PageLayout
      title="Find Your Privacy Profile"
      description="Everyone's privacy needs are different. Select the profile that best matches your situation to get personalized recommendations and guidance tailored to your specific needs and concerns."
      heroBackground={false}
      backgroundType="privacy"
      showBreadcrumbs={false}
    >
      <Section className="py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-4"
      >
        {/* Why This Matters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-2xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-text dark:text-white mb-4 text-center">
            Why Choose a Privacy Profile?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-text dark:text-white mb-2">Personalized Recommendations</h3>
              <p className="text-sm text-text-secondary dark:text-gray-300">Get privacy advice that actually applies to your specific situation and concerns.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-text dark:text-white mb-2">Save Time</h3>
              <p className="text-sm text-text-secondary dark:text-gray-300">Skip irrelevant features and focus on what matters most for your privacy goals.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-text dark:text-white mb-2">Relevant Learning</h3>
              <p className="text-sm text-text-secondary dark:text-gray-300">Learn privacy concepts and techniques that are relevant to your digital lifestyle.</p>
            </div>
          </div>
        </motion.div>

        {/* Persona Cards Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {personas.map((persona, index) => (
            <motion.div
              key={persona}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <PersonaCard
                persona={persona}
                isSelected={selectedPersona === persona}
                onSelect={handlePersonaSelect}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Selected Persona Preview */}
        {selectedPersona && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-accent/10 rounded-full">
                  <Target className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-text dark:text-white">
                  Perfect! Here's what you'll get as a {personaConfigs[selectedPersona].title}:
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-text dark:text-white mb-2">Your Privacy Dashboard Will Include:</h4>
                  <ul className="space-y-1 text-sm text-text-secondary dark:text-gray-300">
                    {personaConfigs[selectedPersona].dashboard.widgets.map((widget, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {widget.replace(/([A-Z])/g, ' $1').trim()}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-text dark:text-white mb-2">Your Quick Actions:</h4>
                  <ul className="space-y-1 text-sm text-text-secondary dark:text-gray-300">
                    {personaConfigs[selectedPersona].navigation.primaryActions.slice(0, 4).map((action, index) => (
                      <li key={index} className="flex items-center">
                        <ArrowRight className="w-4 h-4 text-blue-500 mr-2" />
                        {action.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={handleContinue}
            disabled={!selectedPersona || isTransitioning}
            className="px-8 py-3 min-w-[200px]"
          >
            {isTransitioning ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Setting up your profile...
              </div>
            ) : (
              <div className="flex items-center">
                Continue with {selectedPersona ? personaConfigs[selectedPersona].title : 'Selection'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleSkip}
            disabled={isTransitioning}
            className="px-8 py-3"
          >
            Skip for now
          </Button>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-text-secondary dark:text-gray-400">
            Don't worry - you can always change your privacy profile later in your dashboard settings.
          </p>
        </motion.div>
      </motion.div>
    </Section>
    </PageLayout>
  );
};

export default PersonaSelectionPage;