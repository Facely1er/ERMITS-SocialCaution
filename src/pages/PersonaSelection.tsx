import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllPersonas, selectPersona, getCurrentUserPersona, type Persona } from '../services/cautionApi';
import { Shield, CheckCircle } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading personas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-16 w-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
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
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Persona Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {personas.map((persona) => (
            <motion.div
              key={persona._id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative cursor-pointer rounded-xl p-6 border-2 transition-all ${
                selectedPersona?.name === persona.name
                  ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {persona.displayName}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4">
                {persona.description}
              </p>

              {/* Target Audience */}
              <p className="text-xs text-gray-500 italic">
                {persona.targetAudience}
              </p>

              {/* Risk Categories */}
              <div className="mt-4 flex flex-wrap gap-2">
                {persona.riskCategories.slice(0, 3).map((category) => (
                  <span
                    key={category}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {category.replace('-', ' ')}
                  </span>
                ))}
                {persona.riskCategories.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
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
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Privacy Rights as {selectedPersona.displayName}
            </h2>
            <div className="space-y-4">
              {selectedPersona.privacyRights.map((right, index) => (
                <div key={index} className="border-l-4 border-indigo-600 pl-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    {right.title}
                    {right.actionable && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Actionable
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{right.description}</p>
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
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
              !selectedPersona || submitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {submitting ? 'Saving...' : currentPersona ? 'Update Persona' : 'Continue to Cautions'}
          </button>
        </div>
      </div>
    </div>
  );
}
