import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllPersonas, selectPersona, getCurrentUserPersona, type Persona } from '../services/cautionApi';
import { Shield, CheckCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { designSystem } from '../styles/design-system';

export default function PersonaSelection() {
  const navigate = useNavigate();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [currentPersona, setCurrentPersona] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async () => {
    try {
      setLoading(true);
      const [personasData, currentUserPersona] = await Promise.all([
        getAllPersonas(),
        getCurrentUserPersona()
      ]);
      setPersonas(personasData);
      if (currentUserPersona) {
        setCurrentPersona(currentUserPersona.name);
        setSelectedPersona(currentUserPersona);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load personas');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPersona = async (persona: Persona) => {
    setSelectedPersona(persona);
  };

  const handleContinue = async () => {
    if (!selectedPersona) {
      setError('Please select a persona');
      return;
    }

    try {
      setSubmitting(true);
      await selectPersona(selectedPersona.name);
      navigate('/cautions');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to select persona');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${designSystem.gradients.page}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading personas...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout variant="centered">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-16 w-16 text-indigo-600" />
        </div>
        <h1 className={`${designSystem.typography.h1} text-4xl mb-4`}>
          Choose Your Privacy Persona
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Select the persona that best matches your needs to receive tailored privacy alerts and risk information
        </p>
        {currentPersona && (
          <p className="mt-4 text-sm text-indigo-600">
            Current persona: <span className="font-semibold">{personas.find(p => p.name === currentPersona)?.displayName}</span>
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className={`${designSystem.spacing.section} bg-red-50 border border-red-200 ${designSystem.borderRadius.card} ${designSystem.spacing.card} text-red-700`}>
          {error}
        </div>
      )}

      {/* Persona Grid */}
      <div className={`${designSystem.grid.personas} ${designSystem.spacing.section}`}>
        {personas.map((persona) => (
          <motion.div
            key={persona._id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative cursor-pointer ${designSystem.borderRadius.card} ${designSystem.spacing.card} border-2 ${designSystem.transitions.default} ${
              selectedPersona?.name === persona.name
                ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                : `border-gray-200 bg-white hover:border-indigo-300 ${designSystem.shadow.cardHover}`
            }`}
            onClick={() => handleSelectPersona(persona)}
          >
            {/* Selected Indicator */}
            {selectedPersona?.name === persona.name && (
              <div className="absolute top-4 right-4">
                <CheckCircle className="h-6 w-6 text-indigo-600" />
              </div>
            )}

            {/* Icon */}
            <div className="text-5xl mb-4">{persona.icon}</div>

            {/* Name */}
            <h3 className={`${designSystem.typography.h3} mb-2`}>
              {persona.displayName}
            </h3>

            {/* Description */}
            <p className={`${designSystem.typography.bodySmall} mb-4`}>
              {persona.description}
            </p>

            {/* Target Audience */}
            <p className={`${designSystem.typography.caption} italic`}>
              {persona.targetAudience}
            </p>

            {/* Risk Categories */}
            <div className={`mt-4 flex flex-wrap ${designSystem.spacing.gap.xs}`}>
              {persona.riskCategories.slice(0, 3).map((category) => (
                <span
                  key={category}
                  className={`px-2 py-1 bg-gray-100 text-gray-700 ${designSystem.typography.caption} ${designSystem.borderRadius.badge}`}
                >
                  {category.replace('-', ' ')}
                </span>
              ))}
              {persona.riskCategories.length > 3 && (
                <span className={`px-2 py-1 bg-gray-100 text-gray-700 ${designSystem.typography.caption} ${designSystem.borderRadius.badge}`}>
                  +{persona.riskCategories.length - 3} more
                </span>
              )}
            </div>
          </motion.div>
        ))}
        </div>

      {/* Selected Persona Details */}
      {selectedPersona && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white ${designSystem.borderRadius.card} ${designSystem.shadow.large} ${designSystem.spacing.card} ${designSystem.spacing.section}`}
        >
          <h2 className={`${designSystem.typography.h2} mb-4`}>
            Your Privacy Rights as {selectedPersona.displayName}
          </h2>
          <div className="space-y-4">
            {selectedPersona.privacyRights.map((right, index) => (
              <div key={index} className="border-l-4 border-indigo-600 pl-4">
                <h3 className={`${designSystem.typography.h4} flex items-center ${designSystem.spacing.gap.xs}`}>
                  {right.title}
                  {right.actionable && (
                    <span className={`${designSystem.typography.caption} bg-green-100 text-green-700 px-2 py-1 ${designSystem.borderRadius.badge}`}>
                      Actionable
                    </span>
                  )}
                </h3>
                <p className={`${designSystem.typography.bodySmall} mt-1`}>{right.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Continue Button */}
      <div className="text-center">
        <button
          onClick={handleContinue}
          disabled={!selectedPersona || submitting}
          className={`px-8 py-4 ${designSystem.borderRadius.button} font-semibold text-lg ${designSystem.transitions.default} ${
            !selectedPersona || submitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {submitting ? 'Saving...' : currentPersona ? 'Update Persona' : 'Continue to Cautions'}
        </button>
      </div>
    </PageLayout>
  );
}
