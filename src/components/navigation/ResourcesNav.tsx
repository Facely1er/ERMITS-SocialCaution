import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Wrench, List, Globe, Shield, FileText, Database, Eye } from 'lucide-react';

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
    title: 'Resources Overview',
    path: '/resources',
    icon: Globe,
    description: 'All privacy resources'
  },
  {
    id: 'tools',
    title: 'Privacy Tools',
    path: '/resources/tools',
    icon: Wrench,
    description: 'Interactive privacy tools'
  },
  {
    id: 'guides',
    title: 'Privacy Guides',
    path: '/resources/guides',
    icon: BookOpen,
    description: 'Step-by-step guides'
  },
  {
    id: 'checklists',
    title: 'Privacy Checklists',
    path: '/resources/checklists',
    icon: List,
    description: 'Actionable checklists'
  },
  {
    id: 'digital-footprint',
    title: 'Digital Footprint Analyzer',
    path: '/resources/tools/digital-footprint',
    icon: Eye,
    description: 'Analyze your online presence'
  },
  {
    id: 'cookie-tracker',
    title: 'Cookie & Tracker Scanner',
    path: '/resources/tools/cookie-tracker',
    icon: Shield,
    description: 'Scan website trackers'
  },
  {
    id: 'data-broker-removal',
    title: 'Data Broker Removal',
    path: '/resources/tools/data-broker-removal',
    icon: Database,
    description: 'Remove your data from brokers'
  },
  {
    id: 'personal-data-inventory',
    title: 'Personal Data Inventory',
    path: '/resources/tools/personal-data-inventory',
    icon: FileText,
    description: 'Track your personal data'
  }
];

const ResourcesNav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="w-64 bg-white dark:bg-card rounded-lg shadow-md p-6 sticky top-8 self-start">
      <h3 className="text-lg font-semibold mb-6 text-primary dark:text-white">Privacy Resources</h3>
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
          <Shield className="h-4 w-4 text-accent mr-2" />
          <span className="text-sm font-medium text-primary dark:text-white">Resource Types</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-300">
          Tools for analysis, guides for learning, and checklists for action. Use them together for comprehensive privacy protection.
        </p>
      </div>
    </div>
  );
};

export default ResourcesNav;