import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  ArrowRight, 
  Clock, 
  Star, 
  Zap, 
  Shield, 
  BookOpen, 
  Users, 
  TrendingUp,
  Target,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
interface QuickAction {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<any>;
  color: string;
  priority: number;
  category: string;
}

interface ContextualNavProps {
  className?: string;
}

const ContextualNav: React.FC<ContextualNavProps> = ({ className = '' }) => {
  const location = useLocation();
  const [suggestedActions, setSuggestedActions] = useState<QuickAction[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  // Define quick actions based on context
  const quickActions: QuickAction[] = useMemo(() => [
    // Assessment actions
    {
      id: 'start-assessment',
      title: 'Start Privacy Assessment',
      description: 'Evaluate your privacy status',
      path: '/assessment',
      icon: Shield,
      color: 'text-accent',
      priority: 10,
      category: 'assessment'
    },
    {
      id: 'exposure-check',
      title: 'Check Digital Exposure',
      description: 'Analyze your online footprint',
      path: '/assessment/exposure',
      icon: Target,
      color: 'text-danger',
      priority: 9,
      category: 'assessment'
    },
    {
      id: 'rights-checkup',
      title: 'Privacy Rights Checkup',
      description: 'Understand your privacy rights',
      path: '/assessment/rights',
      icon: CheckCircle,
      color: 'text-success',
      priority: 8,
      category: 'assessment'
    },
    // Dashboard actions
    {
      id: 'view-dashboard',
      title: 'View Dashboard',
      description: 'See your privacy overview',
      path: '/dashboard',
      icon: TrendingUp,
      color: 'text-primary',
      priority: 7,
      category: 'dashboard'
    },
    {
      id: 'action-plan',
      title: 'View Action Plan',
      description: 'Track your privacy improvements',
      path: '/dashboard/action-plan',
      icon: Target,
      color: 'text-accent',
      priority: 6,
      category: 'dashboard'
    },
    // Persona actions
    {
      id: 'find-persona',
      title: 'Find Your Persona',
      description: 'Discover your privacy profile',
      path: '/personas',
      icon: Users,
      color: 'text-primary',
      priority: 8,
      category: 'persona'
    },
    {
      id: 'cautious-parent',
      title: 'Cautious Parent Profile',
      description: 'Family privacy protection',
      path: '/personas/cautious-parent',
      icon: Shield,
      color: 'text-danger',
      priority: 5,
      category: 'persona'
    },
    // Resource actions
    {
      id: 'privacy-guides',
      title: 'Privacy Guides',
      description: 'Learn privacy best practices',
      path: '/resources/guides',
      icon: BookOpen,
      color: 'text-success',
      priority: 6,
      category: 'resources'
    },
    {
      id: 'privacy-tools',
      title: 'Privacy Tools',
      description: 'Use privacy protection tools',
      path: '/resources/tools',
      icon: Zap,
      color: 'text-warning',
      priority: 5,
      category: 'resources'
    },
    // Journey actions
    {
      id: 'privacy-journey',
      title: 'Start Privacy Journey',
      description: 'Begin your privacy improvement',
      path: '/privacy-journey',
      icon: ArrowRight,
      color: 'text-accent',
      priority: 7,
      category: 'journey'
    },
    {
      id: '30-day-roadmap',
      title: '30-Day Roadmap',
      description: 'Follow a structured privacy plan',
      path: '/30-day-roadmap',
      icon: Clock,
      color: 'text-primary',
      priority: 6,
      category: 'journey'
    }
  ], []);

  // Get contextual actions based on current page
  const getContextualActions = useCallback((): QuickAction[] => {
    const currentPath = location.pathname;
    
    // Filter actions based on current context
    let filteredActions = quickActions;
    
    // If on assessment page, prioritize assessment actions
    if (currentPath.includes('/assessment')) {
      filteredActions = quickActions.filter(action => 
        action.category === 'assessment' || action.category === 'dashboard'
      );
    }
    // If on persona page, prioritize persona actions
    else if (currentPath.includes('/personas')) {
      filteredActions = quickActions.filter(action => 
        action.category === 'persona' || action.category === 'assessment'
      );
    }
    // If on dashboard, prioritize dashboard actions
    else if (currentPath.includes('/dashboard')) {
      filteredActions = quickActions.filter(action => 
        action.category === 'dashboard' || action.category === 'journey'
      );
    }
    // If on resources, prioritize resource actions
    else if (currentPath.includes('/resources')) {
      filteredActions = quickActions.filter(action => 
        action.category === 'resources' || action.category === 'tools'
      );
    }
    // If on home page, show most important actions
    else if (currentPath === '/') {
      filteredActions = quickActions.filter(action => 
        action.priority >= 7
      );
    }
    
    // Sort by priority and return top 4
    return filteredActions
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 4);
  }, [location.pathname, quickActions]);

  // Update suggested actions when location changes
  useEffect(() => {
    const actions = getContextualActions();
    setSuggestedActions(actions);
    
    // Show contextual nav after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [location.pathname, getContextualActions]);

  // Hide contextual nav on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (suggestedActions.length === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 ${className}`}
        >
          <div className="bg-white dark:bg-card rounded-xl shadow-2xl border border-border p-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Star className="h-4 w-4 text-accent" />
                Quick Actions
              </h3>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded p-1"
                aria-label="Close quick actions"
                type="button"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {suggestedActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.id}
                    to={action.path}
                    className="group block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-accent hover:shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    aria-label={`${action.title}: ${action.description}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 ${action.color}`}>
                        <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                          {action.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContextualNav;