import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Shield, Search, FileText, User, Database, Eye, Lock, Info, Check } from 'lucide-react';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import MatrixBackground from './MatrixBackground';

interface Step {
  title: string;
  description: string;
  icon: React.ElementType;
  action?: {
    text: string;
    path: string;
  };
  showBanner?: boolean;
}

interface BannerOption {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  path: string;
  category: 'exposure' | 'protection';
}

const WelcomeWalkthrough: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'exposure' | 'protection'>('exposure');
  const navigate = useNavigate();

  // Check if this is the first visit
  useEffect(() => {
    const hasSeenWalkthrough = localStorage.getItem('hasSeenWalkthrough');
    if (!hasSeenWalkthrough) {
      // Wait a bit before showing the walkthrough
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Get translated steps based on current language
  const getTranslatedSteps = (): Step[] => {
    return [
        {
          title: "Welcome to SocialCaution",
          description: "Your comprehensive platform for digital privacy protection. We'll help you understand and control your digital footprint.",
          icon: Shield,
          action: {
            text: "Get Started",
            path: ""
          }
        },
        {
          title: "What concerns you most?",
          description: "Tell me what concerns you most about your online privacy, and I'll guide you to the most relevant resources.",
          icon: Info,
          showBanner: true
        },
        {
          title: "Explore Our Resources",
          description: "We have a variety of tools, guides, and resources to help you protect your online privacy.",
          icon: FileText,
          action: {
            text: "Explore Resources",
            path: "/toolkit"
          }
        }
      ];
  };

  // Get banner options
  const getTranslatedBannerOptions = (): BannerOption[] => {
    return [
      {
        id: 'digital-exposure',
        title: 'Digital Exposure',
        icon: Eye,
        description: 'Discover where your information is exposed online',
        path: '/help/digital-exposure',
        category: 'exposure'
      },
      {
        id: 'data-brokers',
        title: 'Data Brokers',
        icon: Database,
        description: 'Understand how your data is collected and sold',
        path: '/help/data-brokers',
        category: 'exposure'
      },
      {
        id: 'online-tracking',
        title: 'Online Tracking',
        icon: Search,
        description: 'Discover who is tracking your online activity',
        path: '/help/online-tracking',
        category: 'exposure'
      },
      {
        id: 'identity-protection',
        title: 'Identity Protection',
        icon: User,
        description: 'Protect your personal information from theft',
        path: '/help/identity-protection',
        category: 'protection'
      },
      {
        id: 'data-minimization',
        title: 'Data Minimization',
        icon: Database,
        description: 'Reduce your digital footprint and limit data sharing',
        path: '/help/data-minimization',
        category: 'protection'
      },
      {
        id: 'tracking-prevention',
        title: 'Tracking Prevention',
        icon: Lock,
        description: 'Stop online surveillance and ad tracking',
        path: '/help/tracking-prevention',
        category: 'protection'
      }
    ];
  };

  const steps = getTranslatedSteps();
  const bannerOptions = getTranslatedBannerOptions();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleAction = () => {
    const action = steps[currentStep].action;
    if (action && action.path) {
      navigate(action.path);
    }
    handleNext();
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenWalkthrough', 'true');
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    const option = bannerOptions.find(opt => opt.id === optionId);
    if (option) {
      // Wait a moment before navigating to show the selection
      setTimeout(() => {
        navigate(option.path);
        handleClose();
      }, 500);
    }
  };

  // Get category tabs
  const getTranslatedCategoryTabs = () => {
    return {
      exposure: "Digital Exposure",
      protection: "Protection Priorities"
    };
  };

  // Get recommendation text
  const getTranslatedRecommendation = () => {
    return "Recommended Resources";
  };

  // Get based on selection text
  const getTranslatedBasedOn = () => {
    return "Here are resources to help you with";
  };

  // Get learn more button text
  const getTranslatedLearnMore = () => {
    return "Learn More";
  };

  // Get assessment button text
  const getTranslatedAssessment = () => {
    return "Take Assessment";
  };

  // Get skip step text
  const getTranslatedSkipStep = () => {
    return "Skip this step";
  };

  // Get back button text
  const getTranslatedBack = () => {
    return "Back";
  };

  const categoryTabs = getTranslatedCategoryTabs();
  const filteredOptions = bannerOptions.filter(option => option.category === selectedCategory);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-card rounded-xl shadow-xl max-w-md w-full relative overflow-hidden"
        >
          {/* Matrix background for subtle animation */}
          <div className="absolute inset-0 overflow-hidden">
            <MatrixBackground color="rgba(0, 255, 170, 0.8)" opacity={0.02} speed={0.5} density={0.1} />
          </div>
          
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 z-10"
            aria-label="Close walkthrough"
            title="Close walkthrough"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Progress bar */}
          <div className="h-1 bg-gray-200 dark:bg-gray-700 relative z-10">
            <motion.div
              className="h-full bg-accent"
              initial={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="p-6 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-center mb-6">
                  <div className="p-3 bg-accent/10 rounded-full">
                    {React.createElement(steps[currentStep].icon, { className: "h-8 w-8 text-accent" })}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-primary dark:text-white text-center mb-3">
                  {steps[currentStep].title}
                </h2>

                <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
                  {steps[currentStep].description}
                </p>

                {/* Banner selection menu */}
                {steps[currentStep].showBanner && (
                  <div className="mb-8">
                    {/* Category tabs */}
                    <div className="flex mb-4 border-b border-gray-200 dark:border-gray-700">
                      <button
                        type="button"
                        className={`flex-1 py-2 text-sm font-medium ${
                          selectedCategory === 'exposure'
                            ? 'text-accent border-b-2 border-accent'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                        onClick={() => setSelectedCategory('exposure')}
                      >
                        <div className="flex items-center justify-center">
                          <Eye className="h-4 w-4 mr-2" />
                          {categoryTabs.exposure}
                        </div>
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-2 text-sm font-medium ${
                          selectedCategory === 'protection'
                            ? 'text-accent border-b-2 border-accent'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                        onClick={() => setSelectedCategory('protection')}
                      >
                        <div className="flex items-center justify-center">
                          <Shield className="h-4 w-4 mr-2" />
                          {categoryTabs.protection}
                        </div>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {filteredOptions.map((option) => (
                        <motion.button
                          key={option.id}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            selectedOption === option.id
                              ? 'border-accent bg-accent/10'
                              : 'border-gray-200 dark:border-gray-700 hover:border-accent/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                          onClick={() => handleOptionSelect(option.id)}
                          whileHover={{ y: -2 }}
                        >
                          <div className="flex items-center">
                            <div className="p-2 bg-accent/10 rounded-full mr-3">
                              <option.icon className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                              <div className="font-medium text-primary dark:text-white">{option.title}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{option.description}</div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {selectedOption && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-light-blue/10 dark:bg-blue-900/20 rounded-lg"
                      >
                        <h4 className="font-medium text-primary dark:text-white mb-2">{getTranslatedRecommendation()}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {getTranslatedBasedOn()} <span className="font-medium">{bannerOptions.find(opt => opt.id === selectedOption)?.title.toLowerCase()}</span>.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            variant="primary"
                            onClick={() => {
                              const option = bannerOptions.find(opt => opt.id === selectedOption);
                              if (option) {
                                navigate(option.path);
                                handleClose();
                              }
                            }}
                            className="flex-1"
                          >
                            {getTranslatedLearnMore()}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              navigate('/assessment');
                              handleClose();
                            }}
                            className="flex-1"
                          >
                            {getTranslatedAssessment()}
                            <Check className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  {currentStep > 0 && !steps[currentStep].showBanner && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(prev => prev - 1)}
                    >
                      {getTranslatedBack()}
                    </Button>
                  )}

                  {!steps[currentStep].showBanner && (
                    <Button
                      variant="primary"
                      onClick={handleAction}
                    >
                      {steps[currentStep].action?.text || 
                       ('Next')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}

                  {steps[currentStep].showBanner && !selectedOption && (
                    <Button
                      variant="outline"
                      onClick={handleNext}
                    >
                      {getTranslatedSkipStep()}
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WelcomeWalkthrough;