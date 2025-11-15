import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllPersonas, selectPersona, getCurrentUserPersona, type Persona } from '../services/cautionApi';
import { Shield, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { PersonaCardSkeleton } from '../components/mvp/SkeletonLoader';
import ErrorState from '../components/mvp/ErrorState';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/mvp/Toast';

export default function PersonaSelectionEnhanced() {
  const navigate = useNavigate();
  const toast = useToast();
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
      setError('');
      const [personasData, currentUserPersona] = await Promise.all([
        getAllPersonas(),
        getCurrentUserPersona()
      ]);
      setPersonas(personasData);
      if (currentUserPersona) {
        setCurrentPersona(currentUserPersona.name);
        setSelectedPersona(currentUserPersona);
        toast.info(`Current persona: ${currentUserPersona.displayName}`);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load personas';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPersona = (persona: Persona) => {
    setSelectedPersona(persona);
    setError('');
  };

  const handleContinue = async () => {
    if (!selectedPersona) {
      const errorMsg = 'Please select a persona';
      setError(errorMsg);
      toast.warning(errorMsg);
      return;
    }

    try {
      setSubmitting(true);
      await selectPersona(selectedPersona.name);
      toast.success(`Persona selected: ${selectedPersona.displayName}`);

      // Small delay for toast to show
      setTimeout(() => {
        navigate('/cautions');
      }, 500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to select persona';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-128 mx-auto animate-pulse"></div>
          </div>

          {/* Personas Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <PersonaCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && personas.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ErrorState
            title="Unable to Load Personas"
            message={error}
            onRetry={loadPersonas}
            showHomeButton
            onGoHome={() => navigate('/dashboard')}
          />
        </div>
        <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="relative">
              <Shield className="h-16 w-16 text-indigo-600" />
              <Sparkles className="h-6 w-6 text-purple-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Privacy Persona
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the persona that best matches your needs to receive tailored privacy alerts and risk information
          </p>

          {currentPersona && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full"
            >
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Current: {personas.find(p => p.name === currentPersona)?.displayName}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Personas Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <AnimatePresence mode="wait">
            {personas.map((persona, index) => (
              <motion.div
                key={persona._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`relative cursor-pointer rounded-xl p-6 border-2 transition-all ${
                  selectedPersona?.name === persona.name
                    ? 'border-indigo-600 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl ring-4 ring-indigo-100'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-lg'
                }`}
                onClick={() => handleSelectPersona(persona)}
              >
                {/* Selected Indicator */}
                <AnimatePresence>
                  {selectedPersona?.name === persona.name && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-4 right-4"
                    >
                      <div className="bg-indigo-600 rounded-full p-1">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Icon */}
                <div className="text-5xl mb-4">{persona.icon}</div>

                {/* Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {persona.displayName}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {persona.description}
                </p>

                {/* Target Audience */}
                <p className="text-xs text-gray-500 italic mb-4">
                  {persona.targetAudience}
                </p>

                {/* Risk Categories */}
                <div className="flex flex-wrap gap-2">
                  {persona.riskCategories.slice(0, 3).map((category) => (
                    <span
                      key={category}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                    >
                      {category.replace('-', ' ')}
                    </span>
                  ))}
                  {persona.riskCategories.length > 3 && (
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                      +{persona.riskCategories.length - 3}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Selected Persona Details */}
        <AnimatePresence mode="wait">
          {selectedPersona && (
            <motion.div
              key={selectedPersona._id}
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">{selectedPersona.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Your Privacy Rights as {selectedPersona.displayName}
                  </h2>
                  <p className="text-gray-600">{selectedPersona.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedPersona.privacyRights.map((right, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-l-4 border-indigo-600 pl-4 py-2 bg-gradient-to-r from-indigo-50 to-transparent rounded-r-lg"
                  >
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-1">
                      {right.title}
                      {right.actionable && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          Actionable
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-600 text-sm">{right.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <motion.button
            onClick={handleContinue}
            disabled={!selectedPersona || submitting}
            whileHover={selectedPersona && !submitting ? { scale: 1.05 } : {}}
            whileTap={selectedPersona && !submitting ? { scale: 0.95 } : {}}
            className={`group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
              !selectedPersona || submitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {submitting ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {currentPersona ? 'Update Persona' : 'Continue to Cautions'}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-red-600 text-sm"
            >
              {error}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
