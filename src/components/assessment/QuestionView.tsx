import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Lock, UserPlus, Link as LinkIcon, Wifi, Settings, Share, MapPin, Apple as Apps } from 'lucide-react';
import type { Question, Answer } from '../../types/assessment';

interface QuestionViewProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  answer?: Answer;
  onAnswer: (answer: Answer) => void;
  onNext: () => void;
  onPrevious: () => void;
  onBack: () => void;
}

const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  currentIndex,
  totalQuestions,
  answer,
  onAnswer,
  onNext,
  onPrevious,
  onBack
}) => {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Privacy Configuration':
        return <Lock className="h-5 w-5 text-blue-600" />;
      case 'Account Security':
        return <Shield className="h-5 w-5 text-green-600" />;
      case 'Social Connections':
        return <UserPlus className="h-5 w-5 text-purple-600" />;
      case 'Scam Prevention':
        return <LinkIcon className="h-5 w-5 text-red-600" />;
      case 'Network Security':
        return <Wifi className="h-5 w-5 text-orange-600" />;
      case 'Data Permissions':
        return <Settings className="h-5 w-5 text-indigo-600" />;
      case 'Content Management':
        return <Share className="h-5 w-5 text-teal-600" />;
      case 'Location Privacy':
        return <MapPin className="h-5 w-5 text-pink-600" />;
      case 'App Security':
        return <Apps className="h-5 w-5 text-cyan-600" />;
      default:
        return <Shield className="h-5 w-5 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 md:p-10">
      {/* Category */}
      <div className="flex items-center space-x-3 mb-8">
        {getCategoryIcon(question.category)}
        <span className="text-lg font-medium text-slate-900 dark:text-white">
          {question.category}
        </span>
        {question.importance === 'critical' && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Critical
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center text-sm mb-3">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="font-semibold text-accent">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
          <motion.div 
            className="bg-accent h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
        {question.text}
      </h2>

      <div className="space-y-3 mb-10">
        {question.options.map((option) => (
          <motion.button
            key={option.value}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onAnswer({ value: option.value, score: option.score, level: option.level })}
            className={`w-full p-5 rounded-lg text-left transition-all duration-200 ${
              answer?.value === option.value
                ? 'bg-accent/10 dark:bg-accent/20 border-2 border-accent shadow-md'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 hover:border-accent/50'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center flex-shrink-0 ${
                answer?.value === option.value
                  ? 'bg-accent'
                  : 'border-2 border-slate-400 dark:border-slate-600'
              }`}>
                {answer?.value === option.value && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                )}
              </div>
              <div className="flex-1">
                <span className={`block font-medium ${
                  answer?.value === option.value
                    ? 'text-accent dark:text-accent'
                    : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {option.text}
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700">
        {currentIndex === 0 ? (
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-lg flex items-center space-x-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
        ) : (
          <button
            onClick={onPrevious}
            className="px-6 py-3 rounded-lg flex items-center space-x-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous</span>
          </button>
        )}

        <button
          onClick={onNext}
          disabled={!answer}
          className={`px-6 py-3 rounded-lg flex items-center space-x-2 font-medium transition-all ${
            !answer
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              : 'bg-accent text-white hover:bg-accent/90 shadow-md hover:shadow-lg transform hover:scale-105'
          }`}
        >
          <span>{currentIndex === totalQuestions - 1 ? 'See Results' : 'Next'}</span>
          {currentIndex < totalQuestions - 1 && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Standards Mapping */}
      {question.standards && (
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Standards & Regulations Coverage
          </h3>
          <div className="space-y-4">
            {question.standards.map((standard, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                  {standard.name}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {standard.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionView;