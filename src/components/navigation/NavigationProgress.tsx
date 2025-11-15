import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Target, 
  Star,
  Shield,
  Users,
  BookOpen
} from 'lucide-react';
interface ProgressStep {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<any>;
  completed: boolean;
  current: boolean;
  category: string;
}

interface NavigationProgressProps {
  className?: string;
  showOnPages?: string[];
  hideOnPages?: string[];
}

const NavigationProgress: React.FC<NavigationProgressProps> = ({
  className = '',
  showOnPages = ['/assessment', '/personas', '/dashboard', '/resources'],
  hideOnPages = ['/']
}) => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  // Define progress steps
  const progressSteps: ProgressStep[] = useMemo(() => [
    {
      id: 'home',
      title: 'Welcome',
      description: 'Get started with SocialCaution',
      path: '/',
      icon: Star,
      completed: false,
      current: false,
      category: 'onboarding'
    },
    {
      id: 'personas',
      title: 'Find Your Persona',
      description: 'Discover your privacy profile',
      path: '/personas',
      icon: Users,
      completed: false,
      current: false,
      category: 'discovery'
    },
    {
      id: 'assessment',
      title: 'Take Assessment',
      description: 'Evaluate your privacy status',
      path: '/assessment',
      icon: Shield,
      completed: false,
      current: false,
      category: 'evaluation'
    },
    {
      id: 'dashboard',
      title: 'View Dashboard',
      description: 'See your privacy overview',
      path: '/dashboard',
      icon: Target,
      completed: false,
      current: false,
      category: 'management'
    },
    {
      id: 'resources',
      title: 'Explore Resources',
      description: 'Learn and use privacy tools',
      path: '/resources',
      icon: BookOpen,
      completed: false,
      current: false,
      category: 'learning'
    },
    {
      id: 'journey',
      title: 'Privacy Journey',
      description: 'Follow your improvement path',
      path: '/privacy-journey',
      icon: ArrowRight,
      completed: false,
      current: false,
      category: 'journey'
    }
  ], []);

  // Calculate progress based on current location
  const calculateProgress = useCallback((): { progress: number; currentStep: string | null } => {
    const currentPath = location.pathname;
    
    // Find current step
    const currentStepIndex = progressSteps.findIndex(step => 
      currentPath === step.path || currentPath.startsWith(step.path + '/')
    );
    
    if (currentStepIndex === -1) {
      return { progress: 0, currentStep: null };
    }
    
    // Mark previous steps as completed (currently unused but kept for future features)
    // const updatedSteps = progressSteps.map((step, index) => ({
    //   ...step,
    //   completed: index < currentStepIndex,
    //   current: index === currentStepIndex
    // }));
    
    const progress = ((currentStepIndex + 1) / progressSteps.length) * 100;
    const currentStepId = progressSteps[currentStepIndex].id;
    
    return { progress, currentStep: currentStepId };
  }, [location.pathname, progressSteps]);

  // Update progress when location changes
  useEffect(() => {
    const { progress, currentStep } = calculateProgress();
    setProgress(progress);
    setCurrentStep(currentStep);
  }, [location.pathname, calculateProgress]);

  // Check if progress should be shown
  const shouldShow = () => {
    const currentPath = location.pathname;
    
    // Hide on specific pages
    if (hideOnPages.some(page => currentPath === page)) {
      return false;
    }
    
    // Show on specific pages
    if (showOnPages.some(page => currentPath.startsWith(page))) {
      return true;
    }
    
    // Default to showing if not explicitly hidden
    return !hideOnPages.some(page => currentPath === page);
  };

  if (!shouldShow()) return null;

  const currentStepData = progressSteps.find(step => step.id === currentStep);
  const completedSteps = progressSteps.filter(step => step.completed);
  const remainingSteps = progressSteps.filter(step => !step.completed && !step.current);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white dark:bg-card rounded-lg shadow-lg border border-border p-4 ${className}`}
    >
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
            <Target className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Your Privacy Journey
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Track your progress
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-accent">
            {Math.round(progress)}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Complete
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent to-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Current Step */}
      {currentStepData && (
        <div className="mb-4 p-3 bg-accent/5 rounded-lg border border-accent/20">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
              <currentStepData.icon className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Current Step: {currentStepData.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {currentStepData.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="space-y-2">
        {/* Completed Steps */}
        {completedSteps.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Completed ({completedSteps.length})
            </h4>
            {completedSteps.map((step) => {
              const StepIcon = step.icon;
              return (
                <div key={step.id} className="flex items-center gap-3 p-2 rounded-md bg-green-50 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <StepIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-700 dark:text-green-300">
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Current Step */}
        {currentStepData && (
          <div className="space-y-1">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Current
            </h4>
            <div className="flex items-center gap-3 p-2 rounded-md bg-accent/10 border border-accent/20">
              <Circle className="h-4 w-4 text-accent" />
              <currentStepData.icon className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">
                {currentStepData.title}
              </span>
            </div>
          </div>
        )}

        {/* Remaining Steps */}
        {remainingSteps.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Remaining ({remainingSteps.length})
            </h4>
            {remainingSteps.slice(0, 3).map((step) => {
              const StepIcon = step.icon;
              return (
                <div key={step.id} className="flex items-center gap-3 p-2 rounded-md bg-gray-50 dark:bg-card-hover">
                  <Circle className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                  <StepIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {step.title}
                  </span>
                </div>
              );
            })}
            {remainingSteps.length > 3 && (
              <div className="text-xs text-gray-400 dark:text-gray-500 pl-7">
                +{remainingSteps.length - 3} more steps
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-accent">
              {completedSteps.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Completed
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">
              {remainingSteps.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Remaining
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-success">
              {Math.round(progress)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Progress
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NavigationProgress;