import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, Target, Calendar, TrendingUp, BarChart3, CheckCircle, ArrowRight } from 'lucide-react';

interface NavItem {
  id: string;
  title: string;
  path: string;
  icon: React.ElementType;
  description: string;
}

const navItems: NavItem[] = [
  {
    id: 'overview',
    title: 'Roadmap Overview',
    path: '/roadmap',
    icon: Map,
    description: 'Your privacy journey roadmap'
  },
  {
    id: 'assessment',
    title: 'Initial Assessment',
    path: '/roadmap/assessment',
    icon: BarChart3,
    description: 'Analyze your current privacy status'
  },
  {
    id: 'planning',
    title: 'Planning Phase',
    path: '/roadmap/planning',
    icon: Target,
    description: 'Create your personalized plan'
  },
  {
    id: 'implementation',
    title: 'Implementation',
    path: '/roadmap/implementation',
    icon: CheckCircle,
    description: 'Execute protection actions'
  },
  {
    id: 'monitoring',
    title: 'Monitoring',
    path: '/roadmap/monitoring',
    icon: TrendingUp,
    description: 'Track your progress'
  },
  {
    id: 'thirty-day',
    title: '30-Day Plan',
    path: '/roadmap/thirty-day',
    icon: Calendar,
    description: 'Quick start privacy plan'
  }
];

const RoadmapNav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="w-64 bg-white dark:bg-card rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-6 text-primary dark:text-white">Privacy Roadmap</h3>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`flex items-start p-3 rounded-lg transition-colors group ${
              isActive(item.path)
                ? 'bg-accent/20 text-accent border-l-4 border-accent'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-card-hover'
            }`}
          >
            <item.icon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm">{item.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {item.description}
              </div>
            </div>
          </Link>
        ))}
      </nav>
      
      <div className="mt-6 p-4 bg-accent/5 dark:bg-accent/10 rounded-lg">
        <div className="flex items-center mb-2">
          <ArrowRight className="h-4 w-4 text-accent mr-2" />
          <span className="text-sm font-medium text-primary dark:text-white">Next Steps</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-300">
          Follow the roadmap steps in order for the best results. Each phase builds upon the previous one.
        </p>
      </div>
    </div>
  );
};

export default RoadmapNav;