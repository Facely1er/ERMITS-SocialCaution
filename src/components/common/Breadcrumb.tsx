import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs from path if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    pathSegments.forEach((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      
      // Format segment name (handle kebab-case)
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({ label, path });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbItems = generateBreadcrumbs();
  
  if (breadcrumbItems.length === 0) return null;
  
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center space-x-2 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      {/* Home link */}
      <Link
        to="/"
        className="flex items-center text-text-secondary dark:text-text-secondary hover:text-accent dark:hover:text-accent transition-colors"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {breadcrumbItems.length > 0 && (
        <ChevronRight className="h-4 w-4 text-text-secondary dark:text-text-secondary" />
      )}
      
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index === breadcrumbItems.length - 1 ? (
            // Current page (not clickable)
            <span className="text-text dark:text-text font-medium">
              {item.label}
            </span>
          ) : (
            <>
              <Link
                to={item.path!}
                className="text-text-secondary dark:text-text-secondary hover:text-accent dark:hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
              <ChevronRight className="h-4 w-4 text-text-secondary dark:text-text-secondary" />
            </>
          )}
        </React.Fragment>
      ))}
    </motion.nav>
  );
};

export default Breadcrumb;