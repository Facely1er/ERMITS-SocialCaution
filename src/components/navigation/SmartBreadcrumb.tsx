import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import CompactProgressTracker from './CompactProgressTracker';

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ComponentType<any>;
  isActive?: boolean;
}

interface SmartBreadcrumbProps {
  items?: BreadcrumbItem[];
  showBackButton?: boolean;
  showProgress?: boolean;
  className?: string;
}

const SmartBreadcrumb: React.FC<SmartBreadcrumbProps> = ({
  items,
  showBackButton = true,
  showProgress = false,
  className = ''
}) => {
  const location = useLocation();

  // Generate breadcrumbs from current path if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/', icon: Home }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        path: isLast ? undefined : currentPath,
        isActive: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Handle back button click
  const handleBackClick = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to home if no history
      window.location.href = '/';
    }
  };

  return (
    <div className={`flex items-center justify-between gap-4 w-full ${className}`}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Back Button */}
        {showBackButton && (
          <motion.button
            onClick={handleBackClick}
            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-accent transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-card-hover flex-shrink-0"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium hidden sm:inline">
              Back
            </span>
          </motion.button>
        )}

        {/* Breadcrumb Separator */}
        {showBackButton && (
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
        )}

        {/* Breadcrumb Items */}
        <nav className="flex items-center space-x-1 text-sm min-w-0" aria-label="Breadcrumb navigation">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
              )}

              {item.path ? (
                <Link
                  to={item.path}
                  className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-accent transition-colors group truncate"
                >
                  {item.icon && (
                    <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                  )}
                  <span className="font-medium group-hover:underline truncate">
                    {item.label}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center gap-1 text-gray-900 dark:text-white truncate">
                  {item.icon && (
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span className="font-semibold truncate">
                    {item.label}
                  </span>
                </div>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Compact Progress Tracker - Always visible when showProgress is true */}
      {showProgress && (
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden md:block w-px h-6 bg-gray-300 dark:bg-gray-600" />
          <CompactProgressTracker />
        </div>
      )}
    </div>
  );
};

export default SmartBreadcrumb;