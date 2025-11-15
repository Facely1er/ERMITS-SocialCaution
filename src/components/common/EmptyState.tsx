import React from 'react';
import { motion } from 'framer-motion';
import { SearchX, FileX, AlertCircle, CheckCircle, Inbox, FolderX } from 'lucide-react';
import Button from './Button';

type IllustrationType = 'no-data' | 'search' | 'error' | 'success' | 'inbox' | 'folder';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  illustration?: IllustrationType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  illustration,
  size = 'md',
  className = ''
}) => {
  // Default icons based on illustration type
  const getDefaultIcon = () => {
    switch (illustration) {
      case 'search':
        return <SearchX className="h-16 w-16" aria-hidden="true" />;
      case 'error':
        return <AlertCircle className="h-16 w-16" aria-hidden="true" />;
      case 'success':
        return <CheckCircle className="h-16 w-16" aria-hidden="true" />;
      case 'inbox':
        return <Inbox className="h-16 w-16" aria-hidden="true" />;
      case 'folder':
        return <FolderX className="h-16 w-16" aria-hidden="true" />;
      case 'no-data':
      default:
        return <FileX className="h-16 w-16" aria-hidden="true" />;
    }
  };

  const sizeClasses = {
    sm: {
      container: 'py-8 px-4',
      icon: 'h-12 w-12',
      title: 'text-base',
      description: 'text-sm'
    },
    md: {
      container: 'py-12 px-4',
      icon: 'h-16 w-16',
      title: 'text-lg',
      description: 'text-base'
    },
    lg: {
      container: 'py-16 px-6',
      icon: 'h-20 w-20',
      title: 'text-xl',
      description: 'text-lg'
    }
  };

  const iconColors = {
    'no-data': 'text-gray-400 dark:text-gray-600',
    'search': 'text-blue-400 dark:text-blue-600',
    'error': 'text-red-400 dark:text-red-600',
    'success': 'text-green-400 dark:text-green-600',
    'inbox': 'text-purple-400 dark:text-purple-600',
    'folder': 'text-orange-400 dark:text-orange-600'
  };

  const displayIcon = icon || getDefaultIcon();
  const iconColor = illustration ? iconColors[illustration] : iconColors['no-data'];

  return (
    <motion.div
      className={`flex flex-col items-center justify-center text-center ${sizeClasses[size].container} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      role="status"
      aria-live="polite"
    >
      {/* Icon or illustration */}
      <motion.div
        className={`mb-4 ${iconColor}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      >
        {React.cloneElement(displayIcon as React.ReactElement, {
          className: `${sizeClasses[size].icon} ${iconColor}`
        })}
      </motion.div>

      {/* Title */}
      <motion.h3
        className={`font-semibold text-text dark:text-text mb-2 ${sizeClasses[size].title}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h3>

      {/* Description */}
      {description && (
        <motion.p
          className={`text-text-secondary dark:text-text-secondary max-w-md mb-6 ${sizeClasses[size].description}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {description}
        </motion.p>
      )}

      {/* Action */}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={action.onClick}
            variant={action.variant || 'primary'}
            size={size}
          >
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;
