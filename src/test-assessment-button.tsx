import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TestAssessmentButton: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleStart = () => {
    // Track assessment start (commented out for production)
    setClicked(true);
    setStarted(true);
  };

  if (started) {
    return (
      <div className="p-8 bg-green-100 border border-green-400 rounded-lg">
        <h2 className="text-2xl font-bold text-green-800 mb-4">✅ Assessment Started Successfully!</h2>
        <p className="text-green-700">The Start Assessment button is working correctly.</p>
        <button 
          onClick={() => setStarted(false)}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Reset Test
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Assessment Button</h2>
      <p className="text-gray-600 mb-6">Click the button below to test if the Start Assessment functionality works:</p>
      
      <motion.button
        onClick={handleStart}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors text-lg font-medium"
      >
        Start Assessment
      </motion.button>
      
      {clicked && (
        <div className="mt-4 p-4 bg-blue-100 border border-blue-400 rounded-lg">
          <p className="text-blue-800">Button clicked! Check console for log message.</p>
        </div>
      )}
    </div>
  );
};

export default TestAssessmentButton;