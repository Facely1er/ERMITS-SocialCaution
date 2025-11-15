import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scale, FileText, Shield, Globe, AlertTriangle } from 'lucide-react';

interface NavItem {
  id: string;
  title: string;
  path: string;
  icon: React.ElementType;
  subItems?: {
    id: string;
    title: string;
    path: string;
  }[];
}

const navItems: NavItem[] = [
  {
    id: 'overview',
    title: 'Overview',
    path: '/privacy-laws',
    icon: Scale,
  },
  {
    id: 'global-privacy-act',
    title: 'Global Privacy Act',
    path: '/privacy-laws/global-privacy-act',
    icon: Globe,
    subItems: [
      { id: 'gpa-key-provisions', title: 'Key Provisions', path: '/privacy-laws/global-privacy-act#key-provisions' },
      { id: 'gpa-rights', title: 'Your Rights', path: '/privacy-laws/global-privacy-act#your-rights' }
    ]
  },
  {
    id: 'gdpr',
    title: 'GDPR Updates',
    path: '/privacy-laws/gdpr',
    icon: Shield,
    subItems: [
      { id: 'gdpr-changes', title: 'Key Changes', path: '/privacy-laws/gdpr#key-changes' },
      { id: 'gdpr-compliance', title: 'Compliance', path: '/privacy-laws/gdpr#compliance' }
    ]
  },
  {
    id: 'us-privacy',
    title: 'US Privacy Laws',
    path: '/privacy-laws/us-privacy',
    icon: FileText,
    subItems: [
      { id: 'federal', title: 'Federal Framework', path: '/privacy-laws/us-privacy#federal' },
      { id: 'state', title: 'State Laws', path: '/privacy-laws/us-privacy#state' }
    ]
  },
  {
    id: 'enforcement',
    title: 'Enforcement',
    path: '/privacy-laws/enforcement',
    icon: AlertTriangle,
  }
];

const VerticalNav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '#');
  };

  return (
    <div className="w-64 bg-white dark:bg-card rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-6 text-primary dark:text-white">Privacy Laws</h3>
      <nav>
        {navItems.map((item) => (
          <div key={item.id} className="mb-4">
            <Link
              to={item.path}
              className={`flex items-center py-2 px-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-accent/20 text-accent hover:bg-accent/30'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-card-hover'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.title}</span>
            </Link>
            {item.subItems && (
              <div className="ml-8 mt-2 space-y-2">
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.id}
                    to={subItem.path}
                    className={`block py-1 px-3 rounded-lg text-sm transition-colors ${
                      location.hash === '#' + subItem.id
                        ? 'text-accent'
                        : 'text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent'
                    }`}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default VerticalNav;