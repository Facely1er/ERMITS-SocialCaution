import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
  Target,
  Star,
  Shield,
  Users,
  BookOpen,
  ArrowRight
} from 'lucide-react';
interface ProgressStep {
  id: string;
  title: string;
  path: string;
  icon: React.ComponentType<any>;
}

interface CompactProgressTrackerProps {
  className?: string;
}

const CompactProgressTracker: React.FC<CompactProgressTrackerProps> = ({
  className = ''
}) => {
  const location = useLocation();

  const progressSteps: ProgressStep[] = [
    {
      id: 'home',
      title: 'Welcome',
      path: '/',
      icon: Star
    },
    {
      id: 'personas',
      title: 'Find Your Persona',
      path: '/personas',
      icon: Users
    },
    {
      id: 'assessment',
      title: 'Take Assessment',
      path: '/assessment',
      icon: Shield
    },
    {
      id: 'dashboard',
      title: 'View Dashboard',
      path: '/dashboard',
      icon: Target
    },
    {
      id: 'resources',
      title: 'Explore Resources',
      path: '/resources',
      icon: BookOpen
    },
    {
      id: 'journey',
      title: 'Privacy Journey',
      path: '/privacy-journey',
      icon: ArrowRight
    }
  ];

  const calculateProgress = (): { progress: number; currentStep: ProgressStep | null; completedCount: number } => {
    const currentPath = location.pathname;

    const currentStepIndex = progressSteps.findIndex(step =>
      currentPath === step.path || currentPath.startsWith(step.path + '/')
    );

    if (currentStepIndex === -1) {
      return { progress: 0, currentStep: null, completedCount: 0 };
    }

    const progress = ((currentStepIndex + 1) / progressSteps.length) * 100;
    const currentStep = progressSteps[currentStepIndex];
    const completedCount = currentStepIndex;

    return { progress, currentStep, completedCount };
  };

  const { progress, currentStep, completedCount } = calculateProgress();

  if (!currentStep) return null;

  const CurrentStepIcon = currentStep.icon;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Progress Bar - Compact version */}
      <div className="flex items-center gap-2 px-2 py-1 bg-accent/10 dark:bg-accent/20 rounded-md border border-accent/30">
        <div className="flex items-center gap-1">
          <Target className="h-3 w-3 text-accent" />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Progress:
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="w-12 sm:w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <span className="text-xs font-bold text-accent min-w-[1.5rem] text-right">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Current Step Indicator - Compact version */}
      <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
        <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
          <CurrentStepIcon className="h-2.5 w-2.5 text-white" />
        </div>

        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-[9px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Current Step
          </span>
          <span className="text-xs font-semibold text-gray-900 dark:text-white">
            {currentStep.title}
          </span>
        </div>

        <div className="sm:hidden">
          <span className="text-xs font-semibold text-gray-900 dark:text-white">
            {currentStep.title}
          </span>
        </div>
      </div>

      {/* Steps Counter - Only show on larger screens */}
      <div className="hidden lg:flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-md">
        <span className="font-medium text-green-600 dark:text-green-400">{completedCount}</span>
        <span>/</span>
        <span className="font-medium">{progressSteps.length}</span>
        <span className="ml-1">steps</span>
      </div>
    </div>
  );
};

export default CompactProgressTracker;
