import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate?: string;
  category?: string;
}

interface ModernActionCardProps {
  title: string;
  subtitle?: string;
  actions: ActionItem[];
  maxItems?: number;
  onViewAll?: () => void;
  onActionClick?: (action: ActionItem) => void;
  className?: string;
}

const ModernActionCard: React.FC<ModernActionCardProps> = ({
  title,
  subtitle,
  actions,
  maxItems = 3,
  onViewAll,
  onActionClick,
  className = ''
}) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-danger" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'low':
        return <Clock className="h-4 w-4 text-text-secondary" />;
      default:
        return <Clock className="h-4 w-4 text-text-secondary" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-danger bg-danger/5';
      case 'medium':
        return 'border-l-warning bg-warning/5';
      case 'low':
        return 'border-l-text-secondary bg-text-secondary/5';
      default:
        return 'border-l-text-secondary bg-text-secondary/5';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'danger' as const;
      case 'medium':
        return 'warning' as const;
      case 'low':
        return 'secondary' as const;
      default:
        return 'secondary' as const;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card className="p-6 modern-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-text dark:text-text">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-text-secondary dark:text-text-secondary">
                {subtitle}
              </p>
            )}
          </div>
          {onViewAll && (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewAll}
              className="text-accent border-accent hover:bg-accent/10"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {actions.slice(0, maxItems).map((action) => (
            <motion.div
              key={action.id}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
              className={`p-4 rounded-lg border-l-4 ${getPriorityColor(action.priority)} cursor-pointer transition-all duration-200 hover:shadow-md`}
              onClick={() => onActionClick?.(action)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {action.completed ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      getPriorityIcon(action.priority)
                    )}
                    <h4 className={`text-sm font-medium ${
                      action.completed 
                        ? 'line-through text-text-secondary' 
                        : 'text-text dark:text-text'
                    }`}>
                      {action.title}
                    </h4>
                    <Badge variant={getPriorityBadge(action.priority)} size="sm">
                      {action.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-secondary dark:text-text-secondary mb-2">
                    {action.description}
                  </p>
                  {action.dueDate && (
                    <p className="text-xs text-text-secondary/70 dark:text-text-secondary/70">
                      Due: {new Date(action.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {actions.length > maxItems && (
          <div className="mt-4 pt-4 border-t border-border dark:border-border">
            <p className="text-sm text-text-secondary dark:text-text-secondary text-center">
              +{actions.length - maxItems} more actions
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default ModernActionCard;