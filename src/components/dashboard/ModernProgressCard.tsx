import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

interface ModernProgressCardProps {
  title: string;
  description?: string;
  progress: number;
  maxProgress?: number;
  icon: LucideIcon;
  color?: 'accent' | 'success' | 'warning' | 'danger';
  showPercentage?: boolean;
  className?: string;
}

const ModernProgressCard: React.FC<ModernProgressCardProps> = ({
  title,
  description,
  progress,
  maxProgress = 100,
  icon: Icon,
  color = 'accent',
  showPercentage = true,
  className = ''
}) => {
  const percentage = Math.round((progress / maxProgress) * 100);
  
  const colorClasses = {
    accent: {
      bg: 'bg-accent',
      text: 'text-accent',
      light: 'bg-accent/10',
      badge: 'accent' as const
    },
    success: {
      bg: 'bg-success',
      text: 'text-success',
      light: 'bg-success/10',
      badge: 'success' as const
    },
    warning: {
      bg: 'bg-warning',
      text: 'text-warning',
      light: 'bg-warning/10',
      badge: 'warning' as const
    },
    danger: {
      bg: 'bg-danger',
      text: 'text-danger',
      light: 'bg-danger/10',
      badge: 'danger' as const
    }
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card className="p-6 modern-card">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${colors.light}`}>
              <Icon className={`h-6 w-6 ${colors.text}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text dark:text-text">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-text-secondary dark:text-text-secondary">
                  {description}
                </p>
              )}
            </div>
          </div>
          {showPercentage && (
            <Badge variant={colors.badge}>
              {percentage}%
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary dark:text-text-secondary">
              Progress
            </span>
            <span className="font-medium text-text dark:text-text">
              {progress} / {maxProgress}
            </span>
          </div>
          
          <div className="relative">
            <div className="h-2 bg-background-secondary dark:bg-background-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${colors.bg} rounded-full`}
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ModernProgressCard;