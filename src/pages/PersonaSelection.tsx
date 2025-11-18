import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllPersonas, selectPersona, getCurrentUserPersona, type Persona } from '../services/cautionApi';
import { Shield, CheckCircle, Users, Sparkles } from 'lucide-react';
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
    setError(''); // Clear any previous errors
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
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading personas...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout variant="centered">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <Shield className="h-20 w-20 text-indigo-600" />
            <Sparkles className="h-8 w-8 text-purple-500 absolute -top-2 -right-2" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Choose Your Privacy Persona
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Select the persona that best matches your needs to receive tailored privacy alerts and personalized risk information
        </p>
        {currentPersona && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full"
          >
            <Users className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">
              Current: {personas.find(p => p.name === currentPersona)?.displayName}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`${designSystem.spacing.section} bg-red-50 border-l-4 border-red-500 ${designSystem.borderRadius.card} ${designSystem.spacing.card}`}
          >
            <p className="text-red-800 font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persona Grid */}
      <div className={`${designSystem.grid.personas} ${designSystem.spacing.section}`}>
        {personas.map((persona, index) => (
          <motion.div
            key={persona._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={`relative cursor-pointer ${designSystem.borderRadius.card} ${designSystem.spacing.card} border-2 ${designSystem.transitions.default} ${
              selectedPersona?.name === persona.name
                ? 'border-indigo-600 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl ring-4 ring-indigo-100'
                : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-lg focus-visible:ring-4 focus-visible:ring-indigo-200 focus-visible:outline-none'
            }`}
            onClick={() => handleSelectPersona(persona)}
            tabIndex={0}
            role="button"
            aria-label={`Select ${persona.displayName} persona`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectPersona(persona);
              }
            }}
          >
            {/* Selected Indicator */}
            <AnimatePresence>
              {selectedPersona?.name === persona.name && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className="absolute -top-3 -right-3 bg-indigo-600 rounded-full p-2 shadow-lg"
                >
                  <CheckCircle className="h-6 w-6 text-white" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Icon */}
            <div className="text-6xl mb-4 transform transition-transform group-hover:scale-110">
              {persona.icon}
            </div>

            {/* Name */}
            <h3 className={`text-xl font-bold text-gray-900 mb-3`}>
              {persona.displayName}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 leading-relaxed min-h-[3rem]">
              {persona.description}
            </p>

            {/* Target Audience */}
            <p className="text-xs text-gray-500 italic mb-4 pb-4 border-b border-gray-200">
              {persona.targetAudience}
            </p>

            {/* Risk Categories */}
            <div className="flex flex-wrap gap-2">
              {persona.riskCategories.slice(0, 3).map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200"
                >
                  {category.replace('-', ' ')}
                </span>
              ))}
              {persona.riskCategories.length > 3 && (
                <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
                  +{persona.riskCategories.length - 3} more
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Persona Details */}
      <AnimatePresence>
        {selectedPersona && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`bg-gradient-to-br from-white to-indigo-50/30 ${designSystem.borderRadius.card} ${designSystem.shadow.large} ${designSystem.spacing.card} ${designSystem.spacing.section} border border-indigo-100`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Your Privacy Rights as {selectedPersona.displayName}
              </h2>
            </div>
            <div className="space-y-5">
              {selectedPersona.privacyRights.map((right, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border-l-4 border-indigo-600 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                    {right.title}
                    {right.actionable && (
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium border border-green-200">
                        ✓ Actionable
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{right.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-8"
      >
        <button
          onClick={handleContinue}
          disabled={!selectedPersona || submitting}
          className={`relative px-10 py-4 ${designSystem.borderRadius.button} font-semibold text-lg ${designSystem.transitions.default} focus-visible:ring-4 focus-visible:ring-indigo-300 focus-visible:outline-none ${
            !selectedPersona || submitting
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
          }`}
          aria-label={currentPersona ? 'Update persona selection' : 'Continue to cautions feed'}
        >
          {submitting ? (
            <span className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {currentPersona ? 'Update Persona' : 'Continue to Cautions'}
              <span className="text-xl">→</span>
            </span>
          )}
        </button>
        {selectedPersona && !currentPersona && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm text-gray-500"
          >
            You'll see personalized alerts tailored for {selectedPersona.displayName}
          </motion.p>
        )}
      </motion.div>
    </PageLayout>
  );
}
